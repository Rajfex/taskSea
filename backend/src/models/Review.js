const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');
const Task = require('./Task');

const Review = sequelize.define('Review', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5
    }
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  createdAt: {
    type: DataTypes.DATE,
    field: 'created_at',
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'reviews',
  timestamps: true,
  updatedAt: false
});

// Define associations
Review.belongsTo(Task, {
  foreignKey: {
    name: 'taskId',
    field: 'task_id'
  },
  as: 'task'
});

Review.belongsTo(User, {
  foreignKey: {
    name: 'reviewerId',
    field: 'reviewer_id'
  },
  as: 'reviewer'
});

Review.belongsTo(User, {
  foreignKey: {
    name: 'revieweeId',
    field: 'reviewee_id'
  },
  as: 'reviewee'
});

module.exports = Review;
