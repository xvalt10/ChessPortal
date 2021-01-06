import { WebSocketService } from './../../services/websocketService';
import { GameService } from './../../services/game.service';
import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { COLOR } from "../../components/cm-chessboard/Chessboard.js";

interface TimeEvent {
  color: string;
  time: number;
}

@Component({
  selector: 'chess-clock',
  templateUrl: './chess-clock.component.html',
  styleUrls: ['./chess-clock.component.css']
})
export class ChessClockComponent implements OnInit, OnChanges {

  constructor(private gameService: GameService, private webSocketService: WebSocketService) { }

  @Input()
  gameId: string;

  @Input()
  time: number;

  @Input()
  mode: string;

  @Output()
  timeevents = new EventEmitter<TimeEvent>();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['time']) {
      this.time = changes.time.currentValue;
      this.timeAsString = this.generateClockTimeFromSeconds(this.time);
      console.log(`Time changed externally - clock:${this._color} time:${this.time}`);
    } else if (changes['mode']) {
      if (this.mode === 'A') {
        this.stopClocks();
      }
    }
  }

  @Input() set increment(increment: number) {
    this._increment = increment;
  }

  @Input() set color(color: string) {
    this._color = color;
  }

  _color: string;
  _increment: number;
  timeAsString: string = '00:00';
  clockTimer;
  clockRunning: boolean = false;
  websocket: WebSocket;

  ngOnInit(): void {
    console.log("chess clock initialized:" + this.time);
    //this.websocket = this.webSocketService.initWebSocket();
    this.gameService.gameResultSubscriber.subscribe(gameResult => {
      if (gameResult.gameId === this.gameId) {
        this.stopClocks();
      }
    });

    this.gameService.gameDataSubscriber.subscribe(gameData => {
      this.time = gameData.time;
    })

    this.gameService.moveSubscriber.subscribe(playedMove => {
      if (playedMove.gameId === this.gameId && typeof this._increment !== "undefined") {
        if (playedMove.gameResult !== "N/A") {
          this.stopClocks();
        } else {
          if (playedMove.moveColor !== this._color) {
            //console.log("Starting clock for " + this._color + " after move: " + playedMove.moveNotation);
            this.startClock();
          } else {

            if (playedMove.moveReceived) {
              this.time = this._color === "w" ? playedMove.whiteTime : playedMove.blackTime;
            }
            //console.log("Stopping clock for " + this._color + " after move: " + playedMove.moveNotation);
            this.pressClock();

            //console.log("Clocked pressed - move can be sent.")
            //console.log("Time after " +this._color+" move:" + this.time);

            if (playedMove.sendMoveToOponent) {
              this.gameService.emitGameAction({ action: "sendMoveAfterClockPressed", gameId: this.gameId, gamedata: [{ color: this._color, time: this.time - this._increment }] });
            }
          }
        }

      }
    });


  }

  stopClocks() {

    clearTimeout(this.clockTimer);
    this.clockRunning = false;

  };

  startClock() {

    if (this.mode !== 'A') {
      this.clockTimer = setTimeout(() => this
        .updateTime(), 100);
      this.clockRunning = true;
    }
  };

  pressClock() {
    if (this.mode !== 'A') {
      clearTimeout(this.clockTimer);
      this.time += this._increment;
      this.clockRunning = false;
      console.log(`Emmiting clock event color:${this._color}, time:${this.generateClockTimeFromSeconds(this.time)}`)
      this.gameService.emitClockEvent({ color: this._color, time: this.time });
    }
  };

  updateTime() {
    if (typeof this.time !== "undefined" && this.time > 0) {
      this.time -= 100;
      this.timeAsString = this.generateClockTimeFromSeconds(this.time);
      this.clockTimer = setTimeout(() => this.updateTime(), 100);

    } else if (typeof this.time !== "undefined" && this.time === 0) {
      this.stopClocks();
      //console.log("Player ran out of time");
      this.gameService.emitGameAction({
        action: "gameResult",
        gameId: this.gameId,
        gamedata: { gameResult: this._color === COLOR.white ? "0-1 (Black won on time)" : "1-0 (White won on time)" }
      });
    }

  };

  generateClockTimeFromSeconds(remainingTimeInMillis) {
    let clockMillis = remainingTimeInMillis % 1000;
    let clockSeconds = ((remainingTimeInMillis - clockMillis) / 1000) % 60;
    let clockSecondsString: string;
    if (clockSeconds < 10) {
      clockSecondsString = "0" + +clockSeconds
    } else {
      clockSecondsString = clockSeconds.toString();
    }
    let clockMinutes = Math.floor(((remainingTimeInMillis - clockMillis)/1000) / 60 );
    if(clockMinutes === 0 && clockSeconds < 10 ){
      return clockMinutes + ":" + clockSecondsString + "." + Math.floor(clockMillis/100);
    } else{
      return clockMinutes + ":" + clockSecondsString;
    }

    }
    

}
