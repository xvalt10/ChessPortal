import { StockfishService, EngineOutput } from './../../js/services/stockfish.service';
import { GameService, PlayedMove } from './../../js/services/game.service';
import { JwtAuthenticationService } from './../../js/services/jwtAuthenticationService';
import { WebSocketService } from './../../js/services/websocketService';

import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from "@angular/router";
import { COLOR } from "../../js/components/cm-chessboard/Chessboard.js";

import { MediaObserver } from '@angular/flex-layout'
import { BASEURL, CHESSBOARD_USAGE_MODES } from '../../js/constants.js';

@Component({
    selector: 'selector-name',
    templateUrl: 'playingHall.html'
})

export class PlayingHall implements OnInit, OnDestroy, AfterViewInit {

    constructor(private screenSizeObserver: MediaObserver, private http: HttpClient, private route: ActivatedRoute,
        private authenticationService: JwtAuthenticationService, private webSocketService: WebSocketService, private router: Router, private gameService: GameService, private engineService: StockfishService) {
    }

    root = this;
    resignButtonPressed: boolean = false;

    // The active media query (xs | sm | md | lg | xl)
    activeMedia: string

    seekFormShown = false;
    showPositionSetupDiv = false;

    annotatedMoves = []
    scrollbarconfig = {
        setHeight: 400,
    };

    //alert related properties
    drawOfferReceived: boolean = false;
    drawOfferRejected: boolean = false;
    rematchOfferReceived: boolean = false;
    rematchOfferRejected: boolean = false;
    oponentDisconnected: boolean = false;
    positionSetupActive: boolean = false;

    newGame: boolean;
    gameId: string;
    timecontrol: string;
    tournamentId: any;
    gameData: any;
    gameResult: string = "N\A";
    socket: WebSocket;

    matchScore = []

    mode: string;

    whitePlayerName = "whitePlayer";
    whitePlayerElo = 1500;

    blackPlayerName = "blackPlayer";
    blackPlayerElo = 1500;

    whitePlayerEloChange = 0;
    blackPlayerEloChange = 0;

    whitePlayerCountry = null;
    blackPlayerCountry = null;

    whiteTime = 0;
    blackTime = 0;

    time: number;
    increment: number;

    whitePlayer: boolean;
    playingGame = true;
    user = {};
    oponent: string;

    timeToReconnect: number;

    chessboardUsageModes = CHESSBOARD_USAGE_MODES;

    stockfish: any;
    engineOutput: EngineOutput;
    lastMove: PlayedMove;
    engineAnalysisActivated: boolean;

    hideAllAlerts() {
        this.drawOfferReceived = false;
        this.drawOfferRejected = false;
        this.rematchOfferReceived = false;
        this.rematchOfferRejected = false;
        this.oponentDisconnected = false;
    }

