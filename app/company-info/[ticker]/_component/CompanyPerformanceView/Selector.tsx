import { useCallback, useEffect, useRef, useState } from "react";
import { Detail } from "@/app/_common/component/atoms/Icon";

interface SelectorProps {
  valueSet: string[];
  value?: string; // controlled value (optional)
  onChange?: (value: string) => void; // notify parent (optional)
}

export default function Selector({ valueSet, value, onChange }: SelectorProps) {
  const [selectedValue, toggleValue] = useHandleValue(valueSet);
  const containerRef = useRef<HTMLDivElement | null>(null);
  // const [isOpen, toggleList] = useHandleList(containerRef.current);

  const displayed = value ?? selectedValue;

  const handleToggle = useCallback(() => {
    // if controlled, call onChange with toggled value
    const current = value ?? selectedValue;
    const next = current === valueSet[0] ? valueSet[1] : valueSet[0];
    if (onChange) {
      onChange(next);
    } else {
      toggleValue();
    }
  }, [onChange, selectedValue, value, valueSet, toggleValue]);

  return (
    <div className={"relative"} ref={containerRef}>
      <button
        className={
          "typo-tiny text-gray-w800 flex items-center gap-0.5 font-medium"
        }
        onClick={handleToggle}
      >
        {displayed}
        <Detail className={"mt-0.5 size-4"} />
      </button>
      {/*{isOpen && (*/}
      {/*  // FIXME: 디자인 나오면 수정*/}
      {/*  <ul*/}
      {/*    className={*/}
      {/*      "absolute top-[calc(100%+5px)] right-0 w-max rounded-lg bg-white"*/}
      {/*    }*/}
      {/*    style={{ boxShadow: "1px 3px 6px 4px #00000014" }}*/}
      {/*  >*/}
      {/*    {valueSet.map((value, index) => (*/}
      {/*      <li key={`selector_value_${index}`}>*/}
      {/*        <button*/}
      {/*          onClick={selectValue(value, toggleList)}*/}
      {/*          className={*/}
      {/*            "typo-tiny active:bg-primary-700 px-4 py-2 active:text-white"*/}
      {/*          }*/}
      {/*          style={{*/}
      {/*            ...(index === 0 && {*/}
      {/*              borderTopLeftRadius: "8px",*/}
      {/*              borderTopRightRadius: "8px",*/}
      {/*            }),*/}
      {/*            ...(index === valueSet.length - 1 && {*/}
      {/*              borderBottomLeftRadius: "8px",*/}
      {/*              borderBottomRightRadius: "8px",*/}
      {/*            }),*/}
      {/*          }}*/}
      {/*        >*/}
      {/*          {value}*/}
      {/*        </button>*/}
      {/*      </li>*/}
      {/*    ))}*/}
      {/*  </ul>*/}
      {/*)}*/}
    </div>
  );
}

const useHandleList = (listContainer: HTMLDivElement | null) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleList = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    if (listContainer) {
      const trackClickOutsideContainer = (event: MouseEvent) => {
        const clickedTarget = event.target as HTMLElement;
        if (!listContainer.contains(clickedTarget)) {
          setIsOpen(false);
        }
      };
      window.addEventListener("click", trackClickOutsideContainer);
      return () => {
        window.removeEventListener("click", trackClickOutsideContainer);
      };
    }
  }, [listContainer]);

  return [isOpen, toggleList] as const;
};

const useHandleValue = (valueSet: string[]) => {
  const [selectedValue, setSelectedValue] = useState<string>(valueSet[0]);

  const selectValue = useCallback(
    (value: string, callback?: () => void) => () => {
      setSelectedValue(value);
      if (callback) {
        callback();
      }
    },
    [],
  );

  const toggleValue = useCallback(() => {
    if (selectedValue === valueSet[0]) {
      setSelectedValue(valueSet[1]);
    } else {
      setSelectedValue(valueSet[0]);
    }
  }, [selectedValue, valueSet]);

  return [selectedValue, toggleValue] as const;
};
