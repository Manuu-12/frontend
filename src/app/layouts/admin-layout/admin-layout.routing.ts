import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { IconsComponent } from '../../pages/icons/icons.component';
import { MapsComponent } from '../../pages/maps/maps.component';
import { UserProfileComponent } from '../../pages/user-profile/user-profile.component';
import { TablesComponent } from '../../pages/tables/tables.component';
import { AuthenticatedGuard } from 'src/app/guards/authenticated.guard';
import { LoginComponent } from 'src/app/pages/login/login.component';
import { RegisterComponent } from 'src/app/pages/register/register.component';

export const AdminLayoutRoutes: Routes = [
  { path: 'tablero', component: DashboardComponent },
  { path: 'perfil-usuario', component: UserProfileComponent },
  { path: 'tablas', component: TablesComponent },
  { path: 'iconos', component: IconsComponent },
  { path: 'mapas', component: MapsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  { path: 'facturas', canActivate: [AuthenticatedGuard], loadChildren: () => import('src/app/pages/ms-pages/factura/factura.module').then(m => m.FacturaModule) },
  { path: 'chats', loadChildren: () => import('src/app/pages/ms-pages/chats/chats.module').then(m => m.ChatModule) },
  { path: 'maquina-combos', loadChildren: () => import('src/app/pages/ms-pages/maquinacombo/maquinacombo.module').then(m => m.MaquinaComboModule) },
  { path: 'combos', loadChildren: () => import('src/app/pages/ms-pages/combos/combos.module').then(m => m.CombosModule) },
  { path: 'obra', loadChildren: () => import('src/app/pages/ms-pages/obra/obra.module').then(m => m.ObraModule) },
  { path: 'gobernante-departamento', loadChildren: () => import('src/app/pages/ms-pages/gobernantedepartamento/gobernantedepartamento.module').then(m => m.GobernanteDepartamentoModule) },
  { path: 'evidencias', loadChildren: () => import('src/app/pages/ms-pages/evidencia/evidencia.module').then(m => m.EvidenciaModule) },
  { path: 'gps', loadChildren: () => import('src/app/pages/ms-pages/gps/gps.module').then(m => m.GpsModule) },
  { path: 'seguros', loadChildren: () => import('src/app/pages/ms-pages/seguro/seguro.module').then(m => m.SeguroModule) },
  { path: 'maquinas', loadChildren: () => import('src/app/pages/ms-pages/maquina/maquina.module').then(m => m.MaquinaModule) },
  { path: 'especialidad-maquinarias', loadChildren: () => import('src/app/pages/ms-pages/especialidadmaquinaria/especialidadmaquinaria.module').then(m => m.EspecialidadMaquinariaModule) },
  { path: 'mantenimientos', loadChildren: () => import('src/app/pages/ms-pages/mantenimiento/mantenimiento.module').then(m => m.MantenimientoModule) },
  { path: 'procedimiento-mantenimientos', loadChildren: () => import('src/app/pages/ms-pages/procedimientomantenimiento/procedimientomantenimiento.module').then(m => m.ProcedimientoMantenimientoModule) },
  { path: 'mensajes', loadChildren: () => import('src/app/pages/ms-pages/mensaje/mensaje.module').then(m => m.MensajeModule) },
  { path: 'obra-municipios', loadChildren: () => import('src/app/pages/ms-pages/obramunicipio/obramunicipio.module').then(m => m.ObraMunicipioModule) },
  { path: 'gobernante-municipios', loadChildren: () => import('src/app/pages/ms-pages/gobernantemunicipio/gobernantemunicipio.module').then(m => m.GobernanteMunicipioModule) },
  { path: 'novedades', loadChildren: () => import('src/app/pages/ms-pages/novedad/novedad.module').then(m => m.NovedadModule) },
  { path: 'operario', loadChildren: () => import('src/app/pages/ms-pages/operario/operario.module').then(m => m.OperarioModule) },
  { path: 'polizas', loadChildren: () => import('src/app/pages/ms-pages/poliza/poliza.module').then(m => m.PolizaModule) },
  { path: 'procedimientos', loadChildren: () => import('src/app/pages/ms-pages/procedimiento/procedimiento.module').then(m => m.ProcedimientoModule) },
  { path: 'cuotas', loadChildren: () => import('src/app/pages/ms-pages/cuotas/cuotas.module').then(m => m.CuotasModule) },
  { path: 'gobernantes', loadChildren: () => import('src/app/pages/ms-pages/gobernante/gobernante.module').then(m => m.GobernanteModule) },
  { path: 'servicios', loadChildren: () => import('src/app/pages/ms-pages/servicio/servicio.module').then(m => m.ServicioModule) },
  { path: 'turnos', loadChildren: () => import('src/app/pages/ms-pages/turno/turno.module').then(m => m.TurnoModule) },
  { path: 'especialidad-operarios', loadChildren: () => import('src/app/pages/ms-pages/operarioespecialidad/operarioespecialidad.module').then(m => m.OperarioEspecialidadModule) },
  { path: 'especialidades', loadChildren: () => import('src/app/pages/ms-pages/especialidades/especialidades.module').then(m => m.EspecialidadesModule) },
  { path: 'tiposervicios', loadChildren: () => import('src/app/pages/ms-pages/tiposervicio/tiposervicio.module').then(m => m.TipoServicioModule) },
  { path: 'municipios', loadChildren: () => import('src/app/pages/ms-pages/municipio/municipio.module').then(m => m.MunicipioModule) }
];
