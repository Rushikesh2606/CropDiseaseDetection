/**
 * SafetySection (#safety) — Stage C Section 06.
 * Responsible AI and agricultural decision-making disclaimer.
 */
import { Section } from '../common/Section';
import { AlertCircle, Shield } from 'lucide-react';

export function SafetySection() {
  return (
    <Section
      id="safety"
      eyebrow="05 · RESPONSIBLE USE"
      title="Guidance & Advisory Notice"
      intro="PlantGuard AI is an automated decision-support tool designed for preliminary observational screening."
      surface="glass"
    >
      <div className="p-8 rounded-2xl bg-[rgba(3,8,11,0.6)] border border-amber-500/20 space-y-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 flex-shrink-0">
            <AlertCircle size={24} />
          </div>
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-[#F5FAF6]">
              Not a Substitute for Agronomic Consultation
            </h3>
            <p className="text-sm text-[#ECF1EF]/80 leading-relaxed">
              PlantGuard AI provides probabilistic computer-vision leaf evaluations as an informational reference only. Predictions are machine estimates and must not replace professional agronomic testing, soil analysis, or advice from local agricultural extension agents.
            </p>
            <p className="text-sm text-[#ECF1EF]/80 leading-relaxed">
              Never apply chemical treatments, fungicides, or crop protection products based solely on automated image classification. Verify all suspected conditions with certified crop specialists before making field management decisions.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-white/10 flex items-center gap-3 text-xs text-white/50">
          <Shield size={16} className="text-[#88DECC]" />
          <span>Single-leaf analysis only · In-memory processing · No permanent image storage</span>
        </div>
      </div>
    </Section>
  );
}
