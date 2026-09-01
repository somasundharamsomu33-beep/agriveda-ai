import React, { useState, useRef } from 'react';
import { 
  Camera, 
  Upload, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles, 
  RefreshCw, 
  ShoppingBag, 
  Wrench, 
  FileText,
  ShieldAlert,
  ArrowRight,
  Leaf
} from 'lucide-react';
import { UserProfile, ActiveTab } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { detectCropDisease, CropAnalysisResponse } from '../lib/aiService';

interface CropScanViewProps {
  profile: UserProfile;
  activeReport?: any;
  onNavigateTab?: (tab: ActiveTab) => void;
}

const SAMPLE_LEAF_PHOTOS = [
  {
    id: 'sample-tomato',
    title: 'Tomato Leaf (Blight Sample)',
    crop: 'Tomato',
    imageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb197a5?auto=format&fit=crop&w=600&q=80',
    description: 'Concentric brown rings & yellow halo'
  },
  {
    id: 'sample-rice',
    title: 'Paddy Rice (Blast Sample)',
    crop: 'Rice',
    imageUrl: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=600&q=80',
    description: 'Spindle-shaped necrotic lesions'
  },
  {
    id: 'sample-cotton',
    title: 'Cotton Leaf (Curl Sample)',
    crop: 'Cotton',
    imageUrl: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=600&q=80',
    description: 'Upward curling & thickening'
  }
];