    ngOnInit() {
        this.initialiseWebSockets();


        this.route.params.subscribe(params => {
            this.gameId = params['gameId'];
            let action = params['action'];
            this.tournamentId = params['tournamentId'];
            this.determineInitialModeOfUsage(action);
            if (this.mode === CHESSBOARD_USAGE_MODES.ANALYZING) {
                this.engineAnalysisActivated = false;
                this.engineService.initializeEngine();
                this.gameService.engineOutputSubscriber.subscribe(engineOutput => {

                    this.engineOutput = engineOutput;
                    if ((this.lastMove && this.lastMove.moveColor === "w") && this.engineOutput.score.indexOf("mate") === -1) {
                        this.engineOutput.score = (+this.engineOutput.score * -1).toFixed(2);
                    }
                });

            }
            // this.whitePlayer = true;
            this.user = this.authenticationService.authenticatedUser.username;
            if (!this.user && localStorage.getItem('currentUser')) {
                this.user = JSON.parse(localStorage.getItem('currentUser')).username;
            }
            console.log(this.user);


        });

        this.gameService.clockEventSubscriber.subscribe(clockEvent => this.onTimeevents(clockEvent));

        this.gameService.gamePositionSubscriber.subscribe(gamePosition => {
            this.engineService.stopPositionAnalysis();
            this.engineService.startPositionAnalysis(gamePosition.positionAsFEN);
        })

        this.gameService.gameDataSubscriber.subscribe(gameData => {

            this.gameId = gameData.gameId;
            this.whitePlayerName = gameData.whitePlayer.username;
            this.blackPlayerName = gameData.blackPlayer.username;
            this.whitePlayerElo = gameData.whitePlayer.elo;
            this.blackPlayerElo = gameData.blackPlayer.elo;
            this.whitePlayerCountry = gameData.whitePlayer.countrycode;
            this.blackPlayerCountry = gameData.blackPlayer.countrycode;
            this.whitePlayer = this.authenticationService.getUsername() === this.whitePlayerName ? true : false;
            this.oponent = this.whitePlayer ? this.blackPlayerName : this.whitePlayerName;
            this.time = gameData.time;
            this.timecontrol = this.gameService.determineTimeControl(this.time);


            setTimeout(() => {
                this.whiteTime = gameData.time;
                this.blackTime = gameData.time;
            });

            this.increment = gameData.increment;
            this.gameResult = "N\A";
            this.hideAllAlerts();
            this.playingGame = true;
            // this.annotatedMoves = [];

        })

        this.gameService.annotatedMovesSubscriber.subscribe(moves => this.annotatedMoves = moves);

        this.gameService.gameActionSubscriber.subscribe(data => {
            if (data.action === "offerDraw") {
                this.displayDrawOffer();
            } else if (data.action === "drawOfferReply") {
                if (data.gamedata.acceptDraw === true) {
                    this.endGame("1/2 - 1/2");
                    this.sendGameResult();
                } else {
                    this.drawOfferRejected = true;
                }
            } else if (data.action === "resign") {
                this.endGame(this.whitePlayer ? "1-0" : "0-1");
            }
            else if (data.action === "gameResult") {
                this.endGame(data.gamedata.gameResult);
                this.sendGameResult();

            } else if (data.action === "offerRematch") {
                console.log("received rematch offer");
                this.rematchOfferReceived = true;
            } else if (data.action === "oponentDisconnected") {
                this.oponentDisconnected = true;
                this.timeToReconnect = 30
                let interval = setInterval(() => {
                    this.timeToReconnect -= 1;
                    if (this.timeToReconnect === 0) {
                        clearInterval(interval);
                    }
                }, 1000);
            } else if (data.action === "startPositionSetup") {
                this.positionSetupActive = true;
            } else if (data.action === "finishPositionSetup") {
                this.positionSetupActive = false;
            }
        });

        this.gameService.moveSubscriber.subscribe(playedMove => {
            if (playedMove.gameId === this.gameId) {
                this.lastMove = playedMove;
                if (playedMove.gameResult !== "N/A") {
                    this.gameResult = playedMove.gameResult;
                    this.playingGame = false;
                }
                else {
                    if ((playedMove.moveColor == COLOR.white && this.whitePlayer || playedMove.moveColor == COLOR.black && !this.whitePlayer) && this.drawOfferReceived) {
                        this.drawOfferReceived = false;
                        this.drawOfferRejected = false;
                    }
                }
                if (this.mode === CHESSBOARD_USAGE_MODES.ANALYZING && this.engineAnalysisActivated) {

                    this.engineService.stopPositionAnalysis();
                    this.engineService.startPositionAnalysis(playedMove.fen);
                }
            }
        });

    };

    toggleStartEngine(event) {
        if (!event.target.checked) {
            this.engineService.stopEngine(false);
            this.engineAnalysisActivated = false;
        } else {
            if (this.lastMove) {
                this.engineService.startPositionAnalysis(this.lastMove.fen);
            }
            else {
                this.engineService.startPositionAnalysis("startpos");
            }

            this.engineAnalysisActivated = true;
        }
    }

