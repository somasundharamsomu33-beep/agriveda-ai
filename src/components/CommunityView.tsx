import React, { useState, useRef } from 'react';
import {
  Users, ThumbsUp, MessageSquare, CheckCircle, Send, Plus, Sparkles, X,
  Search, Image, Camera, ArrowRight, ShieldCheck, MapPin, Filter, Tag
} from 'lucide-react';
import { UserProfile, CommunityPost } from '../types';
import { translations, sampleCommunityPosts, sampleCropImages } from '../data/mockData';
import { useFirebase } from '../context/FirebaseContext';
import { CommunityThreadModal } from './CommunityThreadModal';

interface CommunityViewProps {
  profile: UserProfile;
}

export const CommunityView: React.FC<CommunityViewProps> = ({ profile }) => {
  const t = translations[profile.language] || translations.en;
  const { communityPosts, addCommunityPost, likePost } = useFirebase();

  const posts = communityPosts.length > 0 ? communityPosts : sampleCommunityPosts;

  const [showAskModal, setShowAskModal] = useState(false);
  const [selectedThreadPost, setSelectedThreadPost] = useState<CommunityPost | null>(null);
  const [questionText, setQuestionText] = useState('');
  const [cropContext, setCropContext] = useState(profile.primaryCrop || 'Tomato');
  const [postImage, setPostImage] = useState<string | null>(null);
  const [isPosting, setIsPosting] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCropFilter, setSelectedCropFilter] = useState('All');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Like handler
  const handleLike = async (e: React.MouseEvent, postId: string) => {
    e.stopPropagation();
    await likePost(postId);
  };

  // Image Upload Handler
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Please choose an image under 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPostImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit new question
  const handleSubmitQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim()) return;

    setIsPosting(true);

    try {
      await addCommunityPost(questionText, cropContext, postImage || undefined);
      setQuestionText('');
      setPostImage(null);
      setShowAskModal(false);
    } catch (err) {
      console.error('Error submitting question:', err);
    } finally {
      setIsPosting(false);
    }
  };

  // Filter posts
  const filteredPosts = posts.filter((post) => {
    const matchesCrop = selectedCropFilter === 'All' ||
      (post.cropContext && post.cropContext.toLowerCase().includes(selectedCropFilter.toLowerCase()));
    const matchesQuery = !searchQuery.trim() ||
      post.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.cropContext && post.cropContext.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCrop && matchesQuery;
  });

  return (
    <div className="space-y-5 pb-24 animate-in fade-in max-w-2xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-sm border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center shadow-sm">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">{t.agriCommunity}</h2>
              <p className="text-xs text-slate-400">Connect, share advice &amp; real-time photos with verified agronomists</p>
            </div>
          </div>

          <button
            onClick={() => setShowAskModal(true)}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition-all transform active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Ask &amp; Share</span>
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search community discussions, crops, or diseases..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-800 text-slate-200 placeholder-slate-400 text-xs rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white text-xs"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Crop Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {['All', 'Tomato', 'Chilli', 'Paddy / Rice', 'Cotton', 'Sugarcane', 'Brinjal'].map(crop => (
          <button
            key={crop}
            onClick={() => setSelectedCropFilter(crop)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
              selectedCropFilter === crop
                ? 'bg-emerald-700 text-white border-emerald-700 shadow-2xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            {crop === 'All' ? '🌾 All Crop Threads' : crop}
          </button>
        ))}
      </div>

      {/* Community Posts Feed */}
      <div className="space-y-4">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
            <Users className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="text-sm font-bold text-slate-800">No discussion threads found</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Be the first farmer in {profile.location} to start a discussion thread for {selectedCropFilter}!
            </p>
            <button
              onClick={() => setShowAskModal(true)}
              className="px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold hover:bg-emerald-800 transition-colors"
            >
              Start New Thread
            </button>
          </div>
        ) : (
          filteredPosts.map((post) => (
            <div
              key={post.id}
              onClick={() => setSelectedThreadPost(post)}
              className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-3.5 hover:border-emerald-300 transition-all cursor-pointer group"
            >
              
              {/* Author Info */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={post.authorAvatar}
                    alt={post.authorName}
                    className="w-10 h-10 rounded-xl object-cover border border-slate-200 shadow-2xs"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                      {post.authorName}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {post.authorLocation} • {post.timeAgo}
                    </p>
                  </div>
                </div>

                {post.cropContext && (
                  <span className="px-2.5 py-1 text-[10px] font-extrabold rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200/80">
                    {post.cropContext}
                  </span>
                )}
              </div>

              {/* Question Text */}
              <p className="text-xs font-bold text-slate-900 leading-relaxed group-hover:text-slate-800">
                "{post.question}"
              </p>

              {/* Photo Preview */}
              {post.imageUrl && (
                <div className="relative rounded-xl overflow-hidden border border-slate-200 max-h-52">
                  <img
                    src={post.imageUrl}
                    alt="Post crop"
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                  />
                  <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-slate-900/80 text-white text-[10px] font-bold rounded flex items-center gap-1">
                    <Camera className="w-3 h-3" /> Photo
                  </span>
                </div>
              )}

              {/* Thread Action Bar */}
              <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 text-xs font-bold text-slate-500">
                <button
                  onClick={(e) => handleLike(e, post.id)}
                  className="flex items-center gap-1.5 hover:text-blue-600 transition-colors p-1 rounded-lg hover:bg-blue-50"
                >
                  <ThumbsUp className="w-4 h-4 text-blue-600" />
                  <span>{post.likesCount} Likes</span>
                </button>

                <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-200/80 transition-colors">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{post.replies ? post.replies.length : post.repliesCount || 0} Expert Answers</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
                </div>
              </div>

              {/* Top Verified Reply Preview */}
              {post.replies && post.replies.length > 0 && (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-900">
                    <span className="text-slate-900">{post.replies[0].authorName}</span>
                    {post.replies[0].isExpert && (
                      <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-blue-600 text-white flex items-center gap-0.5">
                        <CheckCircle className="w-2.5 h-2.5 text-white" /> Verified
                      </span>
                    )}
                  </div>
                  <p className="text-slate-600 text-[11px] line-clamp-2 font-medium">
                    "{post.replies[0].text}"
                  </p>
                </div>
              )}

            </div>
          ))
        )}
      </div>

      {/* Ask Question & Share Photo Modal */}
      {showAskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setShowAskModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-4">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-2 shadow-2xs">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900">Start Agri Discussion</h3>
              <p className="text-xs text-slate-500">Ask farmers &amp; AI verified agronomists for practical solutions</p>
            </div>

            <form onSubmit={handleSubmitQuestion} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Crop Type</label>
                <select
                  value={cropContext}
                  onChange={e => setCropContext(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-slate-50"
                >
                  <option value="Tomato">Tomato</option>
                  <option value="Paddy / Rice">Paddy / Rice</option>
                  <option value="Chilli">Chilli</option>
                  <option value="Cotton">Cotton</option>
                  <option value="Sugarcane">Sugarcane</option>
                  <option value="Brinjal">Brinjal</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Your Question / Discussion Topic</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe crop symptoms, pest issues, or share advice for fellow farmers..."
                  value={questionText}
                  onChange={e => setQuestionText(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              {/* Photo Upload for Post */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Attach Crop Photo (Optional)</label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageSelect}
                  accept="image/*"
                  className="hidden"
                />

                {postImage ? (
                  <div className="relative rounded-2xl overflow-hidden border border-slate-200 max-h-48">
                    <img src={postImage} alt="Post preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setPostImage(null)}
                      className="absolute top-2 right-2 p-1.5 bg-slate-900/80 text-white rounded-full hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1 py-3 px-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Camera className="w-4 h-4 text-emerald-600" />
                      <span>Upload Photo</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPostImage(sampleCropImages[0].url)}
                      className="px-3 py-3 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 text-xs font-bold hover:bg-emerald-100 transition-colors shrink-0"
                    >
                      + Sample Leaf Photo
                    </button>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isPosting}
                className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-300 text-white font-extrabold text-xs rounded-2xl shadow-md transition-colors flex items-center justify-center gap-1.5"
              >
                {isPosting ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>Analyzing &amp; Posting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Post to Community</span>
                  </>
                )}
              </button>
            </form>

          </div>
        </div>
      )}

      {/* Discussion Thread Modal */}
      {selectedThreadPost && (
        <CommunityThreadModal
          post={selectedThreadPost}
          profile={profile}
          onClose={() => setSelectedThreadPost(null)}
        />
      )}

    </div>
  );
};

