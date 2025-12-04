"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { DataStateHandler } from "@/app/_common/component/molecules/DataStateHandler";
import TabList from "@/app/_common/component/organism/TabList";
import { CompanySearch } from "@/app/_common/component/molecules/CompanySearch";
import { useAllCompanies, useCompany } from "@/app/_common/hooks/useCompanies";
import { useDailyPricesLatest } from "@/app/_common/hooks/useDailyPrices";
import {
  formatCurrency,
  formatPercentage,
  getCurrencySymbol,
} from "@/app/_common/services/format";
import { USD_KRW_EXCHANGE_RATE } from "@/app/_common/const";
import { TabListData } from "@/app/_common/types";
import CompanyDividendView from "@/app/company-info/[ticker]/_component/CompanyDividendView";
import CompanyOverviewView from "@/app/company-info/[ticker]/_component/CompanyOverviewView";
import CompanyPerformanceView from "@/app/company-info/[ticker]/_component/CompanyPerformanceView";
import CompanyShareView from "@/app/company-info/[ticker]/_component/CompanyShareView";

const menuList: TabListData[] = [
  { text: "실적", value: "financials" },
  { text: "개요", value: "overview" },
  { text: "지분", value: "ownership" },
  { text: "배당", value: "dividends" },
];

export default function CompanyInfoPageView() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read URL params
  const { ticker: paramTicker } = useParams<{ ticker?: string | string[] }>();
  const ticker = useMemo(() => {
    if (typeof paramTicker === "string") return paramTicker;
    if (Array.isArray(paramTicker) && typeof paramTicker[0] === "string")
      return paramTicker[0];
    return "";
  }, [paramTicker]);

  const paramsError = useMemo(() => {
    return ticker
      ? null
      : new Error("Invalid or missing ticker URL parameter.");
  }, [ticker]);

  const tabParam = searchParams.get("tab");
  const initialTab = useMemo(() => {
    const found = menuList.find((m) => m.value === tabParam);
    return found || menuList[0];
  }, [tabParam]);

  const [view, changeMenu, currentMenu] = useCompanyInfoTab(initialTab);

  useEffect(() => {
    const currentUrl = new URLSearchParams(window.location.search);
    const urlTab = currentUrl.get("tab");

    if (urlTab !== currentMenu) {
      router.replace(`?tab=${currentMenu}`, { scroll: false });
    }
  }, [currentMenu, router]);

  const {
    data: companyData,
    isLoading: isLoadingCompany,
    error: companyError,
  } = useCompany(ticker);
  const {
    data: priceData,
    isLoading: isLoadingPrice,
    error: priceError,
  } = useDailyPricesLatest(ticker);
  const { data: allCompanies, isLoading: isLoadingCompanies } =
    useAllCompanies();

  const isLoading = isLoadingCompany || isLoadingPrice;
  const error = paramsError || companyError || priceError;

  const {
    latestPrice,
    priceInUSD,
    priceInKRW,
    formattedPrice,
    formattedChange,
    priceColor,
    companyName,
    currencySymbol,
    isKRW,
  } = useMemo(() => {
    if (!priceData?.items?.length) {
      return {
        latestPrice: null,
        priceInUSD: null,
        priceInKRW: null,
        formattedPrice: "N/A",
        formattedChange: "N/A",
        priceColor: "text-gray-500",
        companyName: " ",
        currencySymbol: "원",
        isKRW: true,
      };
    }

    const sortedItems = [...priceData.items].sort(
      (a, b) =>
        new Date(b.price_date).getTime() - new Date(a.price_date).getTime(),
    );
    const latest = sortedItems[0];
    const percentChange = latest?.percent_change ?? 0;
    let netChange = latest?.net_change ?? 0;

    const apiCurrency = latest?.currency || "KRW";
    const isKoreanWon = apiCurrency === "KRW";
    const USD_KRW_RATE = USD_KRW_EXCHANGE_RATE;

    if (apiCurrency === "USD" && netChange !== 0) {
      netChange = netChange * USD_KRW_RATE;
    }
    netChange = Math.round(netChange);

    let displayPrice: string;
    let convertedUSD: string | null = null;
    let convertedKRW: string | null = null;

    if (latest?.closing_price != null) {
      if (isKoreanWon) {
        displayPrice = formatCurrency(latest.closing_price);
        convertedUSD = (latest.closing_price / USD_KRW_RATE).toFixed(2);
      } else {
        const krwPrice = latest.closing_price * USD_KRW_RATE;
        displayPrice = formatCurrency(krwPrice);
        convertedUSD = latest.closing_price.toFixed(2);
        convertedKRW = krwPrice.toFixed(0);
      }
    } else {
      displayPrice = "N/A";
    }

    const change =
      latest && latest.percent_change != null && latest.net_change != null
        ? `${percentChange >= 0 ? "+" : ""}${formatPercentage(percentChange / 100)} (${formatCurrency(Math.abs(netChange))})`
        : "N/A";
    const color = percentChange >= 0 ? "text-red-500" : "text-blue-500";

    let name =
      companyData?.items?.[0]?.company_name_kr ||
      companyData?.items?.[0]?.company_name ||
      " ";

    const country = companyData?.items?.[0]?.country;
    if (country === "USA") {
      if (name.endsWith(", Inc.")) {
        name = name.replace(", Inc.", "");
      } else if (name.endsWith("Inc.")) {
        name = name.replace("Inc.", "");
      }
    }

    const currency = isKoreanWon ? "원" : getCurrencySymbol(apiCurrency);

    return {
      latestPrice: latest,
      priceInUSD: convertedUSD,
      priceInKRW: convertedKRW,
      formattedPrice: displayPrice,
      formattedChange: change,
      priceColor: color,
      companyName: name,
      currencySymbol: currency,
      isKRW: isKoreanWon,
    };
  }, [priceData, companyData]);

  return (
    <DataStateHandler isLoading={isLoading} error={error}>
      <article className="flex flex-1 flex-col pb-[52px]">
        <div className="px-6">
          <CompanySearch
            companies={allCompanies?.items || []}
            isLoading={isLoadingCompanies}
            onSelect={(selectedTicker) => {
              router.push(`/company-info/${selectedTicker}`);
            }}
          />
        </div>

        <header className="relative p-6 pt-3">
          <h1 className="typo-large font-medium">
            {companyName}
            <div className="typo-num-large flex items-center gap-2.5 font-black">
              {isKRW
                ? formattedPrice
                : `${Number(priceInKRW ?? 0).toLocaleString()}원`}
              {!isKRW && (
                <span className={`typo-num-base font-bold text-gray-500`}>
                  ${priceInUSD ?? "N/A"}
                </span>
              )}
              <span className={`typo-num-base ${priceColor} font-bold`}>
                {formattedChange.replace("원", currencySymbol)}
              </span>
            </div>
          </h1>
        </header>

        <nav>
          <TabList
            tabDataList={menuList}
            currentValue={currentMenu}
            onClickAction={changeMenu}
          />
        </nav>

        {view}
        {currentMenu === "dividend" && (
          <hr className="bg-divider mt-1.5 h-6 border-none" />
        )}
      </article>
    </DataStateHandler>
  );
}

const useCompanyInfoTab = (initialTab?: TabListData) => {
  const [currentMenu, setCurrentMenu] = useState<TabListData>(
    initialTab || menuList[0],
  );

  const changeMenu = useCallback((value: TabListData["value"]) => {
    setCurrentMenu((prev) => ({
      ...prev,
      ...menuList.find((data) => data.value === value),
    }));
  }, []);

  const view = useMemo(() => {
    switch (currentMenu.value) {
      case "dividends":
        return <CompanyDividendView />;
      case "financials":
        return <CompanyPerformanceView />;
      case "overview":
        return <CompanyOverviewView />;
      case "ownership":
        return <CompanyShareView />;
      default:
        return <div>오류가 발생했습니다.</div>;
    }
  }, [currentMenu]);

  return [view, changeMenu, currentMenu.value] as const;
};