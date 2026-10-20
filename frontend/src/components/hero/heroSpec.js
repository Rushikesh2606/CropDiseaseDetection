/**
 * PlantGuard AI — HERO_SPEC Constants
 * All values copied character-for-character from HERO_SPEC.
 * Used by components and tested directly in Vitest conformance test.
 */

export const VIDEO_URL = '/bg1.mp4';

// Colors [SPEC]
export const COLORS = {
  bg: '#03080B',
  ink: '#F5FAF6',
  ink2: '#ECF1EF',
  teal: '#88DECC',
  iconTeal: '#7EC4B5',
  chevron: '#7CCBBA',
  moth: '#315352',
  cream: '#EEF1EA',
  pine: '#122B2A',
  logoDisc: '#030909',
  hoverDisc: '#26504d',
};

// Shade alpha stops [SPEC]
export const SHADE_HORIZ_ALPHAS = [0.683, 0.595, 0.458, 0.221, 0.039, 0.054];
export const SHADE_VERT_ALPHAS  = [0.060, 0.023, 0.152, 0.300, 0.394, 0.632];
export const SHADE_STOPS = [0, 20, 40, 60, 80, 100];
export const SHADE_RADIAL = {
  rx: '93.8%',
  ry: '41.3%',
  cx: '0%',
  cy: '100%',
  startAlpha: 1,
  endAlpha: 0,
};

// Easings [SPEC]
export const EASINGS = {
  quart: 'cubic-bezier(0.25, 1, 0.5, 1)',
  expo: 'cubic-bezier(0.16, 1, 0.3, 1)',
  grow: 'cubic-bezier(0.45, 0, 0.2, 1)',
};

// Entrance timeline constants [SPEC]
export const TIMELINE = {
  failsafeMs: 3500,
  logo: { delay: 0, duration: 500, easing: EASINGS.quart },
  treePathStart: 80,
  treePathStep: 45,
  treePathDuration: 820,
  treePathEasing: EASINGS.grow,
  moth: { delay: 420, duration: 650, easing: EASINGS.expo, scaleStart: 0.92 },
  nav: { delay: 120, duration: 700, easing: EASINGS.expo, lift: 8 },
  linkStart: 260,
  linkStep: 45,
  linkLift: 4,
  sound: { delay: 200, lift: 8 },
  brand: { delay: 300, duration: 650, lift: 10 },
  titleStart: 380,
  titleStep: 90,
  titleDuration: 1050,
  titleEasing: EASINGS.expo,
  titleTransform: 'translateY(115%)',
  lede: [
    { delay: 800, duration: 800, lift: 14 },
    { delay: 860, duration: 800, lift: 14 }
  ],
  cta: { delay: 1000, duration: 800, lift: 12 },
  textLink: { delay: 1100, duration: 600, easing: EASINGS.quart, lift: 8 },
  scrollCue: { delay: 1250, duration: 700, easing: EASINGS.expo, fromY: -6 },
};

// Exact SVG Paths [SPEC]
export const SVG_PATHS = {
  tree: [
    'M24.2 37V24',
    'M19.8 39.3c1.2-1.9 2.8-2.7 4.4-2.7s3.2.8 4.4 2.7',
    'M23.8 30.2c-2.8-.6-5.5-2.6-7.2-5-2-1.8-5.2-2-7-4.2-1.4-1.8-1.4-4.2 0-6 2-3 5.8-5.2 8.8-6.2 1.4-.5 2.8-1 4.2-1.3',
    'M14.8 23V13.2c0-1.4.8-2.6 2.4-3.4',
    'M24 24.2c-1.8-1.8-3.2-3.8-3.7-6.4-.5-2.6-.6-5.2-.3-7.2',
    'M24.3 23.2c1.5-3 3.5-6.4 4.3-10.2.4-2.6 1.2-4.1 2.8-4.3H35',
    'M24.6 25.7c3-.7 5.8-2.1 7.4-4.5 1.2-1.8 1.4-3.8 2.8-5.2 1.4-1.4 3.2-2.1 5.2-2.4'
  ],
  mothWing:
    'M19.5 12.4C17.5 9.5 14 5 10.8 3 9.6 2.4 8 2.2 6 2.3 4.2 2.4 3.1 3 3 4.8L3.1 9.8C3.2 12.4 5 15 8.3 17.3 6.6 19.5 5.6 21.8 5.4 24.2 5.2 26.2 5.8 27.6 7.3 28 8.8 28.3 10.2 27.3 11.4 25.8 14.2 22.6 17.2 19.8 19.5 17.1Z',
  mothTransform: 'matrix(-1 0 0 1 39 0)',
  chevron: 'M.7.7 5.5 5.3 10.3.7',
  partnerArrow: 'M.5.5 3.5 3.5.5 6.5',
  ctaArrow: 'M.6.6 4 4 .6 7.4',
  speakerBody: 'M14.6 19.6h3.6l5.9-4.9v18.6l-5.9-4.9h-3.6z',
  speakerWave1: 'M27.6 19.6c1.9 2.8 1.9 6 0 8.8',
  speakerWave2: 'M31.2 16.2c3.4 4.9 3.4 10.7 0 15.6',
  menuBars: ['M1 1h16', 'M1 6h16', 'M1 11h16']
};
