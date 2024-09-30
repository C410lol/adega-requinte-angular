import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-back',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './back.component.html',
  styleUrl: './back.component.css'
})
export class BackComponent {

  constructor(
    private location: Location
  ) { }




  goBack(): void {
    if (window.history.length < 2) {
      this.location.go('/');
      return;
    }
    this.location.back();
  }

}
