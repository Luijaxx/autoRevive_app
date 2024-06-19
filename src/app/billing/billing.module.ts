import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { BillingRoutingModule } from './billing-routing.module';
import { BillingIndexComponent } from './billing-index/billing-index.component';
import { BillingListByManagerComponent } from './billing-list-by-manager/billing-list-by-manager.component';
import { BillingDetailComponent } from './billing-detail/billing-detail.component';


@NgModule({
  declarations: [
    BillingIndexComponent,
    BillingListByManagerComponent,
    BillingDetailComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    BillingRoutingModule,
  ]
})
export class BillingModule { }
