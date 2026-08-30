import React, { useState, useEffect } from 'react';
import { Sprout, CheckCircle2, Server, Cpu, Database, CloudSun, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { AgriLogo } from './ui/AgriLogo';

interface AppLoadingScreenProps {
  onLoadingComplete: () => void;
  durationMs?: number;
}

interface BootStep {
  id: number;
  timePct: number;
  dir: string;
  label: string;
  sublabel: string;
  icon: React.ElementType;
}

const BOOT_STEPS: BootStep[] = [
  {
    id: 1,
    timePct: 15,
    dir: '/sys/kernel/agriveda-core',
    label: 'Initializing Core Vedic Agronomy Engine',
    sublabel: 'Loading ancient crop rotation & bio-organic soil wisdom',
    icon: Sprout
  },
  {
    id: 2,
    timePct: 35,
    dir: '/db/gis/cadastral-maps',
    label: 'Mounting Farmland GIS & Spatial Polygons',
    sublabel: 'Connecting to ICAR soil zone grids & satellite layers',
    icon: Database
  },
  {
    id: 3,
    timePct: 58,
    dir: '/net/apmc/mapcn-feed',
    label: 'Establishing Realtime Market Mandi Network',
    sublabel: 'Syncing live auction rates, arrivals & e-NAM nodes',
    icon: Server
  },
  {
    id: 4,
    timePct: 78,
    dir: '/ai/meteo/hyperlocal-weather',
    label: 'Calibrating 7-Day Microclimate AI Telemetry',
    sublabel: 'Processing Doppler precipitation & soil moisture vectors',
    icon: CloudSun
  },
  {
    id: 5,
    timePct: 92,
    dir: '/ai/vision/pathology-v2',
    label: 'Warming Multimodal Crop Pathology AI',
    sublabel: 'Readying computer-vision leaf & stem disease diagnostics',
    icon: Cpu
  },
  {
    id: 6,
    timePct: 100,
    dir: '/app/boot/ready',
    label: 'AgriVeda Workspace Ready',
    sublabel: 'Launching personalized agricultural dashboard...',
    icon: CheckCircle2
  }
];

export const AppLoadingScreen: React.FC<AppLoadingScreenProps> = ({
  onLoadingComplete,
  durationMs = 3500
}) => {
  const [progress, setProgress] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  useEffect(() => {
    const intervalTime = 40; // update every 40ms
    const totalTicks = durationMs / intervalTime;
    let currentTick = 0;

    const timer = setInterval(() => {
      currentTick++;
      const currentPct = Math.min(100, Math.round((currentTick / totalTicks) * 100));
      setProgress(currentPct);

      // Check boot steps
      BOOT_STEPS.forEach((step, idx) => {
        if (currentPct >= step.timePct) {
          setCurrentStepIndex(idx);
          setCompletedSteps(prev => (prev.includes(step.id) ? prev : [...prev, step.id]));
        }
      });

      if (currentTick >= totalTicks) {
        clearInterval(timer);
        setTimeout(() => {
          onLoadingComplete();
        }, 300);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [durationMs, onLoadingComplete]);

  const activeStep = BOOT_STEPS[currentStepIndex] || BOOT_STEPS[0];
  const StepIcon = activeStep.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950 overflow-hidden select-none font-sans">
      {/* Background Cinematic Image with Blur & Dark Gradient */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-40 scale-105 transition-transform duration-1000 ease-out"
        style={{ backgroundImage: `url('/images/agriveda_loading_bg.jpg')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/85 to-slate-950/70 backdrop-blur-xs" />

      {/* Decorative Neon Glow Orbs */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDelay: '1s' }} />

      {/* Main Terminal Loader Card */}
      <div className="relative z-10 w-full max-w-lg mx-4 bg-slate-900/90 backdrop-blur-xl rounded-3xl border border-emerald-500/20 shadow-2xl p-6 sm:p-8 text-white flex flex-col justify-between overflow-hidden">
        
        {/* Subtle Top Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400" />

        {/* Brand Header & Animated Emblem */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            <div className="relative">
              <AgriLogo size={46} />
              <div className="absolute inset-0 rounded-full border border-emerald-400/40 animate-ping opacity-30" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-black text-emerald-400 tracking-tight" style={{ fontFamily: "'Caveat', cursive, serif" }}>AgriVeda</span>
                <span className="text-2xl font-black text-amber-400 tracking-tight" style={{ fontFamily: "'Caveat', cursive, serif" }}>-AI</span>
              </div>
              <p className="text-[11px] font-semibold text-slate-400 tracking-wide uppercase">
                Autonomous Smart Farming Operating System
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-black text-emerald-300 uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              v2.4 Live
            </span>
          </div>
        </div>

        {/* Directory Bootstrap Terminal View */}
        <div className="my-6 space-y-3">
          <div className="bg-slate-950/80 rounded-2xl p-4 border border-slate-800/80 font-mono text-xs space-y-2">
            <div className="flex items-center justify-between text-[11px] text-slate-500 pb-1 border-b border-slate-800/50">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-2 h-2 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-2 h-2 rounded-full bg-emerald-500/80 inline-block" />
                <span className="ml-1 text-slate-400 font-bold">BOOTLOADER / DIRECTORY SYNC</span>
              </span>
              <span className="text-emerald-400 font-bold">{progress}%</span>
            </div>

            {/* Terminal Steps History */}
            <div className="space-y-1.5 max-h-36 overflow-hidden pt-1">
              {BOOT_STEPS.map((step, idx) => {
                const isPassed = progress >= step.timePct;
                const isCurrent = currentStepIndex === idx;
                if (!isPassed && !isCurrent) return null;

                return (
                  <div
                    key={step.id}
                    className={`flex items-start gap-2 text-[11px] transition-all ${
                      isCurrent
                        ? 'text-emerald-300 font-bold'
                        : 'text-slate-500'
                    }`}
                  >
                    <span className="text-slate-600 select-none">[{idx + 1}/6]</span>
                    <span className="text-amber-400/90">{step.dir}</span>
                    <span className="text-slate-300 truncate">
                      {isCurrent ? '...loading' : '✓ OK'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Step Highlight Card */}
          <div className="p-3.5 bg-gradient-to-r from-emerald-950/60 to-slate-900/60 rounded-2xl border border-emerald-500/30 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-400/30">
              <StepIcon className="w-5 h-5 animate-pulse" />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-black text-white truncate">
                {activeStep.label}
              </h4>
              <p className="text-[11px] text-slate-400 font-medium truncate">
                {activeStep.sublabel}
              </p>
            </div>
          </div>
        </div>

        {/* Progress Bar & Skip Control */}
        <div className="space-y-3 pt-2 border-t border-slate-800">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-bold">
              <span className="text-slate-400">System Initialization</span>
              <span className="text-emerald-400 font-mono font-black">{progress}%</span>
            </div>

            {/* Glowing Custom Progress Bar */}
            <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800 relative">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 rounded-full transition-all duration-75 relative"
                style={{ width: `${progress}%` }}
              >
                {/* Glowing Lead Bead */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-[0_0_12px_#34d399]" />
              </div>
            </div>
          </div>

          {/* Bottom Footnote & Skip Button */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              Secure Offline-Ready Telemetry
            </span>

            <button
              onClick={onLoadingComplete}
              className="text-[11px] font-bold text-slate-400 hover:text-white flex items-center gap-1 transition-colors px-2.5 py-1 rounded-lg hover:bg-white/5 active:scale-95"
            >
              <span>Skip</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
