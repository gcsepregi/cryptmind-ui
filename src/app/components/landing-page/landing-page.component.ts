import { Component } from '@angular/core';
import {
  BookAIcon,
  LockIcon,
  LogInIcon,
  LucideAngularModule, PenLineIcon,
  SearchCheckIcon,
  SkullIcon,
  UserPlusIcon, Users2Icon
} from 'lucide-angular';

@Component({
  selector: 'app-landing-page',
  imports: [
    LucideAngularModule
  ],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent {

  protected readonly SkullIcon = SkullIcon;
  protected readonly UserPlusIcon = UserPlusIcon;
  protected readonly LoginIcon = LogInIcon;
  protected readonly LockIcon = LockIcon;
  protected readonly BookAIcon = BookAIcon;
  protected readonly SearchCheckIcon = SearchCheckIcon;
  protected readonly PenLineIcon = PenLineIcon;
  protected readonly Users2Icon = Users2Icon;
}
