import { UserProfile, UserRole, Language } from '../types';
import { initialUserProfile } from '../data/mockData';

export interface RegisteredAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  passwordHash: string; // Plain/hashed comparison for browser demonstration
  role: UserRole;
  location: string;
  farmId?: string;
  farmSizeAcres?: number;
  primaryCrop?: string;
  soilType?: string;
  language: Language;
  avatarUrl: string;
  verificationStatus?: 'REGISTERED' | 'IDENTITY_VERIFIED' | 'ROLE_VERIFIED' | 'FULLY_VERIFIED';
  registeredAt: string;
}

const STORAGE_KEY_USERS = 'agriveda_registered_users_v2';
const STORAGE_KEY_SESSION = 'agriveda_active_session_v2';

export const SEEDED_ACCOUNTS: RegisteredAccount[] = [
  {
    id: 'user-farmer-1',
    name: 'Ravi Kumar',
    email: 'farmer.ravi@agriveda.io',
    phone: '9876543210',
    passwordHash: 'AgriVeda@2026',
    role: 'farmer',
    location: 'Vellore, Tamil Nadu, India',
    farmId: 'FARM-12345',
    farmSizeAcres: 2.5,
    primaryCrop: 'Tomato',
    soilType: 'Red Loamy Soil',
    language: 'en',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
    verificationStatus: 'FULLY_VERIFIED',
    registeredAt: '2026-01-15T08:30:00Z'
  },
  {
    id: 'user-buyer-1',
    name: 'K. Balasubramaniam',
    email: 'buyer.balaji@agriveda.io',
    phone: '9443244556',
    passwordHash: 'AgriVeda@2026',
    role: 'business',
    location: 'Chennai Wholesale Hub, Tamil Nadu',
    farmId: 'B2B-CORP-889',
    farmSizeAcres: 0,
    primaryCrop: 'Bulk Produce Procurement',
    soilType: 'N/A',
    language: 'en',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=250&q=80',
    verificationStatus: 'ROLE_VERIFIED',
    registeredAt: '2026-02-10T10:15:00Z'
  },
  {
    id: 'user-scholar-1',
    name: 'Dr. Ananya Swaminathan',
    email: 'scholar.ananya@agriveda.io',
    phone: '9842155432',
    passwordHash: 'AgriVeda@2026',
    role: 'research_scholar',
    location: 'TNAU Agronomy Campus, Coimbatore',
    farmId: 'RES-TNAU-042',
    farmSizeAcres: 10.0,
    primaryCrop: 'Drought Resistant Millets',
    soilType: 'Black Cotton Soil',
    language: 'en',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80',
    verificationStatus: 'FULLY_VERIFIED',
    registeredAt: '2026-03-01T14:00:00Z'
  },
  {
    id: 'user-bank-1',
    name: 'V. Srinivasa Rao (NABARD / SBI)',
    email: 'bank.nodal@agriveda.io',
    phone: '9848012345',
    passwordHash: 'AgriVeda@2026',
    role: 'financial_institution',
    location: 'Regional Agricultural Credit Cell, Guntur',
    farmId: 'BANK-NABARD-01',
    farmSizeAcres: 0,
    primaryCrop: 'Kisan Credit Card (KCC) Officer',
    soilType: 'N/A',
    language: 'en',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=250&q=80',
    verificationStatus: 'FULLY_VERIFIED',
    registeredAt: '2026-01-20T09:00:00Z'
  },
  {
    id: 'user-govt-1',
    name: 'Thiru. M. Senthil Kumar (APMC Officer)',
    email: 'govt.senthil@agriveda.io',
    phone: '9443188900',
    passwordHash: 'AgriVeda@2026',
    role: 'government',
    location: 'APMC Market Committee, Vellore',
    farmId: 'GOVT-TN-AGRI-07',
    farmSizeAcres: 0,
    primaryCrop: 'Department of Agriculture Supervision',
    soilType: 'N/A',
    language: 'ta',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80',
    verificationStatus: 'FULLY_VERIFIED',
    registeredAt: '2026-02-01T11:30:00Z'
  }
];

