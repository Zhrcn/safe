import React, { useRef, useEffect, useMemo } from 'react';

// SVG icon components (copied from page.jsx)
const HeartSVG = React.forwardRef(({ style, className }, ref) => (
  <svg ref={ref} width="60" height="60" viewBox="0 0 60 60" fill="none" className={className} style={style} xmlns="http://www.w3.org/2000/svg">
    <path d="M30 44c-6-5-14-9-14-16a8 8 0 0 1 16 0 8 8 0 0 1 16 0c0 7-8 11-14 16z" fill="var(--color-destructive)" fillOpacity="0.18" />
  </svg>
));
const PlusSVG = React.forwardRef(({ style, className }, ref) => (
  <svg ref={ref} width="60" height="60" viewBox="0 0 60 60" fill="none" className={className} style={style} xmlns="http://www.w3.org/2000/svg">
    <rect x="22" y="22" width="16" height="16" rx="4" fill="var(--color-primary)" fillOpacity="0.13" />
    <path d="M38 30h-4v-4a2 2 0 1 0-4 0v4h-4a2 2 0 1 0 0 4h4v4a2 2 0 1 0 4 0v-4h4a2 2 0 1 0 0-4z" fill="var(--color-warning)" fillOpacity="0.13" />
  </svg>
));
const StethoscopeSVG = React.forwardRef(({ style, className }, ref) => (
  <svg ref={ref} width="64" height="64" viewBox="0 0 60 60" fill="none" className={className} style={style} xmlns="http://www.w3.org/2000/svg">
    <g>
      <circle cx="45" cy="45" r="7" fill="#4F8EF7" fillOpacity="0.13"/>
      <path d="M20 15v10a10 10 0 0 0 20 0V15" stroke="#4F8EF7" strokeWidth="2.5" fill="none"/>
      <circle cx="20" cy="15" r="3" fill="#4F8EF7" fillOpacity="0.18"/>
      <circle cx="40" cy="15" r="3" fill="#4F8EF7" fillOpacity="0.18"/>
      <path d="M45 45v-5" stroke="#4F8EF7" strokeWidth="2.5" strokeLinecap="round"/>
    </g>
  </svg>
));
const PillSVG = React.forwardRef(({ style, className }, ref) => (
  <svg ref={ref} width="56" height="56" viewBox="0 0 60 60" fill="none" className={className} style={style} xmlns="http://www.w3.org/2000/svg">
    <g>
      <rect x="18" y="32" width="24" height="10" rx="5" transform="rotate(-45 18 32)" fill="#F59E42" fillOpacity="0.13"/>
      <rect x="18" y="32" width="12" height="10" rx="5" transform="rotate(-45 18 32)" fill="#F43F5E" fillOpacity="0.18"/>
      <line x1="24" y1="36" x2="36" y2="24" stroke="#F59E42" strokeWidth="2"/>
    </g>
  </svg>
));
const SyringeSVG = React.forwardRef(({ style, className }, ref) => (
  <svg ref={ref} width="60" height="60" viewBox="0 0 60 60" fill="none" className={className} style={style} xmlns="http://www.w3.org/2000/svg">
    <g>
      <rect x="32" y="18" width="14" height="8" rx="2" transform="rotate(45 32 18)" fill="#10B981" fillOpacity="0.13"/>
      <rect x="36" y="22" width="10" height="4" rx="1" transform="rotate(45 36 22)" fill="#10B981" fillOpacity="0.18"/>
      <rect x="41" y="27" width="2" height="8" rx="1" transform="rotate(45 41 27)" fill="#374151" fillOpacity="0.18"/>
      <line x1="44" y1="16" x2="48" y2="20" stroke="#10B981" strokeWidth="2"/>
    </g>
  </svg>
));
const BandageSVG = React.forwardRef(({ style, className }, ref) => (
  <svg ref={ref} width="60" height="60" viewBox="0 0 60 60" fill="none" className={className} style={style} xmlns="http://www.w3.org/2000/svg">
    <g>
      <rect x="18" y="38" width="24" height="8" rx="4" transform="rotate(-45 18 38)" fill="#FBBF24" fillOpacity="0.13"/>
      <circle cx="30" cy="30" r="3" fill="#FBBF24" fillOpacity="0.18"/>
      <circle cx="27" cy="33" r="1" fill="#FBBF24" fillOpacity="0.18"/>
      <circle cx="33" cy="27" r="1" fill="#FBBF24" fillOpacity="0.18"/>
    </g>
  </svg>
));
const ThermometerSVG = React.forwardRef(({ style, className }, ref) => (
  <svg ref={ref} width="54" height="54" viewBox="0 0 54 54" fill="none" className={className} style={style} xmlns="http://www.w3.org/2000/svg">
    <g>
      <rect x="24" y="10" width="6" height="28" rx="3" fill="#F87171" fillOpacity="0.13"/>
      <rect x="25.5" y="12" width="3" height="24" rx="1.5" fill="#F87171" fillOpacity="0.18"/>
      <circle cx="27" cy="40" r="6" fill="#F87171" fillOpacity="0.18"/>
      <circle cx="27" cy="40" r="3" fill="#F87171" fillOpacity="0.25"/>
    </g>
  </svg>
));
const AmbulanceSVG = React.forwardRef(({ style, className }, ref) => (
  <svg ref={ref} width="70" height="40" viewBox="0 0 70 40" fill="none" className={className} style={style} xmlns="http://www.w3.org/2000/svg">
    <g>
      <rect x="10" y="18" width="40" height="14" rx="3" fill="#60A5FA" fillOpacity="0.13"/>
      <rect x="50" y="24" width="10" height="8" rx="2" fill="#F43F5E" fillOpacity="0.18"/>
      <circle cx="20" cy="36" r="4" fill="#374151" fillOpacity="0.18"/>
      <circle cx="50" cy="36" r="4" fill="#374151" fillOpacity="0.18"/>
      <rect x="25" y="22" width="8" height="2" rx="1" fill="#F43F5E" fillOpacity="0.5"/>
      <rect x="29" y="18" width="2" height="8" rx="1" fill="#F43F5E" fillOpacity="0.5"/>
    </g>
  </svg>
));
const MedicalBagSVG = React.forwardRef(({ style, className }, ref) => (
  <svg ref={ref} width="54" height="54" viewBox="0 0 54 54" fill="none" className={className} style={style} xmlns="http://www.w3.org/2000/svg">
    <g>
      <rect x="12" y="22" width="30" height="18" rx="4" fill="#A78BFA" fillOpacity="0.13"/>
      <rect x="20" y="16" width="14" height="8" rx="2" fill="#A78BFA" fillOpacity="0.18"/>
      <rect x="25" y="28" width="4" height="8" rx="2" fill="#F43F5E" fillOpacity="0.18"/>
      <rect x="22" y="31" width="10" height="2" rx="1" fill="#F43F5E" fillOpacity="0.18"/>
    </g>
  </svg>
));
const DNAHelixSVG = React.forwardRef(({ style, className }, ref) => (
  <svg ref={ref} width="54" height="54" viewBox="0 0 54 54" fill="none" className={className} style={style} xmlns="http://www.w3.org/2000/svg">
    <g>
      <path d="M18 10c8 8 10 26 18 34" stroke="#34D399" strokeWidth="2.5" fill="none"/>
      <path d="M36 10c-8 8-10 26-18 34" stroke="#60A5FA" strokeWidth="2.5" fill="none"/>
      <ellipse cx="27" cy="27" rx="3" ry="6" fill="#34D399" fillOpacity="0.13"/>
      <ellipse cx="27" cy="27" rx="6" ry="3" fill="#60A5FA" fillOpacity="0.13"/>
    </g>
  </svg>
));
const MicroscopeSVG = React.forwardRef(({ style, className }, ref) => (
  <svg ref={ref} width="54" height="54" viewBox="0 0 54 54" fill="none" className={className} style={style} xmlns="http://www.w3.org/2000/svg">
    <g>
      <rect x="24" y="30" width="6" height="12" rx="2" fill="#F59E42" fillOpacity="0.13"/>
      <rect x="28" y="18" width="4" height="14" rx="2" transform="rotate(30 28 18)" fill="#F59E42" fillOpacity="0.18"/>
      <circle cx="27" cy="44" r="4" fill="#F59E42" fillOpacity="0.18"/>
      <rect x="20" y="38" width="14" height="2" rx="1" fill="#F59E42" fillOpacity="0.18"/>
    </g>
  </svg>
));
const MedicalChartSVG = React.forwardRef(({ style, className }, ref) => (
  <svg ref={ref} width="54" height="54" viewBox="0 0 54 54" fill="none" className={className} style={style} xmlns="http://www.w3.org/2000/svg">
    <g>
      <rect x="14" y="14" width="26" height="26" rx="4" fill="#FBBF24" fillOpacity="0.13"/>
      <polyline points="18,32 24,26 30,34 36,22" stroke="#F43F5E" strokeWidth="2" fill="none"/>
      <circle cx="18" cy="32" r="2" fill="#F43F5E" fillOpacity="0.18"/>
      <circle cx="24" cy="26" r="2" fill="#F43F5E" fillOpacity="0.18"/>
      <circle cx="30" cy="34" r="2" fill="#F43F5E" fillOpacity="0.18"/>
      <circle cx="36" cy="22" r="2" fill="#F43F5E" fillOpacity="0.18"/>
    </g>
  </svg>
));
const CrutchSVG = React.forwardRef(({ style, className }, ref) => (
  <svg ref={ref} width="54" height="54" viewBox="0 0 54 54" fill="none" className={className} style={style} xmlns="http://www.w3.org/2000/svg">
    <g>
      <rect x="25" y="10" width="4" height="28" rx="2" fill="#A3E635" fillOpacity="0.13"/>
      <rect x="23" y="36" width="8" height="4" rx="2" fill="#A3E635" fillOpacity="0.18"/>
      <rect x="23" y="14" width="8" height="4" rx="2" fill="#A3E635" fillOpacity="0.18"/>
      <rect x="27" y="18" width="2" height="16" rx="1" fill="#A3E635" fillOpacity="0.18"/>
    </g>
  </svg>
));
const ToothSVG = React.forwardRef(({ style, className }, ref) => (
  <svg ref={ref} width="54" height="54" viewBox="0 0 54 54" fill="none" className={className} style={style} xmlns="http://www.w3.org/2000/svg">
    <g>
      <path d="M18 20c0-6 18-6 18 0 0 10-4 20-9 20s-9-10-9-20z" fill="#F3F4F6" fillOpacity="0.13" stroke="#A1A1AA" strokeWidth="2"/>
      <ellipse cx="27" cy="22" rx="6" ry="3" fill="#A1A1AA" fillOpacity="0.13"/>
    </g>
  </svg>
));
const MedicalGloveSVG = React.forwardRef(({ style, className }, ref) => (
  <svg ref={ref} width="54" height="54" viewBox="0 0 54 54" fill="none" className={className} style={style} xmlns="http://www.w3.org/2000/svg">
    <g>
      <rect x="22" y="18" width="10" height="18" rx="5" fill="#38BDF8" fillOpacity="0.13"/>
      <rect x="24" y="12" width="6" height="10" rx="3" fill="#38BDF8" fillOpacity="0.18"/>
      <rect x="20" y="36" width="14" height="4" rx="2" fill="#38BDF8" fillOpacity="0.18"/>
    </g>
  </svg>
));

