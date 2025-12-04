"use client";

import { ECharts, EChartsOption, init } from "echarts";
import { CSSProperties, useEffect, useRef } from "react";

interface EChartsProps {
  option: EChartsOption;
  style?: CSSProperties;
  className?: string;
  changeTheme?: (theme: string) => void;
}

export default function EChartsWrapper({
  option,
  style,
  className,
  changeTheme,
}: EChartsProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<ECharts | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      chartInstance.current = init(chartRef.current);

      // ResizeObserver 설정
      resizeObserverRef.current = new ResizeObserver(() => {
        if (chartInstance.current) {
          chartInstance.current.resize();
        }
      });

      // 차트 컨테이너 관찰 시작
      resizeObserverRef.current.observe(chartRef.current);
    }

    return () => {
      // ResizeObserver 정리
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }

      // 차트 인스턴스 정리
      if (chartInstance.current) {
        chartInstance.current.dispose();
      }
    };
  }, []);

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.setOption(option);
      if (changeTheme) {
        chartInstance.current.off("click");
        chartInstance.current.on("click", (params: any) => {
          changeTheme(params.name);
        });
      }
    }
  }, [option, changeTheme]);

  return <div ref={chartRef} style={{ ...style }} className={className} />;
}
