# Product Requirements Document: FurniTrack Management System

## 1. Product Overview
[cite_start]FurniTrack is an integrated e-commerce platform and backend management system designed for a furniture business[cite: 1]. [cite_start]It replaces manual Google Drive and Excel workflows to eliminate data latency and human error[cite: 3, 28]. [cite_start]The system supports multi-branch operations, real-time inventory tracking[cite: 66], and specialized dashboards for sales, management, and accounting.

## 2. Technical Stack
* **Architecture**: Monorepo configuration.
* **Framework**: Next.js (React) for both the public-facing e-commerce frontend and the secure admin dashboard.
* **Package Manager**: pnpm for fast, disk-space-efficient dependency management.

---

## 3. User Roles & Access Interfaces

### Executive & Management Dashboard (Karen Alonzo / Management)
* **Risk & Growth Focus**: Interface designed for high-level oversight and risk control.
* **Real-Time Metrics**: Cards displaying daily/monthly sales, total revenue, and overall profit margins.
* [cite_start]**Inventory Health**: Dedicated section for inventory turnover and automated low-stock alerts[cite: 44, 68].
* [cite_start]**Operational Overview**: Status snapshots for pending orders, receivables, and supplier deliveries tracked via lead times[cite: 46].
* **Mobile-Optimized View**: A condensed UI for mobile access featuring a sales summary, high-value order alerts, and a profit snapshot.

### Sales & Quotation Interface (Genie Rose Gonzales / Sales Team)
* **Lead Intake Form**: Fields capturing client name, company, email, nature of business, budget, and target date.
* **Quotation Builder**: Tool to create custom quotes based on dimensions and finishes.
* [cite_start]**Inventory Inquiry Tool**: Real-time availability checks to prevent overselling[cite: 57].
* **Follow-up Tracker**: CRM-style view managing manual follow-ups and order status revisions.
* [cite_start]**Sales Data Hand-off**: System enforces the collection of complete Purchase Order (P.O.) details [cite: 30][cite_start], payment confirmation [cite: 31][cite_start], Shop Order (SOO) requests [cite: 32][cite_start], and target delivery dates, especially for rush orders[cite: 33, 72].

### Accounting & Financial Controls
* **Automated Calculation Engine**: UI elements automatically computing VAT (inclusive/exclusive), discounts, and profit margins per order.
* **Payment Tracking**: Module to log and recognize payments (Down Payment, Partial, Full) upon receipt of proof.
* **Approval Portal**: Dedicated space for management (Ma'am Twin or Ma'am Karen) to approve price overrides, discounts, and order cancellations.
* **Document Generator**: One-click generation of printable Invoices, Delivery Receipts, and Official Receipts (including VAT-exempt options).

### Inventory & Warehouse Management
* [cite_start]**Centralized Dashboard**: Real-time dashboard showing stock status [cite: 52][cite_start], replacing outdated Google Drive sheets, which are the primary cause of inventory errors[cite: 28].
* **Multi-Warehouse Toggle**: View and filter stock by specific warehouse locations.
* **Transfer Module**: Workflow for recording and tracking stock transfers between branches.
* [cite_start]**Access Control**: Only the designated Inventory Head is authorized to adjust stock levels [cite: 21] [cite_start]via an approval system[cite: 52].
* [cite_start]**Hardware Integration**: Barcode or QR code scanning for stock movement (Stock IN / Stock OUT)[cite: 50, 59, 60].
* [cite_start]**Audit & Movement Logs**: Non-negotiable logs to track all inventory changes [cite: 51] [cite_start]and ensure digital records match daily physical stock counts[cite: 37].
* [cite_start]**Quality Assurance**: Damaged items are logged for repair or modification so they can still be sold, minimizing total loss[cite: 40].

### Reporting & Analytics
* **Cash Flow View**: Primary screen for generating Cash Flow Statements.
* **Project Costing**: Detailed breakdown of costs per project (materials, labor, overhead).
* **Forecasting Module**: Visual charts for sales, inventory, and material consumption forecasting.
* [cite_start]**Performance Reports**: Dashboards generating inventory, production, and supplier performance reports[cite: 63, 71].

---

## 4. Core Business Logic & Workflows

### Stock Reservation & Deduction Rules
* [cite_start]**Quotation Stage**: Stock is strictly not reserved during the quotation stage[cite: 9].
* [cite_start]**Reservation Trigger**: Stock is reserved automatically only after order confirmation[cite: 10, 69].
* [cite_start]**Deduction Trigger**: Stock is officially deducted from the system once the Purchase Order (P.O.) has been confirmed[cite: 12, 49, 67].
* [cite_start]**Custom Items**: For non-physical stock items, the system automatically deducts the respective raw materials (boards, metal, components) from inventory[cite: 14, 62].

### Tracking & Production Status
* [cite_start]**Inventory Scope**: The system must track both raw materials (boards, metal, fabric) and finished goods[cite: 35]. [cite_start]Types managed include Available Stock, Reserved Stock, and Stock for Production[cite: 5, 6, 7].
* [cite_start]**Production Tracking**: Progress is tracked based on the Sales Order / Shop Order (SOO) and required lead time[cite: 16, 70].
* [cite_start]**WIP Status**: The SOO status determines if items are currently in production or partially completed[cite: 17].

### Order Returns & Cancellations
* [cite_start]**System Cancellations**: Cancelled orders are strictly voided within the system[cite: 23].
* [cite_start]**Return Policy Logic**: Returns are processed in the system only if the error originates from the company[cite: 24].
* [cite_start]**Return Allocation**: Accepted returned items are immediately logged back into available inventory[cite: 26].

### Automated Alerts & Notifications
* [cite_start]**Minimum Thresholds**: Each tracked material or item requires a minimum stock level configuration[cite: 42].
* [cite_start]**Low Stock Alerts**: Automatic alerts triggered when items hit minimum levels[cite: 44, 56, 68].
* [cite_start]**Insufficient Stock**: Warnings displayed when there is insufficient stock to fulfill a requested order[cite: 57].
* [cite_start]**Movement Notifications**: Alerts triggered during stock deduction [cite: 54] [cite_start]and stock adjustments[cite: 55].