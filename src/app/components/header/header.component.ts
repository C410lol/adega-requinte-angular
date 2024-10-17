import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UserType } from '../../types/UserType';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrls: [
    './header.component.css',
    './header.mobile.component.css',
    './account-section-styles.css'
  ]
})
export class HeaderComponent implements OnInit{

  isOnAccountTxt: boolean = false;
  isOnAdminTxt: boolean = false;

  isLogged: boolean = false;

  user = {} as UserType;

  nameFilter: string = '';




  constructor(
    private router: Router
  ) { }




  ngOnInit(): void {
    if (localStorage.getItem('auth') != null) this.isLogged = true;
    this.getUser();
  }




  submitWineSearch(): void {
    this.router.navigate(['/'],
      {
        queryParams: {name: `${this.nameFilter}`}, 
        queryParamsHandling: 'merge'
      }
    );
  }

  enterKeyClick(event: any): void {
    (event.target as HTMLInputElement).blur();
    this.submitWineSearch();
  }




  getUser(): void {
    const userSStorage = sessionStorage.getItem('user');
    if (userSStorage == null) return;

    const user: UserType = JSON.parse(userSStorage);
    this.user = user;
  }




  logout(): void {
    localStorage.removeItem('auth');
    sessionStorage.clear();
    location.reload();
  }


  

  enterAccountTxt(): void { this.isOnAccountTxt = true; }

  enterAdminTxt(): void { this.isOnAdminTxt = true; }

  leaveAccountTxt(): void { this.isOnAccountTxt = false; }

  leaveAdminTxt(): void { this.isOnAdminTxt = false; }




  clickUserItem(navigate: string): void {
    this.router.navigate([`/${navigate}`]);
    this.isOnAccountTxt = false;
  }

}
