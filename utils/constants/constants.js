import { addLocale } from 'primereact/api';
import moment from 'moment';
addLocale('es', {
    firstDayOfWeek: 1,
    dayNames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
    dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
    dayNamesMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
    monthNames: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
    monthNamesShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
    today: 'Hoy',
    clear: 'Limpiar'
});

export const categoriasDocumentos = [
  { name: "Cedula", value: "C" },
  { name: "Ruc", value: "R" },
  { name: "Pasaporte", value: "P" },
  { name: "Licencia", value: "L" },
];

export function ordenar(a, b) {
  const nombreA = a.lastName.toUpperCase();
  const nombreB = b.lastName.toUpperCase();

  if (nombreA < nombreB) {
    return -1;
  }
  if (nombreA > nombreB) {
    return 1;
  }
  return 0;
}
export function ordenarFecha(a, b) {
  const nombreA = moment(a.eventStartDate).toDate();
  const nombreB = moment(b.eventStartDate).toDate();

  if (nombreA < nombreB) {
    return 1;
  }
  if (nombreA > nombreB) {
    return -1;
  }
  return 0;
}