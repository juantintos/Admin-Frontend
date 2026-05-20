import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared.module';
import { LayoutComponent } from './layout.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';
import { PermissionGuard } from '../../../guards/permission.guard';
import { AuthGuard } from '../../../guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('../../../../modules/dashboard/dashboard.module')
            .then(m => m.DashboardModule),
      },
      {
        path: 'products',
        canActivate: [PermissionGuard],
        data: { permission: 'products' },
        loadChildren: () =>
          import('../../../../modules/products/products.module')
            .then(m => m.ProductsModule),
      },
      {
        path: 'users',
        canActivate: [PermissionGuard],
        data: { permission: 'users' },
        loadChildren: () =>
          import('../../../../modules/users/users.module')
            .then(m => m.UsersModule),
      },
      {
        path: 'profiles',
        canActivate: [PermissionGuard],
        data: { permission: 'profiles' },
        loadChildren: () =>
          import('../../../../modules/profiles/profiles.module')
            .then(m => m.ProfilesModule),
      },
      {
        path: 'audit-logs',
        canActivate: [PermissionGuard],
        data: { permission: 'profiles' },
        loadChildren: () =>
          import('../../../../modules/audit-logs/audit-logs.module')
            .then(m => m.AuditLogsModule),
      },
    ],
  },
];

@NgModule({
  declarations: [
    LayoutComponent,
    SidebarComponent,
    HeaderComponent,
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
  ],
})
export class LayoutModule {}