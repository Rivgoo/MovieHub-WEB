import React, { useEffect } from 'react';
import './ConfirmModal.css';

interface ConfirmModalProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ message, onConfirm, onCancel }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal">
        <button className="modal-close" onClick={onCancel}>×</button>
        <p>{message}</p>
        <div className="modal-actions">
          <button onClick={onConfirm}>Так</button>
          <button onClick={onCancel}>Ні</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;