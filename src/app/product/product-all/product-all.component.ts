import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject, takeUntil } from 'rxjs';
import { GenericService } from '../../share/generic.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-product-all',
  templateUrl: './product-all.component.html',
  styleUrls: ['./product-all.component.css']
})
export class ProductAllComponent implements AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;

  dataSource = new MatTableDataSource<any>();
  currentPage = 1;
  pageSize = 5;

  get paginatedData() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = this.currentPage * this.pageSize;
    return this.dataSource.filteredData.slice(startIndex, endIndex);
  }

  get totalPages() {
    return Math.ceil(this.dataSource.filteredData.length / this.pageSize);
  }

  displayedColumns = ['name', 'warranty', 'price', 'category', 'update'];
  datos: any;
  destroy$: Subject<boolean> = new Subject<boolean>();
  categories: any[] = [];
  selectedCategory: string = '';

  constructor(
    private gService: GenericService,
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngAfterViewInit(): void {
    this.loadCategories();
    this.listProducts();
  }

  listProducts() {
    this.gService.list('product/')
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: any) => {
        this.datos = response;
        this.dataSource.data = this.datos; // Ensure data is assigned to the dataSource
        this.dataSource.sort = this.sort;
        this.applyFilter(); // Apply filter after loading data
      });
  }

  loadCategories() {
    this.gService.list('productCategory')
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: any) => {
        this.categories = response;
      });
  }

  filterByCategory(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const categoryId = selectElement.value;
    this.selectedCategory = categoryId;
    this.applyFilter(); // Apply filter when category changes
    this.currentPage = 1; // Reset to first page after filtering
  }

  applyFilter() {
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      return this.selectedCategory ? data.categoryId === Number(this.selectedCategory) : true;
    };
    this.dataSource.filter = this.selectedCategory;
  }

  detailProduct(id: number) {
    this.router.navigate(['/product/', id]);
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

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
}
