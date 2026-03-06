import type { User } from "@furnitrack/validators"

export const DEMO_USERS: User[] = [
  { id: "user-001", name: "Karen Alonzo", email: "karen@furnitrack.com", role: "MANAGEMENT", branchId: "wh-001" },
  { id: "user-002", name: "Genie Rose Gonzales", email: "genie@furnitrack.com", role: "SALES", branchId: "wh-001" },
  { id: "user-003", name: "Maria Santos", email: "maria@furnitrack.com", role: "ACCOUNTING", branchId: "wh-001" },
  { id: "user-004", name: "Juan Reyes", email: "juan@furnitrack.com", role: "INVENTORY", branchId: "wh-001" },
  { id: "user-005", name: "Admin User", email: "admin@furnitrack.com", role: "ADMIN", branchId: "wh-001" },
]
