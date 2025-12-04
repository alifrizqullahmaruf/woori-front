import PageViewContainer from "@/app/_common/component/templates/PageViewContainer";
import RepresentativesSection from "./RepresentativesSection";
import ThemeMovementNewsSection from "./ThemeMovementNewsSection";
import ThemeReturnsSection from "./ThemeReturnsSection";
import ThemeTreemapSection from "./ThemeTreemapSection";

export default function ThemeDetailPageView() {
  return (
    <PageViewContainer verticalPadding={{ top: 38, bottom: 72 }}>
      <h1 className={"typo-large mb-[21px] font-medium"}>
        인공지능,
        <br />
        <span className={"font-bold"}>테마의 핵심 키워드와 흐름</span>
      </h1>
      <ThemeRankBadge rank={7} />
      <p className={"typo-tiny text-gray-w800 mt-[9px]"}>
        인공지능은 AI 기술 개발 및 활용에 필수적인 인프라를 제공하는 기업들로
        구성됩니다. AI 연산을 위한 고성능 반도체(NPU, GPU 등)를 설계·생산하는
        반도체 기업, AI 모델 학습과 서비스를 위한 대규모 컴퓨팅 자원을 제공하는
        클라우드 기업, 그리고 AI 학습에 필요한 대규모 데이터를
        수집·가공·관리하는 데이터 기업들이 포함됩니다.
      </p>
      {/* Line Chart*/}
      <section className={"mt-[21px]"}>
        <ThemeReturnsSection />
        {/* items */}
      </section>
      <section className={"mt-[54px]"}>
        <RepresentativesSection />
      </section>
      {/* News */}
      <section className={"mt-[54px]"}>
        <ThemeMovementNewsSection />
      </section>
      {/* Treemap Chart */}
      <section className={"mt-[54px]"}>
        <ThemeTreemapSection />
      </section>
    </PageViewContainer>
  );
}

interface ThemeRankBadgeProps {
  rank: number;
}

function ThemeRankBadge({ rank }: ThemeRankBadgeProps) {
  return (
    <div
      className={"bg-accent-red/10 typo-tiny text-accent-red w-max px-2.5 py-1 rounded-sm"}
    >
      금주 테마 {rank}위
    </div>
  );
}
