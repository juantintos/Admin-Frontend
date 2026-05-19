import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot, CanActivate, Router
} from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MessageService } from 'primeng/api';

@Injectable({ providedIn: 'root' })
export class PermissionGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService,
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const required = route.data['permission'] as string;

    if (!required || this.authService.hasPermission(required)) {
      return true;
    }

    this.messageService.add({
      severity: 'warn',
      summary: 'Acceso denegado',
      detail: `No tienes acceso al módulo: ${required}.`,
    });

    this.router.navigate(['/dashboard']);
    return false;
  }
}