    determineInitialModeOfUsage(action) {
        if (action === 'observe') {
            this.mode = this.chessboardUsageModes.OBSERVING;
        } else if (action === 'play') {
            this.mode = this.chessboardUsageModes.PLAYING;
        } else {
            this.mode = this.chessboardUsageModes.ANALYZING;
        }
    };

    ngAfterViewInit() {
        this.screenSizeObserver.asObservable().subscribe(() => {

            if (this.screenSizeObserver.isActive("lt-md")) {
                console.log("SM screen");
                this.activeMedia = "sm";
            } else if (this.screenSizeObserver.isActive("md")) {
                console.log("SM screen");
                this.activeMedia = "gt-md";
            } else if (this.screenSizeObserver.isActive("gt-md")) {
                console.log("> MD screen");
                this.activeMedia = "gt-sm"
            }
        });
    }

    checkMateDelivered(moveNotation: string): boolean {
        return moveNotation.indexOf("#") !== -1;
    }

    ngOnDestroy() {
        if (this.mode === CHESSBOARD_USAGE_MODES.OBSERVING) {
            this.stopObservingGame();
        } else if (this.mode === CHESSBOARD_USAGE_MODES.PLAYING) {
            let playerLeftGameMessage = {
                action: "playerLeftOngoingGame",
                playername: this.authenticationService.getUsername(),
            };

            this.socket.send(JSON.stringify(playerLeftGameMessage));
        } else {
            this.engineService.stopEngine(true);
        }
    }

    stopObservingGame() {
        this.http.get(`${BASEURL}/game/${this.gameId}}/stopObserving`, {}).toPromise().then(() =>
            console.log("Removing of observer successfull.")
            , (data) =>
                console.log("Removing of observer failed:" + data.error)
        );
    };

    activateAnalysisMode() {
        this.mode = this.chessboardUsageModes.ANALYZING;
        this.gameService.emitGameAction({ gameId: this.gameId, action: "startGameAnalysis", gamedata: [] });
    };

    updatePlayerElos(gameResultWhite, gameResultBlack) {

        let expectedOutcomeWhite = 1 / (1 + Math.pow(
            10, (this.blackPlayerElo - this.whitePlayerElo) / 400));
        let expectedOutcomeBlack = 1 / (1 + Math.pow(
            10, (this.whitePlayerElo - this.blackPlayerElo) / 400));
        let newRatingWhite = Math
            .round(this.whitePlayerElo
                + 15
                * (gameResultWhite - expectedOutcomeWhite));
        let newRatingBlack = Math
            .round(this.blackPlayerElo
                + 15
                * (gameResultBlack - expectedOutcomeBlack));

        this.whitePlayerEloChange = newRatingWhite - this.whitePlayerElo;
        this.blackPlayerEloChange = newRatingBlack - this.blackPlayerElo;
        this.whitePlayerElo = newRatingWhite;
        this.blackPlayerElo = newRatingBlack;
    };

    initialiseWebSockets() {
        this.socket = this.webSocketService.initWebSocket();

        const onOpen = function () {
            console.log("opening session and requesting game info");
        }

        const onError = function (event) {
            // //console.log("Error occured:" + event);
        }

        const onMessage = (message) => {
            console.log("Received message");
            console.log(message);
            let data = JSON.parse(message.data);
            if (data.action === "startGame") {
                this.playingGame = true;
                if (this.tournamentId) {
                    this.router.navigate([`tournamentgame/${this.tournamentId}/${data.gameId}/play`]);
                }
                else {
                    this.router.navigate([`/game/${data.gameId}/play`]);
                }

            }
        }

        this.socket.onmessage = (message) => onMessage(message);
        this.socket.onerror = onError;
        this.socket.onopen = onOpen;
        this.socket.onclose = () => {
        }
    };

    displayDrawOffer() {
        console.log("Draw offer received");
        this.drawOfferReceived = true;
    };

