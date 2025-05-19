import React, { useEffect } from 'react';
import './ConfirmModal.css';
import { PrimaryButton } from '../../shared/components/Buttons';

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
          <PrimaryButton onClick={onConfirm} sx={{minWidth: '80px'}}>Так</PrimaryButton>
          <PrimaryButton onClick={onCancel} sx={{minWidth: '80px'}}>Ні</PrimaryButton>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;