// 공통 차트 옵션 인터페이스
interface CommonChartOptions {
  title?: {
    text: string;
    subtext?: string;
    left?: string;
    top?: number | string;
    textStyle?: {
      fontSize?: number;
      fontWeight?: string;
      color?: string;
    };
    subtextStyle?: {
      fontSize?: number;
      color?: string;
    };
  };
  tooltip?: {
    trigger?: "item" | "axis";
    backgroundColor?: string;
    borderColor?: string;
    textStyle?: {
      color?: string;
    };
    formatter?: string | ((params: any) => string);
  };
  legend?: {
    orient?: "horizontal" | "vertical";
    left?: string;
    right?: string;
    top?: string;
    bottom?: string | number;
    itemGap?: number;
    textStyle?: {
      fontSize?: number;
      color?: string;
    };
  };
  backgroundColor?: string;
  color?: string[];
  grid?: {
    left?: string | number;
    right?: string | number;
    top?: string | number;
    bottom?: string | number;
    containLabel?: boolean;
  };
}

interface CreateBaseChartConfig {
  title: string;
  subtext?: string;
  colors?: string[];
  backgroundColor?: string;
}

// 공통 옵션 생성 함수
export const createBaseChartOptions = (
  config: CreateBaseChartConfig,
): CommonChartOptions => {
  return {
    backgroundColor: config.backgroundColor || "#f4f4f4",
    title: {
      text: config.title,
      subtext: config.subtext,
      left: "center",
      top: 20,
      textStyle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#333",
      },
      subtextStyle: {
        fontSize: 14,
        color: "#666",
      },
    },
    tooltip: {
      backgroundColor: "rgba(50,50,50,0.9)",
      borderColor: "#333",
      textStyle: {
        color: "#fff",
      },
    },
    legend: {
      orient: "horizontal",
      bottom: 20,
      itemGap: 20,
      textStyle: {
        fontSize: 12,
        color: "#333",
      },
    },
    color: config.colors || [
      "#5470C6",
      "#91CC75",
      "#FAC858",
      "#EE6666",
      "#73C0DE",
      "#3BA272",
      "#FC8452",
      "#9A60B4",
      "#EA7CCC",
    ],
    grid: {
      left: "3%",
      right: "4%",
      top: "15%",
      bottom: "15%",
      containLabel: true,
    },
  };
};

// 각 차트 타입별 특화 옵션을 추가하는 함수들
export const createDonutChartOptions = (
  baseOptions: CommonChartOptions,
  data: any[],
) => {
  return {
    ...baseOptions,
    tooltip: {
      ...baseOptions.tooltip,
      trigger: "item" as const,
      formatter: "{a} <br/>{b}: {c} ({d}%)",
    },
    legend: {
      ...baseOptions.legend,
      orient: "vertical" as const,
      left: "left",
      top: "middle",
    },
    series: [
      {
        name: "데이터",
        type: "pie",
        radius: ["40%", "70%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 8,
          borderColor: "#fff",
          borderWidth: 2,
        },
        data,
      },
    ],
  };
};

interface BarLineChartOptions {
  baseOptions: CommonChartOptions;
  xAxisData: string[];
  seriesData: any[];
  chartType: "bar" | "line";
}

export const createBarLineChartOptions = ({
  baseOptions,
  xAxisData,
  seriesData,
  chartType,
}: BarLineChartOptions) => {
  return {
    ...baseOptions,
    tooltip: {
      ...baseOptions.tooltip,
      trigger: "axis" as const,
    },
    xAxis: {
      type: "category",
      data: xAxisData,
      axisLine: {
        lineStyle: {
          color: "#333",
        },
      },
    },
    yAxis: {
      type: "value",
      axisLine: {
        lineStyle: {
          color: "#333",
        },
      },
    },
    series: seriesData.map((series) => ({
      ...series,
      type: chartType,
      ...(chartType === "bar"
        ? {
            itemStyle: {
              borderRadius: [4, 4, 0, 0],
            },
          }
        : {
            smooth: true,
            lineStyle: {
              width: 3,
            },
          }),
    })),
  };
};
