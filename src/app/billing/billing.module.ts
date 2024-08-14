import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { BillingRoutingModule } from './billing-routing.module';
import { BillingIndexComponent } from './billing-index/billing-index.component';
import { BillingListByManagerComponent } from './billing-list-by-manager/billing-list-by-manager.component';
import { BillingDetailComponent } from './billing-detail/billing-detail.component';
import { BillingListByManagerFilteredComponent } from './billing-list-by-manager-filtered/billing-list-by-manager-filtered.component';


@NgModule({
  declarations: [
    BillingIndexComponent,
    BillingListByManagerComponent,
    BillingDetailComponent,
    BillingListByManagerFilteredComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    BillingRoutingModule,
  ]
})
export class BillingModule { }
