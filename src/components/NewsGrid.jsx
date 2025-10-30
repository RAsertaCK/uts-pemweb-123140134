import { useEffect, useRef } from 'react';
import NewsCard from './NewsCard';

const NewsGrid = ({ 
  articles, 
  loading, 
  error, 
  onLoadMore, 
  hasMore, 
  useFallback,
  onRetryWithAPI
}) => {
  const observerRef = useRef();
  const lastArticleRef = useRef();

  useEffect(() => {
    if (loading || !hasMore) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (lastArticleRef.current) {
      observerRef.current.observe(lastArticleRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loading, hasMore, onLoadMore, articles.length]);

  if (error && !useFallback) {
    return (
      <div className="error-message">
        <div className="error-icon">⚠️</div>
        <h2>API Connection Issue</h2>
        <p>{error}</p>
        <p className="error-help">
          This might be due to CORS restrictions or API rate limits.
        </p>
        <div className="error-actions">
          <button onClick={onRetryWithAPI} className="retry-button">
            🔄 Try API Again
          </button>
        </div>
      </div>
    );
  }

  if (!loading && articles.length === 0) {
    return (
      <div className="no-articles">
        <div className="no-articles-icon">📰</div>
        <h2>No articles found</h2>
        <p>Try changing your search criteria or category.</p>
      </div>
    );
  }

  return (
    <div className="news-grid-container">
      {useFallback && (
        <div className="demo-notice">
          <span className="demo-badge">DEMO</span>
          Showing demo data - API might be restricted
        </div>
      )}
      
      <div className="news-grid">
        {articles.map((article, index) => (
          <div
            key={`${article.url}-${index}-${article.publishedAt}`}
            ref={index === articles.length - 1 ? lastArticleRef : null}
          >
            <NewsCard article={article} index={index} />
          </div>
        ))}
      </div>
      
      {loading && (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>
            {useFallback ? 'Loading demo articles...' : 'Fetching latest news...'}
          </p>
        </div>
      )}
      
      {!hasMore && articles.length > 0 && (
        <div className="end-message">
          <div className="end-icon">🎉</div>
          <p>You've reached the end!</p>
          <small>
            {articles.length} articles loaded • 
            Source: {useFallback ? 'Demo Data' : 'NewsAPI'}
          </small>
        </div>
      )}
    </div>
  );
};

export default NewsGrid;