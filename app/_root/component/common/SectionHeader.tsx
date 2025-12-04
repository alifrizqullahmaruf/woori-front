import { ReactNode } from "react";
import { TrendingUp } from "@/app/_common/component/atoms/Icon";
import AiButton from "@/app/_common/component/molecules/AiButton";

interface SectionHeaderProps {
  headingText: ReactNode;
  subHeadingText?: string;
  isAiButtonNeeded?: boolean;
  isDisplayingIcon?: boolean;
}

export default function SectionHeader({
  headingText,
  subHeadingText,
  isAiButtonNeeded = true,
  isDisplayingIcon = false,
}: SectionHeaderProps) {
  return (
    <>
      <header className={"mb-1.5 flex items-start justify-between"}>
        <h2 className={"typo-large flex items-center gap-1.5 font-bold"}>
          {headingText}
          {isDisplayingIcon && <TrendingUp />}
        </h2>
        {isAiButtonNeeded && <AiButton />}
      </header>
      {subHeadingText && <p>{subHeadingText}</p>}
    </>
  );
}
