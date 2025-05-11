import React from "react";
import "./AdminActions.css";

type AdminActionsProps = {
  onEdit: () => void;
  onDelete: () => void;
};

const AdminActions: React.FC<AdminActionsProps> = ({ onEdit, onDelete }) => {
  return (
    <div className="actions">
      <div className="btn-wrapper">
        <button className="edit-btn" onClick={onEdit}></button>
      </div>
      <div className="btn-wrapper">
        <button className="delete-btn" onClick={onDelete}></button>
      </div>
    </div>
  );
};

export default AdminActions;