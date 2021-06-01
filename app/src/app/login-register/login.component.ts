import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginRegisterService } from './login-register.service';

interface LoginForm {
  email: string;
  password: string;
}

@Component({
  selector: 'gp-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  submittingForm = false;
  error = '';
  after = '';

  constructor(
    private loginRegisterService: LoginRegisterService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.activatedRoute.queryParamMap.subscribe((queryParams) => {
      this.after = queryParams.get('after') || '';
    });
  }

  onSubmit(form: LoginForm) {
    this.error = '';
    this.submittingForm = true;

    this.loginRegisterService
      .login(form.email, form.password)
      .then(() => this.router.navigate([this.after || '/']))
      .catch((err) => {
        this.submittingForm = false;
        this.error = err;
      });
  }
}
