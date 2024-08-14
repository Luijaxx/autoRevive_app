import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {
  catchError,
  map,
  Observable,
  Subject,
  takeUntil,
  throwError,
} from 'rxjs';
import { GenericService } from '../../share/generic.service';
import {
  NotificacionService,
  TipoMessage,
} from '../../share/notification.service';
import { FormErrorMessage } from '../../form-error-message';
import moment from 'moment';
moment.locale('es');
import { DatePipe } from '@angular/common';
import { RouterTestingHarness } from '@angular/router/testing';
import { setThrowInvalidWriteToSignalError } from '@angular/core/primitives/signals';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

@Component({
  selector: 'app-reservation-form',
  templateUrl: './reservation-form.component.html',
  styleUrl: './reservation-form.component.css',
  animations: [
    trigger('fadeIn', [
      state('void', style({ opacity: 0 })),
      transition(':enter', [animate('500ms ease-in', style({ opacity: 1 }))]),
    ]),
  ],
})
export class ReservationFormComponent implements OnInit, OnDestroy {
  data: any;
  destroy$: Subject<boolean> = new Subject<boolean>();
  titleForm: string = 'Create';
  reservationForm: FormGroup;
  scheduleForm: FormGroup;
  idSchedule: number = 0;
  isCreate: boolean = true;
  branchList: any;
  clientList: any;
  serviceList: any;
  scheduleInfo: any;

