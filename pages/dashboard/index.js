import React, { useContext, useState } from "react";
// import { LayoutContext } from "../../layout/context/layoutcontext";
import styles from "./index.module.scss";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import ModalAuth from "../../components/auth/ModalAuth";
import { SessionProvider } from "../../providers/sessioncontext";
import SessionContext from "../../providers/sessioncontext";
import { Tooltip } from "primereact/tooltip";
// import Image from "next/image";
const Dashboard = () => {
  // const { layoutConfig } = useContext(LayoutContext);
  const { session } = useContext(SessionContext);
  // const sessionContext = useContext(SessionContext);
  const [showModalAuth, setShowModalAuth] = useState(false);
  const [actionAuth, setActionAuth] = useState("");

  const indexImagesMock = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const header = (index) => (
    <picture>
      <img alt="Card" src={`/assets/dashboard/${index}.webp`} />
    </picture>
  );
  const titleCard = (
    <h5 className={`font-bold ${styles.titleCard} mb-0`}>
      Noticia sobre atletismo numero uno
    </h5>
  );
  const subtitleCard = (
    <span className="text-muted text-xs">Hace cuanto ocurrió</span>
  );
  const startAuth = (value) => {
    if (value === "login") setActionAuth("login");
    else setActionAuth("register");
    setShowModalAuth(true);
  };
  const titulares = [
    "Hay varios inscritos en el Evento Caminata del Quinche",
    "Cada vez crece más la comunidad ANAME",
    "Los usuario federados ahorran más en sus inscripciones",
    "El evento deporte vida y salud, podria reprogramarse debido a la situación del clima en la ciudad",
    "La carrera de las Iglesias ya tiene mas de 1000 inscritos",
    "Las competencias de saltos entre las más isncritas en los últimos meses",
    "Poca demanda de inscripciones en la carrera atlética Quito 10K",
  ];
  return (
    <SessionProvider>
      <div className="row justify-content-center">
        {!session && (
          <div className={`col-xl-2 ${styles.cardLoginSubscribe}`}>
            <div className="row">
              <div className="col-12">
                <div className={`card p-2 d-block ${styles.cardBorder}`}>
                  <p className="font-bold mb-0 text-uppercase">Eres Miembro?</p>
                  <hr />
                  <Button
                    label="Registrarse"
                    onClick={() => startAuth("subscribe")}
                    className={`${styles.customButton} font-bold px-4 py-2 p-button-raised p-button-sm p-button-rounded white-space-nowrap w-full mb-2`}
                  />
                  <Button
                    label="Entrar"
                    onClick={() => startAuth("login")}
                    className={`${styles.customButton} font-bold px-4 py-2 p-button-sm p-button-text p-button-rounded white-space-nowrap w-full`}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="col-xl-4 col-lg-7 col-md-9 col-sm-12">
          <div className="row">
            {indexImagesMock.map((el, index) => (
              <div className="col-12" key={index}>
                <Card
                  title={titleCard}
                  subTitle={subtitleCard}
                  header={header(index + 1)}
                  pt={{
                    body: {
                      className: `${styles.customCard} ${styles.colorCard}`,
                    },
                  }}
                />
              </div>
            ))}
          </div>
        </div>
        <div className={`col-xl-3 col-lg-4`}>
          <div className="row justify-content-center">
            <div className="col-xl-12 col-lg-10 col-md-9">
              <div className={`card p-2 d-block color ${styles.cardBorder}`}>
                <p className="font-bold mb-0">Titulares</p>
                <hr style={{ margin: ".5rem 0" }} />
                <ul className={`${styles.colorCard}`}>
                  {titulares.map((el, i) => (
                    <div key={i}>
                      <Tooltip target={`.custom-titular-${i}`} />
                      <li
                        className={`custom-titular-${i} ${styles.vinetaTitular}`}
                        data-pr-tooltip={el}
                        data-pr-position="bottom"
                        data-pr-at="left top"
                        data-pr-my="left"
                      >
                        {el}
                      </li>
                    </div>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ModalAuth
        // sessionContext={sessionContext}
        action={actionAuth !== "" && actionAuth}
        visible={showModalAuth}
        setVisible={setShowModalAuth}
      />
    </SessionProvider>
  );
};

export default Dashboard;
