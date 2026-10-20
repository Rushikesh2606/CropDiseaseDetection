/**
 * DiseaseDetailPage — Agronomic Condition Profile.
 * Symptoms labeled 'General symptoms of this condition'.
 * Uses Tailwind v4 design tokens.
 */
import { useParams, Link } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { useDiseaseDetail } from '../hooks/useDiseases';
import {
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  ShieldCheck,
  Activity,
  CloudRain,
  Wrench,
  Camera,
  Info,
} from 'lucide-react';

export function DiseaseDetailPage() {
  const { classId } = useParams();
  const { disease, loading, error } = useDiseaseDetail(classId);

  return (
    <div className="min-h-screen flex flex-col bg-[#03080B] text-[#F5FAF6]">
      {/* Atmosphere background */}
      <div className="inner-bg" aria-hidden="true" />

      {/* Shared header */}
      <Header />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-10 page-fade-in" id="main-content">
        {/* Navigation Breadcrumb */}
        <div className="mb-6">
          <Link
            to="/diseases"
            className="inline-flex items-center gap-2 text-xs font-medium text-white/50 hover:text-[#88DECC] transition-colors"
          >
            <ArrowLeft size={14} /> Back to Diseases Catalog
          </Link>
        </div>

        {loading && (
          <div className="p-8 rounded-2xl bg-[rgba(3,8,11,0.55)] border border-white/10 space-y-6 animate-pulse">
            <div className="h-6 bg-white/10 rounded-xs w-1/4" />
            <div className="h-10 bg-white/10 rounded-xs w-3/4" />
            <div className="h-20 bg-white/5 rounded-xs w-full" />
            <div className="grid grid-cols-2 gap-4">
              <div className="h-32 bg-white/5 rounded-xs" />
              <div className="h-32 bg-white/5 rounded-xs" />
            </div>
          </div>
        )}

        {error && (
          <div className="p-8 rounded-2xl bg-[rgba(3,8,11,0.55)] border border-red-500/30 text-center space-y-4">
            <AlertCircle size={36} className="text-red-400 mx-auto" />
            <h2 className="text-xl font-light text-white">Condition Details Not Found</h2>
            <p className="text-sm text-white/50">
              We couldn&apos;t load information for identifier &ldquo;{classId}&rdquo;.
            </p>
            <Link
              to="/diseases"
              className="inline-flex items-center gap-2 text-sm text-[#88DECC] underline"
            >
              Browse all available crop diseases
            </Link>
          </div>
        )}

        {disease && (
          <div className="space-y-8">
            {/* Main Header Card */}
            <div className="p-6 sm:p-8 rounded-2xl bg-[rgba(3,8,11,0.55)] border border-[rgba(136,222,204,0.18)] space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs font-mono uppercase tracking-widest text-[#88DECC] font-semibold px-2.5 py-1 bg-[#88DECC]/10 rounded-full border border-[#88DECC]/20">
                  {disease.crop}
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${
                    disease.is_healthy
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-red-500/20 text-red-300 border border-red-500/30'
                  }`}
                >
                  {disease.is_healthy ? (
                    <CheckCircle size={12} aria-hidden="true" />
                  ) : (
                    <AlertCircle size={12} aria-hidden="true" />
                  )}
                  {disease.is_healthy ? 'Normal Foliage' : 'Pathogen Detected'}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-light text-white tracking-tight">
                {disease.label}
              </h1>

              <p className="text-base text-white/75 leading-relaxed pt-1">
                {disease.summary}
              </p>
            </div>

            {/* General symptoms (if diseased) [SPEC: labeled 'General symptoms of this condition'] */}
            {disease.symptoms && disease.symptoms.length > 0 && (
              <div className="p-6 sm:p-7 rounded-2xl bg-[rgba(3,8,11,0.55)] border border-white/10 space-y-4">
                <h3 className="text-base font-medium text-white flex items-center gap-2">
                  <Activity size={18} className="text-[#88DECC]" />
                  General symptoms of this condition
                </h3>
                <ul className="space-y-2.5">
                  {disease.symptoms.map((symptom, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-white/70 leading-relaxed">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#88DECC] shrink-0" aria-hidden="true" />
                      <span>{symptom}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Causes & Environmental Factors */}
            {disease.causes && disease.causes.length > 0 && (
              <div className="p-6 sm:p-7 rounded-2xl bg-[rgba(3,8,11,0.55)] border border-white/10 space-y-4">
                <h3 className="text-base font-medium text-white flex items-center gap-2">
                  <CloudRain size={18} className="text-[#88DECC]" />
                  Causes & Environmental Drivers
                </h3>
                <ul className="space-y-2.5">
                  {disease.causes.map((cause, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-white/70 leading-relaxed">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#88DECC]/60 shrink-0" aria-hidden="true" />
                      <span>{cause}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Management & Treatment */}
            {disease.management && disease.management.length > 0 && (
              <div className="p-6 sm:p-7 rounded-2xl bg-[rgba(3,8,11,0.55)] border border-white/10 space-y-4">
                <h3 className="text-base font-medium text-white flex items-center gap-2">
                  <Wrench size={18} className="text-[#88DECC]" />
                  {disease.is_healthy ? 'Care & Maintenance Recommendations' : 'Field Management & Treatments'}
                </h3>
                <ul className="space-y-2.5">
                  {disease.management.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-white/70 leading-relaxed">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#88DECC] shrink-0" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Prevention Best Practices */}
            {disease.prevention && disease.prevention.length > 0 && (
              <div className="p-6 sm:p-7 rounded-2xl bg-[rgba(3,8,11,0.55)] border border-white/10 space-y-4">
                <h3 className="text-base font-medium text-white flex items-center gap-2">
                  <ShieldCheck size={18} className="text-[#88DECC]" />
                  Preventive Agronomic Practices
                </h3>
                <ul className="space-y-2.5">
                  {disease.prevention.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-white/70 leading-relaxed">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#88DECC]/60 shrink-0" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Agronomic Notes */}
            {disease.notes && (
              <div className="p-5 rounded-2xl border border-amber-500/20 bg-amber-500/5 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-300">
                  <Info size={14} /> Extension Note
                </div>
                <p className="text-xs text-amber-200/80 leading-relaxed italic">
                  {disease.notes}
                </p>
              </div>
            )}

            {/* Action Banner to Diagnose */}
            <div className="p-6 sm:p-8 rounded-2xl border border-[#88DECC]/30 bg-[#88DECC]/5 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-1 text-center sm:text-left">
                <h4 className="text-lg font-medium text-white">Suspecting this condition on your crop?</h4>
                <p className="text-xs text-white/60">
                  Upload a photo of a suspicious leaf to verify symptoms with AI classification.
                </p>
              </div>
              <Link
                to="/analyze"
                className="py-2.5 px-5 rounded-full bg-[#EEF1EA] text-[#122B2A] text-xs font-semibold whitespace-nowrap shrink-0 hover:bg-[#88DECC] transition-colors inline-flex items-center gap-2"
              >
                <Camera size={15} />
                Analyze a {disease.crop} Leaf
              </Link>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
