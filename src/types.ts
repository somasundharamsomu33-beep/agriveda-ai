export type Language = 'en' | 'ta' | 'hi' | 'te';
export type AIModelType = 'groq/compound' | 'openai/gpt-oss-120b' | 'gemma2-9b-it' | 'gemini-1.5-flash' | 'gemini-1.5-pro';


export interface LandPhotoSnap {
  id: string;
  imageUrl: string;
  title: string;
  notes?: string;
  timestamp: string;
  coords: [number, number]; // [lng, lat]
  locationName?: string;
  cropType?: string;
  soilCondition?: string;
}

export type VerificationStatusLevel =
  | 'REGISTERED'
  | 'IDENTITY_VERIFIED'
  | 'ROLE_VERIFIED'
  | 'FULLY_VERIFIED'
  | 'PENDING_REVIEW'
  | 'REJECTED'
  | 'ACTION_REQUIRED';

export interface VerificationAuditLog {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  details: string;
  status: VerificationStatusLevel;
}

export interface BankAccountDetails {
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string;
  branchName?: string;
  isVerified?: boolean;
}

export interface FarmerOnboardingData {
  identityType: 'AADHAAR' | 'VOTER_ID' | 'KISAN_CREDIT_CARD';
  identityNumber: string;
  landSurveyNumber: string;
  pattaChittaNumber?: string;
  plotLocation: string;
  gpsCoords?: [number, number];
  acreage: number;
  irrigationSources: ('Drip Irrigation' | 'Canal Water' | 'Borewell / Tube Well' | 'Rainfed' | 'Sprinkler')[];
  soilType: string;
  soilHealthCardNumber?: string;
  soilPh?: number;
  currentCrops: string[];
  previousCrops: string[];
  farmingPractice: 'Organic' | 'Natural Farming (ZBNF)' | 'Conventional' | 'Integrated Pest Mgmt (IPM)';
  expectedProductionQuintals: number;
  bankDetails: BankAccountDetails;
  farmlandPhotos: LandPhotoSnap[];
  identityDocUrl?: string;
  landOwnershipDocUrl?: string;
}

export interface BusinessOnboardingData {
  businessName: string;
  businessType: 'Proprietorship' | 'Partnership' | 'Pvt Ltd' | 'Public Ltd' | 'FPO / Cooperative';
  ownerName: string;
  ownerDesignation: string;
  gstin: string;
  panNumber: string;
  companyRegistrationNumber?: string;
  businessAddress: string;
  businessCategory: 'Mandi Wholesale Trader' | 'Agri Processing Unit' | 'Food Exporter' | 'FMCG Corporate Buyer' | 'Input & Fertilizer Distributor' | 'Agri Equipment Vendor';
  procurementCrops: string[];
  monthlyProcurementVolumeMT: number;
  storageCapacityMT: number;
  processingCapacityMT?: number;
  bankDetails: BankAccountDetails;
  gstCertificateDocUrl?: string;
  panCardDocUrl?: string;
  tradeLicenseDocUrl?: string;
}

export interface ScholarOnboardingData {
  studentOrResearcherId: string;
  universityName: string;
  institutionAddress: string;
  department: string;
  programType: 'B.Sc Agriculture' | 'M.Sc Agronomy' | 'Ph.D. Soil Science' | 'PostDoc Research' | 'Agri Tech Fellowship' | 'Diploma in Agri';
  academicYear: string;
  guideOrSupervisorName: string;
  guideDesignation: string;
  guideEmail: string;
  researchArea: string;
  publishedPapersCount?: number;
  studentIdCardDocUrl?: string;
  enrollmentLetterDocUrl?: string;
}

export interface InstitutionOnboardingData {
  institutionName: string;
  institutionType: 'Agricultural University' | 'Research Laboratory (ICAR/CSIR)' | 'Soil & Seed Testing Lab' | 'Agri NGO / Foundation' | 'Government Extension Department' | 'Krishi Vigyan Kendra (KVK)';
  authorizedRepresentativeName: string;
  authorizedRepresentativeDesignation: string;
  officialDomainEmail: string;
  officialPhone: string;
  registeredAddress: string;
  gstinOrPan: string;
  accreditationDetails: string;
  departments: string[];
  servicesOffered: string[];
  bankDetails: BankAccountDetails;
  accreditationCertificateDocUrl?: string;
  authorizationLetterDocUrl?: string;
}

