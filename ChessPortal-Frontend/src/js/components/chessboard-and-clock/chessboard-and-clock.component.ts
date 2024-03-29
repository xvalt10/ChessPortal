import {MediaObserver} from '@angular/flex-layout';
import {HttpClient} from '@angular/common/http';
import {WebSocketService} from './../../services/websocketService';
import {JwtAuthenticationService} from './../../services/jwtAuthenticationService';
import {GameService} from './../../services/game.service';
import {Component, OnInit, Input, AfterViewInit, ViewChild, ElementRef, OnDestroy} from '@angular/core';

import {
    Chessboard,
    COLOR,
    MOVE_INPUT_MODE,
    INPUT_EVENT_TYPE,
    MARKER_TYPE,
    PIECE
} from "../../components/cm-chessboard/Chessboard.js";
import {ActivatedRoute, Router} from "@angular/router";
import {CHESSBOARD_USAGE_MODES, BASEURL} from "../../../js/constants.js";
import {withLatestFrom, retryWhen, delay, tap} from 'rxjs/operators';

import {EngineOutput} from '../../services/stockfish.service'

@Component({
    selector: 'chessboard',
    templateUrl: './chessboard-and-clock.component.html',
    styleUrls: ['./chessboard-and-clock.component.css']
})
export class ChessboardAndClockComponent implements OnInit, AfterViewInit, OnDestroy {

    constructor(private screenSizeObserver: MediaObserver, private router: Router, private http: HttpClient, private gameService: GameService, private route: ActivatedRoute, private authService: JwtAuthenticationService, private websocketService: WebSocketService) {
        this.chess = new this.chessRules();
        this._showClocks = true;
        this.heightOfEngineScoreDivBlack = 50;
        this.heightOfEngineScoreDivWhite = 50;
        this.preMove = null;
    }

    _gameId: string;
    _gamedata: any;
    _mode: string;
    _color: string;
    _message: string;
    _showClocks: boolean;


    tournamentId: any;

    @Input() set gameId(value: string) {
        console.log("Setting gameid to:" + value)
        this._gameId = value;

    }

    @Input() set showClocks(value: boolean) {
        this._showClocks = value;
    }

    @Input() set mode(value: string) {
        this._mode = value;

    }

    @Input() set message(value: string) {
        this._message = value;

    }

    @Input() set gamedata(value: string) {
        this._gamedata = value;
    }

    @Input() set color(color: string) {
        this._color = color;
        if (this.svgChessboard) {
            this.svgChessboard.setOrientation(color);
            if (color === COLOR.white) {
                this.svgChessboard.enableMoveInput(this.moveInputHandler, COLOR.white);
            } else {
                this.svgChessboard.disableMoveInput();
            }
        }
    }

    @ViewChild("chessboardContainer")
    private chessboardContainer: ElementRef;

    MAIN_LINE = -1
    chessRules = require("../../../js/chessRules.js");

    chess;
    svgChessboard = null;
    moveNumber;
    socket: WebSocket;
    user;
    element;
    castling = null;
    pawnPromotionMove = {from: null, to: null, promotion: null}
    lastMove = {san: null, color: null, moveSent: false}

    positionOccurrencesMap = new Map();
    observedPlayer: string;

    chessboardUsageModes = CHESSBOARD_USAGE_MODES;

    playingSimul: boolean;
    playingGame: boolean;
    seekingOponent: boolean;
    seekOponentInterval = null;
    oponent: string;

    time: number;
    increment: number;
    annotatedMoves = [];
    currentVariation = null;

    whiteMove = true;
    whitePlayer = true;

    whiteClock = "00:00";
    blackClock = "00:00";

    whitePlayerName = "whitePlayer";
    whitePlayerElo = 1500;

    blackPlayerName = "blackPlayer";
    blackPlayerElo = 1500;

    whitePlayerEloChange = 0;
    blackPlayerEloChange = 0;

    whitePlayerCountryCode = null;
    blackPlayerCountryCode = null;

    whiteTime: number;
    blackTime: number;

    gameResult = null;
    gameResultMessage = null;

    showPawnPromotionDiv = false;
    showMoveAlternativesDiv = false;
    showGameResultDiv = false;
    alternativeMoves = [];

    engineOutput: EngineOutput;
    heightOfEngineScoreDivWhite: number;
    heightOfEngineScoreDivBlack: number;

