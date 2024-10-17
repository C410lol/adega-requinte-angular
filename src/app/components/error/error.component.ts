import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { LoadStatus } from '../../constants/LoadStatusEnum';

@Component({
  selector: 'app-error',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './error.component.html',
  styleUrl: './error.component.css'
})
export class ErrorComponent {

  @Input() loadStatus: LoadStatus = LoadStatus.ERROR;




  constructor(
    private router: Router
  ) { }




  isNotHomePage(): boolean {
    return this.router.url.slice(0, this.router.url.indexOf('?')) != '';
  }

}
