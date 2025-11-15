"use client";

import { useRouter } from "next/navigation";
import SearchBar from "@/shared/components/SearchBar";
import HeroTitle from "@/shared/components/HeroTitle";

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
        <HeroTitle title="SkyConnect Explorer" titleSize="large" spacing="large" />
        <SearchBar onSearch={handleSearch} />
      </main>
    </div>
  );
}
