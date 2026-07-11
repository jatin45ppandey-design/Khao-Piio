require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { sequelize, initializeDatabase } = require('./src/config/db');
const authRoutes = require('./src/routes/authRoutes');
const orderRoutes = require('./src/routes/orderRoutes');
const paymentRoutes = require('./src/routes/paymentRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ message: 'Khao-Pio backend is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);

async function startServer() {
  try {
    await initializeDatabase();
    await sequelize.sync({ alter: true });

    console.log('MySQL database connected successfully.');

    const port = process.env.PORT || 5000;
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
}

startServer();
