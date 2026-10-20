/**
 * DiseasesPage — Pathology Catalog.
 * Styled with Tailwind v4 design tokens and accessible filters.
 */
import { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { useDiseases } from '../hooks/useDiseases';
import { Search, CheckCircle, AlertCircle, ArrowRight, BookOpen } from 'lucide-react';

const CROPS = ['All', 'Apple', 'Corn', 'Grape', 'Potato'];

export function DiseasesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const cropParam = searchParams.get('crop') || 'All';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCrop, setSelectedCrop] = useState(cropParam);
  const [selectedStatus, setSelectedStatus] = useState('All'); // 'All' | 'healthy' | 'diseased'

  const { diseases, loading, error } = useDiseases();

  const handleCropChange = (crop) => {
    setSelectedCrop(crop);
    if (crop === 'All') {
      searchParams.delete('crop');
    } else {
      searchParams.set('crop', crop);
    }
    setSearchParams(searchParams);
  };

  const filteredDiseases = useMemo(() => {
    if (!diseases) return [];
    return diseases.filter((d) => {
      // Crop match
      if (selectedCrop !== 'All' && !d.crop.toLowerCase().includes(selectedCrop.toLowerCase())) {
        return false;
      }
      // Status match
      if (selectedStatus === 'healthy' && !d.is_healthy) return false;
      if (selectedStatus === 'diseased' && d.is_healthy) return false;

      // Text search match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesLabel = d.label?.toLowerCase().includes(q);
        const matchesCrop = d.crop?.toLowerCase().includes(q);
        const matchesCondition = d.condition?.toLowerCase().includes(q);
        const matchesSummary = d.summary?.toLowerCase().includes(q);
        return matchesLabel || matchesCrop || matchesCondition || matchesSummary;
      }
      return true;
    });
  }, [diseases, selectedCrop, selectedStatus, searchQuery]);

  return (
    <div className="min-h-screen flex flex-col bg-[#03080B] text-[#F5FAF6]">
      {/* Background atmosphere */}
      <div className="inner-bg" aria-hidden="true" />

      {/* Shared header */}
      <Header />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-10 page-fade-in" id="main-content">
        {/* Page Title */}
        <div className="mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#88DECC]/10 border border-[#88DECC]/20 text-[#88DECC] text-xs font-medium mb-3">
            <BookOpen size={13} aria-hidden="true" />
            <span>Pathology Knowledge Base</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-light tracking-tight text-white mb-2">
            Crop Disease Catalog
          </h1>
          <p className="text-white/60 text-base max-w-2xl">
            Explore pathology profiles for 15 crop conditions across Apple, Corn, Grape, and Potato.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="p-4 sm:p-6 mb-8 rounded-2xl bg-[rgba(3,8,11,0.55)] border border-[rgba(136,222,204,0.18)] space-y-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40"
                aria-hidden="true"
              />
              <input
                type="text"
                placeholder="Search by disease name, symptom, or crop..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-white/40 focus:outline-hidden focus:border-[#88DECC] transition-colors"
                aria-label="Search diseases"
              />
            </div>

            {/* Health Status Filter */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/5 border border-white/5 shrink-0 self-start md:self-auto">
              {[
                { label: 'All Conditions', value: 'All' },
                { label: 'Diseased', value: 'diseased' },
                { label: 'Healthy', value: 'healthy' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSelectedStatus(opt.value)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    selectedStatus === opt.value
                      ? 'bg-[#88DECC] text-[#03080B] font-semibold'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                  type="button"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Crop Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs text-white/40 font-mono mr-1">Crop:</span>
            {CROPS.map((crop) => (
              <button
                key={crop}
                onClick={() => handleCropChange(crop)}
                className={`text-xs px-3.5 py-1.5 rounded-full border transition-all ${
                  selectedCrop === crop
                    ? 'bg-[#88DECC]/15 border-[#88DECC] text-[#88DECC] font-semibold'
                    : 'border-white/10 text-white/60 hover:border-white/20 hover:text-white'
                }`}
                type="button"
              >
                {crop}
              </button>
            ))}
          </div>
        </div>

        {/* Content State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="p-6 rounded-2xl bg-[rgba(3,8,11,0.55)] border border-white/10 space-y-4">
                <div className="h-4 bg-white/10 rounded-xs w-1/3" />
                <div className="h-6 bg-white/10 rounded-xs w-3/4" />
                <div className="h-16 bg-white/5 rounded-xs w-full" />
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="p-12 rounded-2xl bg-[rgba(3,8,11,0.55)] border border-white/10 text-center space-y-3">
            <p className="text-sm font-medium text-white/70">
              Unavailable: backend offline
            </p>
            <p className="text-xs text-white/40">
              Could not load the diseases catalog from the backend API.
            </p>
          </div>
        )}

        {!loading && !error && filteredDiseases.length === 0 && (
          <div className="p-12 rounded-2xl bg-[rgba(3,8,11,0.55)] border border-white/10 text-center space-y-3">
            <p className="text-base text-white/70">No matching crop conditions found.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                handleCropChange('All');
                setSelectedStatus('All');
              }}
              className="text-xs text-[#88DECC] hover:underline"
              type="button"
            >
              Reset all filters
            </button>
          </div>
        )}

        {!loading && !error && filteredDiseases.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDiseases.map((d) => (
              <Link
                key={d.id}
                to={`/diseases/${encodeURIComponent(d.id)}`}
                className="p-6 rounded-2xl bg-[rgba(3,8,11,0.55)] border border-[rgba(136,222,204,0.18)] hover:border-[#88DECC] transition-colors group flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-[#88DECC] font-semibold">
                      {d.crop}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5 rounded-full ${
                        d.is_healthy
                          ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/20'
                          : 'bg-amber-500/15 text-amber-300 border border-amber-500/20'
                      }`}
                    >
                      {d.is_healthy ? (
                        <CheckCircle size={10} aria-hidden="true" />
                      ) : (
                        <AlertCircle size={10} aria-hidden="true" />
                      )}
                      {d.is_healthy ? 'Healthy' : 'Diseased'}
                    </span>
                  </div>

                  <h3 className="text-base font-medium text-white group-hover:text-[#88DECC] transition-colors">
                    {d.label}
                  </h3>

                  <p className="text-xs text-white/60 line-clamp-2 leading-relaxed">
                    {d.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-[#88DECC]">
                  <span>View symptoms & guide</span>
                  <ArrowRight
                    size={14}
                    className="group-hover:translate-x-1 transition-transform"
                    aria-hidden="true"
                  />
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
