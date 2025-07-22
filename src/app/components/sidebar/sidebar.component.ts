import { Component } from '@angular/core';
import {NgIf} from '@angular/common';
import {LucideAngularModule, MenuIcon, SkullIcon, XIcon} from 'lucide-angular';

@Component({
  selector: 'app-sidebar',
  imports: [
    NgIf,
    LucideAngularModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {

  public isCollapsed = true;
  public SkullIcon = SkullIcon;

  protected readonly XIcon = XIcon;

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  protected readonly MenuIcon = MenuIcon;
}
