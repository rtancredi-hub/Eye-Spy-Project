"use client";

import { useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function PhotoCarousel({
  images,
}: {
  images: { url: string; alt?: string }[];
}) {
  const trackRef = useRef<HTMLDivElement>(null);

  if (images.length === 0) return null;

  const scroll = (direction: "left" | "right") => {
    const track = trackRef.current;
    if (!track) return;
    const amount = track.clientWidth * 0.9 * (direction === "left" ? -1 : 1);
    track.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <div className="relative mb-8">
      <div
        ref={trackRef}
        className="flex gap-4 overflow-x-auto [scroll-snap-type:x_mandatory] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {images.map((img, i) => (
          <div
            key={i}
            className="relative shrink-0 w-[85%] sm:w-[60%] aspect-[4/3] rounded-sm overflow-hidden border border-white/10 [scroll-snap-align:center]"
          >
            <Image
              src={img.url}
              alt={img.alt ?? "Project photo"}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 85vw, 540px"
            />
          </div>
        ))}
      </div>

      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => scroll("left")}
            aria-label="Previous photo"
            className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center justify-center w-9 h-9 rounded-full bg-brand-base/80 border border-white/10 text-white hover:text-brand-accent hover:border-brand-accent/40 transition-colors duration-200"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => scroll("right")}
            aria-label="Next photo"
            className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center w-9 h-9 rounded-full bg-brand-base/80 border border-white/10 text-white hover:text-brand-accent hover:border-brand-accent/40 transition-colors duration-200"
          >
            <ChevronRight size={18} />
          </button>
        </>
      )}
    </div>
  );
}
