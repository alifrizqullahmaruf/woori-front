"use client";

import { EChartsOption } from "echarts";
import { useMemo } from "react";
import EChartsWrapper from "@/app/_common/component/atoms/ECharts";

interface TreemapData {
  name: string;
  value: number;
  children?: TreemapData[];
}

interface TreemapChartProps {
  data: TreemapData[];
  selectedTheme: string | null;
  changeTheme: (theme: string) => void;
}

export default function TreemapChart({
  data,
  selectedTheme,
  changeTheme,
}: TreemapChartProps) {
  const treemapData = useMemo(() => {
    return data.map((item) => ({
      name: item.name,
      value: Math.abs(item.value),
      originalValue: item.value,
      itemStyle: {
        color:
          selectedTheme === item.name
            ? "#3f4150"
            : generateBgColorByChangeRate(item.value),
      },
      label: {
        color:
          selectedTheme === item.name
            ? "white"
            : generateTextColorByChangeRate(item.value),
      },
    }));
  }, [data, selectedTheme]);

  const option = useMemo(
    (): EChartsOption => ({
      tooltip: {
        formatter: function (info: any) {
          return `${info.name}<br/>수익률: ${info.data.originalValue}%`;
        },
        backgroundColor: "#000000B3",
        borderRadius: 10,
        textStyle: {
          color: "white",
        },
      },
      series: [
        {
          type: "treemap",
          data: treemapData,
          width: "100%",
          height: "100%",
          scaleLimit: {
            min: 1,
            max: 1,
          },
          nodeClick: false,
          breadcrumb: {
            show: false,
          },
          // 타일 크기를 절대값으로 설정
          squareRatio: 1, // 정사각형 비율 유지
          roam: false, // 줌/팬 비활성화
          itemStyle: {
            borderColor: "#fff",
            borderWidth: 1,
            gapWidth: 1,
            // Border rounded
            borderRadius: 2,
          },
          labelLayout: function (params: any) {
            const width = params.rect.width;
            const height = params.rect.height;
            const fontSizeByRect = Math.min(18, Math.max(width, height) / 10);
            const fontSize =
              fontSizeByRect > 14
                ? fontSizeByRect
                : fontSizeByRect > 6
                  ? 12
                  : 0;
            return {
              fontSize,
            };
          },
          label: {
            show: true,
            formatter: function (info: any) {
              return `${info.name}\n${info.data.originalValue}%`;
            },
            fontWeight: "bold",
            fontFamily: "Lato",
          },
          // 정렬 방식을 명시적으로 설정하지 않음 (기본값 사용)
          sort: false,
          levels: [
            {
              itemStyle: {
                borderWidth: 0,
                gapWidth: 2,
              },
            },
          ],
        },
      ],
    }),
    [treemapData],
  );

  return (
    <EChartsWrapper
      option={option}
      className={"aspect-square w-full"}
      changeTheme={changeTheme}
    />
  );
}

const generateBgColorByChangeRate = (changeRate: number) => {
  switch (true) {
    case changeRate >= 10:
      return "#FD4A5F";
    case changeRate >= 8:
      return "#FF6B6B";
    case changeRate >= 6:
      return "#FF8787";
    case changeRate >= 4:
      return "#FFA8A8";
    case changeRate >= 2:
      return "#FFB8A0";
    case changeRate >= 0:
      return "#FFC8A0";
    case changeRate >= -2:
      return "#A0D7FF";
    case changeRate >= -4:
      return "#7CC3FF";
    case changeRate >= -6:
      return "#5EA8FF";
    case changeRate >= -8:
      return "#4B89FF";
    case changeRate >= -10:
      return "#3B6AFF";
    case changeRate < -10:
      return "#1B3BE4";
    default:
      return "#000000";
  }
};
const generateTextColorByChangeRate = (changeRate: number) => {
  if (changeRate < 4 && changeRate >= -2) {
    return "black";
  } else {
    return "white";
  }
};
