// components/Modal.tsx
import React, { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'success' | 'error';
  message: string;
  autoClose?: boolean;
  autoCloseTime?: number;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  type,
  message,
  autoClose = false,
  autoCloseTime = 3000
}) => {
  useEffect(() => {
    if (autoClose && isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseTime);

      return () => clearTimeout(timer);
    }
  }, [isOpen, autoClose, autoCloseTime, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal__overlay" onClick={onClose}></div>
      <div className={`modal__content modal__content--${type}`}>
        <p className="modal__message">{message}</p>
      </div>
    </div>
  );
};

export default Modal;