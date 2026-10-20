/**
 * HomePage — Assembles Stage C segregated page:
 * 1. #hero — 100dvh stage only
 * 2. #how-it-works — 4-step overview
 * 3. #classification — "How your result is decided" (7 blocks)
 * 4. #detects — Grid of 15 classes from GET /api/classes
 * 5. #model-facts — Runtime facts from GET /api/health
 * 6. #safety — Responsible use disclaimer
 * 7. Footer
 */
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Hero } from '../components/hero/Hero';
import { HowItWorksSection } from '../components/home/HowItWorksSection';
import { ClassificationSection } from '../components/home/ClassificationSection';
import { DetectsSection } from '../components/home/DetectsSection';
import { ModelFactsSection } from '../components/home/ModelFactsSection';
import { SafetySection } from '../components/home/SafetySection';
import { Footer } from '../components/layout/Footer';
import { useApiHealth } from '../hooks/useApiHealth';

export function HomePage() {
  const { hash } = useLocation();
  const { health, status } = useApiHealth();

  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [hash]);

  return (
    <div className="min-h-screen flex flex-col bg-[#03080B] text-[#F5FAF6] overflow-x-hidden">
      {/* 1. #hero — Full 100dvh Stage */}
      <section id="hero" aria-label="Hero">
        <Hero />
      </section>

      {/* 2. #how-it-works — 4-step overview */}
      <HowItWorksSection numClasses={health?.num_classes} />

      {/* 3. #classification — Result explanation guide */}
      <ClassificationSection health={health} />

      {/* 4. #detects — Supported crop diseases grid */}
      <DetectsSection />

      {/* 5. #model-facts — Technical metrics from API */}
      <ModelFactsSection health={health} status={status} />

      {/* 6. #safety — Responsible use notice */}
      <SafetySection />

      {/* 7. Footer */}
      <Footer />
    </div>
  );
}
