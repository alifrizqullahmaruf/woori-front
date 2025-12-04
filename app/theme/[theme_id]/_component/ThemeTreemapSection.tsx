"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import DisplayMoreButton from "@/app/_common/component/molecules/DisplayMoreButton";
import StockItem from "@/app/_common/component/molecules/StockItem";

const Treemap = dynamic(() => import("./ThemeTreemap"), {
  ssr: false,
  loading: () => <div className={"bg-border aspect-square"} />,
});

export default function ThemeTreemapSection() {
  const [isHideAdditionalList, handleHideAdditionalList] =
    useHideAdditionalList();
  const [selectedTheme, handleSelectTheme] = useSelectTheme();
  const displayList = useMemo(() => {
    if (!selectedTheme) return [];
    return DUMMY_THEME_COMPANY_ITEMS[selectedTheme] ?? [];
  }, [selectedTheme]);

  return (
    <div>
      <header className={"mb-[21px]"}>
        <h2 className={"typo-large font-bold"}>
          최근 7일간 테마 수익률을 정리했어요
        </h2>
        <p className={"typo-small text-black"}>탭하면 자세히 볼 수 있어요.</p>
      </header>
      <Treemap
        data={DUMMY_THEME_DATA}
        selectedTheme={selectedTheme}
        changeTheme={handleSelectTheme}
      />
      {selectedTheme && (
        <>
          <ul className={"border-border mt-6 mb-[18px] flex flex-col gap-[21px] border-b pb-[18px]"}>
            {displayList
              .slice(0, isHideAdditionalList ? 5 : displayList.length)
              .map((item, index) => (
                <li key={`theme_treemap_${selectedTheme}_${item.name}`}>
                  <Link
                    href={`/company-info/${item.code}`}
                    className={"flex items-center justify-between"}
                  >
                    <StockItem index={index + 1} name={item.name} logo={item.logo} />
                    <span
                      className={`font-family-numbers font-bold ${item.returns > 0 ? "text-accent-red" : "text-primary-900"}`}
                    >
                      {item.returns > 0 ? "+" : ""}
                      {item.returns}%
                    </span>
                  </Link>
                </li>
              ))}
          </ul>
          {displayList.length > 5 && (
            <DisplayMoreButton
              isSpread={!isHideAdditionalList}
              onClick={handleHideAdditionalList}
            />
          )}
        </>
      )}
    </div>
  );
}

const DUMMY_THEME_DATA = [
  { name: "전기차", value: 12.25 },
  { name: "원자력발전", value: 6.44 },
  { name: "전기설비", value: 3.12 },
  { name: "소프트웨어", value: 2.52 },
  { name: "드론", value: 1.61 },
  { name: "동영상", value: -1.77 },
  { name: "인공지능", value: -2.22 },
  { name: "클라우드", value: -4.35 },
  { name: "반도체팹리스", value: -6.8 },
  { name: "암호화폐", value: -8.29 },
];

const DUMMY_THEME_COMPANY_ITEMS: Record<
  string,
  Array<{ name: string; code: string; logo: string | null; returns: number }>
