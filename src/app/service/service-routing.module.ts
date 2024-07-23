import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ServiceIndexComponent } from './service-index/service-index.component';
import { ServiceAllComponent } from './service-all/service-all.component';
import { ServiceDetailComponent } from './service-detail-form/service-detail-form.component';
import { ServiceFormComponent } from './service-form/service-form.component';

const routes: Routes = [
  {path:'service',component: ServiceIndexComponent},
  {path:'service-table',component: ServiceAllComponent},
  {path:'service/create', component: ServiceFormComponent},
  {path:'service/update/:id', component: ServiceFormComponent},
  {
    path:'service/detailForm/:id',component: ServiceDetailComponent
  },
  

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServiceRoutingModule { }