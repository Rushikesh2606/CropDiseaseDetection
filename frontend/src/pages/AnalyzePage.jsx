/**
 * AnalyzePage — Interactive Leaf Condition Diagnosis.
 * Includes collapsible "How to read this result" panel reusing Block 1 callouts.
 * Styled with Tailwind v4 tokens and dark teal design system.
 */
import { useState } from 'react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { UploadDropzone } from '../components/analyzer/UploadDropzone';
import { ImagePreview } from '../components/analyzer/ImagePreview';
import { LoadingState } from '../components/analyzer/LoadingState';
import { ErrorBanner } from '../components/analyzer/ErrorBanner';
import { ResultCard } from '../components/analyzer/ResultCard';
import { usePrediction } from '../hooks/usePrediction';
import { useApiHealth } from '../hooks/useApiHealth';
import { Sparkles, RotateCcw, Info, CheckCircle2, ChevronDown, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export function AnalyzePage() {
  const {
    file,
    preview,
    result,
    loading,
    error,
    selectFile,
    analyze,
    cancel,
    reset,
  } = usePrediction();

  const { health } = useApiHealth();
  const [showHowToRead, setShowHowToRead] = useState(false);

  const thresholdStr = health?.confidence_threshold
    ? `${Math.round(health.confidence_threshold * 100)}%`
    : 'the configured threshold';

  return (
    <div className="min-h-screen flex flex-col bg-[#03080B] text-[#F5FAF6]">
      {/* Background atmosphere */}
      <div className="inner-bg" aria-hidden="true" />

      {/* Shared header */}
      <Header />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-10 page-fade-in" id="main-content">
        {/* Header section */}
        <div className="mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#88DECC]/10 border border-[#88DECC]/20 text-[#88DECC] text-xs font-medium mb-3">
            <Sparkles size={13} aria-hidden="true" />
            <span>Leaf Diagnosis Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-light tracking-tight text-[#F5FAF6] mb-2">
            Leaf Condition Diagnosis
          </h1>
          <p className="text-[#ECF1EF]/70 text-base max-w-2xl">
            Upload a clear photo of a single crop leaf. The model evaluates condition scores, checks confidence against {thresholdStr}, and presents verified agronomic guidance.
          </p>
        </div>

        {/* Collapsible: How to read this result panel */}
        <div className="mb-8 rounded-2xl bg-[rgba(3,8,11,0.55)] border border-[rgba(136,222,204,0.18)] overflow-hidden">
          <button
            type="button"
            className="w-full p-4 flex items-center justify-between text-left text-sm font-medium text-[#F5FAF6] hover:bg-white/5 transition-colors"
            onClick={() => setShowHowToRead((prev) => !prev)}
            aria-expanded={showHowToRead}
          >
            <span className="flex items-center gap-2">
              <HelpCircle size={16} className="text-[#88DECC]" />
              How to read this result
            </span>
            <ChevronDown
              size={16}
              className={`text-[#88DECC] transition-transform duration-200 ${
                showHowToRead ? 'rotate-180' : ''
              }`}
            />
          </button>
          {showHowToRead && (
            <div className="p-6 pt-2 border-t border-white/5 space-y-4">
              <p className="text-xs text-[#88DECC] font-mono">
                Illustrative layout guide, not a real prediction.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-white/5 space-y-1">
                  <p className="font-semibold text-white">Condition name</p>
                  <p className="text-white/60">The class the model scored highest.</p>
                </div>
                <div className="p-3 rounded-xl bg-white/5 space-y-1">
                  <p className="font-semibold text-white">Healthy / diseased badge</p>
                  <p className="text-white/60">Whether that class is a healthy leaf or a named condition.</p>
                </div>
                <div className="p-3 rounded-xl bg-white/5 space-y-1">
                  <p className="font-semibold text-white">Confidence</p>
                  <p className="text-white/60">The model&apos;s estimated probability for that class. It is an estimate, not a guarantee.</p>
                </div>
                <div className="p-3 rounded-xl bg-white/5 space-y-1">
                  <p className="font-semibold text-white">Threshold marker</p>
                  <p className="text-white/60">The minimum confidence needed before a result is shown as a match. Currently {thresholdStr}.</p>
                </div>
                <div className="p-3 rounded-xl bg-white/5 space-y-1">
                  <p className="font-semibold text-white">Top 3</p>
                  <p className="text-white/60">The three highest-scoring classes. When the model is unsure, these are possible matches, not a diagnosis.</p>
                </div>
                <div className="p-3 rounded-xl bg-white/5 space-y-1">
                  <p className="font-semibold text-white">Condition guide</p>
                  <p className="text-white/60">General reference information about the matched condition.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Upload & Preview */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-2xl bg-[rgba(3,8,11,0.55)] border border-[rgba(136,222,204,0.18)] space-y-6 backdrop-blur-md">
              <h2 className="text-lg font-medium text-white flex items-center justify-between">
                <span>1. Select Leaf Image</span>
                {preview && !loading && (
                  <button
                    onClick={reset}
                    className="text-xs text-white/40 hover:text-white/80 inline-flex items-center gap-1 transition-colors"
                    type="button"
                  >
                    <RotateCcw size={12} /> Reset
                  </button>
                )}
              </h2>

              {!preview ? (
                <UploadDropzone onFile={selectFile} />
              ) : (
                <div className="space-y-4">
                  <ImagePreview
                    preview={preview}
                    filename={file?.name}
                    onRemove={reset}
                    onReplace={selectFile}
                  />

                  {/* Run Analysis Trigger Button */}
                  {!result && !loading && (
                    <button
                      id="run-analysis-btn"
                      onClick={analyze}
                      className="w-full py-3.5 px-6 rounded-full bg-[#EEF1EA] text-[#122B2A] font-semibold flex items-center justify-center gap-2 hover:bg-[#88DECC] transition-colors"
                      type="button"
                    >
                      <Sparkles size={18} aria-hidden="true" />
                      Diagnose Leaf Condition
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Quick tips card */}
            <div className="p-5 rounded-2xl bg-[rgba(3,8,11,0.55)] border border-white/5 space-y-3">
              <h3 className="text-xs uppercase font-semibold text-white/50 tracking-wider flex items-center gap-1.5">
                <Info size={14} className="text-[#88DECC]" /> Photography Guidelines
              </h3>
              <ul className="text-xs text-white/60 space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={13} className="text-[#88DECC] mt-0.5 shrink-0" />
                  <span>Single leaf filling most of the frame in natural daylight.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={13} className="text-[#88DECC] mt-0.5 shrink-0" />
                  <span>Keep leaf centred (image is centre-cropped to 224 × 224 pixels).</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={13} className="text-[#88DECC] mt-0.5 shrink-0" />
                  <span>Results below {thresholdStr} trigger an uncertainty notice.</span>
                </li>
              </ul>
              <div className="pt-2 border-t border-white/5">
                <Link to="/diseases" className="text-xs text-[#88DECC] hover:underline inline-flex items-center gap-1">
                  Browse all 15 supported conditions →
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Results / Status */}
          <div className="lg:col-span-7">
            {loading && <LoadingState onCancel={cancel} />}

            {error && <ErrorBanner error={error} onRetry={analyze} />}

            {result && (
              <div className="space-y-6">
                <ResultCard result={result} />
                <div className="flex justify-end">
                  <button
                    onClick={reset}
                    className="inline-flex items-center gap-2 text-sm text-[#88DECC] hover:underline py-2 px-4"
                    type="button"
                  >
                    <RotateCcw size={14} /> Analyze Another Leaf
                  </button>
                </div>
              </div>
            )}

            {!loading && !error && !result && (
              <div className="p-12 rounded-2xl bg-[rgba(3,8,11,0.55)] border border-[rgba(136,222,204,0.18)] border-dashed text-center flex flex-col items-center justify-center min-h-[380px]">
                <div className="p-4 rounded-full bg-white/5 text-[#88DECC]/40 mb-4">
                  <Sparkles size={40} />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">
                  Awaiting Leaf Upload
                </h3>
                <p className="text-sm text-white/50 max-w-sm mb-6 leading-relaxed">
                  Select a picture on the left to evaluate for named conditions, spot lesions, or healthy foliage.
                </p>
                <div className="flex flex-wrap gap-2 justify-center text-xs font-mono text-white/40">
                  <span className="px-2.5 py-1 rounded-full bg-white/5">Apple</span>
                  <span className="px-2.5 py-1 rounded-full bg-white/5">Corn</span>
                  <span className="px-2.5 py-1 rounded-full bg-white/5">Grape</span>
                  <span className="px-2.5 py-1 rounded-full bg-white/5">Potato</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
