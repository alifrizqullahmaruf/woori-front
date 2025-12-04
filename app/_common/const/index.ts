import { HelpDescriptions } from "@/app/_common/types";

export const generateDivider = (gap = "my-[18px]") =>
  `after:bg-border after:${gap} after:block after:h-[1px] after:w-full after:content-['']`;

/**
 * USD to KRW Exchange Rate
 * This rate should be updated daily to reflect the current exchange rate.
 * You can update this manually or fetch from an external API.
 *
 * Current rate as of 2025-11-24: 1 USD = 1473.69 KRW
 * Source: Bank of Korea / Exchange Rate API
 */
export const USD_KRW_EXCHANGE_RATE =
  typeof process !== 'undefined' && process.env.NEXT_PUBLIC_USD_KRW_RATE
    ? parseFloat(process.env.NEXT_PUBLIC_USD_KRW_RATE)
    : 1473.69;

export const HELP_DESCRIPTIONS_DICTIONARY: Record<string, HelpDescriptions> = {
  "배당 수익률": {
    title: "배당 수익률이란?",
    summary: "배당 수익률 요약",
    content:
      "배당수익률은 현재 주가 대비 배당금의 비율을 나타냅니다. 최근 1년간 받은 총 배당금을 기준으로 하며, 비율이 높을수록 주가 대비 배당이 많다는 뜻입니다.",
    note: "배당 수익률 유의사항",
  },
  배당성향: {
    title: "배당성향이란?",
    summary: "배당성향 요약",
    content:
      "배당성향은 기업의 순이익 중 얼마를 배당금으로 지급했는지를 보여줍니다. 최근 1년간 수익과 배당 기준으로 계산하며, 비율이 높을수록 주주에게 더 많은 배당을 의미합니다.",
    note: "배당성향 유의사항",
  },
  배당락일: {
    title: "배당락일이란?",
    summary: "배당받는 권리가 없어진 날",
    content:
      "주식을 구매를 하더라도 배당받는 권리가 부여되지 않는 날을 의미합니다. 배당락일이 되면 주식의 가치를 지키기 위해 배당금만큼 주식 가격이 낮아집니다.",
    note: "배당락일 전까지 주식을 구매해야 배당금을 받을 수 있으니 미리 날짜를 확인해 주세요.",
  },
  시가총액: {
    title: "시가총액이란?",
    content:
      "시가총액은 기업의 규모와 시장 내 가치를 평가하는 데 사용돼요.\n기업이 주식 시장에서의 총 가치를 나타내는 지표로, 주가와 발행 주식의 수를 곱한 값이에요.",
  },
  결산월: {
    title: "결산월이란?",
    content:
      "결산월은 기업이 회계 연도의 재무 제표를 작성하고 마감하는 달이에요.\n주주와 투자자에게 기업의 재무 상태와 성과를 투명하게 공개하는 데 중요한 역할을 해요.",
  },
  발행주식: {
    title: "발행주식이란?",
    content:
      "회사가 자본을 조달하기 위해 시장에 판매한 주식의 총수에요.\n발행주식은 회사의 소유 구조를 결정하고 시장에서의 회사의 가치와 성장 가능성을 평가하는 역할을 해요.",
  },
  유동비율: {
    title: "유동비율이란?",
    content:
      "유동비율은 기업의 단기 지급능력을 평가하는 재무 지표로서, 기업이 유동자산을 사용해 유동부채를 얼마나 쉽게 상환할 수 있는지를 알려줘요.\n기업이 얼마나 재무적으로 안정적인지, 즉 단기적인 채무를 지급할 수 있는 능력이 얼마나 되는지를 나타내요.\n1 미만인 경우, 유동자산만으로는 유동부채를 상환하기에 충분하지 않다는 것을 의미해요. 1 이상이어야 건전한 것으로 볼수 있어요.",
  },
};
