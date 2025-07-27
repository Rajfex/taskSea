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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const tasksPerPage = 10;

  const handleCategoryChange = (category) => {
    if (typeof category === 'string') {
      setActiveCategory(category);
    } else if (category && typeof category === 'object' && category.name) {
      setActiveCategory(category.name);
    } else {
      setActiveCategory('All');
    }
    setCurrentPage(1); // Reset to first page when changing category
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
        const filters = {
          page: currentPage,
          limit: tasksPerPage
        };

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

        // Dodaj sortowanie do API (tylko dla dat)
        if (sortBy === 'oldest' || sortBy === 'newest') {
          filters.sortBy = sortBy;
        }

        const taskData = await taskService.getTasks(filters);
        if (taskData?.tasks) {
          setTasks(Array.isArray(taskData.tasks) ? taskData.tasks : []);
          setTotalCount(taskData.totalCount || 0);
          setTotalPages(taskData.totalPages || 1);
        } else {
          setTasks([]);
          setTotalCount(0);
          setTotalPages(1);
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
  }, [activeCategory, searchTerm, categories, currentPage, sortBy]);

  // Reset page when price range changes
  useEffect(() => {
    if (priceRange.min || priceRange.max) {
      setCurrentPage(1);
    }
  }, [priceRange]);

  // Sort tasks based on selected option (tylko lokalne sortowanie po cenie)
  const sortedTasks = [...tasks].sort((a, b) => {
    switch (sortBy) {
      case 'price-high':
        return (b.price || 0) - (a.price || 0);
      case 'price-low':
        return (a.price || 0) - (b.price || 0);
      // Sortowanie po dacie będzie obsługiwane przez API
      case 'oldest':
      case 'newest':
      default:
        return 0; // Nie sortujemy lokalnie - API robi to za nas
    }
  });

  // Apply price range filter (lokalne filtrowanie po cenie)
  const filteredTasks = sortedTasks.filter(task => {
    if (!task) return false;
    
    // Price range filter
    if (priceRange.min && task.price < parseFloat(priceRange.min)) return false;
    if (priceRange.max && task.price > parseFloat(priceRange.max)) return false;
    
    return true;
  });

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0); // Scroll to top when changing pages
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setCurrentPage(1); // Reset to first page when sorting changes
  };

  const handlePriceRangeChange = (field, value) => {
    setPriceRange(prev => ({ ...prev, [field]: value }));
    setCurrentPage(1); // Reset to first page when price filter changes
  };

  const activeCategoryName = typeof activeCategory === 'string'
    ? activeCategory
    : (activeCategory?.name || 'All');

  const noTasksMessage =
    searchTerm || activeCategoryName !== 'All'
      ? "Try changing your search filters."
      : "There are no available tasks at the moment. Please check back later.";

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Find Tasks</h1>
              <p className="text-gray-600 mt-2">
                Discover opportunities that match your skills
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{totalCount}</div>
              <div className="text-sm text-gray-500">Available</div>
            </div>
          </div>
        </div>

        <div className="md:flex grid gap-8">
          {/* Sidebar Filters */}
          <div className="md:w-80 w-full flex-shrink-0">
            <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Filter</h2>
              
              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search
                </label>
                <div className="relative">
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Search tasks..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Category</label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {Array.isArray(categories) && categories.map((category) => {
                    const categoryName = typeof category === 'string' ? category : (category?.name || 'Unknown');
                    const isActive = activeCategoryName === categoryName;
                    
                    return (
                      <button
                        key={category.id || categoryName}
                        onClick={() => handleCategoryChange(category)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          isActive
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'text-gray-600 hover:bg-gray-50 border border-transparent'
                        }`}
                      >
                        {categoryName}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Price Range</label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <input
                      type="number"
                      placeholder="$Min"
                      value={priceRange.min}
                      onChange={(e) => handlePriceRangeChange('min', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="number"
                      placeholder="$Max"
                      value={priceRange.max}
                      onChange={(e) => handlePriceRangeChange('max', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Sort */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort by</label>
                <select
                  value={sortBy}
                  onChange={handleSortChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="price-high">Highest Price</option>
                  <option value="price-low">Lowest Price</option>
                </select>
              </div>

              {/* Clear Filters */}
              <button
                onClick={() => {
                  setSearchTerm('');
                  setActiveCategory('All');
                  setSortBy('newest');
                  setPriceRange({ min: '', max: '' });
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors text-sm"
              >
                Clear All Filters
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex">
                  <svg className="h-5 w-5 text-red-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="ml-3 text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
              </div>
            ) : filteredTasks.length > 0 ? (
              <>
                {/* Results Info */}
                <div className="mb-6 flex justify-between items-center">
                  <p className="text-gray-600">
                    Showing {((currentPage - 1) * tasksPerPage) + 1}-{Math.min(currentPage * tasksPerPage, totalCount)} of {totalCount} tasks
                  </p>
                  <p className="text-sm text-gray-500">
                    Page {currentPage} of {totalPages}
                  </p>
                </div>

                {/* Tasks Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  {filteredTasks.map((task, index) => (
                    <TaskCard key={task.id || index} task={task} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center space-x-2">
                    {/* Previous Button */}
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        currentPage === 1
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      Previous
                    </button>

                    {/* Page Numbers */}
                    {[...Array(totalPages)].map((_, index) => {
                      const page = index + 1;
                      const isCurrentPage = page === currentPage;
                      
                      // Show first page, last page, current page, and pages around current
                      const showPage = page === 1 || 
                                      page === totalPages || 
                                      (page >= currentPage - 2 && page <= currentPage + 2);
                      
                      if (!showPage) {
                        // Show ellipsis for gaps
                        if (page === currentPage - 3 || page === currentPage + 3) {
                          return (
                            <span key={page} className="px-2 text-gray-400">
                              ...
                            </span>
                          );
                        }
                        return null;
                      }

                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-2 rounded-md text-sm font-medium ${
                            isCurrentPage
                              ? 'bg-blue-600 text-white'
                              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}

                    {/* Next Button */}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        currentPage === totalPages
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No tasks found</h3>
                <p className="text-gray-600">{noTasksMessage}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tasks;
