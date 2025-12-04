"use client";

import { useCallback, useState } from "react";
import { Back } from "@/app/_common/component/atoms/Icon";
import AiButton from "@/app/_common/component/molecules/AiButton";
import PageViewContainer from "@/app/_common/component/templates/PageViewContainer";
import IssueCard from "./IssueCard";

export default function IssuesListPageView() {
  // TODO: 서버에서 전달된 props 사용
  const [issueList, addIssue] = useIssueList(INITIAL_DUMMY_ISSUE_DATA);

  // TODO: 동적으로 불러온 응답 사용, 응답에는 다음 목록이 존재하는지 여부 필요
  const addIssueDummy = useCallback(() => {
    DUMMY_ISSUE_DATA.forEach((issue) => {
      addIssue(issue);
    });
  }, [addIssue]);

  return (
    <PageViewContainer verticalPadding={{ top: 18, bottom: 72 }}>
      <header className={"flex items-center justify-between"}>
        <h1 className={"typo-large font-bold"}>
          놓치면 아쉬운 지난 이슈 모아보기
        </h1>
        <AiButton />
      </header>
      <ul className={"mb-[36px] flex flex-col gap-[54px]"}>
        {Object.entries(issueList).map(([dateKey, issues], index) => (
          <li key={`issue_list_${dateKey}_${index}`}>
            <section>
              <h2 className={"typo-large font-medium"}>
                {formatPublishDate(dateKey)}
              </h2>
              <ul className={"mt-[18px] flex flex-col gap-[18px]"}>
                {issues.map((issue, index) => (
                  <li key={`issue_list_item_${issue.title}_${index}`}>
                    <IssueCard {...issue} />
                  </li>
                ))}
              </ul>
            </section>
          </li>
        ))}
      </ul>
      <button
        className={
          "text-gray-w600 flex w-full items-center justify-center gap-1.5"
        }
        onClick={addIssueDummy}
      >
        <span>더보기</span>
        <Back className={"mt-0.5 size-[15px] rotate-[270deg]"} />
      </button>
    </PageViewContainer>
  );
}

export interface Issue {
  publish_date: string;
  title: string;
  summary: string;
  content: string;
}

