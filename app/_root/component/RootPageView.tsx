import PageViewContainer from "@/app/_common/component/templates/PageViewContainer";
import Hottest from "@/app/_root/component/Hottest";
import TopPerformanceStock from "@/app/_root/component/TopPerformanceStock";
import TopPerformanceStock2 from "@/app/_root/component/TopPerformanceStock";
import TopPerformanceTheme from "@/app/_root/component/TopPerformanceTheme";
import TrendingIssues from "@/app/_root/component/TrendingIssues";

export default function RootPageView() {
  return (
    <PageViewContainer
      verticalPadding={{ top: 16, bottom: 72 }}
      className={"gap-[54px]"}
    >
      <Hottest />
      <TopPerformanceStock2 />
      <TopPerformanceTheme />
      <TrendingIssues />
    </PageViewContainer>
  );
}
