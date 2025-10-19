import React from 'react';

interface ModalProps {
  title: string;
  message: React.ReactNode;
  onClose: () => void;
  actionLabel?: string;
}

const Modal: React.FC<ModalProps> = ({ title, message, onClose, actionLabel = 'Закрыть' }) => (
  <div className="modal-backdrop" role="dialog" aria-modal="true">
    <div className="modal-card">
      <h2>{title}</h2>
      <p>{message}</p>
      <button className="primary" type="button" onClick={onClose}>
        {actionLabel}
      </button>
    </div>
  </div>
);

export default Modal;
