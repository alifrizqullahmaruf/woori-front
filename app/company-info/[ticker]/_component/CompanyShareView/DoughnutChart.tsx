import {
  ArcElement,
  Chart as ChartJS,
  DoughnutController,
  Tooltip,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { colorCodes } from "@/app/company-info/[ticker]/_const";

interface DoughnutChartProps {
  dataArray: number[];
  labels?: string[];
  colorList?: string[];
}

export default function DoughnutChart({
  dataArray,
  labels = [],
  colorList = colorCodes,
}: DoughnutChartProps) {
  ChartJS.register(ArcElement, Tooltip, DoughnutController);
  return (
    <Doughnut
      data={{
        datasets: [
          {
            data: dataArray,
            backgroundColor: colorList,
          },
        ],
        labels,
      }}
      options={{
        layout: {
          padding: {
            top: 15,
            right: 15,
            bottom: 15,
            left: 15,
          },
        },
        datasets: {
          doughnut: {
            hoverOffset: 30,
          },
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: function (context) {
                const value = context.parsed;
                return `${value}%`;
              },
            },
          },
          datalabels: {
            display: false,
          },
        },
      }}
    />
  );
}
