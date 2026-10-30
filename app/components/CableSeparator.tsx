"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion, type Variants } from "framer-motion";

// ─── TYPES ────────────────────────────────────────────────────────────────────
// Each variant represents a piece of network infrastructure used as a
// visual separator between page sections.
export type CableSeparatorVariant =
  | "patch-panel"
  | "switch"
  | "cable-tray"
  | "router"
  | "conduit";

interface CableSeparatorProps {
  variant: CableSeparatorVariant;
  label?: string; // overrides the default hardware label (e.g. "SW-01")
  topColor?: string; // background color of the section above, for gradient feathering
  bottomColor?: string; // background color of the section below, for gradient feathering
}

// ─── ANIMATION VARIANTS ───────────────────────────────────────────────────────
// Shared cable draw animation — pathLength 0→1, same spec as Benefits.tsx
function useCableVariants(prefersReducedMotion: boolean | null) {
  const cableVariants: Variants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (i: number) => ({
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: {
          duration: prefersReducedMotion ? 0 : 0.7,
          delay: i * 0.12,
          ease: "easeInOut",
        },
        opacity: { duration: 0.01, delay: i * 0.12 },
      },
    }),
  };

  const dotVariants: Variants = {
    hidden: { scale: 0, opacity: 0 },
    visible: (i: number) => ({
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.2,
        delay: prefersReducedMotion ? 0 : i * 0.12 + 0.65,
      },
    }),
  };

  const labelVariants: Variants = {
    hidden: { opacity: 0 },
    visible: (i: number) => ({
      opacity: 1,
      transition: { duration: 0.3, delay: prefersReducedMotion ? 0 : i * 0.12 + 0.8 },
    }),
  };

  return { cableVariants, dotVariants, labelVariants };
}

// ─── CABLE PATH HELPERS ───────────────────────────────────────────────────────
// All paths use L (lineto) only — right-angle turns, no curves.
// ViewBox is 1200 × 120. Cables travel from top (y=0) to bottom (y=120).

// Vertical straight cable passing through at a given x offset
function straightCable(x: number): string {
  return `M ${x},0 L ${x},120`;
}

// Cable with a horizontal detour at mid-height (cable management loop)
function loopCable(x: number, loopLeft: number, loopRight: number, loopY: number): string {
  return `M ${x},0 L ${x},${loopY} L ${loopLeft},${loopY} L ${loopLeft},${loopY + 18} L ${loopRight},${loopY + 18} L ${loopRight},${loopY} L ${x},${loopY} L ${x},120`;
}

// Cable entering from the left edge, routing across, then dropping down
function traCable(entryY: number, targetX: number, exitY: number): string {
  return `M 0,${entryY} L ${targetX - 30},${entryY} L ${targetX - 30},${exitY} L 1200,${exitY}`;
}

// ─── VARIANT SCENES ───────────────────────────────────────────────────────────
// Each returns JSX for the cables + hardware that make up that separator scene.
// isVisible controls animate state. All coords within viewBox 0 0 1200 120.

