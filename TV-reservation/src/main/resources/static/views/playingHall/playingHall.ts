import { JwtAuthenticationService } from './../../js/services/jwtAuthenticationService';
import { WebSocketService } from './../../js/services/websocketService';
import { AuthenticationService } from '../../js/services/authenticationService';
import { Component, OnInit, OnDestroy, AfterViewInit, HostListener } from '@angular/core';
import { HttpClient, HttpHeaders, } from '@angular/common/http';
import { ActivatedRoute, Router } from "@angular/router";
import { Chessboard, COLOR, MOVE_INPUT_MODE, INPUT_EVENT_TYPE, MARKER_TYPE, PIECE } from "../../node_modules/cm-chessboard/src/cm-chessboard/Chessboard.js";
import { Chess } from '../../js/chessRules.js';
import * as $ from 'jquery';
import { url } from 'inspector';
import { MediaObserver, MediaChange } from '@angular/flex-layout'
import { BASEURL } from '../../js/constants.js';

@Component({
    selector: 'selector-name',
    templateUrl: 'playingHall.html'
})

export class PlayingHall implements OnInit, OnDestroy, AfterViewInit {

    constructor(private screenSizeObserver: MediaObserver, private http: HttpClient, private route: ActivatedRoute,
        private authenticationService: JwtAuthenticationService, private webSocketService: WebSocketService, private router: Router) {

    }

    moveToHighlight = {
        variationId: null,
        moveNumber: null,
        whiteMove: true
    }

    chessboardUsageModes = {
        PLAYING: "P",
        OBSERVING: "O",
        ANALYZING: "A"
    }


    //Position setup variables
    currentPositionFEN: string = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    currentPositionValid: boolean = true;
    startingMovePositionSetup: number = 0;
    showPositionSetupDiv: boolean = false;
    markedSquares = [];
    activecolor: string = 'w';
    castlingAvailability: string = 'KQkq'
    enPassantTargetSquare: string = '-';
    halfMoveClock: number = 0;



    root = this;
    resignButtonPressed: boolean = false;

    // The active media query (xs | sm | md | lg | xl)
    activeMedia: string

    MAIN_LINE = -1
    chessRules = require("../../js/chessRules.js");
    chess;
    svgChessboard = null;
    chessboard;
    startPosition;
    endPosition;
    moveNumber;
    socket;
    user;
    clockTimer;
    enPassant;
    element;
    castling = null;
    pawnPromotionMove = { from: null, to: null, promotion: null }
    lastMove = { startPosition: null, endPosition: null };
    positionOccurrencesMap = new Map();
    observedPlayer: string;
    variationId = 0;
    mode: string = this.chessboardUsageModes.PLAYING;
    squareSize: number = 55;
    playingGame = null;
    seekingOponent = null;
    oponent = null;
    whitePlayer = true;
    time = 0;
    increment = 0;
    whiteMove = true;
    whiteClock = "00:00";
    blackClock = "00:00";
    whiteTime: number;
    blackTime: number;
    myMove = null;
    whitePlayerName = "whitePlayer";
    whitePlayerElo = 1500;
    blackPlayerName = "blackPlayer";
    blackPlayerElo = 1500;
    whitePlayerEloChange = 0;
    blackPlayerEloChange = 0;
    gameResult = null;
    showPawnPromotionDiv = false;
    seekFormShown = false;
    annotatedMoves = []
    scrollbarconfig = {
        setHeight: 400,
    };

    chessboardProps = {
        position: "start", // set as fen, "start" or "empty"
        style: {
            cssClass: "default",
            showCoordinates: true, // show ranks and files
            showBorder: false, // display a border around the board
        },
        responsive: true, // resizes the board on window resize, if true
        animationDuration: 300, // pieces animation duration in milliseconds
        moveInputMode: MOVE_INPUT_MODE.dragMarker,
        sprite: {
            url: "./assets/images/chessboard-sprite.svg", // pieces and markers are stored as svg in the sprite
            grid: 40  // the sprite is tiled with one piece every 40px
        }
    }
    currentVariation = null;

    //alert related properties
    drawOfferReceived: boolean = false;
    drawOfferRejected: boolean = false;
    rematchOfferReceived: boolean = false;
    rematchOfferRejected: boolean = false;
    oponentDisconnected: boolean = false;

    variations = new Map();
    newGame: boolean;
    gameId: string;

    hideAllAlerts() {
        this.drawOfferReceived = false;
        this.drawOfferRejected = false;
        this.rematchOfferReceived = false;
        this.rematchOfferRejected = false;
        this.oponentDisconnected = false;
    }




    ngOnInit() {
        this.route.params.subscribe(params => {
            this.observedPlayer = params['observedPlayer'];
            this.gameId = params['gameId'];
        });

        this.whitePlayer = true;
        this.user = this.authenticationService.authenticatedUser;

        this.initialiseWebSockets();
        this.initialiseChessboard();
        this.determineInitialModeOfUsage();
        this.requestGameInfo();

    };

