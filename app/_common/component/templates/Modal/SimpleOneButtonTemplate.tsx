import { ReactNode, useCallback } from "react";
import { Close } from "@/app/_common/component/atoms/Icon";

interface SimpleOneButtonTemplateProps {
  title: string;
  children: ReactNode;
  summary?: string;
  note?: string;
  buttonText?: string;
  width?: string;
  onClick?: () => void;
}

export default function SimpleOneButtonTemplate({
  title,
  children,
  buttonText = "확인",
  width = "w-full",
  onClick,
  summary,
  note,
}: SimpleOneButtonTemplateProps) {
  const handleClick = useCallback(() => {
    if (onClick) {
      onClick();
    }
  }, [onClick]);
  const listStyle = "";

  return (
    <div
      className={`relative ${width} mx-auto rounded-[1.125rem] bg-white md:max-w-[720px]`}
    >
      {/*<div className={`relative ${width} rounded-[1.125rem] bg-white`}>*/}
      <button className={"absolute top-4 right-4"} onClick={handleClick}>
        <Close />
      </button>
      <h2 className={"typo-medium px-6 pt-9 pb-3 font-medium"}>{title}</h2>
      <div
        className={
          "typo-small max-h-[400px] overflow-y-auto px-6 pt-[14px] pb-6"
        }
      >
        {summary && (
          <h3 className={"text-accent-navy typo-tiny mb-1.5 font-bold"}>
            {summary}
          </h3>
        )}
        {children}
        {note && (
          <p
            className={
              "typo-tiny text-gray-w600 mt-5 pl-6 -indent-3 font-medium before:mr-2 before:content-['•']"
            }
          >
            {note}
          </p>
        )}
      </div>
      <div className={"p-4 pt-0"}>
        <button
          className={
            "bg-primary-800 w-full rounded-xl px-2 py-4 text-center font-medium text-white"
          }
          onClick={handleClick}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}
