import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScheduleIndexComponent } from './schedule-index/schedule-index.component';
import { ScheduleFormComponent } from './schedule-form/schedule-form.component';
import { ScheduleDetailComponent } from './schedule-detail/schedule-detail.component';
import { authGuard } from '../share/auth.guard';

const routes: Routes = [

  {path: 'schedule', component: ScheduleIndexComponent,
    canActivate: [authGuard],
    data: { roles: ['ADMIN','MANAGER'] }},
  {path: 'schedule/create', component: ScheduleFormComponent,
    canActivate: [authGuard],
    data: { roles: ['ADMIN','MANAGER'] }},
  {path: 'schedule/update/:id', component: ScheduleFormComponent,
    canActivate: [authGuard],
    data: { roles: ['ADMIN','MANAGER'] }},
  {
    path:'schedule/:id',component: ScheduleDetailComponent,
    canActivate: [authGuard],
    data: { roles: ['ADMIN','MANAGER'] }},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScheduleRoutingModule { }
