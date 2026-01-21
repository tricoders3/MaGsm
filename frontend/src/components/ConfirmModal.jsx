// src/components/ConfirmModal.jsx
import React from "react";
import { FiAlertTriangle } from "react-icons/fi";

const ConfirmModal = ({
  open,
  loading = false,
  onConfirm,
  onCancel,
}) => {
  if (!open) return null;

  return (
    <div className="confirm-overlay">
      <div className="confirm-modal">
        <div className="confirm-header">
          <div className="confirm-icon danger">
            <FiAlertTriangle size={26} />
          </div>

          <h5>Confirmer la suppression</h5>
          <p>Voulez-vous vraiment supprimer cet élément&nbsp;?</p>
        </div>

        <div className="confirm-actions">
          <button
            className="btn btn-danger confirm-btn"
            onClick={onConfirm}
            disabled={loading}
          >
            Supprimer
          </button>

          <button
            className="btn btn-light cancel-btn"
            onClick={onCancel}
            disabled={loading}
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