    markedSquares = [];
    preMove = {}

    activeMedia: string;

    chessboardProps = {
        position: "start", // set as fen, "start" or "empty"
        style: {
            cssClass: "default",
            showCoordinates: true, // show ranks and files
            showBorder: false, // display a border around the board
        },
        responsive: true, // resizes the board on window resize, if true
        animationDuration: 300, // pieces animation duration in milliseconds
        moveInputMode: MOVE_INPUT_MODE.dragPiece,
        sprite: {
            url: "./assets/images/chessboard-sprite.svg", // pieces and markers are stored as svg in the sprite
            grid: 40  // the sprite is tiled with one piece every 40px
        }
    }

    ngOnInit() {

        this.initialiseEventSubscription();
        this.initialiseWebSockets();
        this.user = this.authService.getUsername();
        this.route.url.subscribe(segments => {
            segments.forEach(segment => {
                    if(segment.path.indexOf("simulgame") !== -1){
                        this.playingSimul = true;
                    }
                }
            );
        });
        this.route.params.subscribe(params => {

            this.tournamentId = params['tournamentId'];
        });
    }

    ngAfterViewInit() {

        if ((this._gameId || this._mode === CHESSBOARD_USAGE_MODES.OBSERVING) && !this._gamedata) {
            this.requestGameInfo();
        } else if (this._gamedata && this._mode === CHESSBOARD_USAGE_MODES.OBSERVING) {
            this.observeGame(this._gamedata);

            let annotatedMoves = JSON.parse(this._gamedata.movesJson);
            if (annotatedMoves.length > 0) {
                let lastMove = annotatedMoves[annotatedMoves.length - 1];
                let fenAfterLastMove;
                if (lastMove && lastMove.blackMove !== "") {
                    fenAfterLastMove = lastMove.chessboardAfterBlackMove;
                } else {
                    if (lastMove) {
                        fenAfterLastMove = lastMove.chessboardAfterWhiteMove;
                    }
                }
                this.redrawChessboard(fenAfterLastMove);
            } else{
                this.chess = new this.chessRules();
            }

        } else if (this._mode === CHESSBOARD_USAGE_MODES.ANALYZING) {
            this.initialiseChessboard(COLOR.white);
        }
        this.screenSizeObserver.asObservable().subscribe(() => {
            if (this.screenSizeObserver.isActive("sm")) {
                console.log("SM screen");
                this.activeMedia = "sm";
            } else if (this.screenSizeObserver.isActive("gt-sm")) {
                console.log("> SM screen");
                this.activeMedia = "gt-sm"
            }
        });
    }

    ngOnDestroy(): void {
        clearInterval(this.seekOponentInterval);
    }


