import React, { useState } from 'react';
import { Sprout, Camera, TrendingUp, ArrowRight, CheckCircle2 } from 'lucide-react';

interface OnboardingViewProps {
  onComplete: () => void;
  onSkip: () => void;
}

export const OnboardingView: React.FC<OnboardingViewProps> = ({ onComplete, onSkip }) => {
  const [currentStep, setCurrentStep] = useState<number>(0);

  const slides = [
    {
      icon: <Sprout className="w-16 h-16 text-blue-600" />,
      badge: "Step 1 of 3",
      title: "Understand Your Crops",
      description: "AI-powered insights to help farmers monitor crop health and make better farming decisions.",
      bullets: ["Real-time crop growth tracking", "Soil status & moisture guidance", "Personalized irrigation alerts"]
    },
    {
      icon: <Camera className="w-16 h-16 text-emerald-600" />,
      badge: "Step 2 of 3",
      title: "Detect Problems Early",
      description: "Upload a crop image and use AI-powered disease detection to identify potential crop problems.",
      bullets: ["Instant leaf disease diagnosis", "94% AI pathology accuracy", "Organic & chemical action plans"]
    },
    {
      icon: <TrendingUp className="w-16 h-16 text-amber-600" />,
      badge: "Step 3 of 3",
      title: "Farm Smarter. Earn Better.",
      description: "Get weather alerts, crop guidance, market information, and personalized recommendations in one place.",
      bullets: ["Live mandi price updates", "Accurate weather spray risk", "Voice AI assistant in regional languages"]
    }
  ];

  const handleNext = () => {
    if (currentStep < slides.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const activeSlide = slides[currentStep];

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-between p-6 bg-white rounded-3xl border border-slate-200 shadow-sm max-w-xl mx-auto">
      {/* Header Skip button */}
      <div className="w-full flex items-center justify-between">
        <span className="text-xs font-bold px-3 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-100">
          {activeSlide.badge}
        </span>
        <button
          onClick={onSkip}
          className="text-xs font-bold text-slate-400 hover:text-slate-600 px-3 py-1 rounded-lg hover:bg-slate-100 transition-colors"
        >
          Skip
        </button>
      </div>

      {/* Main Slide Content */}
      <div className="w-full space-y-6 my-auto text-center py-6">
        <div className="mx-auto w-24 h-24 bg-blue-50 rounded-3xl flex items-center justify-center border border-blue-100 shadow-inner">
          {activeSlide.icon}
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {activeSlide.title}
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed font-medium max-w-md mx-auto">
            {activeSlide.description}
          </p>
        </div>

        {/* Bullet Key Points */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-left space-y-2 max-w-md mx-auto">
          {activeSlide.bullets.map((bullet, idx) => (
            <div key={idx} className="flex items-center gap-2.5 text-xs font-semibold text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{bullet}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Indicator dots & Navigation Buttons */}
      <div className="w-full space-y-6 pt-4 border-t border-slate-100">
        <div className="flex justify-center gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentStep(idx)}
              className={`h-2 rounded-full transition-all ${
                idx === currentStep ? 'w-8 bg-blue-600' : 'w-2 bg-slate-200'
              }`}
            />
          ))}
        </div>

        <div className="flex items-center gap-3">
          {currentStep > 0 && (
            <button
              onClick={() => setCurrentStep(prev => prev - 1)}
              className="py-3.5 px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl transition-colors"
            >
              Back
            </button>
          )}

          <button
            onClick={handleNext}
            className="flex-1 py-3.5 px-6 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>{currentStep === slides.length - 1 ? 'Get Started' : 'Next'}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