export const CropScanView: React.FC<CropScanViewProps> = ({
  profile,
  onNavigateTab
}) => {
  const { language, t } = useLanguage();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<CropAnalysisResponse | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedCrop, setSelectedCrop] = useState<string>(profile.primaryCrop || 'Tomato');

  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  // File Upload Handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setPreviewImage(base64);
      runAnalysis(base64);
    };
    reader.readAsDataURL(file);
  };

  // Sample Leaf Photo Selector
  const handleSelectSample = (sample: typeof SAMPLE_LEAF_PHOTOS[0]) => {
    setSelectedCrop(sample.crop);
    setPreviewImage(sample.imageUrl);
    runAnalysis(sample.imageUrl, sample.id);
  };

  const runAnalysis = async (imgUrlOrBase64?: string, sampleId?: string) => {
    setIsAnalyzing(true);
    try {
      const result = await detectCropDisease(
        selectedCrop,
        language,
        imgUrlOrBase64,
        sampleId
      );
      setAnalysisResult(result);
    } catch (err) {
      console.error('Crop scan error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-3xl w-full mx-auto space-y-6 font-sans">
      
      {/* Hidden Native File Inputs */}
      <input
        type="file"
        ref={cameraInputRef}
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
      />
      <input
        type="file"
        ref={galleryInputRef}
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-950 to-indigo-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-blue-800/70 border border-blue-400/30 rounded-full text-xs font-bold text-blue-200">
          <Sparkles className="w-3.5 h-3.5 text-blue-300" />
          <span>AgriVeda AI Vision Pathology Diagnostics</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          {t('cropScanHeader')}
        </h2>
        <p className="text-xs sm:text-sm text-blue-200 font-medium max-w-xl">
          Upload or take a photo of an affected leaf to identify plant diseases, get organic/chemical remedies, and order treatment inputs.
        </p>
      </div>

      {/* Crop Selector Dropdown */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Leaf className="w-5 h-5 text-emerald-600" />
          <span className="text-xs font-bold text-slate-700">Select Crop Being Diagnosed:</span>
        </div>

        <select
          value={selectedCrop}
          onChange={(e) => setSelectedCrop(e.target.value)}
          className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-extrabold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
        >
          {['Tomato', 'Rice', 'Cotton', 'Sugarcane', 'Maize', 'Groundnut', 'Chilli', 'Brinjal', 'Onion'].map(c => (
            <option key={c} value={c}>{c} Crop</option>
          ))}
        </select>
      </div>

      {/* Upload Dropzone */}
      <div className="p-6 sm:p-8 bg-white rounded-3xl border-2 border-dashed border-blue-300 hover:border-blue-500 shadow-sm text-center space-y-4 transition-all">
        {previewImage ? (
          <div className="relative max-w-md mx-auto overflow-hidden rounded-2xl border border-slate-200 shadow-md">
            <img src={previewImage} alt="Crop Leaf Scan" className="w-full h-48 object-cover" />
            <span className="absolute bottom-2 right-2 px-2.5 py-1 bg-slate-900/80 text-white text-[10px] font-bold rounded-lg backdrop-blur-xs">
              Preview Ready
            </span>
          </div>
        ) : (
          <div className="mx-auto w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center border border-blue-100 shadow-inner">
            <Camera className="w-8 h-8" />
          </div>
        )}

        <div className="space-y-1">
          <h3 className="text-base font-black text-slate-900">{t('uploadCropImage')}</h3>
          <p className="text-xs text-slate-500 font-medium">Take a photo of affected leaf or upload from device gallery</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => cameraInputRef.current?.click()}
            className="px-5 py-3 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all cursor-pointer"
          >
            <Camera className="w-4 h-4" />
            <span>Open Camera</span>
          </button>

          <button
            onClick={() => galleryInputRef.current?.click()}
            className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center gap-2 transition-all cursor-pointer"
          >
            <Upload className="w-4 h-4 text-blue-600" />
            <span>Upload Photo</span>
          </button>
        </div>
      </div>

      {/* Interactive Sample Leaf Photos */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase text-slate-500 tracking-wider">
            Or Click a Sample Leaf Photo for Instant Test Scan:
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {SAMPLE_LEAF_PHOTOS.map(sample => (
            <button
              key={sample.id}
              onClick={() => handleSelectSample(sample)}
              className="p-3 bg-white hover:bg-blue-50/50 rounded-2xl border border-slate-200 hover:border-blue-400 text-left transition-all space-y-2 cursor-pointer group shadow-xs"
            >
              <img src={sample.imageUrl} alt={sample.title} className="w-full h-24 object-cover rounded-xl border border-slate-100" />
              <div>
                <h4 className="font-extrabold text-slate-900 text-xs group-hover:text-blue-700">{sample.title}</h4>
                <p className="text-[11px] text-slate-500 line-clamp-1">{sample.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Loading Animation */}
      {isAnalyzing && (
        <div className="p-8 bg-blue-50 rounded-3xl border border-blue-200 text-center space-y-3 animate-pulse">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
          <h3 className="text-sm font-black text-blue-950">Analyzing Plant Pathology Data...</h3>
          <p className="text-xs text-blue-800 font-medium">Matching against AgriVeda ICAR & TNAU crop disease database</p>
        </div>
      )}

      {/* AI Analysis Result Card */}
      {analysisResult && !isAnalyzing && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xl space-y-6 animate-in fade-in">
          
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-black text-slate-900">AgriVeda Diagnostic Pathology Report</h3>
            </div>

            <span className={`px-3 py-1 text-xs font-black rounded-full border ${
              analysisResult.riskLevel === 'High' || analysisResult.riskLevel === 'Critical'
                ? 'bg-rose-100 text-rose-800 border-rose-200'
                : 'bg-amber-100 text-amber-900 border-amber-200'
            }`}>
              Severity: {analysisResult.riskLevel}
            </span>
          </div>

          {/* Disease Name & Confidence Score */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Detected Pathology Issue</span>
              <p className="text-base font-black text-slate-900">{analysisResult.detectedIssue}</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">AI Match Confidence</span>
              <p className="text-xl font-black text-emerald-600">{analysisResult.confidence}% Confidence Score</p>
            </div>
          </div>

          {/* Cause */}
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Pathology Cause & Environmental Trigger</span>
            <p className="text-xs text-slate-700 font-semibold bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
              {analysisResult.cause}
            </p>
          </div>

          {/* Recommended Treatments */}
          <div className="space-y-2">
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Recommended Treatment Plan</h4>
            <div className="bg-emerald-50/80 p-4 rounded-2xl border border-emerald-200 space-y-2.5">
              {analysisResult.treatment.map((action: string, idx: number) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-emerald-950 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{action}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Prevention Measures */}
          {analysisResult.prevention && (
            <div className="space-y-2">
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Prevention & Best Practices</h4>
              <div className="bg-blue-50/80 p-4 rounded-2xl border border-blue-200 space-y-2 text-xs text-blue-950 font-semibold">
                {analysisResult.prevention.map((prev, idx) => (
                  <p key={idx}>• {prev}</p>
                ))}
              </div>
            </div>
          )}

          {/* Direct Action Hub */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {onNavigateTab && (
              <button
                onClick={() => onNavigateTab('marketplace')}
                className="p-3.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-2xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Find Remedy Pesticides in Store</span>
              </button>
            )}

            {onNavigateTab && (
              <button
                onClick={() => onNavigateTab('nearby')}
                className="p-3.5 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-2xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
              >
                <Wrench className="w-4 h-4 text-emerald-400" />
                <span>Request Nearby Agronomist Visit</span>
              </button>
            )}
          </div>

          {/* Disclaimer */}
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-900 font-medium leading-relaxed">
              {analysisResult.disclaimer}
            </p>
          </div>

        </div>
      )}

    </div>
  );
};
