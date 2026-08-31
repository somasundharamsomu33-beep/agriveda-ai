import React, { useState } from 'react';
import { Camera, Upload, CheckCircle, ArrowLeft, Download, Volume2, Share2, AlertTriangle, Sparkles, Sprout, RefreshCw, FileText, FileDown, Check, ShieldAlert, Zap, Calculator } from 'lucide-react';
import { CropDiagnosisReport, UserProfile } from '../types';
import { translations, sampleCropImages } from '../data/mockData';
import { generateCropReportPDF } from '../utils/pdfExport';
import { supabase } from '../lib/supabase';
import { FertilizerCalculator } from './FertilizerCalculator';

interface CropScanViewProps {
  profile: UserProfile;
  onDiagnosisComplete: (report: CropDiagnosisReport) => void;
  activeReport: CropDiagnosisReport | null;
  setActiveReport: React.Dispatch<React.SetStateAction<CropDiagnosisReport | null>>;
}

export const CropScanView: React.FC<CropScanViewProps> = ({
  profile,
  onDiagnosisComplete,
  activeReport,
  setActiveReport
}) => {
  const t = translations[profile.language] || translations.en;

  const [cropType, setCropType] = useState(profile.primaryCrop || 'Tomato');
  const [soilType, setSoilType] = useState('Red Soil');
  const [farmArea, setFarmArea] = useState(profile.farmSizeAcres || 2.5);
  const [location, setLocation] = useState(profile.location || 'Vellore, Tamil Nadu');

  const [selectedImage, setSelectedImage] = useState<string | null>(sampleCropImages[0].url);
  const [selectedSampleId, setSelectedSampleId] = useState<string | null>(sampleCropImages[0].id);
  const [isScanning, setIsScanning] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [pdfSuccess, setPdfSuccess] = useState(false);
  const [showFertilizerCalc, setShowFertilizerCalc] = useState(false);

  const handleExportPDF = async () => {
    if (!activeReport) return;
    setIsExportingPDF(true);
    try {
      await generateCropReportPDF(activeReport, profile);
      setPdfSuccess(true);
      setTimeout(() => setPdfSuccess(false), 3000);
    } catch (err) {
      console.error('PDF export failed:', err);
      alert('Could not export PDF. Please try again.');
    } finally {
      setIsExportingPDF(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setSelectedSampleId(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyzeCrop = async () => {
    setIsScanning(true);
    setActiveReport(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();

      const res = await fetch('/api/analyze-crop', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token ? { 'Authorization': `Bearer ${session.access_token}` } : {})
        },
        body: JSON.stringify({
          cropType,
          soilType,
          farmArea,
          location,
          imageBase64: selectedSampleId ? null : selectedImage,
          sampleImageId: selectedSampleId
        })
      });

      const report = await res.json();

      if (!res.ok) {
        if (report.error) {
          throw new Error(report.error);
        }
        throw new Error('Failed to analyze crop.');
      }

      setActiveReport(report);
      onDiagnosisComplete(report);
    } catch (err: any) {
      console.error('Error analyzing crop:', err);
      alert(err.message || 'Error occurred while scanning crop.');
      setActiveReport(null);
    } finally {
      setIsScanning(false);
    }
  };

  const handleReadAloud = (text: string) => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }
      const utterance = new SpeechSynthesisUtterance(text);
      let targetLang = 'en-US';
      if (profile.language === 'ta') targetLang = 'ta-IN';
      else if (profile.language === 'hi') targetLang = 'hi-IN';
      else if (profile.language === 'te') targetLang = 'te-IN';

      utterance.lang = targetLang;

      const voices = window.speechSynthesis.getVoices();
      const regionalVoice = voices.find(v => v.lang === targetLang || v.lang.startsWith(targetLang.split('-')[0]));
      if (regionalVoice) {
        utterance.voice = regionalVoice;
      }

      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Speech synthesis is not supported on this browser.');
    }
  };

  return (
    <div className="space-y-6 pb-24 animate-in fade-in">

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <Camera className="w-6 h-6 text-emerald-700" />
            <span>Crop Doctor • Scan My Crop</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Instantly diagnose leaf diseases, fungal spot, pests, and nutrient deficiencies.
          </p>
        </div>

        <button
          onClick={() => setShowFertilizerCalc(prev => !prev)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 rounded-2xl border border-emerald-300 font-bold text-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Calculator className="w-4 h-4 text-emerald-700" />
          <span>{showFertilizerCalc ? 'Hide Fertilizer Calculator' : 'Fertilizer Dosage Calculator'}</span>
        </button>
      </div>

      {/* Fertilizer Calculator Tab Toggle */}
      {showFertilizerCalc && (
        <div className="p-4 bg-emerald-50/60 rounded-3xl border border-emerald-200">
          <FertilizerCalculator profile={profile} />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* 📸 LEFT COLUMN: PHOTO UPLOAD & SAMPLE SELECTOR (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200 space-y-4">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Upload className="w-4 h-4 text-emerald-700" />
              <span>Step 1: Upload or Capture Crop Photo</span>
            </h3>

            {/* Selected Image Preview Area */}
            <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-slate-100 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center group">
              {selectedImage ? (
                <>
                  <img
                    src={selectedImage}
                    alt="Crop Scan Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <label className="px-4 py-2 bg-white text-slate-900 font-bold text-xs rounded-xl shadow-md cursor-pointer hover:bg-slate-100">
                      Change Photo
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                  </div>
                </>
              ) : (
                <label className="flex flex-col items-center justify-center p-6 text-center cursor-pointer">
                  <Camera className="w-10 h-10 text-emerald-600 mb-2" />
                  <span className="text-xs font-bold text-slate-800">Take Photo or Upload Image</span>
                  <span className="text-[10px] text-slate-400 mt-1">Supports JPG, PNG up to 10MB</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              )}
            </div>

            {/* Sample Pathology Images Selector */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 block">Or Select Sample Leaf Image:</span>
              <div className="grid grid-cols-3 gap-2">
                {sampleCropImages.map(sample => (
                  <button
                    key={sample.id}
                    onClick={() => {
                      setSelectedImage(sample.url);
                      setSelectedSampleId(sample.id);
                    }}
                    className={`relative rounded-xl overflow-hidden border-2 transition-all aspect-square cursor-pointer ${
                      selectedSampleId === sample.id ? 'border-emerald-600 ring-2 ring-emerald-500/20 scale-95' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <img src={sample.url} alt={sample.crop} className="w-full h-full object-cover" />
                    <span className="absolute bottom-0 inset-x-0 bg-slate-950/70 text-white text-[9px] font-extrabold px-1 py-0.5 truncate text-center">
                      {sample.crop}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Farm Context Inputs */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Crop Type</label>
                  <input
                    type="text"
                    value={cropType}
                    onChange={e => setCropType(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-semibold rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-600 outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Soil Type</label>
                  <input
                    type="text"
                    value={soilType}
                    onChange={e => setSoilType(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-semibold rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-600 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Scan Button */}
            <button
              onClick={handleAnalyzeCrop}
              disabled={isScanning}
              className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 active:scale-98 text-white font-black text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isScanning ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Analyzing Pathology with AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-amber-300" />
                  <span>Run Crop Doctor Diagnosis</span>
                </>
              )}
            </button>

          </div>
        </div>

        {/* 📑 RIGHT COLUMN: STRUCTURED DIAGNOSIS REPORT (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {activeReport ? (
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-5">
              
              {/* Report Title Header */}
              <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1 bg-rose-100 text-rose-800 rounded-full">
                    {activeReport.riskLevel} Risk • {activeReport.confidence}% AI Confidence
                  </span>
                  <h3 className="text-xl font-black text-slate-900 mt-2">
                    {activeReport.detectedIssue}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Diagnosis for {activeReport.cropType} ({activeReport.location})
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleReadAloud(`${activeReport.detectedIssue}. Cause: ${activeReport.cause}. Treatment: ${activeReport.treatment?.join(' ')}`)}
                    className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                      isSpeaking ? 'bg-amber-500 text-slate-950 border-amber-400' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                    }`}
                    title="Read Aloud Diagnosis"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handleExportPDF}
                    disabled={isExportingPDF}
                    className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold text-xs rounded-xl border border-emerald-300 transition-colors cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-emerald-700" />
                    <span>{pdfSuccess ? 'Exported!' : 'Download PDF'}</span>
                  </button>
                </div>
              </div>

              {/* 🎯 STRUCTURED AI ADVISORY: Problem -> Cause -> Action -> Next Step */}
              <div className="space-y-4">
                
                {/* 1. PROBLEM */}
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl space-y-1">
                  <span className="text-[11px] font-black text-rose-900 uppercase tracking-wider block">1. Identified Problem</span>
                  <p className="text-xs font-bold text-rose-950">{activeReport.detectedIssue}</p>
                </div>

                {/* 2. CAUSE */}
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-1">
                  <span className="text-[11px] font-black text-amber-900 uppercase tracking-wider block">2. Root Cause & Conditions</span>
                  <p className="text-xs text-amber-950 font-medium">{activeReport.cause}</p>
                </div>

                {/* 3. ACTION (Treatment Steps) */}
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2">
                  <span className="text-[11px] font-black text-emerald-900 uppercase tracking-wider block">3. Immediate Action & Treatment</span>
                  <ul className="space-y-1.5 text-xs text-emerald-950 font-medium">
                    {activeReport.treatment?.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 4. NEXT STEP (Prevention & Fertilizer) */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <span className="text-[11px] font-black text-slate-900 uppercase tracking-wider block">4. Next Steps & Prevention</span>
                  <p className="text-xs text-slate-800 font-medium">
                    <strong>Fertilizer Advice:</strong> {activeReport.fertilizerSuggestion}
                  </p>
                  <ul className="space-y-1 text-xs text-slate-700 font-medium pt-1">
                    {activeReport.prevention?.map((prev, idx) => (
                      <li key={idx}>• {prev}</li>
                    ))}
                  </ul>
                </div>

              </div>

            </div>
          ) : (
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 text-center space-y-4 min-h-[400px] flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
                <Sparkles className="w-8 h-8 text-emerald-700" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">Ready to Scan Your Crop</h3>
                <p className="text-xs text-slate-500 font-medium max-w-sm mt-1">
                  Select or upload a leaf photo on the left and tap "Run Crop Doctor Diagnosis" to get an instant pathology report.
                </p>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
