export type Language = 'en' | 'ta' | 'hi' | 'te';
export type AIModelType = 'groq/compound' | 'openai/gpt-oss-120b' | 'gemma2-9b-it' | 'gemini-1.5-flash' | 'gemini-1.5-pro';


export interface UserProfile {
  name: string;
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
  cropVariety?: string;
  sowingDate?: string;
  cropAgeDays?: number;
  irrigationMethod?: string;
  seedVariety?: string;
  seedBankName?: string;
  recentCropProblems?: string;
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
