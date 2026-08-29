import {
  VerificationStatusLevel,
  VerificationApplication,
  VerificationAuditLog,
  RoleVerificationData,
  UserRole,
  UserProfile,
  FarmerOnboardingData,
  BusinessOnboardingData,
  ScholarOnboardingData,
  InstitutionOnboardingData,
  BankOnboardingData,
} from '../types';

const STORAGE_KEY = 'agriveda_verification_apps_v1';

// Initial pre-seeded mock verification applications across all roles
export const initialVerificationApplications: VerificationApplication[] = [
  {
    id: 'app-farmer-101',
    userId: 'user-ravi-123',
    applicantName: 'Ravi Kumar',
    role: 'farmer',
    email: 'farmer.ravi@agriveda.io',
    phone: '+91 98765 43210',
    status: 'ROLE_VERIFIED',
    submittedAt: '28 Aug 2026, 11:30 AM',
    data: {
      role: 'farmer',
      dpdpConsentAccepted: true,
      kycDeclarationAccepted: true,
      consentTimestamp: '2026-08-28T11:30:00Z',
      farmerData: {
        identityType: 'AADHAAR',
        identityNumber: 'XXXX-XXXX-8921',
        landSurveyNumber: 'TN-VEL-2024-88A',
        pattaChittaNumber: 'PC-991204',
        plotLocation: 'Vellore Sector 4, Tamil Nadu',
        gpsCoords: [79.1325, 12.9165],
        acreage: 2.5,
        irrigationSources: ['Drip Irrigation', 'Borewell / Tube Well'],
        soilType: 'Red Loamy Soil',
        soilHealthCardNumber: 'SHC-TN-44912',
        soilPh: 6.8,
        currentCrops: ['Tomato (Arka Rakshak)'],
        previousCrops: ['Groundnut', 'Finger Millet'],
        farmingPractice: 'Organic',
        expectedProductionQuintals: 180,
        bankDetails: {
          accountHolderName: 'Ravi Kumar',
          accountNumber: '••••••••4819',
          ifscCode: 'SBIN0001234',
          bankName: 'State Bank of India',
          branchName: 'Vellore ADB Branch',
          isVerified: true
        },
        farmlandPhotos: [
          {
            id: 'snap-1',
            imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80',
            title: 'North Plot - Tomato Drip Furrow',
            timestamp: '28 Aug 2026',
            coords: [79.1325, 12.9165],
            cropType: 'Tomato',
            soilCondition: 'Moist Red Loam'
          }
        ]
      }
    },
    auditLogs: [
      {
        id: 'log-1',
        timestamp: '28 Aug 2026, 11:15 AM',
        action: 'OTP_VERIFIED',
        actor: 'Applicant (+91 98765 43210)',
        details: 'Phone OTP verified successfully via SMS Gateway.',
        status: 'IDENTITY_VERIFIED'
      },
      {
        id: 'log-2',
        timestamp: '28 Aug 2026, 11:30 AM',
        action: 'APPLICATION_SUBMITTED',
        actor: 'Applicant (Ravi Kumar)',
        details: 'Farmland GPS plot, Land survey & bank account submitted.',
        status: 'ROLE_VERIFIED'
      }
    ]
  },
  {
    id: 'app-biz-202',
    userId: 'user-apex-agri',
    applicantName: 'Vikramaditya Sharma',
    role: 'business',
    email: 'procurement@apexagrifoods.in',
    phone: '+91 98111 22334',
    status: 'FULLY_VERIFIED',
    submittedAt: '25 Aug 2026, 02:45 PM',
    reviewedAt: '26 Aug 2026, 10:00 AM',
    reviewerNotes: 'GSTIN 07AAAAA0000A1Z5 & FSSAI verified against MCA portal.',
    data: {
      role: 'business',
      dpdpConsentAccepted: true,
      kycDeclarationAccepted: true,
      consentTimestamp: '2026-08-25T14:45:00Z',
      businessData: {
        businessName: 'Apex AgriFoods & Milling Corp',
        businessType: 'Pvt Ltd',
        ownerName: 'Vikramaditya Sharma',
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
          accountNumber: '••••••••9921',
          ifscCode: 'HDFC0000045',
          bankName: 'HDFC Bank',
          branchName: 'Agro Commercial Branch',
          isVerified: true
        }
      }
    },
    auditLogs: [
      {
        id: 'log-b1',
        timestamp: '25 Aug 2026, 02:45 PM',
        action: 'APPLICATION_SUBMITTED',
        actor: 'Applicant (Vikramaditya Sharma)',
        details: 'Submitted GSTIN, CIN, and storage capacity parameters.',
        status: 'ROLE_VERIFIED'
      },
      {
        id: 'log-b2',
        timestamp: '26 Aug 2026, 10:00 AM',
        action: 'ADMIN_APPROVED',
        actor: 'Compliance Officer (AgriVeda B2B)',
        details: 'Approved to FULLY_VERIFIED after automated GSTIN portal validation.',
        status: 'FULLY_VERIFIED'
      }
    ]
  },
  {
    id: 'app-scholar-303',
    userId: 'user-ananya-iari',
    applicantName: 'Dr. Ananya Sen',
    role: 'researcher',
    email: 'ananya.sen@iari.res.in',
    phone: '+91 94333 44556',
    status: 'ROLE_VERIFIED',
    submittedAt: '27 Aug 2026, 04:20 PM',
    data: {
      role: 'researcher',
      dpdpConsentAccepted: true,
      kycDeclarationAccepted: true,
      consentTimestamp: '2026-08-27T16:20:00Z',
      scholarData: {
        studentOrResearcherId: 'IARI-AGRON-2024-91',
        universityName: 'ICAR - Indian Agricultural Research Institute (IARI)',
        institutionAddress: 'Pusa Campus, New Delhi, India 110012',
        department: 'Division of Agronomy & Crop Physiology',
        programType: 'Ph.D. Soil Science',
        academicYear: 'Final Year (2024-2027)',
        guideOrSupervisorName: 'Dr. K. Swaminathan',
        guideDesignation: 'Principal Scientist & HOD',
        guideEmail: 'k.swaminathan@iari.res.in',
        researchArea: 'Microbiome-assisted Climate Resilient Soil Nitrogen Fixation',
        publishedPapersCount: 4
      }
    },
    auditLogs: [
      {
        id: 'log-s1',
        timestamp: '27 Aug 2026, 04:20 PM',
        action: 'APPLICATION_SUBMITTED',
        actor: 'Applicant (Dr. Ananya Sen)',
        details: 'Academic credentials and supervisor verification submitted.',
        status: 'ROLE_VERIFIED'
      }
    ]
  },
  {
    id: 'app-inst-404',
    userId: 'user-tnau-lab',
    applicantName: 'Tamil Nadu Agricultural University (TNAU)',
    role: 'institute',
    email: 'dean.agriculture@tnau.ac.in',
    phone: '+91 422 661 1200',
    status: 'FULLY_VERIFIED',
    submittedAt: '20 Aug 2026, 09:00 AM',
    reviewedAt: '21 Aug 2026, 11:30 AM',
    reviewerNotes: 'ICAR / UGC State Agricultural University accreditation confirmed.',
    data: {
      role: 'institute',
      dpdpConsentAccepted: true,
      kycDeclarationAccepted: true,
      consentTimestamp: '2026-08-20T09:00:00Z',
      institutionData: {
        institutionName: 'Tamil Nadu Agricultural University (TNAU)',
        institutionType: 'Agricultural University',
        authorizedRepresentativeName: 'Prof. M. R. Geethalakshmi',
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
          accountNumber: '••••••••7710',
          ifscCode: 'SBIN0002235',
          bankName: 'State Bank of India',
          branchName: 'TNAU Campus Branch',
          isVerified: true
        }
      }
    },
    auditLogs: [
      {
        id: 'log-i1',
        timestamp: '21 Aug 2026, 11:30 AM',
        action: 'ADMIN_APPROVED',
        actor: 'Chief Agronomist & Registrar',
        details: 'Institutional credentials verified against ICAR directory.',
        status: 'FULLY_VERIFIED'
      }
    ]
  },
  {
    id: 'app-bank-505',
    userId: 'user-sbi-agri',
    applicantName: 'State Bank of India (Agri Development Branch)',
    role: 'loan-officer',
    email: 'agri.development@sbi.co.in',
    phone: '+91 1800 1234 56',
    status: 'FULLY_VERIFIED',
    submittedAt: '18 Aug 2026, 10:30 AM',
    reviewedAt: '19 Aug 2026, 04:00 PM',
    reviewerNotes: 'RBI Banking License & SLBC IFSC authorization verified.',
    data: {
      role: 'loan-officer',
      dpdpConsentAccepted: true,
      kycDeclarationAccepted: true,
      consentTimestamp: '2026-08-18T10:30:00Z',
      bankData: {
        bankName: 'State Bank of India',
        bankCategory: 'Public Sector Bank',
        authorizedOfficerName: 'Rameshwar Dayal',
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
      }
    },
    auditLogs: [
      {
        id: 'log-bk1',
        timestamp: '19 Aug 2026, 04:00 PM',
        action: 'ADMIN_APPROVED',
        actor: 'Chief Risk & Compliance Officer',
        details: 'Banking license and CRILC reporting endpoint activated.',
        status: 'FULLY_VERIFIED'
      }
    ]
  }
];

