import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { IndexComponent } from './index/index.component';
import { RegisterComponent } from './login-register/register.component';
import { LoginComponent } from './login-register/login.component';
import { LogoutComponent } from './login-register/logout.component';
import { VerifyComponent } from './verify/verify.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { ProfileComponent } from './profile/profile.component';
import { NewPollComponent } from './poll/new-poll.component';
import { PollComponent } from './poll/poll.component';
import { EditPollComponent } from './poll/edit-poll.component';
import { NotFoundComponent } from './error/not-found.component';

const routes: Routes = [
  { path: '', component: IndexComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LogoutComponent },
  { path: 'verify/:verifyID', component: VerifyComponent },
  { path: 'password-reset', component: PasswordResetComponent },
  { path: 'password-reset/:resetID', component: PasswordResetComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'new', component: NewPollComponent },
  { path: 'poll/:pollID', component: PollComponent },
  { path: 'poll', redirectTo: 'new' },
  { path: 'edit/:pollID', component: EditPollComponent },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
