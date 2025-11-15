"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface AirportCardProps {
  name: string;
  city: string;
  country: string;
  iataCode: string;
  delay?: number;
}

export default function AirportCard({
  name,
  city,
  country,
  iataCode,
  delay = 0
}: AirportCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      className="relative bg-black rounded-lg border border-white/50 hover:border-white/90 transition-[border-color] duration-300 overflow-hidden cursor-pointer group"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-[#3F495F] to-[#0E1934] z-0" />

      <div className="relative flex h-full z-10">
        <div className="w-1/2 flex flex-col justify-between p-5">
          <div>
            <h3 className="text-white font-medium text-lg mb-2 line-clamp-2">
              {name}
            </h3>
            <p className="text-gray-300 text-sm mb-3">
              {city}, {country}
            </p>
          </div>
          <div className="text-3xl font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            {iataCode}
          </div>
        </div>

        <div className="relative w-1/2 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden rounded-r-lg">
            <Image
              src="/plane.jpg"
              alt="Airplane"
              fill
              className="object-cover opacity-10 group-hover:opacity-95 transition-opacity"
              style={{ borderRadius: '0.5rem' }}
            />
          </div>
          <div className="absolute top-4 right-4 z-10 group-hover:-translate-y-1 transition-transform duration-300">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg">
              <Image src="/planeIcon.png" alt="Airplane" width={40} height={40} />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}


