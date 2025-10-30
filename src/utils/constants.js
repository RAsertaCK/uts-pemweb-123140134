export const CATEGORIES = [
  { id: 'technology', name: 'Technology' },
  { id: 'business', name: 'Business' },
  { id: 'sports', name: 'Sports' }
];

export const API_BASE_URL = 'https://newsapi.org/v2';
export const PAGE_SIZE = 12;

// Fallback data untuk demo ketika API limit habis
export const FALLBACK_ARTICLES = [
  {
    title: "React 19 Released with New Features",
    description: "The latest version of React brings exciting new capabilities for developers.",
    url: "https://reactjs.org",
    urlToImage: "https://via.placeholder.com/300x200/4A90E2/FFFFFF?text=React+19",
    publishedAt: "2024-01-15T10:00:00Z",
    source: { name: "React Blog" }
  },
  {
    title: "Tech Giants Announce AI Partnership",
    description: "Major technology companies collaborate on artificial intelligence research.",
    url: "https://example.com",
    urlToImage: "https://via.placeholder.com/300x200/50E3C2/FFFFFF?text=AI+News",
    publishedAt: "2024-01-14T15:30:00Z",
    source: { name: "Tech News" }
  },
  {
    title: "Global Business Summit 2024",
    description: "World leaders discuss economic growth and innovation strategies.",
    url: "https://example.com",
    urlToImage: "https://via.placeholder.com/300x200/9013FE/FFFFFF?text=Business",
    publishedAt: "2024-01-13T09:15:00Z",
    source: { name: "Business Daily" }
  },
  {
    title: "Championship Finals This Weekend",
    description: "Top teams compete for the championship title in exciting matches.",
    url: "https://example.com",
    urlToImage: "https://via.placeholder.com/300x200/F5A623/FFFFFF?text=Sports",
    publishedAt: "2024-01-12T18:45:00Z",
    source: { name: "Sports Network" }
  }
];