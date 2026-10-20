/**
 * HowItWorksSection (#how-it-works) — Stage C Section 01.
 * 4-step workflow overview with spec-exact copy.
 */
import { Section } from '../common/Section';
import { Upload, Sliders, Cpu, CheckCircle } from 'lucide-react';

export function HowItWorksSection({ numClasses }) {
  const classCountStr = numClasses ?? '15';

  const steps = [
    {
      num: '01',
      icon: <Upload size={22} className="text-[#88DECC]" aria-hidden="true" />,
      title: 'Upload a leaf photo',
      desc: 'Choose a clear photo of a single leaf (JPG, PNG or WEBP). Your image is processed in memory and is not stored.',
    },
    {
      num: '02',
      icon: <Sliders size={22} className="text-[#88DECC]" aria-hidden="true" />,
      title: 'The image is prepared',
      desc: 'The photo is converted to RGB colour, resized, centre-cropped to 224 × 224 pixels and colour-normalised, the same way as when the model was trained. Because of the centre crop, keep the leaf in the middle of the frame.',
    },
    {
      num: '03',
      icon: <Cpu size={22} className="text-[#88DECC]" aria-hidden="true" />,
      title: 'The model scores each condition',
      desc: `A ResNet-50 image classifier gives every one of its ${classCountStr} classes a score. The scores are turned into probabilities that add up to 100%.`,
    },
    {
      num: '04',
      icon: <CheckCircle size={22} className="text-[#88DECC]" aria-hidden="true" />,
      title: 'The result is checked',
      desc: 'If the top probability reaches the confidence threshold, the result is shown as a match. If not, you get an uncertainty warning and a list of possible matches instead.',
    },
  ];

  return (
    <Section
      id="how-it-works"
      eyebrow="01 · HOW IT WORKS"
      title="From a photo to a result in four steps"
      intro={`PlantGuard AI compares your leaf photo with the ${classCountStr} conditions its model was built to recognise, then reports the closest matches and how sure it is.`}
      surface="glass"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((s) => (
          <div
            key={s.num}
            className="p-6 rounded-2xl bg-[rgba(3,8,11,0.55)] border border-[rgba(136,222,204,0.18)] flex flex-col justify-between space-y-4"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                  {s.icon}
                </div>
                <span className="text-xs font-mono text-[#88DECC]/60 font-semibold tracking-wider">
                  STEP {s.num}
                </span>
              </div>
              <h3 className="text-base font-medium text-[#F5FAF6]">
                {s.title}
              </h3>
              <p className="text-sm text-[#ECF1EF]/70 leading-relaxed">
                {s.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
