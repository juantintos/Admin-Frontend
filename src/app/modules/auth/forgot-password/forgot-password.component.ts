import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent {
  form: FormGroup;
  loading  = false;
  sent     = false;

  constructor(
    private fb:             FormBuilder,
    private authService:    AuthService,
    private messageService: MessageService,
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  get f() { return this.form.controls; }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;

    this.authService.forgotPassword(this.form.value.email).subscribe({
      next: () => {
        this.loading = false;
        this.sent    = true;
      },
      error: () => {
        this.loading = false;
        // El backend siempre responde igual por seguridad,
        // así que este bloque rara vez se ejecuta
        this.messageService.add({
          severity: 'error',
          summary:  'Error',
          detail:   'Ocurrió un error. Intenta nuevamente.',
        });
      },
    });
  }
}