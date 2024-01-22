import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRightToBracket,
  faRightFromBracket,
  faEllipsis,
  faPeopleGroup,
  faPersonRunning,
  faUser,
  faToolbox,
  faPeopleRoof
} from "@fortawesome/free-solid-svg-icons";
export const TopBarData = [
    {
        label: 'Usuarios',
        code: 'USUARIOS',
        to: '/administrador/usuarios',
        icon: <FontAwesomeIcon icon={faPeopleGroup} />
    },
    {
        label: 'Atletas',
        code: 'ATLETAS',
        to: '/administrador/atletas',
        icon: <FontAwesomeIcon icon={faPersonRunning} />
    },
    {
        label: 'Perfil de Usuario',
        code: 'PERFIL-USUARIO',
        to: '/administrador/atletas',
        icon: <FontAwesomeIcon icon={faUser} />
    }
];
export const TopBarUserOptionData = [
    {
        label: 'Administrar',
        code: 'ADMINISTRAR',
        to: '/gestion/administrar',
    },
    {
        label: 'Gestión de Usuario',
        code: 'GESTIONUSUARIO',
        to: '/gestion/usuario',
    },
];
