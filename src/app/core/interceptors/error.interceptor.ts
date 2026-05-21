import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpHandler, HttpInterceptor,
  HttpRequest, HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { MessageService } from 'primeng/api';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private authService:    AuthService,
    private messageService: MessageService,
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (req.url.includes('/auth/logout')) {
          return throwError(() => error);
        }
        if (error.status === 401) {
          this.authService.logout();
          return throwError(() => error);
        }
        if (error.status === 403) {
          this.messageService.add({ severity: 'warn', summary: 'Sin acceso', detail: 'No tienes permiso.' });
          return throwError(() => error);
        }
        if (error.status === 422) {
          const errors = error.error?.errors;
          if (errors) {
            const first = Object.values(errors)[0] as string[];
            this.messageService.add({ severity: 'error', summary: 'Validación', detail: first[0] });
          }
          return throwError(() => error);
        }
        if (error.status >= 500) {
          this.messageService.add({ severity: 'error', summary: 'Error servidor', detail: 'Error inesperado.' });
        }
        return throwError(() => error);
      })
    );
  }
}