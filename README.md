# GearUp — Sports Gear Rental Platform (API)

Welcome to the backend engine of **GearUp**, a high-performance, secure, and production-ready Sports Gear Rental platform API. This application handles everything from role-based equipment listing to seamless payment automated lifecycles.

---

## Project Overview

GearUp provides a scalable RESTful architecture designed to bridge the gap between sports clubs/athletes and gear providers. Built on top of Node.js, Express, and PostgreSQL, the system is engineered around a custom-compiled **Prisma** multi-schema layer utilizing native database drivers. 

The core business problem this API solves is preventing inventory fragmentation, managing double-booking conflicts, and enforcing automated financial trust boundaries through modern third-party ledger checkouts.

---

## 🚀 Key Features

### 👤 User & Auth Management
- **Role-Based Access Control (RBAC):** Strict router guards for `ADMIN`, `PROVIDER`, and `CUSTOMER`.
- **Secure Authentication:** JWT-based login/registration with fully encrypted passwords using `bcryptjs`.

### 🎒 Sports Gear Catalog
- **Advanced Filtering & Pagination:** High-speed product retrieval optimized with dynamic Prisma sorting.
- **Provider Ownership:** Gear items are locked to their respective suppliers for secure inventory tracking.

### 💳 Order & Payment Lifecycle
- **SSLCOMMERZ Integration:** Real-world payment flow using the official SSLCommerz sandbox ecosystem.
- **Automated Webhooks:** Secure callback lifecycle (`/success`, `/fail`, `/cancel`) to instantly update order and transaction states within a single Prisma Transaction block.

### 📊 Admin Dashboard & Metrics
- **Aggregated Analytics:** Singular-endpoint statistics (`/api/dashboard/metrics`) delivering total revenue, user counts, inventory status, and historical logs.
- **Review System:** Customers can leave ratings (1-5) and comments only on products they have verified payment history for.

---

### Seeding Default Credentials

After successfully running the seed command, you can instantly authenticate using these accounts:

Run seed file: npm run seed

| Role | Email | Password |
| :--- | :--- | :--- |
| **ADMIN** | `milonchandro35@gmail.com` | `22422242#` |
| **PROVIDER** | `provider@gmail.com` | `password123` |
| **CUSTOMER** | `customer@gmail.com` | `password123` |


## Setup

Follow these exact steps to clone, configure, and boot the application locally:

### 1. Installation & Environment Configuration
Clone the repository and install the production dependencies:
```bash
git clone (https://github.com/milonroy26/GearUp-B7A4.git)
cd GearUp-B7A4
npm install