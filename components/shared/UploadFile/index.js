import React, { useEffect, useRef, useState } from 'react';
import { FileUpload } from 'primereact/fileupload';

const UploadFile = ({ onUpload }) => {
  const fileUploadRef = useRef(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  /* useEffect(() => {
    console.log('fileUploadRef', fileUploadRef);
  }, [fileUploadRef.current]); */
  const handleUpload = (event) => {
    setSelectedFiles(event.files);
    const files = event.files;
    onUpload(files);
    fileUploadRef.current.clear();
  };
  return (
    <div>
      <FileUpload
        ref={fileUploadRef}
        multiple
        accept="image/*"
        maxFileSize={1000000}
        customUpload
        uploadHandler={handleUpload}
        chooseOptions={{
          label: 'Seleccionar',
          icon: 'pi pi-plus',
          className: 'button-fileUploader p-button-raised p-button-sm',
        }}
        uploadOptions={{
          label: 'Subir',
          icon: 'pi pi-upload',
          className: 'p-button-raised p-button-sm p-button-secondary',
        }}
        cancelOptions={{
          label: 'Cancelar',
          icon: 'pi pi-ban',
          className: 'p-button-raised p-button-sm p-button-danger',
        }}
        emptyTemplate={<p className="m-0">Arrastra y suelta las imagenes</p>}
      />
    </div>
  );
};


export default UploadFile;
