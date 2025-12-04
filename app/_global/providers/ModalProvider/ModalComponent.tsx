import { createElement } from "react";
import { createPortal } from "react-dom";
import { useModalStore } from ".";
import { ComponentContainerProps, ModalComponentProps } from "./types";

export default function ModalComponent({ modal }: ModalComponentProps) {
  const { closeModal, resolveModal } = useModalStore();

  const close = () => {
    closeModal(modal.id);
  };

  const resolve = (shouldClose?: boolean) => () => {
    resolveModal(modal, shouldClose);
  };

  return (
    <ComponentContainer
      componentType={modal.component}
      props={{
        ...modal.props,
        close,
        resolve,
      }}
    />
  );
}

function ComponentContainer({ componentType, props }: ComponentContainerProps) {
  const modalRoot = document?.querySelector("#modal-root");
  if (componentType == null || modalRoot == null) {
    return null;
  }

  const componentElement = createElement(componentType, props);

  return createPortal(componentElement, modalRoot);
}
