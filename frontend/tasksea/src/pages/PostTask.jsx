import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { categoryService, taskService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const PostTask = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    location: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getCategories();
        setCategories(data.categories);
      } catch (err) {
        setApiError(err.message);
      }
    };
    
    fetchCategories();
  }, []);

  // Redirect if not logged in
  if (!user) {
    navigate('/login', { state: { from: '/post-task', message: 'Please log in to post a task' } });
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 10) {
      newErrors.title = 'Title must be at least 10 characters';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 30) {
      newErrors.description = 'Description must be at least 30 characters';
    }
    
    if (!formData.price) {
      newErrors.price = 'Price is required';
    } else if (isNaN(formData.price) || Number(formData.price) <= 0) {
      newErrors.price = 'Price must be a positive number';
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      setApiError(null);
      
      try {
        // Convert categoryId to number and price to float
        const taskData = {
          title: formData.title,
          description: formData.description,
          price: parseFloat(formData.price),
          categoryId: parseInt(formData.category, 10),
          location: formData.location
        };
        
        // Call API to create task
        await taskService.createTask(taskData);
        
        // Navigate to tasks page after successful submission
        navigate('/tasks', { state: { message: 'Task posted successfully!' } });
      } catch (err) {
        setApiError(err.message);
        setIsSubmitting(false);
      }
    }
  };

  const filteredCategories = categories.filter(cat => cat.name !== 'All');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Post a New Task</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
                Task Title*
              </label>
              <input
                type="text"
                id="title"
                name="title"
                className={`w-full border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                placeholder="Enter a clear title for your task"
                value={formData.title}
                onChange={handleChange}
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>
            
            <div className="mb-4">
              <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
                Description*
              </label>
              <textarea
                id="description"
                name="description"
                rows="4"
                className={`w-full border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                placeholder="Describe the task in detail..."
                value={formData.description}
                onChange={handleChange}
              ></textarea>
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description}</p>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="price" className="block text-gray-700 font-medium mb-2">
                  Price ($)*
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  min="1"
                  step="1"
                  className={`w-full border ${errors.price ? 'border-red-500' : 'border-gray-300'} rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="How much are you offering?"
                  value={formData.price}
                  onChange={handleChange}
                />
                {errors.price && (
                  <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="category" className="block text-gray-700 font-medium mb-2">
                  Category*
                </label>
                <select
                  id="category"
                  name="category"
                  className={`w-full border ${errors.category ? 'border-red-500' : 'border-gray-300'} rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="">Select a category</option>
                  {filteredCategories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-red-500 text-sm mt-1">{errors.category}</p>
                )}
              </div>
            </div>
            
            <div className="mb-6">
              <label htmlFor="location" className="block text-gray-700 font-medium mb-2">
                Location*
              </label>
              <input
                type="text"
                id="location"
                name="location"
                className={`w-full border ${errors.location ? 'border-red-500' : 'border-gray-300'} rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                placeholder="Where is this task located? (City, State or 'Remote')"
                value={formData.location}
                onChange={handleChange}
              />
              {errors.location && (
                <p className="text-red-500 text-sm mt-1">{errors.location}</p>
              )}
            </div>
            
            <div className="flex justify-end">
              <button
                type="button"
                className="px-6 py-2 mr-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                onClick={() => navigate(-1)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Posting...
                  </span>
                ) : 'Post Task'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostTask;
