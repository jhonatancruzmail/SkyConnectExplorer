"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import SearchButton from "@/shared/components/SearchButton";

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const isVertical = layout === "vertical";

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
        layout
        className={`relative flex items-center ${layoutClasses[layout]} gap-2 ${layout === "vertical" ? "w-[780px]" : "w-fit"}`}
        transition={{
          layout: {
            type: "spring",
            stiffness: 180,
            damping: 24,
            mass: 1.3
          }
        }}
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className={`h-[52px] px-5 rounded-full bg-white text-lg font-normal placeholder-[#006FEE] shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-blue-500 transition-all flex-shrink-0 ${layout === "horizontal" ? "w-3xl" : "w-2xl"} ${layout === "vertical" ? "mb-2" : ""}`}
          aria-label="Buscar aeropuertos"
        />
        <SearchButton type="submit" />
      </motion.div>
    </motion.form>
  );
}
