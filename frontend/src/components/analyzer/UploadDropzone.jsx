/**
 * UploadDropzone — drag-and-drop + file picker with client-side validation.
 */
import { useState, useRef, useCallback, useId } from 'react';
import { Upload, ImageIcon } from 'lucide-react';
import { validateFile } from '../../services/predictionService';

const ACCEPTED = 'image/jpeg,image/png,image/webp';

export function UploadDropzone({ onFile, maxMb = 10 }) {
  const [dragging, setDragging] = useState(false);
  const [validationError, setValidationError] = useState(null);
  const inputRef = useRef(null);
  const inputId = useId();

  const handleFile = useCallback((f) => {
    const err = validateFile(f, maxMb);
    if (err) {
      setValidationError(err);
      return;
    }
    setValidationError(null);
    onFile(f);
  }, [onFile, maxMb]);

  const onDragEnter = (e) => { e.preventDefault(); setDragging(true);  };
  const onDragLeave = (e) => { e.preventDefault(); setDragging(false); };
  const onDragOver  = (e) => { e.preventDefault(); };
  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  };

  const onInputChange = (e) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
    e.target.value = '';
  };

  return (
    <div>
      <div
        id="upload-dropzone"
        role="button"
        tabIndex={0}
        aria-label="Upload leaf image — click or drag a file here"
        className={[
          'relative flex flex-col items-center justify-center gap-4',
          'rounded-2xl border-2 border-dashed p-12 text-center cursor-pointer',
          'transition-all duration-200',
          dragging
            ? 'border-teal bg-teal/10 scale-[1.01]'
            : 'border-white/20 hover:border-teal/50 hover:bg-white/5',
        ].join(' ')}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click(); }}
      >
        <div className={`rounded-full p-4 transition-colors ${dragging ? 'bg-teal/20' : 'bg-white/5'}`}>
          {dragging
            ? <ImageIcon size={36} className="text-teal" aria-hidden="true" />
            : <Upload size={36} className="text-white/40" aria-hidden="true" />
          }
        </div>

        <div>
          <p className="text-base font-medium text-white/80 mb-1">
            {dragging ? 'Drop your leaf image here' : 'Drag & drop a leaf image'}
          </p>
          <p className="text-sm text-white/40">
            or <span className="text-teal underline">browse files</span>
          </p>
          <p className="text-xs text-white/30 mt-2">
            JPG, PNG, WEBP · Max {maxMb} MB · Single leaf, good lighting for best results
          </p>
        </div>
      </div>

      {validationError && (
        <p
          role="alert"
          id="upload-validation-error"
          className="mt-3 text-sm text-red-400 flex items-center gap-2"
        >
          ⚠ {validationError}
        </p>
      )}

      <input
        id={inputId}
        ref={inputRef}
        type="file"
        accept={ACCEPTED}
        capture="environment"
        className="sr-only"
        aria-label="Choose a leaf image file"
        onChange={onInputChange}
      />
    </div>
  );
}
