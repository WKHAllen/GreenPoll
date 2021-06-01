import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VerifyService } from './verify.service';

@Component({
  selector: 'gp-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss'],
})
export class VerifyComponent implements OnInit {
  verifySuccess = false;
  error = '';

  constructor(
    private verifyService: VerifyService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((paramMap) => {
      const verifyID = paramMap.get('verifyID');

      if (verifyID === null) {
        this.error = 'Missing value for verifyID';
      } else {
        this.verifyService
          .verifyAccount(verifyID)
          .then(() => (this.verifySuccess = true))
          .catch((err) => (this.error = err));
      }
    });
  }
}
