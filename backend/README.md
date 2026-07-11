# Khao-Pio Backend

A Node.js + Express + Sequelize + MySQL backend for user signup, login, and order placement/history.

## Database
- Connection name: Khaoo-Pio
- Schema: `khao-pio`
- Username: `root`
- Password: `2501`

## Run
```bash
cd backend
npm install
npm start
```

## API Endpoints
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/orders`
- `GET /api/orders/history`

## Notes
- Users are stored in the `users` table.
- Orders are stored in the `orders` table and linked to the logged-in user.
- The order history is returned only for the authenticated user.
