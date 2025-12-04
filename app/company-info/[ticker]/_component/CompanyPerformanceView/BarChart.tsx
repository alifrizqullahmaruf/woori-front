import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  LinearScale,
} from "chart.js";
import type { ChartData, ChartOptions, TooltipItem } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import type { Context as DataLabelsContext } from "chartjs-plugin-datalabels";
import { useMemo, useRef } from "react";
import { Bar } from "react-chartjs-2";

export interface CommonChartProps {
  isUpdateChart?: boolean;
  rawData: number[];
  originalValues?: number[];
  labels: string[];
  additionalLabels?: string[];
  width?: number;
  height?: number;
  valueDecimals?: number;
  valueSuffix?: string;
  metricLabel?: string;
}

ChartJS.register(CategoryScale, LinearScale, BarElement, ChartDataLabels);

export default function BarChart({
  isUpdateChart = false,
  rawData,
  originalValues,
  labels,
  additionalLabels,
  width,
  height,
  valueDecimals = 2,
  valueSuffix,
  metricLabel,
}: CommonChartProps) {
  const chartRef = useRef<ChartJS<"bar"> | null>(null);

  // Use signed values for bar heights to support negative bars
  const barHeights = useMemo(
    () => rawData.map((v) => (Number.isFinite(v) ? v : 0)),
    [rawData],
  );

  // Values shown on labels/tooltips (original values if provided)
  const displayValues = useMemo(
    () => (originalValues?.length ? originalValues : rawData),
    [originalValues, rawData],
  );

  // Percentage labels (YoY / PoP)
  const percentLabels = useMemo(() => {
    if (additionalLabels?.length) return additionalLabels;
    return displayValues.map((v, i, arr) => {
      if (i === 0) return "0%";
      const prev = arr[i - 1] ?? 0;
      const pct = prev !== 0 ? ((v - prev) / Math.abs(prev)) * 100 : 0;
      return `${pct.toFixed(2)}%`;
    });
  }, [additionalLabels, displayValues]);

  const chartData = useMemo(
    (): ChartData<"bar"> => ({
      datasets: [
        {
          data: barHeights,
          barThickness: 42,
          borderRadius: 6,
          backgroundColor: "#B1DAFF",
          minBarLength: 2,
        },
      ],
      labels,
    }),
    [barHeights, labels],
  );

  const chartOptions = useMemo(
    (): ChartOptions<"bar"> => ({
      animation: { duration: 300 },
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          xAlign: "center",
          yAlign: "bottom",
          enabled: true,
          callbacks: {
            title: (items: TooltipItem<"bar">[]) => labels[items[0].dataIndex],
            label: (item: TooltipItem<"bar">) => {
              const dataIndex = item.dataIndex ?? 0;
              const value = displayValues[dataIndex] ?? 0;
              const formattedValue = Number.isFinite(value)
                ? value.toFixed(valueDecimals)
                : "0";
              const prefix = value > 0 ? "+" : "";
              const valueText = valueSuffix
                ? `${prefix}${formattedValue}${valueSuffix}`
                : `${prefix}${formattedValue}`;

              return metricLabel ? `${metricLabel}    ${valueText}` : valueText;
            },
          },
        },
        datalabels: {
          anchor: (ctx: DataLabelsContext) => {
            const dataIndex = ctx.dataIndex ?? 0;
            const value = displayValues[dataIndex] ?? 0;
            return value >= 0 ? "end" : "start";
          },
          align: (ctx: DataLabelsContext) => {
            const dataIndex = ctx.dataIndex ?? 0;
            const value = displayValues[dataIndex] ?? 0;
            return value >= 0 ? "top" : "bottom";
          },
          textAlign: "center",
          clip: false,
          labels: {
            pct: {
              display: (ctx: DataLabelsContext) =>
                isUpdateChart && !!percentLabels[ctx.dataIndex ?? 0],
              formatter: (_unused: unknown, ctx: DataLabelsContext) =>
                percentLabels[ctx.dataIndex ?? 0] ?? "",
              color: (ctx: DataLabelsContext) => {
                const numericText = (percentLabels[ctx.dataIndex ?? 0] || "0")
                  .toString()
                  .replace("%", "");
                const percentNumber = parseFloat(numericText);
                if (!Number.isFinite(percentNumber)) return "#3F4150";
                return percentNumber >= 0 ? "#E34850" : "#2962FF";
              },
              font: { size: 12, family: "Lato Numbers", weight: "bold" },
              offset: 14,
            },
            val: {
              formatter: (_computedBarHeight: unknown, ctx: DataLabelsContext) => {
                const dataIndex = ctx.dataIndex ?? 0;
                const value = displayValues[dataIndex] ?? 0;
                const formattedValue = Number.isFinite(value)
                  ? value.toFixed(valueDecimals)
                  : "0";
                const prefix = value > 0 ? "" : "";
                return valueSuffix
                  ? `${prefix}${formattedValue}${valueSuffix}`
                  : `${prefix}${formattedValue}`;
              },
              color: "#3F4150",
              font: { size: 12, family: "Lato Numbers", weight: "bold" },
              offset: 0,
            },
          },
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
            offset: true // Add spacing between bars and axis
          },
          border: { display: false },
          ticks: {
            font: { size: 12, family: "Lato Numbers" },
            color: "#3F4150",
            padding: 30, // Add padding between axis labels and chart area
          },
          position:"bottom"
        },
        y: {
          display: true,
          ticks: {
            display: false, // Hide tick labels but keep grid
          },
          border: {
            display: false, // Hide y-axis border
          },
          grid: {
            display: true,
            drawOnChartArea: true,
            drawTicks: false,
            color: (context) => {
              // Draw a line at y=0
              if (context.tick.value === 0) {
                return "#DDDDDD";
              }
              return "transparent";
            },
            lineWidth: (context) => {
              if (context.tick.value === 0) {
                return 1;
              }
              return 0;
            },
          },
          beginAtZero: true,
        },
      },
      layout: {
        padding: {
          top: isUpdateChart ? 38 : 16,
          bottom: 0, // Add bottom padding for negative bars
        }
      },
    }),
    [
      isUpdateChart,
      labels,
      percentLabels,
      displayValues,
      valueDecimals,
      valueSuffix,
      metricLabel,
    ],
  );

  return (
    <Bar
      ref={chartRef}
      className="pt-[-8px]"
      data={chartData}
      options={chartOptions}
      {...(width && { width })}
      {...(height && { height })}
    />
  );
}
