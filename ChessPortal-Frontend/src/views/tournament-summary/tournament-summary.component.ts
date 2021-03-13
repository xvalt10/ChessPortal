import { Router } from '@angular/router';
import { GameService } from './../../js/services/game.service';
import { TournamentLobbyComponent } from './../tournament-lobby/tournament-lobby.component';
import { HttpService } from './../../js/services/http-service.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatTable } from '@angular/material/table';
export interface Tournament {
  name: string,
  type: string,
  time: number,
  increment: number;
  utcStartDateTime: Date,
  endDateTime: Date,
  offsetToUTC: number

}
export interface DayTournamentSchedule {
  date: Date,
  dateString: string,
  dayOfWeek: string,
  "00:00"?: {},
  "00:30"?: {},
  "01:00"?: {},
  "01:30"?: {},
  "02:00"?: {},
  "02:30"?: {},
  "03:00"?: {},
  "03:30"?: {},
  "04:00"?: {},
  "04:30"?: {},
  "05:00"?: {},
  "05:30"?: {},
  "06:00"?: {},
  "06:30"?: {},
  "07:00"?: {},
  "07:30"?: {},
  "08:00"?: {},
  "08:30"?: {},
  "09:00"?: {},
  "09:30"?: {},
  "10:00"?: {},
  "10:30"?: {},
  "11:00"?: {},
  "11:30"?: {},
  "12:00"?: {},
  "12:30"?: {},
  "13:00"?: {},
  "13:30"?: {},
  "14:00"?: {},
  "14:30"?: {},
  "15:00"?: {},
  "15:30"?: {},
  "16:00"?: {},
  "16:30"?: {},
  "17:00"?: {},
  "17:30"?: {},
  "18:00"?: {},
  "18:30"?: {},
  "19:00"?: {},
  "19:30"?: {},
  "20:00"?: {},
  "20:30"?: {},
  "21:00"?: {},
  "21:30"?: {},
  "22:00"?: {},
  "22:30"?: {},
  "23:00"?: {},
  "23:30"?: {},

}


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
    this.tournamentSchedule = [];

  }

  
@ViewChild('tournamentTable') tournamentTable: MatTable<DayTournamentSchedule>;

  tournamentSchedule: DayTournamentSchedule[];
  displayedColumns = [];

  scheduledTournaments: any;
  scheduleTournamentForm: any;
  loading: boolean;
  submitted: boolean;

  showForm: boolean;
  showSummary: boolean;
  backendError: any;
  currentDate: Date;

  ngOnInit(): void {
    this.scheduleTournamentForm = this.formBuilder.group({
      tournamentname: ['', Validators.required],
      tournamenttype: ['', Validators.required],
      time: ['', Validators.required],
      increment: ['', Validators.required],
      startDateTime: ['', Validators.required],
      endDateTime: ['']
    });

    this.httpService.getTournamentsByState('NOT_STARTED').subscribe(tournaments => {
      for (let index = 0; index < 7; index++) {
        this.currentDate = this.addDaysToDate(new Date(), index);
        this.tournamentSchedule[index] = this.createDayTournamentSchedule(this.currentDate);
      }
      this.displayedColumns = Object.keys(this.tournamentSchedule[0]);
      this.displayedColumns.splice(0,1);
      this.displayedColumns.splice(1,1);
      this.scheduledTournaments = tournaments;
      let tournamentsToShowOnTimetable = this.scheduledTournaments.filter(tournament => this.gameService.convertUTCDateToLocalDate(tournament.utcStartDateTime).getTime() < this.currentDate.getTime());
      tournamentsToShowOnTimetable.forEach(tournament => {
        this.addTournamentToTimetable(tournament);
      });
      this.tournamentTable.renderRows();
    });
  }

  addTournamentToTimetable(tournament: Tournament) {
    let tournamentStartDate: Date = this.gameService.convertUTCDateToLocalDate(tournament.utcStartDateTime)
    this.tournamentSchedule.forEach(dayTimetable => {
      if (dayTimetable.date.getMonth() === tournamentStartDate.getMonth() && dayTimetable.date.getDay() === tournamentStartDate.getDay()) {
        let startHour = ("0"+tournamentStartDate.getHours()).slice(-2);
        Object.keys(dayTimetable).forEach(objectKey => {
          if(objectKey.startsWith(startHour) && objectKey.endsWith("00")){
            dayTimetable[objectKey] = tournament;

          }
        });
      };
    });
  }

  get formControls() {
    return this.scheduleTournamentForm.controls;
  }

  addDaysToDate(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  navigateToLobby(tournamentId) {
    this.router.navigateByUrl(`tournaments/${tournamentId}`);
  }

  createDayTournamentSchedule(date: Date): DayTournamentSchedule {

    return {
      date: date,
      dateString: date.toISOString().slice(5, 10),
      dayOfWeek: date.toLocaleString("default", { weekday: "long" }),
      "00:00": {},
      "00:30": {},
      "01:00": {},
      "01:30": {},
      "02:00": {},
      "02:30": {},
      "03:00": {},
      "03:30": {},
      "04:00": {},
      "04:30": {},
      "05:00": {},
      "05:30": {},
      "06:00": {},
      "06:30": {},
      "07:00": {},
      "07:30": {},
      "08:00": {},
      "08:30": {},
      "09:00": {},
      "09:30": {},
      "10:00": {},
      "10:30": {},
      "11:00": {},
      "11:30": {},
      "12:00": {},
      "12:30": {},
      "13:00": {},
      "13:30": {},
      "14:00": {},
      "14:30": {},
      "15:00": {},
      "15:30": {},
      "16:00": {},
      "16:30": {},
      "17:00": {},
      "17:30": {},
      "18:00": {},
      "18:30": {},
      "19:00": {},
      "19:30": {},
      "20:00": {},
      "20:30": {},
      "21:00": {},
      "21:30": {},
      "22:00": {},
      "22:30": {},
      "23:00": {},
      "23:30": {},
    }
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

    var localStartDate = new Date(Date.parse(this.formControls.startDateTime.value));
    var localEndDate = new Date(Date.parse(this.formControls.endDateTime.value));

    // var now_utc = Date.UTC(localDate.getUTCFullYear(), localDate.getUTCMonth(), localDate.getUTCDate(),
    //   localDate.getUTCHours(), localDate.getUTCMinutes(), localDate.getUTCSeconds());
    //  let offsetToUTC= new Date().getTimezoneOffset() * 60000

    tournamentparams['startDateTime'] = localStartDate.getTime();
    tournamentparams['endDateTime'] = localEndDate.getTime();
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

  convertUTCToLocalDate(utcDate: Date) {
    return new Date(utcDate.getTime() - (new Date().getTimezoneOffset() * 60000))
  }

}
