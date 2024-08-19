import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GenericService } from '../../share/generic.service';

@Component({
  selector: 'app-dashboard-sales',
  templateUrl: './dashboard-sales.component.html',
  styleUrls: ['./dashboard-sales.component.css']
})
export class DashboardSalesComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  data: any[] = [];
  dataS: any[] = [];

  // Chart options
  view: [number, number] = [800, 600];
  animations = true;
  legend = true;
  legendTitle = 'Datos';
  xAxis = true;
  yAxis = true;
  showYAxisLabel = true;
  yAxisLabel = "Cantidad de Productos";
  yAxisLabelS = "Cantidad de Servicios";

  colorScheme = 'nightLights';

  // Pie Chart Options (if needed in future)
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = false;
  isDoughnut: boolean = false;
  legendPosition = 'below';

  constructor(private gService: GenericService) {
    this.salesProductsList();
    this.salesServicesList();

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

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
