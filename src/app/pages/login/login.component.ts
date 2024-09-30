import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router, RouterModule } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BackComponent } from "../../components/back/back.component";
import { DialogService } from '../../services/dialog.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterModule, HttpClientModule, BackComponent],
  providers: [UsersService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  redirectParam: string | null = null;

  statusMessage: string = '';

  email: string = '';
  password: string = '';




  constructor(
    private dialogService: DialogService,
    private usersService: UsersService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }




  ngOnInit(): void {
    this.getRedirectParam();
  }




  getRedirectParam(): void {
    this.activatedRoute.queryParams.subscribe({
      next: (res) => this.redirectParam = res['redirectTo']
    });
  } 




  loginUser(): void {
    if (!this.isFieldsOk()) {
      this.dialogService.openDialogError('Verifique os campos e tente novamente');
      return;
    }

    this.usersService.loginUser(
      {email: this.email, password: this.password}
    ).subscribe({
      next: (res) => {

        if (res.body == null) return;

        localStorage.setItem('auth', JSON.stringify(res.body.value));

        if (this.redirectParam != null) {
          this.router.navigate([`${this.redirectParam}`]);
          return;
        }
        this.router.navigate(['/']);

      },
      error: (err) => {

        console.log(err);
        this.dialogService.openDialogError(`${err.error.message}`);

      }
    });
  }




  isFieldsOk(): boolean {
    if (
      this.email.trim().length < 1 ||
      this.password.trim().length < 1
    ) return false;
    return true;
  }




  goToCreatePage(): void {
    let options: NavigationExtras = {};

    if (this.redirectParam != null) {
      options = {queryParams: {redirectTo: `${this.redirectParam}`}};
    }

    this.router.navigate(['/create'], options);
  }

}
