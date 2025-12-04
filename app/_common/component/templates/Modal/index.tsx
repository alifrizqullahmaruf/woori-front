"use client";

import { MouseEvent, useCallback, useEffect } from "react";
import { ModalWrapperProps } from "@/app/_common/component/templates/Modal/types";

export default function ModalWrapper({
  children,
  close,
  opacity = 40,
  shouldDisplay = true,
}: Readonly<ModalWrapperProps>) {
  const closeModal = useCallback(
    (event: MouseEvent) => {
      event.stopPropagation();
      if (close != null && event.currentTarget === event.target) {
        close();
      }
    },
    [close],
  );

  useEffect(() => {
    if (shouldDisplay) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "unset";
      };
    }
  }, [shouldDisplay]);

  if (!shouldDisplay) {
    return children;
  }

  return (
    <div
      className={`fixed inset-0 bottom-0 z-50 flex items-center justify-center`}
      style={{
        backgroundColor: `rgba(0, 0, 0, ${opacity / 100})`,
      }}
      onClick={closeModal}
    >
      <div className={"absolute bottom-6 left-1/2 w-[95%] -translate-x-1/2"}>
        {children}
      </div>
    </div>
  );
}
