import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { taskService } from '../services/api';

const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applicationLoading, setApplicationLoading] = useState(false);
  const [applicationError, setApplicationError] = useState(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applicationMessage, setApplicationMessage] = useState('');
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await taskService.getTask(id);
        setTask(response.task);
        
        // Check if current user has already applied
        if (user && response.task.applications) {
          const userApplication = response.task.applications.find(
            app => app.applicant.id === user.id
          );
          setHasApplied(!!userApplication);
        }
      } catch (err) {
        console.error('Error fetching task:', err);
        setError(err.message || 'Failed to load task details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTask();
    }
  }, [id, user]);

  const handleApplyForTask = async () => {
    setApplicationLoading(true);
    setApplicationError(null);
    
    try {
      await taskService.applyForTask(task.id, applicationMessage.trim());
      setHasApplied(true);
      setShowApplicationForm(false);
      setApplicationMessage('');
    } catch (err) {
      setApplicationError(err.message || 'Failed to apply for task');
      console.error('Error applying for task:', err);
    } finally {
      setApplicationLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Unknown date';
    }
  };

  const formatPrice = (price) => {
    const numPrice = parseFloat(price);
    return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2);
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'open':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'assigned':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">Error</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/tasks')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Tasks
          </button>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500 text-xl mb-4">Task not found</div>
          <button
            onClick={() => navigate('/tasks')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Tasks
          </button>
        </div>
      </div>
    );
  }

  const isTaskOwner = user && task.poster && user.id === task.poster.id;
  const canApply = user && !isTaskOwner && task.status === 'open' && !hasApplied;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Navigation */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link to="/tasks" className="hover:text-blue-600 transition-colors">
            Tasks
          </Link>
          <span>›</span>
          <span className="text-gray-900 font-medium">{task.title}</span>
        </nav>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold mb-2">{task.title}</h1>
                  <div className="flex items-center space-x-4 text-blue-100">
                    <div className="flex items-center">
                      <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {task.location}
                    </div>
                    <div className="flex items-center">
                      <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      {task.category?.name || 'Uncategorized'}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold mb-1">${formatPrice(task.price)}</div>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getStatusStyle(task.status)}`}>
                    {task.status?.charAt(0).toUpperCase() + task.status?.slice(1)}
                  </span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2">
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
                    <div className="prose prose-gray max-w-none">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{task.description}</p>
                    </div>
                  </div>

                  {/* Application Form */}
                  {canApply && (
                    <div className="bg-blue-50 rounded-lg p-6 mb-8">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Apply for this task</h3>
                      
                      {!showApplicationForm ? (
                        <button
                          onClick={() => setShowApplicationForm(true)}
                          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
                        >
                          Apply Now
                        </button>
                      ) : (
                        <div>
                          <textarea
                            value={applicationMessage}
                            onChange={(e) => setApplicationMessage(e.target.value)}
                            placeholder="Tell the task poster why you're interested and what makes you the right person for this job..."
                            className="w-full border border-gray-300 rounded-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                            rows={6}
                          />
                          
                          {applicationError && (
                            <div className="mt-2 text-sm text-red-600">
                              {applicationError}
                            </div>
                          )}
                          
                          <div className="flex justify-end space-x-3 mt-4">
                            <button
                              onClick={() => {
                                setShowApplicationForm(false);
                                setApplicationMessage('');
                                setApplicationError(null);
                              }}
                              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={handleApplyForTask}
                              disabled={applicationLoading || !applicationMessage.trim()}
                              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                            >
                              {applicationLoading ? (
                                <>
                                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  Submitting...
                                </>
                              ) : (
                                'Submit Application'
                              )}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {hasApplied && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
                      <div className="flex items-center">
                        <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-green-800 font-medium">You have already applied for this task</span>
                      </div>
                    </div>
                  )}

                  {!user && task.status === 'open' && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
                      <p className="text-yellow-800">
                        <Link to="/login" className="font-medium underline hover:text-yellow-900">
                          Login
                        </Link> to apply for this task
                      </p>
                    </div>
                  )}
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1">
                  <div className="bg-gray-50 rounded-lg p-6 sticky top-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Details</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Posted by</dt>
                        <dd className="mt-1 text-sm text-gray-900">{task.poster?.name || 'Anonymous'}</dd>
                      </div>
                      
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Posted on</dt>
                        <dd className="mt-1 text-sm text-gray-900">{formatDate(task.createdAt)}</dd>
                      </div>
                      
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Category</dt>
                        <dd className="mt-1 text-sm text-gray-900">{task.category?.name || 'Uncategorized'}</dd>
                      </div>
                      
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Location</dt>
                        <dd className="mt-1 text-sm text-gray-900">{task.location}</dd>
                      </div>
                      
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Budget</dt>
                        <dd className="mt-1 text-lg font-semibold text-green-600">${formatPrice(task.price)}</dd>
                      </div>

                      {task.applications && task.applications.length > 0 && (
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Applications</dt>
                          <dd className="mt-1 text-sm text-gray-900">{task.applications.length} applicant{task.applications.length !== 1 ? 's' : ''}</dd>
                        </div>
                      )}
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <a
                        href={`mailto:${task.poster?.email || 'contact@example.com'}?subject=Regarding your task: ${task.title}`}
                        className="w-full inline-flex justify-center items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                      >
                        <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Contact Poster
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;
