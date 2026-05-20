import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { AuthUser } from '../../../models/auth.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  user: AuthUser | null;
  constructor(private authService: AuthService) {
    this.user = this.authService.getCurrentUser();
  }
  logout(): void { this.authService.logout(); }
}