import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { ReactNode, useCallback, useMemo, useRef, useState } from "react";
import { useCompany } from "@/app/_common/hooks/useCompanies";
import { useOwnership } from "@/app/_common/hooks/useOwnership";
import ChartFallback from "@/app/_common/component/atoms/ChartFallback";
import LoadingDots from "@/app/_common/component/atoms/LoadingDots";
import PageViewContainer from "@/app/_common/component/templates/PageViewContainer";
import { DataStateHandler } from "@/app/_common/component/molecules/DataStateHandler";
import HolderRow from "@/app/company-info/[ticker]/_component/CompanyShareView/HolderRow";
import { colorCodes } from "@/app/company-info/[ticker]/_const";
import { OwnershipService } from "@/app/_common/services/api/ownership";

const DoughnutChart = dynamic(() => import("./DoughnutChart"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[210px] w-[210px] items-center justify-center">
      <LoadingDots />
    </div>
  ),
});

export default function CompanyShareView() {
  const { ticker } = useParams<{ ticker: string }>();
  const { data: ownershipsdata, isLoading, error } = useOwnership(ticker);
  const { data: companydata } = useCompany(ticker);

  const topHolder = useMemo(() => {
    if (!ownershipsdata?.items?.length) return null;

    // Ambil holder dengan persentase tertinggi
    const maxHolder = ownershipsdata.items.reduce((max, curr) =>
      curr.ownership_percent > max.ownership_percent ? curr : max,
    );

    // Jika semua ownership_percent == 0, return null
    const allZero = ownershipsdata.items.every(
      (item) => item.ownership_percent === 0,
    );

    return allZero ? null : maxHolder;
  }, [ownershipsdata]);

  const companyName =
    companydata?.items?.[0]?.company_name_kr ||
    companydata?.items?.[0]?.company_name ||
    "해당 기업";

  const mappedData = useMemo(() => {
    if (!ownershipsdata?.items) return [];

    const holderMap = new Map<string, { name: string; share: number }>();

    ownershipsdata.items.forEach((item) => {
      const name =
        item.shareholder_name_kr?.trim() || item.shareholder_name?.trim();
      const existing = holderMap.get(name);

      if (!existing || item.ownership_percent > existing.share) {
        holderMap.set(name, {
          name,
          share: Number(item.ownership_percent.toFixed(2)),
        });
      }
    });

    const uniqueHolders = Array.from(holderMap.values()).filter((item) => item.share > 0);
    const sortedHolders = [...uniqueHolders].sort((a, b) => b.share - a.share);
    const topFive = sortedHolders.slice(0, 5);

    const topFiveTotal = topFive.reduce((acc, cur) => acc + cur.share, 0);
    const others = {
      name: "기타",
      share: Math.max(0, Number((100 - topFiveTotal).toFixed(2))),
    };
    const finalHolders = [others, ...topFive].map((item, index) => ({
      ...item,
      bgColor: colorCodes[index % colorCodes.length],
    }));

    return finalHolders;
  }, [ownershipsdata]);

  const [filteredData, filterIndex] = useHolderFilter(mappedData);

  const labels = useMemo(
    () => filteredData.map(({ name }) => name),
    [filteredData],
  );

  // Get latest as_of_date
  const dataReferenceDate = useMemo(() => {
    if (!ownershipsdata?.items?.length) return null;

    // Find the most recent as_of_date from all items
    const latestDate = ownershipsdata.items.reduce((latest, item) => {
      if (!item.as_of_date) return latest;
      if (!latest) return item.as_of_date;
      return new Date(item.as_of_date) > new Date(latest)
        ? item.as_of_date
        : latest;
    }, null as string | null);

    if (!latestDate) return null;

    const date = new Date(latestDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }, [ownershipsdata]);

  // const latestownershipdata = mappedData?.[0];
  return (
    <DataStateHandler
      isLoading={isLoading}
      error={error}
      isEmpty={!ownershipsdata?.items?.length}
    >
      <PageViewContainer verticalPadding={24}>
        <h1 className="typo-medium font-bold">
          {companyName}의 주요 주주는
          <br />
          <Highlighter>
            {topHolder?.shareholder_name_kr ||
              topHolder?.shareholder_name ||
              "알 수 없음"}
          </Highlighter>
          이며
          <br />
          <Highlighter>
            {topHolder?.ownership_percent
              ? `${topHolder.ownership_percent.toFixed(2)}%`
              : "0%"}
          </Highlighter>
          의 지분을 가지고 있습니다.
        </h1>

        <div className={"mx-auto mt-5 mb-6 size-[210px]"}>
          <DoughnutChart
            dataArray={filteredData.map(({ share }) => share)}
            labels={labels}
            colorList={filteredData.map(({ bgColor }) => bgColor)}
          />
        </div>
        <table style={{ borderCollapse: "separate", borderSpacing: "0 20px" }}>
          <tbody>
            {mappedData.map(({ name, share }, index) => (
              <HolderRow
                key={`holder_${name}_${share}_${index}`}
                filterIndex={filterIndex(name)}
                index={index}
                name={name}
                share={share}
                isActive={labels.includes(name)}
              />
            ))}
          </tbody>
        </table>
        {dataReferenceDate && (
          <h1 className="typo-micro mb-[18px] text-gray-w600 mt-6">
            데이터 기준일: {dataReferenceDate}
          </h1>
        )}
      </PageViewContainer>
    </DataStateHandler>
  );
}

// const ownershipsdata: { name: string; share: number }[] = [
//   {
//     name: "기타",
//     share: 72.56,
//   },
//   {
//     name: "삼성생명보험㈜",
//     share: 8.51,
//   },
//   {
//     name: "국민연금공단",
//     share: 7.25,
//   },
//   {
//     name: "BlackRock Fund Advisors",
//     share: 5.03,
//   },
//   {
//     name: "삼성물산㈜",
//     share: 5.01,
//   },
//   {
//     name: "홍라희",
//     share: 1.64,
//   },
// ];

const useHolderFilter = <T extends { name: string; bgColor: string }>(
  defaultData: T[],
) => {
  const [filterings, setFilterings] = useState<Set<string>>(new Set());

  const filterData = useCallback(
    (name: string) => () => {
      setFilterings((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(name)) {
          newSet.delete(name);
        } else {
          newSet.add(name);
        }
        return newSet;
      });
    },
    [],
  );

  const filteredList = useMemo(
    () => defaultData.filter((item) => !filterings.has(item.name)),
    [defaultData, filterings],
  );

  return [filteredList, filterData] as const;
};

function Highlighter({ children }: { children: ReactNode }) {
  return <span className={"text-primary-900"}>{children}</span>;
}
