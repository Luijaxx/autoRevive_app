import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable, Subject, takeUntil } from 'rxjs';
import { GenericService } from '../../share/generic.service';
import { NotificacionService, TipoMessage } from '../../share/notification.service';
import { FormErrorMessage } from '../../form-error-message';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css'
})
export class ProductFormComponent implements OnInit {
  destroy$: Subject<boolean> = new Subject<boolean>();
  titleForm: string = 'Crear';
  categoryList: any; 
  productInfo: any;
  respProduct: any;
  productForm: FormGroup;
  idProduct: number = 0;
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
    this.listCategory();
  }

  ngOnInit(): void {
    this.activeRouter.params.subscribe((params: Params) => {
      this.idProduct = params['id'];
      if (this.idProduct !== undefined) {
        this.isCreate = false;
        this.titleForm = 'Update';
        this.gService
          .get('product', this.idProduct)
          .pipe(takeUntil(this.destroy$))
          .subscribe((data: any) => {
            this.productInfo = data;
  
            // Format the price  to ensure it has .00
             this.productInfo.price = this.formatPriceValue(this.productInfo.price);
  
            this.productForm.patchValue({
              id: this.productInfo.id,
              name: this.productInfo.name,
              description: this.productInfo.description,
              imageUrl: this.productInfo.imageUrl,
              price: this.productInfo.price,
              warranty: this.productInfo.warranty,
              compatibility: this.productInfo.compatibility,
              categoryId: this.productInfo.categoryId
            });
  
            console.log(this.productForm.value);
          });
      }
    });
  }
  
  formatPriceValue(value: any): string {
    if (value && !isNaN(value)) {
      value = parseFloat(value).toFixed(2);
    }
    return value;
  }
  

  formularioReactive() {
    let number2decimals = /^[0-9]+[.,]{1,1}[0-9]{2,2}$/;
    this.productForm = this.fb.group({
      id: [null, null],
      name: [
        null,
        Validators.compose([
          Validators.required,
          Validators.minLength(2)
        ])
      ],
      description: [null, Validators.required],
      price: [
        null,
        Validators.compose([
          Validators.required,
          Validators.pattern(number2decimals)
        ])
      ],     
       compatibility: [null, Validators.required],
      warranty: [null, Validators.required],
      categoryId: [null, Validators.required],

      imageUrl: [null, Validators.required],

    });
  }

  listCategory() {
    this.categoryList = null;
    this.gService
      .list('ProductCategory')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.categoryList = data;
      });
  }

  public errorHandling = (controlName: string) => {
    let messageError = '';
    const control = this.productForm.get(controlName);
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

  submitproduct(): void {
    if (this.productForm.invalid) {
      return;
    }

    console.log(this.productForm.value);

    this.productForm.patchValue({
       price: parseFloat(this.productForm.get('price').value),
       categoryId: parseInt(this.productForm.get('categoryId').value),
      imageUrl: this.productForm.get('imageUrl').value 
    });

    this.guardarproduct();
  }

  guardarproduct() {
    console.log("Guardar entrando");
    if (this.isCreate) {
      this.gService
        .create('product', this.productForm.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe((data: any) => {
          this.respProduct = data;
          this.noti.mensajeRedirect(
            'Create product',
            `product Created: ${data.name}`,
            TipoMessage.success,
            'product-table'
          );
          this.router.navigate(['/product-table']);
        });
    } else {
      
      this.gService
        .update('product', this.productForm.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe((data: any) => {
          this.respProduct = data;
          this.noti.mensajeRedirect(
            'Update product',
            `product Updated: ${data.name}`,
            TipoMessage.success,
            'product-table'
          );
          this.router.navigate(['/product-table']);
        });
    }
  }

  onReset() {
    this.productForm.reset();
  }

  onBack() {
    this.router.navigate(['/product-table']);
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  formatPrice() {
    const priceControl = this.productForm.get('price');
    if (priceControl) {
      let value = priceControl.value;
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
        priceControl.setValue(value);
      }
    }
  }
}