    initialiseEventSubscription() {
        this.gameService.gamePositionSubscriber.subscribe(gamePosition => {
            console.log(gamePosition);
            this.redrawChessboard(gamePosition.positionAsFEN);
        });
        this.gameService.clockEventSubscriber.subscribe(clockEvent => {
            if (this._gameId === clockEvent.gameId) {
                this.onTimeevents(clockEvent)
            }
        });

        //this.gameService.annotatedMovesSubscriber.subscribe(annotatedMoves => { this.annotatedMoves = annotatedMoves; });

        this.gameService.gameActionSubscriber.subscribe(gameAction => {
            if (gameAction.gameId === this._gameId) {
                if (gameAction.action === "sendMoveAfterClockPressed") {
                    if (this._mode === CHESSBOARD_USAGE_MODES.PLAYING && this.lastMove && this.lastMove.san && !this.lastMove.moveSent) {
                        this.sendMove(this.chess.fen(), this.lastMove['san'], gameAction.gamedata[0].color, gameAction.gamedata[0].time, gameAction.gamedata[0].timestamp);
                        this.lastMove.moveSent = true;
                    }
                } else if (gameAction.action === "showAlternativeMoves") {
                    this.alternativeMoves = gameAction.gamedata;
                    this.showMoveAlternativesDiv = true;
                } else if (gameAction.action === "startPositionSetup") {
                    this.startPositionSetup();
                } else if (gameAction.action === "setPieceOnMarkedSquares") {
                    this.setPieceToMarkedSquares(gameAction.gamedata[0].piece);
                } else if (gameAction.action === "emptyBoard") {
                    this.emptyBoard();
                } else if (gameAction.action === "finishPositionSetup") {
                    this.chess.load(gameAction.gamedata[0].position);
                    this.moveNumber = gameAction.gamedata[0].moveNumber;
                } else if (gameAction.action === "startGameAnalysis") {
                    this.startAnalysis();
                } else if (gameAction.action === "executeReceivedMove") {
                    this.executeReceivedMove(gameAction.gamedata);
                    if(this.preMove){
                        this.handlePreMove();
                    }

                }
            }
        });

        this.gameService.gameResultSubscriber.subscribe(gameResult => {
            if (gameResult.gameId === this._gameId) {
                this.gameResult = gameResult.gameResult;
                if ((this.gameResult.indexOf("1-0") !== -1 && this.whitePlayer) ||
                    (this.gameResult.indexOf("0-1") !== -1 && !this.whitePlayer)) {
                    this.gameResultMessage = "Congratulation you won the game.";
                } else if (this.gameResult.indexOf("1/2") !== -1) {
                    this.gameResultMessage = "Game ended with a draw.";
                } else {
                    this.gameResultMessage = "You have lost the game.";
                }
                this.playingGame = false;
                this.whitePlayerElo = gameResult.whitePlayerElo;
                this.blackPlayerElo = gameResult.blackPlayerElo;
                this.whitePlayerEloChange = gameResult.whitePlayerEloChange;
                this.blackPlayerEloChange = gameResult.blackPlayerEloChange;
            }
        });

        this.gameService.engineOutputSubscriber.subscribe(engineOutput => {
            let divHeightPercentage = +engineOutput.score / 10 * 50;


            if (divHeightPercentage > 0) {
                divHeightPercentage = Math.min(50, divHeightPercentage);
                this.heightOfEngineScoreDivWhite = Math.round(50 + Math.abs(divHeightPercentage));
                this.heightOfEngineScoreDivBlack = 100 - this.heightOfEngineScoreDivWhite;

            } else if (divHeightPercentage < 0) {
                divHeightPercentage = Math.max(-50, divHeightPercentage);
                this.heightOfEngineScoreDivBlack = Math.round(50 + Math.abs(divHeightPercentage));
                this.heightOfEngineScoreDivWhite = 100 - this.heightOfEngineScoreDivBlack;
            } else {
                this.heightOfEngineScoreDivBlack = 50;
                this.heightOfEngineScoreDivWhite = 50;
            }
        })
    }

    private handlePreMove() {
        this.handleRegularMove(this.preMove);
        this.svgChessboard.changeSquareColor(this.preMove['from']);
        this.svgChessboard.changeSquareColor(this.preMove['to']);
        this.preMove = null;
    }

    startAnalysis() {
        this._mode = this.chessboardUsageModes.ANALYZING;
        console.log("Setting ananlyzing mode");
        if (!this.lastMove['whiteMove']) {
            this.svgChessboard.enableMoveInput(this.moveInputHandler, COLOR.white);
        } else {
            this.svgChessboard.enableMoveInput(this.moveInputHandler, COLOR.black);
        }

    }


    requestGameInfo() {
        console.log("Requesting game info");
        let getGameInfoMessage = {
            action: "getGameInfo",
            user: this.authService.getUsername(),
            gameId: this._gameId,
        };
        if (this._mode === CHESSBOARD_USAGE_MODES.PLAYING || this._mode === CHESSBOARD_USAGE_MODES.ANALYZING) {
            console.log(this.user);
            console.log("Sending request game info message:" + JSON.stringify(getGameInfoMessage));
            this.websocketService.send(JSON.stringify(getGameInfoMessage));

        } else if (this._mode === CHESSBOARD_USAGE_MODES.OBSERVING) {
            console.log("Start  Observing game:")
            this.http.get(`${BASEURL}/observe/${this._gameId}`
            ).pipe(retryWhen(errors =>
                errors.pipe(
                    delay(1000),
                    tap(errorStatus => {
                        console.log(errorStatus);
                        if (errorStatus.status !== 500) {
                            throw errorStatus;
                        }

                        console.log('Retrying...');
                    })
                )))
                .subscribe((game) => {
                    this.observeGame(game);
                }, (data) => {
                    console.log(data);
                    console.log("Retrieval of moves of the observed game failed:" + data.error);
                });
        } else {
            console.log("Other mode:" + this._mode)
        }
    };

    observeGame(game) {

        this.gameResult = "N/A";
        this._gameId = game.gameId;
        this.whitePlayerName = game.whitePlayer.username;
        this.blackPlayerName = game.blackPlayer.username;
        this.whiteTime = game.whitePlayer.time;
        this.blackTime = game.blackPlayer.time;

        //  this.time = 10;
        this.time = game.time;
        this.increment = game.increment;

        this.initialiseChessboard(COLOR.white);

        if (game.whitePlayer.countrycode) {
            this.whitePlayerCountryCode = game.whitePlayer.countrycode;
        }

        if (game.blackPlayer.countrycode) {
            this.blackPlayerCountryCode = game.blackPlayer.countrycode;
        }

        if (game.whitePlayer.elo) {
        } else {
            this.whitePlayerElo = this.gameService.getPlayerEloByGameTimeType(game.gameTimeType, game.whitePlayer);
            game.whitePlayer.elo = this.whitePlayerElo;
        }

        if (game.blackPlayer.elo) {
            this.blackPlayerElo = game.blackPlayer.elo;
        } else {
            game.blackPlayer.elo = this.blackPlayerElo;
            this.blackPlayerElo = this.gameService.getPlayerEloByGameTimeType(game.gameTimeType, game.blackPlayer);
        }

        this.parseGameMoves(game);
        this.redrawLastPosition();
        this.gameService.emitGameData({
            blackPlayer: game.blackPlayer,
            whitePlayer: game.whitePlayer,
            gameId: game.gameId,
            increment: game.increment,
            time: game.time,
            annotatedMoves: this.annotatedMoves
        });

    };


    private redrawLastPosition() {
        if (this.annotatedMoves.length !== 0) {
            let lastMove = this.annotatedMoves[this.annotatedMoves.length - 1];

            if (lastMove.blackMove) {
                this.moveNumber = this.annotatedMoves.length;
                this.blackTime = lastMove.blackTime;
                this.redrawChessboard(lastMove.chessboardAfterBlackMove);
            } else {
                this.moveNumber = this.annotatedMoves.length - 1;
                this.whiteTime = lastMove.whiteTime;
                this.redrawChessboard(lastMove.chessboardAfterWhiteMove);
                if(!this.whitePlayer && this._mode===this.chessboardUsageModes.PLAYING){
                    this.svgChessboard.enableMoveInput(this.moveInputHandler, COLOR.black);
                }
            }
        }
    }

    private parseGameMoves(game) {
        if (game.movesJson) {
            this.annotatedMoves = JSON.parse(game.movesJson);
        } else {
            if (Object.keys(game.annotatedMoves).length > 0) {
                this.annotatedMoves = Object.keys(game.annotatedMoves).map(key => {
                    if(typeof game.annotatedMoves[key] === 'string'){
                        return JSON.parse(game.annotatedMoves[key]);
                    }else {return  game.annotatedMoves[key]}});

                //this.annotatedMoves = JSON.parse(game.annotatedMoves);
                this.annotatedMoves = this.annotatedMoves.map(annotatedMove => {
                    if (!annotatedMove.whiteMove) {
                        annotatedMove.whiteMove = "";
                    }
                    if ((!annotatedMove.blackMove)) {
                        annotatedMove.blackMove = "";
                    }
                    return annotatedMove;
                });
            }
        }
    }

    determineInitialModeOfUsage() {
        /* if (!this._mode) {
            if (typeof this.observedPlayer !== 'undefined') {
                console.log("Setting _mode of usage to observing");
                this._mode = this.chessboardUsageModes.OBSERVING;
            } else if (this.route.snapshot['_routerState'].url.indexOf("analyzeGame") !== -1) {
                this._mode = this.chessboardUsageModes.ANALYZING;
            } else {
                this._mode = this.chessboardUsageModes.PLAYING;
            }
        } */
    };

