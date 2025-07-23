import { Component } from '@angular/core';
import {AlertCircleIcon, HomeIcon, LucideAngularModule, UserPlusIcon} from 'lucide-angular';
import {UserService} from '../../../services/user.service';
import {SignupData} from '../../../models/signup.model';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [
    LucideAngularModule,
    FormsModule,
    NgIf
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  protected readonly UserPlusIcon = UserPlusIcon;
  protected readonly HomeIcon = HomeIcon;

  protected errorMessage: string = '';

  protected signupData: SignupData = {
    nickname: '',
    email: '',
    password: '',
    password_confirm: ''
  };

  constructor(private readonly userService: UserService,
              private readonly toastr: ToastrService,
              private readonly router: Router) { }

  register() {
    this.errorMessage = '';
    this.userService.signup(this.signupData).subscribe({
      next: res => {
        this.toastr.success('Registration successful');
        this.router.navigate(['/']).then(() => {
        });
      },
      error: err => {
        this.errorMessage = err.error?.errors.join('. ') || 'An unknown error occurred. Please try again.';
      }
    })
  }

  protected readonly AlertCircleIcon = AlertCircleIcon;
}
