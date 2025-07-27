const { Task, User, Category, TaskApplication } = require('../models');
const { Op } = require('sequelize');

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Public
exports.getTasks = async (req, res, next) => {
  try {
<<<<<<< HEAD
    const { categoryId, search, status, page = 1, limit = 10, sortBy = 'newest' } = req.query;
    const filter = {};

    // Convert page and limit to integers
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const offset = (pageNumber - 1) * limitNumber;

=======
    const { categoryId, search, status } = req.query;
    const filter = {};

>>>>>>> 91a39560325e9bb73d0a582443afddb2003bd7e7
    // Apply filters if provided
    if (categoryId) {
      filter.categoryId = categoryId;
    }

    if (status) {
      filter.status = status;
    }

    // Search in title and description
    if (search) {
      filter[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

<<<<<<< HEAD
    // Determine sort order
    let order;
    switch (sortBy) {
      case 'oldest':
        order = [['createdAt', 'ASC']];
        break;
      case 'newest':
      default:
        order = [['createdAt', 'DESC']];
        break;
    }

    const { count, rows: tasks } = await Task.findAndCountAll({
=======
    const tasks = await Task.findAll({
>>>>>>> 91a39560325e9bb73d0a582443afddb2003bd7e7
      where: filter,
      include: [
        {
          model: User,
          as: 'poster',
          attributes: ['id', 'name', 'email']
        },
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name']
        }
      ],
<<<<<<< HEAD
      order: order,
      limit: limitNumber,
      offset: offset
    });

    // Calculate pagination info
    const totalPages = Math.ceil(count / limitNumber);
    const hasNextPage = pageNumber < totalPages;
    const hasPrevPage = pageNumber > 1;

    res.status(200).json({
      success: true,
      count: tasks.length,
      totalCount: count,
      currentPage: pageNumber,
      totalPages: totalPages,
      hasNextPage: hasNextPage,
      hasPrevPage: hasPrevPage,
=======
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count: tasks.length,
>>>>>>> 91a39560325e9bb73d0a582443afddb2003bd7e7
      tasks
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single task
// @route   GET /api/tasks/:id
// @access  Public
exports.getTask = async (req, res, next) => {
  try {
    const task = await Task.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'poster',
          attributes: ['id', 'name', 'email']
        },
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name']
        },
        {
          model: TaskApplication,
          as: 'applications',
          include: [
            {
              model: User,
              as: 'applicant',
              attributes: ['id', 'name']
            }
          ]
        }
      ]
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.status(200).json({
      success: true,
      task
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
exports.createTask = async (req, res, next) => {
  try {
    const { title, description, price, location, categoryId } = req.body;

    // Validate input
    if (!title || !description || !price || !location || !categoryId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Check if category exists
    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category'
      });
    }

    // Create task
    const task = await Task.create({
      title,
      description,
      price,
      location,
      categoryId,
      userId: req.user.id
    });

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      task
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
exports.updateTask = async (req, res, next) => {
  try {
    const task = await Task.findByPk(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Check if user is the task owner
    if (task.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this task'
      });
    }

    // Update task
    await task.update(req.body);

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      task
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findByPk(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Check if user is the task owner
    if (task.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this task'
      });
    }

    // Delete task
    await task.destroy();

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Apply for a task
// @route   POST /api/tasks/:id/apply
// @access  Private
exports.applyForTask = async (req, res, next) => {
  try {
    const task = await Task.findByPk(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Check if task is still open
    if (task.status !== 'open') {
      return res.status(400).json({
        success: false,
        message: 'This task is not open for applications'
      });
    }

    // Check if user is not the task owner
    if (task.userId === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot apply for your own task'
      });
    }

    // Check if user has already applied
    const existingApplication = await TaskApplication.findOne({
      where: {
        taskId: task.id,
        applicantId: req.user.id
      }
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this task'
      });
    }

    // Create application
    const application = await TaskApplication.create({
      taskId: task.id,
      applicantId: req.user.id,
      message: req.body.message || null
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      application
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's posted tasks
// @route   GET /api/tasks/user/posted
// @access  Private
exports.getUserPostedTasks = async (req, res, next) => {
  try {
    const tasks = await Task.findAll({
      where: { userId: req.user.id },
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name']
        },
        {
          model: TaskApplication,
          as: 'applications',
          include: [
            {
              model: User,
              as: 'applicant',
              attributes: ['id', 'name', 'email']
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count: tasks.length,
      tasks
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's applied tasks
// @route   GET /api/tasks/user/applications
// @access  Private
exports.getUserAppliedTasks = async (req, res, next) => {
  try {
    const applications = await TaskApplication.findAll({
      where: { applicantId: req.user.id },
      include: [
        {
          model: Task,
          as: 'task',
          include: [
            {
              model: User,
              as: 'poster',
              attributes: ['id', 'name', 'email']
            },
            {
              model: Category,
              as: 'category',
              attributes: ['id', 'name']
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count: applications.length,
      applications
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get applications for a specific task (for task owners)
// @route   GET /api/tasks/:id/applications
// @access  Private
exports.getTaskApplications = async (req, res, next) => {
  try {
    const task = await Task.findByPk(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Check if user is the task owner
    if (task.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view applications for this task'
      });
    }

    const applications = await TaskApplication.findAll({
      where: { taskId: task.id },
      include: [
        {
          model: User,
          as: 'applicant',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count: applications.length,
      applications
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update application status (accept/reject)
// @route   PUT /api/tasks/:id/applications/:applicationId
// @access  Private
exports.updateApplicationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const { id: taskId, applicationId } = req.params;

    // Validate status
    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be either "accepted" or "rejected"'
      });
    }

    // Find the task
    const task = await Task.findByPk(taskId);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Check if user is the task owner
    if (task.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update applications for this task'
      });
    }

    // Find the application
    const application = await TaskApplication.findOne({
      where: {
        id: applicationId,
        taskId: taskId
      },
      include: [
        {
          model: User,
          as: 'applicant',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Update application status
    await application.update({ status });

    res.status(200).json({
      success: true,
      message: `Application ${status} successfully`,
      application
    });
  } catch (error) {
    next(error);
  }
};
