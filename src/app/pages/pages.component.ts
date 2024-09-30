import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from "../components/header/header.component";
import { UserType } from '../types/UserType';
import { AuthReturnType } from '../types/AuthReturnType';
import { HttpClientModule } from '@angular/common/http';
import { UsersService } from '../services/users.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pages',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterOutlet, HeaderComponent],
  providers: [UsersService],
  templateUrl: './pages.component.html',
  styleUrl: './pages.component.css'
})
export class PagesComponent implements OnInit {

  isLoaded: boolean = false;

  user = {} as UserType;




  constructor(
    private router: Router,
    private usersService: UsersService
  ) {}




  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        window.scrollTo(0, 0);
      }
    });
    this.getUser();

  }



  getUser(): void {
    const authLStorage = localStorage.getItem('auth');
    if (authLStorage == null) { this.isLoaded = true; return; }

    const auth: AuthReturnType = JSON.parse(authLStorage);
    this.usersService.getById(auth.userId).subscribe({
      next: (res) => {

        if (!res.ok || res.body == null) { this.isLoaded = true; return; }


        sessionStorage.setItem('user', JSON.stringify(res.body.value));
        this.isLoaded = true;

      },
      error: (err) => {

        console.error(err);
        this.isLoaded = true;

      }
    });
  }

}
