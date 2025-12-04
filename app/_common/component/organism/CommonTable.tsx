import { generateDivider } from "@/app/_common/const";
import { HelpTexts } from "@/app/_common/types";
import FormattedTableRow from "@/app/company-info/[ticker]/_component/CompanyOverviewView/FormattedTableRow";
import { type DummyTableContents } from "@/app/company-info/[ticker]/_types";

// FIXME: helpTexts 관리 방식 수정

interface CommonTableProps {
  tableContents: DummyTableContents[];
  shouldDisplayDivider?: boolean;
  helpTexts?: HelpTexts;
}

export default function CommonTable({
  tableContents,
  shouldDisplayDivider = false,
  helpTexts,
}: CommonTableProps) {
  const dividerClass = shouldDisplayDivider ? generateDivider() : "";

  return (
    <table className={`w-full ${dividerClass}`}>
      <tbody className={"flex flex-col gap-1.5"}>
        {tableContents.map(({ category, value }, index) => (
          <FormattedTableRow
            key={`${index}_${category}_${
              typeof value === "string"
                ? value
                : `${value.companyName}_${value.stockCode}`
            }`}
            heading={category}
            value={value}
            {...(helpTexts && { helpText: helpTexts[category] })}
          />
        ))}
      </tbody>
    </table>
  );
}
