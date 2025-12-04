export const formatCurrency = (value: number): string => {
  if (value >= 1e12) return `${(value / 1e12).toFixed(1)}조원`;
  if (value >= 1e9) return `${(value / 1e9).toFixed(1)}조원`;
  if (value >= 1e6) return `${(value / 1e6).toFixed(1)}백만원`;
  return `${value.toLocaleString()}원`;
};

export const getCurrencySymbol = (currency: string): string => {
  switch (currency) {
   case "KRW":
      return "원";
    case "USD":
      return "원";
    default:
      return currency;
  }
};

export const formatPercentage = (value: number): string =>
  `${(value * 100).toFixed(2)}%`;

export const formatRatio = (value: number): string => value.toFixed(2);
