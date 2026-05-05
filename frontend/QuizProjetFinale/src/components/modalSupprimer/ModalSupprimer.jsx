import { createPortal } from "react-dom";
import "./ModalSupprimer.css";

function ModalSupprimer({ onClose, onConfirm }) {
  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <h2>Confirm deletion</h2>
        </header>

        <div className="modal-body">
          <p>
            Do you really want to delete this quiz? This action is irreversible.
          </p>
        </div>

        <footer className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Annuler
          </button>
          <button className="btn-danger" onClick={onConfirm}>
            Confirm deletion
          </button>
        </footer>
      </div>
    </div>,
    document.getElementById("modal-delete"),
  );
}

export default ModalSupprimer;
