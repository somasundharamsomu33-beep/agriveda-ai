import { AgriMarketItem, LandParcel, OrderRecord } from '../types';

export interface ServiceCenterListing {
  id: string;
  businessName: string;
  category: 'tractor_dealer' | 'equipment_dealer' | 'rental_center' | 'service_center' | 'repair_shop' | 'spare_parts_shop' | 'technician' | 'fertilizer_shop' | 'seed_shop';
  categoryLabel: string;
  ownerName: string;
  phone: string;
  whatsapp: string;
  address: string;
  district: string;
  state: string;
  distanceKm: number;
  latitude: number;
  longitude: number;
  isOpen: boolean;
  openHours: string;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  availableServices: string[];
  availableProducts?: string[];
  imageUrl: string;
}

export const SAMPLE_MARKETPLACE_PRODUCTS: AgriMarketItem[] = [
  // --- EQUIPMENT ---
  {
    id: 'eq-1',
    title: 'Mahindra 575 DI 45HP Tractor (Power Steering)',
    category: 'equipment',
    subCategory: 'Tractors',
    brand: 'Mahindra',
    price: 685000,
    originalPrice: 720000,
    discountPercentage: 5,
    rating: 4.8,
    reviewCount: 42,
    sellerName: 'Senthil Agri Machinery Corp',
    sellerPhone: '+91 98940 11223',
    sellerLocation: 'Trichy APMC Hub, Tamil Nadu',
    distanceKm: 8.2,
    isVerifiedSeller: true,
    condition: 'NEW',
    isRentAvailable: true,
    rentRateText: '₹800 / hour',
    imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=500&q=80',
    imageSourceBadge: 'Demo Image',
    imageSourceType: 'DEMO_IMAGE',
    isImageUnavailable: true,
    galleryImages: [
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=500&q=80'
    ],
    specifications: {
      'Horsepower': '45 HP',
      'Cylinders': '4 Cylinders',
      'Hydraulic Lift Capacity': '1600 kg',
      'Warranty': '2 Years Manufacturer'
    },
    description: 'Heavy duty 45HP tractor ideal for paddy puddle cultivation, deep ploughing and hauling. Includes fuel-efficient mDI engine and dual clutch system.',
    stockCount: 4,
    suitableCrops: ['Paddy', 'Sugarcane', 'Cotton', 'Maize']
  },
  {
    id: 'eq-2',
    title: 'Shaktiman Heavy Duty Rotavator (6 Feet)',
    category: 'equipment',
    subCategory: 'Rotavators',
    brand: 'Shaktiman',
    price: 115000,
    originalPrice: 128000,
    discountPercentage: 10,
    rating: 4.9,
    reviewCount: 38,
    sellerName: 'Sri Lakshmi Agri Implements',
    sellerPhone: '+91 94432 99881',
    sellerLocation: 'Vellore Bypass Road, Tamil Nadu',
    distanceKm: 4.5,
    isVerifiedSeller: true,
    condition: 'NEW',
    isRentAvailable: true,
    rentRateText: '₹450 / hour',
    imageUrl: 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&w=500&q=80',
    specifications: {
      'Working Width': '6 Feet (1.8m)',
      'No. of Blades': '42 Boron Steel Blades',
      'Tractor Power Required': '40-50 HP',
      'Gear Box': 'Multi-Speed Gearbox'
    },
    description: 'Designed for primary and secondary tillage in wet and dry soils. Breaks hard soil clods smoothly into fine tilth.',
    stockCount: 8
  },
  {
    id: 'eq-3',
    title: 'Aspee Turbo Battery Operated Backpack Sprayer (16L)',
    category: 'equipment',
    subCategory: 'Sprayers',
    brand: 'Aspee',
    price: 4200,
    originalPrice: 4800,
    discountPercentage: 12,
    rating: 4.7,
    reviewCount: 95,
    sellerName: 'Kisan Input Store',
    sellerPhone: '+91 98421 55432',
    sellerLocation: 'Kanchipuram, Tamil Nadu',
    distanceKm: 6.1,
    isVerifiedSeller: true,
    condition: 'NEW',
    imageUrl: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=500&q=80',
    specifications: {
      'Tank Capacity': '16 Litres',
      'Battery': '12V 8Ah Rechargeable Lithium',
      'Continuous Run': '4-5 Hours per charge',
      'Nozzles Included': '4 Multi-purpose Brass Nozzles'
    },
    description: 'Lightweight battery-operated sprayer for uniform foliar spray of organic bio-pesticides and micronutrients.',
    stockCount: 25
  },
  {
    id: 'eq-4',
    title: 'Kubota Combine Harvester DC-68G (Used - 2024 Model)',
    category: 'equipment',
    subCategory: 'Harvesters',
    brand: 'Kubota',
    price: 1850000,
    originalPrice: 2400000,
    discountPercentage: 22,
    rating: 4.6,
    reviewCount: 14,
    sellerName: 'Kongu Heavy Equipment Trading',
    sellerPhone: '+91 97890 12345',
    sellerLocation: 'Coimbatore, Tamil Nadu',
    distanceKm: 18.0,
    isVerifiedSeller: true,
    condition: 'USED',
    isRentAvailable: true,
    rentRateText: '₹2,200 / hour',
    imageUrl: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=500&q=80',
    specifications: {
      'Engine Power': '68 HP Turbo Diesel',
      'Cutter Bar Width': '2.0 Meters',
      'Track Type': 'Rubber Crawler Track (Mud-proof)',
      'Hours Run': '650 Hours'
    },
    description: 'Paddy combine harvester in prime condition. Excellent track performance in deep mud fields with low grain loss.',
    stockCount: 1
  },

  // --- SEEDS ---
  {
    id: 'sd-1',
    title: 'CR 1009 Sub1 Flood Resistant Paddy Seeds (10kg Pack)',
    category: 'seeds',
    subCategory: 'Paddy',
    brand: 'TNAU Certified Seeds',
    price: 680,
    originalPrice: 750,
    discountPercentage: 9,
    rating: 4.9,
    reviewCount: 112,
    sellerName: 'TNAU Seed Production Center',
    sellerPhone: '+91 94431 88900',
    sellerLocation: 'Coimbatore Seed Hub, Tamil Nadu',
    distanceKm: 3.2,
    isVerifiedSeller: true,
    condition: 'NEW',
    imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=500&q=80',
    specifications: {
      'Variety': 'CR 1009 Sub1',
      'Duration': '150-155 Days',
      'Germination Rate': '92% Certified',
      'Submergence Tolerance': 'Tolerates 14 days under water',
      'Yield Potential': '2.5 - 3.0 Tons / Acre'
    },
    description: 'High-yielding long-duration paddy variety with natural flood tolerance. Recommended for Samba season in Cauvery Delta.',
    stockCount: 120,
    germinationRate: '92%',
    packSize: '10 kg Bag',
    suitableCrops: ['Paddy']
  },
  {
    id: 'sd-2',
    title: 'Hybrid Tomato PKM-1 High Yield Seeds (50g)',
    category: 'seeds',
    subCategory: 'Tomato',
    brand: 'Seminis Hybrid Seeds',
    price: 450,
    originalPrice: 500,
    discountPercentage: 10,
    rating: 4.8,
    reviewCount: 64,
    sellerName: 'Cauvery Bio Agrosciences',
    sellerPhone: '+91 98401 23456',
    sellerLocation: 'Kovilpatti, Tamil Nadu',
    distanceKm: 2.1,
    isVerifiedSeller: true,
    condition: 'NEW',
    imageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb197a5?auto=format&fit=crop&w=500&q=80',
    specifications: {
      'Variety': 'PKM-1 Hybrid',
      'Fruit Type': 'Firm Round Red Tomatoes',
      'First Harvest': '60-65 Days',
      'Germination Rate': '88%'
    },
    description: 'Heat tolerant hybrid tomato variety producing shiny, thick-skinned fruits suitable for long distance mandi transport.',
    stockCount: 85,
    germinationRate: '88%',
    packSize: '50 gram Pouch'
  },

  // --- FERTILIZERS ---
  {
    id: 'ft-1',
    title: 'NPK 19-19-19 100% Water Soluble Fertilizer (1kg)',
    category: 'fertilizers',
    subCategory: 'Fertilizers',
    brand: 'IFFCO Quality Inputs',
    price: 185,
    originalPrice: 210,
    discountPercentage: 11,
    rating: 4.9,
    reviewCount: 230,
    sellerName: 'Kisan Fertilizer Depot',
    sellerPhone: '+91 98430 55667',
    sellerLocation: 'Tiruvallur Town, Tamil Nadu',
    distanceKm: 3.8,
    isVerifiedSeller: true,
    condition: 'NEW',
    imageUrl: 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&w=500&q=80',
    specifications: {
      'N-P-K Ratio': '19:19:19 Balance',
      'Solubility': '100% Water Soluble for Drip & Foliar',
      'Form': 'Powder',
      'Pack Size': '1 kg Bag'
    },
    description: 'Balanced primary nutrient booster for vegetative and early flowering stages. Enhances root expansion and chlorophyll synthesis.',
    stockCount: 200,
    packSize: '1 kg'
  },
  {
    id: 'ft-2',
    title: 'Organic Neem Cake Powder Soil Conditioner (50kg)',
    category: 'fertilizers',
    subCategory: 'Organic fertilizers',
    brand: 'GreenEarth Organics',
    price: 850,
    originalPrice: 950,
    discountPercentage: 10,
    rating: 4.8,
    reviewCount: 78,
    sellerName: 'Organic Agri Care',
    sellerPhone: '+91 94421 99001',
    sellerLocation: 'Madurai East, Tamil Nadu',
    distanceKm: 7.4,
    isVerifiedSeller: true,
    condition: 'NEW',
    imageUrl: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=500&q=80',
    specifications: {
      'Active Agent': 'Azadirachtin > 1000 ppm',
      'N-P-K Value': '5:1:2 Organic',
      'Purpose': 'Nematode control & Soil Enrichment'
    },
    description: 'Pure cold-pressed neem cake powder. Controls soil-borne nematodes, white grubs and enhances nitrogen absorption efficiency.',
    stockCount: 60,
    packSize: '50 kg Jute Bag'
  },

  // --- SPARE PARTS ---
  {
    id: 'sp-1',
    title: 'High Pressure Hydraulic Hose Assembly (2 Meters)',
    category: 'spare_parts',
    subCategory: 'Hydraulic parts',
    brand: 'Gates Hydraulics',
    price: 1850,
    originalPrice: 2100,
    discountPercentage: 11,
    rating: 4.7,
    reviewCount: 33,
    sellerName: 'Kisan Spare Parts Depot',
    sellerPhone: '+91 98430 55667',
    sellerLocation: 'Madurai APMC Hub, Tamil Nadu',
    distanceKm: 5.1,
    isVerifiedSeller: true,
    condition: 'NEW',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=500&q=80',
    specifications: {
      'Working Pressure': '350 Bar (5000 PSI)',
      'Length': '2.0 Meters',
      'Fitting Thread': '3/4 inch Female Swivel BSP'
    },
    description: 'Heavy duty double steel-braided hydraulic hose for tractor lift arms, tipping trailers and backhoe loaders.',
    stockCount: 30,
    compatibleTractorModels: ['Mahindra 575 DI', 'John Deere 5050D', 'Swaraj 744 FE', 'TAFE 45 DI']
  },
  {
    id: 'sp-2',
    title: 'Mahindra Tractor Dual Clutch Plate Assembly',
    category: 'spare_parts',
    subCategory: 'Clutch parts',
    brand: 'Luk India',
    price: 4500,
    originalPrice: 5200,
    discountPercentage: 13,
    rating: 4.9,
    reviewCount: 19,
    sellerName: 'Kisan Spare Parts Depot',
    sellerPhone: '+91 98430 55667',
    sellerLocation: 'Madurai APMC Hub, Tamil Nadu',
    distanceKm: 5.1,
    isVerifiedSeller: true,
    condition: 'NEW',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=500&q=80',
    specifications: {
      'Diameter': '280 mm Dual Disc',
      'Material': 'Cerametallic Friction Facing',
      'Warranty': '1 Year'
    },
    description: 'Genuine dual clutch plate set ensuring smooth PTO engagement during rotavator and thresher operation.',
    stockCount: 12,
    compatibleTractorModels: ['Mahindra 575 DI', 'Mahindra 275 DI']
  }
];

export const SAMPLE_SERVICE_CENTERS: ServiceCenterListing[] = [
  {
    id: 'sc-1',
    businessName: 'Senthil Mahindra Tractor Authorized Service Center',
    category: 'service_center',
    categoryLabel: 'Tractor Service Center',
    ownerName: 'K. Senthil Kumar',
    phone: '+91 98940 11223',
    whatsapp: '919894011223',
    address: 'Plot 14, APMC Industrial Zone, Trichy Road, Tamil Nadu',
    district: 'Tiruchirappalli',
    state: 'Tamil Nadu',
    distanceKm: 3.4,
    latitude: 10.7905,
    longitude: 78.7047,
    isOpen: true,
    openHours: '08:00 AM - 07:30 PM',
    rating: 4.9,
    reviewCount: 128,
    isVerified: true,
    availableServices: ['Tractor Engine Overhaul', 'Hydraulic Pump Repair', 'Clutch Replacement', 'On-Field Emergency Repair'],
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'sc-2',
    businessName: 'Murugan Heavy Machinery Repairs & On-Field Mechanic',
    category: 'technician',
    categoryLabel: 'Authorized Agri Mechanic',
    ownerName: 'M. Murugan',
    phone: '+91 97890 12345',
    whatsapp: '919789012345',
    address: 'Kovilpatti Village Bypass, Kovilpatti, Tamil Nadu',
    district: 'Thoothukudi',
    state: 'Tamil Nadu',
    distanceKm: 4.8,
    latitude: 9.1717,
    longitude: 77.8687,
    isOpen: true,
    openHours: '24/7 Emergency Dispatch',
    rating: 4.8,
    reviewCount: 94,
    isVerified: true,
    availableServices: ['Tractor Hydraulic Hose Replacement', 'Diesel Engine Calibration', 'Harvester Cutter Alignment'],
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'sc-3',
    businessName: 'Kisan Spare Parts & Motor Depot',
    category: 'spare_parts_shop',
    categoryLabel: 'Spare Parts Store',
    ownerName: 'R. Kausalya',
    phone: '+91 98430 55667',
    whatsapp: '919843055667',
    address: 'Subhash Road, Madurai Wholesale Hub, Tamil Nadu',
    district: 'Madurai',
    state: 'Tamil Nadu',
    distanceKm: 6.2,
    latitude: 9.9252,
    longitude: 78.1198,
    isOpen: true,
    openHours: '09:00 AM - 08:00 PM',
    rating: 4.7,
    reviewCount: 67,
    isVerified: true,
    availableServices: ['Tractor Engine Parts', 'Hydraulic Fittings', 'V-Belts & Filters', 'Submersible Pump Spares'],
    availableProducts: ['Gates Hoses', 'Luk Clutch', 'Bosch Filters', 'SKF Bearings'],
    imageUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'sc-4',
    businessName: 'TNAU Certified Fertilizer & Bio-Input Kendra',
    category: 'fertilizer_shop',
    categoryLabel: 'Fertilizer & Bio-Input Shop',
    ownerName: 'Dr. S. Sundararajan',
    phone: '+91 98421 55432',
    whatsapp: '919842155432',
    address: 'Near Government APMC Mandi, Tiruvallur, Tamil Nadu',
    district: 'Tiruvallur',
    state: 'Tamil Nadu',
    distanceKm: 2.9,
    latitude: 13.1432,
    longitude: 79.9085,
    isOpen: true,
    openHours: '08:30 AM - 07:00 PM',
    rating: 4.9,
    reviewCount: 154,
    isVerified: true,
    availableServices: ['Government Subsidized Fertilizer', 'Soil Testing Sample Collection', 'Organic Neem Cake'],
    availableProducts: ['IFFCO NPK 19-19-19', 'Neem Cake 50kg', 'Azospirillum Bio-NPK', 'Micronutrient Mixture'],
    imageUrl: 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'sc-5',
    businessName: 'Cauvery Pioneer Seed Depot & Nursery',
    category: 'seed_shop',
    categoryLabel: 'Verified Seed Shop',
    ownerName: 'V. Ramanathan',
    phone: '+91 94432 44556',
    whatsapp: '919443244556',
    address: 'Railway Station Road, Kanchipuram, Tamil Nadu',
    district: 'Kanchipuram',
    state: 'Tamil Nadu',
    distanceKm: 5.5,
    latitude: 12.8342,
    longitude: 79.7036,
    isOpen: true,
    openHours: '08:00 AM - 08:00 PM',
    rating: 4.8,
    reviewCount: 89,
    isVerified: true,
    availableServices: ['Certified Paddy Seeds', 'Hybrid Vegetable Seeds', 'Fruit Saplings & Grafted Plants'],
    availableProducts: ['CR 1009 Sub1 Paddy', 'PKM-1 Tomato', 'Hybrid Chilli', 'Ragi & Millet Seeds'],
    imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=500&q=80'
  }
];

