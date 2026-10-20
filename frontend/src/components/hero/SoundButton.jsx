/**
 * SoundButton — 48px circular dark button with speaker icon.
 * Toggles aria-pressed; waves opacity drops to 0.25 when false. No audio file.
 */
import { useState } from 'react';
import { SpeakerIcon } from './icons';

export function SoundButton({ id = 'pg-sound-btn', isHidden = false }) {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <button
      className={`pg-sound-btn ${isHidden ? 'pg-entrance-hidden' : ''}`}
      aria-label="Ambient nature sound"
      aria-pressed={isPressed}
      id={id}
      type="button"
      onClick={() => setIsPressed((prev) => !prev)}
    >
      <SpeakerIcon isPressed={isPressed} />
      <span className="pg-sound-waves" aria-hidden="true">
        <span className="pg-sound-wave" />
        <span className="pg-sound-wave" />
      </span>
    </button>
  );
}
