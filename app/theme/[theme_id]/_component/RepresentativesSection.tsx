import Image from "next/image";

export default function RepresentativesSection() {
  return (
    <div>
      <h2 className={"typo-large mb-[15px] font-medium"}>
        AI 반도체, <span className={"font-bold"}>이 종목들이 주인공이에요</span>
      </h2>
      <ul className={"flex gap-3"}>
        {DUMMY_REPRESENTATIVES.map((item) => (
          <li key={item.name} className={"flex-1"}>
            <StockCard {...item} />
          </li>
        ))}
      </ul>
    </div>
  );
}

interface RepresentativeStock {
  thumbnail: string;
  name: string;
  returns: number;
}

const DUMMY_REPRESENTATIVES: RepresentativeStock[] = [
  {
    thumbnail: "/images/logo_microsoft.png",
    name: "마이크로소프트",
    returns: -2.1,
  },
  {
    thumbnail: "/images/logo_nvidia.png",
    name: "엔비디아",
    returns: -4.7,
  },
  {
    thumbnail: "/images/logo_google.png",
    name: "알파벳",
    returns: 1.1,
  },
];

function StockCard({ thumbnail, name, returns }: RepresentativeStock) {
  return (
    <div
      className={`flex flex-col items-center rounded-[15px] py-[21px] ${
        returns < 0
          ? "bg-primary-100/50 text-primary-900"
          : "bg-accent-red/10 text-accent-red"
      }`}
    >
      <div className={"relative mb-1.5 size-9 rounded-full bg-white"}>
        <Image
          src={thumbnail}
          alt={`${name}_logo`}
          width={24}
          height={24}
          className={"absolute top-1/2 left-1/2 -translate-1/2"}
        />
      </div>
      <h3 className={"typo-tiny mb-[9px] text-center text-black"}>{name}</h3>
      <div className={"font-family-numbers text-center font-bold"}>
        {returns > 0 ? "+" : ""}
        {returns}%
      </div>
    </div>
  );
}
