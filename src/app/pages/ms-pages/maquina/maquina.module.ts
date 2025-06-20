import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ListMaquinaComponent } from './list/list.component';
import { ManageComponent } from './manage/manage.component';
import { MaquinaRoutingModule } from './maquina-routing.module';




@NgModule({
  declarations: [
    ListMaquinaComponent,
    ManageComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MaquinaRoutingModule,
    ReactiveFormsModule
  ]
})
export class MaquinaModule {}