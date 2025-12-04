"use client";

import { useState, useEffect, useRef } from "react";

interface CompanyLogoProps {
  src?: string;
  alt: string;
  size?: number;
  ticker?: string;
  fallbackUrl?: string;
}

export default function CompanyLogo({
  src,
  alt,
  size = 40,
  ticker,
  fallbackUrl,
}: CompanyLogoProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const mountedRef = useRef(true);
  const successRef = useRef(false);

  const exchanges = ["NYSE", "NASDAQ", "KRX"];
  const upperTicker = ticker?.toUpperCase();

  const buildCloudUrl = (exchange: string) =>
    `https://d95fddh07astf.cloudfront.net/company_logos/${exchange}/${upperTicker}_badge.png`;

  useEffect(() => {
    mountedRef.current = true;
    successRef.current = false;
    setIsReady(false);

    // Priority 1: Direct src provided
    if (src) {
      // Preload before showing
      const img = new Image();
      img.onload = () => {
        if (mountedRef.current) {
          setImageSrc(src);
          setIsReady(true);
        }
      };
      img.onerror = () => {
        if (mountedRef.current) {
          setImageSrc(null);
          setIsReady(true);
        }
      };
      img.src = src;
      return;
    }

    // Priority 2: Try CloudFront URLs if ticker exists
    if (upperTicker) {
      const urls = exchanges.map(buildCloudUrl);
      if (fallbackUrl) urls.push(fallbackUrl);

      // Try all URLs in parallel, use FIRST successful one immediately
      urls.forEach((url) => {
        const img = new Image();

        img.onload = () => {
          // Only set if we haven't found a successful image yet
          if (mountedRef.current && !successRef.current) {
            successRef.current = true;
            setImageSrc(url);
            setIsReady(true);
          }
        };

        img.onerror = () => {
          // Do nothing, let other URLs try
        };

        img.src = url;
      });

      // Timeout fallback - if nothing loads in 2 seconds, show circle
      const timeout = setTimeout(() => {
        if (mountedRef.current && !successRef.current) {
          setImageSrc(null);
          setIsReady(true);
        }
      }, 2000);

      return () => {
        mountedRef.current = false;
        clearTimeout(timeout);
      };
    }

    // Priority 3: Fallback URL only
    if (fallbackUrl) {
      const img = new Image();
      img.onload = () => {
        if (mountedRef.current) {
          setImageSrc(fallbackUrl);
          setIsReady(true);
        }
      };
      img.onerror = () => {
        if (mountedRef.current) {
          setImageSrc(null);
          setIsReady(true);
        }
      };
      img.src = fallbackUrl;
      return;
    }

    // Priority 4: No valid source
    setImageSrc(null);
    setIsReady(true);

    return () => {
      mountedRef.current = false;
    };
  }, [src, ticker, fallbackUrl]);

  // Show nothing while loading (prevents flash)
  if (!isReady) {
    return (
      <div
        className="shrink-0 animate-pulse rounded-full bg-gray-200"
        style={{ width: size, height: size }}
      />
    );
  }

  // Show circle fallback if no image
  if (!imageSrc) {
    const initial = alt.charAt(0).toUpperCase();
    const colors = [
      "bg-red-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-cyan-500",
    ];
    const color = colors[alt.charCodeAt(0) % colors.length];

    return (
      <div
        className={`flex shrink-0 items-center justify-center rounded-full ${color} font-bold text-white`}
        style={{ width: size, height: size, fontSize: size * 0.5 }}
      >
        {initial}
      </div>
    );
  }

  return (
    <div style={{ width: size, height: size }} className="shrink-0">
      <img
        src={imageSrc}
        alt={alt}
        className="h-full w-full rounded-full object-cover"
      />
    </div>
  );
}
