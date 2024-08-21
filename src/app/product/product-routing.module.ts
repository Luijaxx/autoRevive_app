import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductIndexComponent } from './product-index/product-index.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ProductAllComponent } from './product-all/product-all.component';
import { ProductFormComponent } from './product-form/product-form.component';
import { authGuard } from '../share/auth.guard';


const routes: Routes = [
  {path: 'product/create', component: ProductFormComponent,
    canActivate: [authGuard],
    data: { roles: ['ADMIN'] }},
  {path:'product/update/:id', component: ProductFormComponent,
    canActivate: [authGuard],
    data: { roles: ['ADMIN'] }},


  {path: 'product/:id', component: ProductDetailComponent},
  {path:'product-table',component: ProductAllComponent,
    canActivate: [authGuard],
    data: { roles: ['ADMIN','MANAGER'] }},



  {path:'product', component: ProductIndexComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule { }
