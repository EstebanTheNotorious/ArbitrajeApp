import { defineAbility } from '@casl/ability';
export default defineAbility((can, cannot) => {
  // ADMINISTRADOR GENERAL
  can('USUARIOS', '1');
  can('ATLETAS', '1');
  can('PERFIL-USUARIO', '1');
  can('ADMINISTRAR', '1');
  // ADMINISTRADOR GENERAL
  
  // ADMINISTRADOR PROVINCIAL
  can('USUARIOS', '2');
  can('ATLETAS', '2');
  can('PERFIL-USUARIO', '2');
  can('ADMINISTRAR', '2');
  // ADMINISTRADOR PROVINCIAL

  // DEPORTISTA
  can('PERFIL-USUARIO', '3');
  can('GESTIONUSUARIO', '3');
  // DEPORTISTA 
});
