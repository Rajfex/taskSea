import { useState, useEffect } from 'react';
import { taskService, categoryService } from '../services/api';
import TaskCard from '../components/TaskCard';
import CategoryFilter from '../components/CategoryFilter';

const Tasks = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest, price-high, price-low
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleCategoryChange = (category) => {
    if (typeof category === 'string') {
      setActiveCategory(category);
    } else if (category && typeof category === 'object' && category.name) {
      setActiveCategory(category.name);
    } else {
      setActiveCategory('All');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let categoriesArray = [];
        try {
          const categoryData = await categoryService.getCategories();
          if (categoryData?.categories) {
            categoriesArray = Array.isArray(categoryData.categories) ? categoryData.categories : [];
          }
        } catch (categoryErr) {
          console.error("Error fetching categories:", categoryErr);
        }

        setCategories([{ id: 0, name: 'All' }, ...categoriesArray]);

        try {
          const taskData = await taskService.getTasks();
          if (taskData?.tasks) {
            setTasks(Array.isArray(taskData.tasks) ? taskData.tasks : []);
          } else {
            setTasks([]);
          }
        } catch (taskErr) {
          console.error("Error fetching tasks:", taskErr);
          setError("Failed to load tasks. Please try again later.");
          setTasks([]);
        }

      } catch (err) {
        console.error("General fetch error:", err);
        setError(err.message || "An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (categories.length === 0) return;

    const fetchFilteredTasks = async () => {
      setLoading(true);
      setError(null);
      try {
        const filters = {};

        if (activeCategory !== 'All') {
          const activeCategoryName = typeof activeCategory === 'string' ? activeCategory :
            (activeCategory?.name || 'All');

          const selectedCategory = categories.find(cat => {
            const catName = typeof cat === 'string' ? cat : (cat?.name || '');
            return catName === activeCategoryName;
          });

          if (selectedCategory?.id !== undefined) {
            filters.categoryId = selectedCategory.id;
          }
        }

        if (searchTerm.trim()) {
          filters.search = searchTerm.trim();
        }

        const taskData = await taskService.getTasks(filters);
        if (taskData?.tasks) {
          setTasks(Array.isArray(taskData.tasks) ? taskData.tasks : []);
        } else {
          setTasks([]);
        }
      } catch (err) {
        console.error("Error fetching filtered tasks:", err);
        setError(err.message || "Failed to filter tasks");
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchFilteredTasks, 300);
    return () => clearTimeout(timeoutId);
  }, [activeCategory, searchTerm, categories]);

  const filteredTasks = Array.isArray(tasks) ? tasks.filter(task => {
    if (!task) return false;
    
    // Price range filter
    if (priceRange.min && task.price < parseFloat(priceRange.min)) return false;
    if (priceRange.max && task.price > parseFloat(priceRange.max)) return false;
    
    return true;
  }) : [];

  // Sort tasks based on selected option
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    switch (sortBy) {
      case 'price-high':
        return (b.price || 0) - (a.price || 0);
      case 'price-low':
        return (a.price || 0) - (b.price || 0);
      case 'oldest':
        return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      case 'newest':
      default:
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    }
  });

  const activeCategoryName = typeof activeCategory === 'string'
    ? activeCategory
    : (activeCategory?.name || 'All');

  const noTasksMessage =
    searchTerm || activeCategoryName !== 'All'
      ? "Try changing your search filters."
      : "There are no available tasks at the moment. Please check back later.";

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Available Tasks</h1>
          <p className="text-gray-600 mt-2">
            Discover and apply for tasks that match your skills
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600">{sortedTasks.length}</div>
          <div className="text-sm text-gray-500">Tasks Available</div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:space-x-8">
        <div className="md:w-1/4 mb-8">
          <div className="sticky top-8">
            <div className="mb-6">
              <label htmlFor="search" className="block text-lg font-medium text-gray-700 mb-3">
                Search Tasks
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="search"
                  className="w-full border border-gray-300 rounded-lg py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Search by title or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5 text-gray-400" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                    />
                  </svg>
                </div>
              </div>
            </div>

            {Array.isArray(categories) && categories.length > 0 && (
              <CategoryFilter
                activeCategory={activeCategoryName}
                setActiveCategory={handleCategoryChange}
                categories={categories.map(cat => {
                  if (typeof cat === 'string') return cat;
                  if (cat && typeof cat === 'object' && cat.name) {
                    return {
                      id: cat.id || Math.random().toString(),
                      name: cat.name
                    };
                  }
                  return { id: 'unknown', name: 'Unknown' };
                })}
              />
            )}

            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h3 className="text-lg font-medium text-gray-700 mb-3">Sort & Filter</h3>
              
              {/* Sort Options */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort by</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="price-high">Highest Price</option>
                  <option value="price-low">Lowest Price</option>
                </select>
              </div>

              {/* Price Range Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="Min $"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                    className="flex-1 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="Max $"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                    className="flex-1 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setActiveCategory('All');
                    setSortBy('newest');
                    setPriceRange({ min: '', max: '' });
                  }}
                  className="mt-3 w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-700 mb-3">Task Summary</h3>
              <p className="text-gray-600">
                Found {sortedTasks.length} task{sortedTasks.length !== 1 ? 's' : ''}
                {activeCategoryName !== 'All' && ` in ${activeCategoryName}`}
                {searchTerm && ` matching "${searchTerm}"`}
              </p>
            </div>
          </div>
        </div>

        <div className="md:w-3/4">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
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
          ) : sortedTasks.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {sortedTasks.map((task, index) => (
                <TaskCard key={task.id || index} task={task} />
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
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No tasks found</h3>
              <p className="text-gray-600">{noTasksMessage}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tasks;
