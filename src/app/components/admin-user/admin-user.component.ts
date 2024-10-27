import { Component, Input } from '@angular/core';
import { UserType } from '../../types/UserType';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-user.component.html',
  styleUrl: './admin-user.component.css'
})
export class AdminUserComponent {

  @Input() user = {} as UserType;




  constructor(
    private router: Router
  ) { }




  isMember(member: boolean): string {
    if (member) return 'Consorciado';
    return 'Não Consorciado';
  }




  goToUserPage(): void {
    this.router.navigate([`${this.router.url}/user/${this.user.id}`]);
  }

}
