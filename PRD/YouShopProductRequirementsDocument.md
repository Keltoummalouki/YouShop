# YouShop - Product Requirements Document (PRD)

**Document Version** : 1.0  
**Last Updated** : December 21, 2025  
**Author** : Ayoub Mashate  
**Status** : In Development  
**Project Timeline** : 22/12/2025 - 02/01/2026 (10 days)

---

## 📋 Executive Summary

YouShop is a high-performance, scalable e-commerce backend platform built with NestJS that orchestrates modern e-commerce operations. The system centralizes product catalog management, rigorous stock tracking (SKU-based), automated order lifecycle management, and robust security through advanced authentication mechanisms.

**Key Objectives** :
- Build a modular, production-ready backend architecture
- Implement comprehensive security with JWT authentication and role-based access control
- Automate inventory management with real-time stock reservation
- Ensure data integrity through strict validation and atomic transactions
- Achieve 70% test coverage with critical business logic tested
- Enable seamless scalability toward microservices architecture

---

## 🎯 Product Vision

### Mission Statement
To provide a robust, scalable, and secure backend platform that enables e-commerce businesses to efficiently manage their entire digital operations—from product cataloging to order fulfillment—while maintaining data integrity and customer trust.

### Success Criteria
1. ✅ All critical workflows functional and tested (Auth, Catalog, Inventory, Orders)
2. ✅ 70% test coverage with zero `any` types in TypeScript
3. ✅ CI/CD pipeline green at submission (GitHub Actions)
4. ✅ Docker containerization fully operational
5. ✅ Swagger API documentation complete and accessible
6. ✅ Performance: Response time < 500ms for all endpoints
7. ✅ Security: Zero known vulnerabilities, proper authentication/authorization

---

## 👥 User Personas

### 1. Visitor (Unauthenticated User)
**Profile** : Potential customer exploring the e-commerce platform  
**Goals** :
- Discover available products without account creation
- Filter and search products efficiently
- View detailed product information
- Check product availability

**Pain Points** :
- Want quick browsing without account friction
- Need fast search and filtering
- Want to see real-time stock availability

**Key Needs** :
- Public catalog access
- Advanced filtering (category, price range)
- Product search functionality
- Stock visibility

---

### 2. Client (Authenticated Customer)
**Profile** : Registered customer making purchases  
**Goals** :
- Create secure account with password protection
- Browse and purchase products securely
- Track order status and history
- Manage personal order information

**Pain Points** :
- Want secure transactions
- Need to track purchases
- Want clear order confirmations
- Need ability to cancel orders if needed

**Key Needs** :
- Secure registration and login
- Order creation with real-time stock reservation
- Order history and tracking
- Price transparency (including taxes)
- Order cancellation capability

---

### 3. Admin (Catalog Manager)
**Profile** : Staff member managing products and inventory  
**Goals** :
- Maintain product catalog (add, edit, delete)
- Monitor and update stock levels
- Track inventory levels
- Identify stock shortages proactively

**Pain Points** :
- Need quick inventory updates
- Must prevent stock inconsistencies
- Want visibility into low-stock products
- Need reliable audit trails

**Key Needs** :
- Full product CRUD operations
- SKU-based stock management
- Real-time inventory visibility
- Low-stock alerts
- Activity logging

---

### 4. System (Automated Processes)
**Profile** : Internal automated operations  
**Goals** :
- Automatically reserve stock on order creation
- Release reserved stock on order cancellation
- Maintain inventory consistency
- Calculate accurate pricing

**Pain Points** :
- Race conditions in concurrent orders
- Stock overselling risks
- Pricing calculation errors
- Data inconsistency

**Key Needs** :
- Atomic transactions
- Event-driven architecture
- Reliable state management
- Automatic price calculation

---

## 📊 Market Analysis & Competitive Positioning

### Market Context
E-commerce platforms require robust backend infrastructure to handle:
- High concurrent user loads
- Complex inventory management
- Secure payment processing
- Real-time order management

### Competitive Advantages of YouShop
1. **Modular Architecture** : Easy to extend and maintain
2. **Type Safety** : Full TypeScript implementation
3. **Scalability** : Microservices-ready architecture
4. **Security** : JWT + Bcrypt + Role-Based Access Control
5. **Testing** : 70% coverage with Jest + Supertest
6. **Documentation** : Complete Swagger API docs
7. **DevOps Ready** : Docker + GitHub Actions CI/CD

### Target Market
- Startups building e-commerce platforms
- Mid-sized businesses needing scalable backend
- Educational institutions teaching backend development
- Enterprise customers requiring customizable e-commerce solutions

