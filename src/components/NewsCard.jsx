import { useState } from 'react';

const NewsCard = ({ article, index }) => {
  const [imageError, setImageError] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays} days ago`;
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Invalid date';
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const imageUrl = imageError || !article.urlToImage ? null : article.urlToImage;

  return (
    <article className="news-card">
      {imageUrl && (
        <div className="card-image">
          <img
            src={imageUrl}
            alt={article.title}
            onError={handleImageError}
            loading="lazy"
            decoding="async"
            style={{ 
              width: '100%',
              height: '100%'
            }}
          />
        </div>
      )}
      
      <div className="card-content">
        <h3 className="card-title" title={article.title}>
          {article.title}
        </h3>
        <p className="card-description" title={article.description}>
          {article.description || 'No description available for this article.'}
        </p>
        <div className="card-meta">
          <span className="card-source" title={article.source?.name}>
            📰 {article.source?.name || 'Unknown Source'}
          </span>
          <span className="card-date" title={new Date(article.publishedAt).toLocaleString()}>
            🕒 {formatDate(article.publishedAt)}
          </span>
        </div>
        {article.url && (
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="card-link"
          >
            Read Full Article →
          </a>
        )}
      </div>
    </article>
  );
};

export default NewsCard;