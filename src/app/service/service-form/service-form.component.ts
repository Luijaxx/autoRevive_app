import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable, Subject, takeUntil } from 'rxjs';
import { GenericService } from '../../share/generic.service';
import { NotificacionService, TipoMessage } from '../../share/notification.service';
import { FormErrorMessage } from '../../form-error-message';

@Component({
  selector: 'app-service-form',
  templateUrl: './service-form.component.html',
  styleUrls: ['./service-form.component.css']
})
export class ServiceFormComponent implements OnInit {
  destroy$: Subject<boolean> = new Subject<boolean>();
  titleForm: string = 'Crear';
  serviceTypeList: any; 
  serviceInfo: any;
  respService: any;
  serviceForm: FormGroup;
  idService: number = 0;
  isCreate: boolean = true;
  number4digits = /^\d{4}$/;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activeRouter: ActivatedRoute,
    private gService: GenericService,
    private noti: NotificacionService
  ) {
    this.formularioReactive();
    this.listServiceType();
  }

  ngOnInit(): void {
    this.activeRouter.params.subscribe((params: Params) => {
      this.idService = params['id'];
      if (this.idService !== undefined) {
        this.isCreate = false;
        this.titleForm = 'Update';
        this.gService
          .get('service', this.idService)
          .pipe(takeUntil(this.destroy$))
          .subscribe((data: any) => {
            this.serviceInfo = data;
  
            // Format the priceRate to ensure it has .00
            this.serviceInfo.priceRate = this.formatPriceRateValue(this.serviceInfo.priceRate);
  
            this.serviceForm.patchValue({
              id: this.serviceInfo.id,
              name: this.serviceInfo.name,
              description: this.serviceInfo.description,
              imageUrl: this.serviceInfo.imageUrl,
              priceRate: this.serviceInfo.priceRate,
              serviceTime: this.serviceInfo.serviceTime,
              warranty: this.serviceInfo.warranty,
              serviceTypeId: this.serviceInfo.serviceTypeId
            });
  
            console.log(this.serviceForm.value);
          });
      }
    });
  }
  
  formatPriceRateValue(value: any): string {
    if (value && !isNaN(value)) {
      value = parseFloat(value).toFixed(2);
    }
    return value;
  }
  

  formularioReactive() {
    let number2decimals = /^[0-9]+[.,]{1,1}[0-9]{2,2}$/;
    this.serviceForm = this.fb.group({
      id: [null, null],
      name: [
        null,
        Validators.compose([
          Validators.required,
          Validators.minLength(2)
        ])
      ],
      description: [null, Validators.required],
      priceRate: [
        null,
        Validators.compose([
          Validators.required,
          Validators.pattern(number2decimals)
        ])
      ],      serviceTime: [null, Validators.required],
      warranty: [null, Validators.required],
      serviceTypeId: [null, Validators.required],

      imageUrl: [null, Validators.required],

    });
  }

  listServiceType() {
    this.serviceTypeList = null;
    this.gService
      .list('serviceType')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.serviceTypeList = data;
      });
  }

  public errorHandling = (controlName: string) => {
    let messageError = '';
    const control = this.serviceForm.get(controlName);
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

  submitservice(): void {
    if (this.serviceForm.invalid) {
      return;
    }

    console.log(this.serviceForm.value);

    this.serviceForm.patchValue({
       priceRate: parseFloat(this.serviceForm.get('priceRate').value),
       serviceTypeId: parseInt(this.serviceForm.get('serviceTypeId').value),
      imageUrl: this.serviceForm.get('imageUrl').value 
    });

    this.guardarservice();
  }

  guardarservice() {
    console.log("Guardar entrando");
    if (this.isCreate) {
      this.gService
        .create('service', this.serviceForm.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe((data: any) => {
          this.respService = data;
          this.noti.mensajeRedirect(
            'Create Service',
            `Service Created: ${data.name}`,
            TipoMessage.success,
            'service-table'
          );
          this.router.navigate(['/service-table']);
        });
    } else {
      
      this.gService
        .update('service', this.serviceForm.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe((data: any) => {
          this.respService = data;
          this.noti.mensajeRedirect(
            'Update Service',
            `Service Updated: ${data.name}`,
            TipoMessage.success,
            'service-table'
          );
          this.router.navigate(['/service-table']);
        });
    }
  }

  onReset() {
    this.serviceForm.reset();
  }

  onBack() {
    this.router.navigate(['/service-table']);
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  formatPriceRate() {
    const priceRateControl = this.serviceForm.get('priceRate');
    if (priceRateControl) {
      let value = priceRateControl.value;
      if (value && !isNaN(value)) {
        if (!value.includes('.')) {
          value += '.00';
        } else {
          const parts = value.split('.');
          if (parts[1].length === 1) {
            value += '0';
          } else if (parts[1].length === 0) {
            value += '00';
          }
        }
        priceRateControl.setValue(value);
      }
    }
  }
}
