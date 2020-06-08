import { AuthenticationService } from './../../js/services/authenticationService';
import { JwtAuthenticationService } from './../../js/services/jwtAuthenticationService';
import { WebSocketService } from './../../js/services/websocketService';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'app-tournament-lobby',
  templateUrl: './tournament-lobby.component.html',
  styleUrls: ['./tournament-lobby.component.css']
})
export class TournamentLobbyComponent implements OnInit {

  tournamentPlayers: any[] = [];
  time: number;
  increment: number;
  websocket: WebSocket;
  tournamentId: string;

  constructor(private webSocketService: WebSocketService, private authService: JwtAuthenticationService, private route: ActivatedRoute) { }

  ngOnInit(): void {
      this.route.params.subscribe(params => {
      this.tournamentId = params['tournamentId'];
      this.websocket = this.webSocketService.initWebSockets();
      this.websocket.onmessage = (message) => this.onMessage(message);
      this.websocket.onopen =() => this.onWebSocketOpen();
      
    });
  }

  onWebSocketOpen(){
    this.websocket.send(JSON.stringify({ action: 'getTournamentInfo', tournamentId: this.tournamentId, username: this.authService.authenticatedUser }));
  }
  onMessage(message):void{
    const messageData = JSON.parse(message.data);
    this.tournamentPlayers = messageData.tournamentPlayers;
    this.time = messageData.time;
    this.increment = messageData.increment;

  }

  joinTournament(): void {
   // this.tournamentPlayers.push({ username: this.authService.authenticatedUser, tournamentId: this.tournamentId });
    this.websocket.send(JSON.stringify({action: 'joinTournament', username: this.authService.authenticatedUser, tournamentId: this.tournamentId}));
  }

}
