import { ReactNode } from "react";
import { DefaultModalChildrenProps } from "@/app/_global/providers/ModalProvider/types";

export interface AlarmModalProps extends DefaultModalChildrenProps {
  isAlarmSet: boolean;
  isWatching: boolean;
  corpName: string;
  stockCode: string;
}

// TODO: Substitute
export interface ModalWrapperProps
  extends Omit<DefaultModalChildrenProps, "resolve"> {
  children: ReactNode;
  opacity?: number;
  shouldDisplay?: boolean;
}

export interface WatchingModalProps extends DefaultModalChildrenProps {
  isWatching: boolean;
  stockCode: string;
}
