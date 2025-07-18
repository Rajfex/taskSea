import { useState, useEffect } from 'react';
import { taskService } from '../services/api';

const TaskApplicationsModal = ({ task, onClose }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState({});

  useEffect(() => {
    if (task?.id) {
      fetchApplications();
    }
  }, [task]);

  const fetchApplications = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await taskService.getTaskApplications(task.id);
      setApplications(response.applications || []);
    } catch (err) {
      console.error('Error fetching applications:', err);
      setError(err.message || 'Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (applicationId, status) => {
    setUpdatingStatus(prev => ({ ...prev, [applicationId]: status }));
    
    try {
      await taskService.updateApplicationStatus(task.id, applicationId, status);
      
      // Update the application status in the local state
      setApplications(prev => 
        prev.map(app => 
          app.id === applicationId 
            ? { ...app, status } 
            : app
        )
      );
    } catch (err) {
      console.error(`Error ${status === 'accepted' ? 'accepting' : 'rejecting'} application:`, err);
      setError(err.message || `Failed to ${status === 'accepted' ? 'accept' : 'reject'} application`);
    } finally {
      setUpdatingStatus(prev => {
        const updated = { ...prev };
        delete updated[applicationId];
        return updated;
      });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Unknown date';
    }
  };

  return (
    <>
      {/* Transparent Background Overlay */}
      <div className="fixed inset-0 bg-transparent bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-white bg-opacity-95 backdrop-blur-md rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white border-opacity-30">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Applications for "{task?.title}"</h2>
                <p className="text-gray-600 mt-1">{applications.length} applicant{applications.length !== 1 ? 's' : ''}</p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : applications.length > 0 ? (
              <div className="space-y-4">
                {applications.map((application) => (
                  <div key={application.id} className="bg-white bg-opacity-70 backdrop-blur-sm rounded-lg p-6 border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                            <span className="text-blue-600 font-semibold text-lg">
                              {application.applicant?.name?.charAt(0)?.toUpperCase() || 'A'}
                            </span>
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {application.applicant?.name || 'Anonymous'}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {application.applicant?.email}
                            </p>
                          </div>
                        </div>
                        
                        {application.message && (
                          <div className="bg-gray-50 bg-opacity-80 p-3 rounded-md mb-3">
                            <p className="text-sm text-gray-700">
                              <strong>Message:</strong> {application.message}
                            </p>
                          </div>
                        )}
                        
                        <div className="text-sm text-gray-500">
                          Applied on {formatDate(application.createdAt)}
                        </div>
                      </div>
                      
                      <div className="ml-4 space-y-2">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          application.status === 'accepted' ? 'bg-green-100 text-green-800' :
                          application.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {application.status === 'pending' ? 'Pending' : 
                           application.status === 'accepted' ? 'Accepted' : 
                           application.status === 'rejected' ? 'Rejected' : 'Pending'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleStatusUpdate(application.id, 'accepted')}
                        disabled={updatingStatus[application.id] || application.status === 'accepted'}
                        className={`flex-1 py-2 px-4 rounded-md transition-all backdrop-blur-sm ${
                          application.status === 'accepted'
                            ? 'bg-green-300 bg-opacity-90 text-green-800 cursor-not-allowed'
                            : updatingStatus[application.id] === 'accepted'
                            ? 'bg-green-400 bg-opacity-90 text-white cursor-not-allowed'
                            : 'bg-green-600 bg-opacity-90 text-white hover:bg-green-700 hover:bg-opacity-90'
                        }`}
                      >
                        {updatingStatus[application.id] === 'accepted' ? 'Accepting...' : 
                         application.status === 'accepted' ? 'Accepted' : 'Accept'}
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(application.id, 'rejected')}
                        disabled={updatingStatus[application.id] || application.status === 'rejected'}
                        className={`flex-1 py-2 px-4 rounded-md transition-all backdrop-blur-sm ${
                          application.status === 'rejected'
                            ? 'bg-red-300 bg-opacity-90 text-red-800 cursor-not-allowed'
                            : updatingStatus[application.id] === 'rejected'
                            ? 'bg-red-400 bg-opacity-90 text-white cursor-not-allowed'
                            : 'bg-red-600 bg-opacity-90 text-white hover:bg-red-700 hover:bg-opacity-90'
                        }`}
                      >
                        {updatingStatus[application.id] === 'rejected' ? 'Rejecting...' : 
                         application.status === 'rejected' ? 'Rejected' : 'Reject'}
                      </button>
                      <a
                        href={`mailto:${application.applicant?.email}?subject=Regarding your application for: ${task?.title}`}
                        className="flex-1 bg-blue-600 bg-opacity-90 text-white py-2 px-4 rounded-md hover:bg-blue-700 hover:bg-opacity-90 transition-all backdrop-blur-sm text-center"
                      >
                        Send Email
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 bg-opacity-80 backdrop-blur-sm rounded-lg p-8 text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 text-gray-400 mx-auto mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No applications yet</h3>
                <p className="text-gray-600">This task hasn't received any applications yet.</p>
              </div>
            )}

            <div className="flex justify-end pt-6">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gray-600 bg-opacity-90 text-white rounded-md hover:bg-gray-700 hover:bg-opacity-90 transition-all backdrop-blur-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TaskApplicationsModal;
