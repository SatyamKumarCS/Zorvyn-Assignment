# Zorvyn Backend Assignment - Finance Dashboard API

Hello! Welcome to my backend submission for the Zorvyn assignment. 

This repository contains a structured scalable RESTful API built with **Node.js**, **Express**, **TypeScript**, and **Prisma ORM**. It provides secure user authentication, Role-Based Access Control (RBAC), and efficient CRUD operations for managing financial records.

## Highlights for Reviewers

- **Layered Architecture**: Code is strictly decoupled across `Controllers`, `Services`, and `Repositories` to ensure modularity, high testability, and isolated business logic.
- **Strict Typing & Linting**: Built entirely in TypeScript. The project uses ESLint's modern Flat Config to enforce rigid type safety rules.
- **Automated CI/CD**: A GitHub Actions workflow (`ci.yml`) is set up to automatically install dependencies, Lint, Type-Check, and execute the complete Test Suite on every single commit.
- **Robust Testing**: Comprehensive testing suite built with Jest. Instead of relying on a physical database, tests utilize `jest-mock-extended` against the Prisma client for lightning-fast isolation tests.
- **Payload Validation**: Zod is utilized cleanly at the middleware layer ensuring malformed payloads never reach the business logic.
- **Live Documentation**: Automated OpenAPI (Swagger UI) is set up for straightforward interactive endpoint testing.

---

## Tech Stack Overview

- **Language**: TypeScript
- **Runtime Environment**: [Bun](https://bun.sh/) (or smoothly cross-compatible with Node.js)
- **Framework**: Express.js
- **Database Modeler & ORM**: Prisma
- **Database**: PostgreSQL
- **Security**: `bcryptjs`, `jsonwebtoken`, `zod`
- **Testing**: `Jest`, `Supertest`

---

## Setup & Running Locally

### 1. Prerequisites
- [Bun](https://bun.sh/) or [Node.js](https://nodejs.org/) installed.
- A running PostgreSQL database instance.

### 2. Environment Configuration
Clone the repository, then copy the template environment file:
```bash
cp .env.example .env
```
Ensure your `.env` connects to your local database:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/finance_db"
JWT_SECRET="any_secure_test_key"
PORT=3000
```

### 3. Installation & Database Seeding
Install dependencies and seed the database with mock records:
```bash
bun install
npx prisma generate
npx prisma db push
bun run prisma db seed
```

### 4. Running the Server (or Tests)
Start the application in development mode:
```bash
bun run dev
```

To run the Jest mock-testing suite:
```bash
bun run test
```

---

## Interacting with the API

The API utilizes base route `http://localhost:3000/api`. 
Instead of testing via Postman, you can use the integrated **Swagger UI**:

**`http://localhost:3000/api-docs`**

*Note: For protected endpoints (like the Dashboard or Records modules), hit the `/auth/register` or `/auth/login` endpoint first. Copy the returned `token`, click the "Authorize" button in Swagger UI, and paste it into the Bearer token field.*

---

## Design Decisions & Tradeoffs

1. **Strict Layered Architecture vs. Rapid MVC**
   - *Decision*: I opted for a highly structured layer approach (`Controller -> Service -> Repository`).
   - *Reasoning*: While this requires more boilerplate up-front for simple endpoints, it proves its worth as assignments/systems grow. It prevents bloated "god-controllers" and makes unit-testing business logic (`Services`) trivial without mocking HTML request/response lifecycles.

2. **Relational PostgreSQL vs. NoSQL**
   - *Decision*: I chose PostgreSQL combined natively with Prisma over something flexible like MongoDB.
   - *Reasoning*: Financial records possess rigid schemas, require intense data aggregations (like the `dashboard.routes`), and demand high referential integrity across Users and Roles, traits which SQL excels at natively. 

3. **Zod Validation at Middleware Level**
   - *Decision*: Validation logic strictly intercepts the Request before executing the Controller.
   - *Reasoning*: It forces an authoritative separation of concerns. Controllers handle application flow, while Zod independently handles data sanitization.

4. **Testing Paradigms**
   - *Decision*: I mocked the Prisma client directly in `tests/mocks/prisma.ts`.
   - *Reasoning*: It allows the tests (and specifically the GitHub CI pipeline) to run within seconds locally without needing the infrastructural footprint of maintaining a separate Dockerized test container or a separate PostgreSQL staging database.
