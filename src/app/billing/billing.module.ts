import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BillingRoutingModule } from './billing-routing.module';
import { BillingIndexComponent } from './billing-index/billing-index.component';
import { BillingListByManagerComponent } from './billing-list-by-manager/billing-list-by-manager.component';
import { BillingDetailComponent } from './billing-detail/billing-detail.component';

import { BillingFormComponent } from './billing-form/billing-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BillingListByManagerFilteredComponent } from './billing-list-by-manager-filtered/billing-list-by-manager-filtered.component';



@NgModule({
  declarations: [
    BillingIndexComponent,
    BillingListByManagerComponent,
    BillingDetailComponent,

    BillingFormComponent

    BillingListByManagerFilteredComponent

  ],
  imports: [
    CommonModule,
    FormsModule,
    BillingRoutingModule,
    ReactiveFormsModule,
  ]
})
export class BillingModule { }