export class AuthService {
  /**
   * Fetch all registered accounts (seeded + newly registered in localStorage)
   */
  static getRegisteredAccounts(): RegisteredAccount[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_USERS);
      if (!stored) {
        localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(SEEDED_ACCOUNTS));
        return SEEDED_ACCOUNTS;
      }
      const parsed: RegisteredAccount[] = JSON.parse(stored);
      // Ensure seeded accounts are always included
      const merged = [...SEEDED_ACCOUNTS];
      parsed.forEach(p => {
        if (!merged.some(m => m.id === p.id || (m.email && m.email.toLowerCase() === p.email?.toLowerCase()) || m.phone === p.phone)) {
          merged.push(p);
        }
      });
      return merged;
    } catch {
      return SEEDED_ACCOUNTS;
    }
  }

  /**
   * Save an account into the persistent registry
   */
  static registerAccount(accountData: Partial<RegisteredAccount> & { password?: string }): { success: boolean; error?: string; account?: RegisteredAccount } {
    const accounts = this.getRegisteredAccounts();
    const cleanPhone = (accountData.phone || '').replace(/\D/g, '').slice(-10);
    const cleanEmail = (accountData.email || '').trim().toLowerCase();

    // Check existing
    const existing = accounts.find(a => 
      (cleanEmail && a.email.toLowerCase() === cleanEmail) ||
      (cleanPhone && a.phone.replace(/\D/g, '').slice(-10) === cleanPhone)
    );

    if (existing) {
      return { success: false, error: 'An account with this email or mobile number already exists.' };
    }

    const newAccount: RegisteredAccount = {
      id: `user-${Date.now()}`,
      name: accountData.name || 'AgriVeda User',
      email: cleanEmail || `${cleanPhone}@agriveda.io`,
      phone: cleanPhone || '9876543210',
      passwordHash: accountData.password || accountData.passwordHash || 'AgriVeda@2026',
      role: accountData.role || 'farmer',
      location: accountData.location || 'Tamil Nadu, India',
      farmId: accountData.farmId || `FARM-${Math.floor(10000 + Math.random() * 90000)}`,
      farmSizeAcres: accountData.farmSizeAcres || 2.0,
      primaryCrop: accountData.primaryCrop || 'Paddy / Rice',
      soilType: accountData.soilType || 'Red Soil',
      language: accountData.language || 'en',
      avatarUrl: accountData.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
      verificationStatus: 'REGISTERED',
      registeredAt: new Date().toISOString()
    };

    const updated = [...accounts, newAccount];
    try {
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save registered user:', e);
    }

    return { success: true, account: newAccount };
  }

  /**
   * Real Authentication Validator
   * Checks Email or Phone + Password against persistent accounts
   */
  static authenticateUser(identifier: string, passwordInput: string): { success: boolean; error?: string; profile?: UserProfile } {
    if (!identifier || !identifier.trim()) {
      return { success: false, error: 'Please enter your registered Email or Mobile Number.' };
    }
    if (!passwordInput || !passwordInput.trim()) {
      return { success: false, error: 'Please enter your account password.' };
    }

    const cleanInput = identifier.trim().toLowerCase();
    const cleanDigits = identifier.replace(/\D/g, '').slice(-10);
    const accounts = this.getRegisteredAccounts();

    // Find account by Email or Phone
    const matchedAccount = accounts.find(acc => {
      const matchEmail = acc.email && acc.email.toLowerCase() === cleanInput;
      const accDigits = acc.phone.replace(/\D/g, '').slice(-10);
      const matchPhone = cleanDigits && cleanDigits.length === 10 && accDigits === cleanDigits;
      return matchEmail || matchPhone;
    });

    if (!matchedAccount) {
      return { 
        success: false, 
        error: `No registered account found matching "${identifier}". Please check your mobile/email or create a new account.` 
      };
    }

    // Check Password match
    // Note: Accepts both the exact password or demo convenience aliases
    const isValidPassword = 
      matchedAccount.passwordHash === passwordInput ||
      passwordInput === 'AgriVeda@2026' ||
      (matchedAccount.role === 'farmer' && passwordInput === 'farmer123') ||
      (matchedAccount.role === 'business' && passwordInput === 'buyer123') ||
      (matchedAccount.role === 'research_scholar' && passwordInput === 'scholar123') ||
      (matchedAccount.role === 'financial_institution' && passwordInput === 'bank123') ||
      (matchedAccount.role === 'government' && passwordInput === 'govt123');

    if (!isValidPassword) {
      return { 
        success: false, 
        error: 'Incorrect password entered. Please check your password and try again.' 
      };
    }

    // Build User Profile
    const profile: UserProfile = {
      id: matchedAccount.id,
      name: matchedAccount.name,
      phone: matchedAccount.phone,
      email: matchedAccount.email,
      location: matchedAccount.location,
      farmId: matchedAccount.farmId || 'FARM-12345',
      farmSizeAcres: matchedAccount.farmSizeAcres || 2.5,
      primaryCrop: matchedAccount.primaryCrop || 'Tomato',
      soilType: matchedAccount.soilType || 'Red Loamy Soil',
      language: matchedAccount.language || 'en',
      avatarUrl: matchedAccount.avatarUrl,
      role: matchedAccount.role,
      verificationStatus: (matchedAccount.verificationStatus as any) || 'FULLY_VERIFIED',
      verificationScore: 92
    };

    // Save active session
    this.saveCurrentSession(profile);

    return { success: true, profile };
  }

  /**
   * Save active user session
   */
  static saveCurrentSession(profile: UserProfile): void {
    try {
      localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(profile));
    } catch {}
  }

  /**
   * Retrieve active user session
   */
  static getCurrentSession(): UserProfile | null {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_SESSION);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {}
    return null;
  }

  /**
   * Clear active user session on signout
   */
  static clearCurrentSession(): void {
    try {
      localStorage.removeItem(STORAGE_KEY_SESSION);
    } catch {}
  }
}
