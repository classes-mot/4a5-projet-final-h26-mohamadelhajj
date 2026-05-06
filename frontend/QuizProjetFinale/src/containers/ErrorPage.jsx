import { useTranslation } from "react-i18next";
import MainNavigation from "../components/Navigation/MainNavigation";

const ErrorPage = (props) => {
  const { t } = useTranslation();
  return (
    <>
      <MainNavigation />
      <main>
        <h1>{t("ErrorPage.title")}</h1>
        <p>{t("ErrorPage.text")}</p>
      </main>
    </>
  );
};

export default ErrorPage;