function PatchPanelScene({
  isVisible,
  hardwareLabel,
  cableVariants,
  dotVariants,
  labelVariants,
}: {
  isVisible: boolean;
  hardwareLabel: string;
  cableVariants: Variants;
  dotVariants: Variants;
  labelVariants: Variants;
}) {
  // 8 port housings centred at y=55, spread across x=280..920
  const panelX = 260;
  const panelW = 680;
  const panelY = 40;
  const panelH = 28;

  // Port x positions (8 ports evenly spaced inside panel)
  const portXs = Array.from({ length: 8 }, (_, i) => panelX + 40 + i * (panelW - 80) / 7);

  // 5 cables — alternating from left/right edges, connecting to ports
  const cableData = [
    { x: portXs[0], label: "CAT6A-01" },
    { x: portXs[2], label: "CAT6A-02" },
    { x: portXs[4], label: "CAT6A-03" },
    { x: portXs[6], label: "CAT6A-04" },
    { x: portXs[7], label: "CAT6A-05" },
  ];

  const animate = isVisible ? "visible" : "hidden";

  return (
    <>
      {/* Cables from top entering the panel */}
      {cableData.map((c, i) => (
        <g key={i}>
          {/* Glow */}
          <motion.path
            d={`M ${c.x},0 L ${c.x},${panelY}`}
            stroke="#EF6B4D" strokeOpacity="0.12" strokeWidth="4"
            fill="none" strokeLinecap="square"
            variants={cableVariants} custom={i}
            initial="hidden" animate={animate}
          />
          {/* Main */}
          <motion.path
            d={`M ${c.x},0 L ${c.x},${panelY}`}
            stroke="#EF6B4D" strokeOpacity="0.40" strokeWidth="1.5"
            fill="none" strokeLinecap="square"
            variants={cableVariants} custom={i}
            initial="hidden" animate={animate}
          />
          {/* Cables from bottom exiting the panel */}
          <motion.path
            d={`M ${c.x},${panelY + panelH} L ${c.x},120`}
            stroke="#EF6B4D" strokeOpacity="0.12" strokeWidth="4"
            fill="none" strokeLinecap="square"
            variants={cableVariants} custom={i + 0.4}
            initial="hidden" animate={animate}
          />
          <motion.path
            d={`M ${c.x},${panelY + panelH} L ${c.x},120`}
            stroke="#EF6B4D" strokeOpacity="0.40" strokeWidth="1.5"
            fill="none" strokeLinecap="square"
            variants={cableVariants} custom={i + 0.4}
            initial="hidden" animate={animate}
          />
          {/* Junction dots */}
          <motion.circle cx={c.x} cy={panelY} r="3" fill="#EF6B4D" fillOpacity="0.8"
            variants={dotVariants} custom={i} initial="hidden" animate={animate} />
          <motion.circle cx={c.x} cy={panelY + panelH} r="3" fill="#EF6B4D" fillOpacity="0.8"
            variants={dotVariants} custom={i + 0.4} initial="hidden" animate={animate} />
          {/* Cable label */}
          <motion.text
            x={c.x + 6} y={panelY - 8}
            fill="#EF6B4D" fillOpacity="0.7"
            fontSize="9" fontFamily="monospace" letterSpacing="1"
            variants={labelVariants} custom={i}
            initial="hidden" animate={animate}
          >
            {c.label}
          </motion.text>
        </g>
      ))}

      {/* Patch panel housing */}
      <motion.rect
        x={panelX} y={panelY} width={panelW} height={panelH}
        stroke="#EF6B4D" strokeOpacity="0.5" strokeWidth="1"
        fill="#EF6B4D" fillOpacity="0.03" rx="1"
        initial={{ opacity: 0 }}
        animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
      />

      {/* Port housings (8 inline RJ45 symbols) */}
      {portXs.map((px, i) => (
        <motion.g key={i}
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.3, delay: 0.6 + i * 0.04 }}
        >
          <rect x={px - 10} y={panelY + 5} width="20" height="14" rx="1"
            stroke="#EF6B4D" strokeOpacity="0.6" strokeWidth="0.8" fill="none" />
          {[2, 4, 6, 8, 10, 12, 14, 16].map((dx, j) => (
            <line key={j}
              x1={px - 10 + dx * 20 / 20} y1={panelY + 8}
              x2={px - 10 + dx * 20 / 20} y2={panelY + 17}
              stroke="#EF6B4D" strokeOpacity="0.6" strokeWidth="0.6"
            />
          ))}
        </motion.g>
      ))}

      {/* Hardware label */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.3, delay: 0.7 }}
      >
        <rect x={panelX + panelW - 72} y={panelY + 7} width="60" height="14" rx="1"
          stroke="#EF6B4D" strokeOpacity="0.45" strokeWidth="0.8"
          fill="#EF6B4D" fillOpacity="0.05" />
        <text x={panelX + panelW - 42} y={panelY + 17.5}
          fill="#EF6B4D" fillOpacity="0.8"
          fontSize="8" fontFamily="monospace" letterSpacing="1.5" textAnchor="middle"
        >
          {hardwareLabel}
        </text>
      </motion.g>
    </>
  );
}

