# Khao-Piio 🍽️

A full-stack food ordering web application built around a complete customer flow — discover food, search items, manage a cart, authenticate, checkout, pay, view previous orders, and track an order.

## Overview

Khao-Piio is a practical full-stack project focused on connecting a modern React frontend with a REST API, relational database, authenticated user flows, order management, and payment processing.

The repository is split into:

- `project/` — frontend application
- `backend/` — REST API and database layer

## Features

- User signup and login
- Password hashing with bcrypt
- JWT-based authentication
- Food browsing and search
- Shopping cart flow
- Checkout and delivery details
- Cash-on-delivery support
- Razorpay order creation and payment verification
- Authenticated order placement
- Order history for the signed-in user
- Individual order lookup and tracking
- Responsive React interface
- Environment-based frontend/backend configuration

## Tech Stack

### Frontend

- React 18
- Vite 5
- React Router
- Tailwind CSS
- Lucide React

### Backend

- Node.js
- Express.js
- Sequelize ORM
- MySQL
- JSON Web Tokens (JWT)
- bcrypt.js
- Razorpay
- CORS + dotenv

## Application Flow

```text
Browse / Search Food
        ↓
      Cart
        ↓
 Login / Signup
        ↓
    Checkout
        ↓
Payment / Cash on Delivery
        ↓
   Order Created
        ↓
Order History / Tracking
```

## API Overview

### Authentication

```http
POST /api/auth/signup
POST /api/auth/login
```

### Orders

```http
POST /api/orders
GET  /api/orders/history
GET  /api/orders/:id
```

Order routes require a valid bearer token.

### Payments

```http
POST /api/payments/create-order
POST /api/payments/verify
```

Razorpay payment endpoints require authentication.

## Project Structure

```text
Khao-Piio/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── models/
│   │   └── routes/
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
└── project/
    ├── src/
    │   ├── components/
    │   ├── context/
    │   ├── data/
    │   ├── pages/
    │   └── services/
    ├── .env.example
    ├── package.json
    └── vite.config.ts
```

## Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/jatin45ppandey-design/Khao-Piio.git
cd Khao-Piio
```

### 2. Configure the backend

```bash
cd backend
npm install
```

Create a local `.env` file from `.env.example` and provide your own database, JWT, Razorpay, and CORS values.

Then start the API:

```bash
npm run dev
```

The backend uses port `5000` by default.

### 3. Configure the frontend

From the repository root:

```bash
cd project
npm install
```

Create a local `.env` from `.env.example` and point `VITE_API_BASE_URL` to the backend API.

Start the development server:

```bash
npm run dev
```

## Security Notes

- Keep real credentials and API keys out of Git.
- Use strong, environment-specific JWT secrets.
- Keep Razorpay secret keys on the backend only.
- Restrict CORS to trusted frontend origins in deployed environments.
- Rotate any credential that has previously been committed publicly.

## What This Project Demonstrates

Khao-Piio demonstrates end-to-end application development across UI state, routing, authentication, REST APIs, relational persistence, protected resources, payment verification, and order lifecycle management.

## Author

**Jatin Pandey**

- GitHub: https://github.com/jatin45ppandey-design
- LinkedIn: https://www.linkedin.com/in/jatin-pandey-a1654237a

---

If you find the project useful, consider starring the repository.
