import { Component, inject } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CartService } from '../../share/cart.service';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../share/authentication.service';
import {
  NotificacionService,
  TipoMessage,
} from '../../share/notification.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  animations: [
    trigger('dropdownAnimation', [
      state('open', style({
        opacity: 1,
        transform: 'translateY(0)'
      })),
      state('closed', style({
        opacity: 0,
        transform: 'translateY(-1rem)'
      })),
      transition('closed => open', [
        animate('300ms ease-out')
      ]),
      transition('open => closed', [
        animate('300ms ease-in')
      ]),
    ])
  ]
})
export class HeaderComponent {
  openDropdowns: { [key: string]: boolean } = {};
  isAuthenticated:boolean
  currentUser:any
  qtyItems:Number=0
  authServices: AuthenticationService = inject(AuthenticationService);
  auth: boolean = false;

  constructor(private cartService: CartService,
    private router: Router,
    private authService: AuthenticationService,
    private notificacion: NotificacionService
  ) {
    this.authService.decodeToken.subscribe((user) => (this.currentUser = user));
    this.authService.isAuthenticated.subscribe((valor) => (this.auth = valor));
    //Obtener valor actual de la cantidad de items comprados
    this.qtyItems=this.cartService.quantityItems()
  }

  ngOnInit():void{
    //Suscripción al método que cuenta la cantidad de items comprados
    this.cartService.countItems.subscribe((valor)=>{
      this.qtyItems=valor
    })
   
    this.authService.isAuthenticated.subscribe((valor)=>{
      this.isAuthenticated=valor
    })
    this.authService.decodeToken.subscribe((user:any)=>{
      this.currentUser=user


    })
  }
  login(){
    this.router.navigate(['user/login']);
  }
  logout(){
    this.authService.logout();
    this.notificacion.mensajeRedirect(
      'User logged out',
      'User logged out',
      TipoMessage.info,
      '/'
    )
    this.router.navigate(['/']);
  }

  toggleDropdown(dropdownId: string) {
    // Cierra todos los dropdowns
    Object.keys(this.openDropdowns).forEach(key => {
      if (key !== dropdownId) {
        this.openDropdowns[key] = false;
      }
    });
  
    // Alterna el estado del dropdown seleccionado
    this.openDropdowns[dropdownId] = !this.openDropdowns[dropdownId];
  }
  

  closeDropdown(menu: string) {
    this.openDropdowns[menu] = false;
  }


}
