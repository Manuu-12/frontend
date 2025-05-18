import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListTipoServicioComponent } from './list/list.component';
import { ManageComponent } from './manage/manage.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TipoServicioRoutingModule } from './tiposervicio-routing.module';


const routes: Routes = [
  { path: 'list', component: ListTipoServicioComponent },
  { path: 'create', component: ManageComponent },
  { path: 'update/:id', component: ManageComponent },
  { path: 'view/:id', component: ManageComponent },
];

@NgModule({
  declarations:[
    ListTipoServicioComponent,
    ManageComponent

  ],
  imports:[CommonModule, FormsModule, TipoServicioRoutingModule]
})

export class TipoServicioModule {}