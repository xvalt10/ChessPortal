import { Router } from '@angular/router';
import { GameService } from './../../js/services/game.service';
import { TournamentLobbyComponent } from './../tournament-lobby/tournament-lobby.component';
import { HttpService } from './../../js/services/http-service.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-tournament-summary',
  templateUrl: './tournament-summary.component.html',
  styleUrls: ['./tournament-summary.component.css']
})
export class TournamentSummaryComponent implements OnInit {

  constructor(private httpService: HttpService, public gameService: GameService, private router: Router, private formBuilder: FormBuilder) {
    this.loading = false;
    this.submitted = false;
    this.showForm = false;
    this.showSummary = true;

  }

  scheduledTournaments: any;
  scheduleTournamentForm: any;
  loading: boolean;
  submitted: boolean;

  showForm: boolean;
  showSummary: boolean;
  backendError: any;

  ngOnInit(): void {
    this.scheduleTournamentForm = this.formBuilder.group({
      tournamentname: ['', Validators.required],
      tournamenttype: ['', Validators.required],
      time: ['', Validators.required],
      increment:['',Validators.required],
      startDateTime: ['', Validators.required]
    });

    this.httpService.getTournamentsByState('NOT_STARTED').subscribe(tournaments => {
      this.scheduledTournaments = tournaments;
    });
  }
  get formControls() {
    return this.scheduleTournamentForm.controls;
  }

  navigateToLobby(tournamentId) {
    this.router.navigateByUrl(`tournaments/${tournamentId}`);
  }



  scheduleTournament() {
    this.submitted = true;
    if (this.scheduleTournamentForm.invalid) {
      return;
    }
    this.loading = true;

    let tournamentparams = {};
    tournamentparams['name'] = this.formControls.tournamentname.value;
    tournamentparams['type'] = this.formControls.tournamenttype.value;
    tournamentparams['time'] = this.formControls.time.value;
    tournamentparams['increment'] = this.formControls.increment.value;

    var localDate = new Date(Date.parse(this.formControls.startDateTime.value));
    // var now_utc = Date.UTC(localDate.getUTCFullYear(), localDate.getUTCMonth(), localDate.getUTCDate(),
    //   localDate.getUTCHours(), localDate.getUTCMinutes(), localDate.getUTCSeconds());
    //  let offsetToUTC= new Date().getTimezoneOffset() * 60000

    tournamentparams['startDateTime'] = localDate.getTime();
    tournamentparams['offsetToUTC'] = new Date().getTimezoneOffset() * 60;

    this.httpService.scheduleTournament(tournamentparams).subscribe((response) => {
      this.scheduleTournamentForm.reset();
      this.scheduledTournaments = response;
      this.showSummary = true;
      this.showForm = false;
      this.loading = false;
      this.backendError = null;
    },
      (error) => {
        this.backendError = error;
        this.showSummary = true;
        this.showForm = false;
        this.loading = false;
      });
    this.submitted = false;
  }

  convertUTCToLocalDate(utcDate:Date){
    return new Date(utcDate.getTime() - (new Date().getTimezoneOffset() * 60000))
  }

}
