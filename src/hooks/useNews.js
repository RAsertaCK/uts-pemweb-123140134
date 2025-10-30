import { useState, useEffect, useCallback } from 'react';
import { FALLBACK_ARTICLES } from '../utils/constants';

const API_KEY = import.meta.env.VITE_NEWS_API_KEY;

export const useNews = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [filters, setFilters] = useState({
    category: 'technology',
    searchQuery: '',
    fromDate: '',
    toDate: ''
  });
  const [useFallback, setUseFallback] = useState(false);

  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
  };

  const fetchNews = useCallback(async (page = 1, append = false) => {
    if (!API_KEY || useFallback) {
      setLoading(false);
      setArticles(FALLBACK_ARTICLES);
      setTotalResults(FALLBACK_ARTICLES.length);
      setCurrentPage(page);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        apiKey: API_KEY,
        pageSize: 12,
        page: page,
        language: 'en',
        sortBy: 'publishedAt'
      });

      if (filters.searchQuery) {
        params.append('q', filters.searchQuery);
      } else {
        params.append('category', filters.category);
        params.append('country', 'us'); // Untuk top-headlines
      }

      if (filters.fromDate) {
        params.append('from', filters.fromDate);
      }

      if (filters.toDate) {
        params.append('to', filters.toDate);
      }

      const endpoint = filters.searchQuery ? 'everything' : 'top-headlines';
      const url = `https://newsapi.org/v2/${endpoint}?${params}`;

      console.log('Fetching from:', url); // Untuk debugging

      const response = await fetch(url);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API request failed with status ${response.status}: ${errorText}`);
      }

      const data = await response.json();

      if (data.status === 'error') {
        if (data.message.includes('rate limited') || data.code === 'rateLimited') {
          setUseFallback(true);
          setArticles(FALLBACK_ARTICLES);
          setTotalResults(FALLBACK_ARTICLES.length);
          return;
        }
        throw new Error(data.message || 'Unknown API error');
      }

      if (append) {
        setArticles(prev => {
          const newArticles = [...prev, ...(data.articles || [])];
          return newArticles.filter((article, index, self) => 
            index === self.findIndex(a => a.url === article.url)
          );
        });
      } else {
        setArticles(data.articles || []);
        setTotalResults(data.totalResults || 0);
      }
      setCurrentPage(page);
    } catch (err) {
      console.error('Error fetching news:', err);
      setError(err.message);
      
      if (!append) {
        setUseFallback(true);
        setArticles(FALLBACK_ARTICLES);
        setTotalResults(FALLBACK_ARTICLES.length);
      }
    } finally {
      setLoading(false);
    }
  }, [filters, useFallback]);

  const debouncedFetchNews = useCallback(debounce(fetchNews, 500), [fetchNews]);

  const updateFilters = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
    setUseFallback(false);
  };

  const loadMore = () => {
    if (!loading && articles.length < totalResults && !useFallback) {
      fetchNews(currentPage + 1, true);
    }
  };

  const retryFetch = () => {
    setUseFallback(false);
    setError(null);
    fetchNews(1, false);
  };

  useEffect(() => {
    if (filters.searchQuery) {
      debouncedFetchNews(1, false);
    } else {
      fetchNews(1, false);
    }
  }, [filters, fetchNews, debouncedFetchNews]);

  return {
    articles,
    loading,
    error,
    filters,
    currentPage,
    totalResults,
    useFallback,
    updateFilters,
    loadMore,
    retryFetch,
    fetchNews
  };
};