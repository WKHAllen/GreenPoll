import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginRegisterService } from './login-register.service';

@Component({
  selector: 'gp-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss'],
})
export class LogoutComponent implements OnInit {
  error = '';

  constructor(
    private loginRegisterService: LoginRegisterService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loginRegisterService
      .logout()
      .then(() => this.router.navigate(['/']))
      .catch((err) => {
        this.error = err;
      });
  }
}
