const express = require('express');
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  applyForTask,
  getUserPostedTasks,
  getUserAppliedTasks,
  getTaskApplications,
  updateApplicationStatus
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getTasks);

// User-specific routes (must come before parameterized routes)
router.get('/user/posted', protect, getUserPostedTasks);
router.get('/user/applications', protect, getUserAppliedTasks);

// Parameterized routes
router.get('/:id', getTask);
router.get('/:id/applications', protect, getTaskApplications);
router.put('/:id/applications/:applicationId', protect, updateApplicationStatus);

// Protected routes
router.post('/', protect, createTask);
router.put('/:id', protect, updateTask);
router.delete('/:id', protect, deleteTask);
router.post('/:id/apply', protect, applyForTask);

module.exports = router;