    ngAfterViewInit() {
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

    @HostListener('document:keydown', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
        if (this.mode === this.chessboardUsageModes.ANALYZING) {
            const key = event.key;
            switch (key) {
                case "Left": // IE/Edge specific value
                case "ArrowLeft":
                    this.goToPreviousMove();
                    break;
                case "Right": // IE/Edge specific value
                case "ArrowRight":
                    this.goToNextMove();
                    break;
            }
        }

    }

    updateCastlingRights(value) {
        if (this.castlingAvailability.indexOf(value) === -1) {
            this.castlingAvailability = this.castlingAvailability + value;
        } else {
            this.castlingAvailability = this.castlingAvailability.replace(value, '');
            if (this.castlingAvailability === '') {
                this.castlingAvailability = '-';
            }
        }
        this.buildFenAfterPositionSetup();
    }

    updateMoveNumber(moveNumber: number) {
        this.startingMovePositionSetup = moveNumber;
        if (this.activecolor === COLOR.black) {
            this.moveNumber = moveNumber - 1;
        } else {
            this.moveNumber = moveNumber;
        }

        this.buildFenAfterPositionSetup();
    }

    updateActiveColor(activecolor: string) {
        this.activecolor = activecolor;
        this.buildFenAfterPositionSetup();
    }

    finishPositionSetup() {
        const fenValid = this.chess.load(this.currentPositionFEN);
        if (fenValid) {

            this.currentPositionValid = true;
            this.showPositionSetupDiv = false;
            this.annotatedMoves = [];
            this.chessboard.annotatedMoves = [];
            for (let index = 0; index < this.moveNumber; index++) {
                this.chessboard.annotatedMoves.push({ moveNumber: index + 1, whiteMove: "", blackMove: "" });
                //this.annotatedMoves.push({moveNumber:index+1,whiteMove:"", blackMove:""})
            }

        } else {
            this.currentPositionValid = false;
        }
        this.svgChessboard.enableMoveInput(this.moveInputHandler, this.activecolor);

    }


    setupVariation($event) {
        this.redrawChessboard($event.fen, $event.variationId);
    }

    onActivate(componentReference) {
        console.log(componentReference)
        componentReference.anyFunction();
        //Below will subscribe to the searchItem emitter
        componentReference.searchItem.subscribe((data) => {
            // Will receive the data from child here 
        })
    }

    initPage() {

    };

    convertSquareToCoordinates(square_SAN: string) {
        if (typeof square_SAN !== 'undefined') {
            const columns = 'abcdefgh';
            const rowString = square_SAN.substr(1, 1);
            const row = +rowString - 1;
            const column = columns.indexOf(square_SAN.substr(0, 1));
            const piece = this.chessboard.squares[this.findIndexOfSquare(column, row)];
            return {
                row,
                column,
                piece
            }
        } else return null;
    };

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

    public moveInputHandler = (event) => {

        const startPosition = this.convertSquareToCoordinates(event.squareFrom);
        const endPosition = this.convertSquareToCoordinates(event.squareTo);
        let piece: string;

        console.log("event", event);

        if (event.type === INPUT_EVENT_TYPE.moveStart) {
            piece = this.svgChessboard.getPiece(event.square);
        }

        if (event.type === INPUT_EVENT_TYPE.moveDone) {
            const move = { from: event.squareFrom, to: event.squareTo, promotion: null };

            const validMove = this.chess.move(move);
            if (validMove) {
                const currentPositionAsFEN = this.chess.fen();
                setTimeout(() => {
                    this.processValidMove(validMove, currentPositionAsFEN, true);
                });
            } else {
                if (this.pawnReachedPromotionSquare(event.squareFrom, event.squareTo)) {
                    this.pawnPromotionMove = move;
                    this.showPawnPromotionDiv = true;
                }
                console.warn("invalid move", move)
            }
        } else {
            return true
        }

        this.hideAllAlerts();
    }

    checkMateDelivered(moveNotation: string): boolean {
        return moveNotation.indexOf("#") !== -1;
    }

    setupPosition() {
        this.showPositionSetupDiv = true;
        this.moveNumber = 0;
        this.buildFenAfterPositionSetup();

        this.svgChessboard.enableContextInput((event) => {
            this.markedSquares.push(event.square);
            const markersOnSquare = this.svgChessboard.getMarkers(event.square, MARKER_TYPE.emphasize)
            if (markersOnSquare.length > 0) {
                this.svgChessboard.removeMarkers(event.square, MARKER_TYPE.emphasize)
            } else {
                this.svgChessboard.addMarker(event.square)
            }
        })
    }

    buildFenAfterPositionSetup() {
        this.currentPositionFEN = this.svgChessboard.getPosition() + ' ' + this.activecolor + ' ' + this.castlingAvailability + ' ' + this.enPassantTargetSquare
            + ' ' + this.halfMoveClock + ' ' + (this.activecolor === COLOR.white ? (+this.startingMovePositionSetup + 1) : this.startingMovePositionSetup === 0 ? 1 : this.startingMovePositionSetup);
    }

    emptyBoard() {
        this.svgChessboard.setPosition("empty")
            .then(response => this.buildFenAfterPositionSetup());

    }

    setPieceToMarkedSquares(piece) {
        this.markedSquares.forEach(square => {
            this.svgChessboard.setPiece(square, piece)
                .then(response => this.buildFenAfterPositionSetup());
            this.svgChessboard.removeMarkers(square, MARKER_TYPE.emphasize);
        });
        this.markedSquares = [];
    }

    processValidMove(validMove, currentPositionAsFEN: string, sendMoveToOponent: boolean) {

        let moveNotation: string;
        if (validMove.annotatedMove) {
            moveNotation = validMove.moveNotation;
        } else { moveNotation = validMove.san; }
        this.svgChessboard.setPosition(currentPositionAsFEN);
        this.svgChessboard.disableMoveInput();

        this.addAnnotation(moveNotation);
        this.highlightLastMoveInNotation();
        if (validMove.color === COLOR.white) {
            if (this.mode === this.chessboardUsageModes.ANALYZING) {
                this.svgChessboard.enableMoveInput(this.moveInputHandler, COLOR.black);
            }
        } else {
            this.moveNumber = this.moveNumber + 1;
            if (this.mode === this.chessboardUsageModes.ANALYZING) {
                this.svgChessboard.enableMoveInput(this.moveInputHandler, COLOR.white);
            }
        }
        if (this.mode === this.chessboardUsageModes.PLAYING) {
            if (sendMoveToOponent) {
                this.sendMove(currentPositionAsFEN, moveNotation);
                this.pressClock(!this.whitePlayer)
            }
        }
        if (this.chess.game_over()) {
            const gameResult = this.getGameResult(validMove);
            this.endGame(gameResult);
            if (this.mode === this.chessboardUsageModes.PLAYING) {
                this.sendGameResult();
            }
        }


        this.whiteMove = !this.whiteMove;
    }

    getGameResult(validMove) {
        if (this.chess.in_stalemate()) {
            return "1/2 (stalemate)";
        } else if (this.chess.insufficient_material()) {
            return "1/2 (insufficient material)";
        } else if (this.chess.in_threefold_repetition()) {
            return "1/2 (threefold repetition)";
        } else if (this.chess.in_checkmate()) {
            return validMove.color === COLOR.white ? "1-0" : "0-1";
        } else {
            return "1/2 (50 move rule)";
        }
    }

    initialiseChessboard() {

        if (!this.svgChessboard) {
            this.svgChessboard = new Chessboard(document.getElementById("newChessboardContainer"),
                this.chessboardProps);

        } else {
            this.svgChessboard.setPosition("start");
        }

        if (this.whitePlayerName === this.user) {
            this.svgChessboard.enableMoveInput(this.moveInputHandler, COLOR.white);
        }

        this.chess = new this.chessRules();
        this.chessboard = {};
        this.chessboard.element = document.getElementsByName("chessboardTable")[0];
        this.chessboard.pieces = [];
        this.chessboard.annotatedMoves = [];
        this.squareSize = 0;
        this.startPosition = {};
        this.endPosition = {};

        this.moveNumber = 0;
        this.chessboard.coordinates = {};

        let index = 0;
        let pieceIndex = 0;
        let squares = [];
        let piece;
        for (let x = 0; x <= 7; x++) {
            for (let y = 0; y <= 7; y++) {
                piece = "";
                squares[index] = {};
                squares[index].row = y;
                squares[index].column = x;
                if (y === 6) {
                    piece = "BP" + x + y;
                } else if (y === 1) {
                    piece = "WP" + x + y;
                } else if (y === 0) {
                    if (x === 0 || x === 7) {
                        piece = "WR" + x + y;
                    } else if (x === 1 || x === 6) {
                        piece = "WN" + x + y;
                    } else if (x === 2 || x === 5) {
                        piece = "WB" + x + y;
                    } else if (x === 3) {
                        piece = "WQ" + x + y;
                    } else if (x === 4) {
                        piece = "WK" + x + y;
                    }
                } else if (y === 7) {
                    if (x === 0 || x === 7) {
                        piece = "BR" + x + y;
                    } else if (x === 1 || x === 6) {
                        piece = "BN" + x + y;
                    } else if (x === 2 || x === 5) {
                        piece = "BB" + x + y;
                    } else if (x === 3) {
                        piece = "BQ" + x + y;
                    } else if (x === 4) {
                        piece = "BK" + x + y;
                    }
                }
                if (piece !== "") {
                    squares[index].piece = piece;
                    this.chessboard.pieces[pieceIndex] = {};
                    this.chessboard.pieces[pieceIndex].row = y;
                    this.chessboard.pieces[pieceIndex].column = x;
                    this.chessboard.pieces[pieceIndex].piece = piece;
                    pieceIndex++;
                } else {
                    squares[index].piece = "empty";
                }
                index++;
            }
        }

        this.chessboard.squares = squares;

    };

    determineInitialModeOfUsage() {
        if (typeof this.observedPlayer !== 'undefined') {
            console.log("Setting mode of usage to observing");
            this.mode = this.chessboardUsageModes.OBSERVING;
        } else if (this.route.snapshot['_routerState'].url.indexOf("analyzeGame") !== -1) {
            this.mode = this.chessboardUsageModes.ANALYZING;
        } else {
            this.mode = this.chessboardUsageModes.PLAYING;
        }
    };


    requestGameInfo() {
        if (this.mode === this.chessboardUsageModes.PLAYING) {
            let getGameInfoMessage = {
                action: "getGameInfo",
                user: this.user,
                gameId: this.gameId,
            };
            console.log("Sending request game info message:" + JSON.stringify(getGameInfoMessage));
            this.socket.send(JSON.stringify(getGameInfoMessage));
        } else if (this.mode === this.chessboardUsageModes.OBSERVING) {
            /*  const headers = new HttpHeaders();
             headers.set('Authorization', 'Bearer:'+this.authenticationService.getJwtToken);
             const options = new RequestOptions({
                 headers: headers,
              }); */
            this.http.get(`${BASEURL}/observe/${this.observedPlayer}`
            ).subscribe((game) => {
                this.observeGame(game);
            }, (data) => {
                console.log(data);
                console.log("Retrieval of moves of the observed game failed:" + data.error);
            });
        }
    };




    stopClocks() {
        console.log("Stopping clock");
        clearTimeout(this.clockTimer);

    };

    ngOnDestroy() {
        if (this.mode === this.chessboardUsageModes.OBSERVING) {
            this.stopObservingGame();
        }
        this.stopClocks();
    }

    stopObservingGame() {
        this.http.get(`${BASEURL}/observe/${this.observedPlayer}/cancel`, {}).toPromise().then(() =>
            console.log("Removing of observer successfull.")
            , (data) =>
                console.log("Removing of observer failed:" + data.error)
        );
    };



    setMyMove(isItMyMove) {
        this.myMove = isItMyMove;
    };

    getChessboardCoordinates(obj) {
        let top;
        top = 0;
        if (obj.offsetParent) {
            do {
                top += obj.offsetTop;
            } while (obj = obj.offsetParent);
        }

        this.chessboard.coordinates.left = this.chessboard.element
            .getBoundingClientRect().left;
        this.chessboard.coordinates.right = this.chessboard.element
            .getBoundingClientRect().right;
        this.chessboard.coordinates.bottom = this.chessboard.element
            .getBoundingClientRect().bottom;
        this.chessboard.coordinates.top = top;
        // TODO squareSize =
        // (chessboard.coordinates.right -
        // chessboard.coordinates.left) / 8;
        this.squareSize = 55;
        // //console.log("Square size:" + squareSize);
        // //console.log(chessboard.coordinates);
    };

    activateAnalysisMode() {
        this.mode = this.chessboardUsageModes.ANALYZING;
    };

    determineRowColumn(x, y,
        whitePlayer) {

        let coordinates = { x: 0, y: 0 };
        coordinates.x = (x - this.chessboard.coordinates.left)
            / this.squareSize;
        coordinates.y = 8 - ((y - (this.chessboard.coordinates.top)) / this.squareSize);
        let row = !whitePlayer ? 7 - Math
            .floor(coordinates.y) : Math
                .floor(coordinates.y);
        let column = !whitePlayer ? 7 - Math
            .floor(coordinates.x) : Math
                .floor(coordinates.x);

        return {
            row: row,
            column: column,
            piece: this.chessboard.squares[this.findIndexOfSquare(
                column, row)].piece
        };

    };


    getInitialPositionOfPiece(piece) {
        let coordinates = { row: null, column: null, piece: null, index: null };
        for (let index = 0; index < this.chessboard.pieces.length; index++) {
            if (this.chessboard.pieces[index].piece === piece) {
                coordinates.row = this.chessboard.pieces[index].row;
                coordinates.column = this.chessboard.pieces[index].column;
                coordinates.piece = piece;
                coordinates.index = index;
                return coordinates;
            }
        }
    };

    goToNextMove() {
        let move;
        if (!this.currentVariation) {
            move = this.chessboard.annotatedMoves[this.moveNumber];
            if (!this.whiteMove && move.blackMove !== "") {
                this.redrawChessboard(move.chessboardAfterBlackMove, this.MAIN_LINE);
            } else if (this.whiteMove && this.chessboard.annotatedMoves.length > this.moveNumber) {
                this.redrawChessboard(move.chessboardAfterWhiteMove, this.MAIN_LINE);
            }
        } else {
            move = this.currentVariation.moves[this.moveNumber - this.currentVariation.moveNumber];
            let variationId = this.currentVariation.variationId;
            if (!this.whiteMove && move.blackMove !== "") {
                this.redrawChessboard(move.chessboardAfterBlackMove, variationId);
            } else if (this.whiteMove && this.chessboard.annotatedMoves.length > this.moveNumber) {
                this.redrawChessboard(move.chessboardAfterWhiteMove, variationId);
            }
        }
    }

    moveNotEmptyFilter(move) {
        return move.whiteMove !== '' || move.blackMove !== '';
    }

    goToPreviousMove() {
        let move;
        if (!this.currentVariation) {
            move = this.chessboard.annotatedMoves[this.moveNumber - 1];
            if (!this.whiteMove && this.moveNumber - 1 >= 0) {
                this.redrawChessboard(move.chessboardAfterBlackMove, this.MAIN_LINE);
            } else if (this.whiteMove) {
                this.redrawChessboard(move.chessboardAfterWhiteMove, this.MAIN_LINE);
            }
        } else {
            move = this.currentVariation.moves[this.moveNumber - this.currentVariation.this.moveNumber];
            let variationId = this.currentVariation.variationId;
            if (!this.whiteMove && this.moveNumber - 1 >= 0) {
                this.redrawChessboard(move.chessboardAfterBlackMove, variationId);
            } else if (this.whiteMove) {
                this.redrawChessboard(move.chessboardAfterWhiteMove, variationId);
            }
        }
    }

    goToFirstMove() {
        let move = this.chessboard.annotatedMoves.filter(this.moveNotEmptyFilter)[0];
        this.redrawChessboard(move.chessboardAfterWhiteMove, this.MAIN_LINE);
    }

    goToLastMove() {
        let lastMoveNumber = this.chessboard.annotatedMoves.length - 1;
        let move = this.chessboard.annotatedMoves[lastMoveNumber];
        if (move.blackMove !== "") {
            this.redrawChessboard(move.chessboardAfterWhiteMove, this.MAIN_LINE);
        } else {
            this.redrawChessboard(move.chessboardAfterWhiteMove, this.MAIN_LINE);
        }
    }

    isRookMoveLegal(startPosition, endPosition, kingInCheck) {
        let isLegal = true;
        if (endPosition.row === startPosition.row) {
            for (let x = 1; x < Math
                .abs(endPosition.column
                    - startPosition.column); x++) {
                let square = this.findSquare(endPosition.column > startPosition.column ? startPosition.column
                    + x
                    : startPosition.column
                    - x, startPosition.row);
                if ((!kingInCheck && !this.isSquareEmpty(square)) ||
                    (kingInCheck && !this.isSquareEmpty(square) && !this.isPieceOnSquare(square, "K"))) {
                    isLegal = false;
                }
            }

        } else if (endPosition.column === startPosition.column) {
            for (let x = 1; x < Math
                .abs(endPosition.row
                    - startPosition.row); x++) {
                let square = this.findSquare(startPosition.column,
                    endPosition.row > startPosition.row ? startPosition.row
                        + x
                        : startPosition.row - x);
                if ((!kingInCheck && !this.isSquareEmpty(square)) ||
                    (kingInCheck && !this.isSquareEmpty(square) && !this.isPieceOnSquare(square, "K"))) {
                    isLegal = false;
                }
            }
        } else {
            isLegal = false;
        }
        // console.log("Rook move legal:" + isLegal);
        return isLegal;
    }

    isPawnMoveLegal(startPosition,
        endPosition, whitePlayer, kingInCheck) {
        if (Math.abs(startPosition.row
            - endPosition.row) > 2
            || Math.abs(startPosition.column
                - endPosition.column) > 1) {
            return false;
        } else if ((this.whiteMove === true && endPosition.row < startPosition.row) || (this.whiteMove === false && endPosition.row > startPosition.row)) {
            return false;
        } else if (Math
            .abs(!whitePlayer ? startPosition.row
                - endPosition.row
                : endPosition.row
                - startPosition.row) === 1
            && Math.abs(startPosition.column
                - endPosition.column) === 1
            && (endPosition.piece !== "empty" || (kingInCheck))) {
            return true;
        } else if (Math
            .abs(!whitePlayer ? startPosition.row
                - endPosition.row
                : endPosition.row
                - startPosition.row) === 1
            && startPosition.column
            - endPosition.column === 0 && (endPosition.piece === "empty")) {
            return true;
        } else if (Math
            .abs(!whitePlayer ? startPosition.row
                - endPosition.row
                : endPosition.row
                - startPosition.row) === 2
            && startPosition.column
            - endPosition.column === 0) {
            let initialPositionOfPiece = this.
                getInitialPositionOfPiece(startPosition.piece);
            return startPosition.row === initialPositionOfPiece.row
                && startPosition.column === initialPositionOfPiece.column;
        } else if (!whitePlayer ? startPosition.row
            - endPosition.row : endPosition.row
            - startPosition.row === 1
            && Math.abs(endPosition.column
                - startPosition.column) === 1) {
            return this.pieceTakenEnPassant(startPosition,
                endPosition, whitePlayer);

        }
    }

    pieceTakenEnPassant(startPosition,
        endPosition, whitePlayer) {
        // console.log("En passant  called.");
        console
            .log(startPosition.piece.indexOf("P") !== -1);
        let squaresMovedForward;
        if (this.myMove === true) {
            squaresMovedForward = !whitePlayer ? startPosition.row
                - endPosition.row
                : endPosition.row
                - startPosition.row;
        } else {
            squaresMovedForward = Math
                .abs(startPosition.row
                    - endPosition.row);
        }
        if (startPosition.piece.indexOf("P") !== -1
            && squaresMovedForward === 1
            && Math.abs(endPosition.column
                - startPosition.column) === 1) {
            // console.log(lastMove);
            if (this.lastMove.endPosition.piece
                .indexOf("P") !== -1
                && Math
                    .abs(this.lastMove.startPosition.row
                        - this.lastMove.endPosition.row) === 2
                && this.lastMove.endPosition.column === endPosition.column) {
                // console.log("En passant.");
                this.enPassant = true;
                return true;
            } else
                return false;

        }
    }

    canRookMateBePrevented(chessboard,
        kingPosition, checkingPiecePosition,
        whiteMove) {
        let matePreventionPossible = false;
        if (kingPosition.row === checkingPiecePosition.row) {
            for (let x = 1; x < Math
                .abs(kingPosition.column
                    - checkingPiecePosition.column); x++) {

                if (this.canAnyOponentsPieceMoveToSquare(
                    chessboard,
                    kingPosition.row,
                    kingPosition.column > checkingPiecePosition.column ? checkingPiecePosition.column
                        + x
                        : checkingPiecePosition.column
                        - x, whiteMove, null, null) === true) {

                    matePreventionPossible = true;
                    break;
                }

            }

        } else if (kingPosition.column === checkingPiecePosition.column) {
            for (let x = 1; x < Math
                .abs(kingPosition.row
                    - checkingPiecePosition.row); x++) {

                if (this.canAnyOponentsPieceMoveToSquare(
                    chessboard,
                    kingPosition.row > checkingPiecePosition.row ? checkingPiecePosition.row
                        + x
                        : checkingPiecePosition.row
                        - x,
                    kingPosition.column, whiteMove, null, null) === true) {

                    matePreventionPossible = true;
                    break;
                }

            }
        }
        return matePreventionPossible;

    }

    canBishopMateBePrevented(chessboard,
        kingPosition, checkingPiecePosition,
        whiteMove) {
        console.log("Can bishop mate be prevented?");
        let matePreventionPossible = false;
        if (kingPosition.row > checkingPiecePosition.row
            && kingPosition.column > checkingPiecePosition.column) {
            for (let x = 1; x < kingPosition.row
                - checkingPiecePosition.row; x++) {
                if (this.canAnyOponentsPieceMoveToSquare(
                    chessboard,
                    checkingPiecePosition.row + x,
                    checkingPiecePosition.column
                    + x, whiteMove, null, null) === true) {
                    console.log("Yes - option 1");
                    matePreventionPossible = true;
                    break;
                }

            }

        } else if (kingPosition.row > checkingPiecePosition.row
            && kingPosition.column < checkingPiecePosition.column) {
            for (let x = 1; x < this.endPosition.row
                - checkingPiecePosition.row; x++) {
                if (this.canAnyOponentsPieceMoveToSquare(
                    chessboard, kingPosition.row
                - x,
                    kingPosition.column + x,
                    whiteMove, null, null) === true) {
                    console.log("Yes - option 2");
                    matePreventionPossible = true;
                    break;
                }

            }

        } else if (kingPosition.row < checkingPiecePosition.row
            && kingPosition.column > checkingPiecePosition.column) {
            for (let x = 1; x < this.startPosition.row
                - this.endPosition.row; x++) {
                if (this.canAnyOponentsPieceMoveToSquare(
                    chessboard, kingPosition.row
                + x,
                    kingPosition.column - x,
                    whiteMove, null, null) === true) {
                    console.log("Yes - option 3");
                    matePreventionPossible = true;
                    break;
                }

            }

        } else if (kingPosition.row < checkingPiecePosition.row
            && kingPosition.column < checkingPiecePosition.column) {
            for (let x = 1; x < checkingPiecePosition.row
                - this.endPosition.row; x++) {
                if (this.canAnyOponentsPieceMoveToSquare(
                    chessboard, kingPosition.row
                + x,
                    kingPosition.column + x,
                    whiteMove, null, null) === true) {
                    console.log("Yes - option 4");
                    matePreventionPossible = true;
                    break;
                }

            }

        }
        return matePreventionPossible;
    }

    canMateBePrevented(chessboard,
        kingPosition, checkingPiecePosition,
        whiteMove) {
        let matePreventionPossible = false;

        if (this.canAnyOponentsPieceMoveToSquare(
            chessboard,
            checkingPiecePosition.row,
            checkingPiecePosition.column,
            whiteMove, true)) {

            matePreventionPossible = true;
        } else {

            switch (checkingPiecePosition.piece
                .substr(1, 1)) {
                /*	case "P":
                        if (this.canAnyOponentsPieceMoveToSquare(
                                chessboard,
                                checkingPiecePosition.row,
                                checkingPiecePosition.column,
                                whiteMove)) {

                            matePreventionPossible = true;
                        }
                        break;

                    case "N":
                        if (this.canAnyOponentsPieceMoveToSquare(
                                chessboard,
                                checkingPiecePosition.row,
                                checkingPiecePosition.column,
                                whiteMove)) {

                            matePreventionPossible = true;
                        }
                        break;*/

                case "B":
                    matePreventionPossible = this.canBishopMateBePrevented(
                        chessboard, kingPosition,
                        checkingPiecePosition, whiteMove);
                    break;

                case "R":
                    matePreventionPossible = this.canRookMateBePrevented(
                        chessboard, kingPosition,
                        checkingPiecePosition, whiteMove);
                    break;

                case "Q":
                    if (this.canBishopMateBePrevented(chessboard,
                        kingPosition,
                        checkingPiecePosition, whiteMove) === true
                        || this.canRookMateBePrevented(
                            chessboard, kingPosition,
                            checkingPiecePosition,
                            whiteMove) === true) {
                        matePreventionPossible = true;
                    }
                    break;

            }
        }
        return matePreventionPossible;
    }

    isKingMoveLegal(startPosition,
        endPosition, whitePlayer, isKingInCheck) {
        if (Math.abs(endPosition.row
            - startPosition.row) <= 1
            && Math.abs(endPosition.column
                - startPosition.column) <= 1
        ) {
            if (startPosition.piece.indexOf('W') !== -1 ? this.isWhitePieceOnSquare(endPosition) : this.isBlackPieceOnSquare(endPosition)) {
                //same coloured piece as the king is on the target square, king move is illegal
                return false;
            } else {
                return !this.canAnyOponentsPieceMoveToSquare(this.chessboard, endPosition.row, endPosition.column, startPosition.piece.indexOf('W') !== -1, true, isKingInCheck);
            }


        } else if (endPosition.row === startPosition.row
            && Math.abs(endPosition.column
                - startPosition.column) === 2
            && endPosition.column === 6) {
            if (whitePlayer === true
                && this.isSquareEmpty(this.findSquare(5, 0))
                && !this.canAnyOponentsPieceMoveToSquare(
                    this.chessboard, 0, 5,
                    this.whiteMove, null, null)
                && this.isSquareEmpty(this.findSquare(6, 0))
                && !this.canAnyOponentsPieceMoveToSquare(
                    this.chessboard, 0, 6,
                    this.whiteMove, null, null) && this.hasKingAlreadyMoved("white") === false) {
                console.log("White Short castle");
                this.castling = "0-0";
                return true;
            }

            if (whitePlayer === false
                && endPosition.column === 6
                && this.isSquareEmpty(this.findSquare(5, 7))
                && !this.canAnyOponentsPieceMoveToSquare(
                    this.chessboard, 7, 5,
                    this.whiteMove, null, null)
                && this.isSquareEmpty(this.findSquare(6, 7))
                && !this.canAnyOponentsPieceMoveToSquare(
                    this.chessboard, 7, 6,
                    this.whiteMove, null) && this.hasKingAlreadyMoved("black") === false) {
                console.log("Black Short castle");
                this.castling = "0-0";
                return true;
            }


        } else if (endPosition.row === startPosition.row
            && Math.abs(endPosition.column
                - startPosition.column) === 2
            && (endPosition.column === 2)) {
            if (whitePlayer === true
                && this.isSquareEmpty(this.findSquare(2, 0))
                && !this.canAnyOponentsPieceMoveToSquare(
                    this.chessboard, 0, 2,
                    this.whiteMove, true)
                && this.isSquareEmpty(this.findSquare(3, 0))
                && !this.canAnyOponentsPieceMoveToSquare(
                    this.chessboard, 0, 3,
                    this.whiteMove, true) && this.hasKingAlreadyMoved("white") === false) {
                console.log("White Long castle");
                this.castling = "0-0-0";
                return true;
            }

            if (whitePlayer === false
                && this.isSquareEmpty(this.findSquare(2, 7))
                && !this.canAnyOponentsPieceMoveToSquare(
                    this.chessboard, 7, 2,
                    this.whiteMove, true)
                && this.isSquareEmpty(this.findSquare(3, 7))
                && !this.canAnyOponentsPieceMoveToSquare(
                    this.chessboard, 7, 3,
                    this.whiteMove, true) && this.hasKingAlreadyMoved("black") === false) {

                console.log("Black Long castle");
                this.castling = "0-0-0";
                return true;
            }
        } else {
            console.log("King else condition.");
            console.log(startPosition);
            console.log(endPosition);
            console.log(whitePlayer);
            return false;
        }
    }

    isBishopMoveLegal(startPosition,
        endPosition, kingInCheck) {
        let isLegal = true;
        if (Math.abs(endPosition.row
            - startPosition.row) === Math
                .abs(endPosition.column
                    - startPosition.column)

        ) {
            if ((endPosition.row > startPosition.row
                && endPosition.column > startPosition.column) ||
                (endPosition.row < startPosition.row
                    && endPosition.column < startPosition.column)) {
                for (let x = 1; x < endPosition.row
                    - startPosition.row; x++) {
                    let square = this.findSquare(startPosition.column + x,
                        startPosition.row + x);
                    if ((!kingInCheck && !this.isSquareEmpty(square)) ||
                        (kingInCheck && !this.isSquareEmpty(square) && !this.isPieceOnSquare(square, "K"))) {
                        // console.log("Case1");
                        isLegal = false;
                        break;
                    }


                }

            } else if (endPosition.row > startPosition.row
                && endPosition.column < startPosition.column) {
                for (let x = 1; x < endPosition.row
                    - startPosition.row; x++) {
                    let square = this.findSquare(
                        endPosition.column + x,
                        endPosition.row - x);

                    if ((!kingInCheck && !this.isSquareEmpty(square)) ||
                        (kingInCheck && !this.isSquareEmpty(square) && !this.isPieceOnSquare(square, "K"))) {

                        console
                            .log(square.piece);

                        isLegal = false;
                        break;
                    }

                }

            } else if (endPosition.row < startPosition.row
                && endPosition.column > startPosition.column) {
                for (let x = 1; x < startPosition.row
                    - endPosition.row; x++) {
                    let square = this.findSquare(
                        endPosition.column - x,
                        endPosition.row + x);
                    if ((!kingInCheck && !this.isSquareEmpty(square)) ||
                        (kingInCheck && !this.isSquareEmpty(square) && !this.isPieceOnSquare(square, "K"))) {
                        // console.log("Case3");
                        isLegal = false;
                        break;
                    }


                }

            }

            /*     else if (endPosition.row < startPosition.row
                     && endPosition.column < startPosition.column) {
                     for (let x = 1; x < startPosition.row
                     - endPosition.row; x++) {
                         let square = this.findSquare(
                             endPosition.column + x,
                             endPosition.row + x)
                         if ((!kingInCheck && !this.isSquareEmpty(square)) ||
                             (kingInCheck && !this.isSquareEmpty(square) && !isPieceOnSquare(square, "K"))) {

                             // console.log("Case4");
                             isLegal = false;
                             break;
                         }


                     }

                 }*/

        } else {
            // console.log("Case 5");
            isLegal = false;
        }
        // console.log("Bishop move legal:" + isLegal);
        return isLegal;
    }


    checkLegalityOfMove(
        startPosition, endPosition, whitePlayer, isKingInCheck) {

        if (typeof endPosition === 'undefined' || startPosition.piece === "empty" ||
            (endPosition.row === startPosition.row && endPosition.column === startPosition.column) ||
            (this.isWhitePieceOnSquare(startPosition) && this.isWhitePieceOnSquare(endPosition)) ||
            (this.isBlackPieceOnSquare(startPosition) && this.isBlackPieceOnSquare(endPosition))
        ) {
            return false;
        }

        switch (startPosition.piece.substr(1, 1)) {
            case "N":

                if (((Math.abs(startPosition.row
                    - endPosition.row) === 2 && Math
                        .abs(startPosition.column
                            - endPosition.column) === 1) || (Math
                                .abs(startPosition.row
                                    - endPosition.row) === 1 && Math
                                        .abs(startPosition.column
                                            - endPosition.column) === 2))
                    && ((this.whiteMove ? this.isBlackPieceOnSquare(endPosition) : this.isWhitePieceOnSquare(endPosition))
                        || this.isSquareEmpty(endPosition) || isKingInCheck)) {
                    return true;
                } else {
                    return false;
                }

            case "P":
                return this.isPawnMoveLegal(startPosition,
                    endPosition, whitePlayer, isKingInCheck);
            case "K":

                return this.isKingMoveLegal(startPosition,
                    endPosition, this.mode === this.chessboardUsageModes.ANALYZING ? this.whiteMove : whitePlayer, null);
            case "B":
                return this.isBishopMoveLegal(startPosition,
                    endPosition, isKingInCheck);
            case "R":
                return this.isRookMoveLegal(startPosition,
                    endPosition, isKingInCheck);
            case "Q":
                return this.isBishopMoveLegal(startPosition,
                    endPosition, isKingInCheck)
                    || this.isRookMoveLegal(startPosition,
                        endPosition, isKingInCheck);
            default:
                return true;
        }

    };

    isSquareEmpty(square) {
        return square.piece === "empty";
    }

    isBlackPieceOnSquare(square) {
        return square.piece.indexOf("W") === -1 && !this.isSquareEmpty(square);
    }

    isWhitePieceOnSquare(square) {
        return square.piece.indexOf("W") !== -1 && !this.isSquareEmpty(square);
    }

    isPieceOnSquare(square, piece) {
        return square.piece.indexOf(piece) !== -1;
    }

    canAnyOponentsPieceMoveToSquare(
        chessboard, row, column, whiteMove, ignoreKings, isKingInCheck = false) {
        let pieceFound = false;
        let targetSquare = this.findSquare(column, row);
        let colour = whiteMove ? "black" : "white";
        console.log("Can any " + colour + " piece move to square " + this.getSquareAsString(targetSquare) + "?");

        for (let i = 0; i < chessboard.squares.length; i++) {
            let initialSquare = chessboard.squares[i];
            if (ignoreKings === true && initialSquare.piece.indexOf('K') !== -1) {
                continue;
            }
            if (!this.isSquareEmpty(initialSquare)) {
                if ((whiteMove === true && this.isBlackPieceOnSquare(
                    initialSquare))
                    || (whiteMove === false && this.isWhitePieceOnSquare(
                        initialSquare))) {


                    if (this
                        .checkLegalityOfMove(
                            initialSquare,
                            targetSquare,
                            this.whitePlayer, isKingInCheck) === true) {

                        console
                            .log("Following piece can move to target square " + this.getSquareAsString(targetSquare) + ": "
                                + initialSquare.piece
                                + ".");
                        pieceFound = true;
                        break;
                    }
                }
            }
        }
        return pieceFound;

    }

    isKingMated(chessboard, kingPosition,
        checkingPiecePosition) {

        let x = [1, 1, 1, -1, -1, -1, 0, 0];
        let y = [0, 1, -1, 0, 1, -1, 1, -1];
        let numberOfLegalSquareForKingMove = 8;

        for (let i = 0; i < x.length; i++) {

            let targetSquareIndex = this.findIndexOfSquare(
                kingPosition.column + x[i],
                kingPosition.row + y[i]);
            let targetSquare = chessboard.squares[targetSquareIndex];
            if (typeof targetSquare !== 'undefined' && this.isKingMoveLegal(kingPosition, targetSquare, this.whitePlayer, true) === false) {
                console.log("Retracting square:"
                    + this.getSquareAsString(targetSquare));
                numberOfLegalSquareForKingMove--;
            } else if (typeof targetSquare === 'undefined') {
                console.log("Retracting invalid square:"
                    + (kingPosition.column + x[i]) + " " + (kingPosition.row + y[i]));
                numberOfLegalSquareForKingMove--;
            } else {
                console
                    .log("Valid square for king move:"
                        + this.getSquareAsString(targetSquare));
            }

        }
        if (numberOfLegalSquareForKingMove > 0) {
            // console.log("King not mated:"
            // + numberOfLegalSquareForKingMove);
            return false;
        } else {
            console.log("King has no squares.");
            if (this.canMateBePrevented(chessboard,
                kingPosition,
                checkingPiecePosition, this.whiteMove) === true) {
                console.log("Mate can be prevented.");
                return false;
            }
            // console.log("King is mated.");
            else {
                return true;
            }
        }
    }

    isKingInCheckOrAndMate(chessboard,
        whiteMove, startPosition, endPosition) {
        let kingPosition = { row: null, column: null, piece: null };
        let kingInCheckOrAndMate = { check: false, mate: false };

        chessboard.squares
            .forEach((square) => {
                if (endPosition.piece.indexOf("W") !== -1 ? square.piece
                    .indexOf("BK") !== -1
                    : square.piece
                        .indexOf("WK") !== -1) {
                    kingPosition.row = square.row;
                    kingPosition.column = square.column;
                    kingPosition.piece = square.piece;
                }

            });

        if (this.checkLegalityOfMove(
            endPosition,
            kingPosition,
            whiteMove, false) === true) {
            console.log("Checking piece " + endPosition.piece);
            kingInCheckOrAndMate.check = true;
            kingInCheckOrAndMate.mate = this.isKingMated(
                chessboard,
                kingPosition,
                endPosition);
        } else {
            chessboard.squares
                .forEach((square) => {
                    if (whiteMove === false ? this.isBlackPieceOnSquare(square)
                        : this.isWhitePieceOnSquare(square)) {
                        if (this.checkLegalityOfMove(
                            square,
                            kingPosition,
                            whiteMove, false) === true) {
                            console.log("Checking piece " + square.piece);
                            kingInCheckOrAndMate.check = true;
                            kingInCheckOrAndMate.mate = this.isKingMated(
                                chessboard,
                                kingPosition,
                                endPosition);
                        }
                    }


                });
        }
        return kingInCheckOrAndMate;

    }

    /*   highlightLastMoveInNotation(whiteMoveToHighlight:boolean, moveNumber:number, variationId:number){
          let elementId:string;
  
          if (whiteMoveToHighlight) {
              if (variationId === this.MAIN_LINE) {
                  elementId = "annotatedMoveWhite" + moveNumber;
              } else {
                  elementId = 'moveOfVariationNo' + variationId + "White" + moveNumber;
              }
          } else {
              //decreasing as in the FEN after black move the moveNumber is increased
              moveNumber = moveNumber - 1;
              if (variationId === this.MAIN_LINE) {
                  elementId = "annotatedMoveBlack" + moveNumber;
              } else {
                  elementId = 'moveOfVariationNo' + variationId + "Black" + moveNumber;
              }
          }
  
           $('td[id ^= "annotatedMove"]').css('font-weight', 'normal');
          $('a[id ^= "moveOfVariation"]').css('font-weight', 'normal');
          $("#" + elementId).css('font-weight', 'bold'); 
  
      } */


    redrawChessboard(fen: string, variationId: number) {
        //redrawChessboard  (currentSquares, elementId, whiteMove, moveNo, variationId, redrawPreviousMove) {

        const fenParts: string[] = fen.split(" ");
        let lastMoveNumber: number = parseInt(fenParts[5]);
        const whiteMoveToRedraw = fenParts[1] === COLOR.black ? true : false;
        let elementId: string;

        if (variationId === this.MAIN_LINE) {
            this.currentVariation = null;
        } else {
            this.currentVariation = this.variations.get(variationId);;
        }

        this.whiteMove = whiteMoveToRedraw;
        this.moveNumber = whiteMoveToRedraw ? lastMoveNumber - 1 : lastMoveNumber - 2;

        this.highlightLastMoveInNotation();

        this.whiteMove = !this.whiteMove;
        if (!whiteMoveToRedraw) {
            this.moveNumber = this.moveNumber + 1;
        }

        this.chess.load(fen);
        this.svgChessboard.setPosition(fen);

        if (this.mode === this.chessboardUsageModes.ANALYZING) {
            const color = this.whiteMove ? COLOR.white : COLOR.black;
            this.svgChessboard.enableMoveInput(this.moveInputHandler, color);
            this.chessboard.squares = JSON.parse(JSON.stringify(fen));
        }

    };

    drawLastMove(startPosition,
        endPosition) {
        console.log("Drawing move");
        console.log(startPosition, endPosition);
        let chessboardsize = document.getElementById("chessboardOverlay").offsetWidth;
        let squaresize = Math.floor(chessboardsize / 8);

        this.createLine(
            this.whitePlayer ?
                (startPosition.column + 1) * squaresize - squaresize / 2 :
                (8 - startPosition.column) * squaresize - squaresize / 2,
            this.whitePlayer ?
                (8 - startPosition.row) * squaresize - squaresize / 2 :
                (startPosition.row) * squaresize + squaresize / 2,
            this.whitePlayer ?
                (endPosition.column + 1) * squaresize - squaresize / 2 :
                (8 - endPosition.column) * squaresize - squaresize / 2,
            this.whitePlayer ?
                (8 - endPosition.row) * squaresize - (!this.whiteMove ? 0.5 * squaresize : squaresize / 2) :
                (endPosition.row) * squaresize + (!this.whiteMove ? 0.5 * squaresize : squaresize / 2)
        );

        this.eraseAllHighlightedSquares();
        this.highlightSquare(startPosition, squaresize, squaresize);
        this.highlightSquare(endPosition, squaresize, squaresize);

    };

    eraseAllHighlightedSquares() {
        $(".rect").remove();
    }

    highlightSquare(square, width, height) {
        let y = this.whitePlayer ? (7 - square.row) * width : (square.row) * width;
        let x = this.whitePlayer ? (square.column) * width : (7 - square.column) * width;
        let svgNS = "http://www.w3.org/2000/svg";
        let rectangular = document.createElementNS(svgNS, "rect");
        rectangular.setAttributeNS(null, 'class', 'rect');
        rectangular.setAttributeNS(null, 'x', x.toString());
        rectangular.setAttributeNS(null, 'y', y.toString());
        rectangular.setAttributeNS(null, 'width', width.toString());
        rectangular.setAttributeNS(null, 'height', height.toString());
        rectangular.setAttributeNS(null, 'style', 'fill:none;stroke:yellow;stroke-width:2');

        document.getElementById("svgId").appendChild(rectangular);

        return rectangular

    }

    createLineElement(x1, y1, x2, y2) {
        let svgNS = "http://www.w3.org/2000/svg";
        let line = document.createElementNS(svgNS, "path");
        line.setAttributeNS(null, "id", "arrow");
        line.setAttributeNS(null, "stroke-width", '4');
        line.setAttributeNS(null, "marker-end", "url(#head)");
        line.setAttributeNS(null, "fill", "none");
        line.setAttributeNS(null, "stroke", "blue");

        line.setAttributeNS(null, "opacity", "0.2");
        line.setAttributeNS(null, "d", 'M' + Math.floor(x1) + " " + Math.floor(y1) + " " + Math.floor(x2) + " " + Math.floor(y2));

        return line;
    }

    createLine(x1, y1, x2, y2) {
        $("#arrow").remove();

        let line = this.createLineElement(x1, y1, x2, y2);
        document.getElementById("svgId").appendChild(line);


    }

    movePieceToCoordinates(piece, row, column) {

        let top = ((((this
            .getInitialPositionOfPiece(piece).row) - row) * this.squareSize) + (0.13 * this.squareSize));
        let left = (((column - (this
            .getInitialPositionOfPiece(piece)).column) * this.squareSize) + (0.13 * this.squareSize));

        $("#" + piece).css({

            top: this.whitePlayer ? top + 'px' : (top
                * (-1) + (0.26 * this.squareSize))
                + 'px',
            left: this.whitePlayer ? left + 'px' : (left
                * (-1) + (0.26 * this.squareSize))
                + 'px',

        });

    };

    movePieceOnBoard(element, startPosition,
        endPosition, whitePlayer) {
        let top = ((((this.
            getInitialPositionOfPiece(startPosition.piece).row) - endPosition.row) * this.squareSize) + (0.13 * this.squareSize));
        let left = (((endPosition.column - (this
            .getInitialPositionOfPiece(startPosition.piece)).column) * this.squareSize) + (0.13 * this.squareSize));

        element.css({
            top: whitePlayer ? top + 'px' : (top
                * (-1) + (0.26 * this.squareSize))
                + 'px',
            left: whitePlayer ? left + 'px' : (left
                * (-1) + (0.26 * this.squareSize))
                + 'px',
        });
    }

    updateChessboardAfterMove(startPiece,
        element, startSquare, endSquare,
        ownMove, whitePlayer, promotedPiece) {

        console.log("Position before start updatechessboard:");
        if (this.chessboard.annotatedMoves.length > 0 && typeof this.chessboard.annotatedMoves[0].chessboardAfterWhiteMove !== 'undefined') {
            this.printSquares(this.chessboard.annotatedMoves[0].chessboardAfterWhiteMove);
        }
        if (this.chessboard.annotatedMoves.length > 0 && typeof this.chessboard.annotatedMoves[0].chessboardAfterBlackMove !== 'undefined' && this.chessboard.annotatedMoves[0].chessboardAfterBlackMove.length !== 0) {
            this.printSquares(this.chessboard.annotatedMoves[0].chessboardAfterBlackMove);
        }

        let capture = false;
        this.movePieceOnBoard(element, startSquare,
            endSquare, whitePlayer);


        console.log("Position vefore en passant:");
        if (this.chessboard.annotatedMoves.length > 0 && typeof this.chessboard.annotatedMoves[0].chessboardAfterWhiteMove !== 'undefined') {
            this.printSquares(this.chessboard.annotatedMoves[0].chessboardAfterWhiteMove);
        }
        if (this.chessboard.annotatedMoves.length > 0 && typeof this.chessboard.annotatedMoves[0].chessboardAfterBlackMove !== 'undefined' && this.chessboard.annotatedMoves[0].chessboardAfterBlackMove.length !== 0) {
            this.printSquares(this.chessboard.annotatedMoves[0].chessboardAfterBlackMove);
        }

        if (!this.isSquareEmpty(endSquare)
            || this.pieceTakenEnPassant(startSquare,
                endSquare, whitePlayer) === true) {
            capture = true;

            if (this.enPassant === true) {

                let enPassantPawnTakenRow = this.myMove ?
                    whitePlayer ? endSquare.row - 1 : endSquare.row + 1
                    : !whitePlayer ? endSquare.row - 1 : endSquare.row + 1;
                let enPassantPawnSquare = this.findSquare(endSquare.column, enPassantPawnTakenRow);
                $("#" + enPassantPawnSquare.piece).hide();
                enPassantPawnSquare.piece = "empty";
                this.enPassant = false;
            } else {
                $("#" + endSquare.piece).hide();
            }
        }



        if (typeof promotedPiece !== 'undefined') {
            let promotedPieceFullName = promotedPiece + endSquare.column + endSquare.row;

            $(element).prop('id', promotedPieceFullName);
            $(element).css('top', "8px");
            $(element).css('left', "10px");
            $(element).attr('src', `${BASEURL}/images/pieces/${promotedPiece}.png`);
            $(element).detach().appendTo('#squareDiv' + endSquare.column + endSquare.row);

            /*let indexOfNewPiece =chessboard.pieces.length;
            chessboard.pieces[indexOfNewPiece] = {};
            chessboard.pieces[indexOfNewPiece].row = endSquare.row;
            chessboard.pieces[indexOfNewPiece].column = endSquare.column;
            chessboard.pieces[indexOfNewPiece].piece = promotedPieceFullName;*/

            let indexOfPiece = this.getInitialPositionOfPiece(startPiece).index;
            this.chessboard.pieces[indexOfPiece].column = endSquare.column;
            this.chessboard.pieces[indexOfPiece].row = endSquare.row;
            this.chessboard.pieces[indexOfPiece].piece = promotedPieceFullName;

            endSquare.piece = promotedPieceFullName;
            this.findSquare(endSquare.column, endSquare.row).piece = promotedPieceFullName;
            startSquare.piece = "empty";
            this.findSquare(startSquare.column, startSquare.row).piece = "empty"
        } else {

            endSquare.piece = startPiece;
            this.findSquare(endSquare.column, endSquare.row).piece = startPiece;
            startSquare.piece = "empty";
            this.findSquare(startSquare.column, startSquare.row).piece = "empty";

        }



        if (this.hasThreeFoldRepetitionOccurred()) {
            this.endGame("1/2 - 1/2 (three fold repetition)");
            if (whitePlayer) {
                this.sendGameResult();
            }
        }
        let kingInCheckOrAndMate = this.isKingInCheckOrAndMate(
            this.chessboard, this.whiteMove,
            startSquare, endSquare);



        this.drawLastMove(startSquare, endSquare);


        if (this.castling === "0-0" || this.castling === "0-0-0") {
            this.moveRookIfPlayerCastled();
        }


        /*   let annotatedMove = this.addAnnotation(
              startSquare,
              endSquare,
              capture,
              typeof promotedPiece !== 'undefined', this.castling,
              kingInCheckOrAndMate.check,
              kingInCheckOrAndMate.mate);
  
          if (ownMove && this.mode === this.chessboardUsageModes.PLAYING) {
              this.sendMove(
                  typeof promotedPiece !== 'undefined' ? startPiece
                      : endSquare.piece,
                  startSquare, endSquare, null,
                  promotedPiece, annotatedMove);
          } */

        if (kingInCheckOrAndMate.mate === true) {
            this.endGame(this.whiteMove === true ? "1-0" : "0-1");
            this.sendGameResult();
        }

        this.castling = "";
        this.whiteMove = !this.whiteMove;


    };


    moveRookIfPlayerCastled() {
        let targetSquare;
        let piece;
        let initialSquare;
        let initialSquareCoordinates;

        if (this.castling === "0-0") {

            if (this.whiteMove) {
                piece = "WR70";
                targetSquare = this.findSquare(5, 0);
                initialSquareCoordinates = this
                    .getInitialPositionOfPiece("WR70");
                initialSquare = this.findSquare(initialSquareCoordinates.column, initialSquareCoordinates.row);
            } else {
                targetSquare = this.findSquare(5, 7);
                piece = "BR77";
                initialSquareCoordinates = this
                    .getInitialPositionOfPiece(piece);
                initialSquare = this.findSquare(initialSquareCoordinates.column, initialSquareCoordinates.row);
            }
        } else if (this.castling === "0-0-0") {
            if (this.whiteMove) {
                console.log("White on move.");
                targetSquare = this.findSquare(3, 0);
                piece = "WR00";
                initialSquareCoordinates = this
                    .getInitialPositionOfPiece(piece);
                initialSquare = this.findSquare(initialSquareCoordinates.column, initialSquareCoordinates.row);

            } else {
                console.log("Black on move.");
                targetSquare = this.findSquare(3, 7);
                piece = "BR07";
                initialSquareCoordinates = this
                    .getInitialPositionOfPiece(piece);
                initialSquare = this.findSquare(initialSquareCoordinates.column, initialSquareCoordinates.row);

            }
        }

        this.movePieceOnBoard(
            $("#" + piece),
            initialSquareCoordinates,
            targetSquare, this.whitePlayer);

        targetSquare.piece = piece;
        this.findSquare(targetSquare.column, targetSquare.row).piece = piece;
        initialSquare.piece = "empty";
        this.findSquare(initialSquare.column, initialSquare.row).piece = "empty";
        this.printCurrentChessboard();
    }

    hasThreeFoldRepetitionOccurred() {

        let threefoldrepetitionOccurred = false;
        let chessboardAsString = this.printCurrentChessboard();
        let numberOfOccurrences = 0;
        if (this.positionOccurrencesMap.has(chessboardAsString)) {
            numberOfOccurrences = this.positionOccurrencesMap.get(chessboardAsString) + 1;
        }
        this.positionOccurrencesMap.set(chessboardAsString, numberOfOccurrences);
        if (numberOfOccurrences === 3) {
            threefoldrepetitionOccurred = true;
        }
        return threefoldrepetitionOccurred;

    }

    hasKingAlreadyMoved(color) {
        let hasKingAlreadyMoved = false;
        this.chessboard.annotatedMoves
            .forEach((move) => {
                if (color === "white" && (move.whiteMove.indexOf("K") !== -1 || move.whiteMove.indexOf("0") !== -1)) {
                    hasKingAlreadyMoved = true;
                } else if (color === "black" && (move.blackMove.indexOf("K") !== -1 || move.blackMove.indexOf("0") !== -1)) {
                    hasKingAlreadyMoved = true;
                }
            });
        return hasKingAlreadyMoved;
    }

    rookMovedDueToCastling(piece) {
        let rookMovedDueToCastling = false;
        this.chessboard.annotatedMoves
            .forEach((move) => {
                if (piece === 'WR70' && move.whiteMove.indexOf("0-0") !== -1) {
                    rookMovedDueToCastling = true;
                } else if (piece === 'WR00' && move.whiteMove.indexOf("0-0-0") !== -1) {
                    rookMovedDueToCastling = true;
                } else if (piece === 'BR07' && move.blackMove.indexOf("0-0-0") !== -1) {
                    rookMovedDueToCastling = true;
                } else if (piece === 'BR77' && move.blackMove.indexOf("0-0") !== -1) {
                    rookMovedDueToCastling = true;
                }


            });
        return rookMovedDueToCastling;
    };

    printSquares(squares) {
        let chessboardAsString = "";
        for (let rowIndex = 7; rowIndex >= 0; rowIndex--) {
            for (let columnIndex = 0; columnIndex <= 7; columnIndex++) {
                let squareIndex;
                for (let index = 0; index < squares.length; index++) {
                    if (squares[index].column === columnIndex
                        && squares[index].row === rowIndex) {

                        squareIndex = index;
                        break;
                    }
                }

                let piece = squares[squareIndex].piece;
                if (piece === 'empty') {
                    piece = '-';
                } else {
                    if (piece.indexOf("W") !== -1) {
                        piece = piece.toLowerCase();
                    }
                    piece = piece.substring(1, 2);

                }
                chessboardAsString += piece;
                if (columnIndex !== 0 && columnIndex % 7 === 0) {
                    chessboardAsString += "\n";
                }
            }


        }

        console.log(chessboardAsString);
        return chessboardAsString;
    }

    printCurrentChessboard() {
        let chessboardAsString = "";
        for (let rowIndex = 7; rowIndex >= 0; rowIndex--) {
            for (let columnIndex = 0; columnIndex <= 7; columnIndex++) {

                let piece = this.findSquare(columnIndex, rowIndex).piece;
                if (piece === 'empty') {
                    piece = '-';
                } else {
                    if (piece.indexOf("W") !== -1) {
                        piece = piece.toLowerCase();
                    }
                    piece = piece.substring(1, 2);

                }
                chessboardAsString += piece;
                if (columnIndex !== 0 && columnIndex % 7 === 0) {
                    chessboardAsString += "\n";
                }
            }


        }

        console.log(chessboardAsString);
        return chessboardAsString;
    }

    /* addAnnotation(startSquare,
                          endSquare, capture, promotion,
                          castling, check, mate) { */

    addAnnotation(moveNotation) {

        let whiteMove = this.whiteMove;
        let movecomplete;
        let currentchessboard = JSON.parse(JSON.stringify(this.chessboard.squares));

        if (this.whiteMove) {
            let newMove = { whiteMove: null, blackMove: null, whiteMoveStartSquare: null, whiteMoveEndSquare: null, blackMoveStartSquare: null, blackMoveEndSquare: null, whiteMoveVariations: [], blackMoveVariations: [], moveNumber: null, chessboardAfterWhiteMove: null, chessboardAfterBlackMove: null };
            newMove = this.addNewAnnotatedMove(moveNotation, whiteMove);

            if (this.chessboard.annotatedMoves.length > this.moveNumber || this.currentVariation) {

                if (!this.currentVariation) {
                    //adding white move to main line
                    let variations = this.chessboard.annotatedMoves[this.moveNumber].whiteMoveVariations;
                    let numberOfVariations = variations.length;
                    let newVariationNeedsToBeCreated = true;
                    for (let i = 0; i < numberOfVariations; i++) {
                        if (variations[i].moves[0].whiteMove === newMove.whiteMove) {
                            this.currentVariation = variations[i];
                            newVariationNeedsToBeCreated = false;
                            break;
                        }
                    }

                    if (newVariationNeedsToBeCreated) {
                        this.chessboard.annotatedMoves[this.moveNumber].whiteMoveVariations[numberOfVariations] = { moves: [] };
                        this.chessboard.annotatedMoves[this.moveNumber].whiteMoveVariations[numberOfVariations].moves[0] = newMove;
                        this.chessboard.annotatedMoves[this.moveNumber].whiteMoveVariations[numberOfVariations].variationId = this.variationId;
                        this.currentVariation = {
                            "variationId": this.variationId,
                            "moveNumber": this.moveNumber,
                            "whiteMove": whiteMove,
                            "variationIndex": numberOfVariations,
                            "moves": this.chessboard.annotatedMoves[this.moveNumber].whiteMoveVariations[numberOfVariations].moves
                        };
                        this.variations.set(this.variationId, this.currentVariation);
                        this.variationId++;
                        /*   console.log("Position end of create variation:");
                          if(this.chessboard.annotatedMoves.length > 0 && typeof this.chessboard.annotatedMoves[0].chessboardAfterWhiteMove !== 'undefined' ){
                              this.printSquares(this.chessboard.annotatedMoves[0].chessboardAfterWhiteMove);}
                          if(this.chessboard.annotatedMoves.length > 0 && typeof this.chessboard.annotatedMoves[0].chessboardAfterBlackMove !== 'undefined' && this.chessboard.annotatedMoves[0].chessboardAfterBlackMove.length!==0){
                              this.printSquares(this.chessboard.annotatedMoves[0].chessboardAfterBlackMove);} */
                    }

                } else {
                    //adding white move to an existing variation
                    let variation = this.variations.get(this.currentVariation.variationId);
                    let moveNumberInVariation = this.moveNumber - variation.moveNumber;
                    if (variation.moves.length > moveNumberInVariation) {
                        let newVariationNeedsToBeCreated = true;
                        let variations = variation.moves[moveNumberInVariation].whiteMoveVariations;
                        let numberOfVariations = variations.length;

                        for (let i = 0; i < numberOfVariations; i++) {
                            if (variations[i].moves[0].whiteMove === newMove.whiteMove) {
                                this.currentVariation = variations[i];
                                newVariationNeedsToBeCreated = false;
                                break;
                            }
                        }

                        if (newVariationNeedsToBeCreated) {
                            /*   console.log("Creating new variation: " + this.variationId + " with the white starting move " + newMove.whiteMove);
                              console.log(this.printSquares(newMove.chessboardAfterWhiteMove)); */

                            variation.moves[moveNumberInVariation].whiteMoveVariations[numberOfVariations] = { moves: [] };
                            //newMove.moveNumber = this.moveNumber + 1;
                            variation.moves[moveNumberInVariation].whiteMoveVariations[numberOfVariations].moves[0] = newMove;
                            variation.moves[moveNumberInVariation].whiteMoveVariations[numberOfVariations].variationId = this.variationId;
                            this.currentVariation = {
                                "variationId": this.variationId,
                                "parentVariationId": variation.variationId,
                                "moveNumber": this.moveNumber,
                                "whiteMove": whiteMove,
                                "variationIndex": numberOfVariations,
                                "moves": variation.moves[moveNumberInVariation].whiteMoveVariations[numberOfVariations].moves
                            };
                            this.variations.set(this.currentVariation.variationId, this.currentVariation);
                            this.variationId++;
                        }

                    } else {
                        //adding white move to existing variation
                        //newMove.moveNumber = variation.moves.length + 1;
                        variation.moves[variation.moves.length] = newMove;
                    }
                }
            } else {

                this.chessboard.annotatedMoves[this.moveNumber] = newMove;

            }

            movecomplete = false;
        } else {

            //annotating black move
            if (this.currentVariation || this.chessboard.annotatedMoves[this.moveNumber].blackMove !== "") {
                if (!this.currentVariation) {

                    let variations = this.chessboard.annotatedMoves[this.moveNumber].blackMoveVariations;
                    let numberOfVariations = variations.length;
                    let newVariationNeedsToBeCreated = true;

                    if (numberOfVariations === 0 && this.chessboard.annotatedMoves[this.moveNumber].blackMove === moveNotation) {
                        newVariationNeedsToBeCreated = false;
                    } else {
                        for (let i = 0; i < numberOfVariations; i++) {
                            if (variations[i].moves[0].blackMove === moveNotation) {
                                newVariationNeedsToBeCreated = false;
                                this.currentVariation = variations[i];
                                break;
                            }
                        }
                    }

                    if (newVariationNeedsToBeCreated) {
                        /*   console.log("Chessboard in the mainline start:");
                          console.log( this.printSquares( this.chessboard.annotatedMoves[0].chessboardAfterWhiteMove));
                          console.log( this.printSquares( this.chessboard.annotatedMoves[0].chessboardAfterBlackMove)); */
                        //new variation with a black starting move created
                        this.chessboard.annotatedMoves[this.moveNumber].blackMoveVariations[numberOfVariations] = { moves: [] };
                        let newMove = this.addNewAnnotatedMove(moveNotation, whiteMove);
                        this.chessboard.annotatedMoves[this.moveNumber].blackMoveVariations[numberOfVariations].moves[0] = newMove;
                        this.chessboard.annotatedMoves[this.moveNumber].blackMoveVariations[numberOfVariations].variationId = this.variationId;
                        this.currentVariation = {
                            "variationId": this.variationId,
                            "moveNumber": this.moveNumber,
                            "whiteMove": this.whiteMove,
                            "variationIndex": numberOfVariations,
                            "moves": this.chessboard.annotatedMoves[this.moveNumber].blackMoveVariations[numberOfVariations].moves
                        };
                        this.variations.set(this.currentVariation.variationId, this.currentVariation);
                        this.variationId++;

                        /*        console.log("Creating new variation: "+ this.variationId + " with the black starting move "+newMove.blackMove);
                               console.log( this.printSquares(newMove.chessboardAfterBlackMove));
                               console.log("Chessboard in the mainline end:");
       
                               console.log( this.printSquares( this.chessboard.annotatedMoves[0].chessboardAfterWhiteMove));
                               console.log( this.printSquares( this.chessboard.annotatedMoves[0].chessboardAfterBlackMove)); */
                    }
                } else {
                    //adding black move to an existing variation
                    let variation = this.variations.get(this.currentVariation.variationId);
                    let newVariationNeedsToBeCreated = true;
                    let moveNumberInVariation = this.moveNumber - variation.moveNumber;

                    if (variation.moves[moveNumberInVariation].blackMove !== "") {

                        let variations = variation.moves[moveNumberInVariation].blackMoveVariations;
                        let numberOfVariations = variations.length;

                        for (let i = 0; i < numberOfVariations; i++) {
                            if (variations[i].moves[0].blackMove === moveNotation) {
                                newVariationNeedsToBeCreated = false;
                                this.currentVariation = variations[i];
                                break;
                            }
                        }

                        //adding variation starting with a black move
                        if (newVariationNeedsToBeCreated) {
                            variation.moves[moveNumberInVariation].blackMoveVariations[numberOfVariations] = { moves: [] };
                            variation.moves[moveNumberInVariation].blackMoveVariations[numberOfVariations].moves[0] = this.addNewAnnotatedMove(moveNotation, whiteMove);
                            variation.moves[moveNumberInVariation].blackMoveVariations[numberOfVariations].variationId = this.variationId;
                            this.currentVariation = {
                                "variationId": this.variationId,
                                "parentVariationId": variation.variationId,
                                "moveNumber": this.moveNumber,
                                "whiteMove": whiteMove,
                                "variationIndex": numberOfVariations,
                                "moves": variation.moves[moveNumberInVariation].blackMoveVariations[numberOfVariations].moves
                            };
                            this.variations.set(this.currentVariation.variationId, this.currentVariation);
                            this.variationId++;
                        }
                    } else {
                        /*  console.log("Position before adding black move to existing variation:");
                         if( this.chessboard.annotatedMoves.length > 0 && typeof  this.chessboard.annotatedMoves[0].chessboardAfterWhiteMove !== 'undefined' ){
                             this.printSquares( this.chessboard.annotatedMoves[0].chessboardAfterWhiteMove);}
                         if( this.chessboard.annotatedMoves.length > 0 && typeof  this.chessboard.annotatedMoves[0].chessboardAfterBlackMove !== 'undefined' &&  this.chessboard.annotatedMoves[0].chessboardAfterBlackMove.length!==0){
                             this.printSquares( this.chessboard.annotatedMoves[0].chessboardAfterBlackMove);} */

                        variation.moves[variation.moves.length - 1].blackMove = moveNotation;
                        /*    variation.moves[variation.moves.length - 1].blackMoveStartSquare = startSquare;
                           variation.moves[variation.moves.length - 1].blackMoveEndSquare = endSquare; */
                        variation.moves[variation.moves.length - 1].chessboardAfterBlackMove = this.chess.fen();
                        //variation.moves[variation.moves.length - 1].chessboardAfterBlackMove = currentchessboard;

                        /*    console.log("Position after adding black move to existing variation:");
                           if( this.chessboard.annotatedMoves.length > 0 && typeof  this.chessboard.annotatedMoves[0].chessboardAfterWhiteMove !== 'undefined' ){
                               this.printSquares( this.chessboard.annotatedMoves[0].chessboardAfterWhiteMove);}
                           if( this.chessboard.annotatedMoves.length > 0 && typeof  this.chessboard.annotatedMoves[0].chessboardAfterBlackMove !== 'undefined' &&  this.chessboard.annotatedMoves[0].chessboardAfterBlackMove.length!==0){
                               this.printSquares( this.chessboard.annotatedMoves[0].chessboardAfterBlackMove);} */
                    }
                }

            } else {

                this.chessboard.annotatedMoves[this.moveNumber].blackMove = moveNotation;
                /*     this.chessboard.annotatedMoves[this.moveNumber].blackMoveStartSquare = startSquare;
                    this.chessboard.annotatedMoves[this.moveNumber].blackMoveEndSquare = endSquare; */
                this.chessboard.annotatedMoves[this.moveNumber].chessboardAfterBlackMove = this.chess.fen();
                // this.chessboard.annotatedMoves[ this.moveNumber].chessboardAfterBlackMove = currentchessboard;

                /* console.log("Position after new mainline black move:");
                this.printSquares( this.chessboard.annotatedMoves[0].chessboardAfterWhiteMove);
                this.printSquares( this.chessboard.annotatedMoves[0].chessboardAfterBlackMove); */
            }
            movecomplete = true;
        }




        this.annotatedMoves = this.chessboard.annotatedMoves.filter(move => move.whiteMove !== '' || move.blackMove !== '');

        //updateScrollbar('scrollTo', 440);

        return moveNotation;
    }

    private highlightLastMoveInNotation() {
        this.moveToHighlight.variationId = this.currentVariation ? this.currentVariation.variationId : this.MAIN_LINE;
        this.moveToHighlight.moveNumber = this.moveNumber;
        this.moveToHighlight.whiteMove = this.whiteMove;
    }

    addNewAnnotatedMove(moveNotation, whiteMove) {
        let newAnnotatedMove = { whiteMove: null, blackMove: null, whiteMoveStartSquare: null, whiteMoveEndSquare: null, blackMoveStartSquare: null, blackMoveEndSquare: null, whiteMoveVariations: [], blackMoveVariations: [], moveNumber: null, chessboardAfterWhiteMove: null, chessboardAfterBlackMove: null };
        newAnnotatedMove.whiteMove = whiteMove ? moveNotation : "";
        newAnnotatedMove.blackMove = whiteMove ? "" : moveNotation;
        /*  newAnnotatedMove.whiteMoveStartSquare = whiteMove ? startSquare : "";
         newAnnotatedMove.whiteMoveEndSquare = whiteMove ? endSquare : "";
         newAnnotatedMove.blackMoveStartSquare = whiteMove ? "" : startSquare;
         newAnnotatedMove.blackMoveEndSquare = whiteMove ? "" : endSquare; */
        newAnnotatedMove.whiteMoveVariations = [];
        newAnnotatedMove.blackMoveVariations = [];
        newAnnotatedMove.moveNumber = this.moveNumber + 1;
        // newAnnotatedMove.chessboardAfterWhiteMove = whiteMove ? currentchessboard : [];
        // newAnnotatedMove.chessboardAfterBlackMove = whiteMove ? [] : currentchessboard;
        newAnnotatedMove.chessboardAfterWhiteMove = whiteMove ? this.chess.fen() : "";
        newAnnotatedMove.chessboardAfterBlackMove = whiteMove ? "" : this.chess.fen();
        return newAnnotatedMove;
    }

    getSquareAsString(square) {
        return String
            .fromCharCode(97 + square.column)
            + (square.row + 1);
    }

    findIndexOfSquare(x, y) {
        for (let index = 0; index < this.chessboard.squares.length; index++) {
            if (this.chessboard.squares[index].column === x
                && this.chessboard.squares[index].row === y) {

                return index;
            }
        }
    }

    findSquare(x, y) {
        return this.chessboard.squares[this.findIndexOfSquare(x, y)];
    }

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
        this.socket = this.webSocketService.initWebSockets();
        const onOpen = function () {
            console.log("opening session and requesting game info");

        }
        const onError = function (event) {
            // //console.log("Error occured:" + event);

        }

        const onMessage = (message) => {

            let data = JSON.parse(message.data);
            if (data.action === "move") {
                this.executeReceivedMove(data);
            } else if (data.action === "startGame") {

                this.router.navigate(['/playGame/' + data.gameId]).then((result) => this.requestGameInfo());

            } else if (data.action === "offerDraw") {
                this.displayDrawOffer();
            } else if (data.action === "drawOfferReply") {
                if (data.acceptDraw === true) {
                    this.endGame("1/2 - 1/2");
                } else {
                    this.drawOfferRejected = true;
                }
            } else if (data.action === "resign") {
                this.endGame(this.whitePlayer ? "1-0" : "0-1");
            } else if (data.action === "gameInfo") {
                this.startGame(data);
            } else if (data.action === "gameResult") {
                this.endGame(data.gameResult);
            } else if (data.action === "offerRematch") {
                console.log("received rematch offer");
                this.rematchOfferReceived = true;
            } else if (data.action === "oponentDisconnected") {
                this.oponentDisconnected = true;
            }
        }

        this.socket.onmessage = (message) => onMessage(message);
        this.socket.onerror = onError;
        this.socket.onopen = onOpen;
        this.socket.onclose = () => {

        }
    };

    displayDrawOffer() {
        this.drawOfferReceived = true;
    };

    executeReceivedMove(move) {
        console.log(move);

        this.lastMove = move;
        this.whiteTime = move.whiteTime;
        this.blackTime = move.blackTime;

        this.myMove = true;
        this.castling = "";

        const validMove = this.chess.move(move.annotatedMove);
        this.processValidMove(validMove, move.chessboardAfterMove, false);
        this.pressClock(!move.whiteMove);
        if (this.mode === this.chessboardUsageModes.PLAYING) {
            this.svgChessboard.enableMoveInput(this.moveInputHandler, this.whitePlayer ? COLOR.white : COLOR.black);
        }
    };
    generateClockTimeFromSeconds(seconds) {
        let clockSeconds = seconds % 60;
        let clockSecondsString: string;
        if (clockSeconds < 10) {
            clockSecondsString = "0" + +clockSeconds
        } else {
            clockSecondsString = clockSeconds.toString();
        }
        let clockMinutes = Math.floor(seconds / 60);
        return clockMinutes + ":" + clockSecondsString
    };

    onTimeout(whitePlayer) {
        if (whitePlayer) {
            if (this.whiteTime > 0
                // && playingGame === true
            ) {
                this.whiteTime -= 1;
                this.whiteClock = this.generateClockTimeFromSeconds(this.whiteTime);
                console.log("Decreasing white time.")
            } else {
                if (whitePlayer === whitePlayer) {
                    this.endGame("0-1 (Black won on time)");
                }
                return;
            }
        } else {
            if (this.blackTime > 0
                //&& playingGame === true
            ) {
                this.blackTime -= 1;
                this.blackClock = this.generateClockTimeFromSeconds(this.blackTime);
            } else {
                if (whitePlayer === whitePlayer) {
                    this.endGame("1-0 (White won on time)");
                }
                return;
            }
        }
        if (this.playingGame || this.mode === this.chessboardUsageModes.OBSERVING) {
            this.clockTimer = setTimeout(() =>
                this.onTimeout(whitePlayer)
                , 1000);
        }

    };

    startClock(whitePlayer) {

        this.clockTimer = setTimeout(() => this
            .onTimeout(whitePlayer), 1000);

    };

    pressClock(whitePlayer) {

        clearTimeout(this.clockTimer);
        if (this.increment > 0) {
            if (whitePlayer) {
                this.blackTime += this.increment;
            } else {
                this.whiteTime += this.increment;
            }
        }
        this.startClock(whitePlayer);
    };


    startGame(data) {
        console.log("starting game");
        $(".chessPiece").show();
        this.eraseAllHighlightedSquares();
        this.hideAllAlerts();
        this.moveNumber = 0;
        this.seekingOponent = false;
        this.playingGame = true;
        this.whiteMove = true;
        this.gameResult = "";
        this.time = data.time;
        this.increment = data.increment;
        this.whiteTime = data.time * 60;
        this.blackTime = data.time * 60;
        this.drawOfferReceived = false;
        this.whitePlayerElo = data.whitePlayer.elo;
        this.blackPlayerElo = data.blackPlayer.elo;
        this.whitePlayerName = data.whitePlayer.username;
        this.blackPlayerName = data.blackPlayer.username;
        this.whiteClock = this.generateClockTimeFromSeconds(this.whiteTime);
        this.blackClock = this.generateClockTimeFromSeconds(this.blackTime);
        this.annotatedMoves = [];

        // $apply( () {
        this.initialiseChessboard();
        if (this.mode === this.chessboardUsageModes.OBSERVING) {
            this.annotatedMoves = data.annotatedMoves;
        }
        this.newGame = true;

        if (data.blackPlayer.username === this.user) {
            this.oponent = data.whitePlayer.username;
            this.whitePlayer = false;
            this.myMove = false;
            this.svgChessboard.setOrientation(COLOR.black);
            this.svgChessboard.disableMoveInput();
        } else {
            this.oponent = data.blackPlayer.username;
            this.whitePlayer = true;
            this.myMove = true;
            this.svgChessboard.setOrientation(COLOR.white);
        }
    };

