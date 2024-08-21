import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BranchDetailComponent } from './branch-detail/branch-detail.component';
import { BranchFormComponent } from './branch-form/branch-form.component';
import { BranchAllComponent } from './branch-all/branch-all.component';
import { BranchIndexComponent } from './branch-index/branch-index.component';
import { authGuard } from '../share/auth.guard';

const routes: Routes = [ {path:'branch',component: BranchIndexComponent},
  {path:'branch-table',component: BranchAllComponent,
    canActivate: [authGuard],
    data: { roles: ['ADMIN','MANAGER'] }},
  {path:'branch/create', component: BranchFormComponent,
    canActivate: [authGuard],
    data: { roles: ['ADMIN'] }},
  {path:'branch/update/:id', component: BranchFormComponent,
    canActivate: [authGuard],
    data: { roles: ['ADMIN'] }},
  {
    path:'branch/:id',component: BranchDetailComponent
  },];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BranchRoutingModule { }
