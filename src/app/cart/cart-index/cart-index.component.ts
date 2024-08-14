import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../share/cart.service';
import {
  NotificacionService,
  TipoMessage,
} from '../../share/notification.service';
import { GenericService } from '../../share/generic.service';
import { Subject, takeUntil } from 'rxjs';
import { AuthenticationService } from '../../share/authentication.service';
@Component({
  selector: 'app-cart-index',
  templateUrl: './cart-index.component.html',
  styleUrl: './cart-index.component.css',
})
export class CartIndexComponent {
  total: number = 0;
  date: Date = new Date();
  qtyItems: number = 0;
  items: any = [];
  destroy$: Subject<boolean> = new Subject<boolean>();
  authService: AuthenticationService = inject(AuthenticationService);
  auth: boolean = false;
  currentUser: any;
  constructor(
    private cartService: CartService,
    private router: Router,
    private notificacionService: NotificacionService,
    private genericService: GenericService
  ) {
    this.items = this.cartService.getItems;
    this.cartService.totalCart.subscribe((data) => {
      this.total = data;
    });
    this.authService.decodeToken.subscribe((user) => (this.currentUser = user));
    this.authService.isAuthenticated.subscribe((valor) => (this.auth = valor));
    this.total = this.cartService.calculateNetTotal();
  }

  ngOnInit(): void {
    this.cartService.totalCart.subscribe((data) => {
      this.total = data;
    });
  }

  updateCart(item: any) {
    this.cartService.addToCart(item);
  }

  deleteItem(item: any) {
    this.cartService.removeFromCart(item);
  }

  checkout() {
    const items = this.cartService.getItems;
    if (items?.length > 0) {
      if (this.currentUser == null) {
        this.notificacionService.mensaje(
          'You must login to make a purchase',
          'Redirect to login page',
          TipoMessage.warning
        );
        this.router.navigate(['/user']);
        return;
      }
      let item = this.cartService.getItems;

      let order = {
        ['date']: this.date,
        ['total']: this.total,
        ['userId']: this.currentUser.id,
        ['branchId']: this.currentUser.branchId,
        ['canceled']: 'YES',
      };

      this.genericService.create('invoice', order).subscribe((data: any) => {
        this.notificacionService.mensaje(
          'Order created successfully',
          'Order#' + data.id,
          TipoMessage.success
        );
        const invoiceId = data.id;
        let detail = item.map((item: any) => ({
          ['invoiceId']: invoiceId,
          ['productId']: item.idItem,
          ['serviceId']: item.idItemService,
          ['quantity']: item.quantity,
          ['subtotal']: item.subtotal,
          ['date']: this.date,
        }));
        detail.forEach((detail: any) => {
          this.genericService.create('invoiceDetail', detail).subscribe(
            (detailResponse: any) => {
              console.log('InvoiceDetail:', detailResponse);
            },
            (error: any) => {
              console.error('Error:', error);
            }
          );
        });
        this.cartService.deleteCart();
      });
    } else {
      this.notificacionService.mensaje(
        'You must add products to the cart',
        'Order',
        TipoMessage.warning
      );
    }
  }

  addToCartProduct(id: number) {
    this.genericService
      .get('product/', id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((respuesta: any) => {
        //Agregarlo a la compra
        this.cartService.addToCart(respuesta);
      });
  }

  addToCartService(id: number) {
    this.genericService
      .get('service/', id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((respuesta: any) => {
        //Agregarlo a la compra
        this.cartService.addToCart(respuesta);
      });
  }

  addItemToCart(item: any) {
    if (item.hasOwnProperty('product')) {
      this.addToCartProduct(item.idItem);
    } else {
      this.addToCartService(parseInt(item.idItemService));
    }
  }

  deleteItemFromCart(item: any) {
    this.cartService.deleteItem(item);
  }
  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  getTotal() {
    return this.cartService.calculateTotal();
  }
  getTotalTax() {
    return this.cartService.calculateTotalTax();
  }
  getNetTotal() {
    return this.cartService.calculateNetTotal();
  }

  getUser() {
    return this.currentUser.id;
  }
}
