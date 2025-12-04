"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import CardFrame from "@/app/_common/component/atoms/CardFrame";
import SectionHeader from "@/app/_root/component/common/SectionHeader";
import HottestDescription from "./HottestDescription";

export default function Hottest() {
  const [selectedIndex, changeIndex] = useHandleIndex();

  return (
    <section>
      <SectionHeader
        headingText={
          <>
            요즘 가장 핫한 종목,
            <br />
            이건 다 이유가 있다
          </>
        }
        subHeadingText={"전 세계가 몰린 이유, 한눈에 보여드릴게요"}
      />
      <ul
        className={"mt-7 mb-[22px] flex items-center justify-center gap-[9px]"}
      >
        {DUMMY_HOTTEST_ITEMS.map((item, index) => (
          <li key={`hottest_${index}_${item.name}`}>
            <HottestItem
              name={item.name}
              logoUrl={item.logoUrl}
              index={index + 1}
              handleClick={changeIndex(index)}
              isActive={selectedIndex === index}
            />
          </li>
        ))}
      </ul>
      <HottestDescription
        description={DUMMY_HOTTEST_ITEMS[selectedIndex].description}
        indices={DUMMY_HOTTEST_ITEMS[selectedIndex].indices}
        mentions={DUMMY_HOTTEST_ITEMS[selectedIndex].mentions}
      />
    </section>
  );
}

const DUMMY_HOTTEST_ITEMS = [
  {
    name: "테슬라",
    logoUrl: "/images/logo_tesla.png",
    mentions: {
      youtube: 2121,
      reddit: 2378,
      x: 1585,
    },
    description:
      "테슬라는 5월 주가 23% 상승 이후, 머스크와 트럼프 간 공개적인 불화설로 인해 최근 일주일 간 14% 급락했어요.",
    indices: ["로보택시", "휴머노이드", "관세", "중국"],
  },
  {
    name: "구글",
    logoUrl: "/images/logo_google_featured.png",
    mentions: {
      youtube: 2121,
      reddit: 2378,
      x: 1585,
    },
    description:
      "구글은 최근 AI 모델 ‘제미니’ 성능 논란과 유튜브 프리미엄 요금 인상 이슈로 주목받았어요.\n안드로이드 15 베타와 광고 정책 변화도 화제였죠.",
    indices: ["제미니", "안드로이드15", "AI논란", "광고정책"],
  },
  {
    name: "비트코인",
    logoUrl: "/images/logo_btc.png",
    mentions: {
      youtube: 2121,
      reddit: 2378,
      x: 1585,
    },
    description:
      "비트코인은 최근 주가 급락으로 주목받았어요.\n비트코인 가격은 최근 일주일 간 14% 급락했어요.",
    indices: ["비트코인", "가격", "급락", "트럼프"],
  },
];

interface HottestItemProps {
  logoUrl: string | null;
  name: string;
  index: number;
  isActive: boolean;
  handleClick: () => void;
}

function HottestItem({
  name,
  logoUrl,
  index,
  isActive,
  handleClick,
}: HottestItemProps) {
  return (
    <CardFrame
      className={`typo-small flex flex-1 flex-col gap-1.5 px-3 py-[9px] ${isActive ? "border-primary-800 border" : ""}`}
    >
      <button onClick={handleClick}>
        <div className={"text-primary-850 text-left font-bold"}>{index}</div>
        {logoUrl != null ? (
          // <Logo logoUrl={logoUrl} />
          <Image src={logoUrl} alt={`${name}_logo`} width={76} height={76} />
        ) : (
          <div className={"bg-gray-w200 size-[76px] rounded-full"} />
        )}
        <div className={"text-center"}>{name}</div>
      </button>
    </CardFrame>
  );
}

const useHandleIndex = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const changeIndex = useCallback(
    (index: number) => () => {
      setSelectedIndex(index);
    },
    [],
  );

  return [selectedIndex, changeIndex] as const;
};
