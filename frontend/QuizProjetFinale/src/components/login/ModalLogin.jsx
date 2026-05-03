import { createPortal } from "react-dom";
import "./ModalLogin.css";

function ModalLogin({ onClose, onConfirm, onInputChange, values }) {
  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <h2>Connexion</h2>
        </header>

        <div className="modal-body">
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
            Se connecter
          </button>
          <button className="btn-danger" onClick={onClose}>
            Annuler
          </button>
        </footer>
      </div>
    </div>,
    document.getElementById("modal-login"),
  );
}

export default ModalLogin;
