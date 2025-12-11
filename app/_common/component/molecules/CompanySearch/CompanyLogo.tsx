"use client";

import { useState, useEffect, useRef } from "react";

interface CompanyLogoProps {
  src?: string;
  alt: string;
  size?: number;
  ticker?: string;
  fallbackUrl?: string;
  exchange?: string;
}

const logoCache = new Map<string, string>();
const failedCache = new Set<string>();
const pendingRequests = new Map<string, Promise<string | null>>();

class CloudFrontRateLimiter {
  private queue: Array<() => void> = [];
  private activeRequests = 0;
  private readonly maxConcurrent = 6; 
  private readonly delayBetweenRequests = 100; 
  private lastRequestTime = 0;

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    // Wait for slot
    while (this.activeRequests >= this.maxConcurrent) {
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    // Enforce delay between requests
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    if (timeSinceLastRequest < this.delayBetweenRequests) {
      await new Promise(resolve => 
        setTimeout(resolve, this.delayBetweenRequests - timeSinceLastRequest)
      );
    }

    this.lastRequestTime = Date.now();
    this.activeRequests++;

    try {
      return await fn();
    } finally {
      this.activeRequests--;
    }
  }
}

const rateLimiter = new CloudFrontRateLimiter();

// Helper function to normalize ticker format
const normalizeTickerForLogo = (ticker: string) => {
  return ticker.replace(/-/g, '.');
};

// Normalize exchange name
const normalizeExchange = (exchange: string): string => {
  const upper = exchange.toUpperCase();

  // Map various exchange formats to CloudFront folder names
  if (upper.includes('KOSDAQ') || upper.includes('KOREA')) {
    return 'KRX';
  }
  if (upper === 'NYSE' || upper === 'NEW YORK STOCK EXCHANGE') {
    return 'NYSE';
  }
  if (upper === 'NASDAQ') {
    return 'NASDAQ';
  }

  return upper;
};

// Check if exchange is Korean
const isKoreanExchange = (exchange: string | undefined): boolean => {
  if (!exchange) return false;
  const upper = exchange.toUpperCase();
  return upper.includes('KRX') || upper.includes('KOSDAQ') || upper.includes('KOREA');
};

// Get fallback badge text based on exchange
const getFallbackText = (alt: string, ticker: string | undefined, exchange: string | undefined): string => {
  // For Korean exchanges, use first character of company name
  if (isKoreanExchange(exchange)) {
    return alt.charAt(0).toUpperCase();
  }

  // For US exchanges (NYSE, NASDAQ), use ticker
  if (ticker) {
    return ticker.toUpperCase();
  }

  // Fallback: use first character of company name
  return alt.charAt(0).toUpperCase();
};

// Calculate contrast ratio and return appropriate text color
const getTextColor = (backgroundColor: string): string => {
  // Extract hex from bg-[#XXXXXX] format or use color map
  let hex: string | undefined;

  if (backgroundColor.startsWith('bg-[#')) {
    // Extract hex from bg-[#XXXXXX]
    hex = backgroundColor.match(/#[0-9A-Fa-f]{6}/)?.[0];
  } else {
    // Map standard Tailwind color classes to their hex values
    const colorMap: Record<string, string> = {
      'bg-red-500': '#ef4444',
      'bg-blue-500': '#3b82f6',
      'bg-green-500': '#22c55e',
      'bg-yellow-500': '#eab308',
      'bg-purple-500': '#a855f7',
      'bg-pink-500': '#ec4899',
      'bg-indigo-500': '#6366f1',
      'bg-cyan-500': '#06b6d4',
    };
    hex = colorMap[backgroundColor];
  }

  if (!hex) return 'text-white'; // Default to white

  // Convert hex to RGB
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  // Calculate relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Return black for light backgrounds, white for dark backgrounds
  return luminance > 0.5 ? 'text-black' : 'text-white';
};

const buildCloudUrl = (exchange: string, tickerVariant: string) =>
  `https://d95fddh07astf.cloudfront.net/company_logos/${exchange}/${tickerVariant}_badge.png`;

// Smart image loader with rate limiting
async function loadImage(url: string, isCloudFront: boolean, timeout = 1500): Promise<boolean> {
  // Check if already loading this URL
  if (pendingRequests.has(url)) {
    const result = await pendingRequests.get(url);
    return result !== null;
  }

  const loadFn = async (): Promise<string | null> => {
    return new Promise((resolve) => {
      const img = new Image();
      let resolved = false;

      const cleanup = () => {
        if (!resolved) {
          resolved = true;
          pendingRequests.delete(url);
        }
      };

      img.onload = () => {
        cleanup();
        resolve(url);
      };

      img.onerror = () => {
        cleanup();
        resolve(null);
      };

      const timer = setTimeout(() => {
        cleanup();
        resolve(null);
      }, timeout);

      img.src = url;
    });
  };

  // Apply rate limiting only for CloudFront URLs
  const promise = isCloudFront 
    ? rateLimiter.execute(loadFn)
    : loadFn();

  pendingRequests.set(url, promise);
  const result = await promise;
  return result !== null;
}

// Try CloudFront URLs - smart version with exchange info
async function tryCloudFrontUrls(
  ticker: string,
  exchange: string | undefined,
  onSuccess: (url: string) => void,
  mountedRef: React.MutableRefObject<boolean>
): Promise<boolean> {
  const normalizedTicker = normalizeTickerForLogo(ticker);
  const urls: string[] = [];
  
  if (exchange) {
    const normalizedExchange = normalizeExchange(exchange);
    
    if (ticker !== normalizedTicker) {
      const urlNormalized = buildCloudUrl(normalizedExchange, normalizedTicker);
      if (!failedCache.has(urlNormalized)) {
        urls.push(urlNormalized);
      }
    }
    const urlOriginal = buildCloudUrl(normalizedExchange, ticker);
    if (!failedCache.has(urlOriginal)) {
      urls.push(urlOriginal);
    }
  }
  
  const fallbackExchanges = ["NYSE", "NASDAQ", "KRX"];
  const knownExchange = exchange ? normalizeExchange(exchange) : null;
  
  fallbackExchanges.forEach(ex => {
    if (ex === knownExchange) return;
    
    if (ticker !== normalizedTicker) {
      const urlNormalized = buildCloudUrl(ex, normalizedTicker);
      if (!failedCache.has(urlNormalized)) {
        urls.push(urlNormalized);
      }
    }
    const urlOriginal = buildCloudUrl(ex, ticker);
    if (!failedCache.has(urlOriginal)) {
      urls.push(urlOriginal);
    }
  });

  for (const url of urls) {
    if (!mountedRef.current) return false;

    const success = await loadImage(url, true, 1200);
    
    if (success) {
      onSuccess(url);
      return true;
    } else {
      failedCache.add(url);
    }
  }

  return false;
}

export default function CompanyLogo({
  src,
  alt,
  size = 40,
  ticker,
  fallbackUrl,
  exchange,
}: CompanyLogoProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const mountedRef = useRef(true);

  const upperTicker = ticker?.toUpperCase();

  useEffect(() => {
    mountedRef.current = true;

    const cacheKey = src || upperTicker || '';
    if (cacheKey && logoCache.has(cacheKey)) {
      setImageSrc(logoCache.get(cacheKey)!);
      setIsReady(true);
      return;
    }

    if (src) {
      if (failedCache.has(src)) {
        setImageSrc(null);
        setIsReady(true);
        return;
      }

      loadImage(src, false, 2000).then(success => {
        if (mountedRef.current) {
          if (success) {
            logoCache.set(cacheKey, src);
            setImageSrc(src);
          } else {
            failedCache.add(src);
            setImageSrc(null);
          }
          setIsReady(true);
        }
      });
      return;
    }

    if (upperTicker) {
      let cloudFrontDone = false;

      tryCloudFrontUrls(
        upperTicker,
        exchange,
        (url) => {
          if (mountedRef.current && !cloudFrontDone) {
            cloudFrontDone = true;
            logoCache.set(cacheKey, url);
            setImageSrc(url);
            setIsReady(true);
          }
        },
        mountedRef
      ).then((success) => {
        cloudFrontDone = true;

        // If CloudFront failed, show badge fallback (no API fallback)
        if (!success && mountedRef.current) {
          setImageSrc(null);
          setIsReady(true);
        }
      });

      return () => {
        mountedRef.current = false;
      };
    }

    // No ticker, show badge fallback immediately
    setImageSrc(null);
    setIsReady(true);

    return () => {
      mountedRef.current = false;
    };
  }, [src, ticker, fallbackUrl, exchange, upperTicker]);

  if (!isReady && !imageSrc) {
    const fallbackText = getFallbackText(alt, ticker, exchange);
    const colors = [
      "bg-[#E6261F]",
      "bg-[#EB7532]",
      "bg-[#F7D03B]",
      "bg-[#A3E048]",
      "bg-[#34BBE6]",
      "bg-[#D23AFA]",
    ];
    const color = colors[alt.charCodeAt(0) % colors.length];
    const textColor = getTextColor(color);

    // Calculate font size based on text length
    const isTickerText = fallbackText.length > 1;
    const fontSize = isTickerText ? size * 0.3 : size * 0.5;

    return (
      <div
        className={`flex shrink-0 items-center justify-center rounded-full ${color} font-bold ${textColor}`}
        style={{ width: size, height: size, fontSize }}
      >
        {fallbackText}
      </div>
    );
  }

  // Show circle fallback if no image
  if (!imageSrc) {
    const fallbackText = getFallbackText(alt, ticker, exchange);
    const colors = [
      "bg-[#E6261F]",
      "bg-[#EB7532]",
      "bg-[#F7D03B]",
      "bg-[#A3E048]",
      "bg-[#34BBE6]",
      "bg-[#D23AFA]",
    ];
    const color = colors[alt.charCodeAt(0) % colors.length];
    const textColor = getTextColor(color);

    // Calculate font size based on text length
    const isTickerText = fallbackText.length > 1;
    const fontSize = isTickerText ? size * 0.3 : size * 0.5;

    return (
      <div
        className={`flex shrink-0 items-center justify-center rounded-full ${color} font-bold ${textColor}`}
        style={{ width: size, height: size, fontSize }}
      >
        {fallbackText}
      </div>
    );
  }

  return (
    <div style={{ width: size, height: size }} className="shrink-0">
      <img
        src={imageSrc}
        alt={alt}
        className="h-full w-full rounded-full object-cover"
        loading="eager"
      />
    </div>
  );
}