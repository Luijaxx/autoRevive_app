import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GenericService } from '../../share/generic.service';
import { AuthenticationService } from '../../share/authentication.service';
import { FormErrorMessage } from '../../form-error-message';
import {
  NotificacionService,
  TipoMessage,
} from '../../share/notification.service';
import { DateTimePicker } from '@syncfusion/ej2-angular-calendars';

@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',
  styleUrl: './user-register.component.css',
})
export class UserRegisterComponent {
  hide = true;
  usuario: any;
  roles: any;
  formCreate: FormGroup;
  makeSubmit: boolean = false;
  destroy$: Subject<boolean> = new Subject<boolean>();
  branchList: any;
  constructor(
    public fb: FormBuilder,
    private router: Router,
    private gService: GenericService,
    private authService: AuthenticationService,
    private notificacion: NotificacionService
  ) {
    this.reactiveForm();
    this.listBranch();
  }

  reactiveForm() {
    this.formCreate = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      exactAddress: ['', [Validators.required]],
      birthDate: ['', [Validators.required]],
      branchId: ['', [Validators.required]],
    });
  }
  ngOnInit(): void {}
  submitForm() {
    this.makeSubmit = true;
    //Validación
    if (this.formCreate.invalid) {
      return;
    }
    //Crear usuario
    this.formCreate.patchValue({
      branchId:  this.formCreate.get('branchId').value,
    });
    this.authService

      .createUser(this.formCreate.value)
      .subscribe((respuesta: any) => {
        this.notificacion.mensajeRedirect(
          'User registered',
          'User Registered',
          TipoMessage.success,
          '/'
        );
        console.log(this.formCreate.value)
        this.router.navigate(['/user/login']);
      });
  }
  onReset() {
    this.formCreate.reset();
  }

  /* Manejar errores de formulario en Angular */

  public errorHandling = (controlName: string) => {
    let messageError = '';
    const control = this.formCreate.get(controlName);
    if (control.errors) {
      for (const message of FormErrorMessage) {
        if (
          control &&
          control.errors[message.forValidator] &&
          message.forControl == controlName
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
}
