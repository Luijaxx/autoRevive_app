import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject, takeUntil } from 'rxjs';
import { GenericService } from '../../share/generic.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-billing-index',
  templateUrl: './billing-index.component.html',
  styleUrl: './billing-index.component.css'
})
export class BillingIndexComponent implements AfterViewInit{
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  
  //@ViewChild(MatTable) table!: MatTable<VideojuegoAllItem>;
  dataSource = new MatTableDataSource<any>();


  currentPage = 1;
  pageSize = 5;


  get paginatedData() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = this.currentPage * this.pageSize;
    return this.dataSource.data.slice(startIndex, endIndex);
  }

  get totalPages() {
    return Math.ceil(this.dataSource.data.length / this.pageSize);
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }




  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['nombre', 'precio', 'acciones'];
  //Respuesta del API
  datos: any;
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private gService: GenericService,
    private dialog:MatDialog,
    private router:Router,
    private route:ActivatedRoute,
  ) {
    this.listInvoices( )
  }

  ngAfterViewInit(): void {
    this.listInvoices()
    
  }
  //Listar todos los videojuegos del API
  listInvoices() {
    //localhost:3000/videojuego
    this.gService
      .list('invoice/')
      .pipe(takeUntil(this.destroy$))
      .subscribe((respuesta: any) => {
        console.log(respuesta);
        this.datos = respuesta;
        this.dataSource = new MatTableDataSource(this.datos);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        
      });
  }
  detailProduct(id:number){
    this.router.navigate(['/invoice/',id])

  }
  updateProduct(id: number) {
    this.router.navigate(['/product/update', id], {
      relativeTo: this.route,
    });
  }

  createProduct() {
    this.router.navigate(['/product/create'], {
      relativeTo: this.route,
    });
  }
  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
