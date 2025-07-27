import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Tasks from './pages/Tasks';
import TaskDetail from './pages/TaskDetail';
import PostTask from './pages/PostTask';
import MyTasks from './pages/MyTasks';
import Login from './pages/Login';
import Register from './pages/Register';
<<<<<<< HEAD
import AdminPanel from './pages/AdminPanel';
=======
>>>>>>> 91a39560325e9bb73d0a582443afddb2003bd7e7
import NotFound from './pages/NotFound';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-gray-50">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/tasks/:id" element={<TaskDetail />} />
              <Route path="/post-task" element={
                <ProtectedRoute>
                  <PostTask />
                </ProtectedRoute>
              } />
              <Route path="/my-tasks" element={
                <ProtectedRoute>
                  <MyTasks />
                </ProtectedRoute>
              } />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
<<<<<<< HEAD
              <Route path="/admin" element={
                <ProtectedRoute>
                  <AdminPanel />
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <footer className="bg-white border-t border-gray-200 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="mb-4 md:mb-0">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">TaskSea</h3>
                  <p className="text-gray-600">Connect with local help for all your tasks.</p>
                </div>
                <div className="flex space-x-6 text-sm">
                  <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Terms</a>
                  <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Privacy</a>
=======
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <footer className="bg-gray-800 text-white py-6">
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="mb-4 md:mb-0">
                  <h3 className="text-xl font-bold mb-2">Task Sea</h3>
                  <p className="text-gray-400">Connect with local help for all your tasks.</p>
                </div>
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-400 hover:text-white">Terms</a>
                  <a href="#" className="text-gray-400 hover:text-white">Privacy</a>
>>>>>>> 91a39560325e9bb73d0a582443afddb2003bd7e7
                  <a href="#" className="text-gray-400 hover:text-white">Support</a>
                </div>
              </div>
              <div className="border-t border-gray-700 mt-6 pt-6 text-center text-gray-400">
                <p>&copy; {new Date().getFullYear()} Task Sea. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
