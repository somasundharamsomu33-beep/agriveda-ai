import { Language } from '../types';

export interface TranslationSchema {
  // Common Navigation & Headers
  appName: string;
  tagline: string;
  subTagline: string;
  views: string;
  selectLanguage: string;
  verifiedFarmer: string;
  adminAudit: string;
  dashboard: string;
  
  // Dashboard
  goodMorning: string;
  farmHealth: string;
  farmHealthSub: string;
  statusGood: string;
  cropHealth: string;
  soilStatus: string;
  weatherRisk: string;
  irrigation: string;
  optimalGrowth: string;
  dripOperational: string;
  viewFarmInsights: string;
  todaysWeather: string;
  partlyCloudy: string;
  rainProbability: string;
  weatherRecommendation: string;
  viewWeather: string;
  askAgriVedaAI: string;
  askAISub: string;
  askByVoice: string;
  typeQuestion: string;
  uploadImage: string;
  suggestedQuestionsTitle: string;
  myCrops: string;
  viewAllCrops: string;
  vegetativeStage: string;
  floweringStage: string;
  harvestInDays: string;

  // New Marketplace, Technician & Exact Image Keys
  findTechnicians: string;
  spareParts: string;
  checkCompatibility: string;
  exactImageUnavailable: string;
  verifiedImage: string;
  vendorImage: string;
  demoImage: string;
  requestTechnician: string;
  findSeedShops: string;
  findFertilizerNearMe: string;
  officialLandRecords: string;
  digitalLandProfile: string;
  adminVerification: string;

  // AI Assistant
  aiAssistantHeader: string;
  aiAssistantSub: string;
  askAnythingPlaceholder: string;
  listen: string;
  stop: string;
  listeningStatus: string;
  processingStatus: string;
  capturedStatus: string;
  couldNotUnderstand: string;
  aiErrorMessage: string;

  // Crop Disease Scan
  cropScanHeader: string;
  cropScanSub: string;
  uploadCropImage: string;
  uploadSub: string;
  camera: string;
  gallery: string;
  analyzingImage: string;
  aiAnalysisTitle: string;
  severity: string;
  detectedDisease: string;
  aiConfidence: string;
  detectedSymptoms: string;
  recommendedActions: string;
  disclaimer: string;

  // Weather & Risk
  weatherHeader: string;
  humidity: string;
  windSpeed: string;
  uvIndex: string;
  farmingRecommendationTitle: string;
  outlookTitle: string;

  // Market Prices
  marketPricesHeader: string;
  liveMandiRates: string;
  bestMarketOpportunity: string;
  exploreMarkets: string;
  searchMarketPlaceholder: string;
  pricePerQuintal: string;

  // Farmer Passport
  passportHeader: string;
  digitalID: string;
  verifiedBadge: string;
  farmerID: string;
  farmLocation: string;
  farmSize: string;
  primaryCrops: string;
  experience: string;
  identityCheck: string;
  farmCheck: string;
  profileCheck: string;
  scanPassportQR: string;

  // My Farm
  myFarmHeader: string;
  farmParcelLayout: string;
  farmDetailsTab: string;
  currentCropsTab: string;
  cropHistoryTab: string;
  farmActivitiesTab: string;
  aiRecommendationsTab: string;

  // Crop Calendar
  cropManagementHeader: string;
  lifecycleStages: string;
  dueTomorrow: string;
  upcoming: string;
  completed: string;
  viewDetails: string;

  // Notifications & Settings
  notificationsHeader: string;
  settingsHeader: string;
  accountSettings: string;
  appPreferences: string;
  supportAndHelp: string;
  helpHeader: string;
  kisanHelpline: string;
  callHotline: string;
  faqsTitle: string;
  submitFeedback: string;
}

