import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReservationListByManagerComponent } from './reservation-list-by-manager/reservation-list-by-manager.component';
import { ReservationDetailComponent } from './reservation-detail/reservation-detail.component';
import { ReservationListByManagerFilteredComponent } from './reservation-list-by-manager-filtered/reservation-list-by-manager-filtered.component';

const routes: Routes = [
  {path: 'reservation/listByManager/:id', component: ReservationListByManagerComponent},
  {path: 'reservation/:id', component: ReservationDetailComponent},
  {path: 'reservation/listByManagerFiltered/:id', component: ReservationListByManagerFilteredComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReservationRoutingModule { }
