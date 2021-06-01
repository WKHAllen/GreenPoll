import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
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

import {
  FontAwesomeModule,
  FaIconLibrary,
} from '@fortawesome/angular-fontawesome';
import {
  faPlus,
  faUser,
  faSignOutAlt,
  faSignInAlt,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';

import { ChartsModule } from 'ng2-charts';

import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    IndexComponent,
    RegisterComponent,
    LoginComponent,
    LogoutComponent,
    VerifyComponent,
    PasswordResetComponent,
    ProfileComponent,
    NewPollComponent,
    PollComponent,
    EditPollComponent,
    NotFoundComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    FontAwesomeModule,
    ChartsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(faPlus, faUser, faSignOutAlt, faSignInAlt, faTimes);
  }
}
