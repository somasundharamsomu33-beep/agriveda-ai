export type Language = 'en' | 'ta' | 'hi' | 'te';

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
  audioUrl?: string;
  timestamp: string;
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
  | 'assistant'
  | 'community'
  | 'profile';
