import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileService, UserInfo } from './profile.service';
import { LoginRegisterService } from '../login-register/login-register.service';
import { PollInfo } from '../poll/poll.service';

interface SetUsernameForm {
  username: string;
}

interface SetPasswordForm {
  password: string;
  confirmPassword: string;
}

@Component({
  selector: 'gp-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  userInfo: UserInfo = {};
  newUsername: string = '';
  userPolls: PollInfo[] = [];
  gotUserInfo = false;
  gotUserPolls = false;
  userInfoError = '';
  userPollsError = '';
  submittingUsernameForm = false;
  submittingPasswordForm = false;
  logoutEverywhereClicked = false;
  setUsernameError = '';
  setPasswordError = '';
  logoutEverywhereError = '';
  showUsernameSuccess = false;
  showPasswordSuccess = false;

  constructor(
    private profileService: ProfileService,
    private loginRegisterService: LoginRegisterService,
    private router: Router
  ) {}

  ngOnInit() {
    if (!this.loginRegisterService.loggedIn()) {
      this.router.navigate(['login'], { queryParams: { after: 'profile' } });
    } else {
      this.profileService
        .getUserInfo()
        .then((userInfo) => {
          this.userInfo = userInfo;
          this.userInfo.join_time = (userInfo.join_time as number) * 1000;
          this.newUsername = userInfo.username as string;
          this.gotUserInfo = true;

          this.profileService
            .getUserPolls()
            .then((userPolls) => {
              this.userPolls = userPolls.map((poll) => ({
                ...poll,
                create_time: (poll.create_time as number) * 1000,
              }));
              this.gotUserPolls = true;
            })
            .catch((err) => (this.userPollsError = err));
        })
        .catch((err) => (this.userInfoError = err));
    }
  }

  onSetUsernameSubmit(form: SetUsernameForm) {
    this.setUsernameError = '';

    if (form.username === this.userInfo?.username) {
      return;
    }
    if (form.username.length < 3 || form.username.length > 63) {
      this.setUsernameError = 'Username must be between 3 and 63 characters';
    }

    if (!this.setUsernameError) {
      this.submittingUsernameForm = true;

      this.profileService
        .setUsername(form.username)
        .then(() => {
          this.submittingUsernameForm = false;
          this.ngOnInit();
          this.showUsernameSuccess = true;

          setTimeout(() => {
            this.showUsernameSuccess = false;
          }, 3000);
        })
        .catch((err) => {
          this.submittingUsernameForm = false;
          this.setUsernameError = err;
        });
    }
  }

  onSetPasswordSubmit(form: SetPasswordForm) {
    this.setPasswordError = '';

    if (form.password.length < 8 || form.password.length > 255) {
      this.setPasswordError = 'Password must be at least 8 characters';
    }
    if (form.password !== form.confirmPassword) {
      this.setPasswordError = 'Passwords do not match';
    }

    if (!this.setPasswordError) {
      this.submittingPasswordForm = true;

      this.profileService
        .setPassword(form.password)
        .then(() => {
          this.submittingPasswordForm = false;
          this.showPasswordSuccess = true;

          setTimeout(() => {
            this.showPasswordSuccess = false;
          }, 3000);
        })
        .catch((err) => {
          this.submittingPasswordForm = false;
          this.setPasswordError = err;
        });
    }
  }

  logoutEverywhere() {
    this.logoutEverywhereError = '';
    this.logoutEverywhereClicked = true;

    this.loginRegisterService
      .logoutEverywhere()
      .then(() => this.router.navigate(['/']))
      .catch((err) => {
        this.logoutEverywhereClicked = false;
        this.logoutEverywhereError = err;
      });
  }
}
