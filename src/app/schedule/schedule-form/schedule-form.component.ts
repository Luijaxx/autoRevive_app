import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { catchError, map, Observable, Subject, takeUntil, throwError } from 'rxjs';
import { GenericService } from '../../share/generic.service';
import { NotificacionService, TipoMessage } from '../../share/notification.service';
import { FormErrorMessage } from '../../form-error-message';
import moment from 'moment';
moment.locale("es");
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-schedule-form',
  templateUrl: './schedule-form.component.html',
  styleUrls: ['./schedule-form.component.css']
})
export class ScheduleFormComponent implements OnInit, OnDestroy {
  data: any;

  destroy$: Subject<boolean> = new Subject<boolean>();
  titleForm: string = 'Create';
  scheduleForm: FormGroup;
  idSchedule: number = 0;
  isCreate: boolean = true;
  branchList: any;
  scheduleInfo: any;
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
  }

  ngOnInit(): void {
    this.activeRouter.params.subscribe((params: Params) => {
      this.idSchedule = params['id'];
      if (this.idSchedule !== undefined) {
        this.isCreate = false;
        this.titleForm = 'Update';
        this.gService
          .get('schedule', this.idSchedule)
          .pipe(takeUntil(this.destroy$))
          .subscribe((data: any) => {
            this.scheduleInfo = data;
            this.scheduleForm.patchValue({
              id: this.scheduleInfo.id,
              branchId: this.scheduleInfo.branchId,
              availability: this.scheduleInfo.availability,
              isRepetitive: this.scheduleInfo.isRepetitive,
              startDate: moment(this.scheduleInfo.startDate).format('YYYY-MM-DD'),
              endDate: moment(this.scheduleInfo.endDate).format('YYYY-MM-DD'),
              startTime: moment(this.scheduleInfo.startDate).format('HH:mm'),
              endTime: moment(this.scheduleInfo.endDate).format('HH:mm'),
              description: this.scheduleInfo.description
            });
          });
      }
    });
  }




  formularioReactive() {
    this.scheduleForm = this.fb.group({
      id: [null],
      branchId: [null, Validators.required],
      availability: ['SCHEDULE', Validators.required],
      isRepetitive: [false],
      startDate: [null],
      endDate: [null],
      startTime: [null],
      endTime: [null],
      description: [null]
    });
  }

  public errorHandling = (controlName: string) => {
    let messageError = '';
    const control = this.scheduleForm.get(controlName);
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

  updateEndDate(startDate: string) {
    if (this.scheduleForm.get('isRepetitive').value && startDate) {
      this.scheduleForm.patchValue({ endDate: startDate });
    }
  }
  onStartDateChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const startDate = input.value;
    this.updateEndDate(startDate);
  }

  submitSchedule(): void {
    if (this.scheduleForm.invalid) {
      return;
    }
  
    const startDate = new Date(`${this.scheduleForm.get('startDate').value}T${this.scheduleForm.get('startTime').value}`);
    const endDate = new Date(`${this.scheduleForm.get('endDate').value}T${this.scheduleForm.get('endTime').value}`);
  
    if (this.scheduleForm.get('isRepetitive').value) {
      this.processRepetitiveSchedules(startDate, endDate);
    } else {
      this.scheduleForm.patchValue({
        branchId: parseInt(this.scheduleForm.get('branchId').value),
        startDate: `${this.scheduleForm.get('startDate').value}T${this.scheduleForm.get('startTime').value}`,
        endDate: `${this.scheduleForm.get('startDate').value}T${this.scheduleForm.get('endTime').value}`
      });
  
      this.validateSchedule(this.scheduleForm.value).subscribe({
        next: () => this.guardarSchedule(),
        error: (err) => this.noti.mensajeRedirect('Error', err.message, TipoMessage.error, 'schedule')
      });
    }
  }
  
  processRepetitiveSchedules(startDate: Date, endDate: Date) {
    const processNextDay = () => {
      if (startDate <= endDate) {
        this.scheduleForm.patchValue({
          branchId: parseInt(this.scheduleForm.get('branchId').value),
          startDate: `${moment(startDate).format('YYYY-MM-DD')}T${this.scheduleForm.get('startTime').value}`,
          endDate: `${moment(startDate).format('YYYY-MM-DD')}T${this.scheduleForm.get('endTime').value}`
        });
  
        this.validateSchedule(this.scheduleForm.value).subscribe({
          next: () => {
            this.guardarSchedule();
            startDate.setDate(startDate.getDate() + 1);
            processNextDay();
          },
          error: (err) => {
            this.noti.mensajeRedirect('Error', err.message, TipoMessage.error,'schedule');
            // Opcional: salir del ciclo si ocurre un error
          }
        });
      }
    };
  
    processNextDay();
  }
  
  
  

  guardarSchedule() {
    if (this.isCreate) {
      this.gService
        .create('schedule', this.scheduleForm.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe((data: any) => {
          this.noti.mensajeRedirect(
            'Create Schedule',
            `Schedule created: ${data.id}`,
            TipoMessage.success,
            'schedule'
          );
          this.router.navigate(['/schedule']);
        });
    } else {
      this.gService
        .update('schedule', this.scheduleForm.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe((data: any) => {
          this.noti.mensajeRedirect(
            'Update Schedule',
            `Schedule updated: ${data.id}`,
            TipoMessage.success,
            'schedule'
          );
          this.router.navigate(['/schedule']);
        });
    }
  }

  onReset() {
    this.scheduleForm.reset();
  }

  onBack() {
    this.router.navigate(['/schedule']);
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

onBranchChange(event: Event): void {
    this.branchId = +(event.target as HTMLSelectElement).value;
  }

  // Suponiendo que tienes un método para obtener horarios y bloqueos existentes
  getExistingSchedulesAndBlocks(): Observable<any[]> {
    return this.gService.get('schedule/getByBranch', this.branchId).pipe(
      takeUntil(this.destroy$),
      catchError(error => {
        console.error('Error fetching schedules and blocks', error);
        return throwError(() => new Error('Error fetching schedules and blocks'));
      })
    );
  }
  
filterSchedulesByMonthYear(schedules: any[]): any[] {
  const startDate = new Date(this.selectedYear, this.selectedMonth, 1);
  const endDate = new Date(this.selectedYear, this.selectedMonth + 1, 0);
  endDate.setHours(23, 59, 59, 999);  
  console.log('Filtering schedules between:', startDate, 'and', endDate);

  return schedules.filter((schedule: any) => {
    const scheduleStartDate = new Date(schedule.startDate);
    console.log('Checking schedule date:', scheduleStartDate);
    return (
      scheduleStartDate >= startDate &&
      scheduleStartDate <= endDate
    );
  });
}
validateSchedule(newSchedule: any): Observable<boolean> {
  return this.getExistingSchedulesAndBlocks().pipe(
    map(existing => {
      // Validar superposición de horarios
      const hasOverlap = existing.some(existingSchedule => {
        return (
          existingSchedule.branchId === newSchedule.branchId &&
          this.isOverlapping(existingSchedule, newSchedule)
        );
      });

      // Validar superposición con bloqueos (si los bloqueos existen)
      const hasBlockOverlap = existing.some(existingBlock => {
        return (
          existingBlock.branchId === newSchedule.branchId &&
          this.isOverlapping(existingBlock, newSchedule)
        );
      });

      // Validar fecha de registro
      const isDateValid = new Date(newSchedule.startDate) >= new Date();

      if (hasOverlap) {
        throw new Error('Superposición de horarios.');
      }

      if (hasBlockOverlap) {
        throw new Error('Superposición de horarios con bloqueos.');
      }

      if (!isDateValid) {
        throw new Error('La fecha de inicio debe ser vigente.');
      }

      return true; // Indica que la validación ha pasado
    }),
    catchError(error => {
      // Maneja el error y propaga la excepción
      return throwError(() => new Error(error.message));
    })
  );
}

isOverlapping(existing: any, newSchedule: any): boolean {
  const existingStart = new Date(existing.startDate);
  const existingEnd = new Date(existing.endDate);
  const newStart = new Date(newSchedule.startDate);
  const newEnd = new Date(newSchedule.endDate);

  return (
    (newStart <= existingEnd && newEnd >= existingStart)
  );
}


}