---

## ✨ Feature Overview

### 🔐 Authentication & Security (EPIC 2)

#### Feature 2.1: User Registration
**Description** : Secure account creation with email and password  
**User Story** : "As a visitor, I want to create a secure account with hashed password to access the platform."

**Requirements** :
- POST `/auth/register` endpoint
- Email uniqueness validation
- Password hashing with Bcrypt (10 rounds minimum)
- Input validation via class-validator
- HTTP 201 Created response
- Duplicate email prevention (HTTP 409 Conflict)
- Account created with CLIENT role by default

**Acceptance Criteria** :
- ✅ Valid registration data creates account
- ✅ Invalid data returns 400 Bad Request
- ✅ Duplicate email returns 409 Conflict
- ✅ Password never stored in plain text
- ✅ Response contains userId and email (no password)

**Technical Specifications** :
```
Endpoint: POST /auth/register
Input: RegisterDto {
  email: string (RFC 5322 format)
  password: string (min 8 chars, 1 uppercase, 1 number, 1 special)
  firstName: string
  lastName: string
}
Output: {
  userId: UUID
  email: string
  role: 'CLIENT'
  createdAt: ISO8601
}
Error Codes: 400, 409
```

---

#### Feature 2.2: User Login
**Description** : Authenticate users and issue JWT tokens  
**User Story** : "As a customer, I want to login with email/password to receive a JWT token for API access."

**Requirements** :
- POST `/auth/login` endpoint
- Credential validation (email + password)
- JWT token generation with user metadata
- Token includes userId and role
- Token expiration: 3600 seconds (1 hour)
- HTTP 200 OK on success
- HTTP 401 Unauthorized on invalid credentials

**Acceptance Criteria** :
- ✅ Valid credentials return JWT token
- ✅ Invalid credentials return 401
- ✅ Token contains sub (userId), email, role claims
- ✅ Token verifiable and non-forgeable
- ✅ Token expiration enforced by API

**Technical Specifications** :
```
Endpoint: POST /auth/login
Input: LoginDto {
  email: string
  password: string
}
Output: {
  accessToken: string (JWT)
  expiresIn: number (3600)
  tokenType: 'Bearer'
}
Error Codes: 401
JWT Payload: {
  sub: userId,
  email: string,
  role: 'ADMIN' | 'CLIENT',
  iat: number,
  exp: number
}
```

---

#### Feature 2.3: Role-Based Access Control (RBAC)
**Description** : Implement role-based authorization on protected routes  
**User Story** : "As an admin, I want role-based access control so only authorized users can access admin routes."

**Requirements** :
- Two roles: ADMIN and CLIENT
- RoleGuard implementation in NestJS
- Route-level access control via @Roles() decorator
- Admin-only routes: product management, stock management, order management
- Client-only routes: order creation, order history
- Public routes: product browsing
- HTTP 403 Forbidden for unauthorized access

**Acceptance Criteria** :
- ✅ ADMIN role accesses admin routes
- ✅ CLIENT role denied on admin routes (403)
- ✅ Unauthenticated users denied on protected routes (401)
- ✅ Role stored in JWT token
- ✅ Guards applied consistently across all endpoints

**Technical Specifications** :
```
Role Enum: 'ADMIN' | 'CLIENT'
Protected Routes:
  - POST /products [ADMIN]
  - PUT /products/:id [ADMIN]
  - DELETE /products/:id [ADMIN]
  - PUT /inventory/update-stock [ADMIN]
  - GET /admin/orders [ADMIN]
  
Client Routes:
  - POST /orders [CLIENT or AUTHENTICATED]
  - GET /orders [CLIENT]
  - PUT /orders/:id/cancel [CLIENT]
  
Public Routes:
  - GET /products
  - GET /products/:id
  - GET /products/search
  - POST /auth/register
  - POST /auth/login
```

---

### 📦 Product Catalog (EPIC 3)

#### Feature 3.1: Product CRUD (Create, Read, Update, Delete)
**Description** : Complete product management for administrators  
**User Story** : "As an admin, I want full product CRUD operations to maintain the catalog."

**Requirements** :
- POST `/products` - Create product
- GET `/products/:id` - Retrieve single product
- PUT `/products/:id` - Update product
- DELETE `/products/:id` - Soft delete product
- Strict input validation
- Admin-only access
- Comprehensive error handling

**Product Model** :
```
Product {
  id: UUID (primary key)
  name: string (required, 1-255 chars)
  description: Text (optional)
  price: Decimal (required, > 0, 2 decimal places)
  category: string (required)
  sku: string (required, unique)
  imageUrl: string (optional, URL format)
  isActive: boolean (default: true)
  createdAt: DateTime
  updatedAt: DateTime
  stock: Stock (1:1 relation)
  orderItems: OrderItem[] (1:many)
}
```

