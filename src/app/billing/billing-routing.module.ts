import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BillingListByManagerComponent } from './billing-list-by-manager/billing-list-by-manager.component';
import { BillingDetailComponent } from './billing-detail/billing-detail.component';

import { BillingIndexComponent } from './billing-index/billing-index.component';

import { BillingListByManagerFilteredComponent } from './billing-list-by-manager-filtered/billing-list-by-manager-filtered.component';
import { authGuard } from '../share/auth.guard';


const routes: Routes = [
  {path: 'invoice/listByManagerFiltered', component: BillingListByManagerFilteredComponent,
    canActivate: [authGuard],
    data: { roles: ['MANAGER','CLIENT'] }},
  {path: 'invoice', component: BillingIndexComponent,
    canActivate: [authGuard],
    data: { roles: ['MANAGER','CLIENT'] }},

  {path: 'invoice/listByManager/:id', component: BillingListByManagerComponent,
    canActivate: [authGuard],
    data: { roles: ['MANAGER','CLIENT'] }},
  {path: 'invoice/:id', component: BillingDetailComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BillingRoutingModule { }
