"use client"
import PageViewContainer from "./_common/component/templates/PageViewContainer";
import NotFoundImg from "@/public/images/not_found.png";
import Image from "next/image";
import { useEffect } from "react";
import { usePageMeta } from "@/app/_global/providers/PageMetaProvider";


export default function NotFound() {
  const { setHideFooter } = usePageMeta();
  useEffect(() => {
    setHideFooter(true);
  }, [setHideFooter]);
  const handleConfirm = () => {
    window.location.href = "/";
  };

  return (
    
    <PageViewContainer
      verticalPadding={{ top: 16, bottom: 72 }}
      className={"flex flex-col items-center gap-[24px]"}
    >
      <Image src={NotFoundImg} alt="" className="h-[57px] w-[57px] mt-7" />
      <p className="text-center text-xl">
        요청을 처리할 수 없습니다. 
        <br />
        다시 시도해 주세요.
      </p>
      <button
        onClick={handleConfirm}
        style={{
          backgroundColor: "#2589F4",
          padding: "10px 20px",
          borderRadius: "8px",
          color: "white",
        }}
        className="mt-auto w-[312px] text-xl"
      >
        확인
      </button>
    </PageViewContainer>
  );
}
