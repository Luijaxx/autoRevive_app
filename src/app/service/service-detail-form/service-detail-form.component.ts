import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { GenericService } from '../../share/generic.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-service-detail',
  templateUrl: './service-detail-form.component.html',
  styleUrl: './service-detail-form.component.css',
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
export class ServiceDetailComponent {
  data: any;
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private gService: GenericService, private route: ActivatedRoute) {
    let id = this.route.snapshot.paramMap.get('id');
    if (!isNaN(Number(id))) 
      this.getService(Number(id));
  }

  getService(id: any) {
    this.gService
      .get('service', id)
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