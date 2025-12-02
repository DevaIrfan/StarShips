import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { WifiOff, Wifi, RefreshCw, Clock } from 'lucide-react';
import { Button } from './ui/button';

export const OfflineIndicator = () => {
  const { isOnline, pendingOperations, lastSync, isSyncing, manualSync } = useOnlineStatus();

  // Jangan tampilkan apa-apa jika online dan tidak ada pending operations
  if (isOnline && pendingOperations === 0) {
    return null;
  }

  const formatLastSync = (date: Date | null) => {
    if (!date) return 'Never';
    const now = Date.now();
    const diff = now - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-md w-full px-4">
      <div
        className={`
          rounded-lg shadow-lg border backdrop-blur-sm
          ${isOnline 
            ? 'bg-blue-500/90 border-blue-600 text-white' 
            : 'bg-gray-900/90 border-gray-700 text-gray-100'
          }
        `}
      >
        <div className="flex items-center gap-3 p-4">
          {/* Icon */}
          <div className="flex-shrink-0">
            {isOnline ? (
              <Wifi className="w-5 h-5" />
            ) : (
              <WifiOff className="w-5 h-5" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm">
              {isOnline ? 'Back Online' : 'Offline Mode'}
            </div>
            
            {pendingOperations > 0 && (
              <div className="text-xs mt-1 opacity-90">
                {isSyncing ? (
                  <span className="flex items-center gap-1">
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    Syncing {pendingOperations} changes...
                  </span>
                ) : (
                  <span>
                    {pendingOperations} pending change{pendingOperations !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
            )}

            {isOnline && lastSync && (
              <div className="text-xs mt-1 opacity-75 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Last synced: {formatLastSync(lastSync)}
              </div>
            )}
          </div>

          {/* Action Button */}
          {isOnline && pendingOperations > 0 && !isSyncing && (
            <Button
              size="sm"
              variant="ghost"
              className="flex-shrink-0 text-white hover:bg-white/20"
              onClick={manualSync}
            >
              <RefreshCw className="w-4 h-4 mr-1" />
              Sync Now
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};