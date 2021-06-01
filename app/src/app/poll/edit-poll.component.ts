import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PollService, PollInfo, PollOptionInfo } from './poll.service';
import { ProfileService } from '../profile/profile.service';
import { LoginRegisterService } from '../login-register/login-register.service';

interface EditPollForm {
  title: string;
  description: string;
  [pollOptionField: string]: string;
}

interface EditOption {
  id: number;
  value: string;
}

interface DeleteOption {
  id: number;
}

interface NewOption {
  value: string;
}

@Component({
  selector: 'gp-edit-poll',
  templateUrl: './edit-poll.component.html',
  styleUrls: ['./edit-poll.component.scss'],
})
export class EditPollComponent implements OnInit {
  maxOptions = 5;
  optionNums = Array.from({ length: this.maxOptions }, (_, i) => i + 1);
  pollID = 0;
  pollInfo = false;
  poll: PollInfo = {};
  pollOptions: PollOptionInfo[] = [];
  loggedIn = false;
  canEdit = false;
  determinedEditStatus = false;
  submittingForm = false;
  errors: string[] = [];
  initError = '';

  constructor(
    private pollService: PollService,
    private profileService: ProfileService,
    private loginRegisterService: LoginRegisterService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.loggedIn = this.loginRegisterService.loggedIn();

    this.activatedRoute.paramMap.subscribe((paramMap) => {
      const pollID = parseInt(paramMap.get('pollID') || '');

      if (isNaN(pollID)) {
        this.initError = 'Missing value for pollID';
      } else {
        this.pollID = pollID;

        Promise.all([
          this.pollService.getPollInfo(this.pollID),
          this.pollService.getPollOptions(this.pollID),
        ])
          .then(([pollInfo, pollOptions]) => {
            this.pollInfo = true;
            this.poll = pollInfo;
            this.pollOptions = pollOptions;

            if (this.loggedIn) {
              this.profileService
                .getUserInfo()
                .then((user) => {
                  this.canEdit = user.id === this.poll.user_id;
                  this.determinedEditStatus = true;
                })
                .catch((err) => this.errors.push(err));
            } else {
              this.determinedEditStatus = true;
            }
          })
          .catch((err) => (this.initError = err));
      }
    });
  }

  onEditPollSubmit(form: EditPollForm) {
    const options = this.optionNums.map(
      (optionNum) => form[`pollOption${optionNum}`]
    );

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

      Promise.all([
        this.pollService.setPollTitle(this.pollID, form.title),
        this.pollService.setPollDescription(this.pollID, form.description),
      ])
        .then(() => {
          let editOptions: EditOption[] = [];
          let deleteOptions: DeleteOption[] = [];
          let newOptions: NewOption[] = [];
          for (let i = 0; i < this.maxOptions; i++) {
            if (i < this.pollOptions.length && options[i].length > 0) {
              editOptions.push({
                id: this.pollOptions[i].id as number,
                value: options[i],
              });
            } else if (i < this.pollOptions.length && options[i].length === 0) {
              deleteOptions.push({ id: this.pollOptions[i].id as number });
            } else if (i >= this.pollOptions.length && options[i].length > 0) {
              newOptions.push({ value: options[i] });
            }
          }

          Promise.all(
            editOptions
              .map((editOption) =>
                this.pollService.setPollOptionValue(
                  editOption.id,
                  editOption.value
                )
              )
              .concat(
                deleteOptions.map((deleteOption) =>
                  this.pollService.deletePollOption(deleteOption.id)
                )
              )
          )
            .then(() => {
              Promise.all(
                newOptions.map((newOption) =>
                  this.pollService.createPollOption(
                    this.pollID,
                    newOption.value
                  )
                )
              )
                .then((_) => this.router.navigate(['poll', this.pollID]))
                .catch((err) => this.errors.push(err));
            })
            .catch((err) => this.errors.push(err));
        })
        .catch((err) => this.errors.push(err));
    }
  }
}
