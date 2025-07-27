import { Component } from '@angular/core';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faBars, faSkull} from '@fortawesome/free-solid-svg-icons';
import {SidebarService} from '../../services/sidebar.service';

@Component({
  selector: 'app-header',
    imports: [
        FaIconComponent
    ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  protected readonly faBars = faBars;

  constructor(private readonly sidebarService: SidebarService) { }

  toggleSidebar() {
    this.sidebarService.toggle();
  }

  protected readonly faSkull = faSkull;
}
