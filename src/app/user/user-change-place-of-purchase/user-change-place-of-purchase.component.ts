import { Component, inject, OnInit } from '@angular/core';
import { GenericService } from '../../share/generic.service';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../share/authentication.service';
import {
  NotificacionService,
  TipoMessage,
} from '../../share/notification.service';

@Component({
  selector: 'app-user-change-place-of-purchase',
  templateUrl: './user-change-place-of-purchase.component.html',
  styleUrls: ['./user-change-place-of-purchase.component.css'],
})
export class UserChangePlaceOfPurchaseComponent implements OnInit {
  currentUser: any;
  currentBranch: any;
  branches: any[] = [];
  selectedBranchId: any;
  authService: AuthenticationService = inject(AuthenticationService);
  auth: boolean = false;
  constructor(
    private gService: GenericService,
    private router: Router,
    private noti: NotificacionService
  ) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData() {
    // Replace 'user/current' with the correct endpoint to fetch the logged-in user's data
    this.authService.decodeToken.subscribe((user) => (this.currentUser = user));
    this.authService.isAuthenticated.subscribe((valor) => (this.auth = valor));
    if (this.currentUser.role === 'CLIENT') {
      this.loadBranches();
      this.loadCurrentBranch();
    }
  }

  loadBranches() {
    // Replace 'branch' with the correct endpoint to fetch branch data
    this.gService.list('branch').subscribe((branches: any[]) => {
      this.branches = branches;
    });
  }

  loadCurrentBranch() {
    // Replace 'branch' with the correct endpoint to fetch the branch data
    this.gService
      .get('branch', this.currentUser.branchId)
      .subscribe((branch: any) => {
        this.currentBranch = branch;
        this.selectedBranchId = this.currentBranch.id;
      });
  }

  changeBranch() {
    if (
      this.selectedBranchId &&
      parseInt(this.selectedBranchId) !== this.currentUser.branchId
    ) {
      this.currentUser.branchId = parseInt(this.selectedBranchId);
      this.gService
        .update('user', this.currentUser)
        .subscribe((response: any) => {
          // Handle successful branch change
          this.loadCurrentBranch();
          this.noti.mensajeRedirect(
            'Branch updated',
            `Client needs to login again`,
            TipoMessage.info,
            'login'
          );
          this.authService.logout();
        });
    }
  }
}
