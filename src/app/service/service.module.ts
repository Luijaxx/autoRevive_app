import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServiceIndexComponent } from './service-index/service-index.component';
import { ServiceAllComponent } from './service-all/service-all.component';
import { ServiceRoutingModule } from './service-routing.module';
import { ServiceDetailComponent } from './service-detail-form/service-detail-form.component';
import { ServiceFormComponent } from './service-form/service-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ServiceIndexComponent,
    ServiceAllComponent,
    ServiceDetailComponent,
    ServiceFormComponent
  ],
  imports: [
    CommonModule,
    ServiceRoutingModule,
    FormsModule,
    ReactiveFormsModule, //Gestionar Formularios
  ]
})
export class ServiceModule { }