export class VerificationEngine {
  /**
   * Load all stored verification applications
   */
  static getApplications(): VerificationApplication[] {
    if (typeof window === 'undefined') return initialVerificationApplications;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialVerificationApplications));
        return initialVerificationApplications;
      }
      return JSON.parse(raw);
    } catch (e) {
      console.warn('Error reading verification applications:', e);
      return initialVerificationApplications;
    }
  }

  /**
   * Save all verification applications
   */
  static saveApplications(apps: VerificationApplication[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(apps));
    } catch (e) {
      console.error('Error saving verification applications:', e);
    }
  }

  /**
   * Submit a new verification application
   */
  static submitApplication(
    user: { id: string; name: string; email: string; phone: string },
    data: RoleVerificationData
  ): VerificationApplication {
    const apps = this.getApplications();
    const appId = `app-${data.role}-${Date.now()}`;

    const newApp: VerificationApplication = {
      id: appId,
      userId: user.id,
      applicantName: user.name,
      role: data.role,
      email: user.email,
      phone: user.phone,
      status: 'ROLE_VERIFIED',
      submittedAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      data,
      auditLogs: [
        {
          id: `log-${Date.now()}-1`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          action: 'IDENTITY_VERIFIED',
          actor: `Applicant (${user.phone})`,
          details: 'Mobile & Email OTP multi-factor challenge authenticated.',
          status: 'IDENTITY_VERIFIED'
        },
        {
          id: `log-${Date.now()}-2`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          action: 'ROLE_ONBOARDING_COMPLETED',
          actor: `Applicant (${user.name})`,
          details: `Role specific credentials and KYC documents uploaded for ${data.role}.`,
          status: 'ROLE_VERIFIED'
        }
      ]
    };

    const updated = [newApp, ...apps.filter(a => a.userId !== user.id)];
    this.saveApplications(updated);
    return newApp;
  }

  /**
   * Admin approves an application to FULLY_VERIFIED
   */
  static approveApplication(
    appId: string,
    reviewerName: string,
    notes: string
  ): VerificationApplication | null {
    const apps = this.getApplications();
    const app = apps.find(a => a.id === appId);
    if (!app) return null;

    app.status = 'FULLY_VERIFIED';
    app.reviewedAt = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    app.reviewerNotes = notes || 'All identity proofs, cadastral records and role accreditations verified.';

    app.auditLogs.push({
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      action: 'ADMIN_APPROVED',
      actor: reviewerName || 'Admin Reviewer',
      details: notes || 'Application approved to Fully Verified status.',
      status: 'FULLY_VERIFIED'
    });

    this.saveApplications(apps);
    return app;
  }

  /**
   * Admin rejects or requests action on an application
   */
  static rejectOrRequestAction(
    appId: string,
    reviewerName: string,
    status: 'REJECTED' | 'ACTION_REQUIRED',
    notes: string
  ): VerificationApplication | null {
    const apps = this.getApplications();
    const app = apps.find(a => a.id === appId);
    if (!app) return null;

    app.status = status;
    app.reviewedAt = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    app.reviewerNotes = notes;

    app.auditLogs.push({
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      action: status === 'REJECTED' ? 'APPLICATION_REJECTED' : 'ACTION_REQUIRED',
      actor: reviewerName || 'Admin Reviewer',
      details: notes,
      status
    });

    this.saveApplications(apps);
    return app;
  }

  /**
   * Calculate human-readable status metadata
   */
  static getStatusMeta(status?: VerificationStatusLevel) {
    switch (status) {
      case 'FULLY_VERIFIED':
        return {
          label: 'Fully Verified',
          badgeText: '🛡️ Verified',
          badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40',
          textColor: 'text-emerald-400',
          progress: 100,
          description: 'Official digital identity, land records & bank credentials verified.'
        };
      case 'ROLE_VERIFIED':
        return {
          label: 'Role Verified',
          badgeText: '✓ Role Verified',
          badgeClass: 'bg-blue-500/20 text-blue-300 border-blue-400/40',
          textColor: 'text-blue-400',
          progress: 75,
          description: 'Role parameters submitted. Awaiting final institutional sign-off.'
        };
      case 'IDENTITY_VERIFIED':
        return {
          label: 'Identity Verified',
          badgeText: 'OTP Verified',
          badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-400/40',
          textColor: 'text-amber-400',
          progress: 50,
          description: 'Mobile & Email OTP verified. Role-specific documents required.'
        };
      case 'PENDING_REVIEW':
        return {
          label: 'Pending Review',
          badgeText: '⏳ In Review',
          badgeClass: 'bg-yellow-500/20 text-yellow-300 border-yellow-400/40',
          textColor: 'text-yellow-400',
          progress: 60,
          description: 'Under administrative compliance audit.'
        };
      case 'ACTION_REQUIRED':
        return {
          label: 'Action Required',
          badgeText: '⚠️ Action Needed',
          badgeClass: 'bg-orange-500/20 text-orange-300 border-orange-400/40',
          textColor: 'text-orange-400',
          progress: 40,
          description: 'Additional documentation requested by reviewer.'
        };
      case 'REJECTED':
        return {
          label: 'Rejected',
          badgeText: '✕ Rejected',
          badgeClass: 'bg-rose-500/20 text-rose-300 border-rose-400/40',
          textColor: 'text-rose-400',
          progress: 10,
          description: 'Application was rejected during compliance audit.'
        };
      default:
        return {
          label: 'Registered',
          badgeText: 'Unverified',
          badgeClass: 'bg-slate-700/50 text-slate-300 border-slate-600',
          textColor: 'text-slate-400',
          progress: 25,
          description: 'Basic account created. Complete verification to unlock all modules.'
        };
    }
  }

  /**
   * RBAC Permissions checker
   */
  static getRolePermissions(role?: UserRole, status?: VerificationStatusLevel) {
    const isFullyVerified = status === 'FULLY_VERIFIED';
    const isRoleVerified = status === 'ROLE_VERIFIED' || isFullyVerified;

    return {
      canScanCrops: true,
      canAccessMarketPrices: true,
      canAccessMaps: true,
      canApplyForLoan: isRoleVerified && (role === 'farmer' || role === 'business'),
      canApproveLoans: isFullyVerified && role === 'loan-officer',
      canPostSeedBank: isRoleVerified && (role === 'farmer' || role === 'institute'),
      canPublishResearch: isRoleVerified && (role === 'researcher' || role === 'institute'),
      canBulkProcure: isRoleVerified && role === 'business',
      canAccessCadastreLayers: isRoleVerified,
      canExportCertifiedPDF: isRoleVerified,
      canAccessAdminVerificationConsole: true // demo interactive access
    };
  }
}
