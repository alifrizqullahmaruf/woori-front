"use client";

import { useParams } from "next/navigation";
import { useCompany } from "@/app/_common/hooks/useCompanies";
import { useDailyPrices } from "@/app/_common/hooks/useDailyPrices";
import { useFundamentals } from "@/app/_common/hooks/useFundamentals";
import { useOutstandingShares } from "@/app/_common/hooks/useOutstandingShares";
import { useExchangeRate } from "@/app/_common/hooks/useForex";
import { useRevenueSegments } from "@/app/_common/hooks/useRevenueSegments";
import CommonTable from "@/app/_common/component/organism/CommonTable";
import PageViewContainer from "@/app/_common/component/templates/PageViewContainer";
import { HELP_DESCRIPTIONS_DICTIONARY } from "@/app/_common/const";
import { type DummyTableContents } from "@/app/company-info/[ticker]/_types";
import { DataStateHandler } from "@/app/_common/component/molecules/DataStateHandler";
import { useMemo } from "react";
import {
  formatCurrency,
} from "@/app/_common/services/format";
import {
  fromFinnhubMillionToWon,
  formatWonRaw,
} from "@/app/_common/hooks/formatters";

export default function CompanyOverviewView() {
  //Fetch data using custom hooks
  const params = useParams();
  const ticker = params.ticker as string;

  const { data: companyData, isLoading, error } = useCompany(ticker);

  const {
    data: priceData,
    isLoading: isLoadingPrice,
    error: priceError,
  } = useDailyPrices(ticker);

  const {
    data: fundamentalsData,
    isLoading: isLoadingFundamentals,
    error: fundamentalsError,
  } = useFundamentals(ticker);

  const {
    data: outstandingData,
    isLoading: isLoadingOutstanding,
    error: outstandingError,
  } = useOutstandingShares(ticker);

  const { exchangeRate } = useExchangeRate();

  const {
    data: revenueSegmentsData,
    isLoading: isLoadingRevenueSegments,
    error: revenueSegmentsError,
  } = useRevenueSegments(ticker);

  const dividerClass =
    "after:bg-border after:my-[18px] after:block after:h-[1px] after:w-full after:content-['']";

  //Process data with useMemo for optimization
  const company = useMemo(() => {
    return companyData?.items?.[0];
  }, [companyData]);

  // Get the latest daily price (sorted by price_date desc)
  const latestDailyPrice = useMemo(() => {
    if (!priceData?.items?.length) return null;
    const sorted = [...priceData.items].sort(
      (a, b) =>
        new Date(b.price_date).getTime() - new Date(a.price_date).getTime(),
    );
    return sorted[0];
  }, [priceData]);

  // Map the latest fundamentals by metric_type, and get the latest settlement info
  const { fundamentalsMap, recentSettlement, fiscalMonth } = useMemo(() => {
    const result: Record<string, number> = {};
    if (!fundamentalsData?.items?.length) {
      return {
        fundamentalsMap: result,
        recentSettlement: "-",
        fiscalMonth: "-",
      };
    }

    // For each metric_type, keep the item with the most recent report_date
    const latestByType = new Map<
      string,
      { value: number; report_date: string; currency: string }
    >();
    let latestReport: string | null = null;

    for (const item of fundamentalsData.items) {
      const prev = latestByType.get(item.metric_type);
      if (!prev || new Date(item.report_date) > new Date(prev.report_date)) {
        latestByType.set(item.metric_type, {
          value: item.metric_value,
          report_date: item.report_date,
          currency: item.currency,
        });
      }
      if (
        !latestReport ||
        new Date(item.report_date) > new Date(latestReport)
      ) {
        latestReport = item.report_date;
      }
    }

    latestByType.forEach((v, k) => {
      // Convert USD to KRW for Capital metric
      let value = v.value;
      if (v.currency === "USD" && k === "Capital") {
        value = value * exchangeRate;
      }
      result[k] = value;
    });

    const recentSettlement = latestReport
      ? new Date(latestReport).toLocaleDateString("ko-KR", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "-";
    const fiscalMonth = latestReport
      ? `${new Date(latestReport).getMonth() + 1}월`
      : "-";

    return { fundamentalsMap: result, recentSettlement, fiscalMonth };
  }, [fundamentalsData, exchangeRate]);

  // Get the latest outstanding shares (sorted by record_date desc)
  const latestOutstandingShares = useMemo(() => {
    if (!outstandingData?.items?.length) return null;
    const sorted = [...outstandingData.items].sort(
      (a, b) =>
        new Date(b.record_date).getTime() - new Date(a.record_date).getTime(),
    );
    return sorted[0];
  }, [outstandingData]);

  // Process revenue segments - get latest FY (Full Year) data only
  const revenueBreakdown = useMemo(() => {
    if (!revenueSegmentsData?.items?.length) return [];

    // Filter only FY (Full Year) data
    const fyData = revenueSegmentsData.items.filter(
      (item) => item.fiscal_period === "FY"
    );

    if (!fyData.length) return [];

    // Find the latest fiscal year from FY data
    const latestFiscalYear = Math.max(
      ...fyData.map((item) => item.fiscal_year)
    );

    // Filter items from the latest fiscal year with FY period
    const latestPeriodData = fyData.filter(
      (item) => item.fiscal_year === latestFiscalYear
    );

    // Check if we have PRODUCT segments, otherwise use GEOGRAPHIC
    const hasProductSegments = latestPeriodData.some(
      (item) => item.segment_type === "PRODUCT"
    );

    const selectedSegments = latestPeriodData
      .filter((item) =>
        item.segment_type === (hasProductSegments ? "PRODUCT" : "GEOGRAPHIC")
      )
      .map((item) => {
        // Convert to KRW if needed, then divide by 1,000,000 to get 백만원
        const valueInKRW =
          item.currency === "USD"
            ? item.segment_revenue * exchangeRate
            : item.segment_revenue;

        const valueInMillions = valueInKRW / 1000000;

        return {
          name: item.segment_name,
          value: valueInMillions,
          percentage: item.segment_percentage,
        };
      });

    return selectedSegments;
  }, [revenueSegmentsData, exchangeRate]);

  //Dynamically build tableContents using useMemo
  const tableContents1: DummyTableContents[] = useMemo(
    () => {
      // Convert market cap if USD
      const marketCap = latestDailyPrice?.market_cap != null
        ? latestDailyPrice.currency === "USD"
          ? latestDailyPrice.market_cap * exchangeRate
          : latestDailyPrice.market_cap
        : null;

      return [
        {
          category: "기업이름",
          value: {
            companyName: company?.company_name_kr || company?.company_name || "-",
            stockCode: ticker?.toUpperCase() || "-",
          },
        },
        {
          category: "시가총액",
          value: marketCap != null ? formatCurrency(marketCap) : "-",
        },
        {
          category: "업종",
          value: company?.industry_kr || company?.industry || "-",
        },
        {
          category: "거래소",
          value: company?.exchange_kr || company?.exchange || "-",
        },
      ];
    },
    [company, ticker, latestDailyPrice],
  );

  const tableContents2: DummyTableContents[] = useMemo(
    () => [
      {
        category: "대표자",
        value: company?.ceo_kr || company?.ceo || "-",
      },
      {
        category: "설립일",
        value: "-", // Not available in API
      },
      {
        category: "상장일",
        value: company?.ipo_date
          ? new Date(company.ipo_date).toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          : "-",
      },
      {
        category: "최근결산",
        value: recentSettlement,
      },
      {
        category: "결산월",
        value: fiscalMonth,
      },
      {
        category: "자본금",
        value:
          fundamentalsMap?.Capital !== undefined
            ? (formatWonRaw((fundamentalsMap.Capital)) ??
              "-")
            : "-",
      },
      {
        category: "발행주식",
        value:
          latestOutstandingShares?.shares_outstanding != null
            ? `${Math.round(latestOutstandingShares.shares_outstanding).toLocaleString()}주`
            : "-",
      },
      {
        category: "유동비율",
        value:
          fundamentalsMap?.["Current ratio"] !== undefined
            ? fundamentalsMap["Current ratio"].toFixed(2)+"%"
            : "-",
      },
    ],
    [
      company,
      fundamentalsMap,
      latestOutstandingShares,
      recentSettlement,
      fiscalMonth,
    ],
  );

  // Build revenue breakdown table contents
  const revenueBreakdownContents: DummyTableContents[] = useMemo(() => {
    return revenueBreakdown.map((segment) => ({
      category: segment.name,
      value: Math.round(segment.value).toLocaleString("ko-KR"),
    }));
  }, [revenueBreakdown]);

  // Get latest report_date from revenue segments that match the displayed data
  const dataReferenceDate = useMemo(() => {
    if (!revenueSegmentsData?.items?.length) return null;

    // Filter only FY (Full Year) data - same as revenueBreakdown
    const fyData = revenueSegmentsData.items.filter(
      (item) => item.fiscal_period === "FY"
    );

    if (!fyData.length) return null;

    // Find the latest fiscal year from FY data
    const latestFiscalYear = Math.max(
      ...fyData.map((item) => item.fiscal_year)
    );

    // Filter items from the latest fiscal year with FY period
    const latestPeriodData = fyData.filter(
      (item) => item.fiscal_year === latestFiscalYear
    );

    if (!latestPeriodData.length) return null;

    // Find the most recent report_date from the filtered data
    const latestDate = latestPeriodData.reduce((latest, item) => {
      if (!item.report_date) return latest;
      if (!latest) return item.report_date;
      return new Date(item.report_date) > new Date(latest)
        ? item.report_date
        : latest;
    }, null as string | null);

    if (!latestDate) return null;

    const date = new Date(latestDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }, [revenueSegmentsData]);

  return (
    <DataStateHandler
      isLoading={
        isLoading ||
        isLoadingPrice ||
        isLoadingFundamentals ||
        isLoadingOutstanding ||
        isLoadingRevenueSegments
      }
      error={error || priceError || fundamentalsError || outstandingError || revenueSegmentsError}
      isEmpty={
        !priceData?.items?.length &&
        !fundamentalsData?.items?.length &&
        !outstandingData?.items?.length
      }
    >
      <PageViewContainer>
        {[tableContents1, tableContents2].map((tableContents, index) => (
          <CommonTable
            key={`table_${index}`}
            shouldDisplayDivider
            tableContents={tableContents}
            // helpTexts={HELP_DESCRIPTIONS_DICTIONARY}
          />
        ))}
        <p className={`text-gray-w800 break-keep ${dividerClass}`}>
          {company?.description_kr || company?.description || "-"}
        </p>

        {/* Revenue Breakdown Section */}
        {revenueBreakdownContents.length > 0 && (
          <div className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[15px] font-medium">주요매출</h3>
              <span className="text-[15px] text-gray-400 font-medium">백만원</span>
            </div>
            <CommonTable
              shouldDisplayDivider
              tableContents={revenueBreakdownContents}
            />
          </div>
        )}
        {dataReferenceDate && (
          <h1 className="typo-micro mb-[18px] text-gray-w600 mt-6">
            데이터 기준일: {dataReferenceDate}
          </h1>
        )}
      </PageViewContainer>
    </DataStateHandler>
  );
}