**Acceptance Criteria** :
- ✅ Valid product data creates record
- ✅ Invalid data returns 400 Bad Request
- ✅ Duplicate SKU returns 409 Conflict
- ✅ Non-existent product returns 404
- ✅ Only ADMIN role can create/update/delete
- ✅ All fields properly validated

**Technical Specifications** :
```
Endpoint: POST /products [ADMIN]
Input: CreateProductDto {
  name: string (required)
  description: string (optional)
  price: number (required, > 0)
  category: string (required)
  sku: string (required, unique)
  imageUrl: string (optional)
}
Output: Product + Stock relation

Endpoint: PUT /products/:id [ADMIN]
Input: UpdateProductDto (same fields, all optional)
Output: Updated Product

Endpoint: DELETE /products/:id [ADMIN]
Output: { success: true, message: string }
```

---

#### Feature 3.2: Product Browsing (Public Catalog)
**Description** : View all products with pagination  
**User Story** : "As a visitor, I want to browse paginated products without authentication."

**Requirements** :
- GET `/products` endpoint
- Pagination: page and limit parameters
- Default: page=1, limit=10
- Max limit=100
- Fast response (< 100ms target)
- No authentication required
- Return total count for UI pagination

**Acceptance Criteria** :
- ✅ Returns paginated product list
- ✅ Includes total count
- ✅ Respects page and limit parameters
- ✅ Performance < 100ms
- ✅ Valid JSON structure
- ✅ Handles empty results gracefully

**Technical Specifications** :
```
Endpoint: GET /products?page=1&limit=10
Query Parameters:
  - page: number (default: 1, min: 1)
  - limit: number (default: 10, max: 100)
Output: {
  data: Product[],
  total: number,
  page: number,
  limit: number,
  totalPages: number
}
```

---

#### Feature 3.3: Product Filtering & Search
**Description** : Filter products by category, price, and search by name  
**User Story** : "As a visitor, I want to filter products to find what interests me quickly."

**Requirements** :
- Filter by category (exact match)
- Filter by price range (minPrice, maxPrice)
- Search by product name (ILIKE)
- Combine multiple filters
- Pagination with filters
- Sorted results

**Acceptance Criteria** :
- ✅ Category filter works correctly
- ✅ Price range filtering accurate
- ✅ Search returns relevant results
- ✅ Multiple filters combinable
- ✅ Results properly sorted
- ✅ Performance remains optimal

**Technical Specifications** :
```
Endpoint: GET /products/search?search=laptop&category=electronics&minPrice=500&maxPrice=1500&page=1&limit=10
Query Parameters:
  - search: string (optional, searches name/description)
  - category: string (optional, exact match)
  - minPrice: number (optional, >= 0)
  - maxPrice: number (optional, >= minPrice)
  - page: number (default: 1)
  - limit: number (default: 10, max: 100)
Output: Paginated filtered results
```

---

### 📦 Inventory Management (EPIC 4)

#### Feature 4.1: Stock Model (SKU-Based)
**Description** : Structure for managing inventory with stock reservation  
**Requirements** :
- SKU (Stock Keeping Unit) as unique identifier
- Quantity field for total stock
- Reserved field for held inventory
- Calculated available field (quantity - reserved)
- One-to-one relation with Product

**Stock Model** :
```
Stock {
  id: UUID (primary key)
  sku: string (required, unique, indexed)
  productId: UUID (foreign key, unique)
  quantity: integer (>= 0, required)
  reserved: integer (>= 0, required)
  available: integer (calculated: quantity - reserved)
  lastUpdated: DateTime
  createdAt: DateTime
}

Invariants:
- reserved <= quantity always
- available = quantity - reserved
- available >= 0 always
```

**Acceptance Criteria** :
- ✅ SKU unique across all products
- ✅ Available calculated correctly
- ✅ Invariants enforced
- ✅ Proper indexing on SKU

---

#### Feature 4.2: Manual Stock Update (Admin)
**Description** : Update inventory when goods arrive  
**User Story** : "As an admin, I want to update stock via SKU after goods arrive."

**Requirements** :
- PUT `/inventory/update-stock` endpoint
- Input: SKU and quantity to add
- Only ADMIN role can update
- Validation that SKU exists
- Activity logging of changes
- Error handling for invalid SKU

