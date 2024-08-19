import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';

import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MatCardModule } from '@angular/material/card';
import { NgxEchartsModule } from 'ngx-echarts';
import * as echarts from 'echarts';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { DashboardSalesComponent } from './dashboard-sales/dashboard-sales.component';

@NgModule({
  declarations: [
    DashboardSalesComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    NgxChartsModule,
    NgxEchartsModule.forRoot({
      echarts,
    })
  ]
})
export class DashboardModule { }
