import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PasswordResetService } from './password-reset.service';

interface RequestPasswordResetForm {
  email: string;
}

interface PasswordResetForm {
  password: string;
  confirmPassword: string;
}

@Component({
  selector: 'gp-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss'],
})
export class PasswordResetComponent implements OnInit {
  submittingForm = false;
  requestSuccess = false;
  resetSuccess = false;
  resetID = '';
  checkingResetID = false;
  validResetID = true;
  error = '';

  constructor(
    private passwordResetService: PasswordResetService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((paramMap) => {
      const resetID = paramMap.get('resetID');

      if (resetID !== null) {
        this.checkingResetID = true;

        this.passwordResetService
          .passwordResetExists(resetID)
          .then((exists) => {
            this.resetID = resetID;
            this.validResetID = exists;
            this.checkingResetID = false;
          })
          .catch((err) => (this.error = err));
      }
    });
  }

  onRequestPasswordResetSubmit(form: RequestPasswordResetForm) {
    this.error = '';

    if (form.email.length < 5 || form.email.length > 63) {
      this.error = 'Email must be between 5 and 63 characters';
    }

    if (!this.error) {
      this.submittingForm = true;

      this.passwordResetService
        .requestPasswordReset(form.email)
        .then(() => (this.requestSuccess = true))
        .catch((err) => {
          this.submittingForm = false;
          this.error = err;
        });
    }
  }

  onPasswordResetSubmit(form: PasswordResetForm) {
    this.error = '';

    if (form.password.length < 8 || form.password.length > 255) {
      this.error = 'New password must be at least 8 characters';
    }
    if (form.password !== form.confirmPassword) {
      this.error = 'New passwords do not match';
    }

    if (!this.error) {
      this.submittingForm = true;

      this.passwordResetService
        .resetPassword(this.resetID, form.password)
        .then(() => (this.resetSuccess = true))
        .catch((err) => {
          this.submittingForm = false;
          this.error = err;
        });
    }
  }
}