    endGame(gameResult) {
        if (this.gameResult === "N\A") {
            $("#arrow").remove();

            let gameResultWhite: number;
            let gameResultBlack: number;
            if (gameResult.indexOf("1-0") !== -1) {
                gameResultWhite = 1;
                gameResultBlack = 0;
            } else if (gameResult.indexOf("0-1") !== -1) {
                gameResultWhite = 0;
                gameResultBlack = 1;
            } else if (gameResult === "1/2 - 1/2") {
                gameResultWhite = 0.5;
                gameResultBlack = 0.5;
            }

            this.gameResult = gameResult;
            this.playingGame = false;
            this.updatePlayerElos(gameResultWhite, gameResultBlack);
            this.gameService.emitGameResult({
                gameId: this.gameId,
                timecontrol: this.timecontrol,
                tournamentId: this.tournamentId,
                gameResult: this.gameResult,
                whitePlayerElo: this.whitePlayerElo,
                blackPlayerElo: this.blackPlayerElo,
                whitePlayerEloChange: this.whitePlayerEloChange,
                blackPlayerEloChange: this.blackPlayerEloChange,
                annotatedMoves: this.annotatedMoves
            });

            if (this.whitePlayer) {
                this.matchScore.push(gameResultWhite);
            } else {
                this.matchScore.push(gameResultBlack);
            }
        }



    };


    offerDraw() {
        let drawOffer = {
            action: "offerDraw",
            oponent: this.oponent
        };
        this.socket.send(JSON.stringify(drawOffer));
    };

    drawOfferReply(acceptDraw) {
        let drawOfferReply = {
            action: "drawOfferReply",
            player: this.authenticationService.getUsername(),
            oponent: this.oponent,
            acceptDraw: acceptDraw
        };

        if (acceptDraw) {
            this.endGame("1/2 - 1/2");
        }
        this.socket.send(JSON.stringify(drawOfferReply));

        this.drawOfferReceived = false;
    };

    sendGameResult() {
        let gameResult = {
            action: "gameResult",
            oponent: this.oponent,
            gameId: this.gameId,
            tournamentId: this.tournamentId,
            gameResult: this.gameResult,
            whitePlayerElo: this.whitePlayerElo,
            blackPlayerElo: this.blackPlayerElo,
            annotatedMoves: JSON.stringify(this.annotatedMoves)
        };

        this.socket.send(JSON.stringify(gameResult));
    };

    resign() {
        this.resignButtonPressed = false;
        let gameResult = !this.whitePlayer ? "1-0 Black resigned" : "0-1 White resigned";
        this.endGame(gameResult);
        this.sendGameResult();
    };

    offerRematch() {
        let offerRematchMessage = {
            action: "offerRematch",
            oponent: this.whitePlayer ? this.blackPlayerName : this.whitePlayerName
        }
        this.socket.send(JSON.stringify(offerRematchMessage));
    };

    replyToRematchOffer(acceptOffer: boolean) {
        if (acceptOffer) {
            const acceptRematchReplyMessage = {
                action: 'rematchOfferReply',
                acceptRematchOffer: true,
                whitePlayer: this.whitePlayerName === this.user ? this.oponent : this.user,
                blackPlayer: this.whitePlayerName === this.user ? this.user : this.oponent,
                time: this.time,
                increment: this.increment
            }
            // this.whiteTime = 10;
            // this.blackTime = 10;
            this.socket.send(JSON.stringify(acceptRematchReplyMessage));
        }

        this.rematchOfferReceived = false;

    }

    navigateToLobby() {
        if (this.tournamentId) {
            this.router.navigateByUrl("/tournaments/" + this.tournamentId);
        } else {
            this.router.navigateByUrl("/lobby");
        }
    }

    onTimeevents($event) {
        console.log("Handling clock event:");
        console.log($event);
        if ($event.color === COLOR.white) {
            console.log("Playing hall Setting white time to: " + $event.time)
            this.whiteTime = $event.time;
        } else if ($event.color === COLOR.black) {
            console.log("Playing Hall Setting black time to: " + $event.time)
            this.blackTime = $event.time;
        }
    }

}
