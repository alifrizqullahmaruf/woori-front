import Link from "next/link";
import StockItem from "@/app/_common/component/molecules/StockItem";
import SectionHeader from "@/app/_root/component/common/SectionHeader";
import LogoSaham from "@/public/images/logo_saham.png"

export default function TopPerformanceStock() {
  return (
    <section>
      <SectionHeader
        headingText={"뜨자마자 주가도 쑥"}
        subHeadingText={"화제성이 실제 주가로 이어진 사례들, 확인해보세요."}
        isDisplayingIcon
      />
      <ul className={"mt-[30px] flex flex-col gap-9"}>
        {DUMMY_PERFORMANCE_DATA.map((item, index) => (
          <TopPerformanceStockItem
            key={`performance_${index}_${item.code}`}
            {...item}
            index={index + 1}
          />
        ))}
      </ul>
    </section>
  );
}

const DUMMY_PERFORMANCE_DATA = [
  {
    name: "Oklo Inc.",
    code: "OKLO",
    logo: `https://d95fddh07astf.cloudfront.net/company_logos/NYSE/OKLO_badge.png`,
    returns: 23,
    description: "언급량이 5배나 늘었어요!(YouTube·Reddit 기준)",
    detail: "경쟁사 콘스텔레이션, 메타와 장기 계약",
  },
  {
    name: "Intuit Inc.",
    code: "INTU",
    logo: `https://d95fddh07astf.cloudfront.net/company_logos/NASDAQ/INTU_badge.png`,
    returns: 9.7,
    description: "언급량이 2배 늘었어요! (X 기준)",
    detail: "실적발표 호실적 및 가이던스 업데이트",
  },
  {
    name: "The AES Corporation",
    code: "AES",
    logo: `https://d95fddh07astf.cloudfront.net/company_logos/NYSE/AES_badge.png`,
    returns: 6.8,
    description: "언급량이 3배 늘었어요!(YouTube 기준)",
    detail: "메타로부터 장기 프로젝트 수주",
  },
];

interface TopPerformanceStockItemProps {
  index: number;
  name: string;
  code: string;
  logo: string | null;
  returns: number;
  description: string;
  detail: string;
}

function TopPerformanceStockItem({
  index,
  name,
  code,
  logo,
  returns,
  description,
  detail,
}: TopPerformanceStockItemProps) {
  return (
    <Link href={`/company-info/${code}`}>
      <div className={"mb-[9px] flex items-center"}>
        <div className={"flex-1"}>
          <StockItem index={index} name={name} logo={logo} isNeedHighlight />
        </div>
        <div
          className={
            "bg-accent-cyan/10 font-family-numbers typo-micro text-accent-cyan ml-auto rounded-2xl px-[9px] py-[3px] font-bold"
          }
        >
          지난 1주일간 {returns > 0 ? "+" : ""}
          {returns}%
        </div>
      </div>
      <div>
        <p className={"typo-small line-clamp-1 font-medium"}>{description}</p>
        <p className={"typo-small text-gray-w600 line-clamp-1"}>{detail}</p>
      </div>
    </Link>
  );
}
