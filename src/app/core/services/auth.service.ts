import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthUser, LoginRequest, LoginResponse } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'access_token';
  private readonly USER_KEY  = 'auth_user';
  private readonly API       = environment.apiUrl;

  private currentUserSubject = new BehaviorSubject<AuthUser | null>(
    this.getStoredUser()
  );

  private isLoggingOut = false; // ← bandera anti-loop

  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API}/auth/login`, credentials).pipe(
      tap(response => {
        if (response.success) {
          localStorage.setItem(this.TOKEN_KEY, response.access_token);
          localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));
          this.currentUserSubject.next(response.user);
        }
      })
    );
  }

  logout(): void {
    // Evitar loop infinito
    if (this.isLoggingOut) return;
    this.isLoggingOut = true;

    const token = this.getToken();

    if (token) {
      this.http.post(`${this.API}/auth/logout`, {}).subscribe({
        complete: () => this.clearSession(),
        error:    () => this.clearSession(), // aunque falle, limpia igual
      });
    } else {
      this.clearSession();
    }
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.API}/auth/forgot-password`, { email });
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  hasPermission(permission: string): boolean {
    const user = this.currentUserSubject.value;
    return user?.permissions?.includes(permission) ?? false;
  }

  getCurrentUser(): AuthUser | null {
    return this.currentUserSubject.value;
  }

  private getStoredUser(): AuthUser | null {
    try {
      const raw = localStorage.getItem(this.USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  private clearSession(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
    this.isLoggingOut = false;
    this.router.navigate(['/auth/login']);
  }
}