    initialiseChessboard(color) {

        const container = this.chessboardContainer.nativeElement;
        if (container) {
            while (container.lastElementChild) {
                container.removeChild(container.lastElementChild);
            }
        }
        this.svgChessboard = new Chessboard(container, this.chessboardProps);

        if (this._mode == CHESSBOARD_USAGE_MODES.PLAYING ||
            this._mode == CHESSBOARD_USAGE_MODES.ANALYZING) {
            if (!this.whitePlayer) {
                this.svgChessboard.setOrientation(COLOR.black);
                this.svgChessboard.disableMoveInput();
            } else {
                this.svgChessboard.setOrientation(COLOR.white);
                this.svgChessboard.enableMoveInput(this.moveInputHandler, COLOR.white);
            }
        } else {
            this.svgChessboard.setOrientation(COLOR.white);
            this.svgChessboard.disableMoveInput();
        }

        this.svgChessboard.setPosition("start");
        this.svgChessboard.removeMarkers();

        console.log("Initialising chess rules");
        this.chess = new this.chessRules();
        this.chess.reset();
        this.moveNumber = 0;
    };

    onTimeevents($event) {
        console.log("Setting " + $event.color + " time:" + $event.time);
        console.log($event);
        if ($event.color === COLOR.white) {
            this.whiteTime = $event.time;
        } else if ($event.color === COLOR.black) {
            this.blackTime = $event.time;
        }
    }

    public isPremove():boolean{
        return this._mode === CHESSBOARD_USAGE_MODES.PLAYING && this.annotatedMoves.length>0 && this.svgChessboard.getOrientation() === this.lastMove.color;
    }

    public moveInputHandler = (event) => {

        if (event.type === INPUT_EVENT_TYPE.moveStart) {
            if(this.preMove && (event.square === this.preMove['from'] || event.square === this.preMove['to'])){
            this.svgChessboard.changeSquareColor(this.preMove['from']);
            this.svgChessboard.changeSquareColor(this.preMove['to']);
            this.preMove = null;}
        }

        if (event.type === INPUT_EVENT_TYPE.moveDone) {
            const move = {from: event.squareFrom, to: event.squareTo, promotion: null};
            if(this.isPremove()){
                this.preMove = move;
                this.svgChessboard.changeSquareColor(event.squareFrom,'yellow');
                this.svgChessboard.changeSquareColor(event.squareTo,'yellow');
            } else{
                this.handleRegularMove(move);
            }
        } else {
            return true;
        }

    }

    private handleRegularMove(move) {
        const validMove = this.chess.move(move);
        if (validMove) {
            const currentPositionAsFEN = this.chess.fen();

            setTimeout(() => {
                this.processValidMove(validMove, currentPositionAsFEN, true);

            });
        } else {
            if (this.pawnReachedPromotionSquare(move.from, move.to)) {
                this.pawnPromotionMove = move;
                this.showPawnPromotionDiv = true;
            }
            console.warn("invalid move", move)
        }
    }

    processValidMove(validMove, currentPositionAsFEN: string, sendMoveToOponent: boolean) {

        let moveNotation: string;

        if (validMove.annotatedMove) {
            moveNotation = validMove.moveNotation;
        } else {
            moveNotation = validMove.san;
        }
        this.lastMove.san = moveNotation;
        this.lastMove.color = validMove.color
        this.lastMove.moveSent = false;
        this.svgChessboard.setPosition(currentPositionAsFEN).then(() => {
            //this.svgChessboard.disableMoveInput();

            if (validMove.color === COLOR.white) {
                if (this._mode === this.chessboardUsageModes.ANALYZING) {
                    this.svgChessboard.enableMoveInput(this.moveInputHandler, COLOR.black);
                }
            } else {
                this.moveNumber = this.moveNumber + 1;
                if (this._mode === this.chessboardUsageModes.ANALYZING) {
                    this.svgChessboard.enableMoveInput(this.moveInputHandler, COLOR.white);
                }
            }
            /*if (this._mode === this.chessboardUsageModes.PLAYING) {
                if (sendMoveToOponent) {
                    this.svgChessboard.disableMoveInput();
                }
            }*/
            if (this.chess.game_over()) {
                this.gameResult = this.getGameResult(validMove);
                if (this._mode === this.chessboardUsageModes.PLAYING) {
                    this.gameService.emitGameAction({
                        action: "gameResult",
                        gameId: this._gameId,
                        gamedata: {gameResult: this.gameResult}
                    });
                }
            }

            this.svgChessboard.removeMarkers();
            this.svgChessboard.addMarker(validMove.from, MARKER_TYPE.move);
            this.svgChessboard.addMarker(validMove.to, MARKER_TYPE.move);

            this.gameService.emitPlayedMove({
                gameId: this._gameId,
                moveNotation,
                moveColor: validMove.color,
                fen: currentPositionAsFEN,
                gameResult: this.gameResult,
                sendMoveToOponent,
                whiteTime: validMove.whiteTime ? validMove.whiteTime : this.whiteTime,
                blackTime: validMove.blackTime ? validMove.blackTime : this.blackTime,
                moveReceived: !sendMoveToOponent,
                piecesSvg: this.svgChessboard.getPieceGroup().innerHTML
            });
            this.whiteMove = !this.whiteMove;
            this.playSoundAfterMove();
        });


    }

