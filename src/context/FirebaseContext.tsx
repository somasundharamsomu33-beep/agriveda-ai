import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithPopup, signOut as fbSignOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile as fbUpdateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc, collection, onSnapshot, query, where, orderBy, addDoc, updateDoc } from 'firebase/firestore';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from '../lib/firebase';
import { UserProfile, CropDiagnosisReport, CommunityPost, CommunityReply } from '../types';
import { initialUserProfile } from '../data/mockData';
import { getPendingQueue, removePendingQueueItem, queueOfflineAction, requestBackgroundSync } from '../lib/offlineStorage';

interface SyncNotice {
  message: string;
  type: 'success' | 'info' | 'error';
}

interface FirebaseContextType {
  user: User | null;
  loading: boolean;
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  savedReports: CropDiagnosisReport[];
  saveReport: (report: CropDiagnosisReport) => Promise<void>;
  communityPosts: CommunityPost[];
  addCommunityPost: (question: string, cropContext?: string, imageUrl?: string) => Promise<void>;
  addReplyToPost: (postId: string, text: string, imageUrl?: string, adviceCategory?: string, isExpert?: boolean) => Promise<void>;
  subscribeToPostReplies: (postId: string, onUpdate: (replies: CommunityReply[]) => void) => () => void;
  likePost: (postId: string) => Promise<void>;
  likeReply: (postId: string, replyId: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name: string, location?: string) => Promise<void>;
  logout: () => Promise<void>;
  syncPendingReportsToFirestore: () => Promise<number>;
  syncNotice: SyncNotice | null;
  clearSyncNotice: () => void;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile>(initialUserProfile);
  const [savedReports, setSavedReports] = useState<CropDiagnosisReport[]>([]);
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>([]);
  const [syncNotice, setSyncNotice] = useState<SyncNotice | null>(null);

  const clearSyncNotice = () => setSyncNotice(null);

  // Background Sync Processor: Automatically pushes pending crop reports and queue items to Firestore
  const syncPendingReportsToFirestore = async (): Promise<number> => {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      console.log('[Background Sync] Device currently offline. Sync delayed.');
      return 0;
    }

    const queue = getPendingQueue();
    if (!queue || queue.length === 0) return 0;

    let syncedCount = 0;
    console.log(`[Background Sync] Online! Syncing ${queue.length} pending report(s) to Firestore...`);

    for (const item of queue) {
      try {
        if (item.type === 'SCAN' && item.payload) {
          const report = item.payload as CropDiagnosisReport;
          const path = 'reports';
          await addDoc(collection(db, path), {
            userId: user ? user.uid : 'offline_farmer',
            reportId: report.id,
            cropType: report.cropType,
            soilType: report.soilType,
            location: report.location,
            imageUrl: report.imageUrl,
            detectedIssue: report.detectedIssue,
            confidence: report.confidence,
            riskLevel: report.riskLevel,
            farmHealthScore: report.farmHealthScore,
            cause: report.cause,
            treatment: report.treatment,
            prevention: report.prevention,
            fertilizerSuggestion: report.fertilizerSuggestion,
            aiNotes: report.aiNotes || '',
            createdAt: item.timestamp || new Date().toISOString()
          });
          removePendingQueueItem(item.id);
          syncedCount++;
        } else if (item.type === 'COMMUNITY_POST' && item.payload) {
          const { question, cropContext, imageUrl } = item.payload;
          const path = 'community_posts';
          await addDoc(collection(db, path), {
            authorId: user ? user.uid : 'anonymous',
            authorName: profile.name,
            authorLocation: profile.location,
            authorAvatar: profile.avatarUrl,
            question,
            cropContext: cropContext || profile.primaryCrop,
            imageUrl: imageUrl || '',
            likesCount: 0,
            repliesCount: 0,
            createdAt: item.timestamp || new Date().toISOString()
          });
          removePendingQueueItem(item.id);
          syncedCount++;
        }
      } catch (err) {
        console.error('[Background Sync] Exception pushing pending report to Firestore:', item, err);
      }
    }

