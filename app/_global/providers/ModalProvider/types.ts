import {
  Attributes,
  FunctionComponent,
  MutableRefObject,
  ReactNode,
} from "react";

// ModalDetail
export interface ModalDetail {
  id: string;
  component: FunctionComponent<any>;
  props: Attributes & Record<string, unknown>;
  resolve: (param?: any) => any;
  reject: () => void;
  reset?: () => void;
  rect?: {
    top?: number;
    left?: number;
    width?: number;
    height?: number;
  };
}

// Store and Context API
export type ModalStore = {
  modals: MutableRefObject<ModalDetail[]>;
  setModalList: (modalList: ModalDetail[]) => void;
};

// Provider
export interface ModalProviderProps {
  children: ReactNode;
}

// Modal Utils
export type CheckModal = (component: FunctionComponent<any>) => boolean;

export type OpenModal = (
  component: FunctionComponent<any>,
  props: Attributes & Record<string, unknown>,
  duplicateCheck?: boolean,
) => Promise<ModalDetail> | void;

export type CloseModal = (modalId: string) => void;

export type ResolveModal = (modal: ModalDetail, shouldClose?: boolean) => void;

/* ModalComponent.tsx */

// ModalComponent
export interface ModalComponentProps {
  modal: ModalDetail;
}

// ComponentContainer
export interface ComponentContainerProps {
  componentType?: FunctionComponent<any>;
  props?: Attributes & DefaultModalChildrenProps;
}

// DefaultModalChildrenProps
export interface DefaultModalChildrenProps {
  close: () => void;
  resolve: (shouldClose?: boolean) => () => void;
}
