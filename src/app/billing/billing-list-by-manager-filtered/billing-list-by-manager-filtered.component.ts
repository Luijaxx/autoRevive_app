import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { GenericService } from '../../share/generic.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AuthenticationService } from '../../share/authentication.service';
import moment from 'moment';

interface Invoice {
  id: number;
  date: Date;
  total: number;
  canceled: string;
  user: any;
  branch: any;
  invoiceDetails: any[];
}
interface CalendarDay {
  date: Date;
  invoices: any[];
}
@Component({
  selector: 'app-billing-list-by-manager-filtered',
  templateUrl: './billing-list-by-manager-filtered.component.html',
  styleUrls: ['./billing-list-by-manager-filtered.component.css'],
  animations: [
    trigger('fadeIn', [
      state('void', style({ opacity: 0 })),
      transition(':enter', [
        animate('500ms ease-in', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class BillingListByManagerFilteredComponent  implements OnInit, OnDestroy {
  data: any;
  destroy$: Subject<boolean> = new Subject<boolean>();
  branchId: number | null = null;
  calendarDays: CalendarDay[] = [];
  selectedMonth: number = new Date().getMonth();
  selectedYear: number = new Date().getFullYear();
  clientNameFilter: string = ''; 
  authService: AuthenticationService = inject(AuthenticationService);
  auth: boolean = false;
  currentUser: any;

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
    this.authService.decodeToken.subscribe((user) => (this.currentUser = user));
    this.authService.isAuthenticated.subscribe((valor) => (this.auth = valor));
    this.listInvoices();

    this.generateYearOptions();
  }

  ngOnInit(): void {
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
  onClientNameChange(event: Event): void {
    this.clientNameFilter = (event.target as HTMLInputElement).value.toLowerCase();
    this.updateCalendar();
  }

  listInvoices() {
    if (this.auth) {

      this.gService
        .get('invoice/listByManager',this.currentUser.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe((data: any[]) => {
          console.log('Invoice from server:', data);
          this.data = this.filterinvoicesByMonthYear(data);
          this.generateCalendar();
        });
    }
  }
  

  filterinvoicesByMonthYear(invoices: any[]): any[] {
    const startDate = new Date(this.selectedYear, this.selectedMonth, 1);
    const endDate = new Date(this.selectedYear, this.selectedMonth + 1, 0);
    endDate.setHours(23, 59, 59, 999);  
    console.log('Filtering invoices between:', startDate, 'and', endDate);
  
    return invoices.filter((schedule: any) => {
      const invoicestartDate = new Date(schedule.date);
      console.log('Checking schedule date:', invoicestartDate);
      return (
        invoicestartDate >= startDate &&
        invoicestartDate <= endDate
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
    const invoices = this.data
      ? this.data.filter(
          (invoice: any) => new Date(invoice.date).getDate() === i
        )   .filter((invoice: any) =>
          invoice.user.name.toLowerCase().includes(this.clientNameFilter)
        )
      : [];
    console.log('Date:', date, 'invoices:', invoices);
    this.calendarDays.push({ date, invoices });
  }
}


  generateYearOptions() {
    const currentYear = new Date().getFullYear();
    for (let i = currentYear - 5; i <= currentYear + 5; i++) {
      this.years.push(i);
    }
  }

  updateCalendar() {
    this.listInvoices();
  }

  formatDate(date: string): string {
    return this.datePipe.transform(date, 'MMMM d, y, h:mm a') || '';
  }

  detail(id: number) {
    this.router.navigate(['/invoice', id]);
  }


  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
