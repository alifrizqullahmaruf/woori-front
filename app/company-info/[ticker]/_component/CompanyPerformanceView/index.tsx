"use client";

import { useParams } from "next/navigation";
import { useMemo } from "react";
import { useFundamentals } from "@/app/_common/hooks/useFundamentals";
import PageViewContainer from "@/app/_common/component/templates/PageViewContainer";
import { DataStateHandler } from "@/app/_common/component/molecules/DataStateHandler";
import CommonSection from "./CommonSection";

const dummyTabData1 = ["매출", "영업이익", "순이익", "영업이익률", "순이익률"];

const dummyTabData2 = [
  "자산",
  "부채",
  "자본",
  "부채비율",
  "유동비율",
  "EPS",
  "ROE",
  "ROA",
  "PER",
  "PBR",
];

export default function CompanyPerformanceView() {
  const params = useParams();
  const ticker = params.ticker as string;

  const { data: fundamentalsData, isLoading, error } = useFundamentals(ticker);

  // Get latest report_date
  const dataReferenceDate = useMemo(() => {
    if (!fundamentalsData?.items?.length) return null;

    // Find the most recent report_date from all items
    const latestDate = fundamentalsData.items.reduce((latest, item) => {
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
  }, [fundamentalsData]);

  return (
    <DataStateHandler
      isLoading={isLoading}
      error={error}
      isEmpty={!fundamentalsData?.items?.length}
    >
      <article className="flex flex-1 flex-col">
        <CommonSection
          enableCompare={true}
          title="매출과 이익"
          tabList={dummyTabData1}
          maxPoints={4}
        />
        <CommonSection
          enableCompare={false}
          title="재무 비율"
          tabList={dummyTabData2}
          maxPoints={5}
        />
      </article>
      {dataReferenceDate && (
        <h1 className="typo-micro mb-[18px] text-gray-w600 mt-6 mx-6">
          데이터 기준일: {dataReferenceDate}
        </h1>
      )}
    </DataStateHandler>
  );
}
