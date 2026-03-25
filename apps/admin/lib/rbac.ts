export const APP_ROLES = [
  "ADMIN_MANAGEMENT",
  "SALES",
  "INVENTORY",
  "ACCOUNTING",
  "OPERATIONS_DESIGN",
  "CLIENT",
] as const

export type AppRole = (typeof APP_ROLES)[number]

const LEGACY_ROLE_ALIASES: Record<string, AppRole> = {
  ADMIN: "ADMIN_MANAGEMENT",
  ANALYTICS: "ADMIN_MANAGEMENT",
}

export function normalizeAppRole(role?: string | null): AppRole {
  const normalized = role?.trim().toUpperCase()

  if (!normalized) {
    return "ADMIN_MANAGEMENT"
  }

  if ((APP_ROLES as readonly string[]).includes(normalized)) {
    return normalized as AppRole
  }

  return LEGACY_ROLE_ALIASES[normalized] ?? "ADMIN_MANAGEMENT"
}

export const ROLE_REDIRECT: Record<AppRole, string> = {
  ADMIN_MANAGEMENT: "/",
  SALES: "/sales",
  INVENTORY: "/inventory",
  ACCOUNTING: "/accounting",
  OPERATIONS_DESIGN: "/operations",
  CLIENT: "/",
}

export const ROLE_LABELS: Record<AppRole, string> = {
  ADMIN_MANAGEMENT: "Admin / Management",
  SALES: "Sales",
  INVENTORY: "Inventory",
  ACCOUNTING: "Accounting",
  OPERATIONS_DESIGN: "Operations / Design",
  CLIENT: "Client",
}

export const ROLE_PERMISSION_MATRIX: Record<AppRole, string[]> = {
  ADMIN_MANAGEMENT: [
    "users.manage",
    "roles.assign",
    "clients.manage",
    "companies.assign_code",
    "reports.view_all",
    "audit_logs.view",
  ],
  SALES: [
    "quotations.create",
    "quotations.approve_internal",
    "sales_orders.create",
    "inventory.view_stock",
    "stock_requests.submit",
    "design_requests.submit",
    "payments.submit_to_accounting",
  ],
  INVENTORY: [
    "inventory_items.manage",
    "stock_movements.manage",
    "stock_requests.approve",
    "stock_thresholds.manage",
    "stock_deductions.print",
  ],
  ACCOUNTING: [
    "quotations.view_billing_basis",
    "payments.record",
    "payments.verify",
    "payments.finalize",
    "balances.view",
  ],
  OPERATIONS_DESIGN: [
    "design_requests.manage",
    "design_assets.upload",
    "deliveries.schedule",
    "transactions.confirm_company_code",
    "client_visibility.manage",
  ],
  CLIENT: [
    "portal.view_own_records",
    "portal.approve_quotation",
    "portal.approve_sales_order_outline",
  ],
}

export function canAccessCompanyScopedRecord(params: {
  role: AppRole
  userCompanyCode?: string | null
  transactionCompanyCode?: string | null
}) {
  if (params.role !== "CLIENT") {
    return true
  }

  return Boolean(
    params.userCompanyCode &&
      params.transactionCompanyCode &&
      params.userCompanyCode === params.transactionCompanyCode,
  )
}