export const translations: Record<Language, TranslationSchema> = {
  en: {
    appName: 'AgriVeda',
    tagline: 'Your Smart Farming Companion',
    subTagline: 'AI-powered insights for better crops, decisions & profits.',
    views: 'Views (17 Screens)',
    selectLanguage: 'Select Language',
    verifiedFarmer: 'Verified Farmer',
    adminAudit: 'Admin Audit',
    myCrops: 'My Crops',
    viewAllCrops: 'View All Crops',
    vegetativeStage: 'Vegetative Stage',
    floweringStage: 'Flowering Stage',
    harvestInDays: 'Harvest in',
    findTechnicians: 'Find Nearby Technicians & Mechanics',
    spareParts: 'Agricultural Spare Parts',
    checkCompatibility: 'Check Equipment Compatibility',
    exactImageUnavailable: 'Product image unavailable — upload exact image',
    verifiedImage: '✓ Verified Image',
    vendorImage: '📷 Vendor Image',
    demoImage: '🧪 Demo Image',
    requestTechnician: 'Request Emergency Technician Service',
    findSeedShops: 'Find Seed Shops Near Me',
    findFertilizerNearMe: 'Find Fertilizer Near Me',
    officialLandRecords: 'Official Government Land Records Portal',
    digitalLandProfile: 'AgriVeda Digital Land Profile',
    adminVerification: 'Admin Verification & Audit System',
    viewFarmInsights: 'View Farm Insights',
    todaysWeather: "Today's Weather",
    partlyCloudy: 'Partly Cloudy',
    rainProbability: 'Rain Probability',
    weatherRecommendation: 'Rain is possible this evening. Consider delaying irrigation.',
    viewWeather: 'View Weather',
    askAgriVedaAI: 'Ask AgriVeda AI',
    askAISub: 'Get instant farming guidance using voice, text or images.',
    askByVoice: 'Ask by Voice',
    typeQuestion: 'Type Question',
    uploadImage: 'Upload Image',
    suggestedQuestionsTitle: 'Suggested Questions',
    dashboard: 'Dashboard',
    goodMorning: 'Good Morning',
    farmHealth: 'Your Farm Health',
    farmHealthSub: 'Real-time parcel diagnostics',
    statusGood: 'Status: Good',
    cropHealth: 'Crop Health',
    soilStatus: 'Soil Status',
    weatherRisk: 'Weather Risk',
    irrigation: 'Irrigation',
    optimalGrowth: 'Optimal growth',
    dripOperational: 'Drip operational',
    aiAssistantHeader: 'AgriVeda AI',
    aiAssistantSub: 'Your intelligent farming assistant',
    askAnythingPlaceholder: 'Ask anything about your farm...',
    listen: 'Listen',
    stop: 'Stop',
    listeningStatus: 'Listening...',
    processingStatus: 'Processing...',
    capturedStatus: 'Voice captured',
    couldNotUnderstand: 'Could not understand. Try again.',
    aiErrorMessage: "We're having trouble connecting to AgriVeda AI. Please try again.",
    cropScanHeader: 'Crop Disease Detection',
    cropScanSub: 'Upload a crop image to identify possible diseases and get recommended actions.',
    uploadCropImage: 'Upload Crop Image',
    uploadSub: 'Take a photo of affected leaf or upload from gallery',
    camera: 'Camera',
    gallery: 'Gallery',
    analyzingImage: 'Analyzing Crop Image with AI...',
    aiAnalysisTitle: 'AI Analysis',
    severity: 'Severity',
    detectedDisease: 'Detected Disease',
    aiConfidence: 'AI Confidence Score',
    detectedSymptoms: 'Detected Symptoms',
    recommendedActions: 'Recommended Actions',
    disclaimer: 'Disclaimer: AI results are advisory. Confirm serious crop problems with a qualified agricultural expert.',
    weatherHeader: 'Weather & Risk Alerts',
    humidity: 'Humidity',
    windSpeed: 'Wind Velocity',
    uvIndex: 'UV Index',
    farmingRecommendationTitle: 'Farming Recommendation',
    outlookTitle: '5-Day Agricultural Outlook',
    marketPricesHeader: 'Market Prices',
    liveMandiRates: 'Live Mandi Rates',
    bestMarketOpportunity: 'Best Market Opportunity',
    exploreMarkets: 'Explore Markets',
    searchMarketPlaceholder: 'Search crop or mandi market name...',
    pricePerQuintal: 'per quintal',
    passportHeader: 'Farmer Passport',
    digitalID: 'Digital ID',
    verifiedBadge: 'VERIFIED ✓',
    farmerID: 'Farmer ID',
    farmLocation: 'Farm Location',
    farmSize: 'Farm Size',
    primaryCrops: 'Primary Crops',
    experience: 'Experience',
    identityCheck: 'Identity ✓',
    farmCheck: 'Farm ✓',
    profileCheck: 'Profile ✓',
    scanPassportQR: 'Scan to verify Farmer Profile',
    myFarmHeader: 'My Farm',
    farmParcelLayout: 'Interactive Visual Farm Layout',
    farmDetailsTab: 'Farm Details',
    currentCropsTab: 'Current Crops',
    cropHistoryTab: 'Crop History',
    farmActivitiesTab: 'Farm Activities',
    aiRecommendationsTab: 'AI Recommendations',
    cropManagementHeader: 'Crop Management',
    lifecycleStages: 'Crop Lifecycle Stages',
    dueTomorrow: 'Due Tomorrow',
    upcoming: 'Upcoming',
    completed: 'Completed',
    viewDetails: 'View Details',
    notificationsHeader: 'Notifications & Alerts',
    settingsHeader: 'Settings & Preferences',
    accountSettings: 'Account Settings',
    appPreferences: 'App Preferences',
    supportAndHelp: 'Support & Help',
    helpHeader: 'Help & Support Center',
    kisanHelpline: 'Kisan Helpline 24/7',
    callHotline: 'Call 1800-180-1551',
    faqsTitle: 'Frequently Asked Questions',
    submitFeedback: 'Submit Farmer Feedback'
  },

  ta: {
    appName: 'அக்ரிவேதா',
    tagline: 'உங்கள் அறிவார்ந்த விவசாய தோழன்',
    subTagline: 'சிறந்த பயிர்கள், முடிவுகள் மற்றும் லாபத்திற்கான AI நுண்ணறிவு.',
    views: 'காட்சிகள் (17 திரைகள்)',
    selectLanguage: 'மொழியைத் தேர்ந்தெடுக்கவும்',
    verifiedFarmer: 'சரிபார்க்கப்பட்ட விவசாயி',
    adminAudit: 'நிர்வாக தணிக்கை',
    myCrops: 'என் பயிர்கள்',
    viewAllCrops: 'அனைத்து பயிர்களையும் காண்க',
    vegetativeStage: 'வளர்ச்சி நிலை',
    floweringStage: 'பூக்கும் நிலை',
    harvestInDays: 'அறுவடை நாட்களுக்குள்',
    findTechnicians: 'அருகிலுள்ள மெக்கானிக்கை கண்டறியவும்',
    spareParts: 'வேளாண் உதிரி பாகங்கள்',
    checkCompatibility: 'உபகரண பொருந்தக்கூடிய தன்மையை சரிபார்க்கவும்',
    exactImageUnavailable: 'துல்லியமான படம் இல்லை — அசல் படத்தை பதிவேற்றவும்',
    verifiedImage: '✓ சரிபார்க்கப்பட்ட படம்',
    vendorImage: '📷 விற்பனையாளர் படம்',
    demoImage: '🧪 மாதிரி படம்',
    requestTechnician: 'அவசர மெக்கானிக் சேவை கோரிக்கை',
    findSeedShops: 'அருகிலுள்ள விதை கடைகளை கண்டறியவும்',
    findFertilizerNearMe: 'அருகிலுள்ள உரக்கடைகளை கண்டறியவும்',
    officialLandRecords: 'அரசு நில ஆவணங்கள் போர்ட்டல்',
    digitalLandProfile: 'அக்ரிவேதா டிஜிட்டல் நில சுயவிவரம்',
    adminVerification: 'நிர்வாகி சரிபார்ப்பு மற்றும் தணிக்கை அமைப்பு',
    dashboard: 'டாஷ்போர்டு',
    goodMorning: 'காலை வணக்கம்',
    farmHealth: 'உங்கள் பண்ணை ஆரோக்கியம்',
    farmHealthSub: 'நேரடி பண்ணை நோய் ஆய்வு',
    statusGood: 'நிலை: நன்று',
    cropHealth: 'பயிர் ஆரோக்கியம்',
    soilStatus: 'மண் நிலை',
    weatherRisk: 'வானிலை ஆபத்து',
    irrigation: 'பாசனம்',
    optimalGrowth: 'சிறந்த வளர்ச்சி',
    dripOperational: 'சொட்டு நீர் பாசனம் செயல்படுகிறது',
    viewFarmInsights: 'பண்ணை நிலவரத்தை காண்க',
    todaysWeather: 'இன்றைய வானிலை',
    partlyCloudy: 'பகுதி மேகமூட்டம்',
    rainProbability: 'மழை வாய்ப்பு',
    weatherRecommendation: 'இன்று மாலை மழை பெய்ய வாய்ப்பு உள்ளது. பாசனம் செய்வதைத் தவிர்க்கவும்.',
    viewWeather: 'வானிலை காண்க',
    askAgriVedaAI: 'AgriVeda AI-யிடம் கேளுங்கள்',
    askAISub: 'குரல், உரை அல்லது படங்கள் மூலம் உடனடி விவசாய வழிகாட்டுதல் பெறுங்கள்.',
    askByVoice: 'குரல் மூலம் கேட்க',
    typeQuestion: 'கேள்வி டைப் செய்ய',
    uploadImage: 'படம் பதிவேற்ற',
    suggestedQuestionsTitle: 'பரிந்துரைக்கப்பட்ட கேள்விகள்',
    aiAssistantHeader: 'AgriVeda AI',
    aiAssistantSub: 'உங்கள் அறிவார்ந்த விவசாய உதவியாளர்',
    askAnythingPlaceholder: 'உங்கள் பண்ணையைப் பற்றி எது வேண்டுமானாலும் கேளுங்கள்...',
    listen: 'கேட்க',
    stop: 'நிறுத்து',
    listeningStatus: 'கேட்கிறது...',
    processingStatus: 'பகுப்பாய்வு செய்கிறது...',
    capturedStatus: 'குரல் பதிவு செய்யப்பட்டது',
    couldNotUnderstand: 'புரியவில்லை. மீண்டும் முயற்சிக்கவும்.',
    aiErrorMessage: 'AgriVeda AI-யுடன் இணைப்பதில் சிக்கல் ஏற்பட்டுள்ளது. மீண்டும் முயற்சிக்கவும்.',
    cropScanHeader: 'பயிர் நோய் கண்டறிதல்',
    cropScanSub: 'சாத்தியமான நோய்களைக் கண்டறிந்து பரிந்துரைக்கப்பட்ட நடவடிக்கைகளைப் பெற பயிர் படத்தை பதிவேற்றவும்.',
    uploadCropImage: 'பயிர் படத்தை பதிவேற்றவும்',
    uploadSub: 'பாதிக்கப்பட்ட இலையின் புகைப்படத்தை எடுக்கவும் அல்லது கேலரியில் இருந்து பதிவேற்றவும்',
    camera: 'கேமரா',
    gallery: 'கேலரி',
    analyzingImage: 'AI மூலம் பயிர் படம் பகுப்பாய்வு செய்யப்படுகிறது...',
    aiAnalysisTitle: 'AI பகுப்பாய்வு',
    severity: 'தீவிரம்',
    detectedDisease: 'கண்டறியப்பட்ட நோய்',
    aiConfidence: 'AI நம்பகத்தன்மை மதிப்பெண்',
    detectedSymptoms: 'கண்டறியப்பட்ட அறிகுறிகள்',
    recommendedActions: 'பரிந்துரைக்கப்பட்ட நடவடிக்கைகள்',
    disclaimer: 'பொறுப்புத் துறப்பு: AI முடிவுகள் ஆலோசனையே. தீவிர பயிர் பிரச்சனைகளுக்கு வேளாண் நிபுணரை அணுகவும்.',
    weatherHeader: 'வானிலை மற்றும் ஆபத்து எச்சரிக்கைகள்',
    humidity: 'ஈரப்பதம்',
    windSpeed: 'காற்றின் வேகம்',
    uvIndex: 'UV குறியீடு',
    farmingRecommendationTitle: 'வேளாண் பரிந்துரை',
    outlookTitle: '5 நாள் விவசாய வானிலை முன்னறிவிப்பு',
    marketPricesHeader: 'சந்தை விலைகள்',
    liveMandiRates: 'நேரடி மண்டி விலைகள்',
    bestMarketOpportunity: 'சிறந்த சந்தை வாய்ப்பு',
    exploreMarkets: 'சந்தைகளை ஆராய்க',
    searchMarketPlaceholder: 'பயிர் அல்லது மண்டி பெயரைத் தேடவும்...',
    pricePerQuintal: 'க்விண்டாலுக்கு',
    passportHeader: 'விவசாயி பாஸ்போர்ட்',
    digitalID: 'டிஜிட்டல் அடையாளம்',
    verifiedBadge: 'சரிபார்க்கப்பட்டது ✓',
    farmerID: 'விவசாயி ஐடி',
    farmLocation: 'பண்ணை அமைவிடம்',
    farmSize: 'பண்ணை அளவு',
    primaryCrops: 'முதன்மை பயிர்கள்',
    experience: 'அனுபவம்',
    identityCheck: 'அடையாளம் ✓',
    farmCheck: 'பண்ணை ✓',
    profileCheck: 'சுயவிவரம் ✓',
    scanPassportQR: 'விவசாயி சுயவிவரத்தை சரிபார்க்க ஸ்கேன் செய்யவும்',
    myFarmHeader: 'என் பண்ணை',
    farmParcelLayout: 'இன்டராக்டிவ் காட்சி பண்ணை வரைபடம்',
    farmDetailsTab: 'பண்ணை விவரங்கள்',
    currentCropsTab: 'தற்போதைய பயிர்கள்',
    cropHistoryTab: 'பயிர் வரலாறு',
    farmActivitiesTab: 'பண்ணை செயல்பாடுகள்',
    aiRecommendationsTab: 'AI பரிந்துரைகள்',
    cropManagementHeader: 'பயிர் மேலாண்மை',
    lifecycleStages: 'பயிர் வளர்ச்சி பருவங்கள்',
    dueTomorrow: 'நாளை செய்ய வேண்டும்',
    upcoming: 'வரவிருப்பது',
    completed: 'முடிந்தது',
    viewDetails: 'விவரங்களை காண்க',
    notificationsHeader: 'அறிவிப்புகள் & எச்சரிக்கைகள்',
    settingsHeader: 'அமைப்புகள் & விருப்பங்கள்',
    accountSettings: 'கணக்கு அமைப்புகள்',
    appPreferences: 'செயலி விருப்பங்கள்',
    supportAndHelp: 'ஆதரவு & உதவி',
    helpHeader: 'உதவி மையம்',
    kisanHelpline: 'கிசான் உதவி எண் 24/7',
    callHotline: 'அழைக்கவும் 1800-180-1551',
    faqsTitle: 'அடிக்கடி கேட்கப்படும் கேள்விகள்',
    submitFeedback: 'விவசாயி கருத்து சமர்ப்பிக்க'
  },

  hi: {
    appName: 'एग्रीवेदा',
    tagline: 'आपका स्मार्ट कृषि साथी',
    subTagline: 'बेहतर फसलों, निर्णयों और लाभ के लिए AI अंतर्दृष्टि।',
    views: 'दृश्य (17 स्क्रीन)',
    selectLanguage: 'भाषा चुनें',
    verifiedFarmer: 'सत्यापित किसान',
    adminAudit: 'एडमिन ऑडिट',
    myCrops: 'मेरी फसलें',
    viewAllCrops: 'सभी फसलें देखें',
    vegetativeStage: 'वानस्पतिक अवस्था',
    floweringStage: 'पुष्पन अवस्था',
    harvestInDays: 'कटाई दिनों में',
    findTechnicians: 'निकटतम तकनीशियन और मैकेनिक खोजें',
    spareParts: 'कृषि स्पेयर पार्ट्स',
    checkCompatibility: 'उपकरण अनुकूलता जांचें',
    exactImageUnavailable: 'सटीक चित्र उपलब्ध नहीं है — कृपया असली चित्र अपलोड करें',
    verifiedImage: '✓ सत्यापित चित्र',
    vendorImage: '📷 विक्रेता चित्र',
    demoImage: '🧪 डेमो चित्र',
    requestTechnician: 'आपातकालीन तकनीशियन सेवा का अनुरोध करें',
    findSeedShops: 'पास की बीज दुकानें खोजें',
    findFertilizerNearMe: 'पास की उर्वरक दुकानें खोजें',
    officialLandRecords: 'आधिकारिक सरकारी भूमि रिकॉर्ड पोर्टल',
    digitalLandProfile: 'एग्रीवेदा डिजिटल भूमि प्रोफ़ाइल',
    adminVerification: 'एडमिन सत्यापन एवं लेखा परीक्षा प्रणाली',
    dashboard: 'डैशबोर्ड',
    goodMorning: 'शुभ प्रभात',
    farmHealth: 'आपके खेत का स्वास्थ्य',
    farmHealthSub: 'वास्तविक समय खेत निदान',
    statusGood: 'स्थिति: उत्तम',
    cropHealth: 'फसल स्वास्थ्य',
    soilStatus: 'मृदा स्थिति',
    weatherRisk: 'मौसम का जोखिम',
    irrigation: 'सिंचाई',
    optimalGrowth: 'इष्टतम विकास',
    dripOperational: 'ड्रिप सिंचाई चालू',
    viewFarmInsights: 'खेत की जानकारी देखें',
    todaysWeather: 'आज का मौसम',
    partlyCloudy: 'आंशिक रूप से बादल',
    rainProbability: 'बारिश की संभावना',
    weatherRecommendation: 'आज शाम बारिश संभव है। सिंचाई टालने पर विचार करें।',
    viewWeather: 'मौसम देखें',
    askAgriVedaAI: 'AgriVeda AI से पूछें',
    askAISub: 'आवाज, पाठ या छवियों का उपयोग करके तुरंत कृषि मार्गदर्शन प्राप्त करें।',
    askByVoice: 'आवाज से पूछें',
    typeQuestion: 'प्रश्न टाइप करें',
    uploadImage: 'फोटो अपलोड करें',
    suggestedQuestionsTitle: 'सुझाए गए प्रश्न',
    aiAssistantHeader: 'AgriVeda AI',
    aiAssistantSub: 'आपका बुद्धिमान कृषि सहायक',
    askAnythingPlaceholder: 'अपने खेत के बारे में कुछ भी पूछें...',
    listen: 'सुनें',
    stop: 'रोकें',
    listeningStatus: 'सुन रहा है...',
    processingStatus: 'प्रोसेस हो रहा है...',
    capturedStatus: 'आवाज रिकॉर्ड की गई',
    couldNotUnderstand: 'समझ नहीं आया। कृपया पुनः प्रयास करें।',
    aiErrorMessage: 'AgriVeda AI से कनेक्ट करने में समस्या आ रही है। कृपया फिर से प्रयास करें।',
    cropScanHeader: 'फसल रोग पहचान',
    cropScanSub: 'संभावित रोगों की पहचान करने और अनुशंसित कदम प्राप्त करने के लिए फसल की फोटो अपलोड करें।',
    uploadCropImage: 'फसल की फोटो अपलोड करें',
    uploadSub: 'प्रभावित पत्ती की फोटो लें या गैलरी से अपलोड करें',
    camera: 'कैमरा',
    gallery: 'गैलरी',
    analyzingImage: 'AI द्वारा फसल फोटो का विश्लेषण किया जा रहा है...',
    aiAnalysisTitle: 'AI विश्लेषण',
    severity: 'गंभीरता',
    detectedDisease: 'पहचाना गया रोग',
    aiConfidence: 'AI सटीकता स्कोर',
    detectedSymptoms: 'पहचाने गए लक्षण',
    recommendedActions: 'अनुशंसित कार्रवाइयां',
    disclaimer: 'अस्वीकरण: AI परिणाम सलाहकारी हैं। गंभीर समस्याओं के लिए कृषि विशेषज्ञ से पुष्टि करें।',
    weatherHeader: 'मौसम और जोखिम अलर्ट',
    humidity: 'आर्द्रता',
    windSpeed: 'हवा की गति',
    uvIndex: 'यूवी इंडेक्स',
    farmingRecommendationTitle: 'कृषि अनुशंसा',
    outlookTitle: '5-दिवसीय कृषि पूर्वानुमान',
    marketPricesHeader: 'मंडी भाव',
    liveMandiRates: 'लाइव मंडी दरें',
    bestMarketOpportunity: 'सर्वश्रेष्ठ बाजार अवसर',
    exploreMarkets: 'बाजार एक्सप्लोर करें',
    searchMarketPlaceholder: 'फसल या मंडी का नाम खोजें...',
    pricePerQuintal: 'प्रति क्विंटल',
    passportHeader: 'किसान पासपोर्ट',
    digitalID: 'डिजिटल आईडी',
    verifiedBadge: 'सत्यापित ✓',
    farmerID: 'किसान आईडी',
    farmLocation: 'खेत का स्थान',
    farmSize: 'खेत का आकार',
    primaryCrops: 'मुख्य फसलें',
    experience: 'अनुभव',
    identityCheck: 'पहचान ✓',
    farmCheck: 'खेत ✓',
    profileCheck: 'प्रोफाइल ✓',
    scanPassportQR: 'किसान प्रोफाइल सत्यापित करने के लिए स्कैन करें',
    myFarmHeader: 'मेरा खेत',
    farmParcelLayout: 'इंटरैक्टिव विजुअल फार्म लेआउट',
    farmDetailsTab: 'खेत विवरण',
    currentCropsTab: 'वर्तमान फसलें',
    cropHistoryTab: 'फसल इतिहास',
    farmActivitiesTab: 'खेत गतिविधियां',
    aiRecommendationsTab: 'AI सिफारिशें',
    cropManagementHeader: 'फसल प्रबंधन',
    lifecycleStages: 'फसल जीवनचक्र चरण',
    dueTomorrow: 'कल देय',
    upcoming: 'आगामी',
    completed: 'पूर्ण',
    viewDetails: 'विवरण देखें',
    notificationsHeader: 'अधिसूचनाएं और अलर्ट',
    settingsHeader: 'सेटिंग्स और प्राथमिकताएं',
    accountSettings: 'खाता सेटिंग्स',
    appPreferences: 'ऐप प्राथमिकताएं',
    supportAndHelp: 'सहायता और मदद',
    helpHeader: 'सहायता केंद्र',
    kisanHelpline: 'किसान हेल्पलाइन 24/7',
    callHotline: 'कॉल करें 1800-180-1551',
    faqsTitle: 'अक्सर पूछे जाने वाले प्रश्न',
    submitFeedback: 'किसान प्रतिक्रिया भेजें'
  },

  te: {
    appName: 'అగ్రివేద',
    tagline: 'మీ స్మార్ట్ వ్యవసాయ సహాయకుడు',
    subTagline: 'మెరుగైన పంటలు, నిర్ణయాలు మరియు లాభాల కోసం AI సమాచారం.',
    views: 'వీక్షణలు (17 స్క్రీన్‌లు)',
    selectLanguage: 'భాషను ఎంచుకోండి',
    verifiedFarmer: 'ధృవీకరించబడిన రైతు',
    adminAudit: 'అడ్మిన్ ఆడిట్',
    myCrops: 'నా పంటలు',
    viewAllCrops: 'అన్ని పంటలు చూడండి',
    vegetativeStage: 'పెరుగుదల దశ',
    floweringStage: 'పూత దశ',
    harvestInDays: 'కోత రోజులలో',
    findTechnicians: 'దగ్గరలోని టెక్నీషియన్లను కనుగొనండి',
    spareParts: 'వ్యవసాయ స్పేర్ పార్ట్స్',
    checkCompatibility: 'పరికరాల సరిపోలిక చూడండి',
    exactImageUnavailable: 'ఖచ్చితమైన చిత్రం లేదు — అసలు చిత్రాన్ని అప్‌లోడ్ చేయండి',
    verifiedImage: '✓ ధృవీకరించబడిన చిత్రం',
    vendorImage: '📷 విక్రేత చిత్రం',
    demoImage: '🧪 డెమో చిత్రం',
    requestTechnician: 'అత్యవసర మెకానిక్ సేవ కోరండి',
    findSeedShops: 'దగ్గరలోని విత్తన దుకాణాలు కనుగొనండి',
    findFertilizerNearMe: 'దగ్గరలోని ఎరువుల దుకాణాలు కనుగొనండి',
    officialLandRecords: 'అధికారిక ప్రభుత్వ భూమి రికార్డుల పోర్టల్',
    digitalLandProfile: 'అగ్రివేద డిజిటల్ భూమి ప్రొఫైల్',
    adminVerification: 'అడ్మిన్ ధృవీకరణ మరియు ఆడిట్ వ్యవస్థ',
    dashboard: 'డ్యాష్‌బోర్డ్',
    goodMorning: 'శుభోదయం',
    farmHealth: 'మీ పొలం ఆరోగ్యం',
    farmHealthSub: 'రియల్ టైమ్ పొలం పరిశీలన',
    statusGood: 'స్థితి: బాగుంది',
    cropHealth: 'పంట ఆరోగ్యం',
    soilStatus: 'నేల స్థితి',
    weatherRisk: 'వాతావరణ ప్రమాదం',
    irrigation: 'నీటిపారుదల',
    optimalGrowth: 'అత్యుత్తమ పెరుగుదల',
    dripOperational: 'బిందు సేద్యం నడుస్తోంది',
    viewFarmInsights: 'పొలం వివరాలు చూడండి',
    todaysWeather: 'ఈరోజు వాతావరణం',
    partlyCloudy: 'పాక్షికంగా మబ్బుగా ఉంది',
    rainProbability: 'వర్షపాతం అవకాశం',
    weatherRecommendation: 'ఈరోజు సాయంత్రం వర్షం పడే అవకాశం ఉంది. నీటిపారుదల వాయిదా వేయండి.',
    viewWeather: 'వాతావరణం చూడండి',
    askAgriVedaAI: 'AgriVeda AIని అడగండి',
    askAISub: 'వాయిస్, టెక్స్ట్ లేదా చిత్రాలను ఉపయోగించి తక్షణ వ్యవసాయ సలహా పొందండి.',
    askByVoice: 'వాయిస్ ద్వారా అడగండి',
    typeQuestion: 'ప్రశ్న టైప్ చేయండి',
    uploadImage: 'చిత్రం అప్‌లోడ్ చేయండి',
    suggestedQuestionsTitle: 'సూచించబడిన ప్రశ్నలు',
    aiAssistantHeader: 'AgriVeda AI',
    aiAssistantSub: 'మీ తెలివైన వ్యవసాయ సహాయకుడు',
    askAnythingPlaceholder: 'మీ పొలం గురించి ఏదైనా అడగండి...',
    listen: 'వినండి',
    stop: 'ఆపండి',
    listeningStatus: 'వింటోంది...',
    processingStatus: 'విశ్లేషిస్తోంది...',
    capturedStatus: 'వాయిస్ రికార్డ్ అయింది',
    couldNotUnderstand: 'అర్థం కాలేదు. దయచేసి మళ్లీ ప్రయత్నించండి.',
    aiErrorMessage: 'AgriVeda AIకి కనెక్ట్ చేయడంలో సమస్య ఉంది. దయచేసి మళ్లీ ప్రయత్నించండి.',
    cropScanHeader: 'పంట తెగుళ్ల గుర్తింపు',
    cropScanSub: 'సాధ్యమైన తెగుళ్లను గుర్తించడానికి మరియు తగిన నివారణల కోసం పంట చిత్రాన్ని అప్‌లోడ్ చేయండి.',
    uploadCropImage: 'పంట చిత్రాన్ని అప్‌లోడ్ చేయండి',
    uploadSub: 'బాధిత ఆకు ఫోటో తీయండి లేదా గ్యాలరీ నుండి అప్‌లోడ్ చేయండి',
    camera: 'కెమెరా',
    gallery: 'గ్యాలరీ',
    analyzingImage: 'AI ద్వారా పంట చిత్రం విశ్లేషించబడుతోంది...',
    aiAnalysisTitle: 'AI విశ్లేషణ',
    severity: 'తీవ్రత',
    detectedDisease: 'గుర్తించిన తెగులు',
    aiConfidence: 'AI నమ్మకం స్కోర్',
    detectedSymptoms: 'గుర్తించిన లక్షణాలు',
    recommendedActions: 'సూచించిన చర్యలు',
    disclaimer: 'గమనిక: AI ఫలితాలు సూచన మాత్రమే. తీవ్రమైన సమస్యలకు వ్యవసాయ అధికారిని సంప్రదించండి.',
    weatherHeader: 'వాతావరణ మరియు ప్రమాద హెచ్చరికలు',
    humidity: 'తేమ',
    windSpeed: 'గాలి వేగం',
    uvIndex: 'యువి ఇండెక్స్',
    farmingRecommendationTitle: 'వ్యవసాయ సూచన',
    outlookTitle: '5 రోజుల వ్యవసాయ వాతావరణ అంచనా',
    marketPricesHeader: 'మార్కెట్ ధరలు',
    liveMandiRates: 'లైవ్ మార్కెట్ ధరలు',
    bestMarketOpportunity: 'అత్యుత్తమ మార్కెట్ అవకాశం',
    exploreMarkets: 'మార్కెట్లను పరిశీలించండి',
    searchMarketPlaceholder: 'పంట లేదా మార్కెట్ పేరు వెతకండి...',
    pricePerQuintal: 'క్వింటాల్‌కి',
    passportHeader: 'రైతు పాస్‌పోర్ట్',
    digitalID: 'డిజిటల్ గుర్తింపు',
    verifiedBadge: 'ధృవీకరించబడింది ✓',
    farmerID: 'రైతు ఐడి',
    farmLocation: 'పొలం ప్రాంతం',
    farmSize: 'పొలం పరిమాణం',
    primaryCrops: 'ప్రధాన పంటలు',
    experience: 'అనుభవం',
    identityCheck: 'గుర్తింపు ✓',
    farmCheck: 'పొలం ✓',
    profileCheck: 'ప్రొఫైల్ ✓',
    scanPassportQR: 'రైతు ప్రొఫైల్ ధృవీకరించడానికి స్కాన్ చేయండి',
    myFarmHeader: 'నా పొలం',
    farmParcelLayout: 'ఇంటరాక్టివ్ పొలం మ్యాప్',
    farmDetailsTab: 'పొలం వివరాలు',
    currentCropsTab: 'ప్రస్తుత పంటలు',
    cropHistoryTab: 'పంట చరిత్ర',
    farmActivitiesTab: 'పొలం పనులు',
    aiRecommendationsTab: 'AI సూచనలు',
    cropManagementHeader: 'పంట నిర్వహణ',
    lifecycleStages: 'పంట అభివృద్ధి దశలు',
    dueTomorrow: 'రేపు చేయాలి',
    upcoming: 'రాబోయేవి',
    completed: 'పూర్తయింది',
    viewDetails: 'వివరాలు చూడండి',
    notificationsHeader: 'నోటిఫికేషన్లు & హెచ్చరికలు',
    settingsHeader: 'సెట్టింగ్‌లు & ఎంపికలు',
    accountSettings: 'ఖాతా సెట్టింగ్‌లు',
    appPreferences: 'యాప్ ఎంపికలు',
    supportAndHelp: 'సహాయం & మద్దతు',
    helpHeader: 'సహాయ కేంద్రం',
    kisanHelpline: 'రైతు హెల్ప్‌లైన్ 24/7',
    callHotline: 'కాల్ చేయండి 1800-180-1551',
    faqsTitle: 'తరచుగా అడిగే ప్రశ్నలు',
    submitFeedback: 'రైతు అభిప్రాయం పంపండి'
  },
  kn: null as any,
  ml: null as any,
  mr: null as any,
  bn: null as any,
  auto: null as any
};

