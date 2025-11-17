"use client";

import { useEffect, useRef } from 'react';
import { useAirportsStore } from '../stores/airportsStore';

/**
 * Hook that exposes airports data and helpers from the global store.
 * Pass an optional `query` and it will keep the store search synced.
 *
 * @param query - Optional search string to initialize the store's search
 * @returns An object: `{ airports, isLoading, error, getAirportsForPage, getTotalPages }`
 */
export function useAirports(query: string = '') {
  const filteredAirports = useAirportsStore((state) => state.filteredAirports);
  const isLoading = useAirportsStore((state) => state.isLoading);
  const error = useAirportsStore((state) => state.error);
  const loadAllAirports = useAirportsStore((state) => state.loadAllAirports);
  const setSearchQuery = useAirportsStore((state) => state.setSearchQuery);
  const getAirportsForPage = useAirportsStore((state) => state.getAirportsForPage);
  const getTotalPages = useAirportsStore((state) => state.getTotalPages);

  const queryRef = useRef(query);

  useEffect(() => {
    queryRef.current = query;
  }, [query]);

  useEffect(() => {
    setSearchQuery(query);
  }, [query, setSearchQuery]);

  useEffect(() => {
    setSearchQuery(queryRef.current);
    loadAllAirports();
  }, [loadAllAirports, setSearchQuery]);

  return {
    airports: filteredAirports,
    isLoading,
    error,
    getAirportsForPage,
    getTotalPages,
  };
}
