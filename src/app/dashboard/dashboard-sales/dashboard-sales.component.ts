import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GenericService } from '../../share/generic.service';
import { AuthenticationService } from '../../share/authentication.service';

@Component({
  selector: 'app-dashboard-sales',
  templateUrl: './dashboard-sales.component.html',
  styleUrls: ['./dashboard-sales.component.css']
})
export class DashboardSalesComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  data: any[] = [];
  dataS: any[] = [];
  dataB: any[] = [];
  dataM: any[] = [];

  // Chart options
  view: [number, number] = [800, 600];
  animations = true;
  legend = true;
  legendTitle = 'Datos';
  xAxis = true;
  yAxis = true;
  showYAxisLabel = true;
  yAxisLabel = "Product quantity";
  yAxisLabelS = "Service quantity";
  yAxisLabelB = "Reservation per branch";
  yAxisLabelM = "Reservations";

  colorScheme = 'nightLights';

  // Pie Chart Options (if needed in future)
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = false;
  isDoughnut: boolean = false;
  legendPosition = 'below';
  authService: AuthenticationService = inject(AuthenticationService);
  currentUser: any;
  
  auth: boolean = false;
  constructor(private gService: GenericService) {
    this.authService.decodeToken.subscribe((user) => (this.currentUser = user));
    this.authService.isAuthenticated.subscribe((valor) => (this.auth = valor));
    if(this.currentUser.role === 'ADMIN'){
      this.salesProductsList();
    this.salesServicesList();
    this.reservationsPerDate()
    } else if(this.currentUser.role === 'MANAGER'){
      this.reservationsPerBranchM();
    }   
  }

  ngOnInit(): void {}

  dataLabelFormatter(tooltipText: any): string {
    return tooltipText + " sales";
  }

  salesProductsList(): void {
    this.gService
      .list('report/mostsoldProducts/')
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: any[]) => {
        // Transform the data to the format required by ngx-charts
        this.data = response.map(item => ({
          name: item.product_name,
          value: +item.total_quantity_sold
        }));
      });
  }

  salesServicesList(): void {
    this.gService
      .list('report/mostsoldServices/')
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: any[]) => {
        // Transform the data to the format required by ngx-charts
        this.dataS = response.map(item => ({
          name: item.service_name,
          value: +item.total_quantity_sold
        }));
      });
  }

  
  reservationsPerDate(): void {
    this.gService
      .list('report/reservationPerBranch/')
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: any[]) => {
        // Transform the data to the format required by ngx-charts
        this.dataB = response.map(item => ({
          name: item.branch_name,
          value: +item.appointment_count
        }));
      });
  }

  reservationsPerBranchM(): void {
    this.gService
      .list('report/reservationPerBranchManager/' + this.currentUser.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: any[]) => {
        // Transform the data to the format required by ngx-charts
        this.dataM = response.map(item => ({
          name: item.status,
          value: +item.total_appointments
        }));
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