    displayPromotionPicker(elem,
        startPos, endPos) {
        this.startPosition = startPos;
        this.endPosition = endPos;
        this.element = elem;
        this.showPawnPromotionDiv = true;

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

    endGame(gameResult) {
        if (this.gameResult === "") {
            $("#arrow").remove();

            let gameResultWhite: number;
            let gameResultBlack: number;
            if (gameResult === "1-0" || gameResult === "1-0 (White won on time)") {
                gameResultWhite = 1;
                gameResultBlack = 0;
            } else if (gameResult === "0-1" || gameResult === "0-1 (Black won on time)") {
                gameResultWhite = 0;
                gameResultBlack = 1;
            } else if (gameResult === "1/2 - 1/2") {
                gameResultWhite = 0.5;
                gameResultBlack = 0.5;
            }
            this.stopClocks();
            this.playingGame = false;

            this.updatePlayerElos(
                gameResultWhite,
                gameResultBlack);

            this.gameResult = gameResult;
            this.sendGameResult();



        }

    };

    postGameModalController(this,
        $modalInstance, whitePlayerName,
        blackPlayerName, gameResult, whitePlayer, mode) {

        whitePlayerName = whitePlayerName;
        blackPlayerName = blackPlayerName;
        gameResult = gameResult;
        whitePlayer = whitePlayer;
        this.resultMessage = function () {
            if (mode === this.chessboardUsageModes.PLAYING && ((gameResult === "1-0"
                && whitePlayer === true) || (gameResult === "0-1"
                    && whitePlayer === false))) {
                return "Congratulation you won the game.";
            } else if (mode === this.chessboardUsageModes.PLAYING && ((gameResult === "1-0 (White won on time)"
                && whitePlayer === true) || (gameResult === "0-1 (Black won on time)"
                    && whitePlayer === false))) {
                return "Congratulation you won the game on time.";
            } else if (mode === this.chessboardUsageModes.PLAYING && ((gameResult === "1-0 (White won on time)"
                && whitePlayer === false) || (gameResult === "0-1 (Black won on time)"
                    && whitePlayer === true))) {
                return "You lost the game on time.";
            } else if (mode === this.chessboardUsageModes.PLAYING && ((gameResult === "1-0"
                && whitePlayer === false) || (gameResult === "0-1"
                    && whitePlayer === true))) {
                return "You lost the game.";
            } else if (gameResult === "1-0" &&
                mode === this.chessboardUsageModes.OBSERVING) {
                return whitePlayerName + " won the game.";
            } else if (gameResult === "0-1"
                && mode === this.chessboardUsageModes.OBSERVING) {
                return blackPlayerName + " won the game.";
            } else if (gameResult === "1-0 (White won on time)" &&
                mode === this.chessboardUsageModes.OBSERVING) {
                return whitePlayerName + " won the game on time.";
            } else if (gameResult === "0-1 (Black won on time)"
                && mode === this.chessboardUsageModes.OBSERVING) {
                return blackPlayerName + " won the game on time.";
            } else if (gameResult === "1/2 - 1/2") {
                return "Game ended in a draw."
            } else {
                console.log(gameResult, whitePlayer);
                return "Else called."
            }

        };

        this.close = function () {
            console.log("Closing dialog window;");
            $modalInstance.close();
        };


    };

    /*     this.postGameModalController['$inject'] = ['this',
            '$modalInstance', 'whitePlayerName',
            'blackPlayerName', 'gameResult',
            'whitePlayer', 'mode']; */

    openPostGameModal(
        whitePlayerName, blackPlayerName,
        gameResult, whitePlayer, mode) {

        /* $modal
           .open({
               templateUrl: 'views/playingHall/postGameModal.html',
               controller: this.postGameModalController,
               scope: $new(true),
               resolve: {
                   whitePlayerName:  () => {
                       return whitePlayerName
                   },
                   blackPlayerName:  ()=>  {
                       return blackPlayerName
                   },
                   gameResult:  () => {
                       return gameResult
                   },
                   whitePlayer:  () => {
                       return whitePlayer
                   },
                   mode:  () =>{
                       return mode
                   }
               }
           }); */
    };

    offerDraw() {
        let drawOffer = {
            action: "offerDraw",
            oponent: this.oponent
        };
        this.socket.send(JSON.stringify(drawOffer));
    };

    drawOfferReply(acceptDraw) {
        let drawOffer = {
            action: "drawOfferReply",
            player: this.user,
            oponent: this.oponent,
            acceptDraw: acceptDraw
        };

        if (acceptDraw) {
            this.endGame("1/2 - 1/2");
        } else {
            this.socket.send(JSON.stringify(drawOffer));
        }
        this.drawOfferReceived = false;
    };

    sendGameResult() {
        let gameResult = {
            action: "gameResult",
            oponent: this.oponent,
            gameId: this.gameId,
            gameResult: this.gameResult,
            whitePlayerElo: this.whitePlayerElo,
            blackPlayerElo: this.blackPlayerElo
        };

        this.socket.send(JSON.stringify(gameResult));
    };
    resign() {
        this.resignButtonPressed = false;
        let gameResult = !this.whitePlayer ? "1-0" : "0-1";
        this.endGame(gameResult);
        this.sendGameResult();
    };

    getPlayerEloByGameTimeType(gameTimeType, player) {
        switch (gameTimeType) {
            case "BLITZ": return player.eloblitz;
            case "BULLET": return player.elobullet;
            case "RAPID": return player.elorapid;
            case "CLASSICAL": return player.eloclassical;
        }
    }

    observeGame(game) {

        this.gameResult = "";
        this.whitePlayerName = game.whitePlayer.username;
        this.blackPlayerName = game.blackPlayer.username;
        this.whitePlayerElo = this.getPlayerEloByGameTimeType(game.gameTimeType, game.whitePlayer);
        this.blackPlayerElo = this.getPlayerEloByGameTimeType(game.gameTimeType, game.blackPlayer);
        this.annotatedMoves = Object.keys(game.annotatedMoves).map(key => game.annotatedMoves[key]);
        this.chessboard.annotatedMoves = this.annotatedMoves;

        if (this.annotatedMoves.length !== 0) {
            let lastMove = this.annotatedMoves[this.annotatedMoves.length - 1];
            if (lastMove.blackMove) {
                this.moveNumber = this.annotatedMoves.length;
                this.redrawChessboard(lastMove.chessboardAfterBlackMove, null);
                this.startClock(true)
            } else {
                this.moveNumber = this.annotatedMoves.length - 1;
                this.redrawChessboard(lastMove.chessboardAfterWhiteMove, null);
                this.startClock(false);
            }
            this.whiteTime = lastMove.whiteTime;
            this.blackTime = lastMove.blackTime;
        } else {
            this.whiteTime = game.time * 60;
            this.blackTime = game.time * 60;
        }

        this.whiteClock = this.generateClockTimeFromSeconds(this.whiteTime);
        this.blackClock = this.generateClockTimeFromSeconds(this.blackTime);
        console.log(game);
    };

    offerRematch() {

        let offerRematchMessage = {
            action: "offerRematch",
            oponent: this.oponent
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
            this.socket.send(JSON.stringify(acceptRematchReplyMessage));
        }

        this.rematchOfferReceived = false;

    }



    sendMove(fen: string, annotatedMove: string) {

        let moveAction = {
            action: "move",
            oponent: this.oponent,
            chessboardAfterMove: fen,
            gameId: this.gameId,
            annotatedMove: annotatedMove,
            whiteMove: this.whiteMove,
            whiteTime: this.whiteTime,
            blackTime: this.blackTime
        };
        console.log("sending move to server:");
        console.log(JSON.stringify(moveAction));
        this.socket.send(JSON.stringify(moveAction));


    };




}
