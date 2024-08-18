import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserIndexComponent } from './user-index/user-index.component';
import { UserRegisterComponent } from './user-register/user-register.component';
import { UserLoginComponent } from './user-login/user-login.component';
import { UserRolChangerByAdminComponent } from './user-rol-changer-by-admin/user-rol-changer-by-admin.component';
import { UserChangePlaceOfPurchaseComponent } from './user-change-place-of-purchase/user-change-place-of-purchase.component';

const routes: Routes = [
  {
    path: 'user',
    component: UserIndexComponent,
    children: [
      { path: 'login', component: UserLoginComponent },
      { path: 'register', component: UserRegisterComponent },
    ],
  },
  { path: 'user/update', component: UserRolChangerByAdminComponent }, 
  { path: 'user/clientBranchChange', component: UserChangePlaceOfPurchaseComponent }, 

];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
