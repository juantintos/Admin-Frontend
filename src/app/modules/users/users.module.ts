import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../core/shared/shared.module';
import { UserListComponent } from './user-list/user-list.component';
import { UserFormComponent } from './user-form/user-form.component';

const routes: Routes = [
  { path: '', component: UserListComponent },
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    UserListComponent,
    UserFormComponent],
})
export class UsersModule {}