"use client";

import { useRouter } from "next/navigation";
import { SearchBar } from "@/features/airports";

export default function Home() {
  const router = useRouter();

  const handleSearch = (query: string) => {
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <main className="flex flex-col items-center gap-8">
        <h1 className="font-inter text-7xl pb-20 bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent font-black">
          SkyConnect Explorer
        </h1>
        <SearchBar onSearch={handleSearch} />
      </main>
    </div>
  );
}
