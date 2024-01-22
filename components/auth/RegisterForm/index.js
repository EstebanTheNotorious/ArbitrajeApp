import React, { useEffect, useState, useContext } from "react";
import styles from "./index.module.scss";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { Controller, useForm } from "react-hook-form";
import { classNames } from "primereact/utils";
import { requestAPI } from "../../../utils/axios/axios";
const RegisterForm = ({ change, hide }) => {
  const [showPass, setShowPass] = useState(false);
  const [showRepeatPass, setShowRepeatPass] = useState(false);
  const [msgEmailRegistered, setMsgEmailRegistered] = useState('');
  // const [formData, setFormData] = useState({});
  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
    watch,
  } = useForm();
  const pass = watch("password", "");

  const onSubmitRegister = async (data) => {
    delete data.repeatPass;
    if (data.Notifications !== true) data.AcceptNotification = 1;
    else data.AcceptNotification = 2;
    delete data.Notifications;
    // data.countryId = 1,
    // data.provinceId = 1,
    data.genderId = 3,
    data.teamId = 1,
    data.state = 1,
    data.rolId = 3
    
    // console.log('data a enviar', data)
    // setFormData(data);
    // console.log('data register', data);
    await requestAPI("User/CreateUser", data, "post")
      .then((res) => {
        // console.log('res api register user', res);
        setMsgEmailRegistered("");
        hide(true);
        reset();
      })
      .catch((err) => {
        console.error("[*] ========= [*] ERROR Register User", err);
        // setMsgErrorLogin(err.response.data)
      });
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
      <form onSubmit={handleSubmit(onSubmitRegister)}>
        <div className="field mb-1">
          <Controller
            name="firstName"
            defaultValue={""}
            control={control}
            rules={{ required: "Campo requerido." }}
            render={({ field, fieldState }) => (
              <InputText
                {...field}
                placeholder="Nombre"
                className={classNames(
                  `${styles.inputModalAuth} borderRadiusInputControl heightInputControl w-full`,
                  { "p-invalid": fieldState.invalid }
                )}
              />
            )}
          />
          {getFormErrorMessage("firstName")}
        </div>
        <div className="field mb-1">
          <Controller
            name="lastName"
            defaultValue={""}
            control={control}
            rules={{ required: "Campo requerido." }}
            render={({ field, fieldState }) => (
              <InputText
                {...field}
                placeholder="Apellido"
                className={classNames(
                  `${styles.inputModalAuth} borderRadiusInputControl heightInputControl w-full`,
                  { "p-invalid": fieldState.invalid }
                )}
              />
            )}
          />
          {getFormErrorMessage("lastName")}
        </div>
        <div className="field mb-1">
          <span className="p-input-icon-right w-full">
            {<i className="pi pi-envelope" />}
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
                    {
                      "p-invalid": fieldState.invalid,
                    }
                  )}
                />
              )}
            />
          </span>
          {getFormErrorMessage("email")}
        </div>
        <div className="field mb-1">
          <Controller
            name="password"
            defaultValue={""}
            control={control}
            rules={{
              required: "Campo requerido.",
              minLength: {
                value: 8,
                message: "La contraseña debe tener al menos 8 caracteres",
              },
            }}
            render={({ field, fieldState }) => (
              <span className="p-input-icon-right w-full">
                <i
                  className={`pi pi-${!showPass ? "eye" : "eye-slash"}`}
                  onClick={(e) => setShowPass(!showPass)}
                />
                <InputText
                  {...field}
                  type={`${!showPass ? "password" : "text"}`}
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
        <div className="field">
          <Controller
            name="repeatPass"
            defaultValue={""}
            control={control}
            rules={{
              required: "Campo requerido.",
              validate: (value) =>
                value === pass || "Las contraseñas no coinciden.",
            }}
            render={({ field, fieldState }) => (
              <span className="p-input-icon-right w-full">
                <i
                  className={`pi pi-${!showRepeatPass ? "eye" : "eye-slash"}`}
                  onClick={(e) => setShowRepeatPass(!showRepeatPass)}
                />
                <InputText
                  {...field}
                  type={`${!showRepeatPass ? "password" : "text"}`}
                  placeholder="Repetir Contrasena"
                  className={classNames(
                    `${styles.inputModalAuth} borderRadiusInputControl heightInputControl w-full mb-1`,
                    { "p-invalid": fieldState.invalid }
                  )}
                />
              </span>
            )}
          />
          {getFormErrorMessage("repeatPass")}
        </div>
        <hr />
        <div className="d-flex align-items-center justify-content-around">
          <Controller
            name="Notifications"
            control={control}
            // rules={{ required: true }}
            render={({ field, fieldState }) => (
              <Checkbox
                inputId={field.name}
                onChange={(e) => field.onChange(e.checked)}
                checked={field.value}
                className={fieldState.invalid && "p-invalid"}
              />
            )}
          />
          <label
            htmlFor="acceptTermsConditions"
            className={classNames("text-xs text-justify ml-3", {
              "p-error": errors.accept,
            })}
          >
            Quiero recibir información ocasional sobre competencias y mis
            disciplinas atleticas favoritas.
          </label>
        </div>
        <hr />
        <div className="d-flex justify-content-center">
          <small className="text-xs text-justify">
            Al crear una cuenta, acepto los{" "}
            <span className="text-primary">Términos de uso</span> y declaro que
            leí la <span className="text-primary">Política de privacidad</span>.
          </small>
        </div>
        <hr />
        {
          msgEmailRegistered !== '' && <p className="justify-content-center text-danger text-xs">{msgEmailRegistered}</p>
        }
        <Button
          label="Registrarse"
          type="submit"
          className={`${styles.customButton} font-bold px-4 py-2 mb-2 p-button-sm p-button-rounded white-space-nowrap w-full`}
        />
        <Button
          label="Ya tengo una cuenta"
          type="button"
          onClick={sendAction}
          className={`${styles.customButton} font-bold px-4 py-2 p-button-sm p-button-text p-button-rounded white-space-nowrap w-full`}
        />
      </form>
    </div>
  );
};

export default RegisterForm;
