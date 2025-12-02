import { useState, useEffect } from 'react';
import { syncManager, queueManager } from '../lib/supabaseClient';

export interface OnlineStatus {
  isOnline: boolean;
  pendingOperations: number;
  lastSync: Date | null;
  isSyncing: boolean;
}

export const useOnlineStatus = () => {
  const [status, setStatus] = useState<OnlineStatus>({
    isOnline: navigator.onLine,
    pendingOperations: queueManager.count(),
    lastSync: syncManager.getLastSync(),
    isSyncing: false
  });

  useEffect(() => {
    // Update online status
    const handleOnline = async () => {
      setStatus(prev => ({ ...prev, isOnline: true, isSyncing: true }));
      
      // Auto-sync saat kembali online
      try {
        const result = await syncManager.processQueue();
        console.log('🔄 Sync result:', result);
        
        setStatus(prev => ({
          ...prev,
          pendingOperations: queueManager.count(),
          lastSync: syncManager.getLastSync(),
          isSyncing: false
        }));
      } catch (error) {
        console.error('Sync failed:', error);
        setStatus(prev => ({ ...prev, isSyncing: false }));
      }
    };

    const handleOffline = () => {
      setStatus(prev => ({ ...prev, isOnline: false }));
    };

    // Update pending operations count
    const updatePendingCount = () => {
      setStatus(prev => ({
        ...prev,
        pendingOperations: queueManager.count()
      }));
    };

    // Event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('storage', updatePendingCount);

    // Custom events dari supabaseClient
    window.addEventListener('app:online', handleOnline);
    window.addEventListener('app:offline', handleOffline);

    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('storage', updatePendingCount);
      window.removeEventListener('app:online', handleOnline);
      window.removeEventListener('app:offline', handleOffline);
    };
  }, []);

  // Manual sync trigger
  const manualSync = async () => {
    if (!status.isOnline) {
      console.warn('Cannot sync while offline');
      return { success: false, processed: 0, failed: 0 };
    }

    setStatus(prev => ({ ...prev, isSyncing: true }));
    
    try {
      const result = await syncManager.processQueue();
      setStatus(prev => ({
        ...prev,
        pendingOperations: queueManager.count(),
        lastSync: syncManager.getLastSync(),
        isSyncing: false
      }));
      return result;
    } catch (error) {
      console.error('Manual sync failed:', error);
      setStatus(prev => ({ ...prev, isSyncing: false }));
      throw error;
    }
  };

  return {
    ...status,
    manualSync
  };
};