    playSoundAfterMove() {
        console.log("Playing sound after move");
        let soundAfterMove = new Audio();
        //Can externalize the variables
        soundAfterMove.src = "./../../../assets/sounds/sound_after_move2.mp3";
        soundAfterMove.load();
        soundAfterMove.play();
    }


    redrawChessboard(fen: string) {
        //redrawChessboard  (currentSquares, elementId, whiteMove, moveNo, variationId, redrawPreviousMove) {

        const fenParts: string[] = fen.split(" ");
        let lastMoveNumber: number = parseInt(fenParts[5]);
        const whiteMoveToRedraw = fenParts[1] === COLOR.black ? true : false;
        let elementId: string;

        this.whiteMove = whiteMoveToRedraw;
        this.moveNumber = whiteMoveToRedraw ? lastMoveNumber - 1 : lastMoveNumber - 2;

        this.whiteMove = !this.whiteMove;
        if (!whiteMoveToRedraw) {
            this.moveNumber = this.moveNumber + 1;
        }

        this.chess.load(fen);
        this.svgChessboard.setPosition(fen);

        if (this._mode === this.chessboardUsageModes.ANALYZING) {
            const color = this.whiteMove ? COLOR.black : COLOR.white;
            this.svgChessboard.enableMoveInput(this.moveInputHandler, color);
        }

    };

    offerRematch() {
        let offerRematchMessage = {
            action: "offerRematch",
            oponent: this.whitePlayer ? this.blackPlayerName : this.whitePlayerName
        }
        this.socket.send(JSON.stringify(offerRematchMessage));
    };

    seekOponent(time, increment): void {
        this.seekOponentInterval = setInterval(() => {
            this.websocketService.seekNewOponentCommand(time, increment)
        }, 1000);
        this.seekingOponent = true;
    }

    analyzeGame() {
        this.router.navigateByUrl(`/game/${this.route.snapshot.paramMap.get("gameId")}/analyze`);
    };

    getGameResult(validMove) {
        if (this.chess.in_stalemate()) {
            return "1/2 (stalemate)";
        } else if (this.chess.insufficient_material()) {
            return "1/2 (insufficient material)";
        } else if (this.chess.in_threefold_repetition()) {
            return "1/2 (threefold repetition)";
        } else if (this.chess.in_checkmate()) {
            return validMove.color === COLOR.white ? "1-0 White delivered checkmate" : "0-1 Black delivered checkmate";
        } else {
            return "1/2 (50 move rule)";
        }
    }

    pawnReachedPromotionSquare(startsquare: string, endsquare: string) {
        const pieceOnStartSquare = this.svgChessboard.getPiece(startsquare);
        const pieceOnEndSquare: string = this.svgChessboard.getPiece(endsquare);
        if ((pieceOnStartSquare === "wp" && endsquare.indexOf("8") !== -1) || (pieceOnStartSquare === "bp" && endsquare.indexOf("1") !== -1)) {

            if ((pieceOnStartSquare === "wp" && (pieceOnEndSquare.indexOf("b") !== -1 || pieceOnEndSquare === null)) ||
                (pieceOnStartSquare === "bp" && (pieceOnEndSquare.indexOf("w") !== -1 || pieceOnEndSquare === null))) {
                return true;
            }
        }
        return false;
    }

