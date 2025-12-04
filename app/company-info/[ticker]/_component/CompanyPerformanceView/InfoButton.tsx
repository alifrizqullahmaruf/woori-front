import { Info } from "@/app/_common/component/atoms/Icon";
import DescriptionModal from "@/app/_common/component/organism/DescriptionModal";
import { HelpDescriptions } from "@/app/_common/types";
import { useModalStore } from "@/app/_global/providers/ModalProvider";

interface InfoButtonProps {
  modalDescription: HelpDescriptions;
  className?: string;
}

export default function InfoButton({ modalDescription }: InfoButtonProps) {
  const { openModal } = useModalStore();

  const handleClick = () => {
    openModal(DescriptionModal, {
      title: modalDescription.title,
      content: modalDescription.content,
      summary: modalDescription.summary,
      note: modalDescription.note,
      items: modalDescription.items,
    });
  };

  return (
    <button className={"mt-1"} onClick={handleClick} title={"정보 안내"}>
      <Info className={"size-[18px]"} />
    </button>
  );
}
