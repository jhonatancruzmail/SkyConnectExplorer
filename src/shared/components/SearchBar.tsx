"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SearchButton from "@/shared/components/SearchButton";
import { useAirportsStore } from "@/features/airports/stores/airportsStore";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  layout?: "horizontal" | "vertical";
  initialValue?: string;
}

/**
 * Reusable search bar component.
 *
 * Props:
 * - `onSearch(query)` called when the form is submitted.
 * - `placeholder` input placeholder text.
 * - `layout` either `horizontal` or `vertical`.
 * - `initialValue` initial input value.
 *
 * Example:
 * <SearchBar onSearch={(q) => setQuery(q)} layout="horizontal" />
 */
export default function SearchBar({
  onSearch,
  placeholder = "Buscar aeropuertos...",
  layout = "vertical",
  initialValue = ""
}: SearchBarProps) {
  const [query, setQuery] = useState(initialValue);
  const [showContent, setShowContent] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const searchHistory = useAirportsStore((state) => state.searchHistory);
  const clearSearchHistory = useAirportsStore((state) => state.clearSearchHistory);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  useEffect(() => {
    if (layout === "vertical") {
      const timer = setTimeout(() => {
        setShowContent(true);
      }, 350);
      return () => clearTimeout(timer);
    } else {
      setShowContent(true);
    }
  }, [layout]);

  const layoutClasses: Record<"horizontal" | "vertical", string> = {
    horizontal: "flex-row",
    vertical: "flex-col",
  };

  const mobileLayoutClass = "flex-row";
  const desktopLayoutClass = layout === "horizontal" ? "md:flex-row" : "md:flex-col";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
    setShowHistory(false);
  };

  const handleHistoryClick = (historyQuery: string) => {
    setQuery(historyQuery);
    onSearch(historyQuery);
    setShowHistory(false);
    inputRef.current?.blur();
  };

  // Here I close the history dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowHistory(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isVertical = layout === "vertical";
  const hasHistory = searchHistory.length > 0;

  return (
    <motion.form
      layoutId="search-bar"
      layout
      initial={isVertical ? { opacity: 0, y: 12, filter: "blur(10px)" } : false}
      animate={isVertical && showContent ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      onSubmit={handleSubmit}
      transition={isVertical ? {
        layout: {
          type: "spring",
          stiffness: 180,
          damping: 24,
          mass: 1.3
        },
        opacity: {
          duration: 0.6,
          ease: [0.4, 0, 0.2, 1]
        },
        y: {
          duration: 0.6,
          ease: [0.4, 0, 0.2, 1]
        },
        filter: {
          duration: 0.6,
          ease: [0.4, 0, 0.2, 1]
        }
      } : {
        layout: {
          type: "spring",
          stiffness: 180,
          damping: 24,
          mass: 1.3
        }
      }}
    >
      <motion.div
        ref={containerRef}
        layout
        className={`relative flex items-center ${mobileLayoutClass} ${desktopLayoutClass} gap-2 ${layout === "vertical" ? "w-full md:w-[780px]" : "w-fit"}`}
        transition={{
          layout: {
            type: "spring",
            stiffness: 180,
            damping: 24,
            mass: 1.3
          }
        }}
      >
        <div className={`relative flex-1 md:flex-none ${layout === "horizontal" ? "md:w-3xl" : "md:w-2xl"}`}>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => hasHistory && setShowHistory(true)}
            placeholder={placeholder}
            className={`h-[52px] px-5 rounded-full bg-white text-lg font-normal placeholder-[#006FEE] shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-blue-500 transition-all flex-shrink-0 w-full ${layout === "vertical" ? "md:mb-2" : ""}`}
            aria-label="Buscar aeropuertos"
          />

          <AnimatePresence>
            {showHistory && hasHistory && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border-2 border-blue-500 z-50 max-h-64"
              >
                <div className="p-2">
                  <div className="flex items-center justify-between px-3 py-2 mb-1">
                    <span className="text-sm font-semibold text-gray-600">Búsquedas recientes</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        clearSearchHistory();
                        setShowHistory(false);
                      }}
                      className="text-xs text-blue-500 hover:text-blue-700 transition-colors"
                    >
                      Limpiar
                    </button>
                  </div>
                  {searchHistory.map((item, index) => (
                    <button
                      key={`${item.query}-${item.timestamp}`}
                      onClick={() => handleHistoryClick(item.query)}
                      className="w-full text-left px-3 py-2 rounded-md  transition-colors text-gray-700 hover:bg-[#0060ff] hover:text-white flex items-center justify-between group"
                    >
                      <span className="truncate">{item.query}</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-white"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <SearchButton type="submit" />
      </motion.div>
    </motion.form>
  );
}
