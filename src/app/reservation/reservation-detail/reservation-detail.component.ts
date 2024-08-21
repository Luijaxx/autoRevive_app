import { Component, inject } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { GenericService } from '../../share/generic.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { NotificacionService, TipoMessage } from '../../share/notification.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthenticationService } from '../../share/authentication.service';

@Component({
  selector: 'app-reservation-detail',
  templateUrl: './reservation-detail.component.html',
  styleUrl: './reservation-detail.component.css',
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
export class ReservationDetailComponent {
  data: any;
destroy$: Subject<boolean> = new Subject<boolean>();
total: number = 0; 
repCancel: any;
authService: AuthenticationService = inject(AuthenticationService);
currentUser: any;
auth: boolean = false;


constructor(private gService: GenericService, private route: ActivatedRoute, private noti: NotificacionService, private router: Router) {
  let id = this.route.snapshot.paramMap.get('id');
  this.authService.decodeToken.subscribe((user) => (this.currentUser = user));
  this.authService.isAuthenticated.subscribe((valor) => (this.auth = valor));
  if (!isNaN(Number(id))) 
    this.getreservation(Number(id));
}

getreservation(id: any) {
  this.gService
    .get('reservation', id)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data: any) => {
      console.log(data);
      this.data = data;
    });
}

confirmReservation(id:any){
  this.gService
  .update('reservation/confirm', { id: parseInt(id, 10) })
  .pipe(takeUntil(this.destroy$))
  .subscribe((data: any) => {
    this.repCancel = data;
    this.noti.mensajeRedirect(
      'Reservation Confirmed',
      `Reservation #${data.id} Confirmed`,
      TipoMessage.success,
      'reservation/listByManager'
    );
    this.router.navigate(['/reservation/listByManager']);
  });
}

cancelReservation(id: any) {
  const startDate = new Date(this.data.startTime);
  const actualDate = new Date();
  
  // Verificar si la fecha actual es anterior al startDate
  if (actualDate > startDate) {
    this.noti.mensaje(
      'Reservation Cancellation Error',
      'The reservation start date and time have already passed. Cancellation is not allowed.',
      TipoMessage.error
    );
    return;
  }

  const milisecondsDifer = startDate.getTime() - actualDate.getTime();

  const fourHoursInMilliseconds = 24 * 60 * 60 * 1000;
  const tenMinutesInMilliseconds = 10 * 60 * 1000;

  let canCancel = false;

  // Si es un día anterior, permitir la cancelación sin restricciones
  if (actualDate.toDateString() !== startDate.toDateString()) {
    canCancel = true;
  } else if (this.currentUser.role === 'CLIENT' && milisecondsDifer >= fourHoursInMilliseconds) {
    canCancel = true;
  } else if (this.currentUser.role === 'MANAGER' && milisecondsDifer >= tenMinutesInMilliseconds) {
    canCancel = true;
  }

  if (canCancel) {
    this.gService
    .update('reservation/cancel', { id: parseInt(id, 10) })
    .pipe(takeUntil(this.destroy$))
    .subscribe((data: any) => {
      this.repCancel = data;
      this.noti.mensajeRedirect(
        'Reservation Canceled',
        `Reservation #${data.id} canceled`,
        TipoMessage.success,
        'reservation/listByManager'
      );
      this.router.navigate(['/reservation/listByManager']);
    });
  
  } else {
    this.noti.mensaje(
      'Reservation Cancellation Error',
      this.currentUser.role === 'CLIENT'
        ? 'You can only cancel the reservation 24 hours before the start time'
        : 'You can only cancel the reservation 10 minutes before the start time',
      TipoMessage.error
    );
  }
}





ngOnDestroy() {
  this.destroy$.next(true);
  this.destroy$.unsubscribe();
}
}
