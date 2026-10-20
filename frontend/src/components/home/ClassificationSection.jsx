/**
 * ClassificationSection (#classification) — Stage C/D Section 02.
 * "How your result is decided" with 7 educational blocks.
 * Uses ONLY placeholder text and runtime API values (no invented numbers/terms).
 */
import { useState } from 'react';
import { Section } from '../common/Section';
import { ChevronDown, CheckCircle2, AlertTriangle, HelpCircle, BookOpen, Camera, ShieldAlert } from 'lucide-react';

export function ClassificationSection({ health }) {
  const [openGlossary, setOpenGlossary] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);

  const numClassesStr = health?.num_classes ?? '15';
  const thresholdStr = health?.confidence_threshold
    ? `${Math.round(health.confidence_threshold * 100)}%`
    : 'the configured threshold';
  const isCalibrated = health?.calibrated === true;
  const temperatureStr = health?.temperature ? health.temperature.toFixed(2) : '1.00';

  const glossaryItems = [
    {
      term: 'Class',
      def: `One of the ${numClassesStr} predefined leaf conditions or healthy states recognised by the classifier.`,
    },
    {
      term: 'Confidence',
      def: "The model's estimated probability for that class. It is an estimate, not a guarantee.",
    },
    {
      term: 'Threshold',
      def: `The minimum confidence needed before a result is shown as a match. Currently ${thresholdStr}.`,
    },
    {
      term: 'Calibration (temperature scaling)',
      def: 'A mathematical adjustment applied to output probabilities so confidence scores align more realistically with observed correctness.',
    },
    {
      term: 'Top-3 predictions',
      def: 'The three highest-scoring classes. When the model is unsure, these are possible matches, not a diagnosis.',
    },
    {
      term: 'ResNet-50',
      def: 'A widely used deep-learning architecture for image classification.',
    },
  ];

  const faqItems = [
    {
      q: 'Is my photo stored?',
      a: 'Photos are processed in memory for the prediction and are not stored permanently.',
    },
    {
      q: 'Why did I get an uncertainty warning?',
      a: "The top probability was below the confidence threshold. See 'Why a result may be uncertain' above.",
    },
    {
      q: 'Does 90% confidence mean it is right 90% of the time?',
      a: 'Not necessarily. Confidence is the model\'s own estimate. Treat it as a guide, not a guarantee.',
    },
    {
      q: 'Can it identify diseases that are not listed?',
      a: `No. It only knows its ${numClassesStr} classes and may mislabel anything else, including other crops or non-leaf photos.`,
    },
    {
      q: 'Should I treat my crop based on this result?',
      a: 'Use it as a first indication only. Confirm with a local agricultural expert before making treatment decisions.',
    },
  ];

  return (
    <Section
      id="classification"
      eyebrow="02 · CLASSIFICATION"
      title="How your result is decided"
      intro="A plain-language guide to what each part of a result means."
      surface="plain"
    >
      <div className="space-y-16">
        {/* Block 1: Anatomy of a result */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-light text-[#F5FAF6] flex items-center gap-2">
              <BookOpen size={20} className="text-[#88DECC]" />
              Anatomy of a Result Card
            </h3>
            <span className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#88DECC] font-mono">
              Illustrative layout, not a real prediction.
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Visual Placeholder Card */}
            <div className="lg:col-span-5 p-6 rounded-2xl bg-[rgba(3,8,11,0.7)] border border-[rgba(136,222,204,0.25)] space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-xs font-mono text-[#88DECC]">Result Card</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#88DECC]/10 text-[#88DECC] font-medium border border-[#88DECC]/20">
                  Healthy / Diseased badge
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-white/50">Top Match</p>
                <p className="text-xl font-medium text-[#F5FAF6]">Condition name</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-white/60">Estimated Confidence</span>
                  <span className="font-mono text-[#88DECC] font-semibold">00%</span>
                </div>
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-[#88DECC] w-3/4 rounded-full" />
                </div>
                <p className="text-[11px] text-white/45">
                  Threshold marker ({thresholdStr})
                </p>
              </div>
              <div className="pt-2 border-t border-white/10 space-y-2">
                <p className="text-xs font-medium text-white/70">Top 3 Candidates</p>
                <div className="space-y-1 text-xs font-mono text-white/50">
                  <div className="flex justify-between py-1 px-2 rounded bg-white/5">
                    <span>1. Possible match 1</span>
                    <span>00%</span>
                  </div>
                  <div className="flex justify-between py-1 px-2 rounded bg-white/5">
                    <span>2. Possible match 2</span>
                    <span>00%</span>
                  </div>
                  <div className="flex justify-between py-1 px-2 rounded bg-white/5">
                    <span>3. Possible match 3</span>
                    <span>00%</span>
                  </div>
                </div>
              </div>
              <div className="pt-2 border-t border-white/10 text-xs text-[#88DECC]/80">
                Condition guide: agronomic reference & symptoms
              </div>
            </div>

            {/* Explanatory Callouts */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
                <p className="font-semibold text-[#F5FAF6]">Condition name</p>
                <p className="text-[#ECF1EF]/70 text-xs">The class the model scored highest.</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
                <p className="font-semibold text-[#F5FAF6]">Healthy / diseased badge</p>
                <p className="text-[#ECF1EF]/70 text-xs">Whether that class is a healthy leaf or a named condition.</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
                <p className="font-semibold text-[#F5FAF6]">Confidence</p>
                <p className="text-[#ECF1EF]/70 text-xs">The model&apos;s estimated probability for that class. It is an estimate, not a guarantee.</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
                <p className="font-semibold text-[#F5FAF6]">Threshold marker</p>
                <p className="text-[#ECF1EF]/70 text-xs">The minimum confidence needed before a result is shown as a match. Currently {thresholdStr}.</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
                <p className="font-semibold text-[#F5FAF6]">Top 3</p>
                <p className="text-[#ECF1EF]/70 text-xs">The three highest-scoring classes. When the model is unsure, these are possible matches, not a diagnosis.</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
                <p className="font-semibold text-[#F5FAF6]">Condition guide</p>
                <p className="text-[#ECF1EF]/70 text-xs">General reference information about the matched condition.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Block 2: Confident vs uncertain */}
        <div className="space-y-6">
          <h3 className="text-xl font-light text-[#F5FAF6]">Confident vs Uncertain Diagnoses</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-[rgba(3,8,11,0.55)] border border-emerald-500/20 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-medium">
                <CheckCircle2 size={18} />
                Confident match
              </div>
              <p className="text-sm text-[#ECF1EF]/75 leading-relaxed">
                Top probability is at or above the threshold. The result is shown with its condition guide.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-[rgba(3,8,11,0.55)] border border-amber-500/20 space-y-3">
              <div className="flex items-center gap-2 text-amber-400 font-medium">
                <AlertTriangle size={18} />
                Uncertain
              </div>
              <p className="text-sm text-[#ECF1EF]/75 leading-relaxed">
                Top probability is below the threshold. You see a warning, the top 3 as possible matches, and tips for a better photo. The condition guide is shown only as &apos;if the top match is correct&apos;.
              </p>
            </div>
          </div>
        </div>

        {/* Block 3: About calibration */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3">
          <h4 className="text-base font-semibold text-[#F5FAF6] flex items-center gap-2">
            <ShieldAlert size={18} className="text-[#88DECC]" />
            About Probability Calibration
          </h4>
          <p className="text-sm text-[#ECF1EF]/80 leading-relaxed">
            {isCalibrated
              ? `Probabilities are adjusted with temperature scaling (T = ${temperatureStr}) so that confidence values are more realistic.`
              : 'Calibration data was not found, so probabilities are uncalibrated and may be over- or under-confident.'}
          </p>
          <p className="text-xs text-amber-300/80 font-mono">
            Even a high confidence can be wrong.
          </p>
        </div>

        {/* Block 4 & 5: Why uncertain & Photography tips */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-6 rounded-2xl bg-[rgba(3,8,11,0.55)] border border-white/10 space-y-4">
            <h4 className="text-base font-semibold text-[#F5FAF6] flex items-center gap-2">
              <HelpCircle size={18} className="text-amber-400" />
              Why a result may be uncertain
            </h4>
            <p className="text-sm text-[#ECF1EF]/75 leading-relaxed">
              Blurry or dark photos, several leaves in one frame, a busy background, a heavily cropped leaf, or a crop or condition the model was not built to recognise can all lower confidence.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[rgba(3,8,11,0.55)] border border-white/10 space-y-4">
            <h4 className="text-base font-semibold text-[#F5FAF6] flex items-center gap-2">
              <Camera size={18} className="text-[#88DECC]" />
              Tips for a good photo
            </h4>
            <ul className="text-sm text-[#ECF1EF]/75 space-y-2 list-disc list-inside">
              <li>Single leaf</li>
              <li>Natural daylight</li>
              <li>Plain background</li>
              <li>In focus</li>
              <li>Leaf centred and filling most of the frame</li>
              <li>One photo per leaf</li>
            </ul>
          </div>
        </div>

        {/* Block 6: Glossary (accordion) */}
        <div className="space-y-4">
          <h4 className="text-lg font-light text-[#F5FAF6]">Glossary</h4>
          <div className="divide-y divide-white/5 border border-white/10 rounded-2xl overflow-hidden bg-[rgba(3,8,11,0.45)]">
            {glossaryItems.map((item, idx) => {
              const isOpen = openGlossary === idx;
              return (
                <div key={item.term} className="transition-colors">
                  <button
                    type="button"
                    className="w-full py-4 px-6 flex items-center justify-between text-left text-sm font-medium text-[#F5FAF6] hover:bg-white/5"
                    onClick={() => setOpenGlossary(isOpen ? null : idx)}
                    aria-expanded={isOpen}
                  >
                    <span>{item.term}</span>
                    <ChevronDown
                      size={16}
                      className={`text-[#88DECC] transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-4 text-xs text-[#ECF1EF]/75 leading-relaxed">
                      {item.def}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Block 7: FAQ (accordion) */}
        <div className="space-y-4">
          <h4 className="text-lg font-light text-[#F5FAF6]">Frequently Asked Questions</h4>
          <div className="divide-y divide-white/5 border border-white/10 rounded-2xl overflow-hidden bg-[rgba(3,8,11,0.45)]">
            {faqItems.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={item.q} className="transition-colors">
                  <button
                    type="button"
                    className="w-full py-4 px-6 flex items-center justify-between text-left text-sm font-medium text-[#F5FAF6] hover:bg-white/5"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    aria-expanded={isOpen}
                  >
                    <span>{item.q}</span>
                    <ChevronDown
                      size={16}
                      className={`text-[#88DECC] transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-4 text-xs text-[#ECF1EF]/75 leading-relaxed">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Section>
  );
}
