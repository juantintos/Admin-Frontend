import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  permission?: string;
}

@Component({
  standalone: false,
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  navItems: NavItem[] = [
    { label: 'Dashboard', icon: 'pi pi-home',   route: '/dashboard' },
    { label: 'Productos', icon: 'pi pi-box',    route: '/products',  permission: 'products' },
    { label: 'Usuarios',  icon: 'pi pi-users',  route: '/users',     permission: 'users'    },
    { label: 'Perfiles',  icon: 'pi pi-id-card',route: '/profiles',  permission: 'profiles' },
    { label: 'Bitácora',  icon: 'pi pi-history',route: '/audit-logs',permission: 'profiles' },
  ];

  visibleItems: NavItem[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.visibleItems = this.navItems.filter(item =>
      !item.permission || this.authService.hasPermission(item.permission)
    );
  }
}