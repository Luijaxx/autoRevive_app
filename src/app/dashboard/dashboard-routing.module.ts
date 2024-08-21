import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardSalesComponent } from './dashboard-sales/dashboard-sales.component';
import { authGuard } from '../share/auth.guard';

const routes: Routes = [ {
  path:'dashboardSalesComponent',
  component: DashboardSalesComponent,
  canActivate: [authGuard],
  data: { roles: ['MANAGER','ADMIN'] }
},];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
