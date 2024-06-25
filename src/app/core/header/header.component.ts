import { Component } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';

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

  toggleDropdown(menu: string) {
    // Cierra todos los menús antes de abrir el menú seleccionado
    for (const key in this.openDropdowns) {
      if (this.openDropdowns.hasOwnProperty(key)) {
        this.openDropdowns[key] = false;
      }
    }
    // Abre el menú seleccionado
    this.openDropdowns[menu] = true;
  }

  closeDropdown(menu: string) {
    this.openDropdowns[menu] = false;
  }
}