**Acceptance Criteria** :
- ✅ Valid SKU and quantity updates stock
- ✅ Quantity added to existing amount
- ✅ Invalid SKU returns 404
- ✅ Only ADMIN can access
- ✅ Changes logged
- ✅ Response shows new quantities

**Technical Specifications** :
```
Endpoint: PUT /inventory/update-stock [ADMIN]
Input: UpdateStockDto {
  sku: string (required)
  quantity: integer (required, > 0)
}
Output: {
  sku: string
  quantity: number (new total)
  reserved: number
  available: number
}
Error Codes: 400, 404, 403
```

---

#### Feature 4.3: Stock Reservation (Automatic)
**Description** : Automatically reserve stock when order is created  
**System Requirement** : "When customer creates order, system reserves items to prevent overselling."

**Requirements** :
- Called automatically by Order Service on order creation
- Check available stock >= requested quantity
- Increment reserved count
- Use database transaction for atomicity
- Return error if insufficient stock
- Fire event on successful reservation

**Acceptance Criteria** :
- ✅ Stock reserved on valid order
- ✅ Insufficient stock throws error
- ✅ Reserved count incremented correctly
- ✅ Atomic transaction (all or nothing)
- ✅ Handles concurrent requests correctly
- ✅ Event emitted on success

**Technical Specifications** :
```
Service Method: reserveStock(productId, quantity)
- Fetch product stock
- Check: stock.available >= quantity
- If valid:
  - Increment stock.reserved by quantity
  - Save atomically
  - Emit 'stock.reserved' event
  - Return success
- If invalid:
  - Throw InsufficientStockException
  - No state change
Transaction: Database transaction wrapping entire operation
```

---

#### Feature 4.4: Stock Release (Automatic)
**Description** : Release reserved stock when order is cancelled  
**System Requirement** : "When order cancelled, reserved stock becomes available again."

**Requirements** :
- Called when order status changes to CANCELLED
- Decrement reserved count
- Use transaction for atomicity
- Prevent negative reserved counts
- Fire event on successful release

**Acceptance Criteria** :
- ✅ Reserved count decremented on cancel
- ✅ Prevents negative reserved
- ✅ Atomic transaction
- ✅ Event emitted
- ✅ Consistent state maintained

**Technical Specifications** :
```
Service Method: releaseStock(productId, quantity)
- Fetch product stock
- Check: stock.reserved >= quantity
- If valid:
  - Decrement stock.reserved by quantity
  - Save atomically
  - Emit 'stock.released' event
  - Return success
- If invalid:
  - Throw InvalidOperationException
```

---

### 🛒 Order Management (EPIC 5)

#### Feature 5.1: Order Model & Entity
**Description** : Data structure for managing customer orders  
**Requirements** :
- Order with status tracking (PENDING, PAID, CANCELLED)
- One-to-many relation to OrderItems
- One-to-one relation to User
- Price tracking (total with tax)
- Timestamp tracking

**Order Model** :
```
Order {
  id: UUID (primary key)
  userId: UUID (foreign key, indexed)
  status: Enum ('PENDING' | 'PAID' | 'CANCELLED') [default: PENDING]
  subtotal: Decimal (required)
  taxAmount: Decimal (required, 20% of subtotal)
  totalPrice: Decimal (required, subtotal + taxAmount)
  createdAt: DateTime (indexed)
  updatedAt: DateTime
  cancelledAt: DateTime (nullable)
  orderItems: OrderItem[] (1:many)
  user: User (many:1)
}

OrderItem {
  id: UUID (primary key)
  orderId: UUID (foreign key)
  productId: UUID (foreign key)
  quantity: integer (> 0)
  unitPrice: Decimal (price at purchase time)
  subtotal: Decimal (quantity * unitPrice)
  createdAt: DateTime
}
```

**Acceptance Criteria** :
- ✅ Relations properly defined
- ✅ Indexes on frequently queried fields
- ✅ Status enum enforced
- ✅ Price calculations stored

---

#### Feature 5.2: Create Order
**Description** : Customer creates order with automatic stock reservation and tax calculation  
**User Story** : "As a customer, I want to create an order to reserve products and see total with taxes."

**Requirements** :
- POST `/orders` endpoint
- Authenticated user only (CLIENT role)
- Validate all items exist
- Check stock availability
- Reserve stock automatically
- Calculate price with 20% VAT
- Status = PENDING
- Atomic transaction

**Order Creation Process** :
1. Validate authentication
2. Validate items (exist, quantities > 0)
3. Check stock availability
4. Calculate subtotal (sum of price * qty)
5. Calculate tax (subtotal * 0.20)
6. Calculate total (subtotal + tax)
7. Reserve stock for each item
8. Create order in database
9. Emit 'order.created' event
10. Return order details

