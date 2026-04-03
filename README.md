# Finance Dashboard API

A robust, layered RESTful API backend for a Finance Dashboard built with **Node.js**, **Express**, **TypeScript**, and **Prisma ORM**. The system provides secure user authentication, role-based access control (RBAC), and efficient financial data processing logic.

## Key Features

- **Authentication & Authorization**: Secure JWT-based authentication.
- **Role-Based Access Control (RBAC)**: Strict permission boundaries for `ADMIN`, `ANALYST`, and `VIEWER` roles.
- **Financial Record Management**: Create, read, update, and delete financial records with comprehensive filtering capabilities.
- **Dashboard Analytics**: Endpoints for dynamic financial summaries and monthly trends.
- **Validation**: Schema-based payload validation centralized through Zod.
- **API Documentation**: Automated OpenAPI (Swagger) documentation.

---

## Tech Stack

- **Runtime Environment**: [Bun](https://bun.sh/) (configured via package.json, though manageable via npm/yarn)
- **Framework**: Express.js
- **Language**: TypeScript
- **Database Modeler & ORM**: Prisma
- **Database System**: PostgreSQL
- **Security & Validation**: bcryptjs, jsonwebtoken, zod
- **Documentation**: Swagger UI & Swagger JSDoc

---

## Setup Process

### 1. Prerequisites
Ensure you have the following installed:
- [Bun](https://bun.sh/) or [Node.js](https://nodejs.org/)
- A running PostgreSQL database instance.

### 2. Environment Variables
Clone the repository and set up your environment variables:
```bash
cp .env.example .env
```
Ensure your `.env` contains:
```env
NODE_ENV=development
PORT=3000
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
JWT_SECRET="your_super_secret_jwt_key"
JWT_EXPIRES_IN=7d
```

### 3. Installation
Install the project dependencies via Bun:
```bash
bun install
```

### 4. Database Setup
Run migrations to generate the database schema, and seed the database with initial dummy values (if applicable):
```bash
npx prisma generate
npx prisma db push
bun run prisma db seed
```
*(Note: Seed relies on `ts-node prisma/seed.ts` configured in package.json)*

### 5. Running the Application
Start the server in watch mode:
```bash
bun run dev
```

---

## API Explanation

The API utilizes a layered architecture (`Controllers` -> `Services` -> `Repositories`) to separate routing, business logic, and database operations. Payload validations are injected at the routing layer.

### Base URL
`http://localhost:3000/api`

### Interactive Documentation
Full interactive API documentation is available via **Swagger UI** once the server starts. Accessible at:
`http://localhost:3000/api-docs`

### Major Core Endpoints
- **Authentication (`/api/auth`)**
  - `POST /register`: Registers a new user.
  - `POST /login`: Authenticates user and returns a signed `Bearer` token.
- **Users (`/api/users`)** - *Admin Only*
  - Provides full CRUD capabilities to securely manage user accounts and access levels.
- **Records (`/api/records`)** - *Requires Authentication*
  - Securely isolates operations based on privileges (e.g. `VIEWER` can only GET, `ADMIN` can DELETE/PATCH). Supports robust query parameters (`type`, `category`, `startDate`, `endDate`, pagination).
- **Dashboard (`/api/dashboard`)**
  - `/summary`: Aggregates total income and total expenses.
  - `/trends`: Provides a chronologically aligned financial monthly trend.

---

## Assumptions Made

- **PostgreSQL**: The project firmly assumes a PostgreSQL environment as declared within the `.env.example` and the expected constraints of `@prisma/adapter-pg`.
- **Soft Deletions**: Rather than aggressive database wipes, "Inactive" accounts are presumed manageable via the `isActive` boolean flag present in the User entity.
- **Financial Units**: Values stored in `amount` fields on financial records are assumed to be handled uniformly from the client (e.g. base integers mapping to cents or standard floats).
- **Token Handling**: Standard usage of the `Authorization: Bearer <TOKEN>` header is employed universally by frontend clients interacting with protected endpoints.

---

## Tradeoffs Considered

1. **Architecture Complexity vs. Rapid Prototyping**
   - *Tradeoff*: Opted for a highly structured, strict multi-layer architecture (`Controller -> Service -> Repository`).
   - *Reasoning*: While this requires more boilerplate for simple CRUDs, it provides massive scalability, easier unit testing capability, and prevents bloated "god-controllers" down the line.

2. **Relational Database (PostgreSQL) vs. NoSQL (MongoDB)**
   - *Tradeoff*: Chose PostgreSQL natively paired with Prisma over a flexible document store.
   - *Reasoning*: Financial records possess rigid schemas and require high referential integrity/ACID compliance which relational databases famously guarantee over standard NoSQL variants.

3. **Zod Validation at Middleware Level**
   - *Tradeoff*: Validation logic acts entirely before hitting the Controller logic wrapper.
   - *Reasoning*: Enforces standard declarative strictness but adds slight system overhead on the Express lifecycle; greatly simplifies code logic further inside the application pipeline.

4. **Monolithic Analytical Endpoints**
   - *Tradeoff*: The `/dashboard/summary` and `trends` endpoints use live calculations against operational tables rather than pre-computed materialized views or a dedicated analytics datastore. 
   - *Reasoning*: Keeps system architecture simple at the cost of slower latency once record volumes scale vastly.
