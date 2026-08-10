import React, { useState, useEffect, useRef } from 'react';
import {
  X, MessageSquare, ThumbsUp, Send, Image, Camera, CheckCircle, Sparkles,
  Award, CornerDownRight, ShieldCheck, MapPin, Clock, Tag, RefreshCw, Trash2
} from 'lucide-react';
import { CommunityPost, CommunityReply, UserProfile } from '../types';
import { useFirebase } from '../context/FirebaseContext';
import { sampleCropImages } from '../data/mockData';

interface CommunityThreadModalProps {
  post: CommunityPost;
  profile: UserProfile;
  onClose: () => void;
}

const ADVICE_CATEGORIES = [
  'General Advice',
  'Pest Control Advice',
  'Organic & Bio Solution',
  'Fertilizer & Soil Tip',
  'Irrigation & Water Care'
];

export const CommunityThreadModal: React.FC<CommunityThreadModalProps> = ({
  post,
  profile,
  onClose
}) => {
  const { subscribeToPostReplies, addReplyToPost, likePost, likeReply } = useFirebase();

  const [replies, setReplies] = useState<CommunityReply[]>(post.replies || []);
  const [replyText, setReplyText] = useState('');
  const [adviceCategory, setAdviceCategory] = useState('General Advice');
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAiDrafting, setIsAiDrafting] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);
  const [hasLikedPost, setHasLikedPost] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const threadEndRef = useRef<HTMLDivElement>(null);

  // Subscribe to real-time Firestore replies for this post
  useEffect(() => {
    let isMounted = true;
    const unsubscribe = subscribeToPostReplies(post.id, (firestoreReplies) => {
      if (!isMounted) return;
      if (firestoreReplies && firestoreReplies.length > 0) {
        // Combine Firestore replies with any default mock replies without duplication
        const existingIds = new Set(firestoreReplies.map(r => r.id));
        const combined = [
          ...firestoreReplies,
          ...(post.replies || []).filter(r => !existingIds.has(r.id))
        ];
        setReplies(combined);
      } else if (post.replies && post.replies.length > 0) {
        setReplies(post.replies);
      }
    });

    return () => {
      isMounted = false;
      if (unsubscribe) unsubscribe();
    };
  }, [post.id]);

  // Image Upload Handler (Convert file to base64)
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Please choose an image under 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAttachedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Like original post
  const handleLikePost = async () => {
    if (hasLikedPost) return;
    setHasLikedPost(true);
    setLikesCount(prev => prev + 1);
    await likePost(post.id);
  };

  // Like a reply
  const handleLikeReplyItem = async (replyId: string) => {
    setReplies(prev =>
      prev.map(r => r.id === replyId ? { ...r, likes: r.likes + 1 } : r)
    );
    await likeReply(post.id, replyId);
  };

  // Submit new advice reply
  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    setIsSubmitting(true);
    try {
      await addReplyToPost(
        post.id,
        replyText.trim(),
        attachedImage || undefined,
        adviceCategory,
        false
      );

      setReplyText('');
      setAttachedImage(null);
      setTimeout(() => {
        threadEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    } catch (err) {
      console.error('Error submitting community reply:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Draft AI Expert Advice with Gemini
  const handleDraftAiAdvice = async () => {
    setIsAiDrafting(true);
    try {
      const res = await fetch('/api/community/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: post.question,
          cropContext: post.cropContext,
          authorName: profile.name,
          authorLocation: profile.location
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.replies && data.replies.length > 0) {
          const aiAdviceText = data.replies[0].text;
          setReplyText(aiAdviceText);
          setAdviceCategory('Pest Control Advice');
        }
      }
    } catch (err) {
      console.error('Error generating AI advice draft:', err);
    } finally {
      setIsAiDrafting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full h-[90vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden relative">
        
        {/* Modal Header */}
        <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center shadow-sm">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Discussion Thread</span>
                <span className="px-2 py-0.5 rounded text-[9px] bg-emerald-500/20 text-emerald-300 font-extrabold border border-emerald-500/30">
                  Real-Time Sync
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                {post.cropContext || 'General Agriculture'} • {replies.length} Advice Replies
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-slate-50/50">
          
          {/* Main Original Question Card */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200 space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={post.authorAvatar}
                  alt={post.authorName}
                  className="w-11 h-11 rounded-2xl object-cover border border-slate-200 shadow-2xs"
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{post.authorName}</h4>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium mt-0.5">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {post.authorLocation}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {post.timeAgo}
                    </span>
                  </div>
                </div>
              </div>

              {post.cropContext && (
                <span className="px-3 py-1 text-xs font-bold rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200/80">
                  {post.cropContext}
                </span>
              )}
            </div>

            <p className="text-sm font-bold text-slate-900 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              "{post.question}"
            </p>

            {/* Post Photo */}
            {post.imageUrl && (
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-2xs max-h-72">
                <img
                  src={post.imageUrl}
                  alt="Post crop issue"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-2 right-2 px-2.5 py-1 bg-slate-900/80 backdrop-blur-sm text-white text-[10px] font-bold rounded-md flex items-center gap-1">
                  <Camera className="w-3 h-3" /> Photo Attached
                </span>
              </div>
            )}

            {/* Interaction Bar */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                onClick={handleLikePost}
                disabled={hasLikedPost}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  hasLikedPost
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600'
                }`}
              >
                <ThumbsUp className={`w-3.5 h-3.5 ${hasLikedPost ? 'fill-blue-600' : ''}`} />
                <span>{likesCount} Likes</span>
              </button>

              <span className="text-xs text-slate-500 font-bold flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                <span>{replies.length} Expert Answers</span>
              </span>
            </div>
          </div>

          {/* AI Agronomist Auto-Draft Helper */}
          <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-slate-900 text-white rounded-2xl p-4 shadow-sm border border-emerald-800/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                <Sparkles className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-white">Need AI Agronomist Advice Draft?</h5>
                <p className="text-[11px] text-slate-300">Generate a verified biological or chemical solution draft with Gemini</p>
              </div>
            </div>

            <button
              onClick={handleDraftAiAdvice}
              disabled={isAiDrafting}
              className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-700 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 transition-all shadow-sm shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isAiDrafting ? 'animate-spin' : ''}`} />
              <span>{isAiDrafting ? 'Generating Draft...' : 'Draft AI Response'}</span>
            </button>
          </div>

          {/* Discussion Thread Replies List */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-600" />
              <span>Community &amp; Expert Solutions ({replies.length})</span>
            </h4>

            {replies.length === 0 ? (
              <div className="text-center py-8 bg-white rounded-2xl border border-dashed border-slate-200 p-6 space-y-2">
                <MessageSquare className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs font-bold text-slate-700">No advice posted yet</p>
                <p className="text-[11px] text-slate-500">Be the first experienced farmer or expert to offer advice!</p>
              </div>
            ) : (
              replies.map((reply, index) => (
                <div
                  key={reply.id || index}
                  className={`rounded-2xl p-4 transition-all border ${
                    reply.isExpert
                      ? 'bg-blue-50/70 border-blue-200 text-slate-900 shadow-2xs'
                      : 'bg-white border-slate-200/90 shadow-2xs'
                  }`}
                >
                  {/* Reply Author */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={reply.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                        alt={reply.authorName}
                        className="w-8 h-8 rounded-lg object-cover border border-slate-200"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-900">
                            {reply.authorName}
                          </span>
                          {reply.isExpert && (
                            <span className="px-2 py-0.5 text-[9px] font-extrabold rounded-md bg-blue-600 text-white flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" /> Expert Verified
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {reply.authorLocation || profile.location} • {reply.timeAgo || 'Recently'}
                        </span>
                      </div>
                    </div>

                    {reply.adviceCategory && (
                      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-extrabold bg-slate-100 text-slate-700 border border-slate-200">
                        {reply.adviceCategory}
                      </span>
                    )}
                  </div>

                  {/* Reply Text */}
                  <p className="text-xs text-slate-800 font-medium leading-relaxed mt-1">
                    {reply.text}
                  </p>

                  {/* Attached Reply Photo */}
                  {reply.imageUrl && (
                    <div className="mt-3 rounded-xl overflow-hidden border border-slate-200 max-h-52">
                      <img
                        src={reply.imageUrl}
                        alt="Reply attachment"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Like Reply Footer */}
                  <div className="mt-3 pt-2 border-t border-slate-100/80 flex items-center justify-between text-[11px] font-bold text-slate-500">
                    <button
                      onClick={() => handleLikeReplyItem(reply.id)}
                      className="flex items-center gap-1.5 hover:text-blue-600 transition-colors"
                    >
                      <ThumbsUp className="w-3.5 h-3.5 text-blue-600" />
                      <span>{reply.likes || 0} Helpful</span>
                    </button>
                    <span className="text-[10px] text-slate-400 font-medium">Real-time Verified</span>
                  </div>
                </div>
              ))
            )}
            <div ref={threadEndRef} />
          </div>

        </div>

        {/* Modal Fixed Footer: Input Box */}
        <div className="p-4 bg-white border-t border-slate-200 shadow-lg shrink-0">
          <form onSubmit={handleSubmitReply} className="space-y-3">
            
            {/* Category selection & Photo preview bar */}
            <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1">
              <div className="flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <select
                  value={adviceCategory}
                  onChange={e => setAdviceCategory(e.target.value)}
                  className="px-2.5 py-1 bg-slate-100 rounded-lg text-xs font-bold text-slate-700 border border-slate-200 focus:outline-none"
                >
                  {ADVICE_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Photo Upload Buttons */}
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageSelect}
                  accept="image/*"
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 transition-colors"
                >
                  <Image className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{attachedImage ? 'Change Photo' : 'Attach Photo'}</span>
                </button>

                {/* Quick Sample Image Selector */}
                <button
                  type="button"
                  onClick={() => setAttachedImage(sampleCropImages[0].url)}
                  className="px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-200 hidden sm:inline-flex"
                >
                  + Sample Crop
                </button>
              </div>
            </div>

            {/* Attached Image Preview */}
            {attachedImage && (
              <div className="relative inline-block border border-slate-300 rounded-xl overflow-hidden max-h-24">
                <img src={attachedImage} alt="Preview" className="h-20 w-auto object-cover" />
                <button
                  type="button"
                  onClick={() => setAttachedImage(null)}
                  className="absolute top-1 right-1 p-1 bg-slate-900/80 text-white rounded-full hover:bg-red-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}

            {/* Input Box and Submit Button */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                required
                placeholder="Share your practical farming advice or solution..."
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />

              <button
                type="submit"
                disabled={isSubmitting || !replyText.trim()}
                className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-300 text-white font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center gap-1.5 shrink-0"
              >
                {isSubmitting ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Post Advice</span>
                  </>
                )}
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
};
