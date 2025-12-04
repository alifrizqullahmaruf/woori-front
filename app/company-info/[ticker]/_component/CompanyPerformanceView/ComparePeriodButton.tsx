import { Check } from "@/app/_common/component/atoms/Icon";

interface ComparePeriodButtonProps {
  isActive?: boolean;
  toggleActive?: () => void;
}

export default function ComparePeriodButton({
  isActive = false,
  toggleActive,
}: ComparePeriodButtonProps) {
  const handleClick = () => {
    if (toggleActive) {
      toggleActive();
    }
  };

  return (
    <button
      className={"typo-tiny flex items-center gap-0.5 font-medium"}
      style={{ color: isActive ? "black" : "#B2B3B9" }}
      onClick={handleClick}
    >
      <Check style={{ color: isActive ? "#00B8D4" : "#B2B3B9" }} />
      전년동기대비
    </button>
  );
}