> = {
  전기차: [
    { name: "테슬라(Mock)", code: "TSLA", logo: null, returns: 5.6 },
    { name: "현대차(Mock)", code: "005380", logo: null, returns: 2.2 },
    { name: "기아(Mock)", code: "000270", logo: null, returns: 1.1 },
    { name: "LG에너지솔루션(Mock)", code: "373220", logo: null, returns: 3.7 },
    { name: "리비안(Mock)", code: "RIVN", logo: null, returns: -4.3 },
    { name: "니오(Mock)", code: "NIO", logo: null, returns: -0.9 },
    { name: "BYD(Mock)", code: "1211.HK", logo: null, returns: 0.8 },
    { name: "포드(Mock)", code: "F", logo: null, returns: -1.5 },
  ],
  원자력발전: [
    { name: "두산에너빌리티(Mock)", code: "034020", logo: null, returns: 4.4 },
    { name: "한전기술(Mock)", code: "052690", logo: null, returns: 2.1 },
    { name: "한전KPS(Mock)", code: "051600", logo: null, returns: -0.7 },
    { name: "우리기술(Mock)", code: "032820", logo: null, returns: 1.9 },
    { name: "비에이치아이(Mock)", code: "083650", logo: null, returns: -2.6 },
    { name: "오르비텍(Mock)", code: "046120", logo: null, returns: 0.4 },
    { name: "에너토크(Mock)", code: "019990", logo: null, returns: 3.3 },
    { name: "일진파워(Mock)", code: "094820", logo: null, returns: -1.1 },
  ],
  전기설비: [
    { name: "LS ELECTRIC(Mock)", code: "010120", logo: null, returns: 2.9 },
    { name: "효성중공업(Mock)", code: "298040", logo: null, returns: 1.7 },
    { name: "한전산업(Mock)", code: "130660", logo: null, returns: -0.8 },
    { name: "제일전기공업(Mock)", code: "199820", logo: null, returns: 3.2 },
    { name: "가온전선(Mock)", code: "000500", logo: null, returns: -2.2 },
    { name: "중앙전기(Mock)", code: "000000", logo: null, returns: 0.5 },
    { name: "비츠로셀(Mock)", code: "082920", logo: null, returns: 4.0 },
    { name: "일진전기(Mock)", code: "103590", logo: null, returns: -1.3 },
  ],
  소프트웨어: [
    { name: "마이크로소프트(Mock)", code: "MSFT", logo: null, returns: 1.8 },
    { name: "오라클(Mock)", code: "ORCL", logo: null, returns: 0.9 },
    { name: "세일즈포스(Mock)", code: "CRM", logo: null, returns: -0.4 },
    { name: "어도비(Mock)", code: "ADBE", logo: null, returns: 2.2 },
    { name: "SAP(Mock)", code: "SAP", logo: null, returns: -1.6 },
    { name: "아틀라시안(Mock)", code: "TEAM", logo: null, returns: 3.1 },
    { name: "서비스나우(Mock)", code: "NOW", logo: null, returns: 0.7 },
    { name: "팔란티어(Mock)", code: "PLTR", logo: null, returns: -2.5 },
  ],
  드론: [
    { name: "AeroVironment(Mock)", code: "AVAV", logo: null, returns: 4.5 },
    { name: "Kratos(Mock)", code: "KTOS", logo: null, returns: -1.1 },
    { name: "EHang(Mock)", code: "EH", logo: null, returns: 6.2 },
    { name: "Parrot(Mock)", code: "PARRO", logo: null, returns: -0.6 },
    { name: "DJI(Mock)", code: "DJI", logo: null, returns: 0.3 },
    { name: "Textron(Mock)", code: "TXT", logo: null, returns: 1.4 },
    { name: "Northrop(Mock)", code: "NOC", logo: null, returns: -2.0 },
    { name: "Lockheed(Mock)", code: "LMT", logo: null, returns: 0.9 },
  ],
  동영상: [
    { name: "넷플릭스(Mock)", code: "NFLX", logo: null, returns: 2.7 },
    { name: "디즈니(Mock)", code: "DIS", logo: null, returns: -0.3 },
    { name: "워너브라더스(Mock)", code: "WBD", logo: null, returns: 1.2 },
    { name: "구글 유튜브(Mock)", code: "GOOGL", logo: null, returns: 0.8 },
    { name: "로쿠(Mock)", code: "ROKU", logo: null, returns: -4.1 },
    { name: "파라마운트(Mock)", code: "PARA", logo: null, returns: -1.9 },
    { name: "씨제이ENM(Mock)", code: "035760", logo: null, returns: 0.6 },
    { name: "티빙(Mock)", code: "TVING", logo: null, returns: 3.0 },
  ],
  인공지능: [
    { name: "엔비디아(Mock)", code: "NVDA", logo: null, returns: 8.4 },
    { name: "구글(Mock)", code: "GOOGL", logo: null, returns: 1.5 },
    { name: "마이크로소프트(Mock)", code: "MSFT", logo: null, returns: 2.1 },
    { name: "AMD(Mock)", code: "AMD", logo: null, returns: -0.7 },
    { name: "바이두(Mock)", code: "BIDU", logo: null, returns: -1.3 },
    { name: "메타(Mock)", code: "META", logo: null, returns: 0.4 },
    { name: "오픈AI(Mock)", code: "OAI", logo: null, returns: 3.6 },
    { name: "앵케이블(Mock)", code: "ANCO", logo: null, returns: -2.2 },
  ],
  클라우드: [
    { name: "아마존 AWS(Mock)", code: "AMZN", logo: null, returns: 2.0 },
    { name: "마이크로소프트 Azure(Mock)", code: "MSFT", logo: null, returns: 1.2 },
    { name: "구글 클라우드(Mock)", code: "GOOGL", logo: null, returns: -0.4 },
    { name: "스노우플레이크(Mock)", code: "SNOW", logo: null, returns: 3.3 },
    { name: "오라클 클라우드(Mock)", code: "ORCL", logo: null, returns: 0.9 },
    { name: "몽고DB(Mock)", code: "MDB", logo: null, returns: -3.1 },
    { name: "디지털오션(Mock)", code: "DOCN", logo: null, returns: 1.0 },
    { name: "클라우드플레어(Mock)", code: "NET", logo: null, returns: -2.6 },
  ],
  반도체팹리스: [
    { name: "엔비디아(Mock)", code: "NVDA", logo: null, returns: 5.4 },
    { name: "AMD(Mock)", code: "AMD", logo: null, returns: 1.8 },
    { name: "퀄컴(Mock)", code: "QCOM", logo: null, returns: -2.1 },
    { name: "미디어텍(Mock)", code: "2454", logo: null, returns: -3.6 },
    { name: "브로드컴(Mock)", code: "AVGO", logo: null, returns: 0.7 },
    { name: "ARM(Mock)", code: "ARM", logo: null, returns: 0.3 },
    { name: "마벨(Mock)", code: "MRVL", logo: null, returns: -1.2 },
    { name: "스카이웍스(Mock)", code: "SWKS", logo: null, returns: 2.2 },
  ],
  암호화폐: [
    { name: "코인베이스(Mock)", code: "COIN", logo: null, returns: 4.8 },
    { name: "마이크로스트래티지(Mock)", code: "MSTR", logo: null, returns: 6.1 },
    { name: "마라톤디지털(Mock)", code: "MARA", logo: null, returns: -3.9 },
    { name: "라이엇 플랫폼(Mock)", code: "RIOT", logo: null, returns: -1.5 },
    { name: "갤럭시디지털(Mock)", code: "GLXY", logo: null, returns: 1.0 },
    { name: "하이브리드체인(Mock)", code: "HBC", logo: null, returns: -0.7 },
    { name: "비트팜즈(Mock)", code: "BITF", logo: null, returns: 2.6 },
    { name: "클린스파크(Mock)", code: "CLSK", logo: null, returns: -2.2 },
  ],
};

const useHideAdditionalList = () => {
  const [isHideAdditionalList, setIsHideAdditionalList] = useState(true);

  const handleHideAdditionalList = () => {
    setIsHideAdditionalList(!isHideAdditionalList);
  };

  return [isHideAdditionalList, handleHideAdditionalList] as const;
};

const useSelectTheme = () => {
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);

  const handleSelectTheme = useCallback(
    (theme: string) => {
      if (theme === selectedTheme) {
        setSelectedTheme(null);
      } else {
        setSelectedTheme(theme);
      }
    },
    [selectedTheme],
  );

  return [selectedTheme, handleSelectTheme] as const;
};
