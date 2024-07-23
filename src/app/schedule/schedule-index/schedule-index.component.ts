import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { GenericService } from '../../share/generic.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';

interface CalendarDay {
  date: Date;
  schedules: any[];
}

@Component({
  selector: 'app-schedule-index',
  templateUrl: './schedule-index.component.html',
  styleUrls: ['./schedule-index.component.css'],
  animations: [
    trigger('fadeIn', [
      state('void', style({ opacity: 0 })),
      transition(':enter', [
        animate('500ms ease-in', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class ScheduleIndexComponent implements OnInit, OnDestroy {
  data: any;
  destroy$: Subject<boolean> = new Subject<boolean>();
  branchId: number | null = null;
  branchList: any;
  calendarDays: CalendarDay[] = [];
  selectedMonth: number = new Date().getMonth();
  selectedYear: number = new Date().getFullYear();
  months = [
    { name: 'January', value: 0 },
    { name: 'February', value: 1 },
    { name: 'March', value: 2 },
    { name: 'April', value: 3 },
    { name: 'May', value: 4 },
    { name: 'June', value: 5 },
    { name: 'July', value: 6 },
    { name: 'August', value: 7 },
    { name: 'September', value: 8 },
    { name: 'October', value: 9 },
    { name: 'November', value: 10 },
    { name: 'December', value: 11 }
  ];
  years: number[] = [];

  constructor(
    private gService: GenericService,
    private router: Router,
    private route: ActivatedRoute,
    private datePipe: DatePipe
  ) {
    this.listBranch();
    this.generateYearOptions();
  }

  ngOnInit(): void {
    this.updateCalendar();
  }

  listBranch() {
    this.branchList = null;
    this.gService
      .list('branch')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        console.log('Branch List:', data);
        this.branchList = data;
      });
  }

  onBranchChange(event: Event): void {
    this.branchId = +(event.target as HTMLSelectElement).value;
    this.updateCalendar();
  }

  onMonthChange(event: Event): void {
    this.selectedMonth = +(event.target as HTMLSelectElement).value;
    this.updateCalendar();
  }

  onYearChange(event: Event): void {
    this.selectedYear = +(event.target as HTMLSelectElement).value;
    this.updateCalendar();
  }

  listScheduleByBranch() {
    if (this.branchId !== null) {
      this.gService
        .get('schedule/getByBranch', this.branchId)
        .pipe(takeUntil(this.destroy$))
        .subscribe((data: any[]) => {
          console.log('Schedules from server:', data);
          this.data = this.filterSchedulesByMonthYear(data);
          this.generateCalendar();
        });
    }
  }
  

  filterSchedulesByMonthYear(schedules: any[]): any[] {
    const startDate = new Date(this.selectedYear, this.selectedMonth, 1);
    const endDate = new Date(this.selectedYear, this.selectedMonth + 1, 0);
    endDate.setHours(23, 59, 59, 999);  
    console.log('Filtering schedules between:', startDate, 'and', endDate);
  
    return schedules.filter((schedule: any) => {
      const scheduleStartDate = new Date(schedule.startDate);
      console.log('Checking schedule date:', scheduleStartDate);
      return (
        scheduleStartDate >= startDate &&
        scheduleStartDate <= endDate
      );
    });
  }
  
generateCalendar() {
  const start = new Date(this.selectedYear, this.selectedMonth, 1);
  const end = new Date(this.selectedYear, this.selectedMonth + 1, 0);

  const daysInMonth = end.getDate();
  this.calendarDays = [];

  console.log('Generating calendar for:', start, 'to', end);

  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(this.selectedYear, this.selectedMonth, i);
    const schedules = this.data
      ? this.data.filter(
          (schedule: any) => new Date(schedule.startDate).getDate() === i
        )
      : [];
    console.log('Date:', date, 'Schedules:', schedules);
    this.calendarDays.push({ date, schedules });
  }
}


  generateYearOptions() {
    const currentYear = new Date().getFullYear();
    for (let i = currentYear - 5; i <= currentYear + 5; i++) {
      this.years.push(i);
    }
  }

  updateCalendar() {
    this.listScheduleByBranch();
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
