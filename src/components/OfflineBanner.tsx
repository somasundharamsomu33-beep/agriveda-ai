import React, { useState } from 'react';
import { WifiOff, Wifi, RefreshCw, Database, Check, Layers, AlertCircle, X, CheckCircle2 } from 'lucide-react';
import { useOfflineStatus } from '../lib/offlineStorage';
import { useFirebase } from '../context/FirebaseContext';

export const OfflineBanner: React.FC = () => {
  const { isOnline, pendingCount, lastSyncTime } = useOfflineStatus();
  const { syncPendingReportsToFirestore, syncNotice, clearSyncNotice } = useFirebase();
  const [showDetails, setShowDetails] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const handleManualSync = async () => {
    setSyncing(true);
    try {
      await syncPendingReportsToFirestore();
    } catch (e) {
      console.error('Manual sync error:', e);
    } finally {
      setTimeout(() => {
        setSyncing(false);
      }, 1000);
    }
  };

  return (
    <div className="w-full relative z-40">
      {/* Background Sync Status Toast Notification */}
      {syncNotice && (
        <div className={`px-4 py-2.5 text-xs font-bold text-white flex items-center justify-between shadow-md transition-all ${
          syncNotice.type === 'success' ? 'bg-emerald-700' : 'bg-blue-700'
        }`}>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-200" />
            <span>{syncNotice.message}</span>
          </div>
          <button
            onClick={clearSyncNotice}
            className="p-1 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-3.5 h-3.5 text-white" />
          </button>
        </div>
      )}

      {/* Offline Alert Bar */}
      {!isOnline && (
        <div className="bg-amber-600 text-white px-4 py-2 text-xs font-bold flex items-center justify-between shadow-sm animate-in slide-in-from-top">
          <div className="flex items-center gap-2">
            <WifiOff className="w-4 h-4 animate-pulse shrink-0" />
            <span>
              <strong>Rural Offline Mode:</strong> App functional using Local Storage &amp; Service Worker Caching.
            </span>
          </div>

          <div className="flex items-center gap-2">
            {pendingCount > 0 && (
              <span className="bg-amber-800 px-2 py-0.5 rounded text-[10px] uppercase font-bold">
                {pendingCount} Queued to Sync
              </span>
            )}
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="underline text-[11px] font-bold hover:text-amber-100"
            >
              {showDetails ? 'Hide Info' : 'Offline Storage Info'}
            </button>
          </div>
        </div>
      )}

      {/* Online Status Header Banner (Subtle indicator) */}
      <div className="bg-slate-900 border-b border-slate-800 text-slate-300 px-4 py-1.5 text-[11px] font-medium flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isOnline ? (
            <span className="inline-flex items-center gap-1.5 text-emerald-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <Wifi className="w-3.5 h-3.5" /> Online (Live Sync)
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-amber-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              <WifiOff className="w-3.5 h-3.5" /> Low Connectivity / Offline
            </span>
          )}

          <span className="hidden sm:inline text-slate-500">|</span>
          <span className="hidden sm:inline-flex items-center gap-1 text-slate-400">
            <Database className="w-3 h-3 text-blue-400" />
            Service Worker Background Sync Active
          </span>
        </div>

        <div className="flex items-center gap-3">
          {pendingCount > 0 && isOnline && (
            <span className="text-[10px] bg-blue-900 text-blue-200 border border-blue-700 px-2 py-0.5 rounded font-bold animate-pulse">
              {pendingCount} Report(s) Syncing to Firestore...
            </span>
          )}

          {lastSyncTime && (
            <span className="text-[10px] text-slate-400 hidden md:inline">
              Cached: {new Date(lastSyncTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}

          <button
            onClick={handleManualSync}
            disabled={syncing}
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold border border-slate-700 transition-colors"
            title="Sync offline cache with server"
          >
            <RefreshCw className={`w-3 h-3 ${syncing ? 'animate-spin text-blue-400' : ''}`} />
            <span>{syncing ? 'Syncing...' : 'Sync Cache'}</span>
          </button>
        </div>
      </div>

      {/* Expanded Offline Storage Details */}
      {showDetails && (
        <div className="bg-slate-950 border-b border-slate-800 text-slate-300 p-4 text-xs space-y-2 animate-in fade-in">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-white flex items-center gap-1.5 text-xs">
              <Layers className="w-4 h-4 text-blue-400" /> Rural Connectivity &amp; Offline Caching Capabilities
            </h4>
            <span className="text-[10px] bg-blue-950 text-blue-300 border border-blue-800 px-2 py-0.5 rounded font-bold uppercase">
              PWA &amp; Background Sync
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[11px]">
            <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
              <p className="font-bold text-slate-200 flex items-center gap-1">
                <Check className="w-3.5 h-3.5 text-emerald-400" /> Service Worker Cache
              </p>
              <p className="text-slate-400 text-[10px]">
                Static app assets, styling, icons, and UI bundles are precached offline in <code>public/sw.js</code>.
              </p>
            </div>

            <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
              <p className="font-bold text-slate-200 flex items-center gap-1">
                <Check className="w-3.5 h-3.5 text-emerald-400" /> Service Worker Background Sync
              </p>
              <p className="text-slate-400 text-[10px]">
                Pending crop reports automatically push to Firestore in the background when connectivity returns.
              </p>
            </div>

            <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
              <p className="font-bold text-slate-200 flex items-center gap-1">
                <Check className="w-3.5 h-3.5 text-emerald-400" /> Local Storage Queue
              </p>
              <p className="text-slate-400 text-[10px]">
                Offline crop scans &amp; community questions are safely queued without data loss across reloads.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

