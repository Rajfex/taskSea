const CategoryFilter = ({ activeCategory, setActiveCategory, categories = [] }) => {
  // Ensure categories is always an array
  const categoryArray = Array.isArray(categories) ? categories : [];
  
  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium text-gray-700 mb-3">Filter by Category</h3>
      <div className="flex flex-wrap gap-2">
        {categoryArray.map((category) => {
          // Extract category name safely whether it's a string or object
          const categoryName = typeof category === 'string' ? category : (category && category.name ? category.name : 'Unknown');
          const categoryId = typeof category === 'string' ? category : (category && category.id ? category.id : Math.random().toString());
          
          return (
            <button
              key={categoryId}
              onClick={() => setActiveCategory(categoryName)}
              className={`px-3 py-1 rounded-full text-sm ${
                activeCategory === categoryName
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {typeof categoryName === 'string' ? categoryName : 'Unknown'}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryFilter;
