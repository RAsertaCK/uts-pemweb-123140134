import { useEffect, useRef, useState } from 'react';
import NewsCard from './NewsCard';

const NewsGrid = ({ articles, loading, error, onLoadMore, hasMore, useFallback, onRetry }) => {
  const observerRef = useRef();
  const lastArticleRef = useRef();
  const [visibleArticles, setVisibleArticles] = useState(8); // Initial visible articles

  useEffect(() => {
    if (loading || !hasMore) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onLoadMore();
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
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

  useEffect(() => {
    setVisibleArticles(8);
  }, [articles]);

  const loadMoreManual = () => {
    setVisibleArticles(prev => prev + 8);
  };

  const displayArticles = articles.slice(0, visibleArticles);
  const canLoadMore = visibleArticles < articles.length;

  if (error && !useFallback) {
    return (
      <div className="error-message">
        <div className="error-icon">⚠️</div>
        <h2>Error Loading News</h2>
        <p>{error}</p>
        <div className="error-actions">
          <button onClick={onRetry} className="retry-button">
            Try Again
          </button>
          <button onClick={() => onRetry()} className="fallback-button">
            Use Demo Data
          </button>
        </div>
        <p className="error-help">
          This might be due to API rate limits. You can try again or use demo data.
        </p>
      </div>
    );
  }

  if (!loading && articles.length === 0) {
    return (
      <div className="no-articles">
        <div className="no-articles-icon">📰</div>
        <h2>No articles found</h2>
        <p>Try changing your search criteria, date range, or category.</p>
      </div>
    );
  }

  return (
    <div className="news-grid-container">
      {useFallback && (
        <div className="demo-notice">
          <span className="demo-badge">DEMO</span>
          Using demo data. API limit may be reached.
        </div>
      )}
      
      <div className="news-grid">
        {displayArticles.map((article, index) => (
          <div
            key={`${article.url}-${index}-${article.publishedAt}`}
            ref={index === displayArticles.length - 1 ? lastArticleRef : null}
          >
            <NewsCard article={article} index={index} />
          </div>
        ))}
      </div>
      
      {loading && (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading more articles...</p>
        </div>
      )}
      
      {canLoadMore && !loading && (
        <div className="load-more-section">
          <button onClick={loadMoreManual} className="load-more-button">
            Load More Articles ({articles.length - visibleArticles} remaining)
          </button>
        </div>
      )}
      
      {!hasMore && articles.length > 0 && !canLoadMore && (
        <div className="end-message">
          <div className="end-icon">🎉</div>
          <p>You've reached the end of the news!</p>
          <small>{articles.length} articles loaded</small>
        </div>
      )}
    </div>
  );
};

export default NewsGrid;