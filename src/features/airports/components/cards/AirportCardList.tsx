"use client";

import { useState, useEffect } from "react";
import AirportCard from "./AirportCard";
import Pagination from "@/shared/components/Pagination";
import { useAirportsStore } from "@/features/airports/stores/airportsStore";

const ITEMS_PER_PAGE = 6;

export default function AirportCardList() {
  const [currentPage, setCurrentPage] = useState(1);

  const isLoading = useAirportsStore((state) => state.isLoading);
  const searchQuery = useAirportsStore((state) => state.searchQuery);
  const loadAllAirports = useAirportsStore((state) => state.loadAllAirports);
  const getAirportsForPage = useAirportsStore((state) => state.getAirportsForPage);
  const getTotalPages = useAirportsStore((state) => state.getTotalPages);

  useEffect(() => {
    loadAllAirports();
  }, [loadAllAirports]);

  // Resetear a página 1 cuando cambia la búsqueda
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const totalPages = getTotalPages(ITEMS_PER_PAGE);
  const currentAirports = getAirportsForPage(currentPage, ITEMS_PER_PAGE);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  if (isLoading && currentAirports.length === 0) {
    return (
      <div className="text-center py-2">
        <p className="text-gray-400 text-lg">Cargando aeropuertos...</p>
      </div>
    );
  }

  if (!isLoading && currentAirports.length === 0 && totalPages === 0) {
    return null;
  }

  const columnsPerRow = 2;
  const initialDelay = 0.2;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {currentAirports.map((airport, index) => {
          const row = Math.floor(index / columnsPerRow);
          const delay = initialDelay + (row * 0.2);

          return (
            <AirportCard
              key={`${airport.iataCode}-${startIndex + index}`}
              name={airport.name}
              city={airport.city}
              country={airport.country}
              iataCode={airport.iataCode}
              delay={delay}
            />
          );
        })}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
