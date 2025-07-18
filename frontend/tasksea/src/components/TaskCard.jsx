import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { taskService } from '../services/api';

const TaskCard = ({ task = {} }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [interested, setInterested] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applicationMessage, setApplicationMessage] = useState('');
  
  // Ensure task has all required properties with proper API structure mapping
  const safeTask = {
    id: task.id,
    title: task.title || 'Untitled Task',
    price: task.price || 0,
    description: task.description || 'No description available',
    location: task.location || 'Remote',
    category: task.category || 'Uncategorized',
    status: task.status || 'open',
    // Map API fields for poster information
    postedBy: task.poster ? task.poster.name : (task.postedBy || 'Anonymous'),
    postedDate: task.createdAt || task.postedDate,
    // Keep original task data
    ...task
  };

  const handleInterestClick = async () => {
    if (!user || safeTask.status !== 'open') return;
    
    if (!interested) {
      // Show application form
      setShowApplicationForm(true);
    } else {
      // In a real app, you might want to handle withdrawing application
      setInterested(false);
    }
  };

  const handleCardClick = (e) => {
    // Don't navigate if clicking on buttons or form elements
    if (e.target.closest('button') || e.target.closest('a') || e.target.closest('textarea')) {
      return;
    }
    navigate(`/tasks/${safeTask.id}`);
  };

  const handleSubmitApplication = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Apply for the task with the message
      await taskService.applyForTask(safeTask.id, applicationMessage.trim());
      setInterested(true);
      setShowApplicationForm(false);
      setApplicationMessage('');
    } catch (err) {
      setError(err.message || 'Failed to apply for task');
      console.error('Error applying for task:', err);
    } finally {
      setLoading(false);
    }
  };

  // Format the posted date
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Unknown date';
    }
  };

  // Format price display
  const formatPrice = (price) => {
    const numPrice = parseFloat(price);
    return isNaN(numPrice) ? '0' : numPrice.toFixed(2);
  };

  // Get status badge styling
  const getStatusStyle = (status) => {
    switch (status) {
      case 'open':
        return 'bg-green-100 text-green-800';
      case 'assigned':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-semibold text-gray-800 flex-1 mr-3">{safeTask.title}</h3>
          <div className="flex flex-col items-end space-y-2">
            <span className="bg-green-100 text-green-800 text-lg font-bold px-3 py-1 rounded-full">
              ${formatPrice(safeTask.price)}
            </span>
            <span className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${getStatusStyle(safeTask.status)}`}>
              {safeTask.status}
            </span>
          </div>
        </div>
        
        <p className="text-gray-600 mb-4 overflow-hidden" style={{
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          maxHeight: '4.5rem'
        }}>{safeTask.description}</p>
        
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-500 mb-4">
          <div className="flex items-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-4 w-4 mr-2 flex-shrink-0" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" 
              />
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" 
              />
            </svg>
            <span className="truncate">{safeTask.location}</span>
          </div>
          <div className="flex items-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-4 w-4 mr-2 flex-shrink-0" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" 
              />
            </svg>
            <span className="truncate">{safeTask.category.name}</span>
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm text-gray-500">
              <div className="font-medium text-gray-700">Posted by {safeTask.postedBy}</div>
              <div>{formatDate(safeTask.postedDate)}</div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => navigate(`/tasks/${safeTask.id}`)}
                className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm"
              >
                View Details
              </button>
              {/* <a
                href={`mailto:${safeTask.poster?.email || 'contact@example.com'}?subject=Inquiry about: ${safeTask.title}`}
                className="px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors text-sm"
                title="Send email to task poster"
              >
                Email Poster
              </a> */}
              <button
                onClick={handleInterestClick}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  interested
                    ? 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                } ${!user || safeTask.status !== 'open' || loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={!user || safeTask.status !== 'open' || loading}
                title={!user ? 'Login to express interest' : safeTask.status !== 'open' ? 'Task is not available' : ''}
              >
                {interested ? 'Applied ✓' : safeTask.status === 'open' ? "Apply Now" : 'Not Available'}
              </button>
            </div>
          </div>

          {/* Application Form */}
          {showApplicationForm && !interested && (
            <div className="bg-gray-50 rounded-lg p-4 mb-3">
              <h4 className="font-medium text-gray-800 mb-3">Submit your application</h4>
              <textarea
                value={applicationMessage}
                onChange={(e) => setApplicationMessage(e.target.value)}
                placeholder="Tell the task poster why you're interested and what makes you the right person for this job..."
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                rows={4}
              />
              <div className="flex justify-end space-x-2 mt-3">
                <button
                  onClick={() => {
                    setShowApplicationForm(false);
                    setApplicationMessage('');
                  }}
                  className="px-3 py-1 text-sm bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitApplication}
                  disabled={loading || !applicationMessage.trim()}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-1 h-3 w-3" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </div>
                  ) : (
                    'Submit Application'
                  )}
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-2 text-xs text-red-600 text-center">
              {error}
            </div>
          )}
          {!user && (
            <p className="text-xs text-center mt-2 text-gray-500">
              Login to apply for tasks
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
