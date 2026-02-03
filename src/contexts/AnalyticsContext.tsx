import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { analytics } from '../firebase';
import { logEvent as firebaseLogEvent, setUserId, setUserProperties } from 'firebase/analytics';

interface AnalyticsEvent {
  eventName: string;
  params?: Record<string, string | number | boolean>;
}

interface PageView {
  path: string;
  timestamp: number;
  duration?: number;
}

interface AnalyticsContextType {
  logEvent: (eventName: string, params?: Record<string, string | number | boolean>) => void;
  logPageView: (path: string) => void;
  logError: (error: string, context?: Record<string, string>) => void;
  setUserIdentifier: (uid: string) => void;
  setUserProperty: (name: string, value: string) => void;
  getEventHistory: () => AnalyticsEvent[];
  getPageViewHistory: () => PageView[];
  clearHistory: () => void;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

export function useAnalytics(): AnalyticsContextType {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
}

interface AnalyticsProviderProps {
  children: ReactNode;
}

export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  const [eventHistory, setEventHistory] = useState<AnalyticsEvent[]>([]);
  const [pageViewHistory, setPageViewHistory] = useState<PageView[]>([]);
  const [currentPage, setCurrentPage] = useState<string>('');
  const [pageStartTime, setPageStartTime] = useState<number>(Date.now());

  // Log event to Firebase Analytics and local history
  const logEvent = (eventName: string, params?: Record<string, string | number | boolean>) => {
    // Log to Firebase Analytics
    if (analytics) {
      try {
        firebaseLogEvent(analytics, eventName, params);
      } catch (error) {
        console.error('Error logging event to Firebase:', error);
      }
    }

    // Log to local history for demo purposes
    const event: AnalyticsEvent = {
      eventName,
      params: params ? { ...params, timestamp: Date.now() } : { timestamp: Date.now() }
    };

    setEventHistory(prev => [...prev.slice(-99), event]); // Keep last 100 events
  };

  // Log page view
  const logPageView = (path: string) => {
    const now = Date.now();

    // Calculate duration of previous page
    if (currentPage) {
      const duration = now - pageStartTime;
      setPageViewHistory(prev => {
        const updated = [...prev];
        const lastPageIndex = updated.length - 1;
        if (lastPageIndex >= 0) {
          updated[lastPageIndex] = {
            ...updated[lastPageIndex],
            duration
          };
        }
        return updated;
      });
    }

    // Log new page view
    logEvent('page_view', {
      page_path: path,
      page_title: document.title
    });

    setCurrentPage(path);
    setPageStartTime(now);
    setPageViewHistory(prev => [...prev.slice(-49), { path, timestamp: now }]); // Keep last 50 page views
  };

  // Log error
  const logError = (error: string, context?: Record<string, string>) => {
    logEvent('error', {
      error_message: error,
      ...context
    });
  };

  // Set user identifier
  const setUserIdentifier = (uid: string) => {
    if (analytics) {
      try {
        setUserId(analytics, uid);
      } catch (error) {
        console.error('Error setting user ID:', error);
      }
    }
  };

  // Set user property
  const setUserProperty = (name: string, value: string) => {
    if (analytics) {
      try {
        setUserProperties(analytics, { [name]: value });
      } catch (error) {
        console.error('Error setting user property:', error);
      }
    }
  };

  // Get event history
  const getEventHistory = () => eventHistory;

  // Get page view history
  const getPageViewHistory = () => pageViewHistory;

  // Clear history
  const clearHistory = () => {
    setEventHistory([]);
    setPageViewHistory([]);
  };

  // Track page visibility for duration calculation
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && currentPage) {
        // Page is hidden, calculate duration
        const duration = Date.now() - pageStartTime;
        setPageViewHistory(prev => {
          const updated = [...prev];
          const lastPageIndex = updated.length - 1;
          if (lastPageIndex >= 0 && updated[lastPageIndex].path === currentPage) {
            updated[lastPageIndex] = {
              ...updated[lastPageIndex],
              duration
            };
          }
          return updated;
        });
      } else if (!document.hidden && currentPage) {
        // Page is visible again, reset start time
        setPageStartTime(Date.now());
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [currentPage, pageStartTime]);

  const value: AnalyticsContextType = {
    logEvent,
    logPageView,
    logError,
    setUserIdentifier,
    setUserProperty,
    getEventHistory,
    getPageViewHistory,
    clearHistory
  };

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
}
