import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PollService } from './poll.service';
import { LoginRegisterService } from '../login-register/login-register.service';

interface NewPollForm {
  title: string;
  description: string;
  [pollOptionField: string]: string;
}

@Component({
  selector: 'gp-new-poll',
  templateUrl: './new-poll.component.html',
  styleUrls: ['./new-poll.component.scss'],
})
export class NewPollComponent implements OnInit {
  maxOptions = 5;
  optionNums = Array.from({ length: this.maxOptions }, (_, i) => i + 1);
  submittingForm = false;
  errors: string[] = [];

  constructor(
    private pollService: PollService,
    private loginRegisterService: LoginRegisterService,
    private router: Router
  ) {}

  ngOnInit() {
    if (!this.loginRegisterService.loggedIn()) {
      this.router.navigate(['login'], { queryParams: { after: 'new' } });
    }
  }

  onNewPollSubmit(form: NewPollForm) {
    const options = this.optionNums
      .map((optionNum) => form[`pollOption${optionNum}`])
      .filter((value) => !!value);

    this.errors = [];

    if (form.title.length < 1 || form.title.length > 255) {
      this.errors.push('Title must be between 1 and 255 characters');
    }
    if (form.description.length < 1 || form.description.length > 1023) {
      this.errors.push('Description must be between 1 and 1023 characters');
    }
    if (options.length < 1 || options.length > this.maxOptions) {
      this.errors.push(
        `Please include between 1 and ${this.maxOptions} poll options`
      );
    }

    if (this.errors.length === 0) {
      this.submittingForm = true;

      this.pollService
        .createPoll(form.title, form.description)
        .then((poll) => {
          const pollID = poll.id as number;
          Promise.all(
            options.map((option) =>
              this.pollService.createPollOption(pollID, option)
            )
          )
            .then((_) => {
              this.router.navigate(['poll', pollID]);
            })
            .catch((err) => {
              this.submittingForm = false;
              this.errors.push(err);
            });
        })
        .catch((err) => {
          this.submittingForm = false;
          this.errors.push(err);
        });
    }
  }
}
