"use client"

import { useState } from "react"

type RoleOption = {
  value: string
  label: string
}

export function AddUserForm({ roles }: { roles: RoleOption[] }) {
  const [selectedRole, setSelectedRole] = useState("SALES")

  return (
    <form
      method="post"
      action="/api/admin/accounts/create"
      className="grid gap-3 lg:grid-cols-[1.2fr_1.2fr_1fr_1fr_auto]"
    >
      <input
        name="name"
        placeholder="Full name"
        className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-[13px] text-slate-900 outline-none focus:border-slate-400"
        required
      />
      <input
        name="email"
        type="email"
        placeholder="staff@sims.com"
        className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-[13px] text-slate-900 outline-none focus:border-slate-400"
        required
      />
      <input
        name="password"
        type="password"
        placeholder="Temporary password"
        className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-[13px] text-slate-900 outline-none focus:border-slate-400"
        required
      />
      <select
        name="role"
        value={selectedRole}
        onChange={(e) => setSelectedRole(e.target.value)}
        className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-[13px] text-slate-900 outline-none focus:border-slate-400"
      >
        {roles.map((role) => (
          <option key={role.value} value={role.value}>
            {role.label}
          </option>
        ))}
      </select>
      <button
        type="submit"
        className="rounded-lg bg-slate-900 px-5 py-2.5 text-[13px] font-medium text-white transition-colors hover:bg-slate-800"
      >
        Add account
      </button>

      {selectedRole === "CUSTOM" && (
        <div className="col-span-full mt-2 pt-3 border-t border-slate-100">
          <p className="mb-3 text-[12px] font-semibold uppercase tracking-wider text-slate-500">
            Select Custom Admin Permissions
          </p>
          <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3 text-[13px] text-slate-700">
            
            {/* Sales Permissions */}
            <div>
              <p className="mb-2 text-[11px] font-bold text-slate-400">SALES PAGES</p>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2">
                  <input type="checkbox" name="tab_lead" className="rounded border-slate-300 w-4 h-4" />
                  Dashboard (Lead)
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" name="tab_sales_approvals" className="rounded border-slate-300 w-4 h-4" />
                  Approvals
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" name="tab_returns" className="rounded border-slate-300 w-4 h-4" />
                  Returns
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" name="tab_orders" className="rounded border-slate-300 w-4 h-4" />
                  Sales Orders
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" name="tab_chats" className="rounded border-slate-300 w-4 h-4" />
                  Order Chats
                </label>
              </div>
            </div>

            {/* Operations - Products & Warehouse */}
            <div>
              <p className="mb-2 text-[11px] font-bold text-slate-400">OPERATIONS - PRODUCTS & WAREHOUSE</p>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2">
                  <input type="checkbox" name="tab_finished-products" className="rounded border-slate-300 w-4 h-4" />
                  Finished Products
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" name="tab_locations" className="rounded border-slate-300 w-4 h-4" />
                  Warehouse Locations
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" name="tab_all-stocks" className="rounded border-slate-300 w-4 h-4" />
                  All Stocks
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" name="tab_reserved" className="rounded border-slate-300 w-4 h-4" />
                  Reserved Materials
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" name="tab_damaged-materials" className="rounded border-slate-300 w-4 h-4" />
                  Damaged Materials
                </label>
              </div>
            </div>

            {/* Operations - Approvals & Delivery */}
            <div>
              <p className="mb-2 text-[11px] font-bold text-slate-400">OPERATIONS - APPROVALS & DELIVERY</p>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2">
                  <input type="checkbox" name="tab_inv-approvals" className="rounded border-slate-300 w-4 h-4" />
                  Inventory Approvals
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" name="tab_ops_approvals" className="rounded border-slate-300 w-4 h-4" />
                  Approvals
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" name="tab_delivery" className="rounded border-slate-300 w-4 h-4" />
                  Delivery Schedule
                </label>
                <label className="flex items-center gap-2 text-slate-400" title="Always included">
                  <input type="checkbox" disabled checked className="rounded border-slate-300 w-4 h-4" />
                  Audit Logs (Always Included)
                </label>
              </div>
            </div>

          </div>
        </div>
      )}
    </form>
  )
}