export interface BankOnboardingData {
  bankName: string;
  bankCategory: 'Public Sector Bank' | 'Private Sector Bank' | 'Regional Rural Bank (RRB)' | 'Cooperative Bank' | 'NBFC / Agri FinTech';
  authorizedOfficerName: string;
  authorizedOfficerDesignation: string;
  employeeId: string;
  officialEmail: string;
  officialPhone: string;
  rbiBankingLicenseNumber: string;
  ifscPrefix: string;
  crilcReportingCode?: string;
  branchName: string;
  zonalOfficeLocation: string;
  agriculturalLoanProducts: string[];
  regulatoryComplianceDocUrl?: string;
  authorizationIdDocUrl?: string;
}

export interface RoleVerificationData {
  role: UserRole;
  farmerData?: FarmerOnboardingData;
  businessData?: BusinessOnboardingData;
  scholarData?: ScholarOnboardingData;
  institutionData?: InstitutionOnboardingData;
  bankData?: BankOnboardingData;
  dpdpConsentAccepted: boolean;
  kycDeclarationAccepted: boolean;
  consentTimestamp: string;
}

export interface VerificationApplication {
  id: string;
  userId: string;
  applicantName: string;
  role: UserRole;
  email: string;
  phone: string;
  status: VerificationStatusLevel;
  submittedAt: string;
  reviewedAt?: string;
  reviewerNotes?: string;
  data: RoleVerificationData;
  auditLogs: VerificationAuditLog[];
}

export interface UserProfile {
  name: string;
  firstName?: string;
  secondName?: string;
  email?: string;
  phone: string;
  location: string;
  farmId: string;
  farmSizeAcres: number;
  primaryCrop: string;
  soilType: string;
  language: Language;
  avatarUrl: string;
  role?: UserRole;
  plan?: 'free' | 'pro';
  verificationStatus?: VerificationStatusLevel;
  verificationScore?: number;
  verificationData?: RoleVerificationData;
  auditLogs?: VerificationAuditLog[];
  cropVariety?: string;
  sowingDate?: string;
  cropAgeDays?: number;
  irrigationMethod?: string;
  seedVariety?: string;
  seedBankName?: string;
  recentCropProblems?: string;
  landPhotos?: LandPhotoSnap[];
}

export type UserRole =
  | 'farmer'
  | 'loan-officer'
  | 'researcher'
  | 'institute'
  | 'vendor'
  | 'retail_vendor'
  | 'wholesale_vendor'
  | 'input_vendor'
  | 'agronomist'
  | 'business'
  | 'student';

export type AgriIntentCategory =
  | 'Crop Management'
  | 'Disease / Pest'
  | 'Soil'
  | 'Fertilizer'
  | 'Irrigation'
  | 'Weather'
  | 'Crop Calendar'
  | 'Seed Information'
  | 'Seed Bank'
  | 'Maps / Geospatial'
  | 'Market / Mandi'
  | 'Agricultural Expert'
  | 'Vendor / Product'
  | 'B2B'
  | 'B2C'
  | 'General Agricultural Question';

export interface SeedBankItem {
  id: string;
  seedVariety: string;
  cropType: string;
  availableQuantityKg: number;
  seedBankLocation: string;
  seedBankName: string;
  storageInformation: string;
  isAvailable: boolean;
  storageCondition: {
    tempCelsius: number;
    humidityPercent: number;
    moisturePercent: number;
  };
  germinationRatePercent: number;
  preservationMethod: string;
  contactPerson: string;
  contactPhone: string;
  image?: string;
  isHeritageVariety?: boolean;
}

export interface MarketplaceProduct {
  id: string;
  name: string;
  category: 'Grains & Millets' | 'Pulses' | 'Vegetables' | 'Fruits' | 'Spices' | 'Dry goods' | 'Fertilizer' | 'Seeds' | 'Equipment';
  seller: string;
  location: string;
  price: number;
  retailPrice?: number;
  unit: string;
  availableQty: number;
  rating: number;
  image: string;
  certified?: boolean;
  subsidy?: string;
  tradeType?: 'b2b' | 'b2c' | 'both';
  minOrderQty?: number;
  harvestDate?: string;
  sellerRole?: 'farmer' | 'vendor' | 'collective';
}

export interface PriceQuote {
  id: string;
  product: string;
  quantity: string;
  buyer: string;
  quotedPrice: number;
  status: 'Open' | 'Responded' | 'Accepted';
}

export interface CropScanInput {
  cropType: string;
  soilType: string;
  farmArea: number;
  location: string;
  imageBase64?: string;
  sampleImageId?: string;
}

export interface CropDiagnosisReport {
  id: string;
  timestamp: string;
  cropType: string;
  soilType: string;
  location: string;
  imageUrl: string;
  detectedIssue: string;
  confidence: number; // percentage, e.g. 92
  riskLevel: 'High' | 'Medium' | 'Low';
  farmHealthScore: number; // e.g. 85
  cause: string;
  treatment: string[];
  prevention: string[];
  fertilizerSuggestion: string;
  aiNotes?: string;
}

export interface WeatherInfo {
  temperature: number; // °C
  condition: string;
  humidity: number; // %
  windSpeed: number; // km/h
  rainChance: number; // %
  location: string;
  soilMoisture?: number; // %
  uvIndex?: number;
  weeklyTrend?: Array<{
    day: string;
    temp: number; // °C
    rainfall: number; // mm
    humidity: number; // %
  }>;
  forecast: Array<{
    day: string;
    temp: number;
    icon: string;
    condition: string;
  }>;
  alerts: Array<{
    id: string;
    title: string;
    description: string;
    severity: 'info' | 'warning' | 'alert';
    action: string;
  }>;
}

export interface MarketPriceItem {
  id: string;
  cropName: string;
  currentPrice: number; // ₹/kg
  priceChange: number; // e.g. +5 or -2
  percentageChange: number; // e.g. +16.6
  unit: string; // kg or quintal
  bestMarket: string;
  regionalMarkets: Array<{
    marketName: string;
    price: number;
    distanceKm: number;
    isBest?: boolean;
  }>;
  priceHistory: Array<{
    date: string;
    price: number;
  }>;
  aiAdvice: string;
}

export interface CalendarEvent {
  id: string;
  dayNumber: number;
  dateStr: string;
  title: string;
  category: 'Sowing' | 'Fertilizer' | 'Irrigation' | 'Inspection' | 'Harvesting';
  description: string;
  completed: boolean;
  recommendedTime?: string;
}

export interface CropCalendar {
  cropName: string;
  sowingDate: string;
  totalDurationDays: number;
  events: CalendarEvent[];
}

export interface VoiceMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  language: Language;
  intentCategory?: AgriIntentCategory;
  audioUrl?: string;
  attachedImage?: string;
  timestamp: string;
  actionCard?: {
    type: 'fertilizer' | 'weather' | 'market' | 'diagnosis' | 'seedbank' | 'crop_calendar';
    title: string;
    data: any;
  };
  suggestedFollowups?: string[];
}

export interface CommunityReply {
  id: string;
  authorName: string;
  authorAvatar?: string;
  authorLocation?: string;
  isExpert: boolean;
  adviceCategory?: string;
  text: string;
  imageUrl?: string;
  timeAgo: string;
  likes: number;
  createdAt?: string;
}

export interface CommunityPost {
  id: string;
  authorName: string;
  authorLocation: string;
  authorAvatar: string;
  timeAgo: string;
  question: string;
  cropContext?: string;
  imageUrl?: string;
  likesCount: number;
  repliesCount: number;
  createdAt?: string;
  replies: CommunityReply[];
}

export type ActiveTab =
  | 'home'
  | 'calendar'
  | 'scan'
  | 'market'
  | 'marketplace'
  | 'assistant'
  | 'weather'
  | 'community'
  | 'maps'
  | 'seedbank'
  | 'profile';
