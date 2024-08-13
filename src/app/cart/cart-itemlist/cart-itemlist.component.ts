import { Component } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { GenericService } from '../../share/generic.service';
import { Router } from '@angular/router';
import { CartService } from '../../share/cart.service';
import {
  NotificacionService,
  TipoMessage,
} from '../../share/notification.service';

@Component({
  selector: 'app-cart-itemlist',
  templateUrl: './cart-itemlist.component.html',
  styleUrl: './cart-itemlist.component.css',
})
export class CartItemlistComponent {
  dataProducts: any;
  dataServices: any;
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private gService: GenericService,
    private router: Router,
    private cartService: CartService,
    private noti: NotificacionService
  ) {
    this.listProducts();
    this.listServices();
  }

  //listar todos los videojuegos del API
  listProducts() {
    //url del que queremos
    this.gService
      .list('product/')
      .pipe(takeUntil(this.destroy$))
      .subscribe((respuesta: any) => {
        console.log(respuesta);
        this.dataProducts = respuesta;
      });
  }

  listServices() {
    //url del que queremos
    this.gService
      .list('Service/')
      .pipe(takeUntil(this.destroy$))
      .subscribe((respuesta: any) => {
        console.log(respuesta);
        this.dataServices = respuesta;
      });
  }

  addToCartProduct(id: number) {
    this.gService
      .get('product/', id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((respuesta: any) => {
        //Agregarlo a la compra
        this.cartService.addToCart(respuesta);
        this.noti.mensaje(
          'Order',
          'Product ' + respuesta.name + ' added to the order',
          TipoMessage.success
        );
      });
  }

  addToCartService(id: number) {
    this.gService
      .get('service/', id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((respuesta: any) => {
        //Agregarlo a la compra
        this.cartService.addToCart(respuesta);
        this.noti.mensaje(
          'Order',
          'Service ' + respuesta.name + ' added to the order',
          TipoMessage.success
        );
      });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