function SwitchScene({
  isVisible,
  hardwareLabel,
  cableVariants,
  dotVariants,
  labelVariants,
}: {
  isVisible: boolean;
  hardwareLabel: string;
  cableVariants: Variants;
  dotVariants: Variants;
  labelVariants: Variants;
}) {
  const boxX = 380;
  const boxW = 440;
  const boxY = 38;
  const boxH = 40;

  // 4 cables, each with a port entry on top and exit on bottom
  const cableXs = [boxX + 60, boxX + 160, boxX + 280, boxX + 380];
  const labels = ["GE-01", "GE-02", "GE-03", "GE-04"];

  const animate = isVisible ? "visible" : "hidden";

  return (
    <>
      {cableXs.map((cx, i) => (
        <g key={i}>
          {/* In — top */}
          <motion.path d={`M ${cx},0 L ${cx},${boxY}`}
            stroke="#EF6B4D" strokeOpacity="0.12" strokeWidth="4"
            fill="none" strokeLinecap="square"
            variants={cableVariants} custom={i} initial="hidden" animate={animate} />
          <motion.path d={`M ${cx},0 L ${cx},${boxY}`}
            stroke="#EF6B4D" strokeOpacity="0.40" strokeWidth="1.5"
            fill="none" strokeLinecap="square"
            variants={cableVariants} custom={i} initial="hidden" animate={animate} />
          {/* Out — bottom */}
          <motion.path d={`M ${cx},${boxY + boxH} L ${cx},120`}
            stroke="#EF6B4D" strokeOpacity="0.12" strokeWidth="4"
            fill="none" strokeLinecap="square"
            variants={cableVariants} custom={i + 0.5} initial="hidden" animate={animate} />
          <motion.path d={`M ${cx},${boxY + boxH} L ${cx},120`}
            stroke="#EF6B4D" strokeOpacity="0.40" strokeWidth="1.5"
            fill="none" strokeLinecap="square"
            variants={cableVariants} custom={i + 0.5} initial="hidden" animate={animate} />
          {/* Dots */}
          <motion.circle cx={cx} cy={boxY} r="3" fill="#EF6B4D" fillOpacity="0.8"
            variants={dotVariants} custom={i} initial="hidden" animate={animate} />
          <motion.circle cx={cx} cy={boxY + boxH} r="3" fill="#EF6B4D" fillOpacity="0.8"
            variants={dotVariants} custom={i + 0.5} initial="hidden" animate={animate} />
          {/* Label */}
          <motion.text x={cx + 5} y={boxY - 7}
            fill="#EF6B4D" fillOpacity="0.7" fontSize="9" fontFamily="monospace" letterSpacing="1"
            variants={labelVariants} custom={i} initial="hidden" animate={animate}
          >{labels[i]}</motion.text>
        </g>
      ))}

      {/* Switch box */}
      <motion.rect x={boxX} y={boxY} width={boxW} height={boxH} rx="2"
        stroke="#EF6B4D" strokeOpacity="0.5" strokeWidth="1"
        fill="#EF6B4D" fillOpacity="0.03"
        initial={{ opacity: 0 }}
        animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
      />

      {/* Status LED strip */}
      {cableXs.map((cx, i) => (
        <motion.circle key={i} cx={cx} cy={boxY + 8} r="2.5"
          fill="#EF6B4D" fillOpacity="0.35"
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.2, delay: 0.7 + i * 0.08 }}
        />
      ))}

      {/* Hardware label */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.3, delay: 0.65 }}
      >
        <rect x={boxX + boxW - 64} y={boxY + boxH - 20} width="52" height="13" rx="1"
          stroke="#EF6B4D" strokeOpacity="0.45" strokeWidth="0.8"
          fill="#EF6B4D" fillOpacity="0.05" />
        <text x={boxX + boxW - 38} y={boxY + boxH - 10}
          fill="#EF6B4D" fillOpacity="0.8"
          fontSize="8" fontFamily="monospace" letterSpacing="1.5" textAnchor="middle"
        >{hardwareLabel}</text>
      </motion.g>
    </>
  );
}

