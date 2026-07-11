const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  orderItems: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  total: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  paymentMethod: {
    type: DataTypes.STRING,
    defaultValue: 'cash_on_delivery',
  },
  paymentStatus: {
    type: DataTypes.STRING,
    defaultValue: 'pending',
  },
  trackingStatus: {
    type: DataTypes.STRING,
    defaultValue: 'placed',
  },
  deliveryDetails: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'placed',
  },
}, {
  tableName: 'orders',
});

User.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(User, { foreignKey: 'userId' });

module.exports = Order;
