import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScheduleRoutingModule } from './schedule-routing.module';
import { ScheduleFormComponent } from './schedule-form/schedule-form.component';
import { ScheduleIndexComponent } from './schedule-index/schedule-index.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from '@syncfusion/ej2-angular-calendars';


@NgModule({
  declarations: [
    ScheduleFormComponent,
    ScheduleIndexComponent
  ],
  imports: [
    CommonModule,
    ScheduleRoutingModule,
    FormsModule,
    ReactiveFormsModule, 
    CalendarModule,
    
  ]
})
export class ScheduleModule { }
