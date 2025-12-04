import { LaurenLogoAlt } from "@/app/_common/component/atoms/Icon";

export default function Footer() {
  return (
    <footer className={"bg-border px-6 py-9"}>
      <div className={"mb-4"}>
        <LaurenLogoAlt />
      </div>
      <p className={"typo-micro text-gray-w700"}>
        본 서비스는 주식회사 어드바이저로렌이 우리은행 고객을 위해 제공하는
        것으로, 현재 위탁 테스트 단계에 있으므로 별도의 사전 고지 없이 서비스가
        중단될 수 있습니다. 고객께서는 이와 같은 테스트 환경 및 잠재적인
        위험성을 충분히 인지한 상태에서 서비스를 이용하시기 바랍니다.
        <br />본 서비스는 금융 전문 생성형 AI ‘어드바이저로렌’이 제공하는 참고용
        정보이며, 제공된 정보는 부정확하거나 최신 정보가 아닐 수 있습니다.
        <br />
        투자 판단 및 그에 따른 최종 결정과 책임은 전적으로 고객 본인에게 있으며,
        본 서비스는 어떠한 투자 권유도 포함하지 않습니다.
      </p>
    </footer>
  );
}
