"use client";

import dynamic from "next/dynamic";
import { useCallback, useMemo, useState } from "react";
import ChartFallback from "@/app/_common/component/atoms/ChartFallback";
import type { AxisTick } from "@/app/company-info/[ticker]/_component/CompanyPerformanceView/LineChartSolid";

const LocalLineChart = dynamic(
  () =>
    import(
      "@/app/company-info/[ticker]/_component/CompanyPerformanceView/LineChartSolid"
    ),
  {
    ssr: false,
    loading: () => <ChartFallback height={"45vw"} />,
  },
);

export default function ThemeReturnsSection() {
  const [selectedTab, changeTab] = useTab();

  // Build filtered labels/values based on selected tab
  const { labels, values, yTicks, yTickFormatter, xTicks } = useFilteredChartData(
    DUMMY_CHART_DATA,
    selectedTab,
  );
  
  const changePct = useMemo(() => {
    if (!values?.length) return 0;
    const first = values[0];
    const last = values[values.length - 1];
    if (first === 0) return 0;
    return ((last / first) - 1) * 100;
  }, [values]);

  const formattedChange = `${changePct >= 0 ? "+" : ""}${changePct.toFixed(2)}%`;

  return (
    <div>
      <h2 className={"typo-small mb-[9px] font-medium"}>
        이테마, {PERIOD_LABEL[selectedTab]}{" "}
        <span
          className={"font-family-numbers font-bold"}
          style={{ color: changePct >= 0 ? "#e34850" : "#2f6bff" }}
        >
          {formattedChange}
        </span>{" "}
        수익률
      </h2>
      <ul className={"mb-[18px] flex items-center py-[3.5px]"}>
        {TAB_DATA.map((item) => (
          <li key={`chart_tab_${item.value}`}>
            <button
              onClick={changeTab(item.value)}
              className={`typo-small rounded-[15px] px-[14px] py-[2.5px] font-medium ${selectedTab === item.value ? "bg-primary-800 text-white" : "text-gray-w800"}`}
            >
              {item.key}
            </button>
          </li>
        ))}
      </ul>
      {/* <div className={"bg-border h-[45vw] max-h-[346px]"} /> */}
      <LocalLineChart
        rawData={values}
        labels={labels}
        height={200}
        showYAxisLeft
        yTicks={yTicks}
        yTickFormatter={yTickFormatter}
        xTicks={xTicks}
        showDataLabels={false}
      />
    </div>
  );
}

const TAB_DATA = [
  {
    key: "1년",
    value: "annual",
  },
  {
    key: "YTD",
    value: "ytd",
  },
  {
    key: "6개월",
    value: "6_months",
  },
  {
    key: "1개월",
    value: "1_month",
  },
];

type TabValue = (typeof TAB_DATA)[number]["value"];

const PERIOD_LABEL: Record<TabValue, string> = {
  annual: "1년간",
  ytd: "YTD",
  "6_months": "6개월간",
  "1_month": "1개월간",
};

const DUMMY_CHART_DATA = {
  values: [
    25.88, 25.83, 25.85, 27.23, 27.23, 27.7, 27.39, 28.42, 27.64, 28.07, 28.67,
    28.67, 28.22, 28.64, 28.58, 28.46, 28.81, 26.6, 26.63, 27.18, 27.08, 26.37,
    26.89, 26.08, 24.74, 24.09, 26.59, 26.32, 29.28, 30.01, 29.38, 30.39, 31.0,
    31.22, 32.08, 32.5, 32.32, 32.54, 31.92, 31.78, 30.85, 30.84, 30.36, 31.0,
    31.48, 30.51, 30.51, 30.59, 30.16, 30.33, 34.6, 34.76, 34.85, 34.91, 35.59,
    36.31, 36.45, 36.38, 36.83, 37.2, 37.95, 36.9, 37.12, 37.1, 36.84, 37.2,
    36.46, 37.49, 39.24, 40.01, 38.89, 41.45, 43.13, 43.52, 43.51, 43.4, 42.43,
    41.93, 42.0, 42.97, 42.7, 42.94, 42.59, 43.56, 44.86, 44.97, 44.93, 43.69,
    41.56, 41.92, 41.41, 51.13, 55.53, 55.88, 58.39, 60.24, 59.85, 60.7, 59.18,
    65.77, 61.26, 62.98, 62.12, 61.36, 64.35, 64.65, 65.74, 66.05, 67.08, 67.08,
    66.39, 70.96, 69.85, 71.87, 76.34, 72.46, 70.89, 72.51, 73.2, 76.07, 75.75,
    74.39, 71.51, 74.21, 80.55, 80.69, 82.38, 82.14, 82.14, 79.08, 77.18, 75.63,
    75.19, 75.19, 79.89, 75.92, 69.99, 68.23, 67.26, 67.26, 64.98, 65.91, 68.14,
    69.24, 71.77, 73.07, 73.07, 76.87, 78.98, 78.98, 75.44, 80.23, 79.76, 81.22,
    82.49, 83.74, 103.83, 101.36, 111.28, 110.85, 116.65, 112.62, 117.39,
    117.91, 119.16, 124.62, 124.62, 112.06, 106.27, 101.35, 90.68, 87.84, 89.31,
    84.77, 84.92, 83.42, 84.4, 90.13, 80.46, 84.91, 76.38, 78.05, 83.65, 79.62,
    86.24, 87.35, 83.89, 86.1, 87.39, 90.96, 96.75, 96.5, 92.28, 90.09, 85.85,
    84.4, 84.68, 87.45, 83.6, 74.01, 77.84, 77.32, 92.01, 88.59, 88.55, 92.62,
    98.4, 92.71, 93.78, 90.8, 90.8, 93.99, 100.82, 107.78, 112.78, 114.65,
    116.08, 118.44, 116.2, 124.28, 123.77, 108.86, 110.48, 119.15, 117.3,
    118.46, 128.1, 130.18, 128.12, 129.52, 126.33, 125.59, 120.58, 122.29,
    123.31, 123.39, 123.39, 123.76, 122.32, 131.78, 132.04, 133.17, 130.01,
    119.91, 127.72, 132.06, 132.81, 136.39, 135.19, 137.4, 141.41, 138.2,
    139.96, 137.3, 137.3, 139.92, 143.23, 142.9, 144.25, 130.74, 136.32, 130.68,
    132.12, 134.36, 139.12, 139.12, 139.71, 143.13, 142.5, 142.1, 149.15,
    148.58, 150.91, 153.99, 153.52, 151.79,
  ],
  labels: [
    "2024-07-01",
    "2024-07-02",
    "2024-07-03",
    "2024-07-04",
    "2024-07-05",
    "2024-07-08",
    "2024-07-09",
    "2024-07-10",
    "2024-07-11",
    "2024-07-12",
    "2024-07-15",
    "2024-07-16",
    "2024-07-17",
    "2024-07-18",
    "2024-07-19",
    "2024-07-22",
    "2024-07-23",
    "2024-07-24",
    "2024-07-25",
    "2024-07-26",
    "2024-07-29",
    "2024-07-30",
    "2024-07-31",
    "2024-08-01",
    "2024-08-02",
    "2024-08-05",
    "2024-08-06",
    "2024-08-07",
    "2024-08-08",
    "2024-08-09",
    "2024-08-12",
    "2024-08-13",
    "2024-08-14",
    "2024-08-15",
    "2024-08-16",
    "2024-08-19",
    "2024-08-20",
    "2024-08-21",
    "2024-08-22",
    "2024-08-23",
    "2024-08-26",
    "2024-08-27",
    "2024-08-28",
    "2024-08-29",
    "2024-08-30",
    "2024-09-02",
    "2024-09-03",
    "2024-09-04",
    "2024-09-05",
    "2024-09-06",
    "2024-09-09",
    "2024-09-10",
    "2024-09-11",
    "2024-09-12",
    "2024-09-13",
    "2024-09-16",
    "2024-09-17",
    "2024-09-18",
    "2024-09-19",
    "2024-09-20",
    "2024-09-23",
    "2024-09-24",
    "2024-09-25",
    "2024-09-26",
    "2024-09-27",
    "2024-09-30",
    "2024-10-01",
    "2024-10-02",
    "2024-10-03",
    "2024-10-04",
    "2024-10-07",
    "2024-10-08",
    "2024-10-09",
    "2024-10-10",
    "2024-10-11",
    "2024-10-14",
    "2024-10-15",
    "2024-10-16",
    "2024-10-17",
    "2024-10-18",
    "2024-10-21",
    "2024-10-22",
    "2024-10-23",
    "2024-10-24",
    "2024-10-25",
    "2024-10-28",
    "2024-10-29",
    "2024-10-30",
    "2024-10-31",
    "2024-11-01",
    "2024-11-04",
    "2024-11-05",
    "2024-11-06",
    "2024-11-07",
    "2024-11-08",
    "2024-11-11",
    "2024-11-12",
    "2024-11-13",
    "2024-11-14",
    "2024-11-15",
    "2024-11-18",
    "2024-11-19",
    "2024-11-20",
    "2024-11-21",
    "2024-11-22",
    "2024-11-25",
    "2024-11-26",
    "2024-11-27",
    "2024-11-28",
    "2024-11-29",
    "2024-12-02",
    "2024-12-03",
    "2024-12-04",
    "2024-12-05",
    "2024-12-06",
    "2024-12-09",
    "2024-12-10",
    "2024-12-11",
    "2024-12-12",
    "2024-12-13",
    "2024-12-16",
    "2024-12-17",
    "2024-12-18",
    "2024-12-19",
    "2024-12-20",
    "2024-12-23",
    "2024-12-24",
    "2024-12-25",
    "2024-12-26",
    "2024-12-27",
    "2024-12-30",
    "2024-12-31",
    "2025-01-01",
    "2025-01-02",
    "2025-01-03",
    "2025-01-06",
    "2025-01-07",
    "2025-01-08",
    "2025-01-09",
    "2025-01-10",
    "2025-01-13",
    "2025-01-14",
    "2025-01-15",
    "2025-01-16",
    "2025-01-17",
    "2025-01-20",
    "2025-01-21",
    "2025-01-22",
    "2025-01-23",
    "2025-01-24",
    "2025-01-27",
    "2025-01-28",
    "2025-01-29",
    "2025-01-30",
    "2025-01-31",
    "2025-02-03",
    "2025-02-04",
    "2025-02-05",
    "2025-02-06",
    "2025-02-07",
    "2025-02-10",
    "2025-02-11",
    "2025-02-12",
    "2025-02-13",
    "2025-02-14",
    "2025-02-17",
    "2025-02-18",
    "2025-02-19",
    "2025-02-20",
    "2025-02-21",
    "2025-02-24",
    "2025-02-25",
    "2025-02-26",
    "2025-02-27",
    "2025-02-28",
    "2025-03-03",
    "2025-03-04",
    "2025-03-05",
    "2025-03-06",
    "2025-03-07",
    "2025-03-10",
    "2025-03-11",
    "2025-03-12",
    "2025-03-13",
    "2025-03-14",
    "2025-03-17",
    "2025-03-18",
    "2025-03-19",
    "2025-03-20",
    "2025-03-21",
    "2025-03-24",
    "2025-03-25",
    "2025-03-26",
    "2025-03-27",
    "2025-03-28",
    "2025-03-31",
    "2025-04-01",
    "2025-04-02",
    "2025-04-03",
    "2025-04-04",
    "2025-04-07",
    "2025-04-08",
    "2025-04-09",
    "2025-04-10",
    "2025-04-11",
    "2025-04-14",
    "2025-04-15",
    "2025-04-16",
    "2025-04-17",
    "2025-04-18",
    "2025-04-21",
    "2025-04-22",
    "2025-04-23",
    "2025-04-24",
    "2025-04-25",
    "2025-04-28",
    "2025-04-29",
    "2025-04-30",
    "2025-05-01",
    "2025-05-02",
    "2025-05-05",
    "2025-05-06",
    "2025-05-07",
    "2025-05-08",
    "2025-05-09",
    "2025-05-12",
    "2025-05-13",
    "2025-05-14",
    "2025-05-15",
    "2025-05-16",
    "2025-05-19",
    "2025-05-20",
    "2025-05-21",
    "2025-05-22",
    "2025-05-23",
    "2025-05-26",
    "2025-05-27",
    "2025-05-28",
    "2025-05-29",
    "2025-05-30",
    "2025-06-02",
    "2025-06-03",
    "2025-06-04",
    "2025-06-05",
    "2025-06-06",
    "2025-06-09",
    "2025-06-10",
    "2025-06-11",
    "2025-06-12",
    "2025-06-13",
    "2025-06-16",
    "2025-06-17",
    "2025-06-18",
    "2025-06-19",
    "2025-06-20",
    "2025-06-23",
    "2025-06-24",
    "2025-06-25",
    "2025-06-26",
    "2025-06-27",
    "2025-06-30",
    "2025-07-01",
    "2025-07-02",
    "2025-07-03",
    "2025-07-04",
    "2025-07-07",
    "2025-07-08",
    "2025-07-09",
    "2025-07-10",
    "2025-07-11",
    "2025-07-14",
    "2025-07-15",
    "2025-07-16",
    "2025-07-17",
    "2025-07-18",
    "2025-07-21",
  ],
};

const useTab = () => {
  const [selectedTab, setSelectedTab] = useState<TabValue>(TAB_DATA[0].value);

  const changeTab = useCallback(
    (value: TabValue) => () => {
      setSelectedTab(value);
    },
    [],
  );

  return [selectedTab, changeTab] as const;
};

type FilteredChartData = {
  labels: string[];
  values: number[];
  yTicks?: number[];
  yTickFormatter: (v: number) => string;
  xTicks: AxisTick[];
};

function useFilteredChartData(
  data: { labels: string[]; values: number[] },
  tab: TabValue,
): FilteredChartData {
  return useMemo<FilteredChartData>(() => {
    const { labels, values } = data;
    if (!labels.length || labels.length !== values.length) {
      return {
        labels,
        values,
        yTicks: computeYTicks(values),
        yTickFormatter: (v: number) => `${v} %`,
        xTicks: [],
      };
    }

    const parse = (s: string) => new Date(`${s}T00:00:00`);
    const lastDate = parse(labels[labels.length - 1]!);
    const fromDate = computeFromDate(lastDate, tab);

    const filteredLabels: string[] = [];
    const filteredValues: number[] = [];
    const filteredDates: Date[] = [];

    for (let i = 0; i < labels.length; i += 1) {
      const currentDate = parse(labels[i]!);
      if (currentDate >= fromDate && currentDate <= lastDate) {
        filteredLabels.push(labels[i]!);
        filteredValues.push(values[i]!);
        filteredDates.push(currentDate);
      }
    }

    const yTicks = computeYTicks(filteredValues);
    const yTickFormatter = (v: number) => `${v} %`;
    const xTicks = computeXTicks(filteredDates, tab);

    return {
      labels: filteredLabels,
      values: filteredValues,
      yTicks,
      yTickFormatter,
      xTicks,
    };
  }, [data, tab]);
}

function computeYTicks(values: number[]) {
  if (!values.length) return undefined;
  let min = Math.min(...values);
  let max = Math.max(...values);
  // Round outward to nearest multiple of 10
  const floor10 = (n: number) => Math.floor(n / 10) * 10;
  const ceil10 = (n: number) => Math.ceil(n / 10) * 10;
  min = floor10(min);
  max = ceil10(max);
  if (min === max) {
    // Expand a bit to show at least one step
    min = floor10(min - 10);
    max = ceil10(max + 10);
  }
  const ticks: number[] = [];
  for (let v = min; v <= max; v += 10) ticks.push(v);
  return ticks;
}

const MAX_X_TICK_COUNT = 4;


function computeFromDate(lastDate: Date, tab: TabValue) {
  const fromDate = new Date(lastDate);
  switch (tab) {
    case "annual": {
      fromDate.setMonth(fromDate.getMonth() - 12);
      break;
    }
    case "ytd": {
      return new Date(lastDate.getFullYear(), 0, 1);
    }
    case "6_months": {
      fromDate.setMonth(fromDate.getMonth() - 6);
      break;
    }
    case "1_month":
    default: {
      fromDate.setDate(fromDate.getDate() - 30);
      break;
    }
  }
  return fromDate;
}

function computeXTicks(dates: Date[], tab: TabValue): AxisTick[] {
  if (!dates.length) return [];
  switch (tab) {
    case "1_month":
      return buildDailyTicks(dates);
    case "6_months":
      return buildMonthlyTicks(dates, MAX_X_TICK_COUNT);
    case "annual":
      return buildMonthlyTicks(dates, MAX_X_TICK_COUNT);
    case "ytd":
      return buildQuarterTicks(dates);
    default:
      return buildMonthlyTicks(dates, MAX_X_TICK_COUNT);
  }
}