translations.kn = translations.en;
translations.ml = translations.en;
translations.mr = translations.en;
translations.bn = translations.en;
translations.auto = translations.en;

// Multilingual Suggested AI Questions mapped to language selection
export const localizedSuggestedQuestions: Record<Language, string[]> = {
  en: [
    'What fertilizer should I use for rice?',
    'Why are my tomato leaves turning yellow?',
    'When should I irrigate my farm?',
    'Which crop is suitable for my soil?'
  ],
  ta: [
    'என் நெல் பயிருக்கு என்ன உரம் தேவை?',
    'தக்காளி இலைகளில் மஞ்சள் நிறம் ஏன் வருகிறது?',
    'இன்று பாசனம் செய்யலாமா?',
    'என் மண்ணிற்கு ஏற்ற பயிர் எது?'
  ],
  hi: [
    'धान की फसल में कौन सा उर्वरक डालें?',
    'मेरी टमाटर की फसल के पत्ते पीले क्यों हो रहे हैं?',
    'क्या आज सिंचाई करनी चाहिए?',
    'मेरी मिट्टी के लिए कौन सी फसल उपयुक्त है?'
  ],
  te: [
    'నా వరి పంటకు ఏ ఎరువు వాడాలి?',
    'టమోటా ఆకులు ఎందుకు పసుపు రంగులోకి మారుతున్నాయి?',
    'ఈరోజు నీటిపారుదల చేయవచ్చా?',
    'నా నేలకు ఏ పంట అనుకూలంగా ఉంటుంది?'
  ],
  kn: [
    'ನನ್ನ ಭತ್ತದ ಬೆಳೆಗೆ ಯಾವ ಗೊಬ್ಬರ ಬಳಸಬೇಕು?',
    'ಟೊಮೆಟೊ ಎಲೆಗಳು ಹಳದಿಯಾಗುತ್ತಿರುವುದು ಏಕೆ?'
  ],
  ml: [
    'എന്റെ നെൽകൃഷിക്ക് ഏത് വളമാണ് വേണ്ടത്?',
    'തക്കാളി ഇലകൾ മഞ്ഞയാകുന്നത് എന്തുകൊണ്ട്?'
  ],
  mr: [
    'माझ्या भाताच्या पिकासाठी कोणते खत वापरावे?',
    'माझ्या टोमॅटोची पाने पिवळी का पडत आहेत?'
  ],
  bn: [
    'আমার ধান ফসলে কী সার দেওয়া উচিত?',
    'টমেটো পাতা হলুদ হয়ে যাচ্ছে কেন?'
  ],
  auto: null as any
};
localizedSuggestedQuestions.auto = localizedSuggestedQuestions.en;

localizedSuggestedQuestions.auto = localizedSuggestedQuestions.en;
