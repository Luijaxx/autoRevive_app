import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { GenericService } from '../../share/generic.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-schedule-index',
  templateUrl: './schedule-index.component.html',
  styleUrls: ['./schedule-index.component.css'],
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
export class ScheduleIndexComponent implements OnInit, OnDestroy {
  data: any;
  destroy$: Subject<boolean> = new Subject<boolean>();
  branchId: number | null = null;
  branchList: any;

  constructor(private gService: GenericService, private router: Router,    private route:ActivatedRoute,private datePipe: DatePipe
  ) {
    this.listBranch();
  }

  ngOnInit(): void {}

  listBranch() {
    this.branchList = null;
    this.gService
      .list('branch')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        console.log('Branch List:', data); // Verifica que los datos se reciben correctamente
        this.branchList = data;
      });
  }

  onBranchChange(event: Event): void {
    this.branchId = +(event.target as HTMLSelectElement).value;
    this.listScheduleByBranch();
  }
  listScheduleByBranch() {
    if (this.branchId !== null) {
      this.gService
        .get('schedule/getByBranch', this.branchId)
        .pipe(takeUntil(this.destroy$))
        .subscribe((data: any[]) => {
          console.log(data);
          this.data = data;
        });
    }
  }

  formatDate(date: string): string {
    return this.datePipe.transform(date, 'MMMM d, y, h:mm a') || '';
  }

  detail(id: number) {
    this.router.navigate(['/schedule', id]);
  }
  createSchedule() {
    this.router.navigate(['/schedule/create'], {
      relativeTo: this.route,
    });
  }
  updateSchedule(id: number) {
    this.router.navigate(['/schedule/update', id], {
      relativeTo: this.route,
    });
  }
  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}