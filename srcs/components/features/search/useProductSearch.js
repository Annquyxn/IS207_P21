import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useDebounce } from './useDebounce';
import { fetchProductsByTitle } from '../../services/apiSearch';

export const useProductSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const debouncedQuery = useDebounce(query, 400);
  const searchRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    setQuery('');
    setResults([]);
  }, [location.pathname]);

  useEffect(() => {
    const getData = async () => {
      const data = await fetchProductsByTitle(debouncedQuery);
      setResults(data);
    };

    if (debouncedQuery) getData();
    else setResults([]);
  }, [debouncedQuery]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setQuery('');
        setResults([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return {
    query,
    setQuery,
    results,
    searchRef,
  };
};
