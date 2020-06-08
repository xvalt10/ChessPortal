import { JwtAuthenticationService } from './../../js/services/jwtAuthenticationService';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { WebSocketService } from './../../js/services/websocketService';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router'


@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit, OnDestroy {

  constructor(private router: Router, private websocketService:WebSocketService, 
    private authenticationService:JwtAuthenticationService,
      private formBuilder: FormBuilder ) {
   }

  chatMessage = { action: "chatMessageLobby", author: null, message:""};

  gameTimeForm: FormGroup;
  gameTimeFormSubmitted: boolean;
  gameTimeFormShown : boolean;

  time = 0;
  increment = 0;
  messages = [];
  countOfPlayersOnline :number;
  gamesInProgress = 0;
  playersOnline = [];
  seekingOponent = false;
  user = {};

  socket: WebSocket;
  queryPlayersInterval:any;
  seekOponentInterval:any;

  ngOnInit(): void {

    this.gameTimeForm = this.formBuilder.group({
      initialtime: ['', Validators.required],
      incrementpermove: ['', Validators.required]
    });
    this.gameTimeFormSubmitted = false;
    this.gameTimeFormShown = false;

    this.socket = this.websocketService.initWebSockets();
    this.socket.onmessage = (message) => {this.onMessage(message)};
    this.socket.onclose = () => {
      console.log("closing timer");
      this.cancelIntervals();
    };
    this.user = this.authenticationService.authenticatedUser;
    this.queryPlayersOnline();
    this.queryPlayersInterval = setInterval(()=>{this.queryPlayersOnline()}, 10000);

  };

  ngOnDestroy():void{
    this.cancelIntervals();
  }

  // convenience getter for easy access to form fields
  get gameTimeFormFields() { return this.gameTimeForm.controls; }

  sendChatMessage() {
    this.chatMessage.author = this.authenticationService.authenticatedUser;
    this.socket.send(JSON.stringify(this.chatMessage));
    this.chatMessage.message = "";
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

  seekOponent(time: string, increment: string) {

    this.gameTimeFormSubmitted = true;

    if(this.gameTimeFormShown && this.gameTimeFormSubmitted && this.gameTimeForm.invalid){
      return;
    }

    const seekDetails = {
      action: "seekOponent",
      user: this.authenticationService.authenticatedUser,
      time: parseInt(typeof time !== 'undefined' ? time
        : this.gameTimeFormFields.initialtime.value),
      increment: parseInt(typeof increment !== 'undefined' ? increment
        : this.gameTimeFormFields.incrementpermove.value)
    };

    this.seekOponentInterval = setInterval(() => this.socket.send(JSON.stringify(seekDetails)), 1000);
    this.seekingOponent = true;
    this.gameTimeFormSubmitted = false;
    this.gameTimeFormShown = false;
  };

  showSeekForm = function () {
    this.gameTimeFormShown = true;
  };



  queryPlayersOnline() {
    console.log("Querying players online.");
    if(this.socket.readyState === 1){
    this.socket.send(JSON.stringify({ user: this.user, action: "getPlayersOnline" }));}

  }

  observeGame(playername: string) {
    this.cancelIntervals();
    this.router.navigate(['/observeGame/' + playername])
  };

  cancelIntervals() {
    clearInterval(this.seekOponentInterval);
    clearInterval(this.queryPlayersInterval)
  }

  onMessage(event: any) {
    //console.log(event);
    var data = JSON.parse(event.data);
    if (data.action === "chatMessageLobby") {
      this.displayChatMessage(data);
    }
    if (data.action === "getPlayersOnline") {
      console.log(data.players);
      this.playersOnline = data.players;
      this.countOfPlayersOnline = data.players.length;
      this.gamesInProgress = data.gamesInProgress;
    }
    if (data.action === "startGame") {
      console.log(data);
      this.cancelIntervals();
      this.router.navigate(['/playGame/' + data.gameId]);
      console.log("Game started.")
    }
    if (data.action === "gameInfo") {
      this.cancelIntervals();
      console.log("Received game info:" + data);
    }
  }
 

}
