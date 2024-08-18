import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject, takeUntil } from 'rxjs';
import { GenericService } from '../../share/generic.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { NotificacionService, TipoMessage } from '../../share/notification.service';

@Component({
  selector: 'app-user-rol-changer-by-admin',
  templateUrl: './user-rol-changer-by-admin.component.html',
  styleUrls: ['./user-rol-changer-by-admin.component.css'],
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
export class UserRolChangerByAdminComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource = new MatTableDataSource<any>();
  displayedColumns = ['name', 'email', 'phone', 'role', 'actions'];
  datos: any;
  destroy$: Subject<boolean> = new Subject<boolean>();

  currentPage = 1;
  pageSize = 5;

  constructor(
    private gService: GenericService,
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private noti: NotificacionService

  ) {}

  ngAfterViewInit(): void {
    this.listUsers();
  }

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

  listUsers() {
    this.gService
      .list('user/')
      .pipe(takeUntil(this.destroy$))
      .subscribe((respuesta: any) => {
        this.datos = respuesta.filter((user: any) => user.role !== 'ADMIN');
        this.dataSource = new MatTableDataSource(this.datos);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      });
  }
  

  updateUserRole(user: any) {
    this.gService.update('user', user).subscribe(
      (response) => {
        console.log('User updated successfully', response);
        this.listUsers(); // Refresh the list after update
        this.noti.mensaje(
          'User updated',
          `User Role Updated: ${user.name}`,
          TipoMessage.success        );
      },
      (error) => {
        console.error('Error updating user', error);
      }
    );
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}

