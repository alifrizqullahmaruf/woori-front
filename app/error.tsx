"use client";
import PageViewContainer from "./_common/component/templates/PageViewContainer";
import ErrorImg from "@/public/images/error.png";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { usePageMeta } from "@/app/_global/providers/PageMetaProvider";


export default function Error() {
  const router = useRouter();
  const { setHideFooter } = usePageMeta();

  useEffect(() => {
    setHideFooter(true);
  }, [setHideFooter]);

  const handleConfirm = () => {
    router.push("/");
  };

  return (
    <PageViewContainer
      verticalPadding={{ top: 16, bottom: 72 }}
      className="flex flex-col items-center gap-[24px]"
    >
      <Image
        src={ErrorImg}
        alt="서비스 점검 안내 아이콘"
        className="mt-7 h-[57px] w-[57px]"
      />
      <p className="text-center text-xl">
        서비스 점검 중입니다. 
        <br />
        더 나은 서비스를 위해 잠시 쉬어갈게요.
      </p>
      <button
        onClick={handleConfirm}
        className="mt-auto w-[312px] rounded-[8px] bg-[#2589F4] px-[20px] py-[10px] text-xl text-white"
      >
        확인
      </button>
    </PageViewContainer>
  );
}
