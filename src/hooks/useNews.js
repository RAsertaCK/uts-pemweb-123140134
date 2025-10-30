import { useState, useEffect, useCallback } from 'react';
import { FALLBACK_ARTICLES } from '../utils/constants';

const API_KEY = '00b9a376c6a24f96afddfa5c1f430726';

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
  const [cache, setCache] = useState({});

  const buildApiUrl = (endpoint, params) => {
    const baseUrl = '/newsapi';
    const queryString = new URLSearchParams({
      ...params,
      apiKey: API_KEY
    }).toString();
    
    return `${baseUrl}/${endpoint}?${queryString}`;
  };

  const fetchNews = useCallback(async (page = 1, append = false) => {
    const cacheKey = `${filters.category}-${filters.searchQuery}-${page}`;
    const CACHE_DURATION = 5 * 60 * 1000;
    
    if (cache[cacheKey] && !append && (Date.now() - cache[cacheKey].timestamp < CACHE_DURATION)) {
      console.log('📦 Using cached data for:', cacheKey);
      setArticles(cache[cacheKey].articles);
      setTotalResults(cache[cacheKey].totalResults);
      setUseFallback(false);
      setLoading(false);
      return;
    }

    console.log('🚀 Starting API fetch...', { 
      category: filters.category, 
      page,
      searchQuery: filters.searchQuery,
      fromCache: !!(cache[cacheKey] && !append)
    });

    setLoading(true);
    setError(null);

    try {
      const params = {
        pageSize: 12,
        page: page,
        language: 'en'
      };

      if (filters.searchQuery) {
        params.q = filters.searchQuery;
        console.log('🔍 Search query:', filters.searchQuery);
      } else {
        params.category = filters.category;
        params.country = 'us';
        console.log('📂 Category:', filters.category);
      }

      if (filters.fromDate) {
        params.from = filters.fromDate;
      }

      if (filters.toDate) {
        params.to = filters.toDate;
      }

      const endpoint = filters.searchQuery ? 'everything' : 'top-headlines';
      const url = buildApiUrl(endpoint, params);

      console.log('🌐 Fetching from proxy:', url);

      const response = await fetch(url);
      console.log('📡 Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Proxy Error:', response.status, errorText);
        throw new Error(`Request failed: ${response.status}`);
      }

      const data = await response.json();
      console.log('📊 API Response received');

      if (data.status === 'error') {
        console.error('❌ NewsAPI Error:', data.message);
        
        if (data.code === 'corsNotAllowed') {
          throw new Error('CORS not allowed - using proxy should fix this');
        }
        if (data.message.includes('rate limited')) {
          throw new Error('API rate limit exceeded');
        }
        
        throw new Error(data.message || 'API error');
      }

      console.log('✅ API SUCCESS! Articles:', data.articles?.length);
      
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
      setUseFallback(false);
      
      if (!append && data.articles && data.articles.length > 0) {
        console.log('💾 Saving to cache:', cacheKey);
        setCache(prev => ({
          ...prev,
          [cacheKey]: {
            articles: data.articles,
            totalResults: data.totalResults,
            timestamp: Date.now()
          }
        }));
      }
      
    } catch (err) {
      console.error('💥 Fetch error:', err.message);
      setError(err.message);
      
      if (!append) {
        console.log('🔄 Falling back to demo data');
        setUseFallback(true);
        setArticles(FALLBACK_ARTICLES);
        setTotalResults(FALLBACK_ARTICLES.length);
      }
    } finally {
      setLoading(false);
    }
  }, [filters, cache]);

  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
  };

  const debouncedFetchNews = useCallback(debounce(fetchNews, 600), [fetchNews]);

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

  const retryWithAPI = () => {
    setUseFallback(false);
    setError(null);
    fetchNews(1, false);
  };

  const clearCache = () => {
    setCache({});
    console.log('🗑️ Cache cleared');
  };

  const hasMore = articles.length < totalResults;

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
    cache,
    updateFilters,
    loadMore,
    hasMore,
    retryWithAPI,
    clearCache
  };
};