const User = require('./User');
const Category = require('./Category');
const Task = require('./Task');
const TaskApplication = require('./TaskApplication');
const Review = require('./Review');
const { sequelize } = require('../config/database');

// Define all model relationships
User.hasMany(Task, {
  foreignKey: 'user_id',
  as: 'postedTasks'
});

User.hasMany(TaskApplication, {
  foreignKey: 'applicant_id',
  as: 'applications'
});

User.hasMany(Review, {
  foreignKey: 'reviewer_id',
  as: 'givenReviews'
});

User.hasMany(Review, {
  foreignKey: 'reviewee_id',
  as: 'receivedReviews'
});

Category.hasMany(Task, {
  foreignKey: 'category_id',
  as: 'tasks'
});

Task.hasMany(TaskApplication, {
  foreignKey: 'task_id',
  as: 'applications'
});

Task.hasMany(Review, {
  foreignKey: 'task_id',
  as: 'reviews'
});

// Export all models
module.exports = {
  sequelize,
  User,
  Category,
  Task,
  TaskApplication,
  Review
};
