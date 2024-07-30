// src/components/ModalWrapper.tsx
import React from 'react';
import Modal from 'react-modal';
import './modal.css';

Modal.setAppElement('#root');

interface ModalWrapperProps {
  isOpen: boolean;
  onRequestClose: () => void;
  children: React.ReactNode;
  className?: string;
}

const ModalWrapper: React.FC<ModalWrapperProps> = ({
  isOpen,
  onRequestClose,
  children,
  className,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className={`Modal__Content ${className || ''}`}
      overlayClassName='Modal__Overlay'
      contentLabel='Example Modal'
    >
      <button onClick={onRequestClose} className='Modal__CloseButton'>
        &times;
      </button>
      {children}
    </Modal>
  );
};

export default ModalWrapper;
