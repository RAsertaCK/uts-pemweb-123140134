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
    retryFetch
  } = useNews();

  const handleCategoryChange = (category) => {
    updateFilters({
      ...filters,
      category,
      searchQuery: '' 
    });
  };

  const handleSearch = (searchQuery) => {
    updateFilters({
      ...filters,
      searchQuery,
      category: searchQuery ? '' : 'technology' 
    });
  };

  const handleDateChange = (fromDate, toDate) => {
    updateFilters({
      ...filters,
      fromDate,
      toDate
    });
  };

  const hasMore = articles.length < totalResults && !useFallback;

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
              {filters.fromDate && filters.toDate && 
                ` from ${new Date(filters.fromDate).toLocaleDateString()} to ${new Date(filters.toDate).toLocaleDateString()}`
              }
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
          onRetry={retryFetch}
        />
      </main>

      <footer className="app-footer">
        <div className="container">
          <p>
            Powered by NewsAPI • 
            {useFallback ? ' Using demo data' : ' Live news data'} • 
            Built with React & Vite
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;