const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { testConnection, sequelize } = require('./config/database');
const errorHandler = require('./middleware/error');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

// Initialize Express app
const app = express();

// Test database connection
testConnection();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Update this if your frontend runs on a different port
  credentials: true
}));
app.use(express.json());

// Logging middleware in development mode
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/categories', categoryRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Task Sea API is running'
  });
});

// Error handling middleware
app.use(errorHandler);

// Define port
const PORT = process.env.PORT || 5000;

// Sync database and start server
const startServer = async () => {
  try {
    await sequelize.sync();
    console.log('Database synced successfully');
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to sync database:', error);
  }
};

startServer();
