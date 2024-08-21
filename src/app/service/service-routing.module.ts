import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ServiceIndexComponent } from './service-index/service-index.component';
import { ServiceAllComponent } from './service-all/service-all.component';
import { ServiceDetailComponent } from './service-detail-form/service-detail-form.component';
import { ServiceFormComponent } from './service-form/service-form.component';
import { authGuard } from '../share/auth.guard';

const routes: Routes = [
  {path:'service',component: ServiceIndexComponent},
  {path:'service-table',component: ServiceAllComponent,
    canActivate: [authGuard],
    data: { roles: ['ADMIN','MANAGER'] }},
  {path:'service/create', component: ServiceFormComponent,
    canActivate: [authGuard],
    data: { roles: ['ADMIN'] }},
  {path:'service/update/:id', component: ServiceFormComponent,
    canActivate: [authGuard],
    data: { roles: ['ADMIN'] }},
  {
    path:'service/detailForm/:id',component: ServiceDetailComponent
  },
  

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServiceRoutingModule { }