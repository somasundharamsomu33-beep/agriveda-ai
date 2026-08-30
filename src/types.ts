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
  auditLogs?: VerificationAuditLog[];
}

export interface UserProfile {
  id?: string;
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
  isAuthenticated?: boolean;
  plan?: 'free' | 'pro';
  verificationStatus?: VerificationStatusLevel | VerificationStatus;
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
  createdAt?: string;
  updatedAt?: string;
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
  | 'student'
  | 'research_scholar'
  | 'institution'
  | 'bank'
  | 'financial_institution'
  | 'government'
  | 'buyer'
  | 'fpo'
  | 'admin'
  | 'verifier';

export type OrgType =
  | 'business'
  | 'institution'
  | 'bank'
  | 'government'
  | 'fpo_cooperative';

export type OrgRole =
  | 'owner'
  | 'admin'
  | 'employee'
  | 'researcher'
  | 'faculty'
  | 'student'
  | 'officer'
  | 'viewer';

export type VerificationStatus =
  | 'pending'
  | 'submitted'
  | 'under_review'
  | 'verified'
  | 'rejected'
  | 'expired'
  | 'revoked';

export type VerificationType =
  | 'identity_kyc'
  | 'land_ownership'
  | 'business_gst_pan'
  | 'academic_enrollment'
  | 'institutional_accreditation'
  | 'financial_regulatory'
  | 'government_officer'
  | 'organic_certification'
  | 'fpo_registration';

export type DocumentType =
  | 'aadhaar'
  | 'pan_individual'
  | 'pan_business'
  | 'voter_id'
  | 'passport'
  | 'driving_license'
  | 'land_patta_chitta'
  | 'khasra_khatauni'
  | '7_12_extract'
  | 'sale_deed'
  | 'student_id_card'
  | 'bonafide_certificate'
  | 'enrollment_letter'
  | 'gst_certificate'
  | 'incorporation_certificate'
  | 'fssai_license'
  | 'trade_license'
  | 'bank_statement_cancelled_cheque'
  | 'rbi_license'
  | 'banking_license'
  | 'institutional_affiliation_letter'
  | 'govt_employee_id'
  | 'other';

export type DocumentCategory =
  | 'Identity'
  | 'Land'
  | 'Academic'
  | 'Business_Tax'
  | 'Regulatory'
  | 'Accreditation'
  | 'Financial'
  | 'Other';

export type ConsentType =
  | 'terms_and_conditions'
  | 'privacy_policy'
  | 'aadhaar_kyc_consent'
  | 'credit_bureau_pull_consent'
  | 'data_sharing_with_buyers'
  | 'data_sharing_with_institutions'
  | 'crop_data_research_sharing';

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

// ----------------------------------------------------------------------------
// Role-Specific Profiles
// ----------------------------------------------------------------------------

export interface FarmlandPlot {
  id: string;
  farmerId: string;
  plotName: string;
  surveyNumber?: string;
  khataNumber?: string;
  pattaNumber?: string;
  acreage: number;
  village: string;
  talukTehsil?: string;
  district: string;
  state: string;
  pincode?: string;
  latitude?: number;
  longitude?: number;
  boundaryGeojson?: any;
  soilType?: string;
  soilPh?: number;
  organicMatterPercent?: number;
  irrigationSource?: string;
  ownershipType?: 'owned' | 'leased' | 'shared';
  isActive: boolean;
  createdAt?: string;
}

export interface FarmlandPhoto {
  id: string;
  plotId: string;
  farmerId: string;
  photoUrl: string;
  photoType: 'crop_overview' | 'soil_sample' | 'irrigation_setup' | 'boundary_post' | 'infestation';
  geotagLat?: number;
  geotagLng?: number;
  caption?: string;
  capturedAt: string;
}

export interface FarmerCropHistory {
  id: string;
  farmerId: string;
  plotId?: string;
  cropName: string;
  variety?: string;
  season: 'Kharif' | 'Rabi' | 'Zaid' | 'Perennial';
  cropYear: number;
  sowingDate?: string;
  harvestDate?: string;
  acreage: number;
  actualYieldMetricTons?: number;
  expectedProductionTons?: number;
  marketPriceRealizedPerQuintal?: number;
  notes?: string;
}

export interface FarmerProfile {
  userId: string;
  fatherOrSpouseName?: string;
  gender?: string;
  dob?: string;
  educationLevel?: string;
  primaryLanguage?: string;
  aadhaarMasked?: string;
  pmKisanId?: string;
  soilHealthCardNumber?: string;
  totalLandholdingAcres: number;
  isOrganicCertified: boolean;
  organicCertNumber?: string;
  farmingExperienceYears: number;
  annualIncomeRange?: string;
  preferredMandiId?: string;
  verificationStatus: VerificationStatus;
  plots?: FarmlandPlot[];
  cropHistory?: FarmerCropHistory[];
}

export interface BusinessProfile {
  userId: string;
  organizationId?: string;
  businessName: string;
  tradeName?: string;
  ownerRepresentativeName: string;
  designation?: string;
  contactEmail?: string;
  contactPhone: string;
  gstin?: string;
  pan?: string;
  cin?: string;
  fssaiLicenseNumber?: string;
  businessCategory: string;
  procurementRequirements?: Array<{
    crop: string;
    monthlyDemandTons: number;
    minGrade?: string;
  }>;
  procurementCapacityMonthlyMetricTons?: number;
  annualTurnoverInr?: number;
  operationalRegions?: string[];
  registeredAddress?: string;
  warehouseLocations?: any[];
  creditRating?: string;
  verificationStatus: VerificationStatus;
}

export interface StudentProfile {
  userId: string;
  institutionId?: string;
  studentIdNumber: string;
  universityName: string;
  campusName?: string;
  department: string;
  courseProgram: string;
  currentAcademicYear: number;
  currentSemester?: number;
  admissionYear: number;
  expectedGraduationYear: number;
  guideSupervisorName?: string;
  guideEmail?: string;
  specializationField?: string;
  verificationStatus: VerificationStatus;
}

export interface ResearcherProfile {
  userId: string;
  institutionId?: string;
  researcherIdNumber: string;
  universityInstituteName: string;
  department: string;
  researchArea: string;
  designation?: string;
  guideSupervisorName?: string;
  supervisorEmail?: string;
  activeProjectTitle?: string;
  fundingAgency?: string;
  grantId?: string;
  orchidId?: string;
  publicationsCount: number;
  verificationStatus: VerificationStatus;
}

export interface InstitutionProfile {
  organizationId: string;
  authorizedRepresentativeId?: string;
  institutionType: string;
  officialDomain?: string;
  accreditationBody?: string;
  accreditationGrade?: string;
  accreditationValidUntil?: string;
  departmentsJson?: string[];
  servicesOfferedJson?: string[];
  testingLaboratoriesCount: number;
}

export interface FinancialInstitutionProfile {
  organizationId: string;
  authorizedOfficerId?: string;
  institutionSubtype: string;
  rbiLicenseNumber: string;
  bankingCodeIfscPrefix?: string;
  nodalOfficerName?: string;
  nodalOfficerDesignation?: string;
  nodalOfficerEmployeeId?: string;
  officialContactPhone?: string;
  officialContactEmail?: string;
  supportedCreditSchemes?: string[];
  branchesCount: number;
  headOfficeAddress?: string;
}

export interface GovernmentProfile {
  userId: string;
  organizationId?: string;
  departmentName: string;
  officerDesignation: string;
  employeeIdNumber: string;
  jurisdictionLevel: 'National' | 'State' | 'District' | 'Taluk_Block' | 'Gram_Panchayat';
  jurisdictionState: string;
  jurisdictionDistrict?: string;
  jurisdictionBlock?: string;
  govEmail: string;
  verificationStatus: VerificationStatus;
}

export interface BankAccount {
  id: string;
  userId?: string;
  organizationId?: string;
  accountHolderName: string;
  bankName: string;
  branchName?: string;
  accountNumberMasked: string;
  ifscCode: string;
  accountType: 'savings' | 'current' | 'kcc' | 'fpo_current';
  upiId?: string;
  isPrimary: boolean;
  verificationStatus: VerificationStatus;
  createdAt?: string;
}

// ----------------------------------------------------------------------------
// Organization & RBAC Models
// ----------------------------------------------------------------------------

export interface Organization {
  id: string;
  name: string;
  legalName?: string;
  orgType: OrgType;
  registrationNumber?: string;
  taxIdentifier?: string;
  officialEmail?: string;
  officialPhone?: string;
  website?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  district?: string;
  state?: string;
  postalCode?: string;
  country: string;
  verificationStatus: VerificationStatus;
  logoUrl?: string;
  metadataJson?: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
}

export interface OrganizationMembership {
  id: string;
  organizationId: string;
  userId: string;
  orgRole: OrgRole;
  department?: string;
  designation?: string;
  isActive: boolean;
  joinedAt: string;
  invitedBy?: string;
}

export interface Role {
  id: string;
  name: string;
  code: string;
  description?: string;
  hierarchyLevel: number;
  isSystem: boolean;
}

export interface Permission {
  id: string;
  code: string;
  module: string;
  name: string;
  description?: string;
}

// ----------------------------------------------------------------------------
// Verification & Audit Models
// ----------------------------------------------------------------------------

export interface VerificationRequest {
  id: string;
  userId: string;
  organizationId?: string;
  verificationType: VerificationType;
  targetRole?: string;
  status: VerificationStatus;
  currentStage?: string;
  submissionNotes?: string;
  submittedAt: string;
  reviewerId?: string;
  reviewedAt?: string;
  reviewerNotes?: string;
  rejectionReasonCode?: string;
  rejectionReasonDetails?: string;
  expiresAt?: string;
  documents?: VerificationDocument[];
}

export interface VerificationDocument {
  id: string;
  requestId?: string;
  userId: string;
  organizationId?: string;
  documentType: DocumentType;
  documentCategory: DocumentCategory;
  documentNumberMasked?: string;
  fileStoragePath: string;
  fileNameOriginal?: string;
  fileMimeType?: string;
  fileSizeBytes?: number;
  fileSha256Checksum?: string;
  isEncrypted: boolean;
  issueDate?: string;
  expiryDate?: string;
  issuingAuthority?: string;
  verificationStatus: VerificationStatus;
  verifiedBy?: string;
  verificationNotes?: string;
  verifiedAt?: string;
  createdAt?: string;
}

export interface UserConsent {
  id: string;
  userId: string;
  consentType: ConsentType;
  version: string;
  isGranted: boolean;
  ipAddress?: string;
  userAgent?: string;
  grantedAt: string;
  revokedAt?: string;
}

export interface AuditLog {
  id: string;
  userId?: string;
  organizationId?: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  changesJson?: any;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

// ----------------------------------------------------------------------------
// Existing Marketplace, Diagnosis & Community Interfaces
// ----------------------------------------------------------------------------

// ----------------------------------------------------------------------------
// MAPCN (Mandi & APMC Price Commodity Network) Models
// ----------------------------------------------------------------------------

export interface MAPCNMandiCenter {
  id: string;
  name: string;
  marketCode: string;
  state: string;
  district: string;
  locationAddress: string;
  latitude: number;
  longitude: number;
  secretaryName: string;
  contactPhone: string;
  officialEmail?: string;
  isEnamConnected: boolean;
  coldStorageAvailable: boolean;
  weighbridgeAvailable: boolean;
  operatingHours: string;
  distanceKm?: number;
}

export interface MAPCNCommodityItem {
  id: string;
  mandiId: string;
  mandiName: string;
  mandiLocation: string;
  state: string;
  district: string;
  cropName: string;
  variety: string;
  grade: string;
  category: 'Grains & Cereals' | 'Pulses' | 'Vegetables' | 'Fruits' | 'Spices' | 'Oilseeds' | 'Commercial';
  minPricePerQuintal: number;
  maxPricePerQuintal: number;
  modalPricePerQuintal: number;
  mspPricePerQuintal?: number;
  arrivalVolumeMetricTons: number;
  priceDate: string;
  trendDirection: 'UP' | 'DOWN' | 'STABLE';
  trendPercentage: number;
  aiMarketOutlook: string;
  priceHistory7d: Array<{ date: string; price: number }>;
  distanceKm?: number;
  image?: string;
  verifiedTradersCount?: number;
}

export interface MAPCNPriceAlert {
  id: string;
  userId: string;
  cropName: string;
  targetPricePerQuintal: number;
  alertCondition: 'ABOVE' | 'BELOW';
  preferredMandiName?: string;
  isActive: boolean;
  createdAt: string;
}

export interface MAPCNTrader {
  id: string;
  mandiId: string;
  mandiName: string;
  traderName: string;
  businessName: string;
  shopNumber: string;
  apmcLicenseNumber: string;
  contactPhone: string;
  verifiedBuyer: boolean;
  rating: number;
  commoditiesTraded: string[];
}

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
  confidence: number;
  riskLevel: 'High' | 'Medium' | 'Low';
  farmHealthScore: number;
  cause: string;
  treatment: string[];
  prevention: string[];
  fertilizerSuggestion: string;
  aiNotes?: string;
}

export interface WeatherInfo {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  rainChance: number;
  location: string;
  soilMoisture?: number; // %
  uvIndex?: number;
  weeklyTrend?: Array<{
    day: string;
    temp: number;
    rainfall: number;
    humidity: number;
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
  currentPrice: number;
  priceChange: number;
  percentageChange: number;
  unit: string;
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
    type: 'fertilizer' | 'weather' | 'market' | 'diagnosis' | 'mapcn' | 'seedbank' | 'crop_calendar';
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
  | 'mapcn'
  | 'maps'
  | 'seedbank'
  | 'assistant'
  | 'weather'
  | 'community'
  | 'profile';
