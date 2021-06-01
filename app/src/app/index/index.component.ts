import { Component, OnInit } from '@angular/core';
import { LoginRegisterService } from '../login-register/login-register.service';

@Component({
  selector: 'gp-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class IndexComponent implements OnInit {
  loggedIn = false;

  constructor(private loginRegisterService: LoginRegisterService) {}

  ngOnInit() {
    this.loggedIn = this.loginRegisterService.loggedIn();
  }
}
