import { useState, useEffect, useCallback } from 'react';
import { getLocalNewsByCategory, getLocalNewsBySearch } from '../utils/newsData';

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
  const [cache, setCache] = useState({});

  const buildApiUrl = (endpoint, params) => {
    if (!API_KEY) {
      console.error("VITE_NEWS_API_KEY tidak ditemukan! Memaksa mode demo.");
      return 'http://invalid-api-key.test';
    }
    
    const baseUrl = '/newsapi';
    const queryString = new URLSearchParams({
      ...params,
      apiKey: API_KEY
    }).toString();
    
    return `${baseUrl}/${endpoint}?${queryString}`;
  };

  const fetchNews = useCallback(async (page = 1, append = false) => {
    const cacheKey = `${filters.category}-${filters.searchQuery}-${filters.fromDate}-${filters.toDate}-${page}`;
    const CACHE_DURATION = 5 * 60 * 1000; 
    
    if (cache[cacheKey] && !append && (Date.now() - cache[cacheKey].timestamp < CACHE_DURATION)) {
      console.log('📦 Using cached data for:', cacheKey);
      setArticles(cache[cacheKey].articles);
      setTotalResults(cache[cacheKey].totalResults);
      setUseFallback(false);
      setLoading(false);
      return;
    }

    console.log('🚀 Starting API fetch...', { filters, page });

    setLoading(true);
    setError(null);

    try {
      const params = {
        pageSize: 12,
        page: page,
        language: 'en'
      };

      let endpoint;
      const hasDateFilter = filters.fromDate && filters.toDate;

      if (filters.searchQuery) {
        endpoint = 'everything';
        params.q = filters.searchQuery;
        
      } else if (hasDateFilter) {
        endpoint = 'everything';
        params.q = filters.category; 
        
      } else {
        endpoint = 'top-headlines';
        params.category = filters.category;
        params.country = 'us';
      }
      
      if (endpoint === 'everything') {
        if (filters.fromDate) params.from = filters.fromDate;
        if (filters.toDate) params.to = filters.toDate;
        
        if (!params.q) {
           params.sortBy = 'popularity'; 
        }
      }

      const url = buildApiUrl(endpoint, params);
      console.log('🌐 Fetching from proxy:', url);

      const response = await fetch(url);
      console.log('📡 Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json(); 
        console.error('❌ Proxy Error:', response.status, errorData);
        throw new Error(errorData.message || `Request failed: ${response.status}`);
      }

      const data = await response.json();
      console.log('📊 API Response received');

      if (data.status === 'error') {
        console.error('❌ NewsAPI Error:', data.message);
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
        console.log('🔄 Falling back to rich demo data');
        setUseFallback(true);
        let demoData;
        
        if (filters.searchQuery) {
          demoData = getLocalNewsBySearch(filters.searchQuery);
        } else {
          demoData = getLocalNewsByCategory(filters.category);
        }
        
        if (filters.fromDate && filters.toDate) {
            const from = new Date(filters.fromDate);
            const to = new Date(filters.toDate);
            demoData = demoData.filter(article => {
                const articleDate = new Date(article.publishedAt);
                return articleDate >= from && articleDate <= to;
            });
        }
        
        setArticles(demoData);
        setTotalResults(demoData.length);
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
    const hardLimitReached = articles.length >= 100;
    if (!loading && articles.length < totalResults && !useFallback && !hardLimitReached) {
      fetchNews(currentPage + 1, true);
    }
  };

  const retryWithAPI = () => {
    setUseFallback(false);
    setError(null);
    setCache({}); 
    fetchNews(1, false);
  };

  const clearCache = () => {
    setCache({});
    console.log('🗑️ Cache cleared');
  };

  const hardLimitReached = articles.length >= 100;
  const hasMore = articles.length < totalResults && !useFallback && !hardLimitReached;

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