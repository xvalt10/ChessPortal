
import { AuthenticationService } from './../../js/services/authenticationService';
import { JwtAuthenticationService } from './../../js/services/jwtAuthenticationService';
import { WebSocketService } from './../../js/services/websocketService';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { GameService } from './../../js/services/game.service';

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
    joined:boolean;
    tournamentName:string;
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
  currentPairings: any;
  userscore:any;
  byeReceived:boolean;

  constructor(private webSocketService: WebSocketService, private authService: JwtAuthenticationService, private route: ActivatedRoute, private router: Router, private gameService:GameService) { }
  ngOnDestroy(): void {
    clearInterval(this.countDownInterval);
  }

  ngOnInit(): void {
   
      this.websocket = this.webSocketService.initWebSocket();
      this.websocket.onmessage = (message) => this.onMessage(message);
      this.websocket.onopen = () => this.onWebSocketOpen();
      
      this.getTournamentInfo();

  }

  onWebSocketOpen() {
    this.getTournamentInfo();
    
  }
  private getTournamentInfo() {
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
      case "byeInCurrentRound":
        this.byeReceived = true;
break;
      case "tournamentInfo":
        this.updateTournamentInfo(messageData);
        break;
    }

    console.log(messageData);


  }

  updateTournamentInfo(messageData){
    this.tournament= JSON.parse(messageData.tournament);
    this.tournament.tournamentPlayers = this.tournament.tournamentPlayers.filter(player => player);
        
    let tournamentStartDateTime: Date = this.gameService.convertUTCDateToLocalDate(this.tournament.startDateTime);

    this.secondsTillStart = Math.round((tournamentStartDateTime.getTime() - new Date().getTime()) / 1000);
    this.currentPairings = this.tournament.pairings.filter(pairing => pairing.round === this.tournament.currentRound);
    this.tournament.joined = this.tournament.tournamentPlayers.filter(player => player).map(player=>player.username).includes(this.authService.authenticatedUser);
    this.tournament.scores = Object.values(this.tournament.scores).sort((score1,score2)=> +score2.points - score1.points);
    this.userscore = this.tournament.scores.filter(score => score.username === this.authService.getUsername());
    if(this.userscore.length > 0){
      this.userscore = this.userscore[0];
      this.userscore.standing = this.tournament.scores.findIndex(score => score.username === this.userscore.username);
    }
    

    if(!this.countDownInterval){
    this.countDownInterval = setInterval(() => {
      this.secondsTillStart -= 1;
      if (this.secondsTillStart <= -1) { clearInterval(this.countDownInterval) }
      else { this.secondsTillStartString = this.generateClockTimeFromSeconds(this.secondsTillStart); }
    }, 1000);}
  }

  observeGame(gameId: string) {
    this.router.navigate(['/game/' + gameId + "/observe"]);
  };

  joinTournament(): void {
    // this.tournamentPlayers.push({ username: this.authService.authenticatedUser, tournamentId: this.tournamentId });
    this.websocket.send(JSON.stringify({ action: 'joinTournament', username: this.authService.authenticatedUser, tournamentId: this.tournament.tournamentId }));
    this.tournament.joined = true;
  }

  leaveTournament(){
    this.websocket.send(JSON.stringify({ action: 'leaveTournament', username: this.authService.authenticatedUser, tournamentId: this.tournament.tournamentId }));
    this.tournament.tournamentPlayers = this.tournament.tournamentPlayers.filter(player => player.username !== this.authService.authenticatedUser);
    this.tournament.joined=false;
  }

  generateClockTimeFromSeconds(seconds) {
    let clockDays = Math.floor(seconds / (3600 * 24))
    let clockHours = clockDays == 0 ? Math.floor(seconds / 3600) : Math.floor(((seconds % (3600 * 24)) / 3600));
    let clockMinutes = clockDays == 0 && clockHours == 0 ? Math.floor(seconds / 60) : Math.floor((seconds % 3600) / 60);
    let clockSeconds = seconds % 60;

    return (clockDays > 0 ? ('0' + clockDays).slice(-2) + " day(s) " : "") + ('0' + clockHours).slice(-2) + ":" + ('0' + clockMinutes).slice(-2) + ":" + ('0' + clockSeconds).slice(-2)
  };

}
