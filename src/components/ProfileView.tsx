import React, { useState, useRef, useEffect } from 'react';
import {
  User,
  MapPin,
  Sprout,
  FileText,
  Globe,
  LogOut,
  Settings,
  ChevronRight,
  Bookmark,
  FileDown,
  Camera,
  Upload,
  CheckCircle2,
  Trash2,
  Navigation,
  RefreshCw,
  Sparkles,
  Eye,
  SwitchCamera,
  Layers,
  Calendar,
  Phone,
  Mail,
  Edit3,
  Save,
  X,
  ShieldCheck,
  Award,
  BadgeCheck,
  Lock,
  ShieldAlert,
  LogIn,
  Store,
  Landmark,
  GraduationCap
} from 'lucide-react';
import { UserProfile, CropDiagnosisReport, ActiveTab, LandPhotoSnap } from '../types';
import { translations, sampleCropImages } from '../data/mockData';
import { useFirebase } from '../context/FirebaseContext';
import { generateCropReportPDF } from '../utils/pdfExport';
import { VerificationEngine } from '../lib/verificationEngine';
import { AuthService } from '../lib/authService';

interface ProfileViewProps {
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  onOpenAuth: () => void;
  savedReports: CropDiagnosisReport[];
  onSelectReport: (report: CropDiagnosisReport) => void;
  setActiveTab: (tab: ActiveTab) => void;
  onNavigateToLandPhoto?: (photo: LandPhotoSnap) => void;
  onOpenRoleOnboarding?: () => void;
  onOpenSignOutConfirm?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  setProfile,
  onOpenAuth,
  savedReports,
  onSelectReport,
  setActiveTab,
  onNavigateToLandPhoto,
  onOpenRoleOnboarding,
  onOpenSignOutConfirm,
}) => {
  const { logout } = useFirebase();
  const t = translations[profile.language] || translations.en;

  // Personal Info Form State
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [firstName, setFirstName] = useState(profile.firstName || profile.name?.split(' ')[0] || 'Ravi');
  const [secondName, setSecondName] = useState(profile.secondName || profile.name?.split(' ').slice(1).join(' ') || 'Kumar');
  const [phone, setPhone] = useState(profile.phone || '+91 98765 43210');
  const [email, setEmail] = useState(profile.email || 'farmer.ravi@agriveda.io');
  const [location, setLocation] = useState(profile.location || 'Vellore, Tamil Nadu, India');
  const [primaryCrop, setPrimaryCrop] = useState(profile.primaryCrop || 'Tomato');
  const [farmSize, setFarmSize] = useState(profile.farmSizeAcres || 2.5);
  const [soilType, setSoilType] = useState(profile.soilType || 'Red Loamy Soil');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Snapchat-style Camera Snapper State
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraFacing, setCameraFacing] = useState<'environment' | 'user'>('environment');
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [capturedPhotoUrl, setCapturedPhotoUrl] = useState<string | null>(null);
  const [parcelTitle, setParcelTitle] = useState('North Acre Farm Plot');
  const [parcelNotes, setParcelNotes] = useState('Rich loamy soil with active drip fertigation irrigation.');
  const [currentGpsCoords, setCurrentGpsCoords] = useState<[number, number]>([75.8056, 30.9010]);
  const [isLocating, setIsLocating] = useState(false);
  const [shutterFlash, setShutterFlash] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Fetch real-time device GPS on mount
  useEffect(() => {
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCurrentGpsCoords([pos.coords.longitude, pos.coords.latitude]);
        },
        (err) => console.warn('Device GPS notice:', err.message),
        { enableHighAccuracy: true }
      );
    }
  }, []);

  // Handle Camera Start / Stop
  const startCamera = async (facing: 'environment' | 'user') => {
    setCameraError(null);
    try {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facing, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      console.warn('Camera access error:', err);
      setCameraError('Camera access unavailable or permission denied. You can upload photo from your device.');
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setIsCameraOpen(false);
    setCapturedPhotoUrl(null);
  };

  const handleOpenLiveCamera = () => {
    setIsCameraOpen(true);
    setCapturedPhotoUrl(null);
    startCamera(cameraFacing);

    // Refresh GPS coordinates for geotagging
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCurrentGpsCoords([pos.coords.longitude, pos.coords.latitude]);
          setIsLocating(false);
        },
        () => setIsLocating(false),
        { enableHighAccuracy: true }
      );
    }
  };

  const toggleCameraFacing = () => {
    const nextFacing = cameraFacing === 'environment' ? 'user' : 'environment';
    setCameraFacing(nextFacing);
    startCamera(nextFacing);
  };

  const handleSnapPhoto = () => {
    if (!videoRef.current) return;
    setShutterFlash(true);
    setTimeout(() => setShutterFlash(false), 200);

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setCapturedPhotoUrl(dataUrl);
      // Stop video stream once snapped
      if (cameraStream) {
        cameraStream.getTracks().forEach(t => t.stop());
        setCameraStream(null);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCapturedPhotoUrl(reader.result as string);
        setIsCameraOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveLandPhoto = () => {
    if (!capturedPhotoUrl) return;

    const newSnap: LandPhotoSnap = {
      id: `land-snap-${Date.now()}`,
      imageUrl: capturedPhotoUrl,
      title: parcelTitle || 'Farmland Crop Plot',
      notes: parcelNotes,
      timestamp: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      coords: currentGpsCoords,
      locationName: location.split(',')[0],
      cropType: primaryCrop,
      soilCondition: soilType
    };

    setProfile(prev => ({
      ...prev,
      landPhotos: [newSnap, ...(prev.landPhotos || [])]
    }));

    stopCamera();
    setSaveSuccessMsg('Land photo snapped, geotagged & affiliated with Map coordinates!');
    setTimeout(() => setSaveSuccessMsg(''), 4000);
  };

  const handleDeleteLandPhoto = (photoId: string) => {
    setProfile(prev => ({
      ...prev,
      landPhotos: (prev.landPhotos || []).filter(p => p.id !== photoId)
    }));
  };

  const handleViewPhotoOnMap = (photo: LandPhotoSnap) => {
    if (onNavigateToLandPhoto) {
      onNavigateToLandPhoto(photo);
    } else {
      setActiveTab('maps');
    }
  };

  const handleSavePersonalInfo = (e: React.FormEvent) => {
    e.preventDefault();
    const fullName = `${firstName.trim()} ${secondName.trim()}`.trim();

    setProfile(prev => ({
      ...prev,
      name: fullName || prev.name,
      firstName: firstName.trim(),
      secondName: secondName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      location: location.trim(),
      primaryCrop: primaryCrop.trim(),
      farmSizeAcres: Number(farmSize) || prev.farmSizeAcres,
      soilType: soilType.trim()
    }));

    setIsEditingPersonal(false);
    setSaveSuccessMsg('Personal details & farm parameters saved successfully!');
    setTimeout(() => setSaveSuccessMsg(''), 4000);
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setProfile(prev => ({ ...prev, language: e.target.value as any }));
  };

  // Signed Out / Guest State
  if (profile.isAuthenticated === false) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 space-y-6 text-center animate-in fade-in">
        <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 flex items-center justify-center mx-auto shadow-xl">
          <Lock className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-900">You are currently signed out</h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
            Sign in to access your registered farmland plot, view verified certificates, review pathology diagnosis reports, and manage APMC commodity rates.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onOpenAuth}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-xl shadow-emerald-700/20 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In to Your Account</span>
          </button>
          {onOpenRoleOnboarding && (
            <button
              onClick={onOpenRoleOnboarding}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-xs border border-slate-700 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Register New Account</span>
            </button>
          )}
        </div>

        {/* Demo Personas Quick Sign-In */}
        <div className="pt-6 border-t border-slate-200 text-left">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 text-center">
            Or Click to Sign In with Verified Demo Personas
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {[
              { role: 'Farmer', name: 'Ravi Kumar', cred: '9876543210', pass: 'AgriVeda@2026', icon: Sprout },
              { role: 'B2B Buyer', name: 'K. Balasubramaniam', cred: '9443244556', pass: 'AgriVeda@2026', icon: Store },
              { role: 'Research Scholar', name: 'Dr. Ananya Swaminathan', cred: '9842155432', pass: 'AgriVeda@2026', icon: GraduationCap },
              { role: 'Bank / NABARD Officer', name: 'V. Srinivasa Rao', cred: '9848012345', pass: 'AgriVeda@2026', icon: Landmark }
            ].map(demo => {
              const Icon = demo.icon;
              return (
                <div
                  key={demo.cred}
                  onClick={() => {
                    const result = AuthService.authenticateUser(demo.cred, demo.pass);
                    if (result.success && result.profile) {
                      setProfile(result.profile);
                    }
                  }}
                  className="p-3 bg-white rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-900">{demo.name}</p>
                      <p className="text-[10px] text-slate-500 font-medium">{demo.role} • {demo.cred}</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-600 group-hover:translate-x-0.5 transition-transform">
                    Sign In →
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24 animate-in fade-in max-w-3xl mx-auto">
      
      {/* Page Title */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div>
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <User className="w-6 h-6 text-emerald-600" />
            <span>{t.myProfile}</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Manage personal data, geotagged land snaps, and agricultural map affiliations
          </p>
        </div>

        <button
          onClick={() => setIsEditingPersonal(prev => !prev)}
          className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
        >
          {isEditingPersonal ? <X className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
          <span>{isEditingPersonal ? 'Close Edit' : 'Edit Personal Data'}</span>
        </button>
      </div>

      {/* Success Notification Alert */}
      {saveSuccessMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-2xl flex items-center gap-2.5 shadow-xs animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="text-xs font-bold">{saveSuccessMsg}</span>
        </div>
      )}

      {/* Profile Overview Card */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950/60 text-white rounded-3xl p-6 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center gap-5 relative z-10">
          <img
            src={profile.avatarUrl}
            alt={profile.name}
            className="w-20 h-20 rounded-2xl object-cover border-2 border-emerald-400 shadow-xl shrink-0"
          />

          <div className="flex-1 text-center sm:text-left min-w-0">
            <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
              <h3 className="text-xl font-black text-white truncate">{profile.name}</h3>
              <span className="px-2.5 py-0.5 text-[10px] font-black uppercase rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                Verified Farmer
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-1 gap-x-4 mt-2 text-xs text-slate-300">
              <p className="flex items-center justify-center sm:justify-start gap-1.5">
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <span className="truncate">{profile.email || 'farmer.ravi@agriveda.io'}</span>
              </p>
              <p className="flex items-center justify-center sm:justify-start gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>{profile.phone}</span>
              </p>
              <p className="flex items-center justify-center sm:justify-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-sky-400" />
                <span className="truncate">{profile.location}</span>
              </p>
              <p className="flex items-center justify-center sm:justify-start gap-1.5">
                <Sprout className="w-3.5 h-3.5 text-teal-400" />
                <span>{profile.primaryCrop} ({profile.farmSizeAcres} Acres)</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* VERIFICATION & COMPLIANCE BADGE CENTER */}
      {(() => {
        const meta = VerificationEngine.getStatusMeta(profile.verificationStatus);
        return (
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-2xl bg-emerald-100 text-emerald-800 shrink-0">
                  <ShieldCheck className="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                      Role Verification &amp; Compliance Center
                    </h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${meta.badgeClass}`}>
                      {meta.badgeText}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {meta.description}
                  </p>
                </div>
              </div>

              <button
                onClick={onOpenRoleOnboarding}
                className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black rounded-xl flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer shrink-0"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{profile.verificationStatus === 'FULLY_VERIFIED' ? 'Update Verification' : 'Verify Role Credentials'}</span>
              </button>
            </div>

            {/* Multi-Tier Verification Progress Meter */}
            <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>Verification Pipeline Progress</span>
                <span className="font-mono text-emerald-700 font-black">{meta.progress}% Complete</span>
              </div>
              <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 rounded-full transition-all duration-500"
                  style={{ width: `${meta.progress}%` }}
                />
              </div>
              <div className="grid grid-cols-4 text-[10px] font-bold text-slate-400 pt-1 text-center">
                <span className={meta.progress >= 25 ? 'text-emerald-700 font-black' : ''}>1. Registered</span>
                <span className={meta.progress >= 50 ? 'text-emerald-700 font-black' : ''}>2. Identity OTP</span>
                <span className={meta.progress >= 75 ? 'text-emerald-700 font-black' : ''}>3. Role Verified</span>
                <span className={meta.progress >= 100 ? 'text-emerald-700 font-black' : ''}>4. Fully Verified 🛡️</span>
              </div>
            </div>

            {/* Verified Compliance Badges Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Two-Factor OTP Identity</span>
                  <span className="text-[10px] text-slate-500 font-medium">Mobile &amp; Email Authenticated</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Farmland Cadastre &amp; Snaps</span>
                  <span className="text-[10px] text-slate-500 font-medium">{profile.landPhotos?.length || 1} Geotagged Plots on Map</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Bank Account Settlement</span>
                  <span className="text-[10px] text-slate-500 font-medium">State Bank of India (IFSC Valid)</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-800 block">DPDP Act 2023 Digital Consent</span>
                  <span className="text-[10px] text-slate-500 font-medium">Data Privacy &amp; KYC Stamped</span>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* SECTION 1: Manual Personal Data Entry & Edit Form */}
      {isEditingPersonal && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-emerald-200/80 space-y-4 animate-in slide-in-from-top-2">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
                <Edit3 className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                Manual Personal Data Entry
              </h3>
            </div>
            <span className="text-[11px] font-bold text-slate-400">All fields editable</span>
          </div>

          <form onSubmit={handleSavePersonalInfo} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* First Name */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="e.g. Ravi"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Second Name */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Second Name (Last Name) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={secondName}
                  onChange={(e) => setSecondName(e.target.value)}
                  placeholder="e.g. Kumar"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Email Address */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="farmer.ravi@agriveda.io"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Location */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Farm Location / Village
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Vellore, Tamil Nadu, India"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Primary Crop */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Primary Crop
                </label>
                <input
                  type="text"
                  value={primaryCrop}
                  onChange={(e) => setPrimaryCrop(e.target.value)}
                  placeholder="e.g. Tomato / Paddy"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Farm Size */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Cultivable Farm Size (Acres)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={farmSize}
                  onChange={(e) => setFarmSize(Number(e.target.value))}
                  placeholder="2.5"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Soil Type */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Soil Profile / Type
                </label>
                <input
                  type="text"
                  value={soilType}
                  onChange={(e) => setSoilType(e.target.value)}
                  placeholder="e.g. Red Loamy Soil / Clay"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsEditingPersonal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Personal Data</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SECTION 2: Snapchat-Style Land Photos with Real Camera Access & Map Affiliation */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-amber-100 text-amber-800 rounded-xl">
                <Camera className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                Geotagged Land Photos &amp; Map Affiliation
              </h3>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Snap real-time land photos like Snapchat with live GPS coordinates linked to the Interactive Map
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenLiveCamera}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-black text-xs rounded-xl flex items-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <Camera className="w-4 h-4 text-slate-950" />
              <span>📸 Snap Land Photo</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
              title="Upload from Device Gallery"
            >
              <Upload className="w-4 h-4" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>
        </div>

        {/* Live Snapchat-Style Camera Viewfinder Modal */}
        {isCameraOpen && (
          <div className="relative bg-slate-950 rounded-3xl overflow-hidden border-2 border-amber-400/80 shadow-2xl p-4 space-y-4 animate-in zoom-in-95">
            {/* Camera Viewfinder Header */}
            <div className="flex items-center justify-between text-white pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                <span className="text-xs font-black uppercase tracking-wider text-amber-400">
                  {capturedPhotoUrl ? 'Snap Preview & Geotag Details' : 'Live Camera Viewfinder'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {!capturedPhotoUrl && (
                  <button
                    onClick={toggleCameraFacing}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs flex items-center gap-1 border border-slate-700"
                    title="Flip Camera"
                  >
                    <SwitchCamera className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={stopCamera}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Viewfinder Frame */}
            <div className="relative aspect-video sm:aspect-4/3 w-full bg-black rounded-2xl overflow-hidden flex items-center justify-center border border-slate-800">
              {shutterFlash && (
                <div className="absolute inset-0 bg-white z-40 animate-out fade-out duration-200" />
              )}

              {capturedPhotoUrl ? (
                <img
                  src={capturedPhotoUrl}
                  alt="Captured Land Snap"
                  className="w-full h-full object-cover"
                />
              ) : (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
              )}

              {/* Snapchat-Style Geotag Overlay Banner */}
              <div className="absolute bottom-3 left-3 right-3 bg-slate-950/80 backdrop-blur-md p-2.5 rounded-xl border border-slate-700/80 text-white text-[11px] flex items-center justify-between z-20">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <span className="font-black text-emerald-300 block">{location.split(',')[0]} Plot</span>
                    <span className="font-mono text-[9px] text-slate-400">
                      GPS: {currentGpsCoords[1].toFixed(4)}°N, {currentGpsCoords[0].toFixed(4)}°E
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-800">
                  {primaryCrop}
                </span>
              </div>

              {/* Live Viewfinder Center Shutter Button (When stream is active) */}
              {!capturedPhotoUrl && (
                <div className="absolute bottom-16 inset-x-0 flex items-center justify-center z-30 pointer-events-auto">
                  <button
                    onClick={handleSnapPhoto}
                    className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md p-1 border-4 border-amber-400 shadow-2xl hover:scale-105 active:scale-90 transition-transform flex items-center justify-center cursor-pointer"
                    title="Take Snap"
                  >
                    <div className="w-12 h-12 rounded-full bg-amber-400 shadow-inner" />
                  </button>
                </div>
              )}
            </div>

            {/* Land Details Form for Captured Snap */}
            {capturedPhotoUrl && (
              <div className="space-y-3 bg-slate-900 p-4 rounded-2xl border border-slate-800 text-white animate-in fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">
                      Farmland Parcel Title
                    </label>
                    <input
                      type="text"
                      value={parcelTitle}
                      onChange={(e) => setParcelTitle(e.target.value)}
                      placeholder="e.g. North Plot - Tomato Furrow"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">
                      Field Notes &amp; Soil Condition
                    </label>
                    <input
                      type="text"
                      value={parcelNotes}
                      onChange={(e) => setParcelNotes(e.target.value)}
                      placeholder="e.g. Moist loamy soil, drip irrigation checked"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => {
                      setCapturedPhotoUrl(null);
                      startCamera(cameraFacing);
                    }}
                    className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Retake Snap
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveLandPhoto}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-xl flex items-center gap-2 shadow-lg cursor-pointer active:scale-95 transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Affiliate &amp; Pin to Map</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Gallery of Affiliated Land Photos */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-slate-700">
              Affiliated Farmland Photo Snaps ({profile.landPhotos?.length || 0})
            </span>
            <span className="text-[11px] text-slate-400 font-medium">Click "View on Map" to focus parcel</span>
          </div>

          {(!profile.landPhotos || profile.landPhotos.length === 0) ? (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 space-y-2">
              <Camera className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-xs font-bold text-slate-700">No Land Photos Captured Yet</p>
              <p className="text-[11px] text-slate-500">
                Click "Snap Land Photo" above to take a Snapchat-style geotagged photo of your farm parcel!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {profile.landPhotos.map((photo) => (
                <div
                  key={photo.id}
                  className="bg-slate-50 rounded-2xl p-3 border border-slate-200 hover:border-emerald-300 transition-all flex flex-col justify-between space-y-2.5 shadow-2xs group"
                >
                  <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-200">
                    <img
                      src={photo.imageUrl}
                      alt={photo.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-md text-white text-[9px] font-black flex items-center gap-1">
                      <MapPin className="w-2.5 h-2.5 text-emerald-400" />
                      <span>{photo.coords[1].toFixed(4)}°N, {photo.coords[0].toFixed(4)}°E</span>
                    </div>

                    <button
                      onClick={() => handleDeleteLandPhoto(photo.id)}
                      className="absolute top-2 right-2 p-1.5 rounded-md bg-rose-600/90 text-white hover:bg-rose-700 shadow-md transition-colors"
                      title="Delete Photo"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>

                  <div>
                    <h4 className="text-xs font-black text-slate-900">{photo.title}</h4>
                    {photo.notes && (
                      <p className="text-[11px] text-slate-600 font-medium line-clamp-2 mt-0.5">
                        {photo.notes}
                      </p>
                    )}
                    <span className="text-[9px] text-slate-400 font-mono block mt-1">
                      Snapped: {photo.timestamp} • {photo.cropType || profile.primaryCrop}
                    </span>
                  </div>

                  <button
                    onClick={() => handleViewPhotoOnMap(photo)}
                    className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-95 cursor-pointer"
                  >
                    <Navigation className="w-3.5 h-3.5 text-emerald-200" />
                    <span>🗺️ View &amp; Locate on Map</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* SECTION 3: Diagnosis History & Saved Reports */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-emerald-600" />
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">{t.diagnosisHistory}</h3>
          </div>
          <span className="text-xs font-bold text-slate-400">
            {savedReports.length > 0 ? `${savedReports.length} Reports` : 'Sample Report'}
          </span>
        </div>

        <div className="space-y-2">
          {(savedReports.length > 0 ? savedReports : [
            {
              id: 'hist-1',
              timestamp: '30 Jul 2024',
              cropType: 'Tomato',
              soilType: 'Red Soil',
              location: profile.location,
              imageUrl: sampleCropImages[0].url,
              detectedIssue: sampleCropImages[0].issue,
              confidence: 94,
              riskLevel: sampleCropImages[0].riskLevel,
              farmHealthScore: sampleCropImages[0].healthScore,
              cause: sampleCropImages[0].cause,
              treatment: sampleCropImages[0].treatment,
              prevention: sampleCropImages[0].prevention,
              fertilizerSuggestion: sampleCropImages[0].fertilizer
            }
          ]).map((report) => (
            <div
              key={report.id}
              className="p-3 bg-slate-50 hover:bg-slate-100/80 rounded-2xl border border-slate-200 transition-colors flex items-center justify-between gap-2"
            >
              <div
                onClick={() => {
                  onSelectReport(report);
                  setActiveTab('scan');
                }}
                className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
              >
                <img
                  src={report.imageUrl}
                  alt={report.detectedIssue}
                  className="w-11 h-11 rounded-xl object-cover shrink-0 border border-slate-200"
                />
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 truncate">{report.detectedIssue}</h4>
                  <p className="text-[10px] text-slate-500 font-medium">
                    {report.cropType} • {report.timestamp}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    generateCropReportPDF(report, profile);
                  }}
                  className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-[10px] font-bold flex items-center gap-1 shadow-2xs transition-colors"
                  title="Export PDF"
                >
                  <FileDown className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Export PDF</span>
                </button>

                <button
                  onClick={() => {
                    onSelectReport(report);
                    setActiveTab('scan');
                  }}
                  className="p-1.5 text-slate-400 hover:text-slate-700"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 4: Settings & Language Preferences */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5 border-b border-slate-100 pb-2">
          <Settings className="w-4 h-4 text-slate-600" /> App Settings
        </h3>

        <div className="flex items-center justify-between py-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-bold text-slate-800">{t.language}</span>
          </div>

          <select
            value={profile.language}
            onChange={handleLanguageChange}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-slate-50 focus:outline-none"
          >
            <option value="en">English</option>
            <option value="ta">தமிழ் (Tamil)</option>
            <option value="hi">हिंदी (Hindi)</option>
            <option value="te">తెలుగు (Telugu)</option>
          </select>
        </div>

        <button
          onClick={() => {
            if (onOpenSignOutConfirm) {
              onOpenSignOutConfirm();
            } else {
              logout();
            }
          }}
          className="w-full py-2.5 px-4 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl border border-rose-200 flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4 text-rose-600" />
          <span>{t.logout}</span>
        </button>
      </div>

    </div>
  );
};
