import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../core/shared/shared.module';
import { ProfileListComponent } from './profile-list.component';
import { ProfileFormComponent } from './profile-form/profile-form.component';

const routes: Routes = [{ path: '', component: ProfileListComponent }];

@NgModule({
  declarations: [ProfileListComponent, ProfileFormComponent],
  imports: [SharedModule, RouterModule.forChild(routes)],
})
export class ProfilesModule {}