**Acceptance Criteria** :
- ✅ Valid items create order
- ✅ Automatic stock reservation
- ✅ Price calculation accurate
- ✅ Insufficient stock prevents creation
- ✅ Only authenticated users can create
- ✅ Status = PENDING initially

**Technical Specifications** :
```
Endpoint: POST /orders [AUTHENTICATED]
Input: CreateOrderDto {
  items: OrderItemInput[] {
    productId: UUID
    quantity: integer (> 0)
  }
}
Output: {
  id: UUID
  userId: UUID
  status: 'PENDING'
  subtotal: Decimal
  taxAmount: Decimal (subtotal * 0.20)
  totalPrice: Decimal
  items: OrderItem[]
  createdAt: ISO8601
}
Error Codes: 400, 401, 404, 409
```

**Example Calculation** :
```
Item 1: Laptop $1000 × 2 = $2000
Item 2: Mouse $50 × 1 = $50
Subtotal: $2050
Tax (20%): $410
Total: $2460
```

---

#### Feature 5.3: Order History
**Description** : View personal order history with pagination  
**User Story** : "As a customer, I want to see my order history to track purchases."

**Requirements** :
- GET `/orders` endpoint
- Only returns user's own orders
- Paginated results
- Sorted by date (newest first)
- Include order items and products
- Includes order status and total

**Acceptance Criteria** :
- ✅ Only user's orders returned
- ✅ Paginated correctly
- ✅ Sorted newest first
- ✅ Full details returned
- ✅ Status visible
- ✅ Prices shown

**Technical Specifications** :
```
Endpoint: GET /orders?page=1&limit=10 [AUTHENTICATED]
Output: {
  data: Order[],
  total: number,
  page: number,
  limit: number
}
Order includes:
- id, status, totalPrice, createdAt
- items (OrderItem[])
- products within items
```

---

#### Feature 5.4: Order Details
**Description** : View detailed information about specific order  
**User Story** : "As a customer, I want to see full order details."

**Requirements** :
- GET `/orders/:id` endpoint
- Only user can view own orders
- Admin can view any order
- Full details (items, prices, status)
- 404 if order not found
- 403 if unauthorized access

**Acceptance Criteria** :
- ✅ User sees own order
- ✅ User cannot see others' orders
- ✅ Admin can see any order
- ✅ 404 for non-existent order
- ✅ 403 for unauthorized access
- ✅ Complete details returned

**Technical Specifications** :
```
Endpoint: GET /orders/:id [AUTHENTICATED]
Output: Complete Order with:
- All fields
- All OrderItems
- Product details for each item
- Total and tax breakdown
```

---

#### Feature 5.5: Cancel Order
**Description** : Allow customers to cancel PENDING orders  
**User Story** : "As a customer, I want to cancel my order to release reserved stock."

**Requirements** :
- PUT `/orders/:id/cancel` endpoint
- Only PENDING orders can be cancelled
- Release reserved stock
- Update status to CANCELLED
- Record cancellation timestamp
- User can only cancel own orders
- Admin can cancel any order
- Atomic transaction

**Cancellation Process** :
1. Fetch order
2. Check authorization (own order or ADMIN)
3. Verify status = PENDING
4. Release stock for each item
5. Update status to CANCELLED
6. Set cancelledAt timestamp
7. Emit 'order.cancelled' event
8. Return updated order

**Acceptance Criteria** :
- ✅ PENDING order cancellable
- ✅ Non-PENDING returns error
- ✅ Stock released correctly
- ✅ User authorization checked
- ✅ Atomic transaction
- ✅ Status updated
- ✅ Timestamp recorded

**Technical Specifications** :
```
Endpoint: PUT /orders/:id/cancel [AUTHENTICATED]
Validation:
- Order exists (404 if not)
- User is owner or ADMIN (403 if not)
- Order status = 'PENDING' (409 if not)
Process:
- Release stock for each OrderItem
- Update status to 'CANCELLED'
- Set cancelledAt = now()
Output: Updated Order with status CANCELLED
Error Codes: 400, 401, 403, 404, 409
```

---

## 🏗️ Technical Architecture

