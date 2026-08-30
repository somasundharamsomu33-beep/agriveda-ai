import React, { useState } from 'react';
import {
  UserCheck, Sprout, CloudSun, Calendar, MapPin, Mic, Camera, Users,
  ChevronLeft, ChevronRight, X, ArrowRight, CheckCircle2, ShieldCheck,
  Sparkles, Globe, Compass, Layers, Building2, Landmark, HelpCircle, Eye
} from 'lucide-react';
import { UserProfile, ActiveTab, Language } from '../../types';
import { translations } from '../../data/mockData';
import { AgriLogo } from '../ui/AgriLogo';

interface UserTutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenRoleOnboarding?: () => void;
}

interface TutorialSlide {
  id: number;
  badge: string;
  badgeColor: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ElementType;
  targetTab?: ActiveTab;
  actionLabel?: string;
  highlights: string[];
  image: string;
  tip?: string;
}

export const UserTutorialModal: React.FC<UserTutorialModalProps> = ({
  isOpen,
  onClose,
  profile,
  setProfile,
  setActiveTab,
  onOpenRoleOnboarding
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  if (!isOpen) return null;

  const t = translations[profile.language] || translations.en;

  const slides: TutorialSlide[] = [
    {
      id: 1,
      badge: 'Step 1 • Identity & Profile',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      title: 'Profile Creation & Account Verification',
      subtitle: 'Create a trusted identity and unlock role-based features',
      description: 'Set up your account by selecting your persona (Farmer, B2B Buyer, Student, Research Scholar, Financial Institution, or Government Officer). Add land survey numbers, GPS plot dimensions, and upload identity documents for certified verification.',
      icon: UserCheck,
      actionLabel: 'Complete Registration',
      highlights: [
        '5 dedicated role onboarding pipelines with KYC',
        'Farmland GPS cadastral survey & land photo snaps',
        'DPDP & Aadhaar data compliance protection',
        'Official Verification Badge & credit eligibility'
      ],
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
      tip: 'Tap "Get Role Verified" at the top header anytime to submit verification documents.'
    },
    {
      id: 2,
      badge: 'Step 2 • Ecosystem Overview',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      title: 'Ancient Vedic Wisdom Meets Modern AI',
      subtitle: 'Hybrid intelligence engineered for Indian agriculture',
      description: 'AgriVeda AI harmonizes time-tested Indian agricultural wisdom (Vedic agronomy, Panchagavya formulations, companion cropping) with state-of-the-art multimodal AI, giving every farmer an agronomist right in their pocket.',
      icon: Sprout,
      targetTab: 'home',
      actionLabel: 'Go to Home Dashboard',
      highlights: [
        'Real-time Farm Health Score with predictive analytics',
        'Multilingual interface (English, தமிழ், हिंदी, తెలుగు)',
        'Full offline sync capability with Service Worker caching',
        'Direct connection with APMC Mandi commodity trading'
      ],
      image: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=600&q=80',
      tip: 'Your daily Farm Health Score updates automatically based on weather & crop scans.'
    },
    {
      id: 3,
      badge: 'Step 3 • Live Telemetry',
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      title: '7-Day Realtime Hyperlocal Weather AI',
      subtitle: 'Live microclimate monitoring and predictive farming advisories',
      description: 'Track your local microclimate in real-time. View 7-day precipitation risk, temperature swings, soil moisture levels, and wind velocity with automated AI recommendations for optimal spraying and irrigation timings.',
      icon: CloudSun,
      targetTab: 'weather',
      actionLabel: 'Explore Weather AI',
      highlights: [
        'Live device GPS auto-detection for pinpoint weather',
        '7-day full weekly rainfall & thunderstorm telemetry',
        'Soil moisture and air humidity vector index',
        'Automated crop safety alerts for frost, heavy rain & heatwaves'
      ],
      image: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=600&q=80',
      tip: 'Tap the "Refresh GPS" button on the Weather card to sync with your current field position.'
    },
    {
      id: 4,
      badge: 'Step 4 • Crop Management',
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
      title: 'Smart Crop Calendar & Stage-by-Stage Advisory',
      subtitle: 'Step-by-step guidance tailored to your exact sowing date',
      description: 'Never miss a critical farming task. Our dynamic crop calendar builds an automated schedule from sowing to harvest, providing day-by-day dosage guidelines for fertilization, de-weeding, irrigation cycles, and pest scouting.',
      icon: Calendar,
      targetTab: 'calendar',
      actionLabel: 'View Crop Calendar',
      highlights: [
        'Automated timeline calculated from your crop sowing date',
        'Stage-by-stage notifications (Vegetative, Flowering, Maturity)',
        'Precise NPK fertilizer and bio-manure dosage recommendations',
        'One-tap completion tracker with reminder alerts'
      ],
      image: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=600&q=80',
      tip: 'You can customize your sowing date in Profile to automatically adjust the calendar schedule.'
    },
    {
      id: 5,
      badge: 'Step 5 • Geospatial Intelligence',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      title: 'Interactive Farmland GIS & Ecosystem Network',
      subtitle: 'Visualize your farm plots and discover nearby agricultural nodes',
      description: 'Your farmland is lively rendered with satellite overlays and cadastral plot boundaries. Access nearby Loan Offices, NABARD branches, Agricultural Research Institutes, Soil Testing Labs, and APMC Mandis with live turn-by-turn routing.',
      icon: MapPin,
      targetTab: 'maps',
      actionLabel: 'Open Interactive Maps',
      highlights: [
        'Farmland polygon drawing with live GPS area measurement',
        'Discover Bank Loan Officers & NABARD nodal centers',
        'Locate nearby ICAR Research Stations & Soil Labs',
        'Snapchat-style geotagged land photo verification'
      ],
      image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80',
      tip: 'Tap on any map marker to see officer contact info, operating hours, and road routing.'
    },
    {
      id: 6,
      badge: 'Step 6 • Hands-Free Assistant',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      title: 'Multilingual Voice AI Copilot',
      subtitle: 'Ask any farming doubt in your native mother tongue',
      description: 'Speak hands-free while in the field. Ask questions about pest infestations, fertilizer dosage calculations, mandi rates, or government subsidies, and receive instant spoken answers with structured visual cards.',
      icon: Mic,
      targetTab: 'assistant',
      actionLabel: 'Launch Voice AI',
      highlights: [
        'Natural speech conversation in Tamil, Hindi, Telugu & English',
        'Instant fertilizer dosage & spray recommendation cards',
        'Real-time Mandi commodity price voice lookups',
        'AI agronomy diagnosis for pest and disease queries'
      ],
      image: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=600&q=80',
      tip: 'Tap the microphone icon or the floating "AI Copilot" FAB on any screen to start speaking.'
    },
    {
      id: 7,
      badge: 'Step 7 • Computer Vision AI',
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
      title: 'Instant AI Crop Scan & Disease Diagnosis',
      subtitle: 'Snap a photo of diseased leaves or stems for instant diagnosis',
      description: 'Upload or capture an image of unhealthy crops. Our deep-learning pathology vision model identifies diseases within seconds, explaining the root cause, spore spread risk, organic treatments, and preventive protocols.',
      icon: Camera,
      targetTab: 'scan',
      actionLabel: 'Try Crop Scan AI',
      highlights: [
        'Instant multi-crop pathology detection (Tomato, Paddy, Chilli, Cotton, etc.)',
        'Confidence score & farm health risk level breakdown',
        'Ayurvedic/bio-organic treatments & chemical dosage alternatives',
        'Downloadable diagnostic PDF reports for farm records'
      ],
      image: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb231fc?auto=format&fit=crop&w=600&q=80',
      tip: 'Take photos in good natural lighting focusing closely on the affected leaf surface.'
    },
    {
      id: 8,
      badge: 'Step 8 • Community & Feed',
      badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
      title: 'Agri Community & Expert Q&A (Reddit-style Feed)',
      subtitle: 'Live collaborative network with farmers, scientists & NABARD',
      description: 'Join a vibrant agricultural community. Share field observations, ask queries, view live feedbacks from agro-zone scientists and research scholars, and get verified answers from institute faculty and NABARD officers just like Reddit.',
      icon: Users,
      targetTab: 'community',
      actionLabel: 'Explore Community',
      highlights: [
        'Threaded Reddit-style discussion feeds with photo uploads',
        'Verified expert badges for Agronomists, Scientists & NABARD',
        'Upvote helpful solutions and bookmark regional advisories',
        'Real-time peer-to-peer knowledge exchange across India'
      ],
      image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80',
      tip: 'Filter threads by "Expert Verified" to quickly see certified agricultural solutions.'
    }
  ];

  const currentSlide = slides[currentSlideIndex];
  const SlideIcon = currentSlide.icon;

  const handleNext = () => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex(prev => prev + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(prev => prev - 1);
    }
  };

  const handleAction = () => {
    onClose();
    if (currentSlide.id === 1 && onOpenRoleOnboarding) {
      onOpenRoleOnboarding();
    } else if (currentSlide.targetTab) {
      setActiveTab(currentSlide.targetTab);
    }
  };

  const handleLanguageChange = (lang: Language) => {
    setProfile(prev => ({ ...prev, language: lang }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in select-none">
      <div className="bg-slate-900 rounded-3xl max-w-2xl w-full text-white shadow-2xl border border-slate-800 relative overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Background Ambient Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between gap-3 relative z-10 bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <AgriLogo size={36} />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black text-emerald-400" style={{ fontFamily: "'Caveat', cursive, serif" }}>AgriVeda</span>
                <span className="text-lg font-black text-amber-400" style={{ fontFamily: "'Caveat', cursive, serif" }}>-AI</span>
                <span className="text-xs font-bold text-slate-400">UI Guide</span>
              </div>
              <span className="text-[10px] text-slate-400 font-semibold block">
                Interactive Feature Walkthrough
              </span>
            </div>
          </div>

          {/* Controls: Language Pills + Close Button */}
          <div className="flex items-center gap-2">
            {/* Language Selector */}
            <div className="flex items-center bg-slate-800 rounded-xl p-0.5 border border-slate-700">
              {(['en', 'ta', 'hi', 'te'] as Language[]).map(lang => (
                <button
                  key={lang}
                  onClick={() => handleLanguageChange(lang)}
                  className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase transition-colors ${
                    profile.language === lang
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>

            {/* Close / Skip X */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              title="Close Tutorial"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Slide Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 relative z-10 scrollbar-thin scrollbar-thumb-slate-700">
          
          {/* Slide Top Badge & Step Count */}
          <div className="flex items-center justify-between gap-2">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${currentSlide.badgeColor}`}>
              <SlideIcon className="w-3.5 h-3.5" />
              <span>{currentSlide.badge}</span>
            </span>

            <span className="text-xs font-mono font-bold text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
              {currentSlideIndex + 1} / {slides.length}
            </span>
          </div>

          {/* Slide Banner Image & Title */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-md">
            <img
              src={currentSlide.image}
              alt={currentSlide.title}
              className="w-full h-40 sm:h-48 object-cover opacity-85 hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
            
            <div className="absolute bottom-3 left-4 right-4 text-white space-y-0.5">
              <h2 className="text-lg sm:text-xl font-black leading-tight text-white drop-shadow-sm">
                {currentSlide.title}
              </h2>
              <p className="text-xs font-medium text-emerald-300">
                {currentSlide.subtitle}
              </p>
            </div>
          </div>

          {/* Detailed Explanation */}
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
            {currentSlide.description}
          </p>

          {/* Feature Highlights Grid */}
          <div className="space-y-2">
            <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
              Key Capabilities:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {currentSlide.highlights.map((highlight, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-800/60 border border-slate-800 text-xs text-slate-200 font-medium"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="leading-snug">{highlight}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pro Tip Box */}
          {currentSlide.tip && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 font-medium flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <p>
                <strong className="text-amber-300 font-bold">Pro Tip: </strong>
                {currentSlide.tip}
              </p>
            </div>
          )}

        </div>

        {/* Bottom Footer Controls & Dots */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-900/90 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
          
          {/* Step Indicator Dots */}
          <div className="flex items-center gap-1.5 order-2 sm:order-1">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlideIndex(idx)}
                className={`h-2 rounded-full transition-all ${
                  currentSlideIndex === idx
                    ? 'w-6 bg-emerald-400 shadow-sm'
                    : 'w-2 bg-slate-700 hover:bg-slate-600'
                }`}
                title={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Actions & Navigation Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end order-1 sm:order-2">
            
            {/* Direct Jump to Feature Action */}
            {currentSlide.actionLabel && (
              <button
                onClick={handleAction}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{currentSlide.actionLabel}</span>
              </button>
            )}

            <div className="flex items-center gap-2">
              {/* Previous Button */}
              {currentSlideIndex > 0 && (
                <button
                  onClick={handlePrev}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center gap-1 transition-all border border-slate-700"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Back</span>
                </button>
              )}

              {/* Next / Finish Button */}
              <button
                onClick={handleNext}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
              >
                <span>{currentSlideIndex === slides.length - 1 ? 'Start Farming' : 'Next'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