const MEDICAL_SVGS = [
  HeartSVG, PlusSVG, StethoscopeSVG, PillSVG, SyringeSVG, BandageSVG, ThermometerSVG,
  AmbulanceSVG, MedicalBagSVG, DNAHelixSVG, MicroscopeSVG, MedicalChartSVG, CrutchSVG,
  ToothSVG, MedicalGloveSVG,
];

function randomBetween(a, b) {
  return a + Math.random() * (b - a);
}

function generateMedicalPattern(count = 48) {
  const icons = [];
  for (let i = 0; i < count; ++i) {
    const SVG = MEDICAL_SVGS[Math.floor(Math.random() * MEDICAL_SVGS.length)];
    const gridX = i % 8;
    const gridY = Math.floor(i / 8);
    const left = `calc(${(gridX * 12.5) + randomBetween(-3, 3)}%)`;
    const top = `calc(${(gridY * 14) + randomBetween(-4, 4)}%)`;
    const size = randomBetween(44, 70);
    const float = randomBetween(7, 15);
    const scale = randomBetween(0.95, 1.25);
    const lag = randomBetween(0.08, 0.15);
    const phase = randomBetween(0, 2 * Math.PI);
    const move = {
      x: randomBetween(16, 48),
      y: randomBetween(12, 36),
    };
    icons.push({ SVG, left, top, size, float, scale, lag, phase, move });
  }
  return icons;
}