### System Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    API GATEWAY (NestJS)                      │
│  - Routing, Auth Check, Rate Limiting, CORS, Validation    │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│              APPLICATION LAYER (4 Modules)                  │
├─────────────────┬──────────────┬─────────────┬──────────────┤
│  Auth Module    │ Catalog      │ Inventory   │ Order        │
│                 │ Module       │ Module      │ Module       │
├─────────────────┼──────────────┼─────────────┼──────────────┤
│ - Controllers   │ - Controllers│ - Services  │ - Controllers│
│ - Services      │ - Services   │ - DTOs      │ - Services   │
│ - DTOs          │ - DTOs       │             │ - DTOs       │
│ - Guards        │ - Entities   │             │ - Events     │
│ - Strategies    │              │             │              │
└─────────────────┴──────────────┴─────────────┴──────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│          BUSINESS LOGIC & SHARED SERVICES                   │
│  - PriceCalculationService                                  │
│  - EventEmitter                                             │
│  - Logging (Winston)                                        │
│  - Security (Helmet, CORS)                                  │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│           DATA ACCESS LAYER (Prisma ORM)                    │
│  - User Repository                                          │
│  - Product Repository                                       │
│  - Stock Repository                                         │
│  - Order Repository                                         │
│  - OrderItem Repository                                     │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│          DATABASE LAYER (PostgreSQL)                        │
│  - youshop_db (users, products, stocks, orders, etc.)      │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack Justification

| Technology | Purpose | Rationale |
|-----------|---------|-----------|
| **NestJS** | Framework | Modular architecture, TypeScript-first, excellent for scalable backend |
| **TypeScript** | Language | Type safety, prevents runtime errors, better IDE support |
| **PostgreSQL** | Database | ACID compliance, relational data, proven reliability |
| **Prisma** | ORM | Type-safe queries, migrations, excellent DX |
| **Passport.js** | Auth | Industry standard, flexible, JWT-compatible |
| **JWT** | Token | Stateless auth, easily scalable to microservices |
| **Bcrypt** | Hashing | Slow hashing, resistant to brute force |
| **Class-validator** | Validation | Declarative validation, reusable DTOs |
| **Jest** | Testing | Fast, good coverage reporting, JavaScript ecosystem standard |
| **Docker** | Containerization | Consistent environments, easy deployment |
| **GitHub Actions** | CI/CD | Native GitHub integration, free for public repos |
| **Swagger** | API Docs | Auto-generated docs, interactive testing |

---

## 🔄 Data Flow & Workflows

### Order Creation Workflow
```
User Request (POST /orders)
    ↓
[JwtAuthGuard] - Verify token, extract userId
    ↓
[CreateOrderDto] - Validate request body
    ↓
OrderController.create(userId, dto)
    ↓
OrderService.create(userId, dto)
    ├─ Validate items exist and quantities valid
    ├─ Check stock availability for all items
    ├─ Calculate prices (subtotal, tax, total)
    ├─ [TRANSACTION START]
    │   ├─ InventoryService.reserveStock() for each item
    │   ├─ Create Order in database
    │   ├─ Create OrderItems in database
    │   └─ [TRANSACTION COMMIT]
    ├─ EventEmitter.emit('order.created', order)
    └─ Return Order object
        ↓
HTTP 201 Created + Order JSON
```

### Stock Reservation Workflow
```
OrderService.create() calls InventoryService.reserveStock()
    ↓
[TRANSACTION START]
    ├─ Fetch Stock by Product ID
    ├─ Calculate available = quantity - reserved
    ├─ Check: available >= requestedQuantity
    ├─ If insufficient: Throw InsufficientStockException
    ├─ If sufficient:
    │   ├─ Increment reserved by requestedQuantity
    │   ├─ Save Stock to database
    │   └─ EventEmitter.emit('stock.reserved')
    └─ [TRANSACTION COMMIT]
        ↓
Return to OrderService
```

### Order Cancellation Workflow
```
User Request (PUT /orders/:id/cancel)
    ↓
[JwtAuthGuard + OwnershipCheck]
    ├─ Verify token
    ├─ Check order ownership or ADMIN role
    ├─ Return 403 if unauthorized
    ↓
OrderService.cancel(orderId)
    ├─ Fetch Order
    ├─ Verify status = PENDING
    ├─ If not PENDING: Throw CannotCancelException
    ├─ [TRANSACTION START]
    │   ├─ For each OrderItem:
    │   │   └─ InventoryService.releaseStock()
    │   ├─ Update Order.status = CANCELLED
    │   ├─ Set Order.cancelledAt = now()
    │   └─ Save Order
    ├─ [TRANSACTION COMMIT]
    ├─ EventEmitter.emit('order.cancelled', order)
    └─ Return updated Order
        ↓
HTTP 200 OK + Updated Order JSON
```

---

## 📊 Non-Functional Requirements