export const INITIAL_LAND_PARCELS: LandParcel[] = [
  {
    id: 'land-1',
    parcelName: 'North Paddy Field - Farm 1',
    surveyNumber: '142 / 2A',
    subdivisionNumber: '2A1',
    village: 'Kovilpatti Village',
    taluk: 'Kovilpatti',
    district: 'Thoothukudi',
    state: 'Tamil Nadu',
    pattaNumber: 'PATTA-98421',
    chittaNotes: 'Registered dry/wet agricultural land holding. Primary cultivation of Paddy (Samba season) and Groundnut rotational crop.',
    areaAcres: 2.5,
    ownershipType: 'Self-Owned',
    currentCrop: 'CR 1009 Paddy',
    soilType: 'Red Loamy Soil',
    irrigationSource: 'Borewell',
    boundaryCoords: [
      [77.8650, 9.1710],
      [77.8685, 9.1712],
      [77.8682, 9.1685],
      [77.8648, 9.1683]
    ],
    createdAt: '2026-01-10T10:00:00Z'
  },
  {
    id: 'land-2',
    parcelName: 'South Vegetable Garden - Farm 2',
    surveyNumber: '89 / 4B',
    subdivisionNumber: '4B2',
    village: 'Vellore West Village',
    taluk: 'Katpadi',
    district: 'Vellore',
    state: 'Tamil Nadu',
    pattaNumber: 'PATTA-44312',
    chittaNotes: 'High-density micro-drip irrigated horticulture parcel for PKM-1 Tomato and Chilli.',
    areaAcres: 1.2,
    ownershipType: 'Self-Owned',
    currentCrop: 'Tomato (PKM 1)',
    soilType: 'Black Clay Soil',
    irrigationSource: 'Drip System',
    boundaryCoords: [
      [79.1310, 12.9150],
      [79.1340, 12.9152],
      [79.1338, 12.9130],
      [79.1308, 12.9128]
    ],
    createdAt: '2026-02-05T14:30:00Z'
  }
];
