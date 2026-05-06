import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import "./ModalSupprimer.css";

function ModalSupprimer({ onClose, onConfirm }) {
  const { t } = useTranslation();
  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <h2>{t("ModalSupprimer.title")}</h2>
        </header>

        <div className="modal-body">
          <p>{t("ModalSupprimer.demandeSup")}</p>
        </div>

        <footer className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            {t("ModalSupprimer.boutonAnnuler")}
          </button>
          <button className="btn-danger" onClick={onConfirm}>
            {t("ModalSupprimer.title")}
          </button>
        </footer>
      </div>
    </div>,
    document.getElementById("modal-delete"),
  );
}

export default ModalSupprimer;