    executeReceivedMove(move) {
        console.log(`Executing move ${move.annotatedMove} (${move.gameId}) - board ${this._gameId}`);
        //console.log(this.chess.getPosition());

        this.castling = "";

        // if (move.color === COLOR.white) {
        //     console.log("Received move: " + move.moveNotation + " white time: " + move.whiteTime + "black time:" + move.blackTime)
        //     this.whiteTime = move.whiteTime;
        // } else {
        //     console.log("Received move: " + move.moveNotation + " white time: " + move.whiteTime + "black time:" + move.blackTime)
        //     this.blackTime = move.blackTime;
        // }


        // this.whiteTime = move.whiteTime;
        console.log("received move whitetime:" + move.whiteTime);
        // this.blackTime = move.blackTime;
        console.log("received move blacktime:" + move.blackTime);
        const validMove = this.chess.move(move.annotatedMove);
        if (validMove) {
            validMove.whiteTime = move.whiteTime;
            validMove.blackTime = move.blackTime;
            if (validMove.color === 'w') {
                this.whiteTime = validMove.whiteTime;
            } else {
                this.blackTime = validMove.blackTime;
            }

            this.processValidMove(validMove, move.chessboardAfterMove, false);
            if (this._mode === this.chessboardUsageModes.PLAYING) {
                this.svgChessboard.enableMoveInput(this.moveInputHandler, validMove.color === COLOR.black ? COLOR.white : COLOR.black);
            }
        } else {
            console.error("InvalidMove");
            console.error(move);
        }
    };

    promotePiece(piece) {

        /*  this.updateChessboardAfterMove(this.startPosition.piece, this.element,
             this.startPosition, this.endPosition, true,
             this.whitePlayer, piece);
         this.lastMove.startPosition = this.startPosition;
         this.lastMove.endPosition = this.endPosition; */

        this.pawnPromotionMove.promotion = piece
        const validMove = this.chess.move(this.pawnPromotionMove);
        if (validMove) {
            const currentPositionAsFEN = this.chess.fen();
            this.processValidMove(validMove, currentPositionAsFEN, true);
            /*      this.pressClock(!this.whitePlayer);
                 this.setMyMove(false); */
        }
        this.showPawnPromotionDiv = false;

    };

    displayPromotionPicker(elem,
                           startPos, endPos) {
        this.element = elem;
        this.showPawnPromotionDiv = true;

    };

    sendMove(fen: string, annotatedMove: string, color: string, timeRemainingAfterMove: number, timestamp:number) {

        let moveAction = {
            action: "move",
            chessboardAfterMove: fen,
            gameId: this._gameId,
            tournamentId: this.tournamentId,
            annotatedMove: annotatedMove,
            timestamp: timestamp,
            utcOffset: new Date().getTimezoneOffset() * 60,
            whiteMove: this.whiteMove,
            whiteTime: this.whiteTime,
            blackTime: this.blackTime
        };

        if (color === COLOR.white) {
            moveAction.whiteTime = timeRemainingAfterMove;
            this.whiteTime = timeRemainingAfterMove;
        } else {
            moveAction.blackTime = timeRemainingAfterMove;
            this.blackTime = timeRemainingAfterMove;
        }

        console.log("sending move to server:");
        console.log(JSON.stringify(moveAction));
        this.socket.send(JSON.stringify(moveAction));

    };


    startGame(game) {
        console.log("Received gameInfo");
        console.log(game);

        this.gameResult = "N/A";

        this.whitePlayerName = game.whitePlayer.username;
        this.blackPlayerName = game.blackPlayer.username;
        this.whitePlayerElo = game.whitePlayer.elo;
        this.blackPlayerElo = game.blackPlayer.elo;
        if(game.annotatedMoves.length == 0){
        this.whiteTime = game.time;
        this.blackTime = game.time;
        }
        this.annotatedMoves = game.annotatedMoves.length > 0 ? game.annotatedMoves : [];


        if (game.whitePlayer.countrycode) {
            this.whitePlayerCountryCode = game.whitePlayer.countrycode;
        }

        if (game.blackPlayer.countrycode) {
            this.blackPlayerCountryCode = game.blackPlayer.countrycode;
        }

        this.time = game.time;

        console.log("Setting time in startGame" + this.time);
        this.increment = game.increment;

        this.whitePlayer = this.user === this.whitePlayerName;

        if (!this.whitePlayer) {
            this.initialiseChessboard(COLOR.black)

        } else {
            this.initialiseChessboard(COLOR.white)

        }

        this.parseGameMoves(game);
        this.redrawLastPosition();
        this.gameService.emitGameData({
            blackPlayer: game.blackPlayer,
            whitePlayer: game.whitePlayer,
            gameId: game.gameId,
            increment: game.increment,
            time: game.time,
            annotatedMoves: this.annotatedMoves
        });

        clearInterval(this.seekOponentInterval);
        this.seekingOponent = false;
        this.playingGame = true;
    }

