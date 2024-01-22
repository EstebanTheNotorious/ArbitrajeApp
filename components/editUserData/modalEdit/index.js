import { useEffect, useMemo, useState, useContext } from "react";
import { Dialog } from "primereact/dialog";
import styles from "./index.module.scss";
import { Controller, useForm } from "react-hook-form";
import { classNames } from "primereact/utils";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import ReactPhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { SelectButton } from "primereact/selectbutton";
import { Calendar } from "primereact/calendar";
import "../../../utils/constants/constants";
import moment from "moment";
import countryList from "react-select-country-list";
import { Dropdown } from "primereact/dropdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAddressCard,
  faCity,
  faTreeCity,
  faLocationDot,
  faAddressBook,
  faFaceSmile,
  faFile,
} from "@fortawesome/free-solid-svg-icons";
import { categoriasDocumentos } from "../../../utils/constants/constants";
import { RadioButton } from "primereact/radiobutton";
import { FileUpload } from "primereact/fileupload";
import { requestValdationToken } from "../../../utils/axios/axios";
import SessionContext from "../../../providers/sessioncontext";
const ModalEdit = ({ visible, setVisible }) => {
  // const [showPass, setShowPass] = useState(false);
  const { session, verifySessionToken } = useContext(SessionContext);
  const countries = useMemo(() => countryList().getData(), []);
  useEffect(() => {
    verifySessionToken();
    // reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (visible) loadDataUserRegistered(localStorage.getItem("email"));
    // reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);
  const headerModalEdit = () => (
    <div className={styles.headerModalEdit}>
      <picture>
        <img
          // src="/layout/images/aname-logo-footer.svg"
          src="/layout/images/AnameLogo_png.svg"
          alt="LOGO ANAME"
          height="75"
        />
      </picture>
      <h5>Actualizar Cuenta</h5>
    </div>
  );
  // const [formData, setFormData] = useState({});
  const [dataUser, setDataUser] = useState(null);
  const [selectedBirthDate, setSelectedBirthDate] = useState(null);
  // const [fileDoc, setFileDoc] = useState(null);
  // const [fileLoaded, setFileLoaded] = useState(false);
  const genders = [
    { name: "Masculino", value: "1" },
    { name: "Femenino", value: "2" },
  ];
  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue,
    reset,
    watch,
  } = useForm();

  const clearDataAux = () => {
    setSelectedBirthDate(null);
    // setFileDoc(null);
    // setFileLoaded(false);
  };
  const onSubmitEditDataUser = async (data) => {
    // setFormData(data);
    data.rolId = parseInt(localStorage.getItem("rolId"));
    data.state = parseInt(localStorage.getItem("stateUser"));
    data.teamId = parseInt(localStorage.getItem("teamId"));
    data.userCategoryId = parseInt(localStorage.getItem("userCategoryId"));
    data.id = parseInt(localStorage.getItem("idUser"));

    await requestValdationToken(`User/UpdateUser`, data, "put")
      .then((res) => {
        // console.log('user data updated', res);
        setVisible(false);
        reset();
      })
      .catch((err) => {
        console.error("[*] ========= [*] ERROR Update Data User", err);
        // setMsgErrorLogin(err.response.data)
      });
  };
  const existDocumentId = watch("idDocumento");
  const loadDataUserRegistered = async (emailUser) => {
    await requestValdationToken(`User/GetUser/${emailUser}`)
      .then((res) => {
        // console.log("res api user registered", res.data);
        if (res?.data?.statusCode === 200) {
          setDataUser(res.data.result);
          setValue("userName", res.data.result?.userName);
          setValue("country", res.data.result?.country);
          setValue("genderId", res.data.result?.genderId);
          setValue("provice", res.data.result?.provice);
          setValue("city", res.data.result?.city);
          setValue("address", res.data.result?.address);
          setValue("phone", res.data.result?.phone);
          setValue("contact", res.data.result?.contact);
          setValue("contactPhone", res.data.result?.contactPhone);
        }
        // console.log('pais', countries.find(x => x.value === res.data.result.country))
      })
      .catch((err) => {
        console.error("[*] ========= [*] ERROR Load Data User", err);
        // setMsgErrorLogin(err.response.data)
      });
  };
  const getFormErrorMessage = (value) => {
    return (
      errors[value] && (
        <small className="p-error text-xs">{errors[value].message}</small>
      )
    );
  };
  return (
    <>
      {session && (
        <Dialog
          header={headerModalEdit}
          visible={visible}
          position="top"
          className={`${styles.widthModalEdit} ${styles.contentScroll}`}
          pt={{
            root: { className: "modalAuth" },
            header: { className: "headerModalAuth" },
            headerTitle: { className: "headerTitleModalAuth" },
            headerIcons: { className: "headerIconsModalAuth" },
            closeButton: { className: "buttonCloseModalAuth" },
            content: { className: "contentModalAuth" },
          }}
          // dismissableMask={true}
          blockScroll={true}
          draggable={false}
          onHide={() => {
            setVisible(false);
            reset();
            clearDataAux();
          }}
        >
          {dataUser && (
            <div className={`d-block mt-2 ${styles.formContainer}`}>
              <form onSubmit={handleSubmit(onSubmitEditDataUser)}>
                <hr className="m-0" />
                <div className="field mt-2">
                  <span className="p-input-icon-right w-full">
                    <i className="pi pi-envelope" />
                    <Controller
                      name="email"
                      defaultValue={dataUser.email}
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
                          autoFocus={false}
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
                <hr className="m-0" />
                <h6 className="mt-3">Teléfono móvil</h6>
                <div className="field">
                  <Controller
                    name="phone"
                    defaultValue={dataUser.phone || ""}
                    control={control}
                    rules={{ required: "Campo requerido." }}
                    render={({ field: { ref, ...field }, fieldState }) => (
                      <ReactPhoneInput
                        {...field}
                        inputExtraProps={{
                          ref,
                          required: true,
                          autoFocus: true,
                        }}
                        country={"ec"}
                        // onlyCountries={["in"]}
                        countryCodeEditable={false}
                        specialLabel={"Teléfono móvil"}
                        className={
                          fieldState.invalid && "react-tel-input-invalid"
                        }
                      />
                    )}
                  />
                  {getFormErrorMessage("phone")}
                </div>
                <hr className="m-0" />
                <h6 className="mt-3">Nombre en ANAME</h6>
                <div className="field">
                  <span className="p-input-icon-right w-full">
                    <FontAwesomeIcon icon={faFaceSmile} />
                    <Controller
                      name="userName"
                      defaultValue={dataUser.userName}
                      control={control}
                      rules={{ required: "Campo requerido." }}
                      render={({ field, fieldState }) => (
                        <InputText
                          {...field}
                          placeholder="Nickname"
                          className={classNames(
                            `${styles.inputModalAuth} borderRadiusInputControl heightInputControl w-full`,
                            { "p-invalid": fieldState.invalid }
                          )}
                        />
                      )}
                    />
                  </span>
                  {getFormErrorMessage("nick")}
                </div>
                <hr />
                <h6
                  className="mt-3"
                  style={{ color: "var(--secondary-color)" }}
                >
                  Informacion Personal
                </h6>
                <hr className="m-0" />
                {/* <div className={`${!existDocumentId && "field"} mt-2`}>
              <Controller
                name="idDocumento"
                defaultValue={""}
                control={control}
                rules={{ required: "Debes seleccionar el tipo de docuemnto." }}
                render={({ field, fieldState }) => (
                  <div className="flex justify-content-start">
                    <div className="flex-column gap-3">
                      {categoriasDocumentos.map((category) => {
                        return (
                          <div
                            key={category.value}
                            className="flex align-items-center mb-1"
                          >
                            <RadioButton
                              {...field}
                              inputId={category.value}
                              value={category.name}
                              checked={field.value === category.name}
                              className={fieldState.invalid && "p-invalid"}
                            />
                            <label
                              htmlFor={category.key}
                              className="text-xs ml-2"
                            >
                              {category.name}
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              />
              {getFormErrorMessage("idDocumento")}
            </div>

            {existDocumentId && (
              <div className="field mt-1">
                <Controller
                  name="file"
                  defaultValue={null}
                  control={control}
                  rules={{
                    required: "Debes subir el documento en imagen o PDF.",
                  }}
                  render={({ field, fieldState }) => (
                    <FileUpload
                      mode="basic"
                      name="file"
                      chooseOptions={{
                        icon: <FontAwesomeIcon icon={faFile} />,
                        label: "Selecciona un documento",
                        className: `${styles.customFileUploadButton} heightInputControl`,
                      }}
                      accept="image/*, application/pdf"
                      customUpload={true}
                      uploadHandler={(event) => {
                        setFileDoc(event.files[0]);
                        field.onChange(event.files[0]);
                        setFileLoaded(false);
                      }}
                      onSelect={() => setFileLoaded(true)}
                    />
                  )}
                />
                {fileLoaded && (
                  <span
                    className="text-xs"
                    style={{ color: "var(--secondary-color)" }}
                  >
                    Debes dar click en el boton para adjuntar el documento.
                  </span>
                )}
                {!fileDoc && !fileLoaded && getFormErrorMessage("file")}
              </div>
            )} */}

                {/* <div className="field">
              <span className="p-input-icon-right w-full">
                <FontAwesomeIcon icon={faAddressCard} />
                <Controller
                  name="numDocumento"
                  defaultValue={""}
                  control={control}
                  rules={{ required: "Campo requerido." }}
                  render={({ field, fieldState }) => (
                    <InputText
                      {...field}
                      placeholder="Numero de documento"
                      className={classNames(
                        `${styles.inputModalAuth} borderRadiusInputControl heightInputControl w-full`,
                        { "p-invalid": fieldState.invalid }
                      )}
                    />
                  )}
                />
              </span>
              {getFormErrorMessage("numDocumento")}
            </div> */}
                <hr className="m-0" />
                <div className="field mt-3">
                  <Controller
                    name="firstName"
                    defaultValue={dataUser.firstName}
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
                <div className="field">
                  <Controller
                    name="lastName"
                    defaultValue={dataUser.lastName}
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
                <div className="field">
                  <Controller
                    name="birthDate"
                    control={control}
                    defaultValue={moment(dataUser.birthDate).toDate()}
                    rules={{ required: "Campo requerido." }}
                    render={({ field, fieldState }) => (
                      <Calendar
                        {...field}
                        /* inputExtraProps={{
                          ref,
                          required: true,
                          autoFocus: true,
                        }}
                        inputId={field.name}
                        value={field.value}
                        onChange={field.onChange} */
                        onChange={(e) => {
                          setSelectedBirthDate(
                            moment(e.value).format("YYYY-MM-DD")
                          );
                          field.onChange(e.value);
                        }}
                        dateFormat="dd/mm/yy"
                        className={classNames("heightInputControl w-full", {
                          "p-invalid": fieldState.invalid && field.value === "",
                        })}
                        showIcon
                        locale="es"
                        placeholder="Fecha de nacimiento"
                        touchUI
                      />
                    )}
                  />
                  {!selectedBirthDate && getFormErrorMessage("birthDate")}
                </div>
                <div className="field">
                  <Controller
                    name="country"
                    // defaultValue={{...countries.find(x => x.value === dataUser.country)}}
                    // defaultValue={{value: 'EC', label: 'Ecuador'}}
                    control={control}
                    rules={{ required: "Campo requerido." }}
                    render={({ field, fieldState }) => (
                      <Dropdown
                        {...field}
                        options={countries}
                        placeholder="Pais de origen"
                        filter
                        optionValue="value"
                        optionLabel="label"
                        className={classNames(
                          `${styles.inputModalAuth} borderRadiusInputControl heightInputControl w-full`,
                          { "p-invalid": fieldState.invalid }
                        )}
                      />
                    )}
                  />
                  {getFormErrorMessage("country")}
                </div>
                <div className="field">
                  <span className="p-input-icon-right w-full">
                    <FontAwesomeIcon icon={faTreeCity} />
                    <Controller
                      name="provice"
                      defaultValue={dataUser.provice}
                      control={control}
                      rules={{ required: "Campo requerido." }}
                      render={({ field, fieldState }) => (
                        <InputText
                          {...field}
                          placeholder="Provincia"
                          className={classNames(
                            `${styles.inputModalAuth} borderRadiusInputControl heightInputControl w-full`,
                            { "p-invalid": fieldState.invalid }
                          )}
                        />
                      )}
                    />
                  </span>
                  {getFormErrorMessage("provice")}
                </div>
                <div className="field">
                  <span className="p-input-icon-right w-full">
                    <FontAwesomeIcon icon={faCity} />
                    <Controller
                      name="city"
                      defaultValue={dataUser.city || ""}
                      control={control}
                      rules={{ required: "Campo requerido." }}
                      render={({ field, fieldState }) => (
                        <InputText
                          {...field}
                          placeholder="Ciudad"
                          className={classNames(
                            `${styles.inputModalAuth} borderRadiusInputControl heightInputControl w-full`,
                            { "p-invalid": fieldState.invalid }
                          )}
                        />
                      )}
                    />
                  </span>
                  {getFormErrorMessage("city")}
                </div>
                <div className="field">
                  <span className="p-input-icon-right w-full">
                    <FontAwesomeIcon icon={faLocationDot} />
                    <Controller
                      name="address"
                      defaultValue={dataUser.address}
                      control={control}
                      rules={{ required: "Campo requerido." }}
                      render={({ field, fieldState }) => (
                        <InputText
                          {...field}
                          placeholder="Direccion"
                          className={classNames(
                            `${styles.inputModalAuth} borderRadiusInputControl heightInputControl w-full`,
                            { "p-invalid": fieldState.invalid }
                          )}
                        />
                      )}
                    />
                  </span>
                  {getFormErrorMessage("address")}
                </div>
                <span className="text-xs">Genero</span>
                <div className="field">
                  <Controller
                    name="genderId"
                    control={control}
                    rules={{ required: "Seleccionar un género" }}
                    render={({ field, fieldState }) => (
                      <SelectButton
                        {...field}
                        optionLabel="name"
                        options={genders}
                        className="heightInputControl customButtonset mb-1 text-center"
                      />
                    )}
                  />
                  {getFormErrorMessage("genderId")}
                </div>
                <hr />
                <h6
                  className="mt-3"
                  style={{ color: "var(--secondary-color)" }}
                >
                  Informacion de contacto{" "}
                  <span className="text-muted text-xs">(emergencia)</span>
                </h6>
                <div className="field">
                  <span className="p-input-icon-right w-full">
                    <FontAwesomeIcon icon={faAddressBook} />
                    <Controller
                      name="contact"
                      defaultValue={dataUser.contact || ""}
                      control={control}
                      rules={{ required: "Campo requerido." }}
                      render={({ field, fieldState }) => (
                        <InputText
                          {...field}
                          placeholder="Nombre de contacto"
                          className={classNames(
                            `${styles.inputModalAuth} borderRadiusInputControl heightInputControl w-full`,
                            { "p-invalid": fieldState.invalid }
                          )}
                        />
                      )}
                    />
                  </span>
                  {getFormErrorMessage("contact")}
                </div>
                <span className="text-xs">Numero de contacto</span>
                <div className="field">
                  <Controller
                    name="contactPhone"
                    defaultValue={dataUser.contactPhone || ""}
                    control={control}
                    rules={{ required: "Campo requerido." }}
                    render={({ field: { ref, ...field }, fieldState }) => (
                      <ReactPhoneInput
                        {...field}
                        inputExtraProps={{
                          ref,
                          required: true,
                          autoFocus: true,
                        }}
                        country={"ec"}
                        // onlyCountries={["in"]}
                        countryCodeEditable={false}
                        specialLabel={"Teléfono móvil (contacto)"}
                        className={
                          fieldState.invalid && "react-tel-input-invalid"
                        }
                      />
                    )}
                  />
                  {getFormErrorMessage("contactPhone")}
                </div>
                <Button
                  label="Guardar"
                  type="submit"
                  className={`${styles.customButton} font-bold px-4 py-2 mb-2 p-button-sm p-button-rounded white-space-nowrap w-full`}
                />
                <Button
                  label="Eliminar Cuenta"
                  type="button"
                  // onClick={sendAction}
                  className={`${styles.customButton} font-bold px-4 py-2 p-button-sm p-button-danger p-button-rounded white-space-nowrap w-full`}
                />
              </form>
            </div>
          )}
        </Dialog>
      )}
    </>
  );
};
export default ModalEdit;
