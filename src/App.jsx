import { useNews } from './hooks/useNews';
import Header from './components/Header';
import SearchForm from './components/SearchForm';
import DateFilter from './components/DateFilter';
import NewsGrid from './components/NewsGrid';
import './App.css';

function App() {
  const {
    articles,
    loading,
    error,
    filters,
    totalResults,
    useFallback,
    updateFilters,
    loadMore,
    hasMore,
    retryWithAPI
  } = useNews();

  const handleCategoryChange = (category) => {
    updateFilters({
      ...filters,
      category,
      searchQuery: '' // Clear search when switching categories
    });
  };

  const handleSearch = (searchQuery) => {
    updateFilters({
      ...filters,
      searchQuery,
      category: searchQuery ? '' : 'technology' // Clear category when searching
    });
  };

  const handleDateChange = (fromDate, toDate) => {
    updateFilters({
      ...filters,
      fromDate,
      toDate
    });
  };

  return (
    <div className="app">
      <Header 
        activeCategory={filters.category} 
        onCategoryChange={handleCategoryChange}
        loading={loading}
      />
      
      <main className="main-content">
        <div className="filters-section">
          <SearchForm 
            onSearch={handleSearch} 
            loading={loading}
            currentQuery={filters.searchQuery}
          />
          <DateFilter 
            onDateChange={handleDateChange}
            loading={loading}
            currentDates={{ from: filters.fromDate, to: filters.toDate }}
          />
        </div>

        <div className="results-info">
          {!loading && articles.length > 0 && (
            <p>
              📊 Found {totalResults.toLocaleString()} articles
              {filters.searchQuery && ` for "${filters.searchQuery}"`}
              {filters.category && !filters.searchQuery && ` in ${filters.category}`}
              {useFallback && ' (Demo Mode)'}
            </p>
          )}
        </div>

        <NewsGrid
          articles={articles}
          loading={loading}
          error={error}
          onLoadMore={loadMore}
          hasMore={hasMore}
          useFallback={useFallback}
          onRetryWithAPI={retryWithAPI}
        />
      </main>

      <footer className="app-footer">
        <div className="container">
          <p>
            News4U - Your Daily News Portal • 
            {useFallback ? ' Using demo data' : ' Live news from NewsAPI'} • 
            Built with React & Vite
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;