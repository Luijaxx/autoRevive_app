import { Component } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { GenericService } from '../../share/generic.service';
import { Router } from '@angular/router';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-product-index',
  templateUrl: './product-index.component.html',
  styleUrls: ['./product-index.component.css'],
  animations: [
    trigger('fadeIn', [
      state('void', style({
        opacity: 0
      })),
      transition(':enter', [
        animate('500ms ease-in', style({
          opacity: 1
        }))
      ])
    ])
  ]
})
export class ProductIndexComponent {
  data: any;
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private gService: GenericService, private router: Router) {
    this.listProducts()
  }

  //listar todos los videojuegos del API
  listProducts() {
    //url del que queremos
    this.gService
      .list('product/')
      .pipe(takeUntil(this.destroy$))
      .subscribe((respuesta: any) => {
        console.log(respuesta);
        this.data = respuesta;
      });
  }

  detail(id:number){
      this.router.navigate(['/product',id])
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

 
  
}
