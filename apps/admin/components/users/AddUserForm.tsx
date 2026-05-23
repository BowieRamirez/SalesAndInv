"use client"

import { useState } from "react"

type RoleOption = {
  value: string
  label: string
}

type Field = {
  label: string
  name: string
  type?: string
  placeholder?: string
  required?: boolean
}

const FIELDS: Field[] = [
  { label: "Full name", name: "name", placeholder: "Jane Dela Cruz", required: true },
  { label: "Email", name: "email", type: "email", placeholder: "staff@sims.com", required: true },
  { label: "Temporary password", name: "password", type: "password", placeholder: "Min. 8 characters", required: true },
]

export function AddUserForm({ roles }: { roles: RoleOption[] }) {
  const [selectedRole, setSelectedRole] = useState("SALES")

  return (
    <form
      method="post"
      action="/api/admin/accounts/create"
      className="flex flex-col gap-5"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {FIELDS.map((field) => (
          <div
            key={field.name}
            className={`flex flex-col gap-1.5 ${field.name === "password" ? "sm:col-span-2" : ""}`}
          >
            <label className="text-[12px] font-medium text-slate-700">{field.label}</label>
            <input
              name={field.name}
              type={field.type ?? "text"}
              placeholder={field.placeholder}
              required={field.required}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-[13px] text-slate-900 outline-none transition-colors focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
            />
          </div>
        ))}

        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label className="text-[12px] font-medium text-slate-700">Role</label>
          <select
            name="role"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-[13px] text-slate-900 outline-none transition-colors focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
          >
            {roles.map((role) => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedRole === "CUSTOM" && (
        <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Custom Admin Permissions
          </p>
          <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2 text-[13px] text-slate-700">
            <div>
              <p className="mb-2 text-[11px] font-bold text-slate-400">SALES PAGES</p>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="tab_lead" className="rounded border-slate-300 w-4 h-4" />
                  <span className="select-none">Dashboard (Lead)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="tab_sales_approvals" className="rounded border-slate-300 w-4 h-4" />
                  <span className="select-none">Approvals</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="tab_returns" className="rounded border-slate-300 w-4 h-4" />
                  <span className="select-none">Returns</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="tab_orders" className="rounded border-slate-300 w-4 h-4" />
                  <span className="select-none">Sales Orders</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="tab_chats" className="rounded border-slate-300 w-4 h-4" />
                  <span className="select-none">Order Chats</span>
                </label>
              </div>
            </div>

            <div>
              <p className="mb-2 text-[11px] font-bold text-slate-400">PRODUCTS & WAREHOUSE</p>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="tab_finished-products" className="rounded border-slate-300 w-4 h-4" />
                  <span className="select-none">Finished Products</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="tab_locations" className="rounded border-slate-300 w-4 h-4" />
                  <span className="select-none">Warehouse Locations</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="tab_all-stocks" className="rounded border-slate-300 w-4 h-4" />
                  <span className="select-none">All Stocks</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="tab_reserved" className="rounded border-slate-300 w-4 h-4" />
                  <span className="select-none">Reserved Materials</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="tab_damaged-materials" className="rounded border-slate-300 w-4 h-4" />
                  <span className="select-none">Damaged Materials</span>
                </label>
              </div>
            </div>

            <div className="sm:col-span-2">
              <p className="mb-2 text-[11px] font-bold text-slate-400">APPROVALS & DELIVERY</p>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="tab_inv-approvals" className="rounded border-slate-300 w-4 h-4" />
                  <span className="select-none">Inventory Approvals</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="tab_ops_approvals" className="rounded border-slate-300 w-4 h-4" />
                  <span className="select-none">Approvals</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="tab_delivery" className="rounded border-slate-300 w-4 h-4" />
                  <span className="select-none">Delivery Schedule</span>
                </label>
                <label className="flex items-center gap-2 text-slate-400 cursor-not-allowed" title="Always included">
                  <input type="checkbox" disabled checked className="rounded border-slate-300 w-4 h-4" />
                  <span className="select-none">Audit Logs (Always)</span>
                </label>
              </div>
            </div>
          </div>
          <p className="mt-3 text-[11px] text-slate-500">
            Leave checked to grant access. Uncheck to restrict.
          </p>
        </div>
      )}

      <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-5 py-2.5 text-[13px] font-medium text-white transition-colors hover:bg-slate-800"
        >
          Add account
        </button>
      </div>
    </form>
  )
}
