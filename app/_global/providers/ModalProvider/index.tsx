"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import ModalComponent from "./ModalComponent";
import {
  CheckModal,
  CloseModal,
  ModalDetail,
  ModalProviderProps,
  ModalStore,
  OpenModal,
  ResolveModal,
} from "./types";

const ModalStoreContext = createContext<ModalStore | undefined>(undefined);

export const ModalProvider = ({ children }: ModalProviderProps) => {
  const [modalList, setModalList] = useState<ModalDetail[]>([]);
  const displayingModalListRef = useRef<ModalDetail[]>([]);

  const initialValue = useMemo<ModalStore>(
    () => ({
      modals: displayingModalListRef,
      setModalList,
    }),
    [],
  );

  useEffect(() => {
    console.log(modalList);
    displayingModalListRef.current = modalList;
  }, [modalList]);

  return (
    <ModalStoreContext.Provider value={initialValue}>
      {modalList.map((modal) => (
        <ModalComponent key={modal.id} modal={modal} />
      ))}
      {children}
    </ModalStoreContext.Provider>
  );
};

export const useModalStore = () => {
  const modalStoreContext = useContext(ModalStoreContext);

  if (modalStoreContext == null) {
    throw new Error("useModalStore must be used within ModalProvider");
  }

  const { modals, setModalList } = modalStoreContext;

  const checkModal: CheckModal = (component) => {
    return modals.current.some(
      (modal) => modal.component.displayName === component.displayName,
    );
  };

  const openModal: OpenModal = (component, props) => {
    const isDuplicate = checkModal(component);

    if (isDuplicate) {
      return;
    }

    return new Promise((resolve, reject) => {
      const modalDetail: ModalDetail = {
        id: `modal-`,
        component,
        props,
        resolve,
        reject,
      };

      modalDetail.id = `modal-${Math.max(modals.current.length - 1, 0) + 1}`;

      setModalList([...modals.current, modalDetail]);
    });
  };

  const closeModal: CloseModal = (modalId) => {
    setModalList(modals.current.filter((modal) => modal.id !== modalId));
  };

  const resolveModal: ResolveModal = (modal, shouldClose = false) => {
    modal.resolve();

    if (shouldClose) {
      closeModal(modal.id);
    }
  };

  const resetModal = useCallback(() => {
    setModalList([]);
  }, [setModalList]);

  return {
    modals,
    setModalList,
    checkModal,
    openModal,
    closeModal,
    resolveModal,
    resetModal,
  };
};
