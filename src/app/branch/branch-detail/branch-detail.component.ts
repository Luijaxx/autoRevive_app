import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { GenericService } from '../../share/generic.service';
import { NotificacionService } from '../../share/notification.service';

@Component({
  selector: 'app-branch-detail',
  templateUrl: './branch-detail.component.html',
  styleUrls: ['./branch-detail.component.css']
})
export class BranchDetailComponent implements OnInit, OnDestroy {
  branch: any;
  destroy$: Subject<boolean> = new Subject<boolean>();
  idBranch: number = 0;

  constructor(
    private router: Router,
    private activeRouter: ActivatedRoute,
    private gService: GenericService,
    private noti: NotificacionService
  ) { }

  ngOnInit(): void {
    this.activeRouter.params.subscribe((params: Params) => {
      this.idBranch = parseInt(params['id']);
      if (this.idBranch !== undefined) {
        this.getBranchDetails(this.idBranch);
      }
    });
  }

  getBranchDetails(id: number) {
    this.gService
      .get('branch', id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.branch = data;
      });
  }

  onBack() {
    this.router.navigate(['/branch-table']);
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}

