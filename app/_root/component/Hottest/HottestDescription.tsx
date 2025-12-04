"use client";

import Image from "next/image";

interface HottestDescriptionProps {
  description: string;
  indices: string[];
  mentions: {
    youtube?: number;
    reddit?: number;
    x?: number;
  };
}

export default function HottestDescription({
  description,
  indices,
  mentions,
}: HottestDescriptionProps) {
  const totalMentions = calculateTotalMentions(mentions);

  return (
    <section
      className={"bg-primary-100/30 rounded-[20px] px-5 pt-7 pb-9 text-center"}
    >
      <h3 className={"mb-[3px]"}>이번 주 SNS에서 가장 뜨거웠어요</h3>
      <div className={"typo-xlarge font-numbers mb-[9px] font-black"}>
        <strong>{totalMentions.toLocaleString()}회 언급!</strong>
      </div>
      <ul className={"mb-[21px] flex items-center justify-center gap-[15px]"}>
        {Object.entries(mentions).map(([key, value]) => (
          <li key={`mention_${key}`}>
            <div className={"flex items-center gap-[3px]"}>
              <MentionLogo target={key} />
              <span className={"typo-micro"}>{value.toLocaleString()}</span>
            </div>
          </li>
        ))}
      </ul>
      <p className={"typo-tiny mb-[18px]"}>{description}</p>
      <ul className={"flex items-center justify-center gap-[3px]"}>
        {indices.map((text) => (
          <li key={text}>
            <IndexBadge index={text} />
          </li>
        ))}
      </ul>
    </section>
  );
}

interface IndexBadgeProps {
  index: string;
}

function IndexBadge({ index }: IndexBadgeProps) {
  return (
    <div
      className={
        "text-gray-w700 typo-tiny bg-primary-650/20 w-max rounded-[30px] px-1.5 py-[1px]"
      }
    >
      {index.length > 10 ? index.slice(0, 10) + "..." : index}
    </div>
  );
}

function MentionLogo({ target }: { target: string }) {
  switch (target) {
    case "youtube":
      return (
        <Image
          src={"/images/logo_youtube.png"}
          alt={"youtube_logo"}
          width={16}
          height={16}
        />
      );
    case "reddit":
      return (
        <Image
          src={"/images/logo_reddit.png"}
          alt={"reddit_logo"}
          width={16}
          height={16}
        />
      );
    case "x":
      return (
        <Image
          src={"/images/logo_x.png"}
          alt={"x_logo"}
          width={16}
          height={16}
        />
      );
    default:
      return null;
  }
}

const calculateTotalMentions = (
  mentions: HottestDescriptionProps["mentions"],
) => {
  return Object.values(mentions).reduce((acc, curr) => acc + curr, 0);
};
