import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BranchRoutingModule } from './branch-routing.module';
import { BranchIndexComponent } from './branch-index/branch-index.component';
import { BranchDetailComponent } from './branch-detail/branch-detail.component';
import { BranchAllComponent } from './branch-all/branch-all.component';
import { BranchFormComponent } from './branch-form/branch-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    BranchIndexComponent,
    BranchDetailComponent,
    BranchAllComponent,
    BranchFormComponent
  ],
  imports: [
    CommonModule,
    BranchRoutingModule,
    FormsModule,
    ReactiveFormsModule, //Gestionar Formularios
  ]
})
export class BranchModule { }