function CableTrayScene({
  isVisible,
  cableVariants,
  dotVariants,
  labelVariants,
}: {
  isVisible: boolean;
  cableVariants: Variants;
  dotVariants: Variants;
  labelVariants: Variants;
}) {
  // Horizontal tray at y=55-65; cables route along the tray left-to-right then drop
  const trayY = 52;
  const labels = ["CAT6A-01", "CAT6A-02", "CAT6A-03", "CAT6A-04", "CAT6A-05"];

  // 5 cables: entry from top at different x, route along tray, exit to bottom
  const cableData = [
    { entryX: 100, exitX: 220 },
    { entryX: 320, exitX: 420 },
    { entryX: 500, exitX: 600 },
    { entryX: 720, exitX: 820 },
    { entryX: 940, exitX: 1060 },
  ];

  const animate = isVisible ? "visible" : "hidden";

  return (
    <>
      {/* Tray outline — horizontal guide */}
      <motion.rect x={0} y={trayY} width={1200} height={14}
        stroke="#EF6B4D" strokeOpacity="0.12" strokeWidth="1"
        fill="#EF6B4D" fillOpacity="0.02" rx="0"
        initial={{ opacity: 0 }}
        animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      />

      {/* Tray ribs (cable separation slots) */}
      {Array.from({ length: 16 }, (_, i) => (
        <motion.line key={i}
          x1={75 * i + 50} y1={trayY + 1} x2={75 * i + 50} y2={trayY + 13}
          stroke="#EF6B4D" strokeOpacity="0.15" strokeWidth="0.8"
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.2, delay: 0.3 + i * 0.02 }}
        />
      ))}

      {/* Cables */}
      {cableData.map((c, i) => {
        const midY = trayY + 7;
        const path = `M ${c.entryX},0 L ${c.entryX},${midY} L ${c.exitX},${midY} L ${c.exitX},120`;
        return (
          <g key={i}>
            <motion.path d={path}
              stroke="#EF6B4D" strokeOpacity="0.12" strokeWidth="4"
              fill="none" strokeLinecap="square"
              variants={cableVariants} custom={i} initial="hidden" animate={animate} />
            <motion.path d={path}
              stroke="#EF6B4D" strokeOpacity="0.40" strokeWidth="1.5"
              fill="none" strokeLinecap="square"
              variants={cableVariants} custom={i} initial="hidden" animate={animate} />
            <motion.circle cx={c.entryX} cy={midY} r="3" fill="#EF6B4D" fillOpacity="0.8"
              variants={dotVariants} custom={i} initial="hidden" animate={animate} />
            <motion.circle cx={c.exitX} cy={midY} r="3" fill="#EF6B4D" fillOpacity="0.8"
              variants={dotVariants} custom={i + 0.4} initial="hidden" animate={animate} />
            <motion.text x={c.entryX + 5} y={midY - 8}
              fill="#EF6B4D" fillOpacity="0.65" fontSize="9" fontFamily="monospace" letterSpacing="1"
              variants={labelVariants} custom={i} initial="hidden" animate={animate}
            >{labels[i]}</motion.text>
          </g>
        );
      })}
    </>
  );
}

function RouterScene({
  isVisible,
  hardwareLabel,
  cableVariants,
  dotVariants,
  labelVariants,
}: {
  isVisible: boolean;
  hardwareLabel: string;
  cableVariants: Variants;
  dotVariants: Variants;
  labelVariants: Variants;
}) {
  // Router shown as a hexagonal outline centred at (600, 60)
  const cx = 600;
  const cy = 60;
  const r = 28;

  // 3 cables: two from top-left/top-right, one straight down from center
  // plus 2 from bottom for exit
  const cables = [
    { path: `M ${cx - 220},0 L ${cx - 220},${cy} L ${cx - r},${cy}`, termX: cx - r, termY: cy, label: "WAN-01" },
    { path: `M ${cx + 220},0 L ${cx + 220},${cy} L ${cx + r},${cy}`, termX: cx + r, termY: cy, label: "WAN-02" },
    { path: `M ${cx},0 L ${cx},${cy - r}`, termX: cx, termY: cy - r, label: "UPLINK" },
    { path: `M ${cx - 140},120 L ${cx - 140},${cy} L ${cx - r * 0.7},${cy + r * 0.7}`, termX: cx - r * 0.7, termY: cy + r * 0.7, label: "LAN-01" },
    { path: `M ${cx + 140},120 L ${cx + 140},${cy} L ${cx + r * 0.7},${cy + r * 0.7}`, termX: cx + r * 0.7, termY: cy + r * 0.7, label: "LAN-02" },
  ];

  // Hexagon points
  const hex = Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
  }).join(" ");

  const animate = isVisible ? "visible" : "hidden";

  return (
    <>
      {cables.map((c, i) => (
        <g key={i}>
          <motion.path d={c.path}
            stroke="#EF6B4D" strokeOpacity="0.12" strokeWidth="4"
            fill="none" strokeLinecap="square"
            variants={cableVariants} custom={i} initial="hidden" animate={animate} />
          <motion.path d={c.path}
            stroke="#EF6B4D" strokeOpacity="0.40" strokeWidth="1.5"
            fill="none" strokeLinecap="square"
            variants={cableVariants} custom={i} initial="hidden" animate={animate} />
          <motion.circle cx={c.termX} cy={c.termY} r="3" fill="#EF6B4D" fillOpacity="0.8"
            variants={dotVariants} custom={i} initial="hidden" animate={animate} />
          <motion.text x={c.termX + 6} y={c.termY - 5}
            fill="#EF6B4D" fillOpacity="0.65" fontSize="9" fontFamily="monospace" letterSpacing="1"
            variants={labelVariants} custom={i} initial="hidden" animate={animate}
          >{c.label}</motion.text>
        </g>
      ))}

      {/* Hex outline */}
      <motion.polygon points={hex}
        stroke="#EF6B4D" strokeOpacity="0.5" strokeWidth="1"
        fill="#EF6B4D" fillOpacity="0.04"
        initial={{ opacity: 0 }}
        animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
      />

      {/* Inner circle */}
      <motion.circle cx={cx} cy={cy} r={10}
        stroke="#EF6B4D" strokeOpacity="0.4" strokeWidth="0.8"
        fill="none"
        initial={{ opacity: 0 }}
        animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.3, delay: 0.6 }}
      />

      {/* Hardware label */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.3, delay: 0.7 }}
      >
        <rect x={cx - 24} y={cy - 5} width="48" height="11" rx="1"
          stroke="#EF6B4D" strokeOpacity="0.25" strokeWidth="0.8"
          fill="#EF6B4D" fillOpacity="0.07" />
        <text x={cx} y={cy + 3.5}
          fill="#EF6B4D" fillOpacity="0.65"
          fontSize="7.5" fontFamily="monospace" letterSpacing="1" textAnchor="middle"
        >{hardwareLabel}</text>
      </motion.g>
    </>
  );
}

