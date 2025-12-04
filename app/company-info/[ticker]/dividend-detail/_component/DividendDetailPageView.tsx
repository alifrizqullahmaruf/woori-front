"use client";

import { useParams } from "next/navigation";
import { useMemo } from "react";
import Cell from "@/app/_common/component/atoms/Cell";
import Row from "@/app/_common/component/atoms/Row";
import Table from "@/app/_common/component/atoms/Table";
import { DataStateHandler } from "@/app/_common/component/molecules/DataStateHandler";
import {
  generateDivider,
  HELP_DESCRIPTIONS_DICTIONARY,
} from "@/app/_common/const";
import { useDividendsEvents } from "@/app/_common/hooks/useDividends";
import { useExchangeRate } from "@/app/_common/hooks/useForex";
import InfoButton from "@/app/company-info/[ticker]/_component/CompanyPerformanceView/InfoButton";
import TableContainer from "@/app/company-info/[ticker]/dividend-detail/_component/TableContainer";

export default function DividendDetailPageView() {
  const params = useParams();
  const ticker = params.ticker as string;

  const {
    data: dividendsEventsData,
    isLoading,
    error,
  } = useDividendsEvents(ticker);

  const { exchangeRate } = useExchangeRate();

  const groupedData = useMemo(() => {
    if (!dividendsEventsData?.items) return {};

    const grouped: {
      [year: string]: {
        ex: string;
        payment: string;
        amount: string;
      }[];
    } = {};

    // Sort items by ex_dividend_date descending
    const sortedItems = [...dividendsEventsData.items].sort(
      (a, b) =>
        new Date(b.ex_dividend_date).getTime() -
        new Date(a.ex_dividend_date).getTime(),
    );

    for (const item of sortedItems) {
      const date = new Date(item.ex_dividend_date);
      const year = date.getFullYear().toString();

      if (!grouped[year]) {
        grouped[year] = [];
      }

      const exFormatted = date.toLocaleDateString("ko-KR", {
        month: "long",
        day: "numeric",
      });

      const paymentDate = item.payment_date
        ? new Date(item.payment_date)
        : null;
      const paymentFormatted = paymentDate
        ? paymentDate.toLocaleDateString("ko-KR", {
            month: "long",
            day: "numeric",
          })
        : "-";

      // Convert dividend amount if USD
      const dividendAmount =
        item.currency === "USD"
          ? Math.round(item.dividend_amount * exchangeRate)
          : item.dividend_amount;

      const amountStr = `${dividendAmount.toLocaleString()}원`;

      grouped[year].push({
        ex: exFormatted,
        payment: paymentFormatted,
        amount: amountStr,
      });
    }

    return grouped;
  }, [dividendsEventsData, exchangeRate]);

  const sortedYears = useMemo(
    () =>
      Object.keys(groupedData)
        .sort((a, b) => parseInt(b) - parseInt(a))
        .slice(0, 5),
    [groupedData],
  );

  const rowStyle = "typo-micro grid grid-cols-[1fr_2fr_1fr] ";


  return (
    <DataStateHandler isLoading={isLoading} error={error}>
      <article className="max-h-[100dvh]">
        <Row
          className={rowStyle + "text-gray-w700 px-6 py-2.5"}
          style={{
            boxShadow: "1px 3px 6px 0px #00000014",
          }}
        >
          <Cell role="columnheader" className="flex items-center gap-0.5">
            배당락일
            <InfoButton
              modalDescription={HELP_DESCRIPTIONS_DICTIONARY["배당락일"]}
            />
          </Cell>
          <Cell role="columnheader" className="text-center">
            배당 지급일
          </Cell>
          <Cell role="columnheader" className="text-right">
            배당금
          </Cell>
        </Row>

        <TableContainer>
          {sortedYears.length === 0 ? (
            <div className="flex items-center justify-center py-8 text-gray-500">
              배당 내역이 없습니다.
            </div>
          ) : (
            sortedYears.map((year, index) => (
              <section
                key={`section_${year}_${index}`}
                style={{
                  marginBottom:
                    index !== sortedYears.length - 1 ? "36px" : "0",
                }}
              >
                <h2 className={"font-bold " + generateDivider("mt-[3px] mb-3")}>
                  {year}년
                </h2>
                <Table aria-label={`${year}년 배당 내역`}>
                  {groupedData[year].map((dividendData, valueIndex) => (
                    <Row
                      key={`${year}_${dividendData.ex}_${dividendData.amount}_${valueIndex}`}
                      className={rowStyle}
                      style={{
                        marginBottom:
                          valueIndex !== groupedData[year].length - 1
                            ? "15px"
                            : "0",
                      }}
                    >
                      <Cell>{dividendData.ex}</Cell>
                      <Cell className="text-center">
                        {dividendData.payment}
                      </Cell>
                      <Cell className="text-right">{dividendData.amount}</Cell>
                    </Row>
                  ))}
                </Table>
              </section>
            ))
          )}
        </TableContainer>
      </article>
    </DataStateHandler>
  );
}