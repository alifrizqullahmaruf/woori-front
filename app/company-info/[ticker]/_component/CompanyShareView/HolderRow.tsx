import { colorCodes } from "@/app/company-info/[ticker]/_const";

interface HolderRowProps {
  filterIndex: () => void;
  index: number;
  name: string;
  share: number;
  isActive: boolean;
}

export default function HolderRow({
  filterIndex,
  index,
  name,
  share,
  isActive = true,
}: HolderRowProps) {
  return (
    <tr
      className={"cursor-pointer"}
      onClick={filterIndex}
      style={{ color: isActive ? "black" : "#B2B3B9" }}
    >
      <td colSpan={6}>
        <div
          className={"mt-0.5 size-4 rounded-[3px]"}
          style={{ backgroundColor: isActive ? colorCodes[index] : "#B2B3B9" }}
        />
      </td>
      <td colSpan={72} className={"px-1"}>
        {name}
      </td>
      <td colSpan={22} className={"font-numbers text-right font-bold"}>
        {share.toFixed(2)}%
      </td>
    </tr>
  );
}
