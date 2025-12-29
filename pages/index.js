import React from 'react';
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] md:min-h-full w-full h-full">
      <div className="relative flex flex-col items-center justify-center animate-glow">
        <Image
          src="/logo.png"
          alt="Guild Logo"
          width={1200}
          height={600}
          style={{
            width: "100%",
            height: "auto",
            maxWidth: "100%",
            objectFit: "contain",
            filter: "drop-shadow(0 0 20px rgba(255, 255, 255, 0.1))",
            maskImage: "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent), linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent), linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
            maskComposite: "intersect",
            WebkitMaskComposite: "source-in"
          }}
          priority
        />
      </div>
    </div>
  );
}