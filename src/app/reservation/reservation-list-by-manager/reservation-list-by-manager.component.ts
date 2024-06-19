import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { GenericService } from '../../share/generic.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reservation-list-by-manager',
  templateUrl: './reservation-list-by-manager.component.html',
  styleUrl: './reservation-list-by-manager.component.css'
})
export class ReservationListByManagerComponent implements OnInit, OnDestroy {
  data: any[] = [];
  destroy$: Subject<boolean> = new Subject<boolean>();
  managerId: number | null = null;

  constructor(private gService: GenericService,private router: Router) {}

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