export default function MedicalIconsBackground({ className }) {
  const MEDICAL_ICONS = useMemo(() => generateMedicalPattern(48), []);
  const iconRefs = useRef(MEDICAL_ICONS.map(() => React.createRef()));
  const mouseTarget = useRef({ x: 0, y: 0 });
  const iconStates = useRef(MEDICAL_ICONS.map(() => ({ x: 0, y: 0 })));
  const animFrame = useRef();
  const bgRef = useRef(null);

  const handleMouseMove = (e) => {
    const rect = bgRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    mouseTarget.current = { x, y };
  };
  const handleMouseLeave = () => {
    mouseTarget.current = { x: 0, y: 0 };
  };

  useEffect(() => {
    if (typeof window === 'undefined' || typeof performance === 'undefined') return;
    let running = true;
    function animate() {
      const now = performance.now() / 1000;
      MEDICAL_ICONS.forEach((icon, i) => {
        const moveX = -mouseTarget.current.x * icon.move.x;
        const moveY = -mouseTarget.current.y * icon.move.y;
        iconStates.current[i].x += (moveX - iconStates.current[i].x) * icon.lag;
        iconStates.current[i].y += (moveY - iconStates.current[i].y) * icon.lag;
        const floatY = Math.sin(now * 1.1 + icon.phase) * icon.float;
        const floatR = Math.sin(now * 0.7 + icon.phase) * 2;
        const ref = iconRefs.current[i].current;
        if (ref) {
          ref.style.transform = `translate(${iconStates.current[i].x}px, ${iconStates.current[i].y + floatY}px) scale(${icon.scale}) rotate(${floatR}deg)`;
        }
      });
      if (running) animFrame.current = requestAnimationFrame(animate);
    }
    animFrame.current = requestAnimationFrame(animate);
    return () => {
      running = false;
      if (animFrame.current) cancelAnimationFrame(animFrame.current);
    };
  }, [MEDICAL_ICONS]);

  return (
    <div
      ref={bgRef}
      className={
        className ||
        'pointer-events-none select-none fixed inset-0 z-0 opacity-30 contrast-125 dark:opacity-40'
      }
      aria-hidden="true"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {MEDICAL_ICONS.map(({ SVG, left, top, size }, i) => (
        <span
          key={i}
          style={{
            position: 'absolute',
            left,
            top,
            width: size,
            height: size,
            display: 'inline-block',
          }}
        >
          <SVG ref={iconRefs.current[i]} />
        </span>
      ))}
    </div>
  );
} 