const INITIAL_DUMMY_ISSUE_DATA: Issue[] = [
  {
    publish_date: "2025-07-04",
    title: "엔비디아 연간 수익률 플러스 전환... 기술주 주도 증시 상승",
    summary: "엔비디아 반등, 기술주 중심 증시 상승",
    content:
      "5일(현지시간) 미국 증시는 기술주 강세에 힘입어 상승 마감했다.\n특히 엔비디아는 장중 4% 가까이 오르며 연간 수익률이 다시 플러스로 전환됐다.\nAI 수요 확대 기대감이 재차 반영되며 투자자들의 매수세가 집중됐고, 이는 전반적인 기술주 전반에 긍정적 영향을 미치며 나스닥과 S&P500 지수를 견인했다.\n한편 시장에서는 오는 주 발표될 고용 지표와 연준의 통화정책 스탠스를 주시하고 있다. 하지만 이날은 전반적으로 위험자산 선호 분위기가 강하게 나타나며 특히 반도체와 AI 관련 종목들이 상승세를 주도했다.",
  },
  {
    publish_date: "2025-07-04",
    title: "보잉, 카타르 항공과 사상 최대 규모 계약 체결",
    summary: "보잉, 카타르 항공과 340억 달러 규모 초대형 계약",
    content:
      "5일(현지시간) 미국 증시는 기술주 강세에 힘입어 상승 마감했다.\n특히 엔비디아는 장중 4% 가까이 오르며 연간 수익률이 다시 플러스로 전환됐다.\nAI 수요 확대 기대감이 재차 반영되며 투자자들의 매수세가 집중됐고, 이는 전반적인 기술주 전반에 긍정적 영향을 미치며 나스닥과 S&P500 지수를 견인했다.\n한편 시장에서는 오는 주 발표될 고용 지표와 연준의 통화정책 스탠스를 주시하고 있다. 하지만 이날은 전반적으로 위험자산 선호 분위기가 강하게 나타나며 특히 반도체와 AI 관련 종목들이 상승세를 주도했다.",
  },
  {
    publish_date: "2025-07-04",
    title: "엔비디아가 투자한 코어위브, 첫 실적발표에서 연간 매출 4배 성장",
    summary: "코어위브 매출 4배↑, 엔비디아 수혜 부각",
    content:
      "5일(현지시간) 미국 증시는 기술주 강세에 힘입어 상승 마감했다.\n특히 엔비디아는 장중 4% 가까이 오르며 연간 수익률이 다시 플러스로 전환됐다.\nAI 수요 확대 기대감이 재차 반영되며 투자자들의 매수세가 집중됐고, 이는 전반적인 기술주 전반에 긍정적 영향을 미치며 나스닥과 S&P500 지수를 견인했다.\n한편 시장에서는 오는 주 발표될 고용 지표와 연준의 통화정책 스탠스를 주시하고 있다. 하지만 이날은 전반적으로 위험자산 선호 분위기가 강하게 나타나며 특히 반도체와 AI 관련 종목들이 상승세를 주도했다.",
  },
  {
    publish_date: "2025-07-03",
    title: "미국 증시, 2025년 손실 모두 회복 1",
    summary: "엔비디아 반등, 기술주 중심 증시 상승",
    content:
      "보잉은 카타르 항공과 약 340억 달러 규모의 항공기 공급 계약을 체결했다.\n이번 계약은 보잉 역사상 단일 항공사와의 최대 규모 거래로, 여객기와 화물기 포함 총 100여 대가 공급될 예정이다.\n공급 물량은 향후 10년간 순차적으로 인도될 예정이며, 보잉은 이를 통해 글로벌 항공기 시장 점유율 확대에 대한 기대를 높이고 있다.",
  },
  {
    publish_date: "2025-07-03",
    title: "엔비디아, 미중 관세 유예 및 사우디 공급 호재로 급상승 1",
    summary: "보잉, 카타르 항공과 340억 달러 규모 초대형 계약",
    content:
      "보잉은 카타르 항공과 약 340억 달러 규모의 항공기 공급 계약을 체결했다.\n이번 계약은 보잉 역사상 단일 항공사와의 최대 규모 거래로, 여객기와 화물기 포함 총 100여 대가 공급될 예정이다.\n공급 물량은 향후 10년간 순차적으로 인도될 예정이며, 보잉은 이를 통해 글로벌 항공기 시장 점유율 확대에 대한 기대를 높이고 있다.",
  },
  {
    publish_date: "2025-07-03",
    title: "사우디, 미국과 3,000억달러 규모 투자 협력 1",
    summary: "코어위브 매출 4배↑, 엔비디아 수혜 부각",
    content:
      "보잉은 카타르 항공과 약 340억 달러 규모의 항공기 공급 계약을 체결했다.\n이번 계약은 보잉 역사상 단일 항공사와의 최대 규모 거래로, 여객기와 화물기 포함 총 100여 대가 공급될 예정이다.\n공급 물량은 향후 10년간 순차적으로 인도될 예정이며, 보잉은 이를 통해 글로벌 항공기 시장 점유율 확대에 대한 기대를 높이고 있다.",
  },
];

