import { Component, OnDestroy, OnInit } from '@angular/core';
import { GenericService } from '../../share/generic.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CartService } from '../../share/cart.service';
import {
  NotificacionService,
  TipoMessage,
} from '../../share/notification.service';
import { AuthenticationService } from '../../share/authentication.service';
@Component({
  selector: 'app-cart-all',
  templateUrl: './cart-all.component.html',
  styleUrl: './cart-all.component.css',
})
export class CartAllComponent {
  data: any[] = [];
  dataCanceled: any[] = [];
  destroy$: Subject<boolean> = new Subject<boolean>();
  // managerId: number | null = null;

  constructor(
    private cartService: CartService,
    private notificacionService: NotificacionService,
    private gService: GenericService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    let id = this.route.snapshot.paramMap.get('id');
    if (!isNaN(Number(id))) this.listInvoices(Number(id));
    this.listInvoices(id);
    this.listCanceledInvoices(id);
  }

  ngOnInit(): void {}

  listInvoices(id: any): void {
    this.gService
      .list('invoice/getByIdClient/' + id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any[]) => {
        console.log(data);
        this.data = data;
      });
  }

  listCanceledInvoices(id: any): void {
    this.gService
      .list('invoice/getByIdClientCanceled/' + id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any[]) => {
        console.log(data);
        this.dataCanceled = data;
      });
  }

  detail(id: number) {
    this.router.navigate(['/invoice', id]);
  }

  loadInvoice(id: number) {
    this.gService
      .get('invoice', id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.data = data;
        this.cartService.loadCart(data);
        this.notificacionService.mensajeRedirect(
          'Invoice loaded successfully',
          'Redirect to cart',
          TipoMessage.success,
          '/cart'
        );
        this.router.navigate(['/cart']);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
