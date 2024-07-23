import { Component, OnDestroy, OnInit } from '@angular/core';
import { GenericService } from '../../share/generic.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-billing-list-by-manager',
  templateUrl: './billing-list-by-manager.component.html',
  styleUrl: './billing-list-by-manager.component.css',
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

export class BillingListByManagerComponent implements OnInit, OnDestroy {
  data: any[] = [];
  destroy$: Subject<boolean> = new Subject<boolean>();
 // managerId: number | null = null;

  constructor(private gService: GenericService,private router: Router) {
   // this.managerId = 2;
    this.listInvoices();
  }

  ngOnInit(): void {}

  listInvoices(): void {
      this.gService
        .list('invoice/')
        .pipe(takeUntil(this.destroy$))
        .subscribe((data: any[]) => {
          console.log(data);
          this.data = data;
        });
    
  }

  detail(id:number){
    this.router.navigate(['/invoice',id])
}

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}