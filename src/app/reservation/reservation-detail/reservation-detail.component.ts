import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { GenericService } from '../../share/generic.service';

@Component({
  selector: 'app-reservation-detail',
  templateUrl: './reservation-detail.component.html',
  styleUrl: './reservation-detail.component.css'
})
export class ReservationDetailComponent {
  data: any;
destroy$: Subject<boolean> = new Subject<boolean>();
total: number = 0; 

constructor(private gService: GenericService, private route: ActivatedRoute) {
  let id = this.route.snapshot.paramMap.get('id');
  if (!isNaN(Number(id))) 
    this.getreservation(Number(id));
}

getreservation(id: any) {
  this.gService
    .get('reservation', id)
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
