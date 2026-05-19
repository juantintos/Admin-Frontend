import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../core/shared/shared.module';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

const routes: Routes = [
  { path: 'login',           component: LoginComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: '',                redirectTo: 'login', pathMatch: 'full' },
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    LoginComponent,
    ForgotPasswordComponent],
})
export class AuthModule {}