### Performance Requirements
| Metric | Target | Rationale |
|--------|--------|-----------|
| Product List API | < 100ms | User browsing experience |
| Create Order | < 500ms | Multiple validations + DB writes |
| Stock Update | < 200ms | Admin operations |
| Search Query | < 150ms | Search relevance important |
| JWT Validation | < 10ms | On every protected request |

### Scalability Requirements
- Handle concurrent order creation (race conditions prevented by transactions)
- Support 10,000+ products in catalog
- Support 100,000+ orders
- Database queries optimized with indexes
- Stateless design for horizontal scaling
- Ready for microservices decomposition

### Security Requirements
- ✅ All passwords hashed with Bcrypt (10 rounds)
- ✅ All endpoints validated (input + authentication)
- ✅ HTTPS enforcement (production)
- ✅ JWT token expiration enforced (1 hour)
- ✅ Role-based access control (RBAC)
- ✅ SQL injection prevention (Prisma parameterized queries)
- ✅ XSS protection (Helmet middleware)
- ✅ CORS properly configured
- ✅ Rate limiting (planned)
- ✅ Activity logging (Winston)

### Reliability Requirements
- ✅ Transaction support (atomic operations)
- ✅ Error handling and recovery
- ✅ Data consistency (no race conditions)
- ✅ Database backup strategy
- ✅ Graceful degradation
- ✅ Monitoring and alerting ready

### Maintainability Requirements
- ✅ Zero `any` types in TypeScript
- ✅ SRP (Single Responsibility Principle)
- ✅ DRY (Don't Repeat Yourself)
- ✅ Clear code documentation
- ✅ Comprehensive test coverage (70%)
- ✅ Standard naming conventions
- ✅ Modular architecture

---

## 📋 Success Metrics & KPIs

### Development Metrics
| KPI | Target | Measurement |
|-----|--------|-------------|
| Test Coverage | ≥ 70% | Jest coverage report |
| Code Quality | 0 `any` types | TypeScript strict mode |
| Build Success | 100% | CI/CD pipeline green |
| Documentation | Complete | Swagger + README |
| Performance | < 500ms | API response times |

### Functional Metrics
- ✅ All CRUD operations functional
- ✅ All 4 modules integrated
- ✅ Authentication working
- ✅ Stock management accurate
- ✅ Price calculations correct
- ✅ Error handling comprehensive

### Deployment Metrics
- ✅ Docker image builds successfully
- ✅ Docker Compose orchestration works
- ✅ GitHub Actions CI/CD pipeline green
- ✅ All endpoints responding
- ✅ Database migrations applied
- ✅ Swagger documentation accessible

---

## 📅 Project Timeline & Milestones

### Sprint 1: Foundations & Catalog (Days 1-5)
**Duration** : 5 days  
**Status** : Planned

**Key Deliverables** :
- ✅ Project initialization (INIT-001, INIT-002)
- ✅ UML Diagrams (INIT-003)
- ✅ Authentication system (AUTH-001, AUTH-002, AUTH-003)
- ✅ Product catalog (CATALOG-001, CATALOG-002, CATALOG-003)

**Success Criteria** :
- Repository initialized and pushed
- All modules created
- Auth flows tested
- Catalog fully functional
- Swagger documentation live
- 30% of total requirements complete

---

### Sprint 2: Operations & Deployment (Days 6-10)
**Duration** : 5 days  
**Status** : Planned

**Key Deliverables** :
- ✅ Inventory management (INVENTORY-001 to 004)
- ✅ Order management (ORDERS-001 to 005)
- ✅ Comprehensive testing (TEST-001, TEST-002)
- ✅ API documentation (DOCS-001)
- ✅ DevOps & deployment (DEVOPS-001, DEVOPS-002)

**Success Criteria** :
- All modules complete
- 70% test coverage achieved
- Docker/Docker Compose working
- CI/CD pipeline green
- 100% of core requirements complete
- Ready for production deployment

---

## 🚀 Go-Live & Deployment Strategy

### Pre-Launch Checklist
- [ ] All code committed to Git
- [ ] All tests passing (70% coverage minimum)
- [ ] No TypeScript `any` types
- [ ] Swagger documentation complete
- [ ] Docker images built and tested
- [ ] GitHub Actions CI/CD green
- [ ] README updated with instructions
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] Security audit passed

### Deployment Steps
1. **Build Docker Image**
   ```bash
   docker build -t youshop:1.0 .
   ```

2. **Run Docker Compose**
   ```bash
   docker-compose up -d
   ```

3. **Run Database Migrations**
   ```bash
   npx prisma migrate deploy
   ```

4. **Verify Health**
   - Check API responds (GET /health)
   - Verify Swagger accessible (/api/docs)
   - Test auth endpoints
   - Verify database connection