function ConduitScene({
  isVisible,
  cableVariants,
  dotVariants,
  labelVariants,
}: {
  isVisible: boolean;
  cableVariants: Variants;
  dotVariants: Variants;
  labelVariants: Variants;
}) {
  // Conduit section — 2 parallel vertical guide channels, 4 cables passing through
  const conduitLeft = 480;
  const conduitRight = 720;
  const conduitTopY = 30;
  const conduitBotY = 90;

  const cables = [
    { x: 510, label: "CAT6A-01" },
    { x: 560, label: "CAT6A-02" },
    { x: 640, label: "CAT6A-03" },
    { x: 690, label: "CAT6A-04" },
  ];

  const animate = isVisible ? "visible" : "hidden";

  return (
    <>
      {/* Conduit walls */}
      {[conduitLeft, conduitRight].map((x, i) => (
        <motion.line key={i} x1={x} y1={0} x2={x} y2={120}
          stroke="#EF6B4D" strokeOpacity="0.12" strokeWidth="1.5"
          strokeDasharray="6 4"
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
        />
      ))}

      {/* Conduit entry/exit rings */}
      {[conduitTopY, conduitBotY].map((y, j) => (
        <motion.rect key={j}
          x={conduitLeft - 6} y={y - 6}
          width={conduitRight - conduitLeft + 12} height={12} rx="6"
          stroke="#EF6B4D" strokeOpacity="0.45" strokeWidth="1"
          fill="#EF6B4D" fillOpacity="0.03"
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.3, delay: 0.4 + j * 0.1 }}
        />
      ))}

      {/* Cables */}
      {cables.map((c, i) => (
        <g key={i}>
          <motion.path d={`M ${c.x},0 L ${c.x},120`}
            stroke="#EF6B4D" strokeOpacity="0.12" strokeWidth="4"
            fill="none" strokeLinecap="square"
            variants={cableVariants} custom={i} initial="hidden" animate={animate} />
          <motion.path d={`M ${c.x},0 L ${c.x},120`}
            stroke="#EF6B4D" strokeOpacity="0.40" strokeWidth="1.5"
            fill="none" strokeLinecap="square"
            variants={cableVariants} custom={i} initial="hidden" animate={animate} />
          <motion.circle cx={c.x} cy={conduitTopY} r="3" fill="#EF6B4D" fillOpacity="0.8"
            variants={dotVariants} custom={i} initial="hidden" animate={animate} />
          <motion.circle cx={c.x} cy={conduitBotY} r="3" fill="#EF6B4D" fillOpacity="0.8"
            variants={dotVariants} custom={i + 0.5} initial="hidden" animate={animate} />
          <motion.text x={c.x + 5} y={conduitTopY - 8}
            fill="#EF6B4D" fillOpacity="0.65" fontSize="9" fontFamily="monospace" letterSpacing="1"
            variants={labelVariants} custom={i} initial="hidden" animate={animate}
          >{c.label}</motion.text>
        </g>
      ))}
    </>
  );
}

