/**
 * Hero — Stage root component.
 * Assembles HeroVideo, ShadeLayers, Header, HeroCopy, HeroActions, and ScrollCue.
 * Uses exact .pg-* classes matching Stage A reference.
 */
import { useRef } from 'react';
import { HeroVideo } from './HeroVideo';
import { ShadeLayers } from './ShadeLayers';
import { Header } from '../layout/Header';
import { HeroCopy } from './HeroCopy';
import { HeroActions } from './HeroActions';
import { ScrollCue } from './ScrollCue';
import { useHeroEntrance } from '../../hooks/useHeroEntrance';

export function Hero() {
  const stageRef = useRef(null);
  const videoRef = useRef(null);

  useHeroEntrance({ stageRef, videoRef, isHome: true });

  return (
    <div
      className="pg-stage"
      id="pg-stage"
      ref={stageRef}
      aria-label="PlantGuard AI hero"
    >
      {/* Background video [SPEC: remote URL only] */}
      <HeroVideo ref={videoRef} />

      {/* Shade layers [SPEC: three overlays] */}
      <ShadeLayers />

      {/* Shared header inside hero stage */}
      <Header isHeroHeader isHidden />

      {/* Hero content (bottom-left) */}
      <main className="pg-hero-content" id="pg-hero-main">
        <HeroCopy isHidden />
        <HeroActions isHidden />
      </main>

      {/* Scroll cue (bottom-right) */}
      <ScrollCue isHidden />
    </div>
  );
}
