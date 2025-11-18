"use client";

import { Suspense, useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import SearchBar from "@/shared/components/SearchBar";
import HeroTitle from "@/shared/components/HeroTitle";
import { useAirportsStore } from "@/features/airports/stores/airportsStore";
import { getValueOrNotFound, formatLocalDateTime } from "@/shared/utils/formatUtils";
import "leaflet/dist/leaflet.css";

const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false });

type Tab = "general" | "ubicacion" | "zona-horaria" | "estadisticas";

function AirportDetailContent() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const allAirports = useAirportsStore((state) => state.allAirports);
    const loadAllAirports = useAirportsStore((state) => state.loadAllAirports);
    const isLoading = useAirportsStore((state) => state.isLoading);

    const airport = allAirports.find((a) => a.iataCode === id);

    useEffect(() => {
        if (allAirports.length === 0) {
            loadAllAirports();
        }
    }, [allAirports.length, loadAllAirports]);

    const [activeTab, setActiveTab] = useState<Tab>("general");
    const [currentTime, setCurrentTime] = useState(new Date());
    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const L = require("leaflet");
            delete (L.Icon.Default.prototype as any)._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
                iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
                shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
            });
        }
    }, []);

    useEffect(() => {
        if (!isLoading && airport) {
            const timer = setTimeout(() => {
                setShowContent(true);
            }, 200);
            return () => clearTimeout(timer);
        } else {
            setShowContent(false);
        }
    }, [isLoading, airport]);


    const getTabTitle = (tab: Tab): string => {
        const titles: Record<Tab, string> = {
            "general": "Información General",
            "ubicacion": "Ubicación",
            "zona-horaria": "Zona Horaria",
            "estadisticas": "Estadísticas"
        };
        return titles[tab];
    };

    const getTabIcon = (tab: Tab): string => {
        const icons: Record<Tab, string> = {
            "general": "/Info.svg",
            "ubicacion": "/MapPoint.svg",
            "zona-horaria": "/Global.svg",
            "estadisticas": "/ClockCircle.svg"
        };
        return icons[tab];
    };

    const handleSearch = (newQuery: string) => {
        const trimmed = newQuery.trim();
        if (trimmed) {
            router.push(`/search?q=${encodeURIComponent(trimmed)}`);
        } else {
            router.push("/search");
        }
    };

    if (isLoading && allAirports.length === 0) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center">
                <p className="text-gray-400 text-lg">Cargando detalles del aeropuerto...</p>
            </div>
        );
    }

    if (!airport) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center">
                <p className="text-gray-400 text-lg">Aeropuerto no encontrado</p>
            </div>
        );
    }

    const tabs: { id: Tab; label: string }[] = [
        { id: "general", label: "General" },
        { id: "ubicacion", label: "Ubicación" },
        { id: "zona-horaria", label: "Zona Horaria" },
        { id: "estadisticas", label: "Estadísticas" },
    ];

    return (
        <div className="flex min-h-screen flex-col w-full hide-scrollbar">
            <header className="flex flex-col md:flex-row items-start md:items-center justify-between w-full py-7 px-4 md:px-12 gap-4 md:gap-0">
                <HeroTitle title="SkyConnect Explorer" titleSize="small" spacing="small" href="/" />
                <SearchBar onSearch={handleSearch} layout="horizontal" />
            </header>

            <main className="flex-1 flex flex-col items-center justify-start py-0 px-4 md:px-12 w-full hide-scrollbar">
                <div className="w-full max-w-7xl">
                    <div className="relative flex items-center justify-center mb-6 md:mb-8">
                        <button
                            onClick={() => router.back()}
                            className="absolute left-0 flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-lg font-medium transition-all duration-300 text-white hover:opacity-90"
                            style={{
                                backgroundColor: 'rgba(0, 96, 255, 1)'
                            }}
                            aria-label="Volver atrás"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2.5}
                                stroke="currentColor"
                                className="w-4 h-4 md:w-5 md:h-5"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                            </svg>
                        </button>
                        <motion.h1
                            layoutId={`airport-title-${airport.iataCode}`}
                            layout
                            transition={{
                                layout: {
                                    duration: 0.7,
                                    ease: [0.4, 0, 0.2, 1]
                                }
                            }}
                            className="text-2xl md:text-5xl font-black text-gradient-blue-teal w-fit px-8 md:px-0 text-center md:text-left"
                        >
                            {airport.name}
                        </motion.h1>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 60 }}
                        animate={showContent ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
                        transition={{
                            type: "spring",
                            stiffness: 130,
                            damping: 17,
                            delay: 0.4,
                            mass: 1.1
                        }}
                        className="flex flex-wrap md:flex-nowrap justify-between gap-2 md:gap-4 mb-6 md:mb-8 px-2 md:px-3 py-2 bg-[#3F495F] rounded-lg overflow-hidden backdrop-blur-sm"
                    >
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`py-2 md:py-3 w-[calc(50%-0.25rem)] md:w-full rounded-md font-medium transition-all duration-200 text-sm md:text-base ${activeTab === tab.id
                                    ? "bg-[#006FEE] text-white"
                                    : "text-[#A2A2A2] hover:text-white hover:bg-white/10"
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 60 }}
                        animate={showContent ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
                        transition={{
                            type: "spring",
                            stiffness: 130,
                            damping: 17,
                            delay: 0.55,
                            mass: 1.1
                        }}
                        className="relative bg-black rounded-lg border border-white/50 overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-[#3F495F] to-[#0E1934] z-0" />

                        <div className="relative flex flex-col md:flex-row h-full z-10">
                            <div className="w-full md:w-1/2 flex flex-col p-4 md:p-6">
                                <div className="flex items-center gap-2 mb-4 md:mb-6">
                                    <Image src={getTabIcon(activeTab)} alt="Información" width={28} height={28} className="md:w-[35px] md:h-[35px]" />
                                    <h2 className="text-xl md:text-2xl font-black text-gradient-blue-teal w-fit">
                                        {getTabTitle(activeTab)}
                                    </h2>
                                </div>

                                {activeTab === "general" && (
                                    <div className="space-y-3 md:space-y-4 text-gray-300 text-sm md:text-base">
                                        <div>
                                            <span className="text-white font-semibold">Código IATA:</span>
                                            <span className="ml-2 font-light text-white">{getValueOrNotFound(airport.iataCode)}</span>
                                        </div>
                                        <div>
                                            <span className="text-white font-semibold">Código ICAO:</span>
                                            <span className="ml-2 font-light text-white">{getValueOrNotFound(airport.icaoCode)}</span>
                                        </div>
                                        <div>
                                            <span className="text-white font-semibold">País:</span>
                                            <span className="ml-2 font-light text-white">
                                                {getValueOrNotFound(airport.country)} {airport.countryCode ? `(${airport.countryCode})` : ""}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-white font-semibold">Ciudad IATA:</span>
                                            <span className="ml-2 font-light text-white">{getValueOrNotFound(airport.city)}</span>
                                        </div>
                                        <div>
                                            <span className="text-white font-semibold">Teléfono:</span>
                                            <span className="ml-2 font-light text-white">
                                                {getValueOrNotFound(airport.phoneNumber)}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {activeTab === "ubicacion" && (
                                    <div className="space-y-3 md:space-y-4 text-gray-300 text-sm md:text-base">
                                        <div>
                                            <span className="text-white font-semibold">Latitud:</span>
                                            <span className="ml-2 font-light text-white">{getValueOrNotFound(airport.latitude)}</span>
                                        </div>
                                        <div>
                                            <span className="text-white font-semibold">Longitud:</span>
                                            <span className="ml-2 font-light text-white">{getValueOrNotFound(airport.longitude)}</span>
                                        </div>
                                        <div>
                                            <span className="text-white font-semibold">ID Geoname:</span>
                                            <span className="ml-2 font-light text-white">{getValueOrNotFound(airport.geonameId)}</span>
                                        </div>
                                    </div>
                                )}

                                {activeTab === "zona-horaria" && (
                                    <div className="space-y-3 md:space-y-4 text-gray-300 text-sm md:text-base">
                                        <div>
                                            <span className="text-gray-400">Zona Horaria:</span>
                                            <span className="ml-2 font-light text-white">{getValueOrNotFound(airport.timezone)}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-400">GMT:</span>
                                            <span className="ml-2 font-light text-white">{getValueOrNotFound(airport.gmt)}</span>
                                        </div>
                                    </div>
                                )}

                                {activeTab === "estadisticas" && (
                                    <div className="flex items-center justify-center py-12">
                                        <p className="text-gray-400 text-xl font-light">Trabajo en progreso</p>
                                    </div>
                                )}
                            </div>

                            <div className="relative w-full md:w-1/2 h-48 md:h-auto overflow-hidden">
                                <div className="absolute inset-0 overflow-hidden rounded-b-lg md:rounded-r-lg md:rounded-bl-none">
                                    <Image
                                        src="/plane.jpg"
                                        alt="Airplane"
                                        fill
                                        className="object-cover opacity-10"
                                        style={{ borderRadius: '0.5rem' }}
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {activeTab === "ubicacion" && airport.latitude && airport.longitude && (
                        <motion.div
                            initial={{ opacity: 0, y: 60 }}
                            animate={showContent ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
                            transition={{
                                type: "spring",
                                stiffness: 130,
                                damping: 17,
                                delay: 0.7,
                                mass: 1.1
                            }}
                            className="w-full h-[300px] md:h-[500px] rounded-lg overflow-hidden mt-4 mb-6 md:mb-10"
                        >
                            <MapContainer
                                center={[parseFloat(airport.latitude), parseFloat(airport.longitude)]}
                                zoom={13}
                                style={{ height: "100%", width: "100%", zIndex: 0 }}
                                scrollWheelZoom={true}
                            >
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                <Marker position={[parseFloat(airport.latitude), parseFloat(airport.longitude)]}>
                                    <Popup>
                                        <div className="text-center">
                                            <p className="font-semibold">{airport.name}</p>
                                            <p className="text-sm text-gray-600">{airport.city}, {airport.country}</p>
                                        </div>
                                    </Popup>
                                </Marker>
                            </MapContainer>
                        </motion.div>
                    )}

                    {activeTab === "zona-horaria" && (
                        <motion.div
                            initial={{ opacity: 0, y: 60 }}
                            animate={showContent ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
                            transition={{
                                type: "spring",
                                stiffness: 130,
                                damping: 17,
                                delay: 0.7,
                                mass: 1.1
                            }}
                            className="relative bg-black rounded-lg border border-white/50 overflow-hidden mt-4 md:mt-6 mb-6 md:mb-0"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-[#3F495F] to-[#0E1934] z-0" />

                            <div className="relative flex flex-col md:flex-row h-full z-10">
                                <div className="w-full md:w-1/2 flex flex-col p-4 md:p-8">
                                    <div className="flex items-center gap-2 mb-4 md:mb-6">
                                        <Image src="/ClockCircle.svg" alt="Hora Local" width={28} height={28} className="md:w-[35px] md:h-[35px]" />
                                        <h2 className="text-xl md:text-2xl font-black text-gradient-blue-teal w-fit">
                                            Hora Local
                                        </h2>
                                    </div>
                                    <p className="text-xl md:text-2xl font-light text-white">
                                        {formatLocalDateTime(currentTime)}
                                    </p>
                                </div>

                                <div className="relative w-full md:w-1/2 h-48 md:h-auto overflow-hidden">
                                    <div className="absolute inset-0 overflow-hidden rounded-b-lg md:rounded-r-lg md:rounded-bl-none">
                                        <Image
                                            src="/plane.jpg"
                                            alt="Airplane"
                                            fill
                                            className="object-cover opacity-10"
                                            style={{ borderRadius: '0.5rem' }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default function AirportDetailPage() {
    return (
        <Suspense fallback={
            <div className="flex min-h-screen items-center justify-center">
                <p className="text-gray-500">Cargando detalles del aeropuerto...</p>
            </div>
        }>
            <AirportDetailContent />
        </Suspense>
    );
}

