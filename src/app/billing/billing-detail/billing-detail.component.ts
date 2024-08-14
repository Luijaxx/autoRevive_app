import { Component, inject } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { GenericService } from '../../share/generic.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { NotificacionService, TipoMessage } from '../../share/notification.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthenticationService } from '../../share/authentication.service';

@Component({
  selector: 'app-billing-detail',
  templateUrl: './billing-detail.component.html',
  styleUrl: './billing-detail.component.css',
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
export class BillingDetailComponent {
  data: any;
  destroy$: Subject<boolean> = new Subject<boolean>();
  total: number = 0; 
  authService: AuthenticationService = inject(AuthenticationService);
  auth: boolean = false;
  currentUser: any;
  constructor(private gService: GenericService,     private router: Router,
    private noti: NotificacionService
,    private route: ActivatedRoute) {
  this.authService.decodeToken.subscribe((user) => (this.currentUser = user));
    this.authService.isAuthenticated.subscribe((valor) => (this.auth = valor));
    let id = this.route.snapshot.paramMap.get('id');
    if (!isNaN(Number(id))) 
      this.getInvoice(Number(id));
  }

  getInvoice(id: any) {
    this.gService
      .get('invoice', id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        console.log(data);
        this.data = data;
      });
  }

  cancelInvoice(){
    this.data.canceled = "YES";
    this.gService
        .update('invoice', this.data)
        .pipe(takeUntil(this.destroy$))
        .subscribe((data: any) => {
          this.noti.mensajeRedirect(
            'Cancel Invoice',
            `Invoice Cancel: ${data.id}`,
            TipoMessage.success,
            '/invoice/listByManagerFiltered'
          );
          this.router.navigate(['/invoice/listByManagerFiltered']);
        });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
