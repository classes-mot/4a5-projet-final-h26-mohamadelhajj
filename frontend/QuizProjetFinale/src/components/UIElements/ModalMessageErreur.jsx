import React from "react";
import { useTranslation } from "react-i18next";

const ModalMessageErreur = ({ message, onClose }) => {
  const { t } = useTranslation();
  if (!message) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "20%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "white",
        padding: "20px",
        zIndex: 1000,
      }}
    >
      <h2>Erreur</h2>
      <p>{message}</p>
      <button onClick={onClose}>{t("ModalMessageErreur.fermer")}</button>
    </div>
  );
};

export default ModalMessageErreur;