    initialiseWebSockets() {
        this.socket = this.websocketService.initWebSocket();
        const onOpen = function () {
            console.log("opening session and requesting game info");
        }
        const onError = function (event) {
            console.log("Error occured:" + event);
        }
        const onMessage = (message) => {
            console.log("Received message");
            console.log(message);
            let data = JSON.parse(message.data);
            if (data.action === "gameInfo") {
                if (this._mode === CHESSBOARD_USAGE_MODES.PLAYING) {
                    // this.whiteTime = 10;
                    // this.blackTime = 10;
                    this.startGame(data);
                } else if (this._mode === CHESSBOARD_USAGE_MODES.OBSERVING || this._mode === CHESSBOARD_USAGE_MODES.ANALYZING) {
                    this.observeGame(data);
                }
            } else if (data.action === "move") {
                console.log("Received move for game:" + data.gameId);
                if (data.gameId === this._gameId) {
                    this.executeReceivedMove(data);
                    if(this.preMove){
                        this.handlePreMove();
                    }
                } else {
                    this.gameService.emitGameAction({
                        gameId: data.gameId,
                        action: 'executeReceivedMove',
                        gamedata: data
                    });
                }
            } else if (data.action === "nextSimulGame") {

                this.router.navigate([`simulgame/${this.tournamentId}/${data.gameId}/play`]).then(navigationSuccessful => {
                    if (navigationSuccessful) {
                        this.chess = new this.chessRules();
                        this.chess.reset();
                        this.gameId = data.gameId;
                        this.whiteMove = true;
                        this.requestGameInfo();
                    }
                });
            }else if (data.action === "startGame") {
                if (this.tournamentId) {
                    let urlstart = !this.playingSimul?'tournamentgame':'simulgame';
                    this.router.navigate([`${urlstart}/${this.tournamentId}/${data.gameId}/play`]).then(navigationSuccessful => {
                        if (navigationSuccessful) {
                            this.chess = new this.chessRules();
                            this.chess.reset();
                            this.gameId = data.gameId;
                            this.whiteMove = true;
                            this.requestGameInfo();
                        }
                    });
                } else {
                    this.router.navigate(['/game/' + data.gameId + "/play"]).then(navigationSuccessful => {
                        if (navigationSuccessful) {
                            this.chess = new this.chessRules();
                            this.chess.reset();
                            this.gameId = data.gameId;
                            this.whiteMove = true;
                            this.requestGameInfo();
                        }
                    });
                }
            } else {
                if (data.gameId === this.gameId) {
                    if (data.action === "gameResult" || data.action === "resign") {
                        this.playingGame = false;
                    }
                }
                this.gameService.emitGameAction({action: data.action, gameId: this._gameId, gamedata: data});
            }
        }

        this.socket.onmessage = (message) => onMessage(message);
        this.socket.onerror = onError;
        this.socket.onopen = onOpen;
        this.socket.onclose = () => {

        }
    };

    selectMove(move: any) {
        this.gameService.emitGamePosition({
            gameId: this.gameId,
            positionAsFEN: move['fen'],
            variationId: move['variation']
        });
        this.showMoveAlternativesDiv = false;
    }

    startPositionSetup() {
        this.svgChessboard.enableContextInput((event) => {
            this.markedSquares.push(event.square);
            const markersOnSquare = this.svgChessboard.getMarkers(event.square, MARKER_TYPE.emphasize)
            if (markersOnSquare.length > 0) {
                this.svgChessboard.removeMarkers(event.square, MARKER_TYPE.emphasize)
            } else {
                this.svgChessboard.addMarker(event.square)
            }
        });
    }

    setPieceToMarkedSquares(piece) {
        this.markedSquares.forEach(square => {
            this.svgChessboard.setPiece(square, piece)
                .then(response => this.gameService.emitGameAction({
                    gameId: this.gameId,
                    action: "positionAfterSetup",
                    gamedata: [{position: this.svgChessboard.getPosition()}]
                }));
            this.svgChessboard.removeMarkers(square, MARKER_TYPE.emphasize);
        });
        this.markedSquares = [];
    }

    emptyBoard() {
        this.svgChessboard.setPosition("empty")
            .then(response => this.gameService.emitGameAction({
                gameId: this.gameId,
                action: "positionAfterSetup",
                gamedata: [{position: this.svgChessboard.getPosition()}]
            }));

    }


}
