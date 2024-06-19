import { Component } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { GenericService } from '../../share/generic.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent {
  data: any;
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private gService: GenericService, private route: ActivatedRoute) {
    let id = this.route.snapshot.paramMap.get('id');
    if (!isNaN(Number(id))) 
      this.getProduct(Number(id));
  }

  getProduct(id: any) {
    this.gService
      .get('product', id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        console.log(data);
        this.data = data;
      });
  }
  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}