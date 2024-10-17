import { HttpClientModule, HttpStatusCode } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router, RouterModule } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { FormsModule } from '@angular/forms';
import { BackComponent } from "../../components/back/back.component";
import { DialogService } from '../../services/dialog.service';
import { AppMessages } from '../../constants/Messages';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [FormsModule, RouterModule, HttpClientModule, BackComponent],
  providers: [UsersService],
  templateUrl: './create.component.html',
  styleUrl: './create.component.css'
})
export class CreateComponent implements OnInit {

  redirectParam: string | null = null;

  statusMessage: string = '';

  name: string = '';
  email: string = '';
  phone: string = '';
  password: string = '';
  confPassword: string = '';




  constructor(
    private usersService: UsersService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dialogService: DialogService
  ) { }




  ngOnInit(): void {
    this.getRedirectParam();
  }




  getRedirectParam(): void {
    this.activatedRoute.queryParams.subscribe({
      next: (res) => this.redirectParam = res['redirectTo']
    });
  }




  createUser(): void {
    if (!this.isPasswordsTheSame()) {
      this.dialogService.openDialogError('A senha deve ser a mesma');
      return;
    }

    if (!this.isPhoneValid()) {
      this.dialogService.openDialogError('Número de telefone inválido');
      return;
    }

    if (!this.isFieldsOk()) {
      this.dialogService.openDialogError(AppMessages.fieldError);
      return;
    }

    const loadingDialog = this.dialogService.openLoadingDialog();

    this.usersService.createUser(
      { name: this.name, email: this.email, phone: this.phone, password: this.password }
    ).subscribe({
      next: (res) => {

        loadingDialog.close();

        if (res.body == null) return;

        localStorage.setItem('auth', JSON.stringify(res.body.value));

        if (this.redirectParam != null) {
          this.router.navigate([`${this.redirectParam}`]);
          return;
        }
        this.router.navigate(['/']);

      },
      error: (err) => {

        loadingDialog.close();

        console.error(err);
        this.dialogService.openDialogError(`${err.error.message}`);

      }
    })
  }




  isPasswordsTheSame(): boolean {
    if (!(this.password.trim() == this.confPassword.trim())) return false;
    return true;
  }

  isPhoneValid(): boolean {
    if (this.phone.trim().replace(/\D/g, '').length != 11) return false;
    return true;
  }

  isFieldsOk(): boolean {
    if (
      this.name.trim().length < 1 ||
      this.email.trim().length < 1 ||
      this.password.trim().length < 1 ||
      this.confPassword.trim().length < 1
    ) return false;
    return true;
  }




  goToLoginPage(): void {
    let options: NavigationExtras = {};

    if (this.redirectParam != null) {
      options = {queryParams: {redirectTo: `${this.redirectParam}`}};
    }

    this.router.navigate(['/login'], options);
  }

}
