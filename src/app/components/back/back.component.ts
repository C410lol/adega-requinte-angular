import { Location } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-back',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './back.component.html',
  styleUrl: './back.component.css'
})
export class BackComponent {

  @Input() url?: string;




  constructor(
    private location: Location,
    private router: Router
  ) { }




  goBack(): void {
    if (this.url != null) {
      this.router.navigate([this.url]);
      return;
    }

    if (window.history.length < 2) {
      this.location.go('/');
      return;
    }
    
    this.location.back();
  }

}
