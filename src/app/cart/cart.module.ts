import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CartRoutingModule } from './cart-routing.module';
import { CartIndexComponent } from './cart-index/cart-index.component';
import { CartAllComponent } from './cart-all/cart-all.component';
import { CartItemlistComponent } from './cart-itemlist/cart-itemlist.component';


@NgModule({
  declarations: [
    CartIndexComponent,
    CartAllComponent,
    CartItemlistComponent
  ],
  imports: [
    CommonModule,
    CartRoutingModule
  ]
})
export class CartModule { }