const DUMMY_ISSUE_DATA: Issue[] = [
  {
    publish_date: "2025-07-03",
    title: "미국 증시, 2025년 손실 모두 회복 2",
    summary: "엔비디아 반등, 기술주 중심 증시 상승",
    content:
      "보잉은 카타르 항공과 약 340억 달러 규모의 항공기 공급 계약을 체결했다.\n이번 계약은 보잉 역사상 단일 항공사와의 최대 규모 거래로, 여객기와 화물기 포함 총 100여 대가 공급될 예정이다.\n공급 물량은 향후 10년간 순차적으로 인도될 예정이며, 보잉은 이를 통해 글로벌 항공기 시장 점유율 확대에 대한 기대를 높이고 있다.",
  },
  {
    publish_date: "2025-07-03",
    title: "엔비디아, 미중 관세 유예 및 사우디 공급 호재로 급상승 2",
    summary: "보잉, 카타르 항공과 340억 달러 규모 초대형 계약",
    content:
      "보잉은 카타르 항공과 약 340억 달러 규모의 항공기 공급 계약을 체결했다.\n이번 계약은 보잉 역사상 단일 항공사와의 최대 규모 거래로, 여객기와 화물기 포함 총 100여 대가 공급될 예정이다.\n공급 물량은 향후 10년간 순차적으로 인도될 예정이며, 보잉은 이를 통해 글로벌 항공기 시장 점유율 확대에 대한 기대를 높이고 있다.",
  },
  {
    publish_date: "2025-07-03",
    title: "사우디, 미국과 3,000억달러 규모 투자 협력 2",
    summary: "코어위브 매출 4배↑, 엔비디아 수혜 부각",
    content:
      "보잉은 카타르 항공과 약 340억 달러 규모의 항공기 공급 계약을 체결했다.\n이번 계약은 보잉 역사상 단일 항공사와의 최대 규모 거래로, 여객기와 화물기 포함 총 100여 대가 공급될 예정이다.\n공급 물량은 향후 10년간 순차적으로 인도될 예정이며, 보잉은 이를 통해 글로벌 항공기 시장 점유율 확대에 대한 기대를 높이고 있다.",
  },
  {
    publish_date: "2025-07-02",
    title: "엔비디아 연간 수익률 플러스 전환... 기술주 주도 증시 상승",
    summary: "보잉, 카타르 항공과 340억 달러 규모 초대형 계약",
    content:
      "5일(현지시간) 미국 증시는 기술주 강세에 힘입어 상승 마감했다.\n특히 엔비디아는 장중 4% 가까이 오르며 연간 수익률이 다시 플러스로 전환됐다.\nAI 수요 확대 기대감이 재차 반영되며 투자자들의 매수세가 집중됐고, 이는 전반적인 기술주 전반에 긍정적 영향을 미치며 나스닥과 S&P500 지수를 견인했다.\n한편 시장에서는 오는 주 발표될 고용 지표와 연준의 통화정책 스탠스를 주시하고 있다.\n하지만 이날은 전반적으로 위험자산 선호 분위기가 강하게 나타나며 특히 반도체와 AI 관련 종목들이 상승세를 주도했다.",
  },
  {
    publish_date: "2025-07-02",
    title: "보잉, 카타르 항공과 사상 최대 규모 계약 체결",
    summary: "보잉, 카타르 항공과 340억 달러 규모 초대형 계약",
    content:
      "5일(현지시간) 미국 증시는 기술주 강세에 힘입어 상승 마감했다.\n특히 엔비디아는 장중 4% 가까이 오르며 연간 수익률이 다시 플러스로 전환됐다.\nAI 수요 확대 기대감이 재차 반영되며 투자자들의 매수세가 집중됐고, 이는 전반적인 기술주 전반에 긍정적 영향을 미치며 나스닥과 S&P500 지수를 견인했다.\n한편 시장에서는 오는 주 발표될 고용 지표와 연준의 통화정책 스탠스를 주시하고 있다.\n하지만 이날은 전반적으로 위험자산 선호 분위기가 강하게 나타나며 특히 반도체와 AI 관련 종목들이 상승세를 주도했다.",
  },
  {
    publish_date: "2025-07-02",
    title: "엔비디아가 투자한 코어위브, 첫 실적발표에서 연간 매출 4배 성장",
    summary: "코어위브 매출 4배↑, 엔비디아 수혜 부각",
    content:
      "5일(현지시간) 미국 증시는 기술주 강세에 힘입어 상승 마감했다.\n특히 엔비디아는 장중 4% 가까이 오르며 연간 수익률이 다시 플러스로 전환됐다.\nAI 수요 확대 기대감이 재차 반영되며 투자자들의 매수세가 집중됐고, 이는 전반적인 기술주 전반에 긍정적 영향을 미치며 나스닥과 S&P500 지수를 견인했다.\n한편 시장에서는 오는 주 발표될 고용 지표와 연준의 통화정책 스탠스를 주시하고 있다.\n하지만 이날은 전반적으로 위험자산 선호 분위기가 강하게 나타나며 특히 반도체와 AI 관련 종목들이 상승세를 주도했다.",
  },
];

const formatPublishDate = (date: string) => {
  if (!date.includes("-")) return date;

  const [, rawMonth, rawDay] = date.split("-");
  const month = rawMonth.startsWith("0") ? rawMonth.slice(1) : rawMonth;
  const day = rawDay.startsWith("0") ? rawDay.slice(1) : rawDay;

  return `${month}월 ${day}일`;
};

interface NewIssueList {
  [key: string]: Issue[];
}

const useIssueList = (initialList: Issue[]) => {
  const handleInitialList = (initialList: Issue[]) => {
    return initialList.reduce((acc, curr) => {
      const dateKey = formatPublishDate(curr.publish_date);
      if (!acc[dateKey]) {
        acc[dateKey] = [curr];
      } else {
        acc[dateKey].push(curr);
      }
      return acc;
    }, {} as NewIssueList);
  };

  const [issueList, setIssueList] = useState<NewIssueList>(
    handleInitialList(initialList),
  );

  const addIssue = (issue: Issue) => {
    const dateKey = formatPublishDate(issue.publish_date);
    setIssueList((prev) => {
      const newIssueList = { ...prev };
      if (!newIssueList[dateKey]) {
        newIssueList[dateKey] = [issue];
      } else if (
        !newIssueList[dateKey].find((item) => item.title === issue.title)
      ) {
        newIssueList[dateKey].push(issue);
      }
      return newIssueList;
    });
  };

  return [issueList, addIssue] as const;
};
