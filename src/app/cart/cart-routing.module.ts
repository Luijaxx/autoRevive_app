import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CartAllComponent } from './cart-all/cart-all.component';
import { CartIndexComponent } from './cart-index/cart-index.component';
import { CartItemlistComponent } from './cart-itemlist/cart-itemlist.component';
import { authGuard } from '../share/auth.guard';

const routes: Routes = [
  {path:'cart', component: CartIndexComponent},
  {path: 'cart/all/:id', component: CartAllComponent},
  {path: 'cart/items', component: CartItemlistComponent,
    canActivate: [authGuard],
    data: { roles: ['CLIENT'] }},
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CartRoutingModule { }
