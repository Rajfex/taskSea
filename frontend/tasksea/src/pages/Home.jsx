import { Link } from 'react-router-dom';
import { tasks } from '../data/dummyData';
import TaskCard from '../components/TaskCard';

const Home = () => {
  // Show only a few featured tasks on the home page
  const featuredTasks = tasks.slice(0, 3);

  return (
<<<<<<< HEAD
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
=======
    <div className="container mx-auto px-4 py-8">
      <section className="flex flex-col md:flex-row items-center justify-between py-12 bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg text-white mb-12 px-8">
        <div className="md:w-1/2 mb-8 md:mb-0">
          <h1 className="text-4xl font-bold mb-4">Find Help or Earn Money with Simple Tasks</h1>
          <p className="text-lg mb-6">
            Browse local tasks, offer your skills, or post tasks you need help with. Join Task Sea today!
          </p>
          <div className="flex space-x-4">
            <Link to="/tasks" className="bg-white text-blue-600 px-6 py-2 rounded-lg font-medium hover:bg-blue-50">
              Browse Tasks
            </Link>
            <Link to="/post-task" className="bg-blue-700 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-800">
              Post a Task
            </Link>
          </div>
        </div>
        <div className="md:w-1/2">
          <img 
            src="https://via.placeholder.com/600x400?text=Task+Sea" 
            alt="Task Sea Illustration" 
            className="rounded-lg shadow-lg"
          />
        </div>
      </section>

      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Featured Tasks</h2>
          <Link to="/tasks" className="text-blue-600 hover:text-blue-800">
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredTasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </section>

      <section className="py-12 bg-gray-50 rounded-lg px-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">How Task Sea Works</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center">
            <div className="bg-blue-100 rounded-full p-4 mb-4">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-8 w-8 text-blue-600" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
                />
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" 
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Browse Tasks</h3>
            <p className="text-gray-600">
              Find tasks that match your skills and location. Filter by category to find the perfect fit.
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="bg-blue-100 rounded-full p-4 mb-4">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-8 w-8 text-blue-600" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" 
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Apply for Tasks</h3>
            <p className="text-gray-600">
              Express your interest and connect with task posters to discuss details.
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="bg-blue-100 rounded-full p-4 mb-4">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-8 w-8 text-blue-600" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Get Paid</h3>
            <p className="text-gray-600">
              Complete tasks and receive payment. Build your reputation with great reviews.
            </p>
          </div>
        </div>
      </section>
>>>>>>> 91a39560325e9bb73d0a582443afddb2003bd7e7
    </div>
  );
};

export default Home;
