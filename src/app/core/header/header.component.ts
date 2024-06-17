import { Component } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
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
        animate('5000ms ease-out')
      ]),
      transition('open => closed', [
        animate('5000ms ease-in')
      ]),
    ])
  ]
})
export class HeaderComponent {
  isOpen = false;

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  closeDropdown() {
    this.isOpen = false;
  }
}
