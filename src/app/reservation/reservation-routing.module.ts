import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReservationListByManagerComponent } from './reservation-list-by-manager/reservation-list-by-manager.component';
import { ReservationDetailComponent } from './reservation-detail/reservation-detail.component';
import { ReservationListByManagerFilteredComponent } from './reservation-list-by-manager-filtered/reservation-list-by-manager-filtered.component';
import { ReservationFormComponent } from './reservation-form/reservation-form.component';

const routes: Routes = [
  {path: 'reservation/listByManager', component: ReservationListByManagerComponent},

  {path: 'reservation/listByManagerFiltered', component: ReservationListByManagerFilteredComponent},
  {path: 'reservation/create/:id', component: ReservationFormComponent},
  {path: 'reservation/:id', component: ReservationDetailComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReservationRoutingModule { }
