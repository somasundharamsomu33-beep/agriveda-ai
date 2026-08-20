import { useState, useEffect } from 'react';

const STORAGE_KEYS = {
  WEATHER: 'agriveda_weather_cache',
  MANDI: 'agriveda_mandi_cache',
  REPORTS: 'agriveda_reports_cache',
  PENDING_SYNC: 'agriveda_pending_sync_queue',
  LAST_SYNC: 'agriveda_last_sync_timestamp'
};

export interface PendingQueueItem {
  id: string;
  type: 'SCAN' | 'COMMUNITY_POST' | 'POST_REPLY';
  payload: any;
  timestamp: string;
}

// Local Storage Helpers
export function getCachedData<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.error('Error reading offline cache key:', key, e);
    return fallback;
  }
}

export function setCachedData<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    localStorage.setItem(STORAGE_KEYS.LAST_SYNC, new Date().toISOString());
  } catch (e) {
    console.error('Error writing offline cache key:', key, e);
  }
}

export function getPendingQueue(): PendingQueueItem[] {
  return getCachedData<PendingQueueItem[]>(STORAGE_KEYS.PENDING_SYNC, []);
}

export function removePendingQueueItem(id: string) {
  const queue = getPendingQueue().filter(item => item.id !== id);
  setCachedData(STORAGE_KEYS.PENDING_SYNC, queue);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('agriveda:sync-status-change'));
  }
}

export function queueOfflineAction(type: 'SCAN' | 'COMMUNITY_POST' | 'POST_REPLY', payload: any) {
  const queue = getPendingQueue();
  const newItem: PendingQueueItem = {
    id: 'pending_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
    type,
    payload,
    timestamp: new Date().toISOString()
  };
  queue.push(newItem);
  setCachedData(STORAGE_KEYS.PENDING_SYNC, queue);

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('agriveda:sync-status-change'));
  }

  // Request Service Worker Background Sync
  requestBackgroundSync();
  return newItem;
}

export function clearPendingQueue() {
  localStorage.removeItem(STORAGE_KEYS.PENDING_SYNC);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('agriveda:sync-status-change'));
  }
}

export function requestBackgroundSync(tag = 'sync-crop-reports') {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then((registration: any) => {
      if ('sync' in registration) {
        registration.sync.register(tag)
          .then(() => console.log('[Background Sync] Successfully registered sync tag:', tag))
          .catch((err: any) => console.warn('[Background Sync] Registration failed, fallback to online event:', err));
      } else if (registration.active) {
        registration.active.postMessage({ type: 'REGISTER_BACKGROUND_SYNC' });
      }
    }).catch(err => console.warn('[Background Sync] Service worker ready failed:', err));
  }
}

// Service Worker Registration
export function registerServiceWorker() {
  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          console.log('[AgriVeda SW] Registered successfully with scope:', reg.scope);
        })
        .catch((err) => {
          console.warn('[AgriVeda SW] Registration failed:', err);
        });
    });
  } else if ('serviceWorker' in navigator) {
    // Unregister any stale service worker in development to allow Vite HMR and prevent blank screen
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (let registration of registrations) {
        registration.unregister();
      }
    });
  }
}

// Custom React Hook for Online / Offline & Sync state
export function useOfflineStatus() {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [pendingCount, setPendingCount] = useState<number>(getPendingQueue().length);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(
    localStorage.getItem(STORAGE_KEYS.LAST_SYNC)
  );

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setPendingCount(getPendingQueue().length);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    const handleSyncStatusChange = () => {
      setPendingCount(getPendingQueue().length);
      setLastSyncTime(localStorage.getItem(STORAGE_KEYS.LAST_SYNC));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('agriveda:sync-status-change', handleSyncStatusChange);

    // Interval check for pending items sync status
    const interval = setInterval(() => {
      setPendingCount(getPendingQueue().length);
      setLastSyncTime(localStorage.getItem(STORAGE_KEYS.LAST_SYNC));
    }, 2000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('agriveda:sync-status-change', handleSyncStatusChange);
      clearInterval(interval);
    };
  }, []);

  return {
    isOnline,
    pendingCount,
    lastSyncTime,
    queueOfflineAction,
    getPendingQueue,
    clearPendingQueue,
    removePendingQueueItem
  };
}

