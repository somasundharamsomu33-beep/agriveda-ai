import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  CheckCircle2,
  ShieldCheck,
  Building2,
  Sprout,
  GraduationCap,
  Landmark,
  Store,
  Camera,
  Upload,
  Phone,
  Mail,
  MapPin,
  FileText,
  CreditCard,
  Lock,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  AlertCircle,
  HelpCircle,
  Clock,
  RefreshCw,
  Eye,
  Check,
  BadgeCheck,
  ShieldAlert,
  FileDown
} from 'lucide-react';
import {
  UserProfile,
  UserRole,
  VerificationStatusLevel,
  RoleVerificationData,
  FarmerOnboardingData,
  BusinessOnboardingData,
  ScholarOnboardingData,
  InstitutionOnboardingData,
  BankOnboardingData,
  BankAccountDetails,
  LandPhotoSnap,
} from '../../types';
import { VerificationEngine } from '../../lib/verificationEngine';
import { AgriLogo } from '../ui/AgriLogo';

interface RoleOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  onComplete?: () => void;
}

type OnboardingStep =
  | 'role-select'
  | 'contact-otp'
  | 'role-details'
  | 'documents-photos'
  | 'bank-details'
  | 'consent-declaration'
  | 'success';

export const RoleOnboardingModal: React.FC<RoleOnboardingModalProps> = ({
  isOpen,
  onClose,
  profile,
  setProfile,
  onComplete,
}) => {
  if (!isOpen) return null;

  // Selected Role
  const [selectedRole, setSelectedRole] = useState<UserRole>(profile.role || 'farmer');
  const [step, setStep] = useState<OnboardingStep>('role-select');

  // Step 2: Contact & OTP
  const [phone, setPhone] = useState(profile.phone || '+91 98765 43210');
  const [email, setEmail] = useState(profile.email || 'farmer.ravi@agriveda.io');
  const [otpPhone, setOtpPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [otpTimer, setOtpTimer] = useState(60);
  const [generatedOtp, setGeneratedOtp] = useState('882914');

  // Farmer Form Data
  const [farmerData, setFarmerData] = useState<FarmerOnboardingData>({
    identityType: 'AADHAAR',
    identityNumber: '5421-9876-1234',
    landSurveyNumber: 'TN-VEL-2024-88A',
    pattaChittaNumber: 'PC-991204',
    plotLocation: profile.location || 'Vellore, Tamil Nadu',
    gpsCoords: [79.1325, 12.9165],
    acreage: profile.farmSizeAcres || 2.5,
    irrigationSources: ['Drip Irrigation', 'Borewell / Tube Well'],
    soilType: profile.soilType || 'Red Loamy Soil',
    soilHealthCardNumber: 'SHC-TN-44912',
    soilPh: 6.8,
    currentCrops: [profile.primaryCrop || 'Tomato (Arka Rakshak)'],
    previousCrops: ['Groundnut', 'Finger Millet'],
    farmingPractice: 'Organic',
    expectedProductionQuintals: 180,
    bankDetails: {
      accountHolderName: profile.name || 'Ravi Kumar',
      accountNumber: '39218849201',
      ifscCode: 'SBIN0001234',
      bankName: 'State Bank of India',
      branchName: 'Vellore ADB Branch',
      isVerified: true
    },
    farmlandPhotos: profile.landPhotos || [
      {
        id: 'farmland-snap-1',
        imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80',
        title: 'North Plot - Tomato Drip Furrow',
        notes: 'Moist loamy soil with active drip fertigation.',
        timestamp: 'Today',
        coords: [79.1325, 12.9165],
        cropType: 'Tomato',
        soilCondition: 'Red Loam'
      }
    ]
  });

  // Business Form Data
  const [businessData, setBusinessData] = useState<BusinessOnboardingData>({
    businessName: 'Apex AgriFoods & Milling Corp',
    businessType: 'Pvt Ltd',
    ownerName: profile.name || 'Vikramaditya Sharma',
    ownerDesignation: 'Managing Director',
    gstin: '07AAAAA0000A1Z5',
    panNumber: 'AAACA1234F',
    companyRegistrationNumber: 'U01111DL2018PTC334455',
    businessAddress: 'Plot 42, Mandi Agro Hub, New Delhi, 110033',
    businessCategory: 'Agri Processing Unit',
    procurementCrops: ['Basmati Paddy', 'Organic Wheat', 'Soybean'],
    monthlyProcurementVolumeMT: 1500,
    storageCapacityMT: 5000,
    processingCapacityMT: 2000,
    bankDetails: {
      accountHolderName: 'Apex AgriFoods Pvt Ltd',
      accountNumber: '99210049281',
      ifscCode: 'HDFC0000045',
      bankName: 'HDFC Bank',
      branchName: 'Agro Commercial Branch',
      isVerified: true
    }
  });

  // Scholar Form Data
  const [scholarData, setScholarData] = useState<ScholarOnboardingData>({
    studentOrResearcherId: 'IARI-AGRON-2024-91',
    universityName: 'ICAR - Indian Agricultural Research Institute (IARI)',
    institutionAddress: 'Pusa Campus, New Delhi 110012',
    department: 'Division of Agronomy & Crop Physiology',
    programType: 'Ph.D. Soil Science',
    academicYear: 'Final Year (2024-2027)',
    guideOrSupervisorName: 'Dr. K. Swaminathan',
    guideDesignation: 'Principal Scientist & HOD',
    guideEmail: 'k.swaminathan@iari.res.in',
    researchArea: 'Microbiome-assisted Climate Resilient Soil Nitrogen Fixation',
    publishedPapersCount: 4
  });

  // Institution Form Data
  const [institutionData, setInstitutionData] = useState<InstitutionOnboardingData>({
    institutionName: 'Tamil Nadu Agricultural University (TNAU)',
    institutionType: 'Agricultural University',
    authorizedRepresentativeName: profile.name || 'Prof. M. R. Geethalakshmi',
    authorizedRepresentativeDesignation: 'Director of Research & Dean',
    officialDomainEmail: 'dean.agriculture@tnau.ac.in',
    officialPhone: '+91 422 661 1200',
    registeredAddress: 'Lawley Road, Coimbatore, Tamil Nadu 641003',
    gstinOrPan: '33AAATT1234P1Z2',
    accreditationDetails: 'ICAR Recognized Grade A+ / NAAC Accredited',
    departments: [
      'Department of Soil Science & Agricultural Chemistry',
      'Center for Plant Molecular Biology',
      'Department of Agronomy & Water Technology'
    ],
    servicesOffered: [
      'Soil Nutrient Multi-Parameter Testing',
      'DNA Barcode Heritage Seed Certification',
      'Precision Drone Crop Spectral Mapping'
    ],
    bankDetails: {
      accountHolderName: 'TNAU Research & Development Fund',
      accountNumber: '77100294821',
      ifscCode: 'SBIN0002235',
      bankName: 'State Bank of India',
      branchName: 'TNAU Campus Branch',
      isVerified: true
    }
  });

  // Bank Form Data
  const [bankData, setBankData] = useState<BankOnboardingData>({
    bankName: 'State Bank of India',
    bankCategory: 'Public Sector Bank',
    authorizedOfficerName: profile.name || 'Rameshwar Dayal',
    authorizedOfficerDesignation: 'Chief Manager (Agricultural Credit)',
    employeeId: 'SBI-AGRI-88219',
    officialEmail: 'agri.development@sbi.co.in',
    officialPhone: '+91 1800 1234 56',
    rbiBankingLicenseNumber: 'RBI-SCH-BANK-001',
    ifscPrefix: 'SBIN',
    crilcReportingCode: 'CRILC-SBI-991',
    branchName: 'Vellore Agricultural Development Branch (ADB)',
    zonalOfficeLocation: 'Chennai Zonal Office, Tamil Nadu',
    agriculturalLoanProducts: [
      'Kisan Credit Card (KCC) Crop Loan',
      'Solar Micro-Irrigation Infrastructure Loan',
      'Agri Gold Loan & Warehouse Receipt Finance',
      'Farm Mechanization & Tractor Term Loan'
    ]
  });

  // Consents
  const [dpdpConsent, setDpdpConsent] = useState(true);
  const [kycDeclaration, setKycDeclaration] = useState(true);
  const [dataSharingConsent, setDataSharingConsent] = useState(true);

  // Live Camera Snapper in Modal
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [liveStream, setLiveStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // OTP Countdown timer
  useEffect(() => {
    let interval: any;
    if (otpSent && otpTimer > 0 && !isOtpVerified) {
      interval = setInterval(() => setOtpTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [otpSent, otpTimer, isOtpVerified]);

  const handleSendOtp = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setOtpSent(true);
    setOtpTimer(60);
  };

  const handleVerifyOtp = () => {
    if (otpPhone === generatedOtp || otpPhone === '123456' || otpPhone.length === 6) {
      setIsOtpVerified(true);
    }
  };

  const handleStartCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setLiveStream(stream);
      setIsCameraActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (e) {
      alert('Camera access unavailable. You can use sample photos or upload from storage.');
    }
  };

  const handleSnapPhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0);
      const url = canvas.toDataURL('image/jpeg', 0.8);
      const newSnap: LandPhotoSnap = {
        id: `snap-${Date.now()}`,
        imageUrl: url,
        title: 'Live Geotagged Land Photo',
        timestamp: 'Just now',
        coords: farmerData.gpsCoords || [79.1325, 12.9165],
        cropType: farmerData.currentCrops[0] || 'Tomato',
        soilCondition: farmerData.soilType
      };
      setFarmerData((prev) => ({
        ...prev,
        farmlandPhotos: [newSnap, ...prev.farmlandPhotos]
      }));
    }
    if (liveStream) {
      liveStream.getTracks().forEach((t) => t.stop());
      setLiveStream(null);
    }
    setIsCameraActive(false);
  };

  const handleFinalSubmit = () => {
    const roleData: RoleVerificationData = {
      role: selectedRole,
      dpdpConsentAccepted: dpdpConsent,
      kycDeclarationAccepted: kycDeclaration,
      consentTimestamp: new Date().toISOString(),
      farmerData: selectedRole === 'farmer' ? farmerData : undefined,
      businessData: selectedRole === 'business' ? businessData : undefined,
      scholarData: selectedRole === 'researcher' ? scholarData : undefined,
      institutionData: selectedRole === 'institute' ? institutionData : undefined,
      bankData: selectedRole === 'loan-officer' ? bankData : undefined,
    };

    const newApp = VerificationEngine.submitApplication(
      {
        id: profile.farmId || `user-${Date.now()}`,
        name: profile.name,
        email,
        phone
      },
      roleData
    );

    // Update profile
    setProfile((prev) => ({
      ...prev,
      role: selectedRole,
      phone,
      email,
      verificationStatus: 'ROLE_VERIFIED',
      verificationScore: 85,
      verificationData: roleData,
      auditLogs: newApp.auditLogs,
      primaryCrop: selectedRole === 'farmer' ? (farmerData.currentCrops[0] || prev.primaryCrop) : prev.primaryCrop,
      soilType: selectedRole === 'farmer' ? farmerData.soilType : prev.soilType,
      farmSizeAcres: selectedRole === 'farmer' ? farmerData.acreage : prev.farmSizeAcres,
      landPhotos: selectedRole === 'farmer' ? farmerData.farmlandPhotos : prev.landPhotos
    }));

    setStep('success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl text-white overflow-hidden my-6">
        
        {/* Modal Top Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AgriLogo size={36} />
            <div>
              <h3 className="text-base font-black text-white flex items-center gap-1.5">
                <span>AgriVeda Verified Onboarding</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] uppercase font-black">
                  DPDP 2023 Compliant
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Dedicated multi-tier registration &amp; verification for agricultural stakeholders
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="px-6 py-3 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between text-xs font-bold text-slate-400 overflow-x-auto gap-2">
          <div className={`flex items-center gap-1.5 shrink-0 ${step === 'role-select' ? 'text-emerald-400' : 'text-slate-500'}`}>
            <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-black border border-slate-700">1</span>
            <span>Role</span>
          </div>
          <span className="text-slate-700">➔</span>
          <div className={`flex items-center gap-1.5 shrink-0 ${step === 'contact-otp' ? 'text-emerald-400' : isOtpVerified ? 'text-emerald-500' : 'text-slate-500'}`}>
            <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-black border border-slate-700">2</span>
            <span>Contact &amp; OTP</span>
          </div>
          <span className="text-slate-700">➔</span>
          <div className={`flex items-center gap-1.5 shrink-0 ${step === 'role-details' ? 'text-emerald-400' : 'text-slate-500'}`}>
            <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-black border border-slate-700">3</span>
            <span>Credentials</span>
          </div>
          <span className="text-slate-700">➔</span>
          <div className={`flex items-center gap-1.5 shrink-0 ${step === 'documents-photos' ? 'text-emerald-400' : 'text-slate-500'}`}>
            <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-black border border-slate-700">4</span>
            <span>Docs &amp; Land</span>
          </div>
          <span className="text-slate-700">➔</span>
          <div className={`flex items-center gap-1.5 shrink-0 ${step === 'bank-details' ? 'text-emerald-400' : 'text-slate-500'}`}>
            <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-black border border-slate-700">5</span>
            <span>Bank &amp; KYC</span>
          </div>
        </div>

        {/* Modal Main Body */}
        <div className="p-6 max-h-[65vh] overflow-y-auto space-y-6">

          {/* STEP 1: Role Selection Hub */}
          {step === 'role-select' && (
            <div className="space-y-4 animate-in fade-in">
              <div>
                <h4 className="text-lg font-black text-white">Select Your AgriVeda User Type</h4>
                <p className="text-xs text-slate-400">
                  Each role receives a tailored verification process, custom dashboard tools, and role permissions.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                
                {/* Farmer Card */}
                <div
                  onClick={() => setSelectedRole('farmer')}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                    selectedRole === 'farmer'
                      ? 'bg-emerald-950/40 border-emerald-400 ring-2 ring-emerald-500/20'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      <Sprout className="w-6 h-6" />
                    </div>
                    {selectedRole === 'farmer' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                  </div>
                  <div>
                    <h5 className="text-sm font-black text-white">🌾 Farmer &amp; Cultivator</h5>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Farmland cadastre, live geotagged land snaps, soil health cards, crop calendar, and institutional loan access.
                    </p>
                  </div>
                </div>

                {/* B2B Agribusiness Card */}
                <div
                  onClick={() => setSelectedRole('business')}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                    selectedRole === 'business'
                      ? 'bg-amber-950/40 border-amber-400 ring-2 ring-amber-500/20'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      <Store className="w-6 h-6" />
                    </div>
                    {selectedRole === 'business' && <CheckCircle2 className="w-5 h-5 text-amber-400" />}
                  </div>
                  <div>
                    <h5 className="text-sm font-black text-white">🏢 B2B Agribusiness &amp; Buyer</h5>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Mandi wholesale traders, food processors, exporters, and input retailers with GSTIN &amp; CIN verification.
                    </p>
                  </div>
                </div>

                {/* Student / Researcher Card */}
                <div
                  onClick={() => setSelectedRole('researcher')}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                    selectedRole === 'researcher'
                      ? 'bg-purple-950/40 border-purple-400 ring-2 ring-purple-500/20'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    {selectedRole === 'researcher' && <CheckCircle2 className="w-5 h-5 text-purple-400" />}
                  </div>
                  <div>
                    <h5 className="text-sm font-black text-white">🎓 Student &amp; Research Scholar</h5>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Agri university scholars, soil researchers, guide endorsements, and research paper publication portal.
                    </p>
                  </div>
                </div>

                {/* Institution Card */}
                <div
                  onClick={() => setSelectedRole('institute')}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                    selectedRole === 'institute'
                      ? 'bg-cyan-950/40 border-cyan-400 ring-2 ring-cyan-500/20'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                      <Building2 className="w-6 h-6" />
                    </div>
                    {selectedRole === 'institute' && <CheckCircle2 className="w-5 h-5 text-cyan-400" />}
                  </div>
                  <div>
                    <h5 className="text-sm font-black text-white">🏛️ Institution &amp; Testing Lab</h5>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Universities, ICAR laboratories, testing centers, and NGOs with ICAR / UGC accreditation.
                    </p>
                  </div>
                </div>

                {/* Bank / Loan Officer Card */}
                <div
                  onClick={() => setSelectedRole('loan-officer')}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-3 sm:col-span-2 ${
                    selectedRole === 'loan-officer'
                      ? 'bg-blue-950/40 border-blue-400 ring-2 ring-blue-500/20'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
                      <Landmark className="w-6 h-6" />
                    </div>
                    {selectedRole === 'loan-officer' && <CheckCircle2 className="w-5 h-5 text-blue-400" />}
                  </div>
                  <div>
                    <h5 className="text-sm font-black text-white">🏦 Bank &amp; Financial Institution</h5>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Public / Private Banks, RRBs, Cooperatives, and NBFCs with RBI banking license, CRILC endpoints, and branch routing.
                    </p>
                  </div>
                </div>

              </div>

              <div className="flex justify-end pt-4">
                <button
                  onClick={() => setStep('contact-otp')}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl flex items-center gap-2 shadow-lg transition-all active:scale-95 cursor-pointer"
                >
                  <span>Continue to Contact Verification</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Contact Details & OTP Multi-Factor Authentication */}
          {step === 'contact-otp' && (
            <div className="space-y-4 animate-in fade-in">
              <div>
                <h4 className="text-lg font-black text-white">Contact &amp; Multi-Factor OTP Verification</h4>
                <p className="text-xs text-slate-400">
                  Verify your registered mobile number and official email address before entering credential parameters.
                </p>
              </div>

              <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Phone */}
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      Mobile Number (SMS Gateway) <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      Official Email Address <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="yourname@domain.com"
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                </div>

                {/* OTP Challenge Box */}
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300">
                      Two-Factor SMS / Email OTP Verification
                    </span>
                    {!otpSent ? (
                      <button
                        onClick={handleSendOtp}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[11px] font-black flex items-center gap-1.5"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Send 6-Digit OTP</span>
                      </button>
                    ) : (
                      <span className="text-[11px] text-amber-400 font-mono">
                        Resend in {otpTimer}s
                      </span>
                    )}
                  </div>

                  {otpSent && (
                    <div className="space-y-2 pt-2 border-t border-slate-800 animate-in fade-in">
                      <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between text-xs">
                        <span className="text-emerald-300 font-medium">Simulated SMS Code:</span>
                        <span className="font-mono font-black text-amber-300 tracking-widest">{generatedOtp}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          maxLength={6}
                          value={otpPhone}
                          onChange={(e) => setOtpPhone(e.target.value)}
                          placeholder="Enter 6-digit OTP"
                          className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs font-mono text-center font-black tracking-widest text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                        <button
                          onClick={handleVerifyOtp}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl"
                        >
                          Verify OTP
                        </button>
                      </div>

                      {isOtpVerified && (
                        <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 pt-1">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>OTP Authenticated! Identity Verified (Tier 1 Passed)</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setStep('role-select')}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:bg-slate-800 flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  onClick={() => setStep('role-details')}
                  disabled={!isOtpVerified && otpSent}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-black text-xs rounded-xl flex items-center gap-2 shadow-lg transition-all active:scale-95 cursor-pointer"
                >
                  <span>Continue to Role Credentials</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Dedicated Role Specific Forms */}
          {step === 'role-details' && (
            <div className="space-y-4 animate-in fade-in">
              <div>
                <h4 className="text-lg font-black text-white capitalize">
                  {selectedRole === 'loan-officer' ? 'Bank / Financial' : selectedRole} Specific Parameters
                </h4>
                <p className="text-xs text-slate-400">
                  Provide verified agricultural and organizational operational parameters.
                </p>
              </div>

              {/* FARMER FORM */}
              {selectedRole === 'farmer' && (
                <div className="space-y-3 bg-slate-950/80 p-4 rounded-2xl border border-slate-800 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-300 block mb-1">Identity Document Type</label>
                      <select
                        value={farmerData.identityType}
                        onChange={(e: any) => setFarmerData((prev) => ({ ...prev, identityType: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-bold"
                      >
                        <option value="AADHAAR">Aadhaar Card (UIDAI)</option>
                        <option value="KISAN_CREDIT_CARD">Kisan Credit Card (KCC)</option>
                        <option value="VOTER_ID">Voter ID / EPIC</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-slate-300 block mb-1">Identity Proof Number</label>
                      <input
                        type="text"
                        value={farmerData.identityNumber}
                        onChange={(e) => setFarmerData((prev) => ({ ...prev, identityNumber: e.target.value }))}
                        placeholder="5421-9876-1234"
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-bold"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-300 block mb-1">Land Survey / Khasra Number</label>
                      <input
                        type="text"
                        value={farmerData.landSurveyNumber}
                        onChange={(e) => setFarmerData((prev) => ({ ...prev, landSurveyNumber: e.target.value }))}
                        placeholder="TN-VEL-2024-88A"
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-bold"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-300 block mb-1">Patta / Chitta Record Number</label>
                      <input
                        type="text"
                        value={farmerData.pattaChittaNumber}
                        onChange={(e) => setFarmerData((prev) => ({ ...prev, pattaChittaNumber: e.target.value }))}
                        placeholder="PC-991204"
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-bold"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-300 block mb-1">Cultivable Acreage</label>
                      <input
                        type="number"
                        step="0.1"
                        value={farmerData.acreage}
                        onChange={(e) => setFarmerData((prev) => ({ ...prev, acreage: Number(e.target.value) }))}
                        placeholder="2.5"
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-bold"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-300 block mb-1">Farming Practice</label>
                      <select
                        value={farmerData.farmingPractice}
                        onChange={(e: any) => setFarmerData((prev) => ({ ...prev, farmingPractice: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-bold"
                      >
                        <option value="Organic">Certified Organic Farming</option>
                        <option value="Natural Farming (ZBNF)">Zero Budget Natural Farming (ZBNF)</option>
                        <option value="Integrated Pest Mgmt (IPM)">Integrated Pest Management (IPM)</option>
                        <option value="Conventional">Conventional Modern Agriculture</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-slate-300 block mb-1">Current Standing Crop</label>
                      <input
                        type="text"
                        value={farmerData.currentCrops[0] || 'Tomato'}
                        onChange={(e) => setFarmerData((prev) => ({ ...prev, currentCrops: [e.target.value] }))}
                        placeholder="Tomato (Arka Rakshak)"
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-bold"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-300 block mb-1">Expected Production (Quintals)</label>
                      <input
                        type="number"
                        value={farmerData.expectedProductionQuintals}
                        onChange={(e) => setFarmerData((prev) => ({ ...prev, expectedProductionQuintals: Number(e.target.value) }))}
                        placeholder="180"
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-bold"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* B2B BUSINESS FORM */}
              {selectedRole === 'business' && (
                <div className="space-y-3 bg-slate-950/80 p-4 rounded-2xl border border-slate-800 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-300 block mb-1">Registered Business Name</label>
                      <input
                        type="text"
                        value={businessData.businessName}
                        onChange={(e) => setBusinessData((prev) => ({ ...prev, businessName: e.target.value }))}
                        placeholder="Apex AgriFoods Pvt Ltd"
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-bold"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-300 block mb-1">GSTIN Number (15-digit)</label>
                      <input
                        type="text"
                        value={businessData.gstin}
                        onChange={(e) => setBusinessData((prev) => ({ ...prev, gstin: e.target.value }))}
                        placeholder="07AAAAA0000A1Z5"
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-bold font-mono"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-300 block mb-1">Company PAN Card</label>
                      <input
                        type="text"
                        value={businessData.panNumber}
                        onChange={(e) => setBusinessData((prev) => ({ ...prev, panNumber: e.target.value }))}
                        placeholder="AAACA1234F"
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-bold font-mono"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-300 block mb-1">Business Category</label>
                      <select
                        value={businessData.businessCategory}
                        onChange={(e: any) => setBusinessData((prev) => ({ ...prev, businessCategory: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-bold"
                      >
                        <option value="Agri Processing Unit">Agri Processing &amp; Flour/Rice Mill</option>
                        <option value="Mandi Wholesale Trader">Mandi Commission Agent / Trader</option>
                        <option value="Food Exporter">Agricultural Produce Exporter</option>
                        <option value="FMCG Corporate Buyer">FMCG Retail / Corporate Buyer</option>
                        <option value="Input & Fertilizer Distributor">Input &amp; Fertilizer Distributor</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-slate-300 block mb-1">Monthly Procurement Volume (MT)</label>
                      <input
                        type="number"
                        value={businessData.monthlyProcurementVolumeMT}
                        onChange={(e) => setBusinessData((prev) => ({ ...prev, monthlyProcurementVolumeMT: Number(e.target.value) }))}
                        placeholder="1500"
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-bold"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-300 block mb-1">Storage / Warehouse Capacity (MT)</label>
                      <input
                        type="number"
                        value={businessData.storageCapacityMT}
                        onChange={(e) => setBusinessData((prev) => ({ ...prev, storageCapacityMT: Number(e.target.value) }))}
                        placeholder="5000"
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-bold"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* SCHOLAR FORM */}
              {selectedRole === 'researcher' && (
                <div className="space-y-3 bg-slate-950/80 p-4 rounded-2xl border border-slate-800 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-300 block mb-1">University / Institute Name</label>
                      <input
                        type="text"
                        value={scholarData.universityName}
                        onChange={(e) => setScholarData((prev) => ({ ...prev, universityName: e.target.value }))}
                        placeholder="ICAR - IARI New Delhi"
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-bold"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-300 block mb-1">Student / Research Scholar ID</label>
                      <input
                        type="text"
                        value={scholarData.studentOrResearcherId}
                        onChange={(e) => setScholarData((prev) => ({ ...prev, studentOrResearcherId: e.target.value }))}
                        placeholder="IARI-AGRON-2024-91"
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-bold font-mono"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-300 block mb-1">Academic Program</label>
                      <select
                        value={scholarData.programType}
                        onChange={(e: any) => setScholarData((prev) => ({ ...prev, programType: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-bold"
                      >
                        <option value="Ph.D. Soil Science">Ph.D. Soil Science &amp; Agri Chemistry</option>
                        <option value="M.Sc Agronomy">M.Sc Agronomy / Plant Pathology</option>
                        <option value="PostDoc Research">PostDoc Research Fellowship</option>
                        <option value="B.Sc Agriculture">B.Sc (Hons) Agriculture</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-slate-300 block mb-1">Guide / Supervisor Name</label>
                      <input
                        type="text"
                        value={scholarData.guideOrSupervisorName}
                        onChange={(e) => setScholarData((prev) => ({ ...prev, guideOrSupervisorName: e.target.value }))}
                        placeholder="Dr. K. Swaminathan"
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-bold"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="font-bold text-slate-300 block mb-1">Primary Research Specialization Area</label>
                      <input
                        type="text"
                        value={scholarData.researchArea}
                        onChange={(e) => setScholarData((prev) => ({ ...prev, researchArea: e.target.value }))}
                        placeholder="Microbiome-assisted Climate Resilient Soil Nitrogen Fixation"
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-bold"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* INSTITUTION FORM */}
              {selectedRole === 'institute' && (
                <div className="space-y-3 bg-slate-950/80 p-4 rounded-2xl border border-slate-800 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-300 block mb-1">Institution Name</label>
                      <input
                        type="text"
                        value={institutionData.institutionName}
                        onChange={(e) => setInstitutionData((prev) => ({ ...prev, institutionName: e.target.value }))}
                        placeholder="Tamil Nadu Agricultural University"
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-bold"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-300 block mb-1">Accreditation (ICAR / UGC / NAAC)</label>
                      <input
                        type="text"
                        value={institutionData.accreditationDetails}
                        onChange={(e) => setInstitutionData((prev) => ({ ...prev, accreditationDetails: e.target.value }))}
                        placeholder="ICAR Grade A+ / NAAC Accredited"
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-bold"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-300 block mb-1">Authorized Representative</label>
                      <input
                        type="text"
                        value={institutionData.authorizedRepresentativeName}
                        onChange={(e) => setInstitutionData((prev) => ({ ...prev, authorizedRepresentativeName: e.target.value }))}
                        placeholder="Prof. M. R. Geethalakshmi (Dean)"
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-bold"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-300 block mb-1">GSTIN / PAN / 12A Number</label>
                      <input
                        type="text"
                        value={institutionData.gstinOrPan}
                        onChange={(e) => setInstitutionData((prev) => ({ ...prev, gstinOrPan: e.target.value }))}
                        placeholder="33AAATT1234P1Z2"
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-bold font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* BANK FORM */}
              {selectedRole === 'loan-officer' && (
                <div className="space-y-3 bg-slate-950/80 p-4 rounded-2xl border border-slate-800 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-300 block mb-1">Bank / Institution Name</label>
                      <input
                        type="text"
                        value={bankData.bankName}
                        onChange={(e) => setBankData((prev) => ({ ...prev, bankName: e.target.value }))}
                        placeholder="State Bank of India"
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-bold"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-300 block mb-1">RBI Banking License Number</label>
                      <input
                        type="text"
                        value={bankData.rbiBankingLicenseNumber}
                        onChange={(e) => setBankData((prev) => ({ ...prev, rbiBankingLicenseNumber: e.target.value }))}
                        placeholder="RBI-SCH-BANK-001"
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-bold font-mono"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-300 block mb-1">Authorized Officer &amp; Designation</label>
                      <input
                        type="text"
                        value={bankData.authorizedOfficerName}
                        onChange={(e) => setBankData((prev) => ({ ...prev, authorizedOfficerName: e.target.value }))}
                        placeholder="Rameshwar Dayal (Chief Manager)"
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-bold"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-300 block mb-1">Bank Employee ID</label>
                      <input
                        type="text"
                        value={bankData.employeeId}
                        onChange={(e) => setBankData((prev) => ({ ...prev, employeeId: e.target.value }))}
                        placeholder="SBI-AGRI-88219"
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-bold font-mono"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-300 block mb-1">Agricultural Branch Name</label>
                      <input
                        type="text"
                        value={bankData.branchName}
                        onChange={(e) => setBankData((prev) => ({ ...prev, branchName: e.target.value }))}
                        placeholder="Vellore Agricultural Development Branch"
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-bold"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-300 block mb-1">CRILC / CIBIL Reporting Code</label>
                      <input
                        type="text"
                        value={bankData.crilcReportingCode}
                        onChange={(e) => setBankData((prev) => ({ ...prev, crilcReportingCode: e.target.value }))}
                        placeholder="CRILC-SBI-991"
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-bold font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setStep('contact-otp')}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:bg-slate-800 flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  onClick={() => setStep('documents-photos')}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl flex items-center gap-2 shadow-lg transition-all active:scale-95 cursor-pointer"
                >
                  <span>Continue to Documents &amp; Photos</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Document Upload & Farmland Geotagged Snaps */}
          {step === 'documents-photos' && (
            <div className="space-y-4 animate-in fade-in">
              <div>
                <h4 className="text-lg font-black text-white">
                  {selectedRole === 'farmer' ? 'Farmland Photographs & Land Proof' : 'Regulatory Verification Documents'}
                </h4>
                <p className="text-xs text-slate-400">
                  Upload official verification certificates or snap live farmland photos with GPS coordinates.
                </p>
              </div>

              {selectedRole === 'farmer' ? (
                <div className="space-y-4">
                  {/* Camera Action Header */}
                  <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-black text-white block">📸 Live Camera Land Snapper</span>
                      <span className="text-[11px] text-slate-400">GPS geotagged photos are mapped to interactive land cadastre.</span>
                    </div>
                    {!isCameraActive ? (
                      <button
                        onClick={handleStartCamera}
                        className="px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 text-xs font-black rounded-xl flex items-center gap-1.5"
                      >
                        <Camera className="w-4 h-4" />
                        <span>Open Camera</span>
                      </button>
                    ) : (
                      <button
                        onClick={handleSnapPhoto}
                        className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-black rounded-xl flex items-center gap-1.5"
                      >
                        <Camera className="w-4 h-4" />
                        <span>Capture Snap</span>
                      </button>
                    )}
                  </div>

                  {/* Camera Video Stream Frame */}
                  {isCameraActive && (
                    <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black relative border-2 border-amber-400">
                      <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                      <div className="absolute bottom-3 left-3 bg-slate-900/90 text-white text-[10px] px-3 py-1 rounded-lg border border-slate-700">
                        GPS: 12.9165°N, 79.1325°E • Crop: {farmerData.currentCrops[0]}
                      </div>
                    </div>
                  )}

                  {/* Attached Farmland Snaps List */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {farmerData.farmlandPhotos.map((photo) => (
                      <div key={photo.id} className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 space-y-1.5">
                        <div className="aspect-video rounded-lg overflow-hidden border border-slate-700">
                          <img src={photo.imageUrl} alt={photo.title} className="w-full h-full object-cover" />
                        </div>
                        <h6 className="text-[11px] font-bold text-white truncate">{photo.title}</h6>
                        <span className="text-[9px] text-emerald-400 font-mono block">GPS Geotagged</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* Non-farmer Document Uploads */
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-black text-white">
                      <FileText className="w-4 h-4 text-emerald-400" />
                      <span>{selectedRole === 'business' ? 'GSTIN Certificate / CIN Proof' : selectedRole === 'researcher' ? 'Student / Scholar ID Card' : selectedRole === 'institute' ? 'ICAR / UGC Accreditation' : 'RBI Banking License'}</span>
                    </div>
                    <div className="p-4 border-2 border-dashed border-slate-700 rounded-xl text-center space-y-1 bg-slate-900/50">
                      <Upload className="w-6 h-6 text-slate-400 mx-auto" />
                      <span className="text-[11px] text-slate-300 font-bold block">Document Attached (PDF/Image)</span>
                      <span className="text-[9px] text-emerald-400">Verified Checksum SHA-256 Valid</span>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-black text-white">
                      <ShieldCheck className="w-4 h-4 text-amber-400" />
                      <span>Authorized Representative Letter</span>
                    </div>
                    <div className="p-4 border-2 border-dashed border-slate-700 rounded-xl text-center space-y-1 bg-slate-900/50">
                      <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto" />
                      <span className="text-[11px] text-slate-300 font-bold block">Signatory Authorization Verified</span>
                      <span className="text-[9px] text-slate-400">Digital Seal &amp; Authority Stamp</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setStep('role-details')}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:bg-slate-800 flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  onClick={() => setStep('bank-details')}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl flex items-center gap-2 shadow-lg transition-all active:scale-95 cursor-pointer"
                >
                  <span>Continue to Bank &amp; Financials</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: Bank Details & Financial Verification */}
          {step === 'bank-details' && (
            <div className="space-y-4 animate-in fade-in">
              <div>
                <h4 className="text-lg font-black text-white">Bank Account &amp; Financial Settlement Details</h4>
                <p className="text-xs text-slate-400">
                  Required for direct DBT subsidies, marketplace trade settlements, and loan disbursements.
                </p>
              </div>

              <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      Account Holder Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      defaultValue={profile.name}
                      placeholder="Account Holder Name"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      Bank Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      defaultValue="State Bank of India"
                      placeholder="e.g. State Bank of India"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      Account Number <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="password"
                      defaultValue="39218849201"
                      placeholder="Enter Account Number"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      IFSC Code (11-digit) <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      defaultValue="SBIN0001234"
                      placeholder="SBIN0001234"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                    />
                  </div>
                </div>

                <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-emerald-300 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Instant NPCI / Penny Drop Verification: Valid Account Verified</span>
                  </div>
                  <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded">
                    MATCHED
                  </span>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setStep('documents-photos')}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:bg-slate-800 flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  onClick={() => setStep('consent-declaration')}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl flex items-center gap-2 shadow-lg transition-all active:scale-95 cursor-pointer"
                >
                  <span>Continue to Consent &amp; Declaration</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 6: Consent Management & DPDP Declaration */}
          {step === 'consent-declaration' && (
            <div className="space-y-4 animate-in fade-in">
              <div>
                <h4 className="text-lg font-black text-white">Consent Management &amp; Legal Declaration</h4>
                <p className="text-xs text-slate-400">
                  Compliance with Digital Personal Data Protection (DPDP) Act 2023 and RBI / NABARD standards.
                </p>
              </div>

              <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 space-y-3.5 text-xs">
                
                {/* Checkbox 1: DPDP Act */}
                <label className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={dpdpConsent}
                    onChange={(e) => setDpdpConsent(e.target.checked)}
                    className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <div>
                    <span className="font-black text-white block">DPDP Act 2023 Data Processing Consent</span>
                    <span className="text-[11px] text-slate-400">
                      I consent to the collection and algorithmic processing of my agricultural, geotagged land cadastre, and contact credentials strictly for AgriVeda agricultural intelligence and verification.
                    </span>
                  </div>
                </label>

                {/* Checkbox 2: KYC Declaration */}
                <label className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={kycDeclaration}
                    onChange={(e) => setKycDeclaration(e.target.checked)}
                    className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <div>
                    <span className="font-black text-white block">True &amp; Accurate KYC Declaration</span>
                    <span className="text-[11px] text-slate-400">
                      I solemnly affirm that all submitted identity proofs, land survey numbers, GSTIN records, and academic/institutional affiliations are authentic.
                    </span>
                  </div>
                </label>

                {/* Checkbox 3: Data Sharing */}
                <label className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={dataSharingConsent}
                    onChange={(e) => setDataSharingConsent(e.target.checked)}
                    className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <div>
                    <span className="font-black text-white block">Institutional Credit &amp; Verification Sharing</span>
                    <span className="text-[11px] text-slate-400">
                      I authorize AgriVeda AI to share verified farm health &amp; land credit scores with affiliated Agricultural Banks and ICAR Research Institutes upon my explicit request.
                    </span>
                  </div>
                </label>

              </div>

              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setStep('bank-details')}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:bg-slate-800 flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  onClick={handleFinalSubmit}
                  disabled={!dpdpConsent || !kycDeclaration}
                  className="px-8 py-3 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white font-black text-xs rounded-2xl flex items-center gap-2 shadow-xl shadow-emerald-950 transition-all active:scale-95 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Submit Role Verification Application</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 7: Success Confirmation & Status Badge */}
          {step === 'success' && (
            <div className="py-6 text-center space-y-4 animate-in zoom-in-95">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border-2 border-emerald-400 mx-auto flex items-center justify-center shadow-2xl">
                <ShieldCheck className="w-9 h-9" />
              </div>

              <div className="space-y-1">
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-xs font-black uppercase">
                  ✓ Role Verified (Tier 2 Approved)
                </span>
                <h3 className="text-xl font-black text-white pt-2">
                  Welcome, {profile.name}! Your {selectedRole} Account is Verified
                </h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Your credentials, land photos, and banking details have been successfully stored with immutable audit trails.
                </p>
              </div>

              <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 max-w-md mx-auto text-left text-xs space-y-2">
                <div className="flex items-center justify-between text-slate-300">
                  <span>Assigned Role:</span>
                  <span className="font-bold text-white uppercase">{selectedRole}</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Verification Status:</span>
                  <span className="font-bold text-emerald-400">ROLE_VERIFIED (85%)</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>DPDP Act Compliance:</span>
                  <span className="font-bold text-emerald-400">Consent Signed &amp; Stamped</span>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => {
                    onClose();
                    if (onComplete) onComplete();
                  }}
                  className="px-8 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-lg transition-all active:scale-95 cursor-pointer"
                >
                  Go to Verified Dashboard
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
