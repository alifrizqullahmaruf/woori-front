import { Back } from "../atoms/Icon";

interface DisplayMoreButtonProps {
  onClick: () => void;
  isSpread: boolean;
}

export default function DisplayMoreButton({
  onClick,
  isSpread,
}: DisplayMoreButtonProps) {
  return (
    <button
      className={
        "text-gray-w600 flex w-full items-center justify-center gap-1.5"
      }
      onClick={onClick}
    >
      <span>{isSpread ? "접기" : "더보기"}</span>
      <Back
        className={`mt-0.5 size-[15px] ${isSpread ? "rotate-[90deg]" : "rotate-[270deg]"}`}
      />
    </button>
  );
}
