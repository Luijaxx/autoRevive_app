import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { GenericService } from '../../share/generic.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-branch-all',
  templateUrl: './branch-all.component.html',
  styleUrl: './branch-all.component.css'
})
export class BranchAllComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  
  //@ViewChild(MatTable) table!: MatTable<VideojuegoAllItem>;
  dataSource = new MatTableDataSource<any>();

  userList: any;
  notAssosiateUserList: any;

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
  }

  ngAfterViewInit(): void {
    this.listbranchs()
    
  }
  //Listar todos los videojuegos del API
  listbranchs() {
    //localhost:3000/videojuego
    this.gService
      .list('branch/')
      .pipe(takeUntil(this.destroy$))
      .subscribe((respuesta: any) => {
        console.log(respuesta);
        this.datos = respuesta;
        this.dataSource = new MatTableDataSource(this.datos);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        
      });
  }


  listUserByBranch(idBranch:number) {
    this.gService
      .get('branch/',idBranch)
      .pipe(takeUntil(this.destroy$))
      .subscribe((respuesta: any) => {
        console.log(respuesta);
        console.log('User List:', respuesta.users); 

        this.userList = respuesta.users;
      });
  }


  detailbranch(id:number){
    this.router.navigate(['/branch/',id])

  }
  updatebranch(id: number) {
    this.router.navigate(['/branch/update', id], {
      relativeTo: this.route,
    });
  }

  createbranch() {
    this.router.navigate(['/branch/create'], {
      relativeTo: this.route,
    });
  }
  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
