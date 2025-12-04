"use client";

import Image from "next/image";
import DescriptionModal from "@/app/_common/component/organism/DescriptionModal";
import { useModalStore } from "@/app/_global/providers/ModalProvider";

export default function AiButton() {
  const { openModal } = useModalStore();

  const handleClick = () => {
    openModal(DescriptionModal, {
      title: "AI가 수집한 요약 정보입니다",
      content:
        "이 자료는 금융 전문 생성형 AI ‘어드바이저로렌’이 제공한 참고용 정보입니다. 해당 정보는 부정확하거나 최신이 아닐 수 있으며, 투자에 대한 최종 결정과 책임은 투자자 본인에게 있습니다.",
    });
  };

  return (
    <button title={"AI 정보 안내"} className={"mt-1"} onClick={handleClick}>
      <Image src={"/images/Ai.png"} alt={"AI"} width={21} height={21} />
    </button>
  );
}
