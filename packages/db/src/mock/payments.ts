import type { Payment } from "@furnitrack/validators"

export const MOCK_PAYMENTS: Payment[] = [
  // DOWN_PAYMENT - CONFIRMED
  {
    id: "pay-001",
    orderId: "order-001",
    type: "DOWN_PAYMENT",
    amount: 194544,
    status: "CONFIRMED",
    proofUrl: "/uploads/proof-pay-001.jpg",
    date: "2025-12-12",
  },
  // DOWN_PAYMENT - PENDING
  {
    id: "pay-002",
    orderId: "order-003",
    type: "DOWN_PAYMENT",
    amount: 122505.6,
    status: "PENDING",
    proofUrl: null,
    date: "2025-12-08",
  },
  // PARTIAL - CONFIRMED
  {
    id: "pay-003",
    orderId: "order-002",
    type: "PARTIAL",
    amount: 67536,
    status: "CONFIRMED",
    proofUrl: "/uploads/proof-pay-003.jpg",
    date: "2025-11-01",
  },
  // FULL - PENDING
  {
    id: "pay-004",
    orderId: "order-004",
    type: "FULL",
    amount: 135072,
    status: "PENDING",
    proofUrl: null,
    date: "2026-01-18",
  },
]
