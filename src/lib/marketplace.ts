import { addDoc, collection, doc, getDoc, getDocs, limit, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import { db } from './firebase';
import { MarketplaceProduct, PriceQuote, UserProfile } from '../types';

export interface MarketplaceListing extends MarketplaceProduct {
  ownerId: string;
  saleMode: 'retail' | 'wholesale' | 'both';
  isActive: boolean;
  createdAt?: unknown;
}

export interface MarketplaceOrder {
  id?: string;
  listingId: string;
  sellerId: string;
  buyerId: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  deliveryType: 'pickup' | 'delivery';
  status: 'requested' | 'accepted' | 'rejected' | 'fulfilled' | 'cancelled';
}

const listingsCollection = collection(db, 'marketplace_listings');

export async function getMarketplaceListings(): Promise<MarketplaceListing[]> {
  const snapshot = await getDocs(query(listingsCollection, where('isActive', '==', true), limit(80)));
  return snapshot.docs.map(item => ({ id: item.id, ...item.data() } as MarketplaceListing));
}

export async function createMarketplaceListing(ownerId: string, profile: UserProfile, listing: Omit<MarketplaceListing, 'id' | 'ownerId' | 'seller' | 'location' | 'createdAt'>) {
  return addDoc(listingsCollection, { ...listing, ownerId, seller: profile.name, location: profile.location, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
}

export async function setListingActive(listingId: string, isActive: boolean) {
  return updateDoc(doc(db, 'marketplace_listings', listingId), { isActive, updatedAt: serverTimestamp() });
}

export async function createPriceQuote(buyerId: string, profile: UserProfile, product: MarketplaceProduct, quotedPrice: number, quantity = 100) {
  return addDoc(collection(db, 'marketplace_quotes'), { listingId: product.id, sellerId: (product as MarketplaceListing).ownerId || 'demo-seller', buyerId, buyerName: profile.name, product: product.name, quantity, unit: product.unit, quotedPrice, status: 'Open', createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
}

export async function respondToPriceQuote(quoteId: string, status: 'Responded' | 'Accepted', responsePrice?: number) {
  return updateDoc(doc(db, 'marketplace_quotes', quoteId), { status, ...(responsePrice ? { responsePrice } : {}), updatedAt: serverTimestamp() });
}

export async function getMyQuotes(userId: string): Promise<PriceQuote[]> {
  const buyerSnapshot = await getDocs(query(collection(db, 'marketplace_quotes'), where('buyerId', '==', userId), limit(50)));
  const sellerSnapshot = await getDocs(query(collection(db, 'marketplace_quotes'), where('sellerId', '==', userId), limit(50)));
  const unique = new Map([...buyerSnapshot.docs, ...sellerSnapshot.docs].map(item => [item.id, item]));
  return [...unique.values()].map(item => { const data = item.data(); return { id: item.id, product: data.product, quantity: `${data.quantity} ${data.unit}`, buyer: data.buyerName, quotedPrice: data.quotedPrice, status: data.status } as PriceQuote; });
}

export async function createMarketplaceOrder(order: MarketplaceOrder) {
  return addDoc(collection(db, 'marketplace_orders'), { ...order, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
}

export async function getVendorProfile(userId: string) {
  const snapshot = await getDoc(doc(db, 'vendor_profiles', userId));
  return snapshot.exists() ? snapshot.data() : null;
}

export async function submitVendorProfile(userId: string, profile: UserProfile, businessName: string, gstin = '') {
  return setDoc(doc(db, 'vendor_profiles', userId), { userId, businessName, gstin, role: profile.role, location: profile.location, verificationStatus: 'pending', updatedAt: serverTimestamp() }, { merge: true });
}
