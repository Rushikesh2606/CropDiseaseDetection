/**
 * HeroVideo — Spec-exact background video component.
 * Uses remote CloudFront URL only (never downloaded).
 * Autoplay, muted, loop, playsInline, object-fit cover, pointer-events none.
 */
import { forwardRef } from 'react';
import { VIDEO_URL } from './heroSpec';

export const HeroVideo = forwardRef(function HeroVideo(
  { id = 'pg-video', onLoadedData },
  ref
) {
  return (
    <video
      ref={ref}
      className="pg-video"
      src={VIDEO_URL}
      autoPlay
      muted
      loop
      playsInline
      aria-hidden="true"
      tabIndex={-1}
      preload="auto"
      id={id}
      onLoadedData={onLoadedData}
    />
  );
});
