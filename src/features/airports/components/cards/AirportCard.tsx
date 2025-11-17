"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Airport } from "@/types/airport";

interface AirportCardProps extends Airport {
  delay?: number;
}

/**
 * Airport visual card.
 * Accepts the `Airport` fields and an optional `delay` for the entrance animation.
 * Clicking the card navigates to the airport details page at `/search/{iataCode}`.
 *
 * Example:
 * <AirportCard name="..." city="..." country="..." iataCode="ABC" />
 */
export default function AirportCard({
  name,
  city,
  country,
  iataCode,
  delay = 0
}: AirportCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/search/${iataCode}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 20,
        delay,
        mass: 1.2
      }}
      onClick={handleClick}
      className="relative bg-black rounded-lg border border-white/50 hover:border-white/90 transition-[border-color] duration-300 overflow-hidden cursor-pointer group"
      style={{ willChange: "transform, opacity" }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-[#3F495F] to-[#0E1934] z-0" />

      <div className="relative flex h-full z-10">
        <div className="w-1/2 flex flex-col justify-between p-5">
          <div>
            <motion.h3
              layoutId={`airport-title-${iataCode}`}
              layout
              className="text-white font-medium text-lg mb-2 line-clamp-2"
              transition={{
                layout: {
                  duration: 0.7,
                  ease: [0.4, 0, 0.2, 1]
                }
              }}
            >
              {name}
            </motion.h3>
            <p className="text-gray-300 text-sm mb-3">
              {city}, {country}
            </p>
          </div>
          <div className="text-3xl font-black text-gradient-blue-teal mt-3 w-fit">
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