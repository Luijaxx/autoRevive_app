import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ReservationRoutingModule } from './reservation-routing.module';
import { ReservationIndexComponent } from './reservation-index/reservation-index.component';
import { ReservationListByManagerComponent } from './reservation-list-by-manager/reservation-list-by-manager.component';
import { ReservationDetailComponent } from './reservation-detail/reservation-detail.component';
import { ReservationListByManagerFilteredComponent } from './reservation-list-by-manager-filtered/reservation-list-by-manager-filtered.component';
import { ReservationFormComponent } from './reservation-form/reservation-form.component';


@NgModule({
  declarations: [
    ReservationIndexComponent,
    ReservationListByManagerComponent,
    ReservationDetailComponent,
    ReservationListByManagerFilteredComponent,
    ReservationFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ReservationRoutingModule
  ]
})
export class ReservationModule { }