function buildDailyTicks(dates: Date[]): AxisTick[] {
  if (!dates.length) return [];
  
  const ticks: AxisTick[] = [];
  const formatMonthDayLabel = (date: Date) =>
    `${date.getMonth() + 1}월 ${date.getDate()}일`;
  
  const indices = [
    0,
    Math.floor(dates.length / 3),
    Math.floor((dates.length * 2) / 3),
    dates.length - 1
  ];
  

  const uniqueIndices = [...new Set(indices)];
  
  uniqueIndices.forEach(idx => {
    ticks.push({
      index: idx,
      label: formatMonthDayLabel(dates[idx]!),
    });
  });

  return ticks;
}

function buildMonthlyTicks(dates: Date[], limit: number): AxisTick[] {
  const buckets = collectMonthBuckets(dates);
  if (!buckets.length) {
    return buildEvenlySpacedTicks(dates, limit, formatKoreanMonth);
  }
  const bucketIndices = selectBucketIndices(buckets.length, limit);
  const ticks = bucketIndices.map((bucketIdx) => {
    const bucket = buckets[bucketIdx]!;
    return {
      index: bucket.index,
      label: formatKoreanMonth(bucket.date),
    };
  });

  return enforceTickLimit(ticks, limit);
}

function buildQuarterTicks(dates: Date[]): AxisTick[] {
  if (!dates.length) return [];
  const minDate = dates[0]!;
  const maxDate = dates[dates.length - 1]!;
  const candidateMonths = [0, 3, 6, 10];
  const ticks: AxisTick[] = [];

  candidateMonths.forEach((month) => {
    const candidate = new Date(maxDate.getFullYear(), month, 1);
    if (candidate < minDate || candidate > maxDate) return;
    const idx = findClosestDateIndex(dates, candidate);
    if (idx >= 0 && !ticks.some((tick) => tick.index === idx)) {
      ticks.push({
        index: idx,
        label: formatKoreanMonth(dates[idx]!),
      });
    }
  });

  if (!ticks.length) {
    return buildMonthlyTicks(dates, MAX_X_TICK_COUNT);
  }

  return enforceTickLimit(ticks, MAX_X_TICK_COUNT);
}

function buildEvenlySpacedTicks(
  dates: Date[],
  limit: number,
  formatter: (date: Date) => string,
): AxisTick[] {
  if (!dates.length) return [];
  if (dates.length <= limit) {
    return dates.map((date, index) => ({
      index,
      label: formatter(date),
    }));
  }

  const step = (dates.length - 1) / (limit - 1);
  const seen = new Set<number>();
  const ticks: AxisTick[] = [];

  for (let i = 0; i < limit; i += 1) {
    const idx = Math.round(i * step);
    if (!seen.has(idx)) {
      seen.add(idx);
      ticks.push({
        index: idx,
        label: formatter(dates[idx]!),
      });
    }
  }

  for (let idx = 0; idx < dates.length && ticks.length < limit; idx += 1) {
    if (!seen.has(idx)) {
      seen.add(idx);
      ticks.push({
        index: idx,
        label: formatter(dates[idx]!),
      });
    }
  }

  return ticks.sort((a, b) => a.index - b.index);
}

function collectMonthBuckets(dates: Date[]) {
  const seen = new Set<string>();
  const buckets: { index: number; date: Date }[] = [];

  dates.forEach((date, idx) => {
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    if (!seen.has(key)) {
      seen.add(key);
      buckets.push({ index: idx, date });
    }
  });

  return buckets;
}

function selectBucketIndices(bucketCount: number, limit: number) {
  if (bucketCount <= limit) {
    return Array.from({ length: bucketCount }, (_, idx) => idx);
  }

  const step = (bucketCount - 1) / (limit - 1);
  const indices: number[] = [];

  for (let i = 0; i < limit; i += 1) {
    indices.push(Math.round(i * step));
  }

  const unique = Array.from(new Set(indices));
  for (let idx = 0; idx < bucketCount && unique.length < limit; idx += 1) {
    if (!unique.includes(idx)) unique.push(idx);
  }

  return unique.sort((a, b) => a - b).slice(0, limit);
}

function findClosestIndexByDay(dates: Date[], targetDay: number) {
  let bestIndex = -1;
  let smallestDiff = Number.POSITIVE_INFINITY;
  dates.forEach((date, idx) => {
    const diff = Math.abs(date.getDate() - targetDay);
    if (diff < smallestDiff) {
      smallestDiff = diff;
      bestIndex = idx;
    }
  });
  return bestIndex;
}

function findClosestDateIndex(dates: Date[], target: Date) {
  const targetTime = target.getTime();
  let bestIndex = -1;
  let smallestDiff = Number.POSITIVE_INFINITY;
  dates.forEach((date, idx) => {
    const diff = Math.abs(date.getTime() - targetTime);
    if (diff < smallestDiff) {
      smallestDiff = diff;
      bestIndex = idx;
    }
  });
  return bestIndex;
}

function enforceTickLimit(ticks: AxisTick[], limit: number): AxisTick[] {
  if (ticks.length <= limit) {
    return ticks.sort((a, b) => a.index - b.index);
  }

  const sorted = ticks.sort((a, b) => a.index - b.index);
  const step = (sorted.length - 1) / (limit - 1);
  const result: AxisTick[] = [];
  const used = new Set<number>();

  for (let i = 0; i < limit; i += 1) {
    const idx = Math.round(i * step);
    const tick = sorted[idx];
    if (tick && !used.has(tick.index)) {
      used.add(tick.index);
      result.push(tick);
    }
  }

  for (let i = 0; i < sorted.length && result.length < limit; i += 1) {
    const tick = sorted[i]!;
    if (!used.has(tick.index)) {
      used.add(tick.index);
      result.push(tick);
    }
  }

  return result.sort((a, b) => a.index - b.index);
}

function formatKoreanMonth(date: Date) {
  const year = `${date.getFullYear()}`.slice(-2);
  const month = date.getMonth() + 1;
  return `${year}년 ${month}월`;
}
