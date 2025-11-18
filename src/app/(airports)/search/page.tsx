"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import SearchBar from "@/shared/components/SearchBar";
import HeroTitle from "@/shared/components/HeroTitle";
import { useRouter } from "next/navigation";
import AirportCardList from "@/features/airports/components/cards/AirportCardList";
import { useAirports } from "@/features/airports/hooks/useAirports";
import { useAirportsStore } from "@/features/airports/stores/airportsStore";

function SearchContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const query = searchParams.get("q") || "";

    const { isLoading, error } = useAirports(query);

    // hay un delay antes de mostrar items porque sino se ve mal la animación de transición con la otra pestaña
    const [showItems, setShowItems] = useState(false);

    const allAirports = useAirportsStore((state) => state.allAirports);
    const filteredAirports = useAirportsStore((state) => state.filteredAirports);
    const addToSearchHistory = useAirportsStore((state) => state.addToSearchHistory);

    useEffect(() => {
        if (!isLoading && allAirports.length > 0) {
            const timer = setTimeout(() => {
                setShowItems(true);
            }, 200);
            return () => clearTimeout(timer);
        } else {
            setShowItems(false);
        }
    }, [isLoading, allAirports.length]);

    // Add search query to history when it changes
    useEffect(() => {
        if (query.trim()) {
            addToSearchHistory(query);
        }
    }, [query, addToSearchHistory]);

    const handleSearch = (newQuery: string) => {
        const trimmed = newQuery.trim();
        if (trimmed) {
            router.push(`/search?q=${encodeURIComponent(trimmed)}`);
        } else {
            router.push("/search");
        }
    }

    return (
        <div className="flex min-h-screen flex-col w-full">
            <header className="flex flex-col md:flex-row items-start md:items-center justify-between w-full py-7 px-4 md:px-12 gap-4 md:gap-0">
                <HeroTitle title="SkyConnect Explorer" titleSize="small" spacing="small" href="/" />
                <SearchBar onSearch={handleSearch} layout="horizontal" />
            </header>

            <main className="flex-1 flex flex-col items-center justify-start py-0 px-4 md:px-12 w-full">
                {isLoading && (
                    <div className="mb-4 text-center">
                        <p className="text-gray-400 text-lg">Cargando aeropuertos...</p>
                    </div>
                )}

                {error && !isLoading && (
                    <div className="mb-4 text-center">
                        <p className="text-red-400 text-lg">Error al cargar aeropuertos. Usando datos locales.</p>
                    </div>
                )}

                {query && !isLoading && showItems && filteredAirports.length > 0 && (
                    <div className="mb-4 text-center">
                        <p className="text-gray-300 text-lg">
                            Aeropuertos encontrados para: <span className="font-semibold text-blue-400">{query}</span>
                        </p>
                    </div>
                )}

                {query && !isLoading && showItems && filteredAirports.length === 0 && (
                    <div className="mb-4 text-center">
                        <p className="text-gray-300 text-lg">
                            No se encontraron coincidencias para: <span className="font-semibold text-blue-400">{query}</span>
                        </p>
                    </div>
                )}

                {showItems && <AirportCardList />}
            </main>
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={
            <div className="flex min-h-screen items-center justify-center">
                <p className="text-gray-500">Buscando coincidencias...</p>
            </div>
        }>
            <SearchContent />
        </Suspense>
    );
}