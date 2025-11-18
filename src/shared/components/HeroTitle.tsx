"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

/* uso estas prop porque quiero usar este titulo en dos paginas para usar una animación de transición de texto */
interface HeroTitleProps {
    title: string;
    titleSize?: "large" | "small";
    spacing?: "large" | "small";
    href?: string;
}

export default function HeroTitle({ title, titleSize = "large", spacing = "large", href }: HeroTitleProps) {
    const router = useRouter();
    const [showContent, setShowContent] = useState(false);
    const [planeInFront, setPlaneInFront] = useState(false);

    useEffect(() => {
        if (titleSize === "large") {
            const timer = setTimeout(() => {
                setShowContent(true);
                setTimeout(() => {
                    setPlaneInFront(true);
                }, 600);
            }, 100);
            return () => clearTimeout(timer);
        } else {
            setShowContent(true);
        }
    }, [titleSize]);

    const sizeClasses: Record<"large" | "small", string> = {
        large: "text-4xl md:text-7xl",
        small: "text-2xl md:text-3xl",
    };

    const spacingClasses: Record<"large" | "small", string> = {
        large: "pb-10 md:pb-20",
        small: "pb-0",
    };

    const isLarge = titleSize === "large";

    const handleClick = () => {
        if (href) {
            router.push(href);
        }
    };

    const titleElement = (
        <div className="flex items-center gap-2 md:gap-4 relative">
            <motion.h1
                layoutId="hero-title"
                layout
                initial={isLarge ? { opacity: 0, y: 15, filter: "blur(10px)" } : false}
                animate={isLarge && showContent ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
                transition={isLarge ? {
                    layout: {
                        type: "spring",
                        stiffness: 180,
                        damping: 24,
                        mass: 1.3
                    },
                    opacity: {
                        duration: 0.4,
                        ease: [0.4, 0, 0.2, 1]
                    },
                    y: {
                        duration: 0.4,
                        ease: [0.4, 0, 0.2, 1]
                    },
                    filter: {
                        duration: 0.4,
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
                className={`font-inter ${sizeClasses[titleSize]} ${spacingClasses[spacing]} text-gradient-blue-teal font-black relative z-10 ${isLarge ? "pl-4 md:pl-24" : ""} ${href ? "cursor-pointer hover:opacity-80 transition-opacity" : ""}`}
                onClick={handleClick}
            >
                {title}
            </motion.h1>
            {isLarge && (
                <motion.div
                    initial={{ opacity: 0, y: 40, x: -50, rotate: 15 }}
                    animate={showContent ? { opacity: 1, y: 0, x: 0, rotate: 30 } : { opacity: 0, y: 40, x: -50, rotate: 15 }}
                    transition={{
                        opacity: {
                            duration: 0.5,
                            ease: [0.4, 0, 0.2, 1],
                            delay: 0.2
                        },
                        y: {
                            duration: 1.0,
                            ease: [0.34, 1.56, 0.64, 1],
                            delay: 0.2
                        },
                        x: {
                            duration: 1.0,
                            ease: [0.34, 1.56, 0.64, 1],
                            delay: 0.2
                        },
                        rotate: {
                            duration: 1.0,
                            ease: [0.34, 1.56, 0.64, 1],
                            delay: 0.2
                        }
                    }}
                    className="relative self-start pt-2"
                    style={{ zIndex: planeInFront ? 10 : 0 }}
                >
                    <Image
                        src="/plane.svg"
                        alt="Avión"
                        width={80}
                        height={80}
                        className="w-[50px] h-[50px] md:w-[80px] md:h-[80px]"
                    />
                </motion.div>
            )}
        </div>
    );

    return titleElement;
}