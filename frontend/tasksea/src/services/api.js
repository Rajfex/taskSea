// API service for making HTTP requests to the backend
const API_URL = 'http://localhost:5000/api';

// Helper function to handle API responses
const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    // If the server responds with an error
    const error = data.message || response.statusText;
    throw new Error(error);
  }
  
  return data;
};

// Function to set Authorization header with JWT token
const authHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    return { 'Authorization': `Bearer ${user.token}` };
  }
  return {};
};

// Auth Services
export const authService = {
  // Register user
  register: async (userData) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    
    const data = await handleResponse(response);
    
    // Save user details and token in localStorage
    if (data.token) {
      localStorage.setItem('user', JSON.stringify({
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
        token: data.token
      }));
    }
    
    return data;
  },
  
  // Login user
  login: async (credentials) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    
    const data = await handleResponse(response);
    
    // Save user details and token in localStorage
    if (data.token) {
      localStorage.setItem('user', JSON.stringify({
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
        token: data.token
      }));
    }
    
    return data;
  },
  
  // Logout user
  logout: () => {
    localStorage.removeItem('user');
  },
  
  // Get current user
  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem('user'));
  },
  
  // Get user profile
  getProfile: async () => {
    const response = await fetch(`${API_URL}/auth/profile`, {
      headers: { 
        ...authHeader(),
        'Content-Type': 'application/json' 
      }
    });
    
    return handleResponse(response);
  }
};

