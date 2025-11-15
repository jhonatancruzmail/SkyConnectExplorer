"use client";

import { motion } from "framer-motion";

/* uso estas prop porque quiero usar este titulo en dos paginas para usar una animación de transición de texto */
interface HeroTitleProps {
    title: string;
    titleSize?: "large" | "small";
    spacing?: "large" | "small";
}

export default function HeroTitle({ title, titleSize = "large", spacing = "large" }: HeroTitleProps) {

    const sizeClasses: Record<"large" | "small", string> = {
        large: "text-7xl",
        small: "text-3xl",
    };

    const spacingClasses: Record<"large" | "small", string> = {
        large: "pb-20",
        small: "pb-0",
    };

    return (
        <motion.h1
            layoutId="hero-title"
            layout
            className={`font-inter ${sizeClasses[titleSize]} ${spacingClasses[spacing]} bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent font-black`}
            transition={{
                layout: {
                    duration: 0.7,
                    ease: [0.4, 0, 0.2, 1]
                }
            }}
        >
            {title}
        </motion.h1>
    )
}