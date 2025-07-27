import { Link } from 'react-router-dom';
import { tasks } from '../data/dummyData';
import TaskCard from '../components/TaskCard';

const Home = () => {
  // Show only a few featured tasks on the home page
  const featuredTasks = tasks.slice(0, 3);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-teal-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 mb-12 lg:mb-0">
              <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Find Help or
                <span className="block text-teal-300">Earn Money</span>
                with Tasks
              </h1>
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                Connect with your community. Post tasks you need help with or offer your skills to earn extra income.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/tasks" 
                  className="bg-white text-blue-700 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors shadow-lg"
                >
                  Browse Tasks
                </Link>
                <Link 
                  to="/post-task" 
                  className="bg-teal-500 text-white px-8 py-4 rounded-xl font-semibold hover:bg-teal-600 transition-colors shadow-lg"
                >
                  Post a Task
                </Link>
              </div>
            </div>
            <div className="lg:w-1/2 lg:pl-12">
              <div className="relative">
                <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-auto">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-teal-600 rounded-xl flex items-center justify-center">
                      <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="font-semibold text-gray-900">Task Completed</h3>
                      <p className="text-sm text-gray-600">Garden cleanup</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-300 rounded-full mr-3"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Sarah M.</p>
                        <p className="text-xs text-gray-500">5.0 ⭐ rating</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">$85</p>
                      <p className="text-xs text-gray-500">earned</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Featured Tasks */}
        <section className="py-16">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Featured Tasks</h2>
              <p className="text-gray-600 mt-2">Popular opportunities in your area</p>
            </div>
            <Link 
              to="/tasks" 
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
            >
              View All
              <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTasks.map(task => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </section>

        {/* How it Works */}
        <section className="py-16 bg-white rounded-2xl border border-gray-200 mb-16">
          <div className="px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">How TaskSea Works</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Getting started is simple. Follow these three easy steps to begin earning or getting help.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Browse & Search</h3>
                <p className="text-gray-600 leading-relaxed">
                  Find tasks that match your skills and interests. Filter by category, location, and price.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-100 to-teal-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg className="h-8 w-8 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Apply & Connect</h3>
                <p className="text-gray-600 leading-relaxed">
                  Send proposals for tasks you want to do. Chat with task posters to discuss details.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Complete & Earn</h3>
                <p className="text-gray-600 leading-relaxed">
                  Complete the task, get paid securely, and build your reputation with great reviews.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
