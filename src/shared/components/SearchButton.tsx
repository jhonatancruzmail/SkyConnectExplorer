"use client";

import Image from "next/image";

interface SearchButtonProps {
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
  children?: React.ReactNode;
}

export default function SearchButton({
  onClick,
  type = "button",
  className = "",
  children
}: SearchButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`h-[52px] text-xl px-6 pr-25 rounded-xl border-1 border-white bg-gradient-blue-teal text-white font-medium flex items-center justify-center gap-2 opacity-80 transition-all shadow-sm ${className}`}
    >
      <Image
        src="/Magnifer.svg"
        alt="Buscar"
        width={30}
        height={30}
      />
      <span>{children || "Buscar"}</span>
    </button>
  );
}

