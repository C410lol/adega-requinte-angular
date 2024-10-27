import { Component, OnInit } from '@angular/core';
import { LoadStatus } from '../../constants/LoadStatusEnum';
import { CommonModule } from '@angular/common';
import { ErrorComponent } from '../../components/error/error.component';
import { AdminUserComponent } from "../../components/admin-user/admin-user.component";
import { UserType } from '../../types/UserType';
import { HttpClientModule } from '@angular/common/http';
import { UsersService } from '../../services/users.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [
    CommonModule, 
    ErrorComponent, 
    AdminUserComponent,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    UsersService
  ],
  templateUrl: './admin-users.component.html',
  styleUrls: [
    '../../styles/product-styles.css',
    '../../styles/input-styles.css',
    './admin-users.component.css'
  ]
})
export class AdminUsersComponent implements OnInit {

  loadStatus: LoadStatus = LoadStatus.LOADING;

  userInput: string = '';
  timer: any;

  users: UserType[] = [];




  constructor(
    private usersService: UsersService
  ) { }




  ngOnInit(): void {
    this.getClients();
  }




  getClients(): void {
    this.usersService.getClients(this.userInput).subscribe({
      next: (res) => {

        if (res.body == null) {
          this.loadStatus = LoadStatus.ERROR;
          return;
        }

        if (res.body.value.length < 1) {
          this.loadStatus = LoadStatus.EMPTY;
          return;
        }

        this.users = res.body.value;
        this.loadStatus = LoadStatus.LOADED;

      },
      error: (err) => {

        console.error(err);
        this.loadStatus = LoadStatus.ERROR;

      }
    });
  }




  userInputChange(): void {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.getClients(), 500);
  }

}
