export function fromFinnhubMillionToWon(v?: number | null) {
  if (v === null || v === undefined || Number.isNaN(v)) return null;
  return Math.round(v * 1_000_000);
}

export function formatWonRaw(won?: number | null) {
  if (won === null || won === undefined || Number.isNaN(won)) return null;
  return `${won.toLocaleString("ko-KR")}원`;
}
