interface ChartFallbackProps {
  width?: string;
  height?: string;
}

export default function ChartFallback({
  width = "100%",
  height = "100%",
}: ChartFallbackProps) {
  return (
    <div
      className={"bg-border mx-auto mt-5 mb-6 max-h-[346px]"}
      style={{ width, height }}
    />
  );
}
