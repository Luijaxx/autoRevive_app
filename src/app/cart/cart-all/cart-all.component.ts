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
  destroy$: Subject<boolean> = new Subject<boolean>();
  // managerId: number | null = null;

  constructor(
    private gService: GenericService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    let id = this.route.snapshot.paramMap.get('id');
    if (!isNaN(Number(id))) this.listInvoices(Number(id));
    this.listInvoices(id);
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

  detail(id: number) {
    this.router.navigate(['/invoice', id]);
  }

  loadInvoice(id: number) {
    this.gService
    .get('invoice', id)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data: any) => {
      this.data = data;
      data.invoiceDetails.forEach((element: any) => {
        localStorage.setItem('cart', JSON.stringify(element));

      });

    });
  }


  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
