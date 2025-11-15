"use client";

import { useState, useEffect } from "react";
import { useDebounce } from "@/shared/hooks/useDebounce";
import SearchButton from "./SearchButton";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export default function SearchBar({
  onSearch,
  placeholder = "Buscar aeropuertos..."
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 400);

  useEffect(() => {
    onSearch(debouncedQuery);
  }, [debouncedQuery, onSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="w-[780px]">
      <div className="relative flex items-center flex-col gap-2 mb-30">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="flex-1 px-5 py-3 w-2xl rounded-full bg-white text-lg font-normal placeholder-[#006FEE] shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-blue-500 transition-all mb-5"
          aria-label="Buscar aeropuertos"
        />
        <SearchButton type="submit" />
      </div>
    </form>
  );
}
