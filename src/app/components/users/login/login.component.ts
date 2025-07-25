import { Component } from '@angular/core';
import {UserService} from '../../../services/user.service';
import {FormsModule} from '@angular/forms';
import {LoginData} from '../../../models/login.model';
import {ActivatedRoute, Navigation, Router, RouterLink} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {catchError} from 'rxjs';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {faRightToBracket, faHome, faCircleExclamation} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-login',
  imports: [
    FontAwesomeModule,
    FormsModule,
    RouterLink
],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  protected readonly faRightToBracket = faRightToBracket;
  protected readonly faHome = faHome;
  protected readonly faCircleExclamation = faCircleExclamation;

  protected loginData: LoginData = {email: '', password: ''};
  protected errorMessage: string = '';

  constructor(private readonly userService: UserService,
              private readonly toastr: ToastrService,
              private readonly router: Router) { }

  signIn() {
    this.userService.login(this.loginData)
      .pipe(catchError(err => {
        this.errorMessage = "Invalid credentials";
        return err;
      }))
      .subscribe(res => {
      this.toastr.success('Login successful');
      this.router.navigate(['/']).then(()=>{});
    });
  }
}
