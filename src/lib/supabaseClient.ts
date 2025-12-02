import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ==========================================
// OFFLINE DETECTION & STORAGE UTILITIES
// ==========================================

export const isOnline = () => {
  // Safe check untuk SSR/Build time
  if (typeof navigator === 'undefined') return true;
  return navigator.onLine;
};

// LocalStorage Keys
const CACHE_PREFIX = 'starships_cache_';
const QUEUE_KEY = 'starships_offline_queue';
const LAST_SYNC_KEY = 'starships_last_sync';

// Cache expiration (5 minutes)
const CACHE_EXPIRATION = 5 * 60 * 1000;

// ==========================================
// CACHE MANAGEMENT
// ==========================================

export const cacheManager = {
  // Set cache dengan timestamp
  set(key: string, data: any) {
    if (typeof localStorage === 'undefined') return;
    
    const cacheData = {
      data,
      timestamp: Date.now()
    };
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(cacheData));
  },

  // Get cache dengan validasi expiry
  get(key: string) {
    if (typeof localStorage === 'undefined') return null;
    
    const cached = localStorage.getItem(CACHE_PREFIX + key);
    if (!cached) return null;

    try {
      const { data, timestamp } = JSON.parse(cached);
      const isExpired = Date.now() - timestamp > CACHE_EXPIRATION;
      
      if (isExpired) {
        this.remove(key);
        return null;
      }
      
      return data;
    } catch {
      return null;
    }
  },

  // Hapus cache spesifik
  remove(key: string) {
    if (typeof localStorage === 'undefined') return;
    localStorage.removeItem(CACHE_PREFIX + key);
  },

  // Clear semua cache
  clearAll() {
    if (typeof localStorage === 'undefined') return;
    
    Object.keys(localStorage)
      .filter(key => key.startsWith(CACHE_PREFIX))
      .forEach(key => localStorage.removeItem(key));
  }
};

// ==========================================
// OFFLINE QUEUE MANAGEMENT
// ==========================================

export interface QueuedOperation {
  id: string;
  operation: 'insert' | 'update' | 'delete';
  table: string;
  data?: any;
  recordId?: string;
  timestamp: number;
}

export const queueManager = {
  // Add operation to queue
  add(operation: Omit<QueuedOperation, 'id' | 'timestamp'>) {
    if (typeof localStorage === 'undefined') return null;
    
    const queue = this.getAll();
    const newOp: QueuedOperation = {
      ...operation,
      id: `${operation.operation}_${Date.now()}_${Math.random()}`,
      timestamp: Date.now()
    };
    queue.push(newOp);
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
    return newOp;
  },

  // Get all queued operations
  getAll(): QueuedOperation[] {
    if (typeof localStorage === 'undefined') return [];
    
    const queue = localStorage.getItem(QUEUE_KEY);
    return queue ? JSON.parse(queue) : [];
  },

  // Remove operation from queue
  remove(id: string) {
    if (typeof localStorage === 'undefined') return;
    
    const queue = this.getAll().filter(op => op.id !== id);
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  },

  // Clear all queue
  clearAll() {
    if (typeof localStorage === 'undefined') return;
    localStorage.removeItem(QUEUE_KEY);
  },

  // Get queue count
  count(): number {
    return this.getAll().length;
  }
};

// ==========================================
// SYNC MANAGER - Process Offline Queue
// ==========================================

export const syncManager = {
  // Process semua queued operations
  async processQueue() {
    if (!isOnline()) {
      console.log('⚠️ Still offline, skipping sync');
      return { success: false, processed: 0, failed: 0 };
    }

    const queue = queueManager.getAll();
    if (queue.length === 0) {
      console.log('✅ No pending operations');
      return { success: true, processed: 0, failed: 0 };
    }

    console.log(`🔄 Processing ${queue.length} queued operations...`);
    
    let processed = 0;
    let failed = 0;

    for (const op of queue) {
      try {
        await this.executeOperation(op);
        queueManager.remove(op.id);
        processed++;
        console.log(`✅ Processed: ${op.operation} on ${op.table}`);
      } catch (error) {
        failed++;
        console.error(`❌ Failed to process operation:`, op, error);
        // Keep in queue untuk retry berikutnya
      }
    }

    // Update last sync timestamp
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(LAST_SYNC_KEY, Date.now().toString());
    }

    console.log(`✅ Sync complete: ${processed} succeeded, ${failed} failed`);
    return { success: failed === 0, processed, failed };
  },

  // Execute single operation
  async executeOperation(op: QueuedOperation) {
    switch (op.operation) {
      case 'insert':
        await supabase.from(op.table).insert(op.data);
        break;
      case 'update':
        await supabase.from(op.table).update(op.data).eq('id', op.recordId!);
        break;
      case 'delete':
        await supabase.from(op.table).delete().eq('id', op.recordId!);
        break;
    }
  },

  // Get last sync time
  getLastSync(): Date | null {
    if (typeof localStorage === 'undefined') return null;
    
    const timestamp = localStorage.getItem(LAST_SYNC_KEY);
    return timestamp ? new Date(parseInt(timestamp)) : null;
  }
};

// ==========================================
// AUTO-SYNC INITIALIZATION (Call from App)
// ==========================================

let isInitialized = false;

export const initializeOfflineSync = () => {
  // Prevent double initialization
  if (isInitialized) return;
  
  // Only run in browser
  if (typeof window === 'undefined') return;
  
  isInitialized = true;

  // Listen untuk perubahan status network
  const handleOnline = async () => {
    console.log('🌐 Back online! Syncing...');
    await syncManager.processQueue();
    
    // Dispatch custom event untuk UI update
    window.dispatchEvent(new CustomEvent('app:online'));
  };

  const handleOffline = () => {
    console.log('📴 Offline mode activated');
    window.dispatchEvent(new CustomEvent('app:offline'));
  };

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  // Cleanup function (optional, untuk unmount)
  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
};

// ==========================================
// EXPORT UTILITIES
// ==========================================

export { isOnline as checkOnlineStatus };