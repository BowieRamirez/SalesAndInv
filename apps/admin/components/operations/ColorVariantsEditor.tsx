"use client"

import { useEffect, useState } from "react"
import { Plus, Trash2 } from "lucide-react"

export type ColorVariantValue = {
  key: number
  name: string
  hex: string
  sku: string
}

let keyCounter = 0
function makeRow(partial?: Partial<Omit<ColorVariantValue, "key">>): ColorVariantValue {
  return {
    key: ++keyCounter,
    name: partial?.name ?? "",
    hex: partial?.hex ?? "#c9a96e",
    sku: partial?.sku ?? "",
  }
}

type Props = {
  /** Initial variants to render. */
  defaultValue?: Array<{ name: string; hex: string; sku: string }>
  /** The product's main SKU — variants must not match it. */
  productMainSku?: string | null
  /** Auto-generate variant SKUs as `${productMainSku}-${slug(name)}` when blank. */
  autoSkuFromName?: boolean
}

export function ColorVariantsEditor({ defaultValue, productMainSku, autoSkuFromName = true }: Props) {
  const [rows, setRows] = useState<ColorVariantValue[]>(
    () => (defaultValue ?? []).map((v) => makeRow(v))
  )
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Live-validate within the editor — the server still re-validates on submit.
    const seen = new Map<string, number>()
    let nextError: string | null = null
    rows.forEach((row, index) => {
      const sku = row.sku.trim().toLowerCase()
      if (!sku) return
      if (productMainSku && sku === productMainSku.trim().toLowerCase()) {
        nextError = `Variant #${index + 1} SKU "${row.sku}" matches the product's main SKU.`
        return
      }
      if (seen.has(sku)) {
        nextError = `Variant SKU "${row.sku}" is duplicated. Each variant SKU must be unique.`
        return
      }
      seen.set(sku, index)
    })
    setError(nextError)
  }, [rows, productMainSku])

  function updateRow(key: number, field: keyof Omit<ColorVariantValue, "key">, value: string) {
    setRows((prev) =>
      prev.map((row) => {
        if (row.key !== key) return row
        const next = { ...row, [field]: value }
        // When user types a name and SKU is blank, auto-suggest a SKU based on the product main SKU
        if (field === "name" && autoSkuFromName && !row.sku && productMainSku) {
          const slug = value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
          if (slug) next.sku = `${productMainSku}-${slug}`
        }
        return next
      }),
    )
  }

  function addRow() {
    setRows((prev) => [...prev, makeRow()])
  }

  function removeRow(key: number) {
    setRows((prev) => prev.filter((row) => row.key !== key))
  }

  return (
    <div className="grid gap-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[13px] font-semibold text-[#475569]">Color variations (optional)</p>
          <p className="mt-0.5 text-[11px] text-[#94a3b8]">
            Add additional color options. Each variant must have a unique SKU different from the product's main SKU.
          </p>
        </div>
        <button
          type="button"
          onClick={addRow}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#0f172a] px-3 py-1.5 text-[12px] font-medium text-white transition-colors hover:bg-[#1e293b]"
        >
          <Plus className="h-3.5 w-3.5" />
          Add color
        </button>
      </div>

      {productMainSku ? (
        <p className="rounded-lg bg-[#f1f5f9] px-3 py-2 text-[11px] text-[#475569]">
          Product main SKU: <span className="font-mono font-semibold">{productMainSku}</span>
        </p>
      ) : null}

      {rows.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#cbd5e1] bg-[#f8fafc] px-4 py-6 text-center text-[12px] text-[#64748b]">
          No color variants yet. Click <span className="font-semibold">Add color</span> to add one.
        </div>
      ) : (
        <div className="space-y-2">
          {rows.map((row, index) => (
            <div
              key={row.key}
              className="grid gap-2 rounded-xl border border-[#e2e8f0] bg-[#fbfdff] p-3 sm:grid-cols-[auto_1fr_auto_1.5fr_auto]"
            >
              <span className="self-center px-1 text-[11px] font-semibold text-[#94a3b8]">#{index + 1}</span>

              <label className="grid gap-1">
                <span className="text-[10px] font-semibold uppercase tracking-wide text-[#94a3b8]">Color name</span>
                <input
                  name="colorName"
                  value={row.name}
                  onChange={(e) => updateRow(row.key, "name", e.target.value)}
                  placeholder="e.g. Walnut"
                  className="rounded-md border border-[#cbd5e1] bg-white px-2.5 py-1.5 text-[13px] outline-none focus:border-[#0f172a]"
                />
              </label>

              <label className="grid gap-1">
                <span className="text-[10px] font-semibold uppercase tracking-wide text-[#94a3b8]">Hex</span>
                <div className="flex items-center gap-1.5">
                  <input
                    type="color"
                    value={row.hex}
                    onChange={(e) => updateRow(row.key, "hex", e.target.value)}
                    className="h-[34px] w-[40px] cursor-pointer rounded-md border border-[#cbd5e1] bg-white"
                  />
                  <input
                    name="colorHex"
                    value={row.hex}
                    onChange={(e) => updateRow(row.key, "hex", e.target.value)}
                    placeholder="#c9a96e"
                    pattern="^#[0-9a-fA-F]{6}$"
                    className="w-[90px] rounded-md border border-[#cbd5e1] bg-white px-2 py-1.5 font-mono text-[12px] outline-none focus:border-[#0f172a]"
                  />
                </div>
              </label>

              <label className="grid gap-1">
                <span className="text-[10px] font-semibold uppercase tracking-wide text-[#94a3b8]">Variant SKU</span>
                <input
                  name="colorSku"
                  value={row.sku}
                  onChange={(e) => updateRow(row.key, "sku", e.target.value)}
                  placeholder={productMainSku ? `${productMainSku}-WALNUT` : "Unique SKU"}
                  className="rounded-md border border-[#cbd5e1] bg-white px-2.5 py-1.5 font-mono text-[12px] outline-none focus:border-[#0f172a]"
                />
              </label>

              <button
                type="button"
                onClick={() => removeRow(row.key)}
                className="self-end rounded-md border border-[#fecaca] bg-white p-1.5 text-[#dc2626] transition-colors hover:bg-[#fef2f2]"
                title="Remove this variant"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {error ? (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-[12px] text-amber-700">
          {error}
        </p>
      ) : null}
    </div>
  )
}
