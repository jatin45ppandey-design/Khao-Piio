# Khao-Piio Backend

REST API for the Khao-Piio food ordering application.

## Stack

- Node.js
- Express.js
- Sequelize
- MySQL
- JWT authentication
- bcrypt.js
- Razorpay

## Features

- User signup and login
- Password hashing
- JWT-protected order APIs
- Order creation and authenticated order history
- Individual order lookup
- Razorpay order creation
- Razorpay signature verification
- Environment-based CORS and database configuration

## API Endpoints

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

### Payments

```http
POST /api/payments/create-order
POST /api/payments/verify
```

### Health

```http
GET /api/health
```

## Local Setup

```bash
cd backend
npm install
```

Copy `.env.example` to a local `.env` file and replace the placeholder/default values with your own configuration.

Then run:

```bash
npm run dev
```

or:

```bash
npm start
```

## Security

Do not commit real database passwords, JWT secrets, or Razorpay credentials. Use environment variables and rotate credentials if they have ever been exposed in repository history.
