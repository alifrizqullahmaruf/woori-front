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
    </DataStateHandler>
  );
}
