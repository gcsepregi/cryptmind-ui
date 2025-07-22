import { Component } from '@angular/core';
import {HomeIcon, LucideAngularModule, UserPlusIcon} from 'lucide-angular';
import {UserService} from '../../../services/user.service';
import {SignupData} from '../../../models/signup.model';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [
    LucideAngularModule,
    FormsModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  protected readonly UserPlusIcon = UserPlusIcon;
  protected readonly HomeIcon = HomeIcon;

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
    this.userService.signup(this.signupData).subscribe(res => {
      this.toastr.success('Registration successful');
      this.router.navigate(['/']).then(()=>{});
    })
  }
}