    if (syncedCount > 0) {
      setSyncNotice({
        message: `Background Sync Complete: Auto-pushed ${syncedCount} pending crop report(s) to Firestore!`,
        type: 'success'
      });
      setTimeout(() => setSyncNotice(null), 7000);
    }

    return syncedCount;
  };

  // Register listeners for Service Worker sync messages & online network events
  useEffect(() => {
    const handleSWMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'SYNC_PENDING_REPORTS') {
        console.log('[FirebaseContext] Received SYNC_PENDING_REPORTS signal from Service Worker');
        syncPendingReportsToFirestore();
      }
    };

    const handleOnline = () => {
      console.log('[FirebaseContext] Device online event captured. Initiating background sync...');
      syncPendingReportsToFirestore();
    };

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', handleSWMessage);
    }
    window.addEventListener('online', handleOnline);

    // Initial check when component mounts if online
    if (typeof navigator !== 'undefined' && navigator.onLine) {
      syncPendingReportsToFirestore();
    }

    return () => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener('message', handleSWMessage);
      }
      window.removeEventListener('online', handleOnline);
    };
  }, [user, profile]);

  // Listen to Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Load or create User profile document in Firestore
        const userDocRef = doc(db, 'users', currentUser.uid);
        try {
          const snap = await getDoc(userDocRef);
          if (snap.exists()) {
            const data = snap.data();
            setProfile(prev => ({
              ...prev,
              name: data.name || currentUser.displayName || prev.name,
              location: data.location || prev.location,
              phone: data.phone || currentUser.phoneNumber || prev.phone,
              avatarUrl: data.avatarUrl || currentUser.photoURL || prev.avatarUrl,
              farmId: data.farmId || prev.farmId,
              farmSizeAcres: data.farmSizeAcres || prev.farmSizeAcres,
              primaryCrop: data.primaryCrop || prev.primaryCrop,
              soilType: data.soilType || prev.soilType,
              language: data.language || prev.language
            }));
          } else {
            // Initial creation
            const newProfileData = {
              userId: currentUser.uid,
              name: currentUser.displayName || initialUserProfile.name,
              phone: currentUser.phoneNumber || initialUserProfile.phone,
              location: initialUserProfile.location,
              farmId: initialUserProfile.farmId,
              farmSizeAcres: initialUserProfile.farmSizeAcres,
              primaryCrop: initialUserProfile.primaryCrop,
              soilType: initialUserProfile.soilType,
              language: initialUserProfile.language,
              avatarUrl: currentUser.photoURL || initialUserProfile.avatarUrl,
              createdAt: new Date().toISOString()
            };
            await setDoc(userDocRef, newProfileData);
            setProfile(prev => ({
              ...prev,
              name: newProfileData.name,
              avatarUrl: newProfileData.avatarUrl
            }));
          }
        } catch (error) {
          console.error('Error reading/writing user doc:', error);
        }
      } else {
        // Reset to initial profile if signed out
        setProfile(initialUserProfile);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Update Firestore user profile whenever local profile changes and user is logged in
  useEffect(() => {
    if (!user) return;
    const updateProfileDoc = async () => {
      const userDocRef = doc(db, 'users', user.uid);
      try {
        await setDoc(userDocRef, {
          userId: user.uid,
          name: profile.name,
          phone: profile.phone,
          location: profile.location,
          farmId: profile.farmId,
          farmSizeAcres: profile.farmSizeAcres,
          primaryCrop: profile.primaryCrop,
          soilType: profile.soilType,
          language: profile.language,
          avatarUrl: profile.avatarUrl,
          updatedAt: new Date().toISOString()
        }, { merge: true });
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}`);
      }
    };

    updateProfileDoc();
  }, [profile, user]);

  // Sync Diagnosis Reports for logged in user
  useEffect(() => {
    if (!user) {
      setSavedReports([]);
      return;
    }

    const path = 'reports';
    const q = query(
      collection(db, path),
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const reportsList: CropDiagnosisReport[] = [];
        snapshot.forEach((docSnap) => {
          const d = docSnap.data();
          reportsList.push({
            id: docSnap.id,
            timestamp: d.createdAt ? new Date(d.createdAt).toLocaleDateString() : d.timestamp || 'Today',
            cropType: d.cropType || '',
            soilType: d.soilType || '',
            location: d.location || '',
            imageUrl: d.imageUrl || '',
            detectedIssue: d.detectedIssue || '',
            confidence: d.confidence || 90,
            riskLevel: d.riskLevel || 'Medium',
            farmHealthScore: d.farmHealthScore || 85,
            cause: d.cause || '',
            treatment: Array.isArray(d.treatment) ? d.treatment : [],
            prevention: Array.isArray(d.prevention) ? d.prevention : [],
            fertilizerSuggestion: d.fertilizerSuggestion || '',
            aiNotes: d.aiNotes || ''
          });
        });
        setSavedReports(reportsList);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, path);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Sync Community Posts
  useEffect(() => {
    const path = 'community_posts';
    const q = query(collection(db, path));

    const unsubscribe = onSnapshot(
      q,
      async (snapshot) => {
        const postsList: CommunityPost[] = [];
        snapshot.forEach((docSnap) => {
          const d = docSnap.data();
          postsList.push({
            id: docSnap.id,
            authorName: d.authorName || 'Farmer',
            authorLocation: d.authorLocation || 'Vellore, Tamil Nadu',
            authorAvatar: d.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
            timeAgo: d.createdAt ? new Date(d.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently',
            question: d.question || '',
            cropContext: d.cropContext || '',
            imageUrl: d.imageUrl || undefined,
            likesCount: d.likesCount || 0,
            repliesCount: d.repliesCount || 0,
            replies: []
          });
        });

        setCommunityPosts(postsList);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, path);
      }
    );

    return () => unsubscribe();
  }, []);

  // Save new crop report to Firestore (with Background Sync fallback)
  const saveReport = async (report: CropDiagnosisReport) => {
    const path = 'reports';

    // If device is offline, queue directly into local queue and register SW sync
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      console.log('[FirebaseContext] Device is offline. Queuing crop report for Service Worker Background Sync.');
      queueOfflineAction('SCAN', report);
      setSyncNotice({
        message: 'Report saved offline! Background sync registered — will push to Firestore once internet is restored.',
        type: 'info'
      });
      setTimeout(() => setSyncNotice(null), 6000);
      return;
    }

    try {
      await addDoc(collection(db, path), {
        userId: user ? user.uid : 'offline_farmer',
        reportId: report.id,
        cropType: report.cropType,
        soilType: report.soilType,
        location: report.location,
        imageUrl: report.imageUrl,
        detectedIssue: report.detectedIssue,
        confidence: report.confidence,
        riskLevel: report.riskLevel,
        farmHealthScore: report.farmHealthScore,
        cause: report.cause,
        treatment: report.treatment,
        prevention: report.prevention,
        fertilizerSuggestion: report.fertilizerSuggestion,
        aiNotes: report.aiNotes || '',
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      console.warn('[FirebaseContext] Direct Firestore push failed, queuing report for background sync:', error);
      queueOfflineAction('SCAN', report);
      setSyncNotice({
        message: 'Saved to local queue. Service Worker background sync will push to Firestore when reconnected.',
        type: 'info'
      });
      setTimeout(() => setSyncNotice(null), 6000);
    }
  };

  // Add Community Post
  const addCommunityPost = async (question: string, cropContext?: string, imageUrl?: string) => {
    const path = 'community_posts';
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      queueOfflineAction('COMMUNITY_POST', { question, cropContext, imageUrl });
      setSyncNotice({
        message: 'Question queued offline. Will post to community when online.',
        type: 'info'
      });
      setTimeout(() => setSyncNotice(null), 5000);
      return;
    }

    try {
      await addDoc(collection(db, path), {
        authorId: user ? user.uid : 'anonymous',
        authorName: profile.name,
        authorLocation: profile.location,
        authorAvatar: profile.avatarUrl,
        question,
        cropContext: cropContext || profile.primaryCrop,
        imageUrl: imageUrl || '',
        likesCount: 0,
        repliesCount: 0,
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      queueOfflineAction('COMMUNITY_POST', { question, cropContext, imageUrl });
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  // Reply to post with optional photo attachment, advice category & expert verification
  const addReplyToPost = async (
    postId: string,
    text: string,
    imageUrl?: string,
    adviceCategory?: string,
    isExpert: boolean = false
  ) => {
    const path = `community_posts/${postId}/replies`;
    try {
      await addDoc(collection(db, 'community_posts', postId, 'replies'), {
        postId,
        authorId: user ? user.uid : 'anonymous',
        authorName: profile.name,
        authorAvatar: profile.avatarUrl,
        authorLocation: profile.location,
        isExpert,
        adviceCategory: adviceCategory || 'General Advice',
        text,
        imageUrl: imageUrl || '',
        likes: 0,
        createdAt: new Date().toISOString()
      });
      // Increment reply count
      const postRef = doc(db, 'community_posts', postId);
      const postSnap = await getDoc(postRef);
      if (postSnap.exists()) {
        const currentReplies = postSnap.data().repliesCount || 0;
        await updateDoc(postRef, { repliesCount: currentReplies + 1 });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  // Real-time listener for discussion thread replies
  const subscribeToPostReplies = (postId: string, onUpdate: (replies: CommunityReply[]) => void) => {
    const repliesRef = collection(db, 'community_posts', postId, 'replies');
    const q = query(repliesRef, orderBy('createdAt', 'asc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const repliesList: CommunityReply[] = [];
        snapshot.forEach((docSnap) => {
          const d = docSnap.data();
          repliesList.push({
            id: docSnap.id,
            authorName: d.authorName || 'Agronomist',
            authorAvatar: d.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
            authorLocation: d.authorLocation || profile.location,
            isExpert: d.isExpert ?? false,
            adviceCategory: d.adviceCategory || 'General Advice',
            text: d.text || '',
            imageUrl: d.imageUrl || undefined,
            timeAgo: d.createdAt ? new Date(d.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently',
            likes: d.likes || 0,
            createdAt: d.createdAt
          });
        });
        onUpdate(repliesList);
      },
      (error) => {
        console.warn(`[FirebaseContext] Error subscribing to replies for post ${postId}:`, error);
      }
    );

    return unsubscribe;
  };

  // Like reply
  const likeReply = async (postId: string, replyId: string) => {
    const path = `community_posts/${postId}/replies/${replyId}`;
    try {
      const replyRef = doc(db, 'community_posts', postId, 'replies', replyId);
      const replySnap = await getDoc(replyRef);
      if (replySnap.exists()) {
        const currentLikes = replySnap.data().likes || 0;
        await updateDoc(replyRef, { likes: currentLikes + 1 });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  // Like post
  const likePost = async (postId: string) => {
    const path = `community_posts/${postId}`;
    try {
      const postRef = doc(db, path);
      const postSnap = await getDoc(postRef);
      if (postSnap.exists()) {
        const currentLikes = postSnap.data().likesCount || 0;
        await updateDoc(postRef, { likesCount: currentLikes + 1 });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Google Sign in Error:', error);
      throw error;
    }
  };

  // Logout
  const logout = async () => {
    try {
      await fbSignOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <FirebaseContext.Provider
      value={{
        user,
        loading,
        profile,
        setProfile,
        savedReports,
        saveReport,
        communityPosts,
        addCommunityPost,
        addReplyToPost,
        subscribeToPostReplies,
        likePost,
        likeReply,
        signInWithGoogle,
        logout,
        syncPendingReportsToFirestore,
        syncNotice,
        clearSyncNotice
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};

