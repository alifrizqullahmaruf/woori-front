import {
  CategoryScale,
  Chart as ChartJS,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { useEffect, useMemo, useRef } from "react";
import { Line } from "react-chartjs-2";

export type AxisTick = { index: number; label: string };

const LINE_COLOR = "#2589F4";
const GRIDLINE_COLOR = "#DBEBFD";
const CHART_RIGHT_PADDING = 20;
console.log(ChartJS.version);
export interface CommonChartProps {
  isUpdateChart?: boolean;
  rawData: number[];
  labels: string[];
  additionalLabels?: string[]; // Optional YoY (%)
  width?: number;
  height?: number;
  showYAxisLeft?: boolean;
  yTicks?: number[];
  yTickFormatter?: (v: number) => string;
  showDataLabels?: boolean;
  xTicks?: AxisTick[];
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Tooltip,
  ChartDataLabels,
);

function fmtNumber(n: number) {
  return Number.isFinite(n) ? n.toFixed(2) : "0.00";
}

function computePercentsFromRaw(raw: number[]) {
  return raw.map((v, i) => {
    if (i === 0) return "0%";
    const prev = raw[i - 1] ?? 0;
    const pct = prev !== 0 ? ((v - prev) / Math.abs(prev)) * 100 : 0;
    return `${pct.toFixed(2)}%`;
  });
}

export default function LineChartSolid({
  isUpdateChart = false,
  rawData,
  labels,
  additionalLabels,
  width,
  height,
  showYAxisLeft = false,
  yTicks,
  yTickFormatter,
  showDataLabels = true,
  xTicks,
}: CommonChartProps) {
  const chartRef = useRef<ChartJS<"line"> | null>(null);

  const percentLabels = useMemo(
    () =>
      additionalLabels?.length
        ? additionalLabels
        : computePercentsFromRaw(rawData),
    [additionalLabels, rawData],
  );

  const chartData = useMemo(
    () => ({
      datasets: [
        {
          data: rawData,
          borderWidth: 2,
          borderColor: LINE_COLOR,
          // Hide markers (no dots)
          pointRadius: 0,
          pointHoverRadius: 0,
          fill: false,
          // Minimal smoothing for sharp line
          tension: 0.1,
          // Ensure solid line (no dash)
          borderDash: [],
          spanGaps: true,
        },
      ],
      labels,
    }),
    [labels, rawData],
  );

  const xTickLabelMap = useMemo(() => {
    if (!xTicks?.length) return null;
    return xTicks.reduce<Record<number, string>>((acc, tick) => {
      acc[tick.index] = tick.label;
      return acc;
    }, {});
  }, [xTicks]);

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      animation: { duration: 300 },
      elements: { point: { radius: 0, hoverRadius: 0 } },
      plugins: {
        legend: { display: false },
        tooltip: {
          enabled: true,
          mode: "index" as const,
          intersect: false,
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          titleColor: "#ffffff",
          bodyColor: "#ffffff",
          borderColor: "#dddddd",
          borderWidth: 1,
          cornerRadius: 4,
          displayColors: false,
          callbacks: {
            title: (ctx: any) => labels[ctx[0].dataIndex],
            label: (ctx: any) => `${fmtNumber(ctx.parsed.y)}조`,
          },
        },

        datalabels: {
          ...(showDataLabels ? {} : { display: false }),
          anchor: "end",
          align: "top",
          textAlign: "center",
          labels: {
            pct: {
              display: (ctx: any) =>
                isUpdateChart && !!percentLabels[ctx.dataIndex ?? 0],
              formatter: (_: number, ctx: any) =>
                percentLabels[ctx.dataIndex ?? 0] ?? "",
              color: (ctx: any) => {
                const v = parseFloat(
                  String(percentLabels[ctx.dataIndex ?? 0] || "0").replace(
                    "%",
                    "",
                  ),
                );
                if (!Number.isFinite(v)) return "#3F4150";
                return v >= 0 ? "#E34850" : "#2962FF";
              },
              font: { size: 12, family: "Lato Numbers", weight: "bold" },
              offset: 14,
            },
            val: {
              formatter: (value: number) => `${fmtNumber(value)}%`,
              color: "#3F4150",
              font: { size: 12, family: "Lato Numbers", weight: "bold" },
              offset: 0,
            },
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          border: { display: false },
          offset: true,
          ticks: {
            font: { size: 12, family: "Lato Numbers" },
            color: "#3F4150",
            padding: 11,
            autoSkip: xTickLabelMap ? false : undefined,
            maxTicksLimit: xTickLabelMap
              ? Object.keys(xTickLabelMap).length
              : undefined,
            callback: (value: string | number, index: number) => {
              if (!xTickLabelMap) return labels[index] ?? value;
              return xTickLabelMap[index] ?? "";
            },
          },
        },
        y: {
          display: showYAxisLeft,
          beginAtZero: false,
          grace: "20%",
          ...(Array.isArray(yTicks) && yTicks.length
            ? {
                min: Math.min(...yTicks),
                max: Math.max(...yTicks),
                ticks: {
                  stepSize:
                    yTicks.length > 1 ? Math.abs(yTicks[1]! - yTicks[0]!) : 10,
                  callback: (v: any) =>
                    typeof yTickFormatter === "function"
                      ? yTickFormatter(Number(v))
                      : `${v} %`,
                  font: { size: 12, family: "Lato Numbers" },
                  color: "#3F4150",
                  padding: 10,
                },
                border: {
                  display: false,
                  dash: [5, 5],
                  dashOffset: 1,
                  width: 1,
                },
                grid: {
                  display: true,
                  color: GRIDLINE_COLOR,
                  lineWidth: 1,
                  tickBorderDash: [2, 5],
                },
              }
            : {
                ticks: {
                  callback: (v: any) =>
                    typeof yTickFormatter === "function"
                      ? yTickFormatter(Number(v))
                      : `${v} %`,
                  font: { size: 12, family: "Lato Numbers" },
                  color: "#3F4150",
                },
                grid: {
                  display: true,
                  color: GRIDLINE_COLOR,
                  borderDash: [0, 4],
                  lineWidth: 1,
                },
                border: { display: false },
              }),
        },
      },
      layout: {
        padding: { top: isUpdateChart ? 60 : 40, right: CHART_RIGHT_PADDING },
      },
      maintainAspectRatio: rawData.length > 30,
    }),
    [
      isUpdateChart,
      labels,
      rawData.length,
      percentLabels,
      showYAxisLeft,
      yTicks,
      yTickFormatter,
      showDataLabels,
      xTickLabelMap,
    ],
  );

  useEffect(() => {
    // chartRef.current?.update();
  }, [isUpdateChart, percentLabels]);

  return (
    <Line
      ref={chartRef}
      data={chartData}
      options={chartOptions as any}
      className="max-h-[346px]"
      {...(width && { width })}
      {...(height && { height })}
    />
  );
}
