import { MouseEvent, useCallback, useRef } from "react";

interface ContentsTabProps {
  itemList: string[];
  activeItem: string;
  activateItem: (item: string) => void;
}

export default function ContentsTab({
  itemList,
  activeItem,
  activateItem,
}: ContentsTabProps) {
  const { scrollContainerRef, scrollToButton } = useTabScroll();

  const handleItemClick = (item: string) => (event: MouseEvent) => {
    activateItem(item);
    scrollToButton(event);
  };

  return (
    <div
      className={
        "no-scrollbar max-w-full snap-x snap-mandatory overflow-x-auto px-6 py-[3.5px]"
      }
      ref={scrollContainerRef}
    >
      <ul className={"flex w-max items-center"}>
        {itemList.map((item, index) => (
          <li
            key={`tab_item_${index}_${item}`}
            className={`typo-small fomt-medium px-[14px] py-[6px] leading-[100%] ${
              item === activeItem
                ? "bg-[#2589F4] rounded-[15px] text-white"
                : ""
            }`}
          >
            <button onClick={handleItemClick(item)}>{item}</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

const useTabScroll = () => {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const scrollToButton = useCallback((event: MouseEvent) => {
    const { currentTarget } = event;
    const container = scrollContainerRef.current;

    if (container && currentTarget) {
      const { left, right } = currentTarget.getBoundingClientRect();
      let offset = 0;

      if (right - window.innerWidth > 0) {
        offset = right;
      } else if (left < 0) {
        offset = left;
      }

      if (offset !== 0) {
        container.scrollTo({
          left: offset,
          behavior: "smooth",
        });
      }
    }
  }, []);

  return {
    scrollContainerRef,
    scrollToButton,
  };
};
