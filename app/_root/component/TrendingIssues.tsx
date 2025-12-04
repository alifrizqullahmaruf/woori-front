import Link from "next/link";
import CardFrame from "@/app/_common/component/atoms/CardFrame";
import { Back } from "@/app/_common/component/atoms/Icon";
import SectionHeader from "@/app/_root/component/common/SectionHeader";

export default function TrendingIssues() {
  return (
    <section>
      <SectionHeader
        headingText={
          <>
            오늘 투자자들,
            <br />이 이슈가 중심이에요
          </>
        }
      />
      <ul className={"mt-[18px] flex flex-col gap-[18px]"}>
        {DUMMY_ISSUE_DATA.map((item, index) => (
          <TrendingIssuesItem
            key={`issue_${index}_${item.title}`}
            {...item}
            index={index}
          />
        ))}
      </ul>
    </section>
  );
}

const DUMMY_ISSUE_DATA = [
  {
    title: "미국 재정 적자 우려에 증시 급락",
    content:
      "미국 국채 수익률 급등과 재정 적자 우려, 금리 상승, 트럼프 대통령의 관세 정책 등으로 인해 미국 증시가 전반적으로 하락세를 보이고 있습니다.",
  },
  {
    title: "오픈AI, 조니 아이브의 스타트업 ‘io’ 64억 달러에 인수",
    content:
      "오픈AI는 아이폰 디자이너 조니 아이브가 설립한 스타트업 ‘io’를 약 64억 달러에 인수하며, 하드웨어 역량 강화와 AI의 물리적 확장을 본격 추진하고 있습니다.",
  },
  {
    title: "나이키, 가격 인상 및 아마존 판매 재개",
    content:
      "나이키는 공급망 혼란과 수익성 악화에 대응해 제품 가격을 인상하고 약 6년 만에 아마존 판매를 재개하며, 스포츠웨어 업계 전반에 가격 변동이 예상됩니다.",
  },
];

interface TrendingIssuesItemProps {
  title: string;
  content: string;
  index: number;
}

function TrendingIssuesItem({
  title,
  content,
  index,
}: TrendingIssuesItemProps) {
  return (
    <CardFrame className={"rounded-tl-none !p-[21px]"}>
      <Link href={`/issues/latest?item=${index}`}>
        <header className={"mb-1.5 flex items-center justify-between"}>
          <h3 className={"line-clamp-2 max-w-[calc(100%-27px)] font-medium"}>
            {title}
          </h3>
          <Back className={"text-primary-800 ml-3 size-[15px] rotate-180"} />
        </header>
        <div className={"typo-tiny line-clamp-3"}>{content}</div>
      </Link>
    </CardFrame>
  );
}
