import type { Warehouse } from "@furnitrack/validators"

export const MOCK_WAREHOUSES: Warehouse[] = [
  { id: "wh-001", name: "Main Warehouse", branchCode: "MNL", address: "123 Industrial Ave, Manila" },
  { id: "wh-002", name: "Cebu Branch", branchCode: "CEB", address: "45 Pier Road, Cebu City" },
  { id: "wh-003", name: "Davao Branch", branchCode: "DAV", address: "78 Warehouse St, Davao City" },
]
