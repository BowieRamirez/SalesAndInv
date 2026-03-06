import type { Order } from "@furnitrack/validators"

export const MOCK_ORDERS: Order[] = [
  // PENDING (1)
  {
    id: "order-001",
    soNumber: "SO-2026-001",
    poNumber: null,
    quotationId: "quot-005",
    clientName: "Marco dela Vega",
    status: "PENDING",
    rushOrder: false,
    deliveryDate: "2026-04-30",
    subtotal: 579000,
    vatAmount: 69480,
    total: 648480,
    createdAt: "2025-12-10T15:30:00Z",
  },
  // CONFIRMED (1) — rush order
  {
    id: "order-002",
    soNumber: "SO-2026-002",
    poNumber: "PO-2026-001",
    quotationId: "quot-006",
    clientName: "Dennis Bautista",
    status: "CONFIRMED",
    rushOrder: true,
    deliveryDate: "2026-02-28",
    subtotal: 120600,
    vatAmount: 14472,
    total: 135072,
    createdAt: "2025-10-25T09:00:00Z",
  },
  // IN_PRODUCTION (1)
  {
    id: "order-003",
    soNumber: "SO-2025-048",
    poNumber: "PO-2025-032",
    quotationId: "quot-004",
    clientName: "Sophia Villanueva",
    status: "IN_PRODUCTION",
    rushOrder: false,
    deliveryDate: "2026-03-15",
    subtotal: 364600,
    vatAmount: 43752,
    total: 408352,
    createdAt: "2025-12-05T10:00:00Z",
  },
  // DELIVERED (1)
  {
    id: "order-004",
    soNumber: "SO-2025-031",
    poNumber: "PO-2025-019",
    quotationId: "quot-006",
    clientName: "Dennis Bautista",
    status: "DELIVERED",
    rushOrder: false,
    deliveryDate: "2026-01-20",
    subtotal: 120600,
    vatAmount: 14472,
    total: 135072,
    createdAt: "2025-10-28T08:00:00Z",
  },
]
