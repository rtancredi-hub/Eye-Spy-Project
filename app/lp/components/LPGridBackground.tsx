"use client";

import { useEffect, useRef } from "react";
import { brandColors, rgba } from "../../config/colors";

// Hero background for /lp/* pages — same look as the homepage Hero
// (app/components/Hero.tsx): faint cyan grid scrolling downward, a soft
// scanline band drifting down, and a blurred accent orb bottom-left.
// Draws one still frame when the visitor prefers reduced motion.
// tone="light" swaps the faint cyan for faint navy so it reads on off-white.
export default function LPGridBackground({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const navy = { r: 5, g: 13, b: 26 };
  const lineColor = tone === "light" ? rgba(navy, 0.06) : rgba(brandColors.glowCyan, 0.04);
  const bandColor = tone === "light" ? navy : brandColors.glowCyan;
  const bandAlpha = tone === "light" ? 0.04 : 0.035;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let animFrameId: number;
    let offset = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = lineColor;
      ctx.lineWidth = 1;
      const spacing = 48;

      for (let x = 0; x < canvas.width + spacing; x += spacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = -spacing + (offset % spacing); y < canvas.height + spacing; y += spacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      const bandY = offset % canvas.height;
      const grad = ctx.createLinearGradient(0, bandY - 40, 0, bandY + 40);
      grad.addColorStop(0, rgba(bandColor, 0));
      grad.addColorStop(0.5, rgba(bandColor, bandAlpha));
      grad.addColorStop(1, rgba(bandColor, 0));
      ctx.fillStyle = grad;
      ctx.fillRect(0, bandY - 40, canvas.width, 80);

      if (reduceMotion) return;
      offset += 0.4;
      animFrameId = requestAnimationFrame(draw);
    };

    const handleResize = () => {
      resize();
      if (reduceMotion) draw();
    };

    resize();
    window.addEventListener("resize", handleResize);
    draw();

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [lineColor, bandColor, bandAlpha]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 w-full h-full"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-32 -left-32 w-96 h-96 rounded-full opacity-15"
        style={{
          background: "radial-gradient(circle, var(--brand-accent) 0%, transparent 70%)",
          filter: "blur(48px)",
        }}
        aria-hidden
      />
    </>
  );
}
