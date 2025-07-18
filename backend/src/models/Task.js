const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');
const Category = require('./Category');

const Task = sequelize.define('Task', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  location: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('open', 'assigned', 'completed', 'cancelled'),
    defaultValue: 'open'
  },
  createdAt: {
    type: DataTypes.DATE,
    field: 'created_at',
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    field: 'updated_at',
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'tasks',
  timestamps: true
});

// Define associations
Task.belongsTo(User, {
  foreignKey: {
    name: 'userId',
    field: 'user_id'
  },
  as: 'poster'
});

Task.belongsTo(Category, {
  foreignKey: {
    name: 'categoryId',
    field: 'category_id'
  },
  as: 'category'
});

module.exports = Task;
