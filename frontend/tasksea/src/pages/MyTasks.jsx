import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { taskService } from '../services/api';
import TaskCard from '../components/TaskCard';
import EditTaskModal from '../components/EditTaskModal';
import TaskApplicationsModal from '../components/TaskApplicationsModal';

const MyTasks = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('posted'); // 'posted' or 'applied'
  const [postedTasks, setPostedTasks] = useState([]);
  const [appliedTasks, setAppliedTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [viewingApplications, setViewingApplications] = useState(null);
  const [showApplicationsModal, setShowApplicationsModal] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserTasks();
    }
  }, [user]);

  const fetchUserTasks = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [postedResponse, appliedResponse] = await Promise.all([
        taskService.getUserPostedTasks(),
        taskService.getUserAppliedTasks()
      ]);

      setPostedTasks(postedResponse.tasks || []);
      setAppliedTasks(appliedResponse.applications || []);
    } catch (err) {
      console.error('Error fetching user tasks:', err);
      setError(err.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowEditModal(true);
  };

  const handleViewApplications = (task) => {
    setViewingApplications(task);
    setShowApplicationsModal(true);
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      await taskService.deleteTask(taskId);
      setPostedTasks(prev => prev.filter(task => task.id !== taskId));
    } catch (err) {
      console.error('Error deleting task:', err);
      alert('Failed to delete task. Please try again.');
    }
  };

  const handleTaskUpdate = (updatedTask) => {
    setPostedTasks(prev => 
      prev.map(task => task.id === updatedTask.id ? updatedTask : task)
    );
    setShowEditModal(false);
    setEditingTask(null);
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      open: 'bg-green-100 text-green-800',
      in_progress: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-blue-100 text-blue-800',
      closed: 'bg-gray-100 text-gray-800'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status] || statusColors.open}`}>
        {status?.replace('_', ' ').toUpperCase() || 'OPEN'}
      </span>
    );
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Please log in to view your tasks</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">My Tasks</h1>
        <p className="text-gray-600">Manage your posted tasks and view your applications</p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('posted')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'posted'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Posted Tasks ({postedTasks.length})
            </button>
            <button
              onClick={() => setActiveTab('applied')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'applied'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Applied Tasks ({appliedTasks.length})
            </button>
          </nav>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
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
      ) : (
        <div>
          {/* Posted Tasks Tab */}
          {activeTab === 'posted' && (
            <div>
              {postedTasks.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {postedTasks.map((task) => (
                    <div key={task.id} className="bg-white rounded-lg shadow-md p-6 border">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">{task.title}</h3>
                          <p className="text-gray-600 mb-3 line-clamp-2">{task.description}</p>
                        </div>
                        <div className="ml-4">
                          {getStatusBadge(task.status)}
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center mb-4">
                        <div className="text-2xl font-bold text-blue-600">${task.price}</div>
                        <div className="text-sm text-gray-500">
                          {task.applications?.length || 0} applications
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewApplications(task)}
                          className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
                        >
                          View Applications
                        </button>
                        <button
                          onClick={() => handleEditTask(task)}
                          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-8 text-center">
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
                      d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No posted tasks</h3>
                  <p className="text-gray-600 mb-4">You haven't posted any tasks yet.</p>
                  <a
                    href="/post-task"
                    className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Post Your First Task
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Applied Tasks Tab */}
          {activeTab === 'applied' && (
            <div>
              {appliedTasks.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {appliedTasks.map((application) => (
                    <div key={application.id} className="bg-white rounded-lg shadow-md p-6 border">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {application.task?.title}
                          </h3>
                          <p className="text-gray-600 mb-3 line-clamp-2">
                            {application.task?.description}
                          </p>
                        </div>
                        <div className="ml-4">
                          {getStatusBadge(application.status || 'pending')}
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center mb-4">
                        <div className="text-2xl font-bold text-blue-600">
                          ${application.task?.price}
                        </div>
                        <div className="text-sm text-gray-500">
                          Applied {new Date(application.createdAt).toLocaleDateString()}
                        </div>
                      </div>

                      {application.message && (
                        <div className="bg-gray-50 p-3 rounded-md mb-4">
                          <p className="text-sm text-gray-700">
                            <strong>Your message:</strong> {application.message}
                          </p>
                        </div>
                      )}

                      <div className="text-sm text-gray-500">
                        Posted by: {application.task?.poster?.name}
                      </div>

                      <div className="mt-3">
                        <a
                          href={`mailto:${application.task?.poster?.email}?subject=Regarding your task: ${application.task?.title}`}
                          className="w-full bg-blue-600 bg-opacity-90 text-white py-2 px-4 rounded-md hover:bg-blue-700 hover:bg-opacity-90 transition-all backdrop-blur-sm text-center block"
                        >
                          Email Task Poster
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-8 text-center">
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
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6M8 8v6a2 2 0 002 2h4a2 2 0 002-2V8M8 8a2 2 0 012-2h4a2 2 0 012 2"
                    />
                  </svg>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No applications</h3>
                  <p className="text-gray-600 mb-4">You haven't applied for any tasks yet.</p>
                  <a
                    href="/tasks"
                    className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Browse Available Tasks
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Edit Task Modal */}
      {showEditModal && editingTask && (
        <EditTaskModal
          task={editingTask}
          onClose={() => {
            setShowEditModal(false);
            setEditingTask(null);
          }}
          onUpdate={handleTaskUpdate}
        />
      )}

      {/* Task Applications Modal */}
      {showApplicationsModal && viewingApplications && (
        <TaskApplicationsModal
          task={viewingApplications}
          onClose={() => {
            setShowApplicationsModal(false);
            setViewingApplications(null);
          }}
        />
      )}
    </div>
  );
};

export default MyTasks;
