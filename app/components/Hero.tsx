// "use client" tells Next.js to run this component in the browser (client-side).
// By default, Next.js runs components on the server. But this component uses:
//   - useEffect and useRef (React hooks — only work in the browser)
//   - canvas animation (a browser API)
//   - button click handlers (browser events)
// Any time you use those things, you need "use client" at the top.
"use client";

// ─── IMPORTS ─────────────────────────────────────────────────────────────────
// Importing specific hooks from React.
// useEffect: runs code AFTER the component appears on screen (good for browser APIs)
// useRef: gives you a direct reference to a real DOM element (like a canvas or div)
import { useEffect, useRef } from "react";
import { rgba } from "../config/colors";

// Faint navy grid lines read on the light page background.
const gridNavy = { r: 5, g: 13, b: 26 };

// Framer Motion is an animation library.
// "motion" is a special version of HTML elements (motion.div, motion.h1, etc.)
// that have built-in animation support via props like initial, animate, transition.
// Importing the Variants type from Framer Motion.
// We need this so TypeScript knows exactly what shape our animation object should be.
// Without it, TypeScript infers the types too loosely and throws errors.
import { motion, type Variants } from "framer-motion";

// Lucide React is an icon library.
// We're importing three specific icons by name.
// These are React components — you use them like <ShieldCheck /> in JSX.
import { ShieldCheck, ArrowRight, ChevronDown } from "lucide-react";

import { siteConfig } from "../config/site";
import { type SiteSettings, type Service } from "../lib/types";

