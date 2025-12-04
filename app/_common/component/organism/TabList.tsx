"use client";

import { useEffect, useState } from "react";
import { TabListData } from "@/app/_common/types";

interface TabListProps {
  tabDataList: TabListData[];
  currentValue?: string;
  onClickAction: (value: string) => void;
}

export default function TabList({
  tabDataList,
  currentValue,
  onClickAction,
}: Readonly<TabListProps>) {
  const getIndexFromValue = (value?: string) => {
    if (!value) return 0;
    const idx = tabDataList.findIndex((tab) => tab.value === value);
    return idx >= 0 ? idx : 0;
  };

  const [activeIndex, setActiveIndex] = useState(() => getIndexFromValue(currentValue));
  useEffect(() => {
    const newIndex = getIndexFromValue(currentValue);
    setActiveIndex(newIndex);
  }, [currentValue]);

  const handleClick = (index: number, value: string) => () => {
    setActiveIndex(index);
    if (onClickAction != null) {
      onClickAction(value);
    }
  };

  return (
    <ul className={`border-border flex justify-evenly border-b px-6`}>
      {tabDataList.map((data, index) => (
        <li
          key={`${index}_${data.text}_${data.value}`}
          className={`${
            index === activeIndex
              ? "border-gray-w800 text-gray-w800 border-b-2 font-bold"
              : "text-gray-w600 font-medium"
          } flex-1 py-2 text-center`}
        >
          <button onClick={handleClick(index, data.value)}>{data.text}</button>
        </li>
      ))}
    </ul>
  );
}

