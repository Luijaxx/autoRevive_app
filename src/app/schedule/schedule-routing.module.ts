import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScheduleIndexComponent } from './schedule-index/schedule-index.component';
import { ScheduleFormComponent } from './schedule-form/schedule-form.component';
import { ScheduleDetailComponent } from './schedule-detail/schedule-detail.component';

const routes: Routes = [

  {path: 'schedule', component: ScheduleIndexComponent},
  {path: 'schedule/create', component: ScheduleFormComponent},
  {path: 'schedule/update/:id', component: ScheduleFormComponent},
  {
    path:'schedule/:id',component: ScheduleDetailComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScheduleRoutingModule { }
