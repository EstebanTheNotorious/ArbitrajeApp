import React, { useEffect, useState, useContext } from "react";
import styles from "./index.module.scss";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Controller, useForm } from "react-hook-form";
import { classNames } from "primereact/utils";
import { BubbleContext } from "../../../providers/bubblecontext";
import { requestAPI } from "../../../utils/axios/axios";
const LoginForm = ({ change, hide, verifySessionToken }) => {
  const { setShowBubbleProfile } = useContext(BubbleContext);
  const [showPassLogin, setShowPassLogin] = useState(false);
  const [msgErrorLogin, setMsgErrorLogin] = useState('');
  const [formData, setFormData] = useState({});
  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();

  const onSubmitLogin = async (data) => {
    // setFormData(data);
    // console.log("Logueando usuario...", data);
    await requestAPI('User/Login', data, 'post').then(res => {
      // console.log('user logueado', res);
      setMsgErrorLogin('')
      hide(true);
      localStorage.setItem("token", res.data.result.token);
      localStorage.setItem("user", res.data.result.firstName.toUpperCase() + ' ' + res.data.result.lastName.toUpperCase());
      localStorage.setItem("email", res.data.result.email);
      localStorage.setItem("numSession", res.data.result.numSession);
      localStorage.setItem("idUser", res.data.result.id);
      localStorage.setItem("rolId", res.data.result.rolId)
      localStorage.setItem("stateUser", res.data.result.state);
      localStorage.setItem("teamId", res.data.result.teamId);
      localStorage.setItem("userCategoryId", res.data.result.userCategoryiD);
      window.dispatchEvent(new Event('storage'));
      // setSession(localStorage.getItem('token'));
      // setVerify(true);
      verifySessionToken();
      // console.log("Logueando usuario...", localStorage.getItem('rolId'));
      // console.log("Logueando usuario...", Number(localStorage.getItem('rolId')));
      if (res?.data?.result?.numSession === 1) setShowBubbleProfile(true);
      reset();
    }).catch(err => {
      console.error('[*] ========= [*] ERROR Login', err);
      // setMsgErrorLogin(err.response.data)
    })
  };

  useEffect(() => {
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const getFormErrorMessage = (value) => {
    return (
      errors[value] && (
        <small className="p-error text-xs">{errors[value].message}</small>
      )
    );
  };
  const sendAction = () => change(true);
  return (
    <div className="d-block mt-2">
      <form onSubmit={handleSubmit(onSubmitLogin)}>
        <div className="field mb-1">
          <span className="p-input-icon-right w-full">
            <i className="pi pi-envelope" />
            <Controller
              name="email"
              defaultValue={""}
              control={control}
              rules={{
                required: "El correo es requerido.",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                  message: "Correo invalido. Ej: usuario@email.com",
                },
              }}
              render={({ field, fieldState }) => (
                <InputText
                  {...field}
                  placeholder="Correo electronico"
                  className={classNames(
                    `${styles.inputModalAuth} borderRadiusInputControl heightInputControl w-full`,
                    { "p-invalid": fieldState.invalid }
                  )}
                />
              )}
            />
          </span>
          {getFormErrorMessage("email")}
        </div>
        <div className="field">
          <Controller
            name="password"
            defaultValue={""}
            control={control}
            rules={{ required: "Campo requerido." }}
            render={({ field, fieldState }) => (
              <span className="p-input-icon-right w-full">
                <i
                  className={`pi pi-${!showPassLogin ? "eye" : "eye-slash"}`}
                  onClick={(e) => setShowPassLogin(!showPassLogin)}
                />
                <InputText
                  {...field}
                  type={`${!showPassLogin ? "password" : "text"}`}
                  placeholder="Contrasena"
                  className={classNames(
                    `${styles.inputModalAuth} borderRadiusInputControl heightInputControl w-full mb-1`,
                    { "p-invalid": fieldState.invalid }
                  )}
                />
              </span>
            )}
          />
          {getFormErrorMessage("password")}
        </div>
        {
          msgErrorLogin !== '' && <p className="justify-content-center text-danger text-xs">{msgErrorLogin}</p>
        }
        <Button
          label="Entrar"
          type="submit"
          className={`${styles.customButton} font-bold px-4 py-2 mb-2 p-button-sm p-button-rounded white-space-nowrap w-full`}
        />
        <Button
          label="Crear una Cuenta"
          type="button"
          onClick={sendAction}
          className={`${styles.customButton} font-bold px-4 py-2 p-button-sm p-button-text p-button-rounded white-space-nowrap w-full`}
        />
      </form>
    </div>
  );
};

export default LoginForm;
