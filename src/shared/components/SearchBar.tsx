"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import SearchButton from "@/shared/components/SearchButton";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  layout?: "horizontal" | "vertical";

}

export default function SearchBar({
  onSearch,
  placeholder = "Buscar aeropuertos...",
  layout = "vertical"
}: SearchBarProps) {
  const [query, setQuery] = useState("");

  const layoutClasses: Record<"horizontal" | "vertical", string> = {
    horizontal: "flex-row",
    vertical: "flex-col",
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <motion.form
      layoutId="search-bar"
      layout
      onSubmit={handleSubmit}
      transition={{
        layout: {
          duration: 0.7,
          ease: [0.4, 0, 0.2, 1]
        }
      }}
    >
      <motion.div
        layout
        className={`relative flex items-center ${layoutClasses[layout]} gap-2 w-[780px]`}
        transition={{
          layout: {
            duration: 0.7,
            ease: [0.4, 0, 0.2, 1]
          }
        }}
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className={`h-[52px] px-5 rounded-full bg-white text-lg font-normal placeholder-[#006FEE] shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-blue-500 transition-all ${layout === "horizontal" ? "flex-1" : "w-full mb-2"
            }`}
          aria-label="Buscar aeropuertos"
        />
        <SearchButton type="submit" />
      </motion.div>
    </motion.form>
  );
}
