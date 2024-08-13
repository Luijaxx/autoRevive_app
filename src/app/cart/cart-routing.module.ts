import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CartAllComponent } from './cart-all/cart-all.component';
import { CartIndexComponent } from './cart-index/cart-index.component';
import { CartItemlistComponent } from './cart-itemlist/cart-itemlist.component';

const routes: Routes = [
  {path:'cart', component: CartIndexComponent},
  {path: 'cart/all/:id', component: CartAllComponent},
  {path: 'cart/items', component: CartItemlistComponent},
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CartRoutingModule { }
