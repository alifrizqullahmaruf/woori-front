import { Plugin } from "chart.js";
import { useCallback, useMemo, useRef } from "react";

interface HookOptions {
  unit?: string;
  labelOffset?: number;
  additionalOffset?: number;
  displayLabel?: boolean;
}

interface PluginOptions extends HookOptions {
  showAdditionalLabels: boolean;
  additionalLabels: string[];
}

const usePeriodComparePlugin = (
  showAdditionalLabels: boolean,
  additionalLabels: string[],
  options?: HookOptions,
) => {
  const offset = options?.labelOffset ?? 4;
  const additionalOffset =
    options?.additionalOffset ?? options?.labelOffset ?? 21;

  // 플러그인 인스턴스를 참조로 유지
  const pluginRef = useRef<Plugin | null>(null);

  const plugin = useMemo(() => {
    const newPlugin: Plugin = {
      id: "customLabels",
      afterDatasetsDraw: (chart: any) => {
        const ctx = chart.ctx;
        const pluginOptions = chart.options.plugins
          ?.customLabels as PluginOptions;

        chart.data.datasets.forEach((dataset: any, datasetIndex: any) => {
          const meta = chart.getDatasetMeta(datasetIndex);

          meta.data.forEach((point: any, index: any) => {
            const data = dataset.data[index];
            const x = point.x;
            const y = point.y;

            // 기본 값 표시 (항상 표시되는 라벨 A)
            ctx.save();
            ctx.textAlign = "center";
            ctx.font = "medium 12px 'Lato Numbers'";
            ctx.fillStyle = "#3F4150";
            if (options?.displayLabel) {
              ctx.fillText(`${data}${options?.unit ?? "%"}`, x, y - offset);
            }
            ctx.restore();

            // 추가 라벨 표시 (토글되는 라벨 B)
            if (pluginOptions?.showAdditionalLabels) {
              const additionalLabel = pluginOptions.additionalLabels[index];
              if (additionalLabel !== undefined) {
                ctx.save();
                ctx.textAlign = "center";
                ctx.font = "bold 12px 'Lato Numbers'";
                ctx.fillStyle = additionalLabel.startsWith("-")
                  ? "#2962FF"
                  : "#E34850";
                ctx.fillText(additionalLabel, x, y - additionalOffset);
                ctx.restore();
              }
            }
          });
        });
      },
    };

    pluginRef.current = newPlugin;
    return newPlugin;
  }, [offset, additionalOffset, options?.unit]);

  // 차트 업데이트 함수
  const updateChart = useCallback(
    (chart: any, newShowState: boolean, newAdditionalLabels: string[]) => {
      if (!chart || !chart.options.plugins) return;

      // 옵션 업데이트
      chart.options.plugins.customLabels = {
        ...chart.options.plugins.customLabels,
        showAdditionalLabels: newShowState,
        additionalLabels: newAdditionalLabels,
      };

      // 캔버스만 다시 그리기 (전체 차트 재생성 없이)
      chart.draw();
    },
    [],
  );

  return {
    plugin,
    updateChart,
    // 초기 옵션 반환
    initialOptions: {
      showAdditionalLabels,
      additionalLabels,
      ...options,
    },
  };
};

export default usePeriodComparePlugin;