// ─── COMPONENT DEFINITION ────────────────────────────────────────────────────
// This is the Hero component — a function that returns UI (JSX).
// "export default" means other files can import this component.
// In page.tsx you'd write: import Hero from "./components/Hero"
// Then use it like an HTML tag: <Hero />
export default function Hero({
  settings,
  services = [],
  heroHeading = "Security Systems",
  heroHeadingAccent = "Built to Protect.",
  heroSubheading = "From cameras and access control to full alarm systems — we design, install, and support security solutions that give you real peace of mind.",
}: {
  settings: SiteSettings;
  services?: Service[];
  heroHeading?: string;
  heroHeadingAccent?: string;
  heroSubheading?: string;
}) {
  // ─── REFS ──────────────────────────────────────────────────────────────────
  // useRef creates a reference to a real DOM element.
  // We attach this to the <canvas> element below via ref={canvasRef}.
  // After the component mounts, canvasRef.current IS the actual canvas element.
  // The <HTMLCanvasElement> part is TypeScript — it tells TypeScript what
  // type of element this ref will point to, so it knows what methods are available.
  // null is the initial value before the canvas exists yet.
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // ─── CANVAS ANIMATION (useEffect) ─────────────────────────────────────────
  // useEffect runs code AFTER the component renders in the browser.
  // We use it here because we can't touch the canvas until it exists in the DOM.
  // Structure: useEffect(() => { setup }, [dependencies])
  // The empty array [] as the second argument means: run this effect ONCE only,
  // right after the first render. If you put a variable in the array, it would
  // re-run every time that variable changes.
  useEffect(() => {
    // Get the actual canvas element from our ref.
    // If it doesn't exist yet for some reason, bail out early.
    const canvas = canvasRef.current;
    if (!canvas) return;

    // getContext("2d") gives us the 2D drawing API for the canvas.
    // ctx is the object we use to draw lines, shapes, gradients, etc.
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // animFrameId stores the ID of the current animation frame request.
    // We need this so we can cancel the animation when the component unmounts
    // (otherwise it keeps running in the background and causes memory leaks).
    let animFrameId: number;

    // offset is a number that increases each frame.
    // We use it to move the scanline downward over time, creating the animation.
    let offset = 0;

    // resize() makes the canvas pixel dimensions match its CSS display size.
    // Without this, the canvas would draw at a different resolution than it displays,
    // making everything look blurry or the wrong size.
    const resize = () => {
      canvas.width = canvas.offsetWidth; // actual pixel width of the element
      canvas.height = canvas.offsetHeight; // actual pixel height of the element
    };
    resize(); // run once immediately

    // Listen for window resize events and re-run resize() when the user
    // resizes their browser window, so the canvas always fits correctly.
    window.addEventListener("resize", resize);

    // draw() is our animation loop — it runs every frame (~60fps).
    // Each frame it: clears the canvas, draws the grid, draws the scanline,
    // increments offset, then schedules itself to run again next frame.
    const draw = () => {
      // Clear the entire canvas before drawing the next frame.
      // Without this, every frame would draw ON TOP of the previous one.
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // ── Draw the grid lines ──────────────────────────────────────────────
      // strokeStyle sets the color of lines. rgba() = red, green, blue, alpha(opacity).
      // 0.04 alpha means very faint — you barely see it, but it adds texture.
      ctx.strokeStyle = rgba(gridNavy, 0.06);
      ctx.lineWidth = 1;

      const spacing = 48; // pixels between each grid line

      // Draw vertical lines — loop from left to right across the canvas
      for (let x = 0; x < canvas.width + spacing; x += spacing) {
        ctx.beginPath(); // start a new line path
        ctx.moveTo(x, 0); // start at top
        ctx.lineTo(x, canvas.height); // draw to bottom
        ctx.stroke(); // actually render the line
      }

      // Draw horizontal lines — loop from top to bottom.
      // "offset % spacing" makes the lines shift downward as offset increases,
      // creating the scrolling effect. The modulo (%) keeps it within one spacing
      // cycle so it loops seamlessly.
      for (
        let y = -spacing + (offset % spacing);
        y < canvas.height + spacing;
        y += spacing
      ) {
        ctx.beginPath();
        ctx.moveTo(0, y); // start at left
        ctx.lineTo(canvas.width, y); // draw to right
        ctx.stroke();
      }

      // ── Draw the scanline (moving glow band) ────────────────────────────
      // A linear gradient that goes from transparent → faint cyan → transparent.
      // This creates a soft glowing horizontal band that drifts down the screen.
      // "offset % canvas.height" makes the band loop from top to bottom continuously.
      const grad = ctx.createLinearGradient(
        0,
        (offset % canvas.height) - 40, // gradient starts 40px above the center point
        0,
        (offset % canvas.height) + 40, // gradient ends 40px below the center point
      );
      grad.addColorStop(0, rgba(gridNavy, 0)); // fully transparent at top
      grad.addColorStop(0.5, rgba(gridNavy, 0.04)); // very faint navy at center
      grad.addColorStop(1, rgba(gridNavy, 0)); // fully transparent at bottom

      ctx.fillStyle = grad;
      // Draw a rectangle spanning the full width, 80px tall, centered on offset position
      ctx.fillRect(0, (offset % canvas.height) - 40, canvas.width, 80);

      // Increment offset each frame to move the scanline downward
      offset += 0.4;

      // requestAnimationFrame tells the browser to call draw() again before the next repaint.
      // This creates the animation loop — runs ~60 times per second.
      // We store the returned ID so we can cancel it in the cleanup function below.
      animFrameId = requestAnimationFrame(draw);
    };

    draw(); // kick off the animation loop

    // ── Cleanup function ────────────────────────────────────────────────────
    // This return function runs when the component is removed from the page.
    // Without cleanup, the animation and event listener would keep running
    // even after the component is gone, wasting memory and causing bugs.
    return () => {
      cancelAnimationFrame(animFrameId); // stop the animation loop
      window.removeEventListener("resize", resize); // remove the resize listener
    };
  }, []); // empty array = run this effect once, on first render only

  // ─── SCROLL HANDLER ───────────────────────────────────────────────────────
  // When the CTA button is clicked, smoothly scroll to the estimate form.
  // document.getElementById finds an element by its id attribute.
  // scrollIntoView with behavior: "smooth" animates the scroll instead of jumping.
  // The ?. is "optional chaining" — if getElementById returns null (element not found),
  // it just does nothing instead of crashing with an error.
  const scrollToForm = () => {
    document
      .getElementById("estimate-form")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  // Scrolls to the estimate form AND pre-selects a service in the dropdown.
  const scrollToFormWithService = (serviceValue: string) => {
    window.dispatchEvent(
      new CustomEvent("select-service", { detail: serviceValue }),
    );
    scrollToForm();
  };

  // ─── ANIMATION VARIANTS ───────────────────────────────────────────────────
  // Framer Motion uses "variants" — named animation states you define once
  // and reuse across multiple elements.
  // Instead of writing full animation props on every element, you define
  // the states here and reference them by name (initial="hidden" animate="visible").
  // ": Variants" explicitly tells TypeScript this object follows Framer Motion's
  // Variants type definition — this is what fixes the error.
  // The root cause: TypeScript saw "ease: [0.22, 1, 0.36, 1]" and typed it as
  // number[] (array of numbers). But Framer Motion's Variants type expects the
  // cubic bezier to be typed as [number, number, number, number] — a tuple
  // (fixed-length array). Adding ": Variants" gives TypeScript enough context
  // to accept the cubic bezier array without complaining.
  const fadeUp: Variants = {
    // "hidden" is the starting state — invisible and shifted down 28px
    hidden: { opacity: 0, y: 28 },

    // "visible" is the end state — fully visible at normal position.
    // This is a function that takes "i" (a custom number we pass to each element).
    // The "i" value controls the delay — each element gets a slightly later start,
    // creating a natural staggered cascade where content flows in top to bottom.
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.13, // element 0: 0ms, element 1: 130ms, etc.
        duration: 0.65, // animation takes 0.65 seconds
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number], // typed as a tuple, not number[]
      },
    }),
  };

  // ─── FEATURED SERVICES ─────────────────────────────────────────────────────
  // First 3 services from Sanity — clicking one scrolls to the estimate form
  // with that service pre-selected in the dropdown.
  const featuredServices = services.slice(0, 3);

  // ─── JSX (THE UI) ─────────────────────────────────────────────────────────
  // Everything inside return() is JSX — looks like HTML but it's JavaScript.
  // Key differences from HTML:
  //   - Use className instead of class (class is a reserved word in JS)
  //   - Self-closing tags need a slash: <br /> not <br>
  //   - JavaScript expressions go inside curly braces: {variable}
  //   - Inline styles use objects with camelCase: style={{ backgroundColor: "red" }}
  //   - Comments inside JSX use {/* this syntax */}
  return (
    // <section> is the outermost wrapper for the entire hero area.
    // "relative" — establishes a positioning context so children can use absolute positioning.
    // "min-h-screen" — at least 100% of the viewport height (fills the screen).
    // "overflow-hidden" — clips children that extend beyond the edges (like the blurred orb)
    //   so they don't create unwanted scrollbars.
    // "flex flex-col justify-center" — centers the main content vertically.
    // "bg-page" — custom dark navy color (square brackets let you use any CSS value).
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-page pt-20">
      {/* ── BACKGROUND LAYER 1: Radial glow ──────────────────────────────────
          A decorative div with no visible content — just a background gradient effect.
          "pointer-events-none" — this element won't block any mouse clicks or touch events.
          "absolute inset-0" — covers the entire parent section (top:0, right:0, bottom:0, left:0).
          The inline style creates a soft radial gradient: a faint blue glow centered
          at the top-center of the section, fading to fully transparent.
          This makes the headline area feel like it has a light source behind it.
      */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 20%, rgba(239,107,77,0.04) 0%, transparent 70%)",
        }}
      />
      {/* ── BACKGROUND LAYER 2: Animated canvas grid ─────────────────────────
          The <canvas> element is where the browser lets you draw with JavaScript.
          ref={canvasRef} links this element to our canvasRef variable above —
          so our useEffect can find it and draw the grid/scanline animation on it.
          "pointer-events-none" — decorative, shouldn't block interactions.
          "absolute inset-0 w-full h-full" — stretches to fill the entire section.
          aria-hidden="true" — tells screen readers to skip this (it's decorative).
      */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 w-full h-full"
        aria-hidden
      />
      {/* ── BACKGROUND LAYER 3: Accent orb ───────────────────────────────────
          A large blurred circle in the bottom-left corner, partially off-screen.
          "-bottom-32 -left-32" uses negative positioning to push it off the edge.
          "w-96 h-96" = 384x384px circle. "rounded-full" makes it perfectly round.
          "opacity-20" = 20% visible — very subtle, just a hint of color.
          The inline filter: blur(48px) turns the hard circle into a soft glow.
          Combined with the other layers, this adds warmth and depth to the corner.
      */}
      <div
        className="pointer-events-none absolute -bottom-32 -left-32 w-96 h-96 rounded-full opacity-15"
        style={{
          background:
            "radial-gradient(circle, var(--brand-accent) 0%, transparent 70%)",
          filter: "blur(48px)",
        }}
      />
      {/* ── MAIN CONTENT AREA ─────────────────────────────────────────────────
          This div contains everything the user actually reads.
          "relative z-10" — keeps it above the background layers (z-index 10).
          "flex flex-col items-center text-center" — stacks children vertically, centered.
          "px-6 md:px-16" — horizontal padding: tighter on mobile, wider on desktop.
          "pt-24 pb-16" — top padding clears the navbar; bottom padding adds breathing room.
          "max-w-5xl mx-auto w-full" — caps width at 1024px and centers horizontally.
      */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 md:px-16 pt-24 pb-16 max-w-5xl mx-auto w-full">
        {/* ── EYEBROW BADGE ───────────────────────────────────────────────────
            A small label above the headline — common pattern on landing pages.
            Establishes credibility before the user even reads the headline.
            motion.div uses our fadeUp variant:
              custom={0} → delay = 0 * 0.13 = 0ms (animates in first, immediately)
              variants={fadeUp} → references our animation definition above
              initial="hidden" → start in the hidden state
              animate="visible" → animate to the visible state
        */}
        <motion.div
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full border border-brand-accent/25 bg-brand-accent/5 text-orange-700 text-xs uppercase tracking-widest"
          style={{ fontFamily: "var(--font-rajdhani)" }}
        >
          {/* Pulsing dot — w-1.5 h-1.5 = 6x6px circle, animate-pulse is a
              Tailwind built-in that repeatedly fades opacity in and out. */}
          <span className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-pulse" />
          Licensed & Insured · Residential & Commercial
        </motion.div>

        {/* ── HEADLINE ────────────────────────────────────────────────────────
            custom={1} → delay = 1 * 0.13 = 130ms (animates in second)
            "text-5xl md:text-7xl" — responsive size: 48px mobile, 72px desktop.
            "leading-[1.06]" — tight line height (square brackets = exact value).
            "tracking-tight" — slightly reduced letter spacing for large text.
        */}
        <motion.h1
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="text-5xl md:text-7xl font-bold text-text-primary leading-[1.06] tracking-tight mb-6"
          style={{ fontFamily: "var(--font-rajdhani)" }}
        >
          {heroHeading}
          <br />
          {/* Gradient text technique:
              1. Set a gradient as the background of this span
              2. WebkitBackgroundClip: "text" clips the background to the text shape only
              3. WebkitTextFillColor: "transparent" makes the text itself see-through
              Result: the gradient shows through the text shape — looks like colored text
              but is actually a background gradient underneath transparent text. */}
          <span
            className="relative inline-block"
            style={{
              background:
                "linear-gradient(90deg, var(--brand-accent) 0%, var(--brand-accent-light) 60%, var(--brand-accent-lighter) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {heroHeadingAccent}
          </span>
        </motion.h1>

        {/* ── SUBHEADLINE ─────────────────────────────────────────────────────
            custom={2} → delay = 2 * 0.13 = 260ms (animates in third)
            "text-slate-600" — muted grey, creates visual hierarchy below headline.
            "max-w-2xl" — caps width at 672px so text doesn't stretch too wide.
            "leading-relaxed" — looser line height (1.625) for paragraph readability.
        */}
        <motion.p
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="text-text-secondary text-lg md:text-xl max-w-2xl leading-relaxed mb-10"
          style={{ fontFamily: "var(--font-dm-sans)" }}
        >
          {heroSubheading}
        </motion.p>

        {/* ── CTA BUTTONS ─────────────────────────────────────────────────────
            custom={3} → delay = 3 * 0.13 = 390ms (animates in fourth)
            "flex flex-col sm:flex-row" — stacked on mobile, side by side on 640px+.
            "items-center gap-4" — vertically centered, 16px gap between them.
        */}
        <motion.div
          custom={3}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          {/* Primary CTA — solid filled button.
              "group" is a Tailwind feature: when you add "group" to a parent,
              child elements can respond to the parent's hover state using "group-hover:".
              hover:bg-brand-base hover:text-white changes background on hover.
              transition-colors duration-200 = smooth 200ms color transition. */}
          <button
            onClick={scrollToForm}
            className="group flex items-center gap-3 bg-brand-accent text-brand-base font-bold px-8 py-4 rounded-sm text-sm uppercase tracking-widest hover:bg-brand-base hover:text-white transition-colors duration-200"
            style={{ fontFamily: "var(--font-rajdhani)" }}
          >
            Get a Free Estimate
            {/* Arrow icon with group-hover micro-interaction.
                "group-hover:translate-x-1" moves the arrow 4px right when the
                PARENT BUTTON is hovered — this works because of the "group" class above.
                transition-transform duration-200 = smooth 200ms movement. */}
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform duration-200"
            />
          </button>

          {/* Secondary option — plain text link, not a button.
              href="tel:+15550000000" makes this a phone link.
              On mobile devices, tapping it opens the phone dialer automatically. */}
          <a
            href={siteConfig.phoneHref}
            className="text-text-secondary hover:text-text-primary text-sm tracking-wide transition-colors duration-200"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            or call{" "}
            <span className="text-text-primary font-medium">{settings.phone}</span>
          </a>
        </motion.div>

        {/* ── FEATURED SERVICES ROW ─────────────────────────────────────────
            Clicking a service scrolls to the estimate form and pre-selects it.
        */}
        <motion.div
          custom={4}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mt-16 flex flex-col sm:flex-row items-center gap-4 w-full max-w-2xl justify-center"
        >
          {featuredServices.map((service) => (
            <button
              key={service._id}
              onClick={() => scrollToFormWithService(service.slug)}
              className="group flex items-center gap-2 px-5 py-3 rounded-sm border border-brand-accent/20 bg-brand-accent/5 hover:bg-brand-accent/10 hover:border-brand-accent/40 transition-all duration-200 cursor-pointer"
            >
              <span
                className="text-sm text-orange-700 uppercase tracking-widest font-semibold"
                style={{ fontFamily: "var(--font-rajdhani)" }}
              >
                {service.title}
              </span>
              <ArrowRight
                size={14}
                className="text-orange-700/60 group-hover:translate-x-0.5 transition-transform duration-200"
              />
            </button>
          ))}
        </motion.div>
      </div>{" "}
      {/* end main content div */}
      {/* ── SCROLL CUE ────────────────────────────────────────────────────────
          A small "Scroll" label + bouncing chevron at the bottom of the section.
          Signals to the user there's more content below.
          "absolute bottom-8" — 32px from the bottom of the section.
          "left-1/2 -translate-x-1/2" — a common centering trick:
            left-1/2 moves the LEFT EDGE to the center,
            -translate-x-1/2 shifts it back left by half its own width,
            result: the element is perfectly centered horizontally.
          This one doesn't use our fadeUp variant — it has its own simple animation
          with a long delay (1.4s) so it appears after everything else has loaded.
          "animate-bounce" is a Tailwind built-in CSS keyframe animation.
      */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-text-subtle z-10"
      >
        <span
          className="text-[10px] uppercase tracking-widest"
          style={{ fontFamily: "var(--font-rajdhani)" }}
        >
          Scroll
        </span>
        <ChevronDown size={14} className="animate-bounce" />
      </motion.div>
      {/* ── GOOGLE FONTS ──────────────────────────────────────────────────────
          This loads our two custom fonts from Google Fonts.
          Rajdhani — display/heading font (geometric, technical, sharp)
          DM Sans — body font (clean, modern, highly readable)
          The @import goes inside a <style> tag injected into the page.
          NOTE: In a production project, move this @import into app/globals.css
          so the fonts load once globally, not inside each component.
          We're keeping it here for now so this component is fully self-contained
          and works without any changes to other files.
      */}
    </section>
  );
}