### Monitoring & Support
- Docker logs monitoring
- Database backup schedule
- Error logging (Winston)
- Performance metrics
- User support plan

---

## 🎓 Educational & Learning Outcomes

### Key Concepts Covered
1. **Architecture** : Modular NestJS design
2. **TypeScript** : Strict typing, Generics, Interfaces, Enums
3. **Authentication** : JWT, Passport.js, Role-Based Access Control
4. **Database** : Prisma ORM, Migrations, Relations, Transactions
5. **Validation** : Class-validator, Custom Pipes, DTOs
6. **Testing** : Jest, Unit tests, E2E tests, Coverage
7. **DevOps** : Docker, Docker Compose, GitHub Actions, CI/CD
8. **API Design** : RESTful principles, Swagger documentation
9. **Security** : Password hashing, Input validation, Authorization
10. **Performance** : Caching, Pagination, Query optimization

### Skills Developed
- Backend development with NestJS
- Database design and management
- Security implementation
- Test-driven development
- DevOps and containerization
- CI/CD pipeline configuration
- API documentation
- Code quality and maintainability

---

## 📚 Dependencies & Integration Points

### Internal Dependencies
- Auth Module → All other modules (JWT validation)
- Order Service → Catalog Service (product validation)
- Order Service → Inventory Service (stock reservation)
- Inventory Service → Stock Repository (data access)
- Catalog Service → Product Repository (data access)

### External Dependencies
- PostgreSQL database
- Node.js 16+ runtime
- npm package manager
- Docker (deployment)
- GitHub (source control)

---

## 🔮 Future Enhancements & Roadmap

### Phase 2: Microservices Architecture
- Separate services into independent deployments
- RabbitMQ/Kafka for async messaging
- API Gateway for routing
- Service discovery
- Circuit breakers

### Phase 3: Advanced Features
- Payment gateway integration
- Email notifications
- Order tracking/shipping
- Product reviews and ratings
- Inventory forecasting
- Analytics dashboard

### Phase 4: Performance & Scale
- Redis caching layer
- Database read replicas
- CDN for static assets
- Load balancing
- Horizontal scaling
- GraphQL API option

### Phase 5: Compliance & Security
- PCI DSS compliance (for payments)
- GDPR compliance
- Two-factor authentication
- API rate limiting
- Advanced fraud detection
- Audit logging

---

## 📞 Support & Questions

### Getting Help
1. **Documentation** : Check README.md and Swagger docs
2. **Code Examples** : Review test files for usage patterns
3. **Logging** : Check Winston logs for errors
4. **Docker** : Use `docker-compose logs app` for debugging

### Contact
- GitHub Issues for bug reports
- Code review for feedback
- Documentation for questions

---

## ✅ Acceptance Criteria Checklist

### Functional Requirements
- [ ] User registration working (email validation, password hashing)
- [ ] User login working (JWT token generation)
- [ ] Role-based access control enforced
- [ ] Product CRUD operations functional
- [ ] Product filtering and search working
- [ ] Stock management by SKU working
- [ ] Automatic stock reservation on order creation
- [ ] Automatic stock release on order cancellation
- [ ] Order creation with price calculation
- [ ] Order history retrieval
- [ ] Order cancellation working

### Non-Functional Requirements
- [ ] 70% test coverage achieved
- [ ] Zero `any` types in TypeScript
- [ ] All endpoints < 500ms response time
- [ ] Swagger documentation complete
- [ ] Docker image builds successfully
- [ ] Docker Compose orchestration works
- [ ] GitHub Actions CI/CD pipeline green
- [ ] Database migrations applied
- [ ] Error handling comprehensive
- [ ] Logging implemented
- [ ] Security: passwords hashed, inputs validated

### Deliverables
- [ ] Git repository with clean history
- [ ] README.md complete and accurate
- [ ] UML diagrams (Use Case, Class, Sequence)
- [ ] Swagger API documentation
- [ ] Unit and E2E test suites
- [ ] Dockerfile and docker-compose.yml
- [ ] GitHub Actions workflow file
- [ ] Environment configuration file (.env.example)

---

**Document Status** : ✅ **APPROVED FOR DEVELOPMENT**

**Next Review Date** : 02/01/2026 (Project Completion)

---

*This Product Requirements Document outlines the complete specification for the YouShop e-commerce backend platform. All features, requirements, and success criteria are detailed above. The project team should refer to this document throughout development to ensure alignment with product vision and requirements.*

**Start Date** : 22/12/2025  
**Target Completion** : 02/01/2026

🚀 **Good luck with development!**