import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import "./ModalLogin.css";

function ModalLogin({ onClose, onConfirm, onInputChange, values }) {
  const { t } = useTranslation();
  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <h2>{t("ModalLogin.title")}</h2>
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
            {t("ModalLogin.boutonConnexion")}
          </button>
          <button className="btn-danger" onClick={onClose}>
            {t("ModalLogin.boutonAnnuler")}
          </button>
        </footer>
      </div>
    </div>,
    document.getElementById("modal-login"),
  );
}

export default ModalLogin;
