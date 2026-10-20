/**
 * SVG icons for PlantGuard AI hero components.
 * ALL paths copied character-for-character from HERO_SPEC.
 * No re-drawing, no simplification, no icon-library substitutes.
 */
import { SVG_PATHS } from './heroSpec';

/** Delta Tree in Logo Disc [SPEC: viewBox 0 0 46 46, stroke #7CC6B5, width 1.6, round caps] */
export function DeltaTreeIcon({ className = 'pg-logo-tree' }) {
  return (
    <svg className={className} viewBox="0 0 46 46" fill="none" aria-hidden="true">
      <g stroke="#7CC6B5" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        {SVG_PATHS.tree.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>
    </svg>
  );
}

/** Moth [SPEC: viewBox 0 0 39 30, fill #315352, one wing + mirrored matrix(-1 0 0 1 39 0)] */
export function MothIcon({ className = 'pg-logo-moth' }) {
  return (
    <svg className={className} viewBox="0 0 39 30" fill="none" aria-hidden="true">
      <path d={SVG_PATHS.mothWing} fill="#315352" />
      <path d={SVG_PATHS.mothWing} fill="#315352" transform={SVG_PATHS.mothTransform} />
    </svg>
  );
}

/** Chevron [SPEC: M.7.7 5.5 5.3 10.3.7] */
export function ChevronIcon({ className = '', width = 11, height = 6, stroke = 'currentColor', strokeWidth = 1.4 }) {
  return (
    <svg className={className} width={width} height={height} viewBox="0 0 11 6" fill="none" aria-hidden="true">
      <polyline points=".7,.7 5.5,5.3 10.3,.7" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

/** Partner arrow [SPEC: M.5.5 3.5 3.5.5 6.5] */
export function PartnerArrowIcon({ className = '', width = 7, height = 7, stroke = 'white', strokeWidth = 1.4 }) {
  return (
    <svg className={className} width={width} height={height} viewBox="0 0 7 7" fill="none" aria-hidden="true">
      <polyline points=".5,.5 3.5,3.5 .5,6.5" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

/** CTA arrow [SPEC: M.6.6 4 4 .6 7.4] */
export function CtaArrowIcon({ className = '', width = 8, height = 8, stroke = 'white', strokeWidth = 1.5 }) {
  return (
    <svg className={className} width={width} height={height} viewBox="0 0 8 8" fill="none" aria-hidden="true">
      <polyline points=".6,.6 4,4 .6,7.4" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

/** Speaker Icon [SPEC: body + 2 waves] */
export function SpeakerIcon({ isPressed = false }) {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path d={SVG_PATHS.speakerBody} fill="currentColor" />
      <path
        d={SVG_PATHS.speakerWave1}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        style={{ opacity: isPressed ? 1 : 0.25, transition: 'opacity 0.2s' }}
      />
      <path
        d={SVG_PATHS.speakerWave2}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        style={{ opacity: isPressed ? 1 : 0.25, transition: 'opacity 0.2s' }}
      />
    </svg>
  );
}

/** Menu Bars [SPEC: M1 1h16, M1 6h16, M1 11h16] */
export function MenuBarsIcon({ isOpen = false }) {
  if (isOpen) {
    return (
      <svg width="18" height="12" viewBox="0 0 18 12" fill="none" aria-hidden="true">
        <line x1="2" y1="1" x2="16" y2="11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <line x1="2" y1="11" x2="16" y2="1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg width="18" height="12" viewBox="0 0 18 12" fill="none" aria-hidden="true">
      {SVG_PATHS.menuBars.map((d, i) => (
        <path key={i} d={d} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      ))}
    </svg>
  );
}