// ─── DEFAULT LABELS ───────────────────────────────────────────────────────────
const DEFAULT_LABELS: Record<CableSeparatorVariant, string> = {
  "patch-panel": "PP-01",
  "switch": "SW-01",
  "cable-tray": "TRAY-01",
  "router": "RTR-01",
  "conduit": "CDUIT-01",
};

// ─── MOBILE SCENE ─────────────────────────────────────────────────────────────
// Simplified version — just 2 cables with a crossing horizontal run.
// Shown below md breakpoint in place of the full desktop scene.
function MobileScene({
  isVisible,
  cableVariants,
  dotVariants,
}: {
  isVisible: boolean;
  cableVariants: Variants;
  dotVariants: Variants;
}) {
  const animate = isVisible ? "visible" : "hidden";
  // Two cables: one from top-left, routing right and down; one from top-right routing left and down
  const paths = [
    `M 80,0 L 80,40 L 220,40 L 220,80`,
    `M 300,0 L 300,40 L 160,40 L 160,80`,
  ];
  const dots = [
    { cx: 80, cy: 40 }, { cx: 220, cy: 40 },
    { cx: 300, cy: 40 }, { cx: 160, cy: 40 },
  ];

  return (
    <>
      {paths.map((d, i) => (
        <g key={i}>
          <motion.path d={d} stroke="#EF6B4D" strokeOpacity="0.12" strokeWidth="4"
            fill="none" strokeLinecap="square"
            variants={cableVariants} custom={i} initial="hidden" animate={animate} />
          <motion.path d={d} stroke="#EF6B4D" strokeOpacity="0.40" strokeWidth="1.5"
            fill="none" strokeLinecap="square"
            variants={cableVariants} custom={i} initial="hidden" animate={animate} />
        </g>
      ))}
      {dots.map((dot, i) => (
        <motion.circle key={i} cx={dot.cx} cy={dot.cy} r="3" fill="#EF6B4D" fillOpacity="0.8"
          variants={dotVariants} custom={i} initial="hidden" animate={animate} />
      ))}
    </>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function CableSeparator({ variant, label, topColor = "#f6f5f2", bottomColor = "#f6f5f2" }: CableSeparatorProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const prefersReducedMotion = useReducedMotion();

  const { cableVariants, dotVariants, labelVariants } = useCableVariants(prefersReducedMotion);
  const hardwareLabel = label ?? DEFAULT_LABELS[variant];

  const sceneProps = {
    isVisible: isInView,
    hardwareLabel,
    cableVariants,
    dotVariants,
    labelVariants,
  };

  return (
    // bg-page ensures there's no background gap — the separator sits flush
    // between sections and uses the same dark background.
    <div
      ref={ref}
      className="relative w-full bg-transparent overflow-hidden"
      aria-hidden="true"
      style={{ height: "clamp(80px, 10vw, 130px)" }}
    >
      {/* Desktop scene — full hardware + cable bundle */}
      <svg
        className="hidden md:block absolute inset-0 w-full h-full"
        viewBox="0 0 1200 120"
        preserveAspectRatio="xMidYMid meet"
        style={{ overflow: "visible" }}
      >
        {variant === "patch-panel" && <PatchPanelScene {...sceneProps} />}
        {variant === "switch" && <SwitchScene {...sceneProps} />}
        {variant === "cable-tray" && <CableTrayScene {...{ isVisible: isInView, cableVariants, dotVariants, labelVariants }} />}
        {variant === "router" && <RouterScene {...sceneProps} />}
        {variant === "conduit" && <ConduitScene {...{ isVisible: isInView, cableVariants, dotVariants, labelVariants }} />}
      </svg>

      {/* Mobile scene — simplified 2-cable routing */}
      <svg
        className="md:hidden absolute inset-0 w-full h-full"
        viewBox="0 0 400 80"
        preserveAspectRatio="xMidYMid meet"
      >
        <MobileScene isVisible={isInView} cableVariants={cableVariants} dotVariants={dotVariants} />
      </svg>

      {/* Top feather — fades from the section above into the separator */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-10"
        style={{
          height: "45%",
          background: `linear-gradient(to bottom, ${topColor}, transparent)`,
        }}
        aria-hidden="true"
      />
      {/* Bottom feather — fades from the section below into the separator */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10"
        style={{
          height: "45%",
          background: `linear-gradient(to top, ${bottomColor}, transparent)`,
        }}
        aria-hidden="true"
      />
    </div>
  );
}
