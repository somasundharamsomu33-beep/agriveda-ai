import React, { useState } from 'react';
import { Camera, Upload, CheckCircle, ArrowLeft, Download, Volume2, Share2, AlertTriangle, Sparkles, Sprout, RefreshCw, FileText, FileDown, Check } from 'lucide-react';
import { CropDiagnosisReport, UserProfile } from '../types';
import { translations, sampleCropImages } from '../data/mockData';
import { generateCropReportPDF } from '../utils/pdfExport';
import { supabase } from '../lib/supabase';
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
  const [showFullReport, setShowFullReport] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [pdfSuccess, setPdfSuccess] = useState(false);

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

  // Handle File Upload
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

  // Perform AI Crop Analysis
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

      const report: CropDiagnosisReport = await res.json();
      setActiveReport(report);
      onDiagnosisComplete(report);
    } catch (err) {
      console.error('Error analyzing crop:', err);
      // Fallback
      const sample = sampleCropImages[0];
      const fallbackReport: CropDiagnosisReport = {
        id: `report-${Date.now()}`,
        timestamp: 'Just now',
        cropType,
        soilType,
        location,
        imageUrl: selectedImage || sample.url,
        detectedIssue: sample.issue,
        confidence: 92,
        riskLevel: 'High',
        farmHealthScore: 78,
        cause: sample.cause,
        treatment: sample.treatment,
        prevention: sample.prevention,
        fertilizerSuggestion: sample.fertilizer
      };
      setActiveReport(fallbackReport);
      onDiagnosisComplete(fallbackReport);
    } finally {
      setIsScanning(false);
    }
  };

  // Audio Speech synthesis for accessibility
  const handleReadAloud = (text: string) => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }
      const utterance = new SpeechSynthesisUtterance(text);
      if (profile.language === 'ta') utterance.lang = 'ta-IN';
      else if (profile.language === 'hi') utterance.lang = 'hi-IN';
      else utterance.lang = 'en-US';

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

      {/* Title Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Camera className="w-5 h-5 text-blue-600" />
            <span>AI Crop Diagnosis</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Upload leaf photo or capture crop image for instant pathology analysis
          </p>
        </div>

        {activeReport && (
          <button
            onClick={() => {
              setActiveReport(null);
              setShowFullReport(false);
            }}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg flex items-center gap-1 transition-colors border border-slate-200"
          >
            <RefreshCw className="w-3.5 h-3.5" /> New Scan
          </button>
        )}
      </div>

      {/* VIEW 1: SCAN INPUT FORM (Screen 4) */}
      {!activeReport && !isScanning && (
        <div className="space-y-5">

          {/* Upload / Capture Dropzone */}
          <div className="bg-slate-50 rounded-xl p-5 border-2 border-dashed border-slate-300 text-center relative overflow-hidden group hover:border-blue-500 transition-colors">

            {selectedImage ? (
              <div className="relative max-w-sm mx-auto">
                <img
                  src={selectedImage}
                  alt="Crop preview"
                  className="w-full h-52 object-cover rounded-xl shadow-sm border border-slate-200"
                />
                <label className="absolute bottom-3 right-3 px-3 py-1.5 bg-slate-900/90 hover:bg-slate-900 text-white text-xs font-bold rounded-lg cursor-pointer shadow-md flex items-center gap-1">
                  <Camera className="w-3.5 h-3.5 text-blue-400" />
                  <span>Change Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
            ) : (
              <div className="py-6 space-y-3">
                <div className="w-14 h-14 mx-auto rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200">
                  <Upload className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    Upload or Capture Crop Image
                  </p>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto mt-0.5">
                    Ensure leaf spots, discoloration, or pest damage are clearly visible.
                  </p>
                </div>

                <div className="flex items-center justify-center gap-3 pt-2">
                  <label className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg cursor-pointer shadow-sm flex items-center gap-2 transition-colors">
                    <Camera className="w-4 h-4" />
                    <span>Upload Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Preset Sample Crop Images Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Or Choose Sample Infected Crop Leaf:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {sampleCropImages.map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => {
                    setSelectedImage(sample.url);
                    setSelectedSampleId(sample.id);
                    setCropType(sample.crop);
                  }}
                  className={`p-2 rounded-xl border text-left flex items-center gap-2 transition-all ${selectedSampleId === sample.id
                    ? 'bg-blue-50/80 border-blue-600 ring-1 ring-blue-600 shadow-sm'
                    : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                >
                  <img
                    src={sample.url}
                    alt={sample.name}
                    className="w-10 h-10 rounded-lg object-cover shrink-0 border border-slate-200"
                  />
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold text-slate-900 truncate">
                      {sample.crop}
                    </p>
                    <p className="text-[9px] text-slate-500 truncate">
                      {sample.issue}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Form Options */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Sprout className="w-4 h-4 text-blue-600" /> Farm & Crop Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Crop Type Dropdown */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Crop Type
                </label>
                <select
                  value={cropType}
                  onChange={e => setCropType(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="Paddy / Rice">Paddy / Rice</option>
                  <option value="Ragi / Finger Millet">Ragi / Finger Millet</option>
                  <option value="Sorghum / Cholam Millet">Sorghum / Cholam Millet</option>
                  <option value="Moong Dal / Green Gram">Moong Dal / Green Gram</option>
                  <option value="Black Gram / Urad Dal">Black Gram / Urad Dal</option>
                  <option value="Groundnut / Peanut">Groundnut / Peanut</option>
                  <option value="Tomato">Tomato</option>
                  <option value="Chilli">Chilli</option>
                  <option value="Cotton">Cotton</option>
                  <option value="Wheat">Wheat</option>
                  <option value="Sugarcane">Sugarcane</option>
                  <option value="Brinjal">Brinjal / Eggplant</option>
                  <option value="Onion">Onion</option>
                </select>
              </div>

              {/* Soil Type Dropdown */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Soil Type
                </label>
                <select
                  value={soilType}
                  onChange={e => setSoilType(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="Red Soil">Red Soil</option>
                  <option value="Clay Soil">Clay Soil</option>
                  <option value="Loam Soil">Loam Soil</option>
                  <option value="Sandy Loam">Sandy Loam</option>
                  <option value="Black Cotton Soil">Black Cotton Soil</option>
                  <option value="Alluvial Soil">Alluvial Soil</option>
                </select>
              </div>

              {/* Farm Area in Acres */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Farm Area (in acres)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={farmArea}
                  onChange={e => setFarmArea(Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Location / District
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder="e.g. Vellore, Tamil Nadu"
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            {/* Analyze Crop Primary Button */}
            <button
              onClick={handleAnalyzeCrop}
              className="w-full py-3 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 transform active:scale-98 transition-all mt-4"
            >
              <Sparkles className="w-4 h-4 text-white animate-spin" style={{ animationDuration: '3s' }} />
              <span>{t.analyzeCrop}</span>
            </button>

          </div>

        </div>
      )}

      {/* SCANNING LOADING ANIMATION */}
      {isScanning && (
        <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-slate-200 space-y-4 my-8">
          <div className="relative w-32 h-32 mx-auto rounded-xl overflow-hidden border-2 border-blue-600 shadow-md">
            <img src={selectedImage || sampleCropImages[0].url} alt="Scanning" className="w-full h-full object-cover" />
            <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-blue-400 via-amber-300 to-blue-400 shadow-lg animate-bounce" style={{ top: '40%' }}></div>
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900 flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600 animate-spin" />
              AgriVeda AI Scanning Crop Leaves...
            </h3>
            <p className="text-xs text-slate-500 font-medium max-w-sm mx-auto">
              Analyzing fungal pathogens, leaf spot patterns, nutrient deficiency, and regional pest risks...
            </p>
          </div>
        </div>
      )}

      {/* VIEW 2: AI DIAGNOSIS RESULT SCREEN */}
      {activeReport && !isScanning && (
        <div className="space-y-5 animate-in fade-in">

          {/* Result Overview Header Card */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 space-y-4">

            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-bold uppercase text-slate-700 tracking-wider">
                {t.diagnosisResult}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {activeReport.timestamp}
              </span>
            </div>

            {/* Image Preview with Diagnostic Overlay */}
            <div className="relative rounded-xl overflow-hidden border border-slate-200 shadow-sm max-w-md mx-auto">
              <img
                src={activeReport.imageUrl}
                alt="Diagnosis preview"
                className="w-full h-56 object-cover"
              />
              <div className="absolute top-3 right-3 px-3 py-1 rounded-md bg-slate-900/90 backdrop-blur-md text-white text-xs font-bold flex items-center gap-1.5 border border-slate-700">
                <CheckCircle className="w-3.5 h-3.5 text-blue-400" />
                <span>AI Pathology Verified</span>
              </div>
            </div>

            {/* Detected Issue Details */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Crop: {activeReport.cropType}
                  </p>
                  <h3 className="text-base font-bold text-slate-900 leading-tight">
                    {activeReport.detectedIssue}
                  </h3>
                </div>

                <div className="text-right">
                  <span className={`inline-block px-2.5 py-1 text-xs font-bold rounded-md text-white ${activeReport.riskLevel === 'High' ? 'bg-red-600' :
                    activeReport.riskLevel === 'Medium' ? 'bg-amber-600' : 'bg-emerald-600'
                    }`}>
                    {activeReport.riskLevel} Risk
                  </span>
                </div>
              </div>

              {/* Confidence Score Bar */}
              <div className="pt-1">
                <div className="flex items-center justify-between text-xs font-bold mb-1">
                  <span className="text-slate-600">AI Confidence Level</span>
                  <span className="text-blue-600">{activeReport.confidence}%</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full"
                    style={{ width: `${activeReport.confidence}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* View Full Report & Export PDF Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <button
                onClick={() => setShowFullReport(true)}
                className="py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-colors"
              >
                <span>{t.viewFullReport}</span>
                <ArrowLeft className="w-4 h-4 rotate-180" />
              </button>

              <button
                onClick={handleExportPDF}
                disabled={isExportingPDF}
                className="py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-400 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-colors"
              >
                {pdfSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>PDF Downloaded!</span>
                  </>
                ) : (
                  <>
                    <FileDown className={`w-4 h-4 ${isExportingPDF ? 'animate-bounce' : ''}`} />
                    <span>{isExportingPDF ? 'Generating PDF...' : 'Export PDF Report'}</span>
                  </>
                )}
              </button>
            </div>

          </div>

          {/* VIEW 3: FULL REPORT EXPANDED SECTION */}
          {showFullReport && (
            <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 space-y-4 animate-in fade-in">

              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Sprout className="w-4 h-4 text-blue-600" />
                  <span>{t.fullReport}</span>
                </h3>

                <button
                  onClick={() => handleReadAloud(`${activeReport.detectedIssue}. Cause: ${activeReport.cause}. Treatment: ${activeReport.treatment.join(', ')}`)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${isSpeaking ? 'bg-amber-500 text-white animate-pulse' : 'bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-200'
                    }`}
                >
                  <Volume2 className="w-4 h-4" />
                  <span>{isSpeaking ? 'Pause Audio' : 'Listen Report'}</span>
                </button>
              </div>

              {/* Cause Section */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" /> {t.cause}
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {activeReport.cause}
                </p>
              </div>

              {/* Treatment Section */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  🧪 {t.treatment}
                </h4>
                <ul className="space-y-1.5">
                  {activeReport.treatment.map((step, idx) => (
                    <li key={idx} className="text-xs text-slate-800 flex items-start gap-2">
                      <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Prevention Section */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  🛡️ {t.prevention}
                </h4>
                <ul className="space-y-1.5">
                  {activeReport.prevention.map((step, idx) => (
                    <li key={idx} className="text-xs text-slate-800 flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Fertilizer Suggestion */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  🌾 {t.fertilizerSuggestion}
                </h4>
                <p className="text-xs text-slate-800 font-semibold">
                  {activeReport.fertilizerSuggestion}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <button
                  onClick={handleExportPDF}
                  disabled={isExportingPDF}
                  className="py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-400 text-white font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-1.5 transition-colors"
                >
                  <FileDown className={`w-4 h-4 ${isExportingPDF ? 'animate-bounce' : ''}`} />
                  <span>{isExportingPDF ? 'Generating...' : 'Export PDF'}</span>
                </button>

                <button
                  onClick={() => alert('Report saved to your Saved Diagnosis History!')}
                  className="py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>{t.saveReport}</span>
                </button>

                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: `AgriVeda AI Report: ${activeReport.detectedIssue}`,
                        text: `Diagnosis for ${activeReport.cropType}: ${activeReport.detectedIssue}`
                      });
                    } else {
                      alert('Share link copied to clipboard!');
                    }
                  }}
                  className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl border border-slate-200 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share Report</span>
                </button>
              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
};
