import SectionHeader from "@/app/_root/component/common/SectionHeader";

export default function ThemeMovementNewsSection() {
  return (
    <div>
      <SectionHeader headingText={"이 테마를 움직인 배경 뉴스"} />
      <p className={"typo-tiny text-gray-w800 mt-[12px]"}>
        메타는 AI 데이터 라벨링 기업 스케일 AI에 100억 달러 이상 투자하는 방안을
        논의 중이며, 이는 메타 최대 규모의 외부 AI 투자로 예상됩니다. 스케일
        AI는 마이크로소프트와 오픈AI 등에 서비스를 제공하며, 올해 매출 20억
        달러를 전망하고 있습니다. 또한 메타의 Llama 3를 기반으로 국방용 AI 모델
        '디펜스 라마'를 개발한 바 있습니다.
      </p>
    </div>
  );
}
