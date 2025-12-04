"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Back } from "@/app/_common/component/atoms/Icon";
import AiButton from "@/app/_common/component/molecules/AiButton";
import PageViewContainer from "@/app/_common/component/templates/PageViewContainer";

export default function LatestIssuesPageView() {
  const selectedItemIndex = useParseSearchParams();
  const listRefs = useScrollToSelectedItem(selectedItemIndex);

  return (
    <PageViewContainer
      className={"text-white"}
      verticalPadding={{ top: 18, bottom: 72 }}
    >
      <header className={"mb-6 flex items-start justify-between"}>
        <h1 className={"typo-large font-medium"}>
          7월 5일,
          <br />
          <span className={"font-bold"}>오늘 증시의 중심 이슈</span>
        </h1>
        <AiButton />
      </header>
      <ul className={"flex flex-col gap-[18px]"}>
        {DUMMY_ISSUE_DATA.map((item, index) => (
          <li
            key={`issue_${index}`}
            ref={(el) => {
              listRefs.current.push(el);
            }}
          >
            <LatestIssueItem {...item} />
          </li>
        ))}
      </ul>
      <Link
        href={"/issues/list"}
        className={"mt-9 flex items-center justify-center"}
      >
        지난 이슈 둘러보기 <Back className={"size-[15px] rotate-180"} />
      </Link>
    </PageViewContainer>
  );
}

const DUMMY_ISSUE_DATA = [
  {
    title: "미국 재정 적자 우려에 증시 급락",
    content:
      "미국 국채 수익률이 급등하고 재정 적자에 대한 우려가 커지면서 다우, S&P 500, 나스닥 지수가 일제히 하락했습니다.\n최근 발표된 미국 정부 예산안이 이미 높은 부채 부담을 더욱 키울 것이라는 전망이 확산됐고, 국채 입찰 수요 감소로 채권 가격이 하락하면서 시장의 불안이 가중됐습니다.\n트럼프 대통령의 관세 정책으로 인한 불확실성 역시 지속적인 부담 요인으로 작용하고 있습니다.\n금리 상승의 영향으로 애플, 아마존 등 주요 기술주도 하락했으며, 지난달 반등했던 증시는 다시 조정 국면에 진입할 가능성이 제기되고 있습니다.",
  },
  {
    title: "오픈AI, 조니 아이브의 스타트업 ‘io’ 64억 달러에 인수",
    content:
      "오픈AI는 아이폰 디자이너 조니 아이브가 설립한 AI 기기 스타트업 ‘io’를 약 64억 달러에 인수하기로 합의했습니다.\n이는 오픈AI 역사상 최대 규모의 인수로, 최근 AI 코딩툴 ‘Windsurf’ 인수에 이어 또 한 번의 대형 거래입니다.\n‘io’는 애플 출신 인물들이 주축이 되어 약 1년 전 설립됐으며, 아이브는 이번 인수를 통해 오픈AI 전반에 걸친 디자인 및 창의적 방향성을 이끌게 됩니다.\n오픈AI는 최근 메타의 AR 글라스 책임자 케이틀린칼리노우스키를 영입하고, 로봇 스타트업에도 투자하는 등 하드웨어 역량 강화와 AI의 물리적 확장을 적극 추진 중입니다.",
  },
  {
    title: "나이키, 가격 인상 및 아마존 판매 재개",
    content:
      "나이키는 다음 주부터 일부 제품 가격을 인상하고, 약 6년 만에 아마존에서 제품 판매를 재개합니다.\n이는 트럼프 전 대통령의 관세 정책으로 인한 공급망 혼란과 소매업체 수익성 악화에 대응하기 위한 조치입니다.\n2019년 아마존과 협업을 중단했던 나이키는 이후 자체 채널 중심의 전략을 펼쳐왔으나, 최근 엘리엇 힐 CEO의 회복 전략 일환으로 아마존 복귀를 결정했습니다.\n한편, 경쟁사 푸마도 관세 영향을 이유로 미국 수출 축소와 가격 인상 가능성을 언급해 스포츠웨어 업계 전반에 가격 변동이 확대될 것으로 보입니다.",
  },
];

interface LatestIssueItemProps {
  title: string;
  content: string;
}

function LatestIssueItem({ title, content }: LatestIssueItemProps) {
  return (
    <article className={"rounded-[20px] rounded-tl-none bg-white p-[21px]"}>
      <h2 className={"mb-[15px] font-medium text-black"}>{title}</h2>
      {content.split("\n").map((line, index) => (
        <p
          key={`issue_${title}_line_${index}`}
          className={"typo-tiny text-gray-w800"}
        >
          {line}
        </p>
      ))}
    </article>
  );
}

const useParseSearchParams = () => {
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(
    null,
  );
  const searchParam = useSearchParams();

  useEffect(() => {
    const itemParam = searchParam.get("item");
    if (itemParam) {
      const index = Number(itemParam);
      if (!isNaN(index)) {
        setSelectedItemIndex(index);
      }
    }
  }, [searchParam]);

  return selectedItemIndex;
};

const useScrollToSelectedItem = (selectedIndex: number | null) => {
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    if (selectedIndex !== null && itemRefs.current[selectedIndex]) {
      itemRefs.current[selectedIndex]?.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [selectedIndex]);

  return itemRefs;
};
