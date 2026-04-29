import { useEffect, useRef, useState } from 'react';

export function useRealTimeUpdates(fetchFunction, interval = 10000) {
  const mountedRef = useRef(true);
  const intervalRef = useRef(null);
  const lastUpdateRef = useRef(Date.now());
  const [lastUpdate, setLastUpdate] = useState(lastUpdateRef.current);

  useEffect(() => {
    // Initial fetch
    if (fetchFunction) {
      fetchFunction();
    }

    // Set up polling interval
    if (interval > 0) {
      intervalRef.current = setInterval(() => {
        if (mountedRef.current && fetchFunction) {
          fetchFunction();
          lastUpdateRef.current = Date.now();
          setLastUpdate(lastUpdateRef.current);
        }
      }, interval);
    }

    // Set up visibility change listener
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && mountedRef.current) {
        const timeSinceLastUpdate = Date.now() - lastUpdateRef.current;
        // If page was hidden for more than 10 seconds, refresh data
        if (timeSinceLastUpdate > 10000 && fetchFunction) {
          fetchFunction();
          lastUpdateRef.current = Date.now();
          setLastUpdate(lastUpdateRef.current);
        }
      }
    };

    // Set up Telegram WebApp activated event
    const handleTelegramActivated = () => {
      if (mountedRef.current && fetchFunction) {
        fetchFunction();
        lastUpdateRef.current = Date.now();
        setLastUpdate(lastUpdateRef.current);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Telegram WebApp event
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.onEvent('activated', handleTelegramActivated);
    }

    // Cleanup
    return () => {
      mountedRef.current = false;
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      document.removeEventListener('visibilitychange', handleVisibilityChange);
      
      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.offEvent('activated', handleTelegramActivated);
      }
    };
  }, [fetchFunction, interval]);

  return {
    isUpdating: intervalRef.current !== null,
    lastUpdate
  };
}

export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
