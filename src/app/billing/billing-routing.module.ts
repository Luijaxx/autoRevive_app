import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BillingListByManagerComponent } from './billing-list-by-manager/billing-list-by-manager.component';
import { BillingDetailComponent } from './billing-detail/billing-detail.component';
import { BillingListByManagerFilteredComponent } from './billing-list-by-manager-filtered/billing-list-by-manager-filtered.component';

const routes: Routes = [
  {path: 'invoice/listByManagerFiltered', component: BillingListByManagerFilteredComponent},

  {path: 'invoice/listByManager/:id', component: BillingListByManagerComponent},
  {path: 'invoice/:id', component: BillingDetailComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BillingRoutingModule { }
