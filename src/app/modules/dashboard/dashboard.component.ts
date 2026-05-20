import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { ProductService } from '../../core/services/product.service';
import { UserService } from '../../core/services/user.service';
import { ProfileService } from '../../core/services/profile.service';
import { AuditLogService } from '../../core/services/audit-log.service';
import { AuthUser } from '../../core/models/auth.model';
import { AuditLog } from '../../core/models/audit-log.model';

interface StatCard {
  label: string;
  value: number;
  icon: string;
  color: string;
  permission?: string;
}

@Component({
  standalone: false,
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  user: AuthUser | null;
  recentLogs: AuditLog[] = [];
  stats: StatCard[] = [
    { label: 'Productos', value: 0, icon: 'pi pi-box',     color: '#6c63ff', permission: 'products' },
    { label: 'Usuarios',  value: 0, icon: 'pi pi-users',   color: '#0f3460', permission: 'users'    },
    { label: 'Perfiles',  value: 0, icon: 'pi pi-id-card', color: '#1b5e20', permission: 'profiles' },
  ];

  constructor(
    public  authService:    AuthService,
    private productService: ProductService,
    private userService:    UserService,
    private profileService: ProfileService,
    private auditService:   AuditLogService,
  ) {
    this.user = this.authService.getCurrentUser();
  }

  ngOnInit(): void { this.loadStats(); this.loadRecentLogs(); }

  private loadStats(): void {
    const calls: any = {};
    if (this.authService.hasPermission('products')) calls['products'] = this.productService.getAll({ per_page: 1 });
    if (this.authService.hasPermission('users'))    calls['users']    = this.userService.getAll({ per_page: 1 });
    if (this.authService.hasPermission('profiles')) calls['profiles'] = this.profileService.getAll({ per_page: 1 });
    if (!Object.keys(calls).length) return;
    forkJoin(calls).subscribe((results: any) => {
      this.stats = this.stats.map(s => {
        const key = s.label.toLowerCase();
        if (results[key]) s.value = results[key].data.total;
        return s;
      });
    });
  }

  private loadRecentLogs(): void {
    if (!this.authService.hasPermission('profiles')) return;
    this.auditService.getAll({ per_page: 8 }).subscribe({
      next: res => { this.recentLogs = res.data.items; },
    });
  }

  get visibleStats(): StatCard[] {
    return this.stats.filter(s => !s.permission || this.authService.hasPermission(s.permission));
  }

  actionSeverity(action: string): string {
    return ({ created: 'success', updated: 'warning', deleted: 'danger' } as any)[action] ?? 'info';
  }
}