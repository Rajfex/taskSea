import { Link } from 'react-router-dom';
import { tasks } from '../data/dummyData';
import TaskCard from '../components/TaskCard';

const Home = () => {
  // Show only a few featured tasks on the home page
  const featuredTasks = tasks.slice(0, 3);

  return (
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
    </div>
  );
};

export default Home;
