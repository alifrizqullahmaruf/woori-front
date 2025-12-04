import Link from "next/link";
import Image from "next/image";
import CardFrame from "@/app/_common/component/atoms/CardFrame";
import SectionHeader from "@/app/_root/component/common/SectionHeader";

export default function TopPerformanceTheme() {
  return (
    <section>
      <SectionHeader
        headingText={"몰려든 테마, 결과는 달랐을지도?"}
        isAiButtonNeeded={false}
      />
      <ul className={"mt-[18px] flex flex-col gap-[9px]"}>
        {DUMMY_THEME_DATA.map((item, index) => (
          <li key={`theme_${index}_${item.name}`}>
            <Link href={`/theme/${item.id}`}>
              <TopPerformanceThemeItem
                {...item}
                colorCode={DUMMY_COLOR_CODES[index]}
              />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

const DUMMY_COLOR_CODES = [
  { bg: "#2684FF33", text: "#2962FF" },
  { bg: "#A56EFF33", text: "#A56EFF" },
  { bg: "#60C86433", text: "#60C864" },
  { bg: "#FA8C1633", text: "#FA8C16" },
  { bg: "#E3485033", text: "#E34850" },
];

const DUMMY_THEME_DATA = [
  {
    id: 1,
    name: "전기차",
    returns: 23,
    logo: "https://d95fddh07astf.cloudfront.net/theme_icons/24_electricvehicles_circle_primary.png",
  },
  {
    id: 2,
    name: "원자력발전",
    returns: 1.1,
    logo: "https://d95fddh07astf.cloudfront.net/theme_icons/24_chemicals_circle_primary.png",
  },
  {
    id: 3,
    name: "소프트웨어",
    returns: 0.4,
    logo: "https://d95fddh07astf.cloudfront.net/theme_icons/24_IT_circle_primary.png",
  },
  {
    id: 4,
    name: "동영상플랫폼",
    returns: -2.8,
    logo: "https://d95fddh07astf.cloudfront.net/theme_icons/24_telecommunications_circle_primary.png",
  },
  {
    id: 5,
    name: "인공지능",
    returns: -3.2,
    logo: "https://d95fddh07astf.cloudfront.net/theme_icons/24_artificialintelligence_circle_primary.png",
  },
];

interface TopPerformanceThemeItemProps {
  name: string;
  returns: number;
  colorCode: { bg: string; text: string };
  logo?: string;
}

function TopPerformanceThemeItem({
  name,
  returns,
  colorCode,
  logo,
}: TopPerformanceThemeItemProps) {
  const isPositive = returns > 0;

  return (
    <CardFrame className={"flex items-center"}>
      <div className="relative mr-[9px] flex size-9 items-center justify-center overflow-hidden rounded-full">
        {logo ? (
          <Image
            src={logo}
            alt={`${name} logo`}
            fill
            sizes="36px"
            className="object-contain p-1.5"
          />
        ) : (
          <div
            className="typo-micro relative size-9 rounded-full font-bold"
            style={{ backgroundColor: colorCode.bg, color: colorCode.text }}
          >
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              {name[0]}
            </span>
          </div>
        )}
      </div>

      <div className={"flex flex-1 items-center justify-between"}>
        <h3 className={"typo-small font-medium"}>{name}</h3>
        <div
          className={`${isPositive ? "text-accent-red" : "text-primary-750"} font-family-numbers font-bold`}
        >
          {isPositive ? "+" : ""}
          {returns}%
        </div>
      </div>
    </CardFrame>
  );
}
