import { Component, OnInit } from '@angular/core';
import { LoginRegisterService } from '../login-register/login-register.service';

@Component({
  selector: 'gp-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  loggedIn = false;

  constructor(private loginRegisterService: LoginRegisterService) {}

  ngOnInit() {
    this.loggedIn = this.loginRegisterService.loggedIn();
    this.loginRegisterService.loggedInChange.subscribe(
      (loggedIn) => (this.loggedIn = loggedIn)
    );
  }
}
