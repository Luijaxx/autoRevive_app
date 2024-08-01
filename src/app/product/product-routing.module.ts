import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductIndexComponent } from './product-index/product-index.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ProductAllComponent } from './product-all/product-all.component';
import { ProductFormComponent } from './product-form/product-form.component';


const routes: Routes = [
  {path: 'product/create', component: ProductFormComponent},
  {path:'product/update/:id', component: ProductFormComponent},


  {path: 'product/:id', component: ProductDetailComponent},
  {path:'product-table',component: ProductAllComponent},



  {path:'product', component: ProductIndexComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule { }
