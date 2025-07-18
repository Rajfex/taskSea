const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');
const Task = require('./Task');

const TaskApplication = sequelize.define('TaskApplication', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'accepted', 'rejected'),
    defaultValue: 'pending'
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
  tableName: 'task_applications',
  timestamps: true
});

// Define associations
TaskApplication.belongsTo(Task, {
  foreignKey: {
    name: 'taskId',
    field: 'task_id'
  },
  as: 'task'
});

TaskApplication.belongsTo(User, {
  foreignKey: {
    name: 'applicantId',
    field: 'applicant_id'
  },
  as: 'applicant'
});

module.exports = TaskApplication;
