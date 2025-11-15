"use client";

import { useState, useEffect } from "react";
import AirportCard from "./AirportCard";
import Pagination from "@/shared/components/Pagination";

interface Airport {
  name: string;
  city: string;
  country: string;
  iataCode: string;
}

interface AirportCardListProps {
  airports: Airport[];
}

const ITEMS_PER_PAGE = 6;

export default function AirportCardList({ airports }: AirportCardListProps) {
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [airports.length]);

  if (airports.length === 0) {
    return (
      <div className="text-center py-2">
        <p className="text-gray-400 text-lg">No se encontraron aeropuertos</p>
      </div>
    );
  }

  const totalPages = Math.ceil(airports.length / ITEMS_PER_PAGE);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentAirports = airports.slice(startIndex, endIndex);

  const columnsPerRow = 2;
  const initialDelay = 0.2;

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


