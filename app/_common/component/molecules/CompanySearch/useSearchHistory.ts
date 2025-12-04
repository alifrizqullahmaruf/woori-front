import { useState, useEffect, useCallback } from "react";

export interface SearchHistoryItem {
  ticker: string;
  label: string;
  logo?: string;
  fallbackUrl?: string;
}

export function useSearchHistory(storageKey: string, maxItems: number = 5) {
  // Initialize state with a function to avoid SSR issues
  const [history, setHistory] = useState<SearchHistoryItem[]>(() => {
    // Only access localStorage on client-side
    if (typeof window === 'undefined') {
      return [];
    }
    
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        return Array.isArray(parsed) ? parsed : [];
      }
    } catch (error) {
      console.error("Failed to load search history:", error);
    }
    return [];
  });

  // Save history to localStorage whenever it changes
  useEffect(() => {
    // Only run on client-side
    if (typeof window === 'undefined') {
      return;
    }

    try {
      localStorage.setItem(storageKey, JSON.stringify(history));
      console.log('History saved to localStorage:', history); // Debug log
    } catch (error) {
      console.error("Failed to save search history:", error);
    }
  }, [history, storageKey]);

  const addHistory = useCallback(
    (item: SearchHistoryItem) => {
      setHistory((prev) => {
        // Remove existing item with same ticker
        const filtered = prev.filter((h) => h.ticker !== item.ticker);
        
        // Add new item to front
        const updated = [item, ...filtered];
        
        // Limit to maxItems
        return updated.slice(0, maxItems);
      });
    },
    [maxItems]
  );

  const removeFromHistory = useCallback((ticker: string) => {
    setHistory((prev) => prev.filter((h) => h.ticker !== ticker));
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    // Also clear from localStorage immediately
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(storageKey);
      } catch (error) {
        console.error("Failed to clear localStorage:", error);
      }
    }
  }, [storageKey]);

  return {
    history,
    addHistory,
    removeFromHistory,
    clearHistory,
  };
}