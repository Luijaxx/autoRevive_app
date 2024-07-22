import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScheduleIndexComponent } from './schedule-index/schedule-index.component';
import { ScheduleFormComponent } from './schedule-form/schedule-form.component';

const routes: Routes = [

  {path: 'schedule', component: ScheduleIndexComponent},
  {path: 'schedule/create', component: ScheduleFormComponent},
  {path: 'schedule/update/:id', component: ScheduleFormComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScheduleRoutingModule { }
