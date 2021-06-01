import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  PollService,
  PollInfo,
  PollOptionInfo,
  PollVoteInfo,
  PollUserVoteInfo,
} from './poll.service';
import { ProfileService } from '../profile/profile.service';
import { LoginRegisterService } from '../login-register/login-register.service';
import { ChartType, ChartOptions } from 'chart.js';
import {
  SingleDataSet,
  Label,
  Color,
  monkeyPatchChartJsLegend,
  monkeyPatchChartJsTooltip,
} from 'ng2-charts';

@Component({
  selector: 'gp-poll',
  templateUrl: './poll.component.html',
  styleUrls: ['./poll.component.scss'],
})
export class PollComponent implements OnInit {
  pollID = 0;
  pollInfo = false;
  poll: PollInfo = {};
  pollOptions: PollOptionInfo[] = [];
  pollVotes: PollVoteInfo[] = [];
  pollUserVotes: PollUserVoteInfo[] = [];
  selectedOption = 0;
  loggedIn = false;
  canEdit = false;
  error = '';
  refreshInterval = 60;

  pieChartOptions: ChartOptions = {
    responsive: true,
  };
  pieChartLabels: Label[] = [];
  pieChartData: SingleDataSet = [];
  pieChartType: ChartType = 'pie';
  pieChartLegend = true;
  pieChartPlugins = [];
  pieChartColors: Color[] = [];

  constructor(
    private pollService: PollService,
    private profileService: ProfileService,
    private loginRegisterService: LoginRegisterService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();

    this.loggedIn = this.loginRegisterService.loggedIn();
    this.pieChartColors = [this.generateColors(5)];

    this.activatedRoute.paramMap.subscribe((paramMap) => {
      const pollID = parseInt(paramMap.get('pollID') || '');

      if (isNaN(pollID)) {
        this.error = 'Missing value for pollID';
      } else {
        this.pollID = pollID;

        this.updateInfo();
        setInterval(() => this.updateInfo(), this.refreshInterval * 1000);
      }
    });
  }

  select(event: MouseEvent) {
    this.selectedOption = parseInt(
      (event.target as HTMLElement).id.split('-')[1]
    );
  }

  onVoteSubmit() {
    if (this.selectedOption > 0) {
      this.pollService
        .pollVote(this.selectedOption)
        .then((_) => this.updateInfo())
        .catch((err) => (this.error = err));
    }
  }

  onUnvote() {
    this.pollService
      .pollUnvote(this.pollID)
      .then(() => this.updateInfo())
      .catch((err) => (this.error = err));
  }

  updateInfo() {
    Promise.all([
      this.pollService.getPollInfo(this.pollID),
      this.pollService.getPollOptions(this.pollID),
      this.pollService.getPollVotes(this.pollID),
      this.pollService.getPollUserVotes(this.pollID),
    ])
      .then(([pollInfo, pollOptions, pollVotes, pollUserVotes]) => {
        this.pollInfo = true;
        this.poll = pollInfo;
        this.pollOptions = pollOptions;
        this.pollVotes = pollVotes;
        this.pollUserVotes = pollUserVotes.map((userVote) => ({
          ...userVote,
          vote_time: (userVote.vote_time as number) * 1000,
        }));
        this.pieChartColors = [this.generateColors(pollOptions.length)];

        this.updateVoteInfo();

        if (this.loggedIn) {
          this.pollService
            .getUserVote(this.pollID)
            .then(
              (userVote) =>
                (this.selectedOption = userVote.poll_option_id as number)
            )
            .catch((err) => {
              if (err === 'Poll vote does not exist') {
                this.selectedOption = 0;
              } else {
                this.error = err;
              }
            });

          this.profileService
            .getUserInfo()
            .then((user) => (this.canEdit = user.id === this.poll.user_id))
            .catch((err) => (this.error = err));
        }
      })
      .catch((err) => (this.error = err));
  }

  updateVoteInfo() {
    this.pieChartLabels = this.pollOptions.map(
      (option) => option.value as string
    );
    this.pieChartData = this.pollOptions.map(
      (option) =>
        this.pollVotes.filter((vote) => vote.poll_option_id === option.id)
          .length
    );
  }

  private generateColors(numColors: number): Color {
    return {
      backgroundColor: Array.from(Array(numColors).keys()).map(
        (value) => `hsl(${Math.round(value * 137.508) % 360}, 100%, 50%)`
      ),
    };
  }

  copyPollLink() {
    this.copyMessage(
      window.location.protocol +
        '//' +
        window.location.host +
        '/poll/' +
        this.pollID
    );
  }

  copyMessage(val: string) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }
}