// Task Services
export const taskService = {
  // Get all tasks
  getTasks: async (filters = {}) => {
    // Build query string from filters
    const queryParams = new URLSearchParams();
    if (filters.categoryId) queryParams.append('categoryId', filters.categoryId);
    if (filters.search) queryParams.append('search', filters.search);
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.page) queryParams.append('page', filters.page);
    if (filters.limit) queryParams.append('limit', filters.limit);
    if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    const response = await fetch(`${API_URL}/tasks${queryString}`, {
      headers: { 
        'Content-Type': 'application/json'
      }
    });
    
    return handleResponse(response);
  },
  
  // Get a single task
  getTask: async (id) => {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
      headers: { 
        'Content-Type': 'application/json'
      }
    });
    
    return handleResponse(response);
  },
  
  // Create a new task
  createTask: async (taskData) => {
    const response = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: { 
        ...authHeader(),
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify(taskData)
    });
    
    return handleResponse(response);
  },
  
  // Update an existing task
  updateTask: async (id, taskData) => {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: { 
        ...authHeader(),
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify(taskData)
    });
    
    return handleResponse(response);
  },
  
  // Delete a task
  deleteTask: async (id) => {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
      method: 'DELETE',
      headers: authHeader()
    });
    
    return handleResponse(response);
  },
  
  // Apply for a task
  applyForTask: async (id, message = '') => {
    const response = await fetch(`${API_URL}/tasks/${id}/apply`, {
      method: 'POST',
      headers: { 
        ...authHeader(),
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({ message })
    });
    
    return handleResponse(response);
  },

  // Get user's posted tasks
  getUserPostedTasks: async () => {
    const response = await fetch(`${API_URL}/tasks/user/posted`, {
      headers: { 
        ...authHeader(),
        'Content-Type': 'application/json' 
      }
    });
    
    return handleResponse(response);
  },

  // Get user's applied tasks
  getUserAppliedTasks: async () => {
    const response = await fetch(`${API_URL}/tasks/user/applications`, {
      headers: { 
        ...authHeader(),
        'Content-Type': 'application/json' 
      }
    });
    
    return handleResponse(response);
  },

  // Get task applications for a specific task (for task owners)
  getTaskApplications: async (taskId) => {
    const response = await fetch(`${API_URL}/tasks/${taskId}/applications`, {
      headers: { 
        ...authHeader(),
        'Content-Type': 'application/json' 
      }
    });
    
    return handleResponse(response);
  },

  // Update application status (accept/reject)
  updateApplicationStatus: async (taskId, applicationId, status) => {
    const response = await fetch(`${API_URL}/tasks/${taskId}/applications/${applicationId}`, {
      method: 'PUT',
      headers: { 
        ...authHeader(),
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({ status })
    });
    
    return handleResponse(response);
  }
};

// Category Services
export const categoryService = {
  // Get all categories
  getCategories: async () => {
    const response = await fetch(`${API_URL}/categories`, {
      headers: { 
        'Content-Type': 'application/json'
      }
    });
    
    return handleResponse(response);
  },
  
  // Get a single category
  getCategory: async (id) => {
    const response = await fetch(`${API_URL}/categories/${id}`, {
      headers: { 
        'Content-Type': 'application/json'
      }
    });
    
    return handleResponse(response);
  }
};

// Admin Services
export const adminService = {
  // Get dashboard stats
  getDashboardStats: async () => {
    const response = await fetch(`${API_URL}/admin/dashboard`, {
      headers: { 
        'Content-Type': 'application/json',
        ...authHeader()
      }
    });
    
    return handleResponse(response);
  },

  // User management
  getUsers: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    if (filters.page) queryParams.append('page', filters.page);
    if (filters.limit) queryParams.append('limit', filters.limit);
    if (filters.search) queryParams.append('search', filters.search);
    if (filters.role) queryParams.append('role', filters.role);
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    const response = await fetch(`${API_URL}/admin/users${queryString}`, {
      headers: { 
        'Content-Type': 'application/json',
        ...authHeader()
      }
    });
    
    return handleResponse(response);
  },

  updateUserRole: async (userId, role) => {
    const response = await fetch(`${API_URL}/admin/users/${userId}/role`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        ...authHeader()
      },
      body: JSON.stringify({ role })
    });
    
    return handleResponse(response);
  },

  deleteUser: async (userId) => {
    const response = await fetch(`${API_URL}/admin/users/${userId}`, {
      method: 'DELETE',
      headers: { 
        'Content-Type': 'application/json',
        ...authHeader()
      }
    });
    
    return handleResponse(response);
  },

  // Task management
  getAdminTasks: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    if (filters.page) queryParams.append('page', filters.page);
    if (filters.limit) queryParams.append('limit', filters.limit);
    if (filters.search) queryParams.append('search', filters.search);
    if (filters.status) queryParams.append('status', filters.status);
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    const response = await fetch(`${API_URL}/admin/tasks${queryString}`, {
      headers: { 
        'Content-Type': 'application/json',
        ...authHeader()
      }
    });
    
    return handleResponse(response);
  },

  deleteTask: async (taskId) => {
    const response = await fetch(`${API_URL}/admin/tasks/${taskId}`, {
      method: 'DELETE',
      headers: { 
        'Content-Type': 'application/json',
        ...authHeader()
      }
    });
    
    return handleResponse(response);
  },

  // Category management
  getAdminCategories: async () => {
    const response = await fetch(`${API_URL}/admin/categories`, {
      headers: { 
        'Content-Type': 'application/json',
        ...authHeader()
      }
    });
    
    return handleResponse(response);
  },

  createCategory: async (categoryData) => {
    const response = await fetch(`${API_URL}/admin/categories`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...authHeader()
      },
      body: JSON.stringify(categoryData)
    });
    
    return handleResponse(response);
  },

  updateCategory: async (categoryId, categoryData) => {
    const response = await fetch(`${API_URL}/admin/categories/${categoryId}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        ...authHeader()
      },
      body: JSON.stringify(categoryData)
    });
    
    return handleResponse(response);
  },

  deleteCategory: async (categoryId) => {
    const response = await fetch(`${API_URL}/admin/categories/${categoryId}`, {
      method: 'DELETE',
      headers: { 
        'Content-Type': 'application/json',
        ...authHeader()
      }
    });
    
    return handleResponse(response);
  }
};
