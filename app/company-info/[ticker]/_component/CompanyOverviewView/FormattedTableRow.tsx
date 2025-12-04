import { HelpDescriptions } from "@/app/_common/types";
import InfoButton from "@/app/company-info/[ticker]/_component/CompanyPerformanceView/InfoButton";

type TableValue =
  | string
  | {
      companyName: string;
      stockCode: string;
    };

interface FormattedTableRowProps {
  heading: string;
  value: TableValue;
  helpText?: HelpDescriptions;
  headingClassName?: string;
  valueClassName?: string;
}

export default function FormattedTableRow({
  heading,
  value,
  helpText,
  headingClassName,
  valueClassName,
}: FormattedTableRowProps) {
  return (
    <tr className={"typo-small flex w-full items-start justify-between"}>
      <th className={`text-gray-w600 flex font-medium ${headingClassName ?? ""}`}>
        <div className={"flex items-center gap-1"}>
          <span>{heading}</span>
          {helpText && <InfoButton modalDescription={helpText} />}
        </div>
      </th>
      <td className={`typo-num-base text-right font-medium ${valueClassName ?? ""}`}>
        {typeof value === "string" ? (
          value
        ) : (
          <div className={"flex gap-1.5"}>
            {value.companyName}
            <span className={"text-gray-w700 typo-small"}>
              {value.stockCode}
            </span>
          </div>
        )}
      </td>
    </tr>
  );
}
