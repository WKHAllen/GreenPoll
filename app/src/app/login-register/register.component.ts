import { Component } from '@angular/core';
import { LoginRegisterService } from './login-register.service';

interface RegisterForm {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

@Component({
  selector: 'gp-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  submittingForm = false;
  registerSuccess = false;
  errors: string[] = [];

  constructor(private loginRegisterService: LoginRegisterService) {}

  onSubmit(form: RegisterForm) {
    this.errors = [];

    if (form.username.length < 3 || form.username.length > 63) {
      this.errors.push('Username must be between 3 and 63 characters');
    }
    if (form.email.length < 5 || form.email.length > 63) {
      this.errors.push('Email must be between 5 and 63 characters');
    }
    if (form.password.length < 8 || form.password.length > 255) {
      this.errors.push('Password must be at least 8 characters');
    }
    if (form.password !== form.confirmPassword) {
      this.errors.push('Passwords do not match');
    }

    if (this.errors.length === 0) {
      this.submittingForm = true;

      this.loginRegisterService
        .register(form.username, form.email, form.password)
        .then(() => (this.registerSuccess = true))
        .catch((err) => {
          this.submittingForm = false;
          this.errors.push(err);
        });
    }
  }
}
