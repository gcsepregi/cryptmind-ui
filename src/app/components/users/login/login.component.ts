import { Component } from '@angular/core';
import {HomeIcon, LogInIcon, LucideAngularModule} from 'lucide-angular';
import {UserService} from '../../../services/user.service';
import {FormsModule} from '@angular/forms';
import {LoginData} from '../../../models/login.model';
import {ActivatedRoute, Navigation, Router, RouterLink} from '@angular/router';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-login',
  imports: [
    LucideAngularModule,
    FormsModule,
    RouterLink,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  protected readonly LogInIcon = LogInIcon;
  protected readonly HomeIcon = HomeIcon;

  protected loginData: LoginData = {email: '', password: ''};

  constructor(private readonly userService: UserService,
              private readonly toastr: ToastrService,
              private readonly router: Router) { }

  signIn() {
    this.userService.login(this.loginData).subscribe(res => {
      this.toastr.success('Login successful');
      this.router.navigate(['/']).then(()=>{});
    });
  }
}
