import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReservationListByManagerComponent } from './reservation-list-by-manager/reservation-list-by-manager.component';
import { ReservationDetailComponent } from './reservation-detail/reservation-detail.component';
import { ReservationListByManagerFilteredComponent } from './reservation-list-by-manager-filtered/reservation-list-by-manager-filtered.component';
import { ReservationFormComponent } from './reservation-form/reservation-form.component';
import { authGuard } from '../share/auth.guard'; // Verifica esta importación

const routes: Routes = [
  { 
    path: 'reservation/listByManagerFiltered', 
    component: ReservationListByManagerFilteredComponent,
    canActivate: [authGuard],
    data: { roles: ['MANAGER','ADMIN','CLIENT'] }
  },
  { path: 'reservation/listByManager', component: ReservationListByManagerComponent ,
    canActivate: [authGuard],
    data: { roles: ['MANAGER','ADMIN','CLIENT'] }
  },
  { path: 'reservation/create/:id', component: ReservationFormComponent,
    canActivate: [authGuard],
    data: { roles: ['MANAGER','ADMIN','CLIENT'] }
  },
  {path: 'reservation/update/:id', component: ReservationFormComponent,
    canActivate: [authGuard],
    data: { roles: ['MANAGER'] }},
  { path: 'reservation/:id', component: ReservationDetailComponent ,
    canActivate: [authGuard],
    data: { roles: ['MANAGER','ADMIN','CLIENT'] }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReservationRoutingModule { }
