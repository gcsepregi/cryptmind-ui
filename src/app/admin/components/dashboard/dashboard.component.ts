import { Component } from '@angular/core';
import {DashboardService} from '../../services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  constructor(private readonly dashboardService: DashboardService) {
    this.dashboardService.getStats().subscribe(res => {
      console.log(res);
    });
  }

}
