import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { GenericService } from '../../share/generic.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AuthenticationService } from '../../share/authentication.service';
import moment from 'moment';

interface CalendarDay {
  date: Date;
  schedules: any[];
  reservations: any[];
}

@Component({
  selector: 'app-reservation-list-by-manager-filtered',
  templateUrl: './reservation-list-by-manager-filtered.component.html',
  styleUrls: ['./reservation-list-by-manager-filtered.component.css'],
  animations: [
    trigger('fadeIn', [
      state('void', style({ opacity: 0 })),
      transition(':enter', [
        animate('500ms ease-in', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class ReservationListByManagerFilteredComponent implements OnInit, OnDestroy {
  authService: AuthenticationService = inject(AuthenticationService);
  auth: boolean = false;
  dataSchedule: any;
  dataReservations: any;
  destroy$: Subject<boolean> = new Subject<boolean>();
  branchId: number | null = null;
  currentUser: any;
  branchList: any;
  todayStartDate:any;
  calendarDays: CalendarDay[] = [];
  selectedMonth: number = new Date().getMonth();
  selectedYear: number = new Date().getFullYear();
  clientNameFilter: string = ''; 
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
    this.authService.decodeToken.subscribe((user) => (this.currentUser = user));
    this.authService.isAuthenticated.subscribe((valor) => (this.auth = valor));
    this.todayStartDate = moment().startOf('day').format('YYYY-MM-DDTHH:mm:ssZ');

  }

  ngOnInit(): void {
    this.updateCalendar();
    this.authService.isAuthenticated.subscribe((valor) => {
      this.auth = valor;
    });
    this.authService.decodeToken.subscribe((user: any) => {
      this.currentUser = user;
    });
  }

  listBranch() {
    this.branchList = null;
    this.gService.list('branch')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        console.log('Branch List:', data);
        this.branchList = data;
      });
  }

  onMonthChange(event: Event): void {
    this.selectedMonth = +(event.target as HTMLSelectElement).value;
    this.updateCalendar();
  }

  onYearChange(event: Event): void {
    this.selectedYear = +(event.target as HTMLSelectElement).value;
    this.updateCalendar();
  }

  onClientNameChange(event: Event): void {
    this.clientNameFilter = (event.target as HTMLInputElement).value.toLowerCase();
    this.updateCalendar();
  }

  listScheduleWithReservationsByBranch() {
    if (this.auth) {
      this.gService.get('schedule/getByBranch', this.currentUser.branchId)
        .pipe(takeUntil(this.destroy$))
        .subscribe((data: any[]) => {
          console.log('Schedules from server:', data);
          this.dataSchedule = this.filterSchedulesByMonthYear(data);
          this.generateCalendar();
        });

      this.gService.get('reservation/listByManager', this.currentUser.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe((data: any[]) => {
          console.log('Reservations from server:', data);
          this.dataReservations = this.filterSchedulesByMonthYear(data);
          this.generateCalendar();
        });
    }
  }

  filterSchedulesByMonthYear(schedules: any[]): any[] {
    const startDate = new Date(this.selectedYear, this.selectedMonth, 1);
    const endDate = new Date(this.selectedYear, this.selectedMonth + 1, 0);
    endDate.setHours(23, 59, 59, 999);
    console.log('Filtering reservations between:', startDate, 'and', endDate);

    return schedules.filter((schedule: any) => {
      if (schedule.startDate != null) {
        const scheduleStartDate = new Date(schedule.startDate);
        console.log('Checking schedule date:', scheduleStartDate);
        return scheduleStartDate >= startDate && scheduleStartDate <= endDate;
      } else {
        const scheduleStartDate = new Date(schedule.date);
        console.log('Checking schedule date:', scheduleStartDate);
        return scheduleStartDate >= startDate && scheduleStartDate <= endDate;
      }
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
      const schedules = this.dataSchedule
        ? this.dataSchedule.filter(
            (schedule: any) => new Date(schedule.startDate).getDate() === i
          )
        : [];
      const reservations = this.dataReservations
        ? this.dataReservations
            .filter(
              (reservation: any) => new Date(reservation.date).getDate() === i
            )
            .filter((reservation: any) =>
              reservation.client.name.toLowerCase().includes(this.clientNameFilter)
            )
        : [];

      console.log('Date:', date, 'Schedules:', schedules, 'Reservations:', reservations);
      this.calendarDays.push({ date, schedules, reservations });
    }
  }

  isScheduleValid(startDate: string): boolean {
    // Comprobar si startDate es mayor o igual a hoy a las 00:00
    return moment(startDate).isSameOrAfter(this.todayStartDate);
  }

  generateYearOptions() {
    const currentYear = new Date().getFullYear();
    for (let i = currentYear - 5; i <= currentYear + 5; i++) {
      this.years.push(i);
    }
  }

  updateCalendar() {
    this.listScheduleWithReservationsByBranch();
  }

  formatDate(date: string): string {
    return this.datePipe.transform(date, 'MMMM d, y, h:mm a') || '';
  }

  detail(id: number) {
    this.router.navigate(['/reservation', id]);
  }




  createReservation(selectedDate: Date) {
    this.router.navigate(['/reservation/create', selectedDate], {
      relativeTo: this.route,
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
