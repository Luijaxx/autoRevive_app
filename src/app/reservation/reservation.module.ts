import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ReservationRoutingModule } from './reservation-routing.module';
import { ReservationIndexComponent } from './reservation-index/reservation-index.component';
import { ReservationListByManagerComponent } from './reservation-list-by-manager/reservation-list-by-manager.component';
import { ReservationDetailComponent } from './reservation-detail/reservation-detail.component';


@NgModule({
  declarations: [
    ReservationIndexComponent,
    ReservationListByManagerComponent,
    ReservationDetailComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReservationRoutingModule
  ]
})
export class ReservationModule { }
