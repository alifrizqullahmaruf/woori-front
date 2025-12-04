"use client";

import { useState } from "react";
import CardFrame from "@/app/_common/component/atoms/CardFrame";
import { Back } from "@/app/_common/component/atoms/Icon";
import { Issue } from "./IssuesListPageView";

type IssueCardProps = Issue;

export default function IssueCard({ title, summary, content }: IssueCardProps) {
  const [isDisplayContent, handleClick] = useShouldDisplayContent();

  return (
    <CardFrame className={"bg-primary-100/30 rounded-tl-none !p-[21px]"}>
      <h3 className={"mb-[9px] font-medium"}>{title}</h3>
      <p className={"typo-tiny"}>{isDisplayContent ? content : summary}</p>
      <button
        onClick={handleClick}
        className={"text-primary-800 mt-[18px] flex items-center gap-1.5"}
      >
        <span>{isDisplayContent ? "접기" : "자세히 보기"}</span>
        <Back
          className={`mt-1 size-[15px] ${isDisplayContent ? "rotate-90" : "rotate-[270deg]"}`}
        />
      </button>
    </CardFrame>
  );
}

const useShouldDisplayContent = () => {
  const [isDisplayContent, setIsDisplayContent] = useState(false);

  const handleClick = () => {
    setIsDisplayContent((prev) => !prev);
  };

  return [isDisplayContent, handleClick] as const;
};
