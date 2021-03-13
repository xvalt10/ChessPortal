import { NewGameDialogComponent } from './../../js/components/new-game-dialog/new-game-dialog.component';
import { JwtAuthenticationService } from './../../js/services/jwtAuthenticationService';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { WebSocketService } from './../../js/services/websocketService';
import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router'
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";



@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit, OnDestroy {

  constructor(private dialog: MatDialog, private router: Router, private websocketService: WebSocketService,
    private authenticationService: JwtAuthenticationService,
    private formBuilder: FormBuilder) {
  }

  @ViewChild('chatDiv') chatWindowDiv: ElementRef;

  chatMessage = { action: "chatMessageLobby", author: null, message: "", color: "" };



  time = 0;
  increment = 0;
  messages = [];
  countOfPlayersOnline: number;
  gamesInProgress = 0;
  playersOnline = [];
  seekingOponent = false;
  user = {};
  seekDialogOpened = false;
  seekDialogRef:any;

  fetchInitData: boolean = false;

  socket: WebSocket;
  queryPlayersInterval: any;
  seekOponentInterval: any;
  chatMessageColor: string;

  ngOnInit(): void {



    this.socket = this.websocketService.initWebSocket();
    this.socket.onmessage = (message) => {

      this.onMessage(message)
    };

    this.socket.onopen = () => {
      console.log("Socket opened.");
      // this.queryPlayersInterval = setInterval(()=>{this.queryPlayersOnline()}, 1000);
    }

    this.socket.onclose = () => {
      console.log("closing timer");
      this.cancelIntervals();
    };
    this.user = this.authenticationService.authenticatedUser;
    this.chatMessage.color = '#' + Math.floor(Math.random() * 16777215).toString(16);
    this.queryPlayersInterval = setInterval(() => { this.queryPlayersOnline() }, 1000);

  };

  ngOnDestroy(): void {
    this.cancelIntervals();
  }

  seekOponent(time, increment): void {
    this.seekOponentInterval = setInterval(() => { this.websocketService.seekNewOponentCommand(time, increment) }, 1000);
    this.seekingOponent = true;
  }




  sendChatMessage() {
    this.chatMessage.author = this.authenticationService.authenticatedUser;
    this.socket.send(JSON.stringify(this.chatMessage));
    this.chatMessage.message = "";

    var elem = this.chatWindowDiv.nativeElement;
    console.log("Scroll Height:" + elem.scrollHeight);
    setInterval(() => { elem.scrollTop = elem.scrollHeight + 10 }, 10);
  };

  config = {

    autoHideScrollbar: false,
    setHeight: 300,
    scrollInertia: 500,
    axis: 'yx',
    advanced: {
      updateOnContentResize: true
    },
    scrollButtons: {
      scrollAmount: 'auto', // scroll amount when button pressed
      enable: true // enable scrolling buttons by default
    },
    theme: 'dark'
  };

  displayChatMessage(message) {
    message.date = new Date();
    this.messages.unshift(message);

  };



  showSeekForm = function () {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    this.seekDialogRef = this.dialog.open(NewGameDialogComponent, dialogConfig);
    this.seekDialogOpened = true;
  };



  queryPlayersOnline() {
    console.log("Querying players online." + new Date().toLocaleDateString());
    if (this.socket.readyState === 1) {
      console.log("Socket ready." + new Date().toLocaleDateString());
      this.socket.send(JSON.stringify({ user: this.user, action: "getPlayersOnline" }));
      console.log("Message sent." + new Date().toLocaleDateString());

    }
    else { console.log(`Socket in state :${this.socket.readyState}`) }

  }

  observeGame(gameId: string) {
    this.cancelIntervals();
    this.router.navigate(['/game/' + gameId + "/observe"]);
  };

  cancelIntervals() {
    clearInterval(this.seekOponentInterval);
    clearInterval(this.queryPlayersInterval)
  }

  onMessage(event: any) {
    console.log(event);
    var data = JSON.parse(event.data);
    if (data.action === "chatMessageLobby") {
      this.displayChatMessage(data);
    }
    if (data.action === "getPlayersOnline") {
      console.log(data.players);
      this.playersOnline = data.players;
      this.countOfPlayersOnline = data.players.length;
      this.gamesInProgress = data.gamesInProgress;
      this.fetchInitData = true
    }
    if (data.action === "startGame") {
      if(this.seekDialogOpened){
        this.seekDialogRef.close();
        this.seekDialogOpened = false;
      }
      console.log(data);
      this.cancelIntervals();
      this.router.navigate(['/game/' + data.gameId + "/play"]);
      console.log("Game started.")
    }
    if (data.action === "gameInfo") {
      this.cancelIntervals();
      console.log("Received game info:" + data);
    }
  }


}
