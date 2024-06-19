import { Component, OnDestroy, OnInit } from '@angular/core';
import { GenericService } from '../../share/generic.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-billing-list-by-manager',
  templateUrl: './billing-list-by-manager.component.html',
  styleUrl: './billing-list-by-manager.component.css'
})

export class BillingListByManagerComponent implements OnInit, OnDestroy {
  data: any[] = [];
  destroy$: Subject<boolean> = new Subject<boolean>();
  managerId: number | null = null;

  constructor(private gService: GenericService,private router: Router) {}

  ngOnInit(): void {}

  listByManager(): void {
    if (this.managerId !== null) {
      this.gService
        .get('invoice/listByManager', this.managerId)
        .pipe(takeUntil(this.destroy$))
        .subscribe((data: any[]) => {
          console.log(data);
          this.data = data;
        });
    }
  }

  detail(id:number){
    this.router.navigate(['/invoice',id])
}

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}