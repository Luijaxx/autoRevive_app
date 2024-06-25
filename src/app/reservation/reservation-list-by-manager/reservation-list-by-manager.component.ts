import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { GenericService } from '../../share/generic.service';
import { Router } from '@angular/router';
import { animate, state, style, transition, trigger } from '@angular/animations';

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

  constructor(private gService: GenericService,private router: Router) {
    this.managerId =2;
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