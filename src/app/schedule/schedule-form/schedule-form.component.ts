import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { GenericService } from '../../share/generic.service';
import { NotificacionService, TipoMessage } from '../../share/notification.service';
import { FormErrorMessage } from '../../form-error-message';
import moment from 'moment';
moment.locale("es");


@Component({
  selector: 'app-schedule-form',
  templateUrl: './schedule-form.component.html',
  styleUrls: ['./schedule-form.component.css']
})
export class ScheduleFormComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  titleForm: string = 'Create';
  scheduleForm: FormGroup;
  idSchedule: number = 0;
  isCreate: boolean = true;
  branchList: any;
  scheduleInfo: any;
  parseDate :any;

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
            this.parseDate = moment(this.scheduleInfo.startDate).format()
            this.scheduleForm.patchValue({
              id: this.scheduleInfo.id,
              branchId: this.scheduleInfo.branchId,
              availability: this.scheduleInfo.availability,
              startDate: this.parseDate,
              endDate: new Date(this.scheduleInfo.endDate),
              description: this.scheduleInfo.description
            });
            console.log(this.parseDate); 
          });
      }
    });
  }

  formularioReactive() {
    this.scheduleForm = this.fb.group({
      id: [null],
      branchId: [null, Validators.required],
      availability: ['SCHEDULE', Validators.required],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
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
        console.log('Branch List:', data); // Verifica que los datos se reciben correctamente
        this.branchList = data;
      });
  }


  submitSchedule(): void {
    if (this.scheduleForm.invalid) {
      return;
    }

    this.scheduleForm.patchValue({
      branchId: parseInt(this.scheduleForm.get('branchId').value),

   });
   console.log(this.scheduleForm.value);

    this.guardarSchedule();
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
}

