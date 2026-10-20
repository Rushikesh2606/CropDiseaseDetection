/** ImagePreview — shows selected image with remove/replace actions */
import { RefreshCw, X } from 'lucide-react';
import { useRef } from 'react';

const ACCEPTED = 'image/jpeg,image/png,image/webp';

export function ImagePreview({ preview, filename, onRemove, onReplace }) {
  const inputRef = useRef(null);

  const onInputChange = (e) => {
    const f = e.target.files?.[0];
    if (f) onReplace(f);
    e.target.value = '';
  };

  return (
    <div className="glass-card overflow-hidden" id="image-preview">
      <div className="relative">
        <img
          src={preview}
          alt={`Preview of ${filename || 'uploaded leaf image'}`}
          className="w-full max-h-72 object-contain bg-black/20"
        />
        <div className="absolute top-3 right-3 flex gap-2">
          <button
            id="replace-image-btn"
            onClick={() => inputRef.current?.click()}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-black/60 text-white/70 hover:text-white hover:bg-black/80 transition-colors backdrop-blur-sm"
            aria-label="Replace image"
          >
            <RefreshCw size={12} aria-hidden="true" />
            Replace
          </button>
          <button
            id="remove-image-btn"
            onClick={onRemove}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-black/60 text-white/70 hover:text-red-400 hover:bg-black/80 transition-colors backdrop-blur-sm"
            aria-label="Remove image"
          >
            <X size={12} aria-hidden="true" />
            Remove
          </button>
        </div>
      </div>
      {filename && (
        <p className="px-4 py-2 text-xs text-white/40 border-t border-white/5 truncate">
          {filename}
        </p>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED}
        capture="environment"
        className="sr-only"
        aria-label="Replace leaf image"
        onChange={onInputChange}
      />
    </div>
  );
}
