import { Dialog } from "primereact/dialog";
import LoginForm from "../LoginForm";
import RegisterForm from "../RegisterForm";
import styles from "./index.module.scss";
import { useContext, useEffect, useState } from "react";
import SessionContext from "../../../providers/sessioncontext";
const ModalAuth = ({ action, visible, setVisible }) => {
  const { verifySessionToken } = useContext(SessionContext);
  const [form, setForm] = useState("");
  useEffect(() => {
    if (visible) setForm(action);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);
  const headerModalAuth = () => (
    <div className={styles.headerModalAuth}>
      <picture>
        <img
          // src="/layout/images/aname-logo-footer.svg"
          src="/layout/images/logo.svg"
          alt="LOGO ANAME"
          height="50"
        />
      </picture>
      {/* <div className="m-3"></div> */}
    </div>
  );
  return (
    <Dialog
      header={headerModalAuth}
      visible={visible}
      position="top"
      className={`${styles.widthModalAuth}`}
      pt={{
        root: { className: "modalAuth" },
        header: { className: "headerModalAuth" },
        headerTitle: { className: "headerTitleModalAuth" },
        headerIcons: { className: "headerIconsModalAuth" },
        closeButton: { className: "buttonCloseModalAuth" },
        content: { className: "contentModalAuth backgroundModalAuth" },
      }}
      // dismissableMask={true}
      blockScroll={true}
      draggable={false}
      onHide={() => setVisible(false)}
    >
      {form === "login" ? (
        <LoginForm
          change={(e) => setForm("register")}
          hide={(e) => setVisible(false)}
          verifySessionToken={verifySessionToken}
        />
      ) : (
        <RegisterForm
          change={(e) => setForm("login")}
          hide={(e) => setVisible(false)}
        />
      )}
    </Dialog>
  );
};
export default ModalAuth;
