"use client"

import React, { useState } from "react"
import { ChevronDown, ChevronRight } from "lucide-react"
import type { ReservedMaterialRow, ReservedMaterialDetailRow } from "@/app/(dashboard)/operations/page"

type Props = {
  materials: ReservedMaterialRow[]
  details: ReservedMaterialDetailRow[]
}

export function ReservedMaterialsAccordion({ materials, details }: Props) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
  const materialTotals = new Map(materials.map((material) => [material.stockItemId, material]))

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const productGroups = Array.from(
    details.reduce<Map<string, { id: string; productName: string; linkedOrderNo: string; customerName: string | null; reservationStatus: string; dateReserved: Date; materials: ReservedMaterialDetailRow[] }>>(
      (groups, detail) => {
        const productName = detail.productName || "Reserved order"
        const id = `${detail.linkedOrderNo}:${productName}:${detail.customerName ?? ""}`
        const current =
          groups.get(id) ??
          {
            id,
            productName,
            linkedOrderNo: detail.linkedOrderNo,
            customerName: detail.customerName,
            reservationStatus: detail.reservationStatus,
            dateReserved: detail.dateReserved,
            materials: [],
          }

        current.materials.push(detail)
        if (new Date(detail.dateReserved).getTime() < new Date(current.dateReserved).getTime()) {
          current.dateReserved = detail.dateReserved
        }
        groups.set(id, current)
        return groups
      },
      new Map(),
    ).values(),
  )

  return (
    <section className="rounded-xl border border-[#e5e7eb] bg-white shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-[13px]">
          <thead className="bg-[#f8fafc]">
            <tr className="border-b border-[#e5e7eb] text-[#6b7280]">
              <th className="py-3 px-4 font-medium w-[40px]"></th>
              <th className="py-3 pr-4 font-medium">Product / Order</th>
              <th className="py-3 pr-4 font-medium">Customer</th>
              <th className="py-3 pr-4 font-medium">Reservation Status</th>
              <th className="py-3 pr-4 font-medium">Date Reserved</th>
              <th className="py-3 pr-4 font-medium text-right">BOM Materials</th>
              <th className="py-3 pr-4 font-medium text-right">Reserved Units</th>
            </tr>
          </thead>
          <tbody>
            {productGroups.map((group) => {
              const isExpanded = expandedIds.has(group.id)
              const reservedUnits = group.materials.reduce((total, material) => total + material.reservedQty, 0)

              return (
                <React.Fragment key={group.id}>
                  <tr 
                    className="border-b border-[#f3f4f6] hover:bg-[#f8fafc] cursor-pointer transition-colors"
                    onClick={() => toggleExpand(group.id)}
                  >
                    <td className="py-3 px-4">
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4 text-[#6b7280]" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-[#6b7280]" />
                      )}
                    </td>
                    <td className="py-3 pr-4">
                      <p className="font-semibold text-[#111827]">{group.productName}</p>
                      <p className="mt-0.5 font-mono text-[12px] text-[#6b7280]">{group.linkedOrderNo}</p>
                    </td>
                    <td className="py-3 pr-4 text-[#4b5563]">{group.customerName || "-"}</td>
                    <td className="py-3 pr-4">
                      <span className="inline-flex rounded-full bg-[#f1f5f9] px-2.5 py-1 text-[11px] font-medium text-[#475569]">
                        {group.reservationStatus.replaceAll("_", " ")}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-[#6b7280]">{new Date(group.dateReserved).toLocaleDateString()}</td>
                    <td className="py-3 pr-4 text-right font-medium text-[#111827]">{group.materials.length}</td>
                    <td className="py-3 pr-4 text-right font-semibold text-[#dc2626]">{reservedUnits}</td>
                  </tr>
                  {isExpanded && (
                    <tr className="border-b border-[#e5e7eb] bg-[#fafafa]">
                      <td colSpan={7} className="p-0">
                        <div className="p-6 border-l-4 border-l-[#3b82f6]">
                          <p className="text-[12px] uppercase tracking-wide text-[#6b7280] mb-4">Bill of materials reserved for this product</p>
                          <div className="overflow-hidden rounded-xl border border-[#e5e7eb] bg-white">
                            <table className="min-w-full text-left text-[12px]">
                              <thead className="bg-[#f8fafc]">
                                <tr className="border-b border-[#e5e7eb] text-[#6b7280]">
                                  <th className="py-2.5 px-4 font-medium">Material SKU</th>
                                  <th className="py-2.5 pr-4 font-medium">Material Name</th>
                                  <th className="py-2.5 pr-4 font-medium">Warehouse / Location</th>
                                  <th className="py-2.5 pr-4 font-medium text-right">Total Stock</th>
                                  <th className="py-2.5 pr-4 font-medium text-right">Available Qty</th>
                                  <th className="py-2.5 pr-4 font-medium text-right">Reserved Qty</th>
                                </tr>
                              </thead>
                              <tbody>
                                {group.materials.map((detail) => {
                                  const stock = materialTotals.get(detail.stockItemId)
                                  const availableQty = stock?.availableQty ?? 0
                                  const totalStock = availableQty + (stock?.reservedQty ?? detail.reservedQty)

                                  return (
                                    <tr key={`${detail.eventId}:${detail.stockItemId}`} className="border-b border-[#f3f4f6] last:border-b-0">
                                      <td className="py-2.5 px-4 font-mono text-[#111827]">{detail.sku}</td>
                                      <td className="py-2.5 pr-4 font-medium text-[#111827]">{detail.itemName}</td>
                                      <td className="py-2.5 pr-4 text-[#4b5563]">{detail.warehouseName}</td>
                                      <td className="py-2.5 pr-4 text-right text-[#111827]">
                                        {totalStock} {detail.unitOfMeasure}
                                      </td>
                                      <td className="py-2.5 pr-4 text-right font-medium text-[#16a34a]">
                                        {availableQty} {detail.unitOfMeasure}
                                      </td>
                                      <td className="py-2.5 pr-4 text-right font-semibold text-[#dc2626]">
                                        {detail.reservedQty} {detail.unitOfMeasure}
                                      </td>
                                    </tr>
                                  )
                                })}
                                {group.materials.length === 0 && (
                                  <tr>
                                    <td colSpan={6} className="py-4 text-center text-[#6b7280]">No reserved materials found.</td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}
