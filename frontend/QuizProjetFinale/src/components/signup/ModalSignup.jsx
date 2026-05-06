import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import "./ModalSignup.css";

function ModalSignup({ onClose, onConfirm, onInputChange, values }) {
  const { t } = useTranslation();
  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <h2>{t("ModalSignup.title")}</h2>
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
            {t("ModalSignup.title")}
          </button>
          <button className="btn-danger" onClick={onClose}>
            {t("ModalSignup.annuler")}
          </button>
        </footer>
      </div>
    </div>,
    document.getElementById("modal-signup"),
  );
}

export default ModalSignup;