  clientNameFilter: string = '';
  serviceNameFilter: string = '';
  availableTimeSlots: any;
  branchId: number | null = null;
  selectedMonth: number = new Date().getMonth();
  selectedYear: number = new Date().getFullYear();
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activeRouter: ActivatedRoute,
    private gService: GenericService,
    private noti: NotificacionService
  ) {
    this.formularioReactive();
    this.listBranch();
    this.listClient();
    this.listService();

  }

  ngOnInit(): void {
    this.activeRouter.params.subscribe((params: Params) => {
      this.idSchedule = params['id'];
      if (this.idSchedule !== undefined) {
        this.isCreate = false;
        this.titleForm = 'Create';
        this.gService
          .get('schedule', this.idSchedule)
          .pipe(takeUntil(this.destroy$))
          .subscribe((data: any) => {
            this.scheduleInfo = data;
            this.reservationForm.patchValue({
              branchId: parseInt(this.scheduleInfo.branchId),
              date: moment(this.scheduleInfo.startDate).format('YYYY-MM-DD'),
              startTime: moment(this.scheduleInfo.startDate).format('HH:mm'),
              endTime: moment(this.scheduleInfo.endDate).format('HH:mm'),
            });
          });
        console.log(this.reservationForm.value);
      }
    });
  }

  getAvailableTimeSlotsForBranch(event: Event): void {
    const dateSchedule = this.reservationForm.value.date;
    const branchId = this.reservationForm.value.branchId;
    const startTimeSchedule = this.reservationForm.get('startTime').value;
    const endTimeSchedule = this.reservationForm.get('endTime').value;

    if (!branchId || !dateSchedule || !startTimeSchedule || !endTimeSchedule) {
      return;
    }

    const formattedDate = moment(dateSchedule).format('YYYY-MM-DD');

    this.gService
      .get('reservation/getByBranch', branchId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((existingReservations: any[]) => {
        const serviceId = parseInt((event.target as HTMLInputElement).value);
        const service = this.serviceList.find((s: any) => s.id === serviceId);
        const serviceTime = service ? service.serviceTime : 0;
        const availableSlots = this.getAvailableTimeSlots(
          formattedDate,
          startTimeSchedule,
          endTimeSchedule,
          serviceTime,
          existingReservations
        );
        this.availableTimeSlots = availableSlots;
      });
  }

  getAvailableTimeSlots(
    date: string,
    startTimeSchedule: string,
    endTimeSchedule: string,
    serviceTime: number,
    existingReservations: any[]
  ): any[] {
    const slots: any[] = [];
    const startTimeForSchedule = moment(
      `${date}T${startTimeSchedule}`
    ).toDate();
    const endTimeForSchedule = moment(`${date}T${endTimeSchedule}`).toDate();

    let currentStart = startTimeForSchedule;

    while (currentStart < endTimeForSchedule) {
      const currentEnd = new Date(currentStart.getTime() + serviceTime * 60000);

      if (currentEnd <= endTimeForSchedule) {
        const isOccupied = existingReservations.some((reservation) => {
          const resStart = new Date(reservation.startTime);
          const resEnd = new Date(reservation.endTime);

          return currentStart < resEnd && currentEnd > resStart;
        });

        if (!isOccupied) {
          slots.push({
            startTime: moment(currentStart).format('HH:mm'),
            endTime: moment(currentEnd).format('HH:mm'),
          });
        }
      }

      currentStart = new Date(currentStart.getTime() + serviceTime * 60000);
    }

    return slots;
  }

  formularioReactive() {
    this.reservationForm = this.fb.group({
      id: [null],
      branchId: [null, Validators.required],
      availableTimeSlots: [null, Validators.required],
      clientId: [null, Validators.required],
      serviceId: [null, Validators.required],
      date: [null],
      startTime: [null],
      endTime: [null],
      answer1: [false],
      answer2: [false],
      answer3: [false],
      statusId: [1],
    });
  }

  public errorHandling = (controlName: string) => {
    let messageError = '';
    const control = this.reservationForm.get(controlName);
    if (control.errors) {
      for (const message of FormErrorMessage) {
        if (
          control &&
          control.errors[message.forValidator] &&
          message.forControl === controlName
        ) {
          messageError = message.text;
        }
      }
      return messageError;
    } else {
      return false;
    }
  };

  listBranch() {
    this.branchList = null;
    this.gService
      .list('branch')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        console.log('Branch List:', data);
        this.branchList = data;
      });
  }

  listClient() {
    if (this.clientNameFilter != '') {
      this.clientList = null;
      this.gService
        .list('user/getClients')
        .pipe(takeUntil(this.destroy$))
        .subscribe((data: any) => {
          console.log('Client List:', data);
          this.clientList = data.filter((client: any) =>
            client.name.toLowerCase().includes(this.clientNameFilter)
          );
        });
    }
  }

  onClientNameChange(event: Event): void {
    this.clientNameFilter = (
      event.target as HTMLInputElement
    ).value.toLowerCase();
    this.listClient();
  }

  listService() {
    if (this.serviceNameFilter != '') {
      this.serviceList = null;
      this.gService
        .list('service')
        .pipe(takeUntil(this.destroy$))
        .subscribe((data: any) => {
          console.log('Service List:', data);
          this.serviceList = data.filter((service: any) =>
            service.name.toLowerCase().includes(this.serviceNameFilter)
          );
        });
    }
  }

  onServiceNameChange(event: Event): void {
    this.serviceNameFilter = (
      event.target as HTMLInputElement
    ).value.toLowerCase();
    this.listService();
  }

  submitSchedule(): void {
    if (this.reservationForm.invalid) {
      return;
    }
  
    const selectedTimeSlot = this.reservationForm.value.availableTimeSlots;
    const [startTime, endTime] = selectedTimeSlot.split('-');
    const date = this.reservationForm.get('date').value;
  
    this.reservationForm.patchValue({
      clientId: parseInt(this.reservationForm.value.clientId),
      serviceId: parseInt(this.reservationForm.value.serviceId),
      startTime: `${moment(date).format('YYYY-MM-DD')}T${startTime}`,
      endTime: `${moment(date).format('YYYY-MM-DD')}T${endTime}`,
      date: `${moment(date).format('YYYY-MM-DD')}T${startTime}`,
      answer1: this.reservationForm.value.answer1 ? 'Yes' : 'No',
      answer2: this.reservationForm.value.answer2 ? 'Yes' : 'No',
      answer3: this.reservationForm.value.answer3 ? 'Yes' : 'No',
    });
  
    console.log(this.reservationForm.value);
  
    const invoice = {
      userId: this.reservationForm.value.clientId,
      branchId: this.reservationForm.value.branchId,
      date: new Date().toISOString(),
      total: this.serviceList.find(
        (s: any) => s.id === parseInt(this.reservationForm.value.serviceId)
      ).priceRate * 1.13, 
    };
  
    const detail = {
      invoiceId: 0, 
      serviceId: this.reservationForm.value.serviceId,
      productId: null,
      date: new Date().toISOString(),
      quantity: 1,
      subtotal: invoice.total,
    };
  
    this.gService.create('invoice', invoice).toPromise()
      .then((invoiceData: any) => {
        detail.invoiceId = invoiceData.id;
  
        return this.gService.create('invoiceDetail', detail).toPromise();
      })
      .then((detailData: any) => {
        this.noti.mensaje(
          'Create detail',
          `Detail created: ${detailData.id}`,
          TipoMessage.success
        );
      })
      .catch((error: any) => {
        console.error('Error creating invoice or detail:', error);
        this.noti.mensaje(
          'Error',
          'There was an error creating the invoice or detail.',
          TipoMessage.error
        );
      })
      .finally(() => {
        this.guardarReservation();
      });
  }
  

  guardarReservation() {
    this.gService
      .create('reservation', this.reservationForm.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.noti.mensajeRedirect(
          'Create reservation',
          `Reservation created: ${data.id}`,
          TipoMessage.success,
          'reservation'
        );
        this.router.navigate(['/reservation/listByManagerFiltered']);
      });
  }

  onReset() {
    this.reservationForm.reset();
  }

  onBack() {
    this.router.navigate(['/reservation/listByManagerFiltered']);
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
