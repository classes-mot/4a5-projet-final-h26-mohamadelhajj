import { createPortal } from "react-dom";
import "./ModalSignup.css";

function ModalSignup({ onClose, onConfirm, onInputChange, values }) {
  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <h2>Créer Un compte</h2>
        </header>

        <div className="modal-body">
          <input
            name="name"
            type="text"
            placeholder="Nom complet"
            value={values.name}
            onChange={onInputChange}
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={values.email}
            onChange={onInputChange}
          />
          <input
            name="password"
            type="password"
            placeholder="Mot de passe"
            value={values.password}
            onChange={onInputChange}
          />
        </div>

        <footer className="modal-footer">
          <button className="btn-secondary" onClick={onConfirm}>
            Créer le compte
          </button>
          <button className="btn-danger" onClick={onClose}>
            Annuler
          </button>
        </footer>
      </div>
    </div>,
    document.getElementById("modal-signup"),
  );
}

export default ModalSignup;
