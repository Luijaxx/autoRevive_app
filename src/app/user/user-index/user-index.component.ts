import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-user-index',
  templateUrl: './user-index.component.html',
  styleUrl: './user-index.component.css'
})
export class UserIndexComponent {
  constructor(
    private router: Router, 
    private route: ActivatedRoute) {
  

  }

  ngOnInit(): void {
    this.router.navigate(['/user/login'], { relativeTo: this.route });
  }
}
