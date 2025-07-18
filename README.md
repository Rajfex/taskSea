# Task Sea Application

A platform to browse and post simple paid tasks, connecting people who need help with those willing to provide it.

## Project Structure

```
taskSea/
├── frontend/             # React frontend application
│   └── tasksea/          # React project files
│       ├── src/          # Source code
│       ├── public/       # Public assets
│       └── package.json  # Frontend dependencies
│
├── backend/              # Node.js backend application
│   ├── src/              # Source code
│   ├── sql/              # SQL database setup
│   └── package.json      # Backend dependencies
│
└── start-app.bat         # Script to start both servers
```

## Tech Stack

### Frontend
- React (with functional components)
- Tailwind CSS
- React Router for navigation

### Backend
- Node.js
- Express
- MySQL (with Sequelize ORM)
- JWT for authentication

## Setup Instructions

### Prerequisites
- Node.js (v18 or later)
- MySQL / PHPMyAdmin

### Database Setup
1. Create a MySQL database named `tasksea`
2. Import the SQL schema from `backend/sql/database.sql`

### Backend Setup
1. Navigate to the backend directory: `cd backend`
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and configure your database settings:
   ```bash
   cp .env.example .env
   ```
4. Update the `.env` file with your database credentials and JWT secret
5. Start the server: `npm run dev`

### Frontend Setup
1. Navigate to the frontend directory: `cd frontend/tasksea`
2. Install dependencies: `npm install`
3. (Optional) Copy `.env.example` to `.env` and configure API URL if needed:
   ```bash
   cp .env.example .env
   ```
4. Start the development server: `npm run dev`

### Quick Start
Run the `start-app.bat` script to start both frontend and backend servers simultaneously.

## Git Setup

This project includes comprehensive `.gitignore` files to ensure sensitive information and build artifacts are not committed:

- Root `.gitignore` - General project files
- `backend/.gitignore` - Node.js backend specific files
- `frontend/tasksea/.gitignore` - React frontend specific files

### Environment Files
- `backend/.env` - Contains sensitive backend configuration (not committed)
- `backend/.env.example` - Template for backend environment variables
- `frontend/tasksea/.env.example` - Template for frontend environment variables

Make sure to:
1. Copy `.env.example` files to `.env` in respective directories
2. Update the `.env` files with your actual configuration
3. Never commit `.env` files to version control

## Features

- User authentication (register/login)
- Browse and filter tasks with search functionality
- Post new tasks with categories and pricing
- Apply for tasks with custom messages
- View detailed task information on dedicated pages
- Accept/Reject applications as a task poster
- View applications for posted tasks
- View applied tasks and their status
- Email task posters directly
- Mobile-friendly responsive design
- Transparent modal interfaces

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login
- GET `/api/auth/profile` - Get user profile

### Tasks
- GET `/api/tasks` - Get all tasks
- GET `/api/tasks/:id` - Get a single task
- POST `/api/tasks` - Create a new task
- PUT `/api/tasks/:id` - Update a task
- DELETE `/api/tasks/:id` - Delete a task
- POST `/api/tasks/:id/apply` - Apply for a task
- GET `/api/tasks/:id/applications` - Get applications for a task (task owner only)
- PUT `/api/tasks/:id/applications/:applicationId` - Update application status (accept/reject)
- GET `/api/tasks/user/posted` - Get user's posted tasks
- GET `/api/tasks/user/applications` - Get user's applied tasks

### Categories
- GET `/api/categories` - Get all categories
- GET `/api/categories/:id` - Get a single category
- POST `/api/categories` - Create a new category (admin only)
