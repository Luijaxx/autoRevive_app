import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { GenericService } from '../../share/generic.service';
import { Router } from '@angular/router';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { AuthenticationService } from '../../share/authentication.service';

@Component({
  selector: 'app-reservation-list-by-manager',
  templateUrl: './reservation-list-by-manager.component.html',
  styleUrl: './reservation-list-by-manager.component.css',
  animations: [
    trigger('fadeIn', [
      state('void', style({
        opacity: 0
      })),
      transition(':enter', [
        animate('500ms ease-in', style({
          opacity: 1
        }))
      ])
    ])
  ]
})
export class ReservationListByManagerComponent implements OnInit, OnDestroy {
  data: any[] = [];
  destroy$: Subject<boolean> = new Subject<boolean>();
  managerId: number | null = null;
  authService: AuthenticationService = inject(AuthenticationService);
  currentUser: any;

  auth: boolean = false;
  constructor(private gService: GenericService,private router: Router) {
    this.authService.decodeToken.subscribe((user) => (this.currentUser = user));
    this.authService.isAuthenticated.subscribe((valor) => (this.auth = valor));
    if(this.currentUser.role == "MANAGER"){
      this.managerId = this.currentUser.id
    }
        this.listByManager();
  }

  ngOnInit(): void {}


  

  listByManager(): void {

    if (this.managerId !== null) {
      this.gService
        .get('reservation/listByManager', this.managerId)
        .pipe(takeUntil(this.destroy$))
        .subscribe((data: any[]) => {
          console.log(data);
          this.data = data;
        });
    }else{
      this.gService
      .get('reservation/getByIdClient', this.currentUser.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any[]) => {
        console.log(data);
        this.data = data;
      });
    }
  }

  detail(id:number){
    this.router.navigate(['/reservation',id])
}

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}