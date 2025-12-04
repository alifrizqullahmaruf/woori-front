"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FiSearch, FiX } from "react-icons/fi";
import { useDebounce } from "@/app/_common/component/molecules/CompanySearch/useDebounce";
import { useSearchHistory } from "@/app/_common/component/molecules/CompanySearch/useSearchHistory";
import NotFoundSVG from "@/app/_common/assets/icons/NotFound.svg";
import LoadingDots from "@/app/_common/component/atoms/LoadingDots";
import Empty from "@/app/_common/assets/icons/Empty.svg";
import CompanyLogo from "@/app/_common/component/molecules/CompanySearch/CompanyLogo";
import { useCompanySearch } from "@/app/_common/hooks/useCompanies";

export default function CompanySearchPageClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState<string>(searchParams.get("q") || "");
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [isFocused, setIsFocused] = useState(false);

  const debouncedQuery = useDebounce(query, 300);

  const { data: searchResults, isLoading: isLoadingSearch } = useCompanySearch(
    debouncedQuery,
    10,
  );

  const { history, addHistory, removeFromHistory, clearHistory } =
    useSearchHistory("woori:company:searchHistory", 5);

  // Keep URL `?q=` in sync as user types (no debounce for URL updates)
  const updateQueryParam = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams?.toString());
      if (value.trim()) {
        params.set("q", value);
      } else {
        params.delete("q");
      }
      router.replace(
        `${pathname}${params.toString() ? `?${params.toString()}` : ""}`,
        { scroll: false },
      );
    },
    [pathname, router, searchParams],
  );

  useEffect(() => {
    // Focus the input on mount
    inputRef.current?.focus();
  }, []);

  // Recompute filtered options from debounced query
  const filteredOptions = useMemo(() => {
    const q = debouncedQuery.trim();
    if (!q) return [];

    const companies = searchResults || [];

    return companies.map((c) => ({
      company: c.company_name_kr || c.company_name || c.ticker,
      ticker: c.ticker,
      fallbackUrl: c.logo_url, 
    }));
  }, [debouncedQuery, searchResults]);

  const isHistoryMode = query.trim() === "";

  const displayOptions = useMemo(() => {
    if (isHistoryMode) {
      return history.map((h) => {
        const lastSpace = h.label.lastIndexOf(" ");
        const company = lastSpace > -1 ? h.label.slice(0, lastSpace) : h.label;
        return {
          company,
          ticker: h.ticker,
          fallbackUrl: h.fallbackUrl,
          isHistory: true as const,
        };
      });
    }
    return filteredOptions.map((opt) => ({
      ...opt,
      isHistory: false as const,
    }));
  }, [isHistoryMode, history, filteredOptions]);

  const hasQuery = query.trim().length > 0;

  const handleSelect = useCallback(
    (ticker: string, company: string, fallbackUrl?: string) => {
      if (!ticker) return;
      addHistory({
        ticker,
        label: `${company} ${ticker}`,
        fallbackUrl,
      });
      router.push(`/company-info/${ticker}`);
    },
    [addHistory, router],
  );

  // Keyboard navigation for the search input
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      switch (e.key) {
        case "ArrowDown": {
          e.preventDefault();
          setActiveIndex((prev) =>
            prev < displayOptions.length - 1 ? prev + 1 : prev,
          );
          break;
        }
        case "ArrowUp": {
          e.preventDefault();
          setActiveIndex((prev) => (prev > 0 ? prev - 1 : 0));
          break;
        }
        case "Enter": {
          e.preventDefault();
          if (activeIndex >= 0 && displayOptions[activeIndex]) {
            const selected = displayOptions[activeIndex];
            handleSelect(
              selected.ticker,
              selected.company,
              selected.fallbackUrl,
            );
          } else if (displayOptions.length > 0) {
            const first = displayOptions[0];
            handleSelect(
              first.ticker,
              first.company,
              first.fallbackUrl,
            );
          }
          break;
        }
        case "Escape": {
          e.preventDefault();
          router.push("/");
          break;
        }
        default:
          break;
      }
    },
    [displayOptions, activeIndex, handleSelect, router],
  );

  return (
    <div className="mx-auto flex w-full flex-col bg-white">
      {/* Header */}
      <div className="flex shrink-0 items-center gap-3 px-6">
        {/* Search bar */}
        <div className="relative flex-1">
          <FiSearch
            className={`pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 transition-colors duration-200 ${
              isFocused || query.trim() ? "text-primary-650" : "text-gray-600"
            }`}
            size={18}
            aria-hidden="true"
          />

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              const val = e.target.value;
              setQuery(val);
              setActiveIndex(-1);
              updateQueryParam(val);
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            placeholder="종목 검색"
            className="w-full cursor-pointer rounded-lg border border-[#8C8D96] bg-white py-2.5 pr-10 pl-10 text-sm transition-all duration-200 outline-none"
            aria-label="회사 검색"
          />
          {hasQuery && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setActiveIndex(-1);
                inputRef.current?.focus();
                updateQueryParam("");
              }}
              className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              aria-label="검색어 지우기"
            >
              <FiX size={16} />
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => router.push("/")}
          className="text-primary-650 shrink-0 px-3 py-2 text-sm transition hover:opacity-70"
        >
          취소
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto">
        {/* History Mode */}
        {isHistoryMode && history.length > 0 && (
          <div className="p-4">
            {/* History Header */}
            <div className="mb-3 flex items-center justify-between px-3">
              <div className="flex items-center">
                <span className="text-primary-650 text-[16px] font-bold">
                  최근 검색어
                </span>
              </div>
              <button
                type="button"
                onClick={clearHistory}
                className="text-primary-650 text-sm"
              >
                전체 삭제
              </button>
            </div>

            {/* History List */}
            <div className="space-y-2">
              {displayOptions.map((option, idx) => (
                <div
                  key={`history-${option.ticker}-${idx}`}
                  className={`flex cursor-pointer items-center justify-between rounded-lg bg-white p-3 transition-all hover:bg-gray-50 ${
                    idx === activeIndex ? "ring-2 ring-blue-500" : ""
                  }`}
                  onClick={() =>
                    handleSelect(
                      option.ticker,
                      option.company,
                      option.fallbackUrl,
                    )
                  }
                >
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <CompanyLogo
                      ticker={option.ticker}
                      fallbackUrl={option.fallbackUrl}
                      alt={option.company}
                      size={32}
                    />
                    <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
                      <span className="truncate text-sm font-medium text-gray-800">
                        {option.company}
                      </span>
                      <span className="shrink-0 text-sm text-gray-800">
                        {option.ticker}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromHistory(option.ticker);
                    }}
                    className="ml-2 p-1 font-bold text-[#1C1B1F]"
                    aria-label="삭제"
                  >
                    <FiX size={18} strokeWidth={3} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty History State */}
        {isHistoryMode && history.length === 0 && (
          <div className="flex min-h-[400px] flex-col items-center justify-center px-4">
            <div className="flex flex-col items-center gap-4">
              <NotFoundSVG aria-hidden="true" className="text-gray-400" />
              <p className="text-center text-base text-black">
                최근 검색 내역이 없습니다
              </p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoadingSearch && hasQuery && (
          <div className="flex flex-col items-center justify-center px-4 py-20">
            <LoadingDots />
          </div>
        )}

        {/* Empty Search State */}
        {!isLoadingSearch && hasQuery && displayOptions.length === 0 && (
          <div className="flex min-h-[400px] flex-col items-center justify-center px-4">
            <div className="flex flex-col items-center gap-4">
              <Empty aria-hidden="true" className="text-gray-400" />
              <p className="text-center text-base text-black">
                검색 결과가 없습니다.
              </p>
            </div>
          </div>
        )}

        {/* Search Results */}
        {!isHistoryMode && displayOptions.length > 0 && (
          <div className="p-4">
            <div className="space-y-1">
              {displayOptions.map((option, idx) => (
                <div
                  key={`search-${option.ticker}-${idx}`}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg p-3 transition-colors ${
                    idx === activeIndex
                      ? "bg-blue-50 ring-2 ring-blue-500"
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() =>
                    handleSelect(
                      option.ticker,
                      option.company,
                      option.fallbackUrl,
                    )
                  }
                >
                  <CompanyLogo
                    ticker={option.ticker}
                    fallbackUrl={option.fallbackUrl}
                    alt={option.company}
                    size={32}
                  />
                  <div className="flex w-full items-center justify-between gap-2">
                    <span className="truncate text-sm font-medium text-gray-800">
                      {option.company}
                    </span>
                    <span className="shrink-0 text-sm text-gray-800">
                      {option.ticker}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}