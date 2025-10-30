import { useState, useEffect } from 'react';

const SearchForm = ({ onSearch, loading, currentQuery }) => {
  const [query, setQuery] = useState(currentQuery || '');

  useEffect(() => {
    setQuery(currentQuery || '');
  }, [currentQuery]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (!value.trim()) {
      onSearch('');
    }
  };

  return (
    <div className="search-form">
      <form onSubmit={handleSubmit}>
        <div className="search-input-group">
          <div className="search-icon">🔍</div>
          <input
            type="text"
            placeholder="Search for news articles..."
            value={query}
            onChange={handleInputChange}
            className="search-input"
            disabled={loading}
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="clear-button"
              disabled={loading}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
          <button 
            type="submit" 
            className="search-button"
            disabled={loading}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>
      {query && (
        <div className="search-hint">
          Press Enter to search or clear to see category news
        </div>
      )}
    </div>
  );
};

export default SearchForm;