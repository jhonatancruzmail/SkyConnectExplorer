"use client";

import { useEffect, useRef } from 'react';
import { useAirportsStore } from '../stores/airportsStore';

/**
 * Hook personalizado para obtener aeropuertos
 * 
 * @param query - Término de búsqueda
 * @returns Objeto con airports, isLoading, error, y funciones de paginación
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
