import {WebSocketService} from './../../services/websocketService';
import {GameService} from './../../services/game.service';
import {Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnDestroy} from '@angular/core';
import {COLOR} from "../../components/cm-chessboard/Chessboard.js";
import {JwtAuthenticationService} from "../../services/jwtAuthenticationService";

interface TimeEvent {
    color: string;
    time: number;
}

@Component({
    selector: 'chess-clock',
    templateUrl: './chess-clock.component.html',
    styleUrls: ['./chess-clock.component.css']
})
export class ChessClockComponent implements OnInit, OnChanges, OnDestroy {

    constructor(private gameService: GameService, private webSocketService: WebSocketService, private authService: JwtAuthenticationService) {
    }

    @Input()
    clockid:string

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
            let oldtime = changes.time.previousValue;
            let oldtimeString = this.generateClockTimeFromSeconds(oldtime);
            this.timeAsString = this.generateClockTimeFromSeconds(this.time);
            console.log(`Time changed externally - clock:${this._color} time:${this.timeAsString} oldtime:${oldtimeString}`);
        } else if (changes['mode']) {
            if (this.mode === 'A') {
                this.stopClocks();
            }
        } else if(changes['gameId']){
            this.stopClocks();

        } else if(changes['color']){
            console.log(`Changed color for:${this.clockid} old color: ${changes.color.previousValue} new color: ${changes.color.currentValue}`)
        }
    }

    @Input() set increment(increment: number) {
        this._increment = increment;
    }

    @Input() set color(color: string) {
        console.log(`Setting color ${color} for ${this.clockid}`)
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
            console.log("Subscribing to gameData");
                if (this.gameId === gameData.gameId) {
                    this._color = ( this.authService.getUsername() === gameData.whitePlayer.username && this.clockid.indexOf("down") !==-1)
                    ||  (this.authService.getUsername() !== gameData.whitePlayer.username && this.clockid.indexOf("down") ===-1 )? "w":"b";
                    console.log(`2. Setting color ${this._color} for ${this.clockid}`)
                    let movesPlayed = gameData.annotatedMoves.length;
                    let lastMove = gameData.annotatedMoves[movesPlayed - 1];
                    if (movesPlayed > 0) {

                        //when observing an already started game
                        if (lastMove.whiteMove && lastMove.blackMove && this._color === 'w') {
                            let blackMoveTimestamp = this.gameService.convertUTCDateToLocalDate(lastMove.blackMoveTimestamp);
                            let timeElapsedSinceBlackMove = new Date().getTime() - blackMoveTimestamp.getTime();
                            console.log("Black move timestamp: "+blackMoveTimestamp.toISOString() + " timeElapsedSinceBlackMove: " + timeElapsedSinceBlackMove);
                            this.time = lastMove.whiteTime - timeElapsedSinceBlackMove;
                            this.timeAsString = this.generateClockTimeFromSeconds(this.time);
                            console.log("Starting "+this.clockid +" "+this._color+" clock after reconnect: "+this.timeAsString)
                           // this.gameService.emitClockEvent({gameId: this.gameId, color: this._color, time: this.time});
                            this.startClock();
                        } else if(lastMove.blackMove && this._color === 'b'){
                            this.time = lastMove.blackTime;
                            this.timeAsString = this.generateClockTimeFromSeconds(this.time);
                            console.log("Setting "+this.clockid +" "+this._color+" clock after reconnect: "+this.timeAsString)
                            //this.gameService.emitClockEvent({gameId: this.gameId, color: this._color, time: this.time});
                        } else if (!lastMove.blackMove && this._color === 'b') {
                            let whiteMoveTimestamp = this.gameService.convertUTCDateToLocalDate(lastMove.whiteMoveTimestamp);
                            let timeElapsedSinceWhiteMove = new Date().getTime() - whiteMoveTimestamp.getTime();
                            console.log("White move timestamp: "+whiteMoveTimestamp.toISOString() + " timeElapsedSinceWhiteMove: " + timeElapsedSinceWhiteMove);
                            this.time = lastMove.blackTime - timeElapsedSinceWhiteMove;
                            this.timeAsString = this.generateClockTimeFromSeconds(this.time);
                            console.log("Starting "+this.clockid+" "+this._color+" clock after reconnect: "+this.timeAsString)
                            this.startClock();
                           // this.gameService.emitClockEvent({gameId: this.gameId, color: this._color, time: this.time});
                        }
                        else if(lastMove.whiteMove && !lastMove.blackMove && this._color === 'w'){
                            this.time = lastMove.whiteTime;
                            this.timeAsString = this.generateClockTimeFromSeconds(this.time);
                            console.log("Setting "+this.clockid+" "+this._color+" clock after reconnect: "+this.timeAsString)
                            //this.gameService.emitClockEvent({gameId: this.gameId, color: this._color, time: this.time});
                        }
                    } else {
                        this.time = gameData.time;
                        this.timeAsString = this.generateClockTimeFromSeconds(this.time);
                        console.log("Starting "+this._color+" clock after reconnect: "+this.timeAsString)
                    }
                }
            }
        );

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

                        console.log("Clocked pressed - move can be sent.")
                        console.log("Time after " +this._color+" move:" + this.timeAsString);

                        if (playedMove.sendMoveToOponent) {
                            let currentDate = new Date();
                            this.gameService.emitGameAction({
                                action: "sendMoveAfterClockPressed",
                                gameId: this.gameId,
                                gamedata: [{color: this._color, time: this.time - this._increment, timestamp:currentDate.getTime()}]
                            });
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
            this.gameService.emitClockEvent({gameId: this.gameId, color: this._color, time: this.time});
        }
    };

    updateTime() {
        if (typeof this.time !== "undefined" && this.time > 0) {
            this.time -= 100;
            this.time = this.time >= 0 ? this.time : 0;
            this.timeAsString = this.generateClockTimeFromSeconds(this.time);
            this.clockTimer = setTimeout(() => this.updateTime(), 100);
        } else if (typeof this.time !== "undefined" && this.time <= 0) {
            this.stopClocks();
            //console.log("Player ran out of time");
            this.gameService.emitGameAction({
                action: "gameResult",
                gameId: this.gameId,
                gamedata: {gameResult: this._color === COLOR.white ? "0-1 (Black won on time)" : "1-0 (White won on time)"}
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
        let clockMinutes = Math.floor(((remainingTimeInMillis - clockMillis) / 1000) / 60);
        if (clockMinutes === 0 && clockSeconds < 10) {
            return clockMinutes + ":" + clockSecondsString + "." + Math.floor(clockMillis / 100);
        } else {
            return clockMinutes + ":" + clockSecondsString;
        }

    }

    ngOnDestroy(): void {
       // this.stopClocks();
    }


}
