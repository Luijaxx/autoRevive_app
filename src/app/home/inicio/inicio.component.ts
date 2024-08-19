import { Component } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { GenericService } from '../../share/generic.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent {
  data: any;
  destroy$: Subject<boolean> = new Subject<boolean>();
  constructor(private gService: GenericService) {
    this.listBranch();
  }


  listBranch() {
    //url del que queremos
    this.gService
      .list('branch/')
      .pipe(takeUntil(this.destroy$))
      .subscribe((respuesta: any) => {
        console.log(respuesta);
        this.data = respuesta;
      });
  }


  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
