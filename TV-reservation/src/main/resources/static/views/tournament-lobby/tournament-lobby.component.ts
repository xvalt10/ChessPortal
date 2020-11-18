import { AuthenticationService } from './../../js/services/authenticationService';
import { JwtAuthenticationService } from './../../js/services/jwtAuthenticationService';
import { WebSocketService } from './../../js/services/websocketService';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";

interface Tournament{
    tournamentPlayers: any[];
    time: number;
    tournamentId: any;
    tournamentState: any;
    numberOfRounds: number;
    currentRound: number;
    startDateTime;
    increment: number;
    tournamentType: string;
    pairings: any[];
    scores: any[];
}


@Component({
  selector: 'app-tournament-lobby',
  templateUrl: './tournament-lobby.component.html',
  styleUrls: ['./tournament-lobby.component.css']
})
export class TournamentLobbyComponent implements OnInit, OnDestroy {

  websocket: WebSocket;
  tournament:Tournament;
  secondsTillStart: number;
  secondsTillStartString: string;
  countDownInterval: any;
  

  constructor(private webSocketService: WebSocketService, private authService: JwtAuthenticationService, private route: ActivatedRoute, private router: Router) { }
  ngOnDestroy(): void {
    clearInterval(this.countDownInterval);
  }

  ngOnInit(): void {
   
      this.websocket = this.webSocketService.initWebSocket();
      this.websocket.onmessage = (message) => this.onMessage(message);
      this.websocket.onopen = () => this.onWebSocketOpen();

  }

  onWebSocketOpen() {
    this.route.params.subscribe(params => {
      let tournamentId = params['tournamentId'];
      this.websocket.send(JSON.stringify({ action: 'getTournamentInfo', tournamentId: tournamentId, username: this.authService.authenticatedUser }));
    });
    
  }
  onMessage(message): void {
    const messageData = JSON.parse(message.data);

    switch (messageData.action) {
      case "startGame":
        this.router.navigate([`tournamentgame/${this.tournament.tournamentId}/${messageData.gameId}/play`]);
        break;
      case "tournamentInfo":
        this.tournament= JSON.parse(messageData.tournament);
        
        let tournamentStartDateTime: Date = new Date(this.tournament.startDateTime.year, this.tournament.startDateTime.monthValue - 1, this.tournament.startDateTime.dayOfMonth, this.tournament.startDateTime.hour, this.tournament.startDateTime.minute, this.tournament.startDateTime.second);
  
        this.secondsTillStart = Math.round((tournamentStartDateTime.getTime() - new Date().getTime()) / 1000);

        if(!this.countDownInterval){
        this.countDownInterval = setInterval(() => {
          this.secondsTillStart -= 1;
          if (this.secondsTillStart <= -1) { clearInterval(this.countDownInterval) }
          else { this.secondsTillStartString = this.generateClockTimeFromSeconds(this.secondsTillStart); }
        }, 1000);}
        break;
    }

    console.log(messageData);


  }

  joinTournament(): void {
    // this.tournamentPlayers.push({ username: this.authService.authenticatedUser, tournamentId: this.tournamentId });
    this.websocket.send(JSON.stringify({ action: 'joinTournament', username: this.authService.authenticatedUser, tournamentId: this.tournament.tournamentId }));
  }

  generateClockTimeFromSeconds(seconds) {
    let clockDays = Math.floor(seconds / (3600 * 24))
    let clockHours = clockDays == 0 ? Math.floor(seconds / 3600) : Math.floor(((seconds % (3600 * 24)) / 3600));
    let clockMinutes = clockDays == 0 && clockHours == 0 ? Math.floor(seconds / 60) : Math.floor((seconds % 3600) / 60);
    let clockSeconds = seconds % 60;

    return clockDays > 0 ? ('0' + clockDays).slice(-2) + " day(s) " : "" + ('0' + clockHours).slice(-2) + ":" + ('0' + clockMinutes).slice(-2) + ":" + ('0' + clockSeconds).slice(-2)
  };

}
