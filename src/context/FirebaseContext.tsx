import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { UserProfile, CropDiagnosisReport, CommunityPost, CommunityReply } from '../types';
import { initialUserProfile, guestUserProfile } from '../data/mockData';
import { getPendingQueue, removePendingQueueItem, queueOfflineAction } from '../lib/offlineStorage';
import { AuthService } from '../lib/authService';

interface SyncNotice {
  message: string;
  type: 'success' | 'info' | 'error';
}

interface SupabaseContextType {
  user: any | null; // Supabase Auth User
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
  logout: () => Promise<void>;
  syncPendingReports: () => Promise<number>;
  syncNotice: SyncNotice | null;
  clearSyncNotice: () => void;
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

export const SupabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile>(() => {
    const existing = AuthService.getCurrentSession();
    return existing || initialUserProfile;
  });
  const [savedReports, setSavedReports] = useState<CropDiagnosisReport[]>([]);
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>([]);
  const [syncNotice, setSyncNotice] = useState<SyncNotice | null>(null);

  const clearSyncNotice = () => setSyncNotice(null);

  const fetchProfileFromBackend = async (session: any) => {
    if (!session?.access_token) return;
    try {
      const res = await fetch('/api/profile', {
        headers: { Authorization: `Bearer ${session.access_token}` }
      });
      if (res.ok) {
        const data = await res.json();
        console.log('Secure Backend Auth Hit:', data);
        // We can fetch from Supabase JS client directly for DB data
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profileData) {
          setProfile({
            ...initialUserProfile,
            name: profileData.name || '',
            phone: profileData.phone || '',
            location: profileData.location || '',
            avatarUrl: profileData.avatar_url || '',
            farmId: profileData.farm_id || '',
            farmSizeAcres: profileData.farm_size_acres || 0,
            primaryCrop: profileData.primary_crop || '',
            soilType: profileData.soil_type || '',
            language: profileData.language || 'en'
          });
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      if (session) {
        fetchProfileFromBackend(session);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
        if (session) fetchProfileFromBackend(session);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const syncPendingReports = async (): Promise<number> => {
    if (typeof navigator !== 'undefined' && !navigator.onLine) return 0;
    const queue = getPendingQueue();
    if (!queue || queue.length === 0) return 0;

    let syncedCount = 0;
    for (const item of queue) {
      if (item.type === 'SCAN' && item.payload) {
        try {
          // Push to Supabase crop_diagnosis_reports
          await supabase.from('crop_diagnosis_reports').insert([{
            farmer_id: user?.id,
            crop_type: item.payload.cropType,
            detected_issue: item.payload.detectedIssue,
            image_url: item.payload.imageUrl,
            treatment_json: item.payload.treatment,
            prevention_json: item.payload.prevention,
            fertilizer_suggestion: item.payload.fertilizerSuggestion,
          }]);
          removePendingQueueItem(item.id);
          syncedCount++;
        } catch (e) { }
      }
    }
    return syncedCount;
  };

  const saveReport = async (report: CropDiagnosisReport) => {
    try {
      await supabase.from('crop_diagnosis_reports').insert([{
        farmer_id: user?.id,
        crop_type: report.cropType,
        detected_issue: report.detectedIssue,
        image_url: report.imageUrl,
        treatment_json: report.treatment,
        prevention_json: report.prevention,
        fertilizer_suggestion: report.fertilizerSuggestion,
      }]);
    } catch (e) {
      queueOfflineAction('SCAN', report);
    }
  };

  const addCommunityPost = async (question: string, cropContext?: string, imageUrl?: string) => {
    await supabase.from('community_posts').insert([{
      author_id: user?.id,
      question,
      crop_context: cropContext,
      image_url: imageUrl
    }]);
  };

  const addReplyToPost = async (postId: string, text: string) => {
    await supabase.from('community_replies').insert([{
      post_id: postId,
      author_id: user?.id,
      text
    }]);
  };

  const subscribeToPostReplies = (postId: string, onUpdate: (r: any[]) => void) => {
    const channel = supabase.channel(`public:community_replies:post_id=eq.${postId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'community_replies', filter: `post_id=eq.${postId}` }, () => {
        supabase.from('community_replies').select('*').eq('post_id', postId).then(res => onUpdate(res.data || []));
      }).subscribe();
    return () => { supabase.removeChannel(channel); };
  };

  const likePost = async () => { };
  const likeReply = async () => { };
  const logout = async () => {
    AuthService.clearCurrentSession();
    try {
      await supabase.auth.signOut();
    } catch (e) {}
    setProfile(guestUserProfile);
  };

  // This alias maintains backwards compatibility with everywhere you used useFirebase!
  return (
    <SupabaseContext.Provider
      value={{
        user, loading, profile, setProfile, savedReports, saveReport, communityPosts,
        addCommunityPost, addReplyToPost, subscribeToPostReplies, likePost, likeReply,
        signInWithGoogle, logout, syncPendingReports, syncNotice, clearSyncNotice
      }}
    >
      {children}
    </SupabaseContext.Provider>
  );
};

export const FirebaseProvider = SupabaseProvider;

export const useFirebase = () => {
  const context = useContext(SupabaseContext);
  if (!context) throw new Error('useSupabase must be used within a SupabaseProvider');
  return context as any; // Hacky fallback for types until we rename every component
};
