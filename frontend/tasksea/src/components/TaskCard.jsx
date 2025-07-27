import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
      className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer group"
      onClick={handleCardClick}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex-1 mr-3 group-hover:text-blue-600 transition-colors">
            {safeTask.title}
          </h3>
          <div className="flex flex-col items-end space-y-2">
            <span className="bg-blue-50 text-blue-700 text-lg font-bold px-3 py-1 rounded-lg border border-blue-200">
              ${formatPrice(safeTask.price)}
            </span>
            <span className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${getStatusStyle(safeTask.status)}`}>
              {safeTask.status}
            </span>
          </div>
        </div>
        
        {/* Description */}
        <p className="text-gray-600 mb-4 leading-relaxed" style={{
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {safeTask.description}
        </p>
        
        {/* Meta Information */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
            <span className="font-medium">{safeTask.category.name}</span>
          </div>
          <div className="flex items-center">
            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{safeTask.location}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 pt-4">
          <div className="flex items-center justify-between">
            {/* Posted by info */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-semibold">
                  {safeTask.postedBy?.charAt(0)?.toUpperCase() || 'A'}
                </span>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">{safeTask.postedBy}</div>
                <div className="text-xs text-gray-500">{formatDate(safeTask.postedDate)}</div>
              </div>
            </div>
            
            {/* Action Button */}
            <button
              onClick={handleInterestClick}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                interested
                  ? 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100'
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
              } ${!user || safeTask.status !== 'open' || loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={!user || safeTask.status !== 'open' || loading}
              title={!user ? 'Login to apply' : safeTask.status !== 'open' ? 'Task not available' : ''}
            >
              {interested ? 'Applied ✓' : safeTask.status === 'open' ? "Apply" : 'Unavailable'}
            </button>
          </div>

          {/* Application Form */}
          {showApplicationForm && !interested && (
            <div className="bg-gray-50 rounded-lg p-4 mt-4">
              <h4 className="font-medium text-gray-900 mb-3">Submit Application</h4>
              <textarea
                value={applicationMessage}
                onChange={(e) => setApplicationMessage(e.target.value)}
                placeholder="Tell the poster why you're the right person for this job..."
                className="w-full border border-gray-200 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-sm"
                rows={3}
              />
              <div className="flex justify-end space-x-2 mt-3">
                <button
                  onClick={() => {
                    setShowApplicationForm(false);
                    setApplicationMessage('');
                  }}
                  className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitApplication}
                  disabled={loading || !applicationMessage.trim()}
                  className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-2 text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
              {error}
            </div>
          )}
          
          {!user && (
            <p className="text-xs text-center mt-2 text-gray-500">
              <Link to="/login" className="text-blue-600 hover:text-blue-700">Sign in</Link> to apply for tasks
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
