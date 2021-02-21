import { GameService } from './../../services/game.service';
import { Component, OnInit, Input, SimpleChanges, Output, EventEmitter, HostListener, ViewChild, ElementRef } from '@angular/core';
import { COLOR } from "../../../js/components/cm-chessboard/Chessboard.js";
import { FindValueSubscriber } from 'rxjs/internal/operators/find';


@Component({
    selector: 'annotation-table',
    templateUrl: './annotated-moves.component.html',
    styleUrls: ['./annotated-moves.component.css']
})
export class AnnotatedMovesComponent implements OnInit {

    @Input()
    gameId;

    @Input('annotatedMoves')
    annotatedMoves;

    @Output('annotatedMovesChange')
    annotatedMovesChange: EventEmitter<any[]> = new EventEmitter();

    @ViewChild('notationdiv') notationDiv: ElementRef;

    moveToHighlight = {
        variationId: null,
        moveNumber: null,
        whiteMove: true
    }

    Arr=Array;

    MAIN_LINE = -1;

    alternativeMoves = [];
    noOfBlankRowsNeeded = 7;
    showAlternativeMovesDiv = false;
    //annotatedMoves = [];
    currentVariation = null;
    variations = new Map();
    variationId = 0;
    moveNumber = 0;


    //chessRules = require("../../../js/chessRules.js");

    constructor(private gameService: GameService) {
    }

    ngOnInit(): void {

       // this.annotatedMoves = [];
       this.moveNumber = 0;

        // for (let index = 0; index < this.noOfBlankRowsNeeded; index++) {
        //     this.annotatedMoves.push({ moveNumber: index + 1, whiteMove: "", blackMove: "" });
        //     //this.annotatedMoves.push({moveNumber:index+1,whiteMove:"", blackMove:""})
        // }
        // this.chess = this.chessRules();
        this.gameService.moveSubscriber.subscribe(data => {
            console.log(data);
            this.addAnnotation(data.moveNotation, data.moveColor, data.fen)
            this.addBlankRowsIfNeeded();
            this.scrollAnnotationDivToBottom();
        });

        
        this.gameService.gameDataSubscriber.subscribe(gameData => {
            console.log("Setting received moves");
            this.annotatedMoves = gameData.annotatedMoves;
            let lastMove = this.annotatedMoves[this.annotatedMoves.length -1];
            if(lastMove && !lastMove.blackMove){
                this.moveNumber = this.annotatedMoves.length-1;
            } else{
                this.moveNumber = this.annotatedMoves.length;
            }
             
        })
        this.gameService.gameActionSubscriber.subscribe(gameAction => {
            if (gameAction.action === "nextMove") {
                this.goToNextMove();
            } else if (gameAction.action === "previousMove") {
                this.goToPreviousMove();
            } else if (gameAction.action === "finishPositionSetup") {
                console.log("Clearing annotated moves.")
                this.annotatedMoves = [];
                this.moveNumber = +gameAction.gamedata[0].moveNumber;
                for (let index = 0; index < this.moveNumber; index++) {
                    this.annotatedMoves.push({ moveNumber: index + 1, whiteMove: "", blackMove: "" });
                    //this.annotatedMoves.push({moveNumber:index+1,whiteMove:"", blackMove:""})
                }

            }
        })

        this.gameService.gamePositionSubscriber.subscribe(gamePosition => {
            console.log(gamePosition);
            this.updateAnnotationAfterPositionRedraw(gamePosition.positionAsFEN, gamePosition.variationId);
        })

        this.gameService.gameActionSubscriber.subscribe(gameAction => {

        });
        
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['gameId']) {
            console.log("Clearing annotated moves.");

            this.annotatedMoves = [];
            this.addBlankRowsIfNeeded();
            this.currentVariation = null;
            this.variations = new Map();
            this.variationId = 0;
            this.moveNumber = 0;
        }
    }

    addBlankRowsIfNeeded(){
        if(this.annotatedMoves.length < 7){
            this.noOfBlankRowsNeeded = 7 - this.annotatedMoves.length;
        }
        
    }

    updateAnnotationAfterPositionRedraw(positionAsFEN, variationId) {
        const fenParts: string[] = positionAsFEN.split(" ");
        let lastMoveNumber: number = parseInt(fenParts[5]);
        const whiteMoveToRedraw = fenParts[1] === COLOR.black ? true : false;
        let elementId: string;

        //this.whiteMove = whiteMoveToRedraw;
        this.moveNumber = whiteMoveToRedraw ? lastMoveNumber - 1 : lastMoveNumber - 2;
        this.currentVariation = this.variations.get(variationId);

        this.moveToHighlight.moveNumber = this.moveNumber;
        this.moveToHighlight.variationId = variationId;
        this.moveToHighlight.whiteMove = whiteMoveToRedraw ? true : false;

        //this.whiteMove = !this.whiteMove;
        if (!whiteMoveToRedraw) {
            this.moveNumber = this.moveNumber + 1;
        }
    }

    annotateMoveOnClick(positionAsFEN, variationId) {
        this.gameService.emitGamePosition({ gameId: this.gameId, positionAsFEN, variationId });
        this.updateAnnotationAfterPositionRedraw(positionAsFEN, variationId);
    }

    moveAlreadyAnnotated(moveColor, moveNotation) {
        let moveAlreadyExists = false;
        if (moveColor === COLOR.white) {
            if (this.currentVariation) {
                let variation = this.variations.get(this.currentVariation.variationId);
                let moveNumberInVariation = this.moveNumber - variation.moveNumber;
                if (variation.moves.length > moveNumberInVariation) {
                    moveAlreadyExists = variation.moves[moveNumberInVariation].whiteMove === moveNotation;
                }
            } else {
                if (this.annotatedMoves.length > this.moveNumber) {
                    moveAlreadyExists = this.annotatedMoves[this.moveNumber].whiteMove === moveNotation
                }
            }

        } else {
            if (this.currentVariation) {
                let variation = this.variations.get(this.currentVariation.variationId);
                let moveNumberInVariation = this.moveNumber - variation.moveNumber;
                moveAlreadyExists = variation.moves[moveNumberInVariation].blackMove === moveNotation;
            } else {
                moveAlreadyExists = this.annotatedMoves[this.moveNumber].blackMove === moveNotation
            }
        }
        console.log("Move already annotated: " + moveAlreadyExists);
        return moveAlreadyExists;
    }

    scrollAnnotationDivToBottom() {
        if (this.notationDiv) {
            var elem = this.notationDiv.nativeElement;
            console.log("Scroll Height:" + elem.scrollHeight);
            elem.scrollTop = elem.scrollHeight;
        }
    }

    addAnnotation(moveNotation, moveColor, fenAfterMove) {

        let movecomplete;


        if (!this.moveAlreadyAnnotated(moveColor, moveNotation)) {

            if (moveColor === COLOR.white) {
                let newMove = { whiteMove: null, blackMove: null, whiteMoveStartSquare: null, whiteMoveEndSquare: null, blackMoveStartSquare: null, blackMoveEndSquare: null, whiteMoveVariations: [], blackMoveVariations: [], moveNumber: null, chessboardAfterWhiteMove: null, chessboardAfterBlackMove: null };
                newMove = this.addNewAnnotatedMove(moveNotation, moveColor, fenAfterMove);

                if (this.annotatedMoves.length > this.moveNumber || this.currentVariation) {

                    if (!this.currentVariation) {
                        //adding white move to main line
                        let variations = this.annotatedMoves[this.moveNumber].whiteMoveVariations;

                        let numberOfVariations = variations ? variations.length :0;
                        let newVariationNeedsToBeCreated = true;
                        for (let i = 0; i < numberOfVariations; i++) {
                            if (variations[i].moves[0].whiteMove === newMove.whiteMove) {
                                this.currentVariation = variations[i];
                                newVariationNeedsToBeCreated = false;
                                break;
                            }
                        }

                        if (newVariationNeedsToBeCreated) {
                            this.annotatedMoves[this.moveNumber].whiteMoveVariations[numberOfVariations] = { moves: [] };
                            this.annotatedMoves[this.moveNumber].whiteMoveVariations[numberOfVariations].moves[0] = newMove;
                            this.annotatedMoves[this.moveNumber].whiteMoveVariations[numberOfVariations].variationId = this.variationId;
                            this.currentVariation = {
                                "variationId": this.variationId,
                                "moveNumber": this.moveNumber,
                                "whiteMove": moveColor === COLOR.white,
                                "variationIndex": numberOfVariations,
                                "moves": this.annotatedMoves[this.moveNumber].whiteMoveVariations[numberOfVariations].moves
                            };
                            this.variations.set(this.variationId, this.currentVariation);
                            this.variationId++;
                            /*   console.log("Position end of create variation:");
                              if(this.annotatedMoves.length > 0 && typeof this.annotatedMoves[0].chessboardAfterWhiteMove !== 'undefined' ){
                                  this.printSquares(this.annotatedMoves[0].chessboardAfterWhiteMove);}
                              if(this.annotatedMoves.length > 0 && typeof this.annotatedMoves[0].chessboardAfterBlackMove !== 'undefined' && this.annotatedMoves[0].chessboardAfterBlackMove.length!==0){
                                  this.printSquares(this.annotatedMoves[0].chessboardAfterBlackMove);} */
                        }

                    } else {
                        //adding white move to an existing variation
                        let variation = this.variations.get(this.currentVariation.variationId);
                        let moveNumberInVariation = this.moveNumber - variation.moveNumber;



                        if (variation.moves.length > moveNumberInVariation) {
                            let newVariationNeedsToBeCreated = true;
                            let variations = variation.moves[moveNumberInVariation].whiteMoveVariations;
                            let numberOfVariations = variations ? variations.length : 0;

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
                                variation.moves[moveNumberInVariation].whiteMoveVariations[numberOfVariations].moves[0] = newMove;
                                variation.moves[moveNumberInVariation].whiteMoveVariations[numberOfVariations].variationId = this.variationId;
                                this.currentVariation = {
                                    "variationId": this.variationId,
                                    "parentVariationId": variation.variationId,
                                    "moveNumber": this.moveNumber,
                                    "whiteMove": moveColor === COLOR.white,
                                    "variationIndex": numberOfVariations,
                                    "moves": variation.moves[moveNumberInVariation].whiteMoveVariations[numberOfVariations].moves
                                };
                                this.variations.set(this.currentVariation.variationId, this.currentVariation);
                                this.variationId++;
                            } else {

                            }

                        } else {
                            //adding white move to existing variation
                            //newMove.moveNumber = variation.moves.length + 1;
                            variation.moves[variation.moves.length] = newMove;
                        }
                    }
                } else {

                    this.annotatedMoves[this.moveNumber] = newMove;

                }

                movecomplete = false;
            } else {

                //annotating black move
                if (this.currentVariation || this.annotatedMoves[this.moveNumber].blackMove !== "") {
                    if (!this.currentVariation) {

                        let variations = this.annotatedMoves[this.moveNumber].blackMoveVariations;

                        let numberOfVariations = variations ? variations.length : 0;
                        let newVariationNeedsToBeCreated = true;

                        if (numberOfVariations === 0 && this.annotatedMoves[this.moveNumber].blackMove === moveNotation) {
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
                              console.log( this.printSquares( this.annotatedMoves[0].chessboardAfterWhiteMove));
                              console.log( this.printSquares( this.annotatedMoves[0].chessboardAfterBlackMove)); */
                            //new variation with a black starting move created
                            this.annotatedMoves[this.moveNumber].blackMoveVariations[numberOfVariations] = { moves: [] };
                            let newMove = this.addNewAnnotatedMove(moveNotation, moveColor, fenAfterMove);
                            this.annotatedMoves[this.moveNumber].blackMoveVariations[numberOfVariations].moves[0] = newMove;
                            this.annotatedMoves[this.moveNumber].blackMoveVariations[numberOfVariations].variationId = this.variationId;
                            this.currentVariation = {
                                "variationId": this.variationId,
                                "moveNumber": this.moveNumber,
                                "whiteMove": moveColor === COLOR.white,
                                "variationIndex": numberOfVariations,
                                "moves": this.annotatedMoves[this.moveNumber].blackMoveVariations[numberOfVariations].moves
                            };
                            this.variations.set(this.currentVariation.variationId, this.currentVariation);
                            this.variationId++;

                            /*        console.log("Creating new variation: "+ this.variationId + " with the black starting move "+newMove.blackMove);
                                   console.log( this.printSquares(newMove.chessboardAfterBlackMove));
                                   console.log("Chessboard in the mainline end:");
           
                                   console.log( this.printSquares( this.annotatedMoves[0].chessboardAfterWhiteMove));
                                   console.log( this.printSquares( this.annotatedMoves[0].chessboardAfterBlackMove)); */
                        }
                    } else {
                        //adding black move to an existing variation
                        let variation = this.variations.get(this.currentVariation.variationId);
                        let newVariationNeedsToBeCreated = true;
                        let moveNumberInVariation = this.moveNumber - variation.moveNumber;

                        if (variation.moves[moveNumberInVariation].blackMove !== "") {

                            let variations = variation.moves[moveNumberInVariation].blackMoveVariations;
                            let numberOfVariations = variations ? variations.length : 0;

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
                                variation.moves[moveNumberInVariation].blackMoveVariations[numberOfVariations].moves[0] = this.addNewAnnotatedMove(moveNotation, moveColor, fenAfterMove);
                                variation.moves[moveNumberInVariation].blackMoveVariations[numberOfVariations].variationId = this.variationId;
                                this.currentVariation = {
                                    "variationId": this.variationId,
                                    "parentVariationId": variation.variationId,
                                    "moveNumber": this.moveNumber,
                                    "whiteMove": moveColor === COLOR.white,
                                    "variationIndex": numberOfVariations,
                                    "moves": variation.moves[moveNumberInVariation].blackMoveVariations[numberOfVariations].moves
                                };
                                this.variations.set(this.currentVariation.variationId, this.currentVariation);
                                this.variationId++;
                            }
                        } else {
                            /*  console.log("Position before adding black move to existing variation:");
                             if( this.annotatedMoves.length > 0 && typeof  this.annotatedMoves[0].chessboardAfterWhiteMove !== 'undefined' ){
                                 this.printSquares( this.annotatedMoves[0].chessboardAfterWhiteMove);}
                             if( this.annotatedMoves.length > 0 && typeof  this.annotatedMoves[0].chessboardAfterBlackMove !== 'undefined' &&  this.annotatedMoves[0].chessboardAfterBlackMove.length!==0){
                                 this.printSquares( this.annotatedMoves[0].chessboardAfterBlackMove);} */

                            variation.moves[variation.moves.length - 1].blackMove = moveNotation;
                            /*    variation.moves[variation.moves.length - 1].blackMoveStartSquare = startSquare;
                               variation.moves[variation.moves.length - 1].blackMoveEndSquare = endSquare; */
                            variation.moves[variation.moves.length - 1].chessboardAfterBlackMove = fenAfterMove;
                            //variation.moves[variation.moves.length - 1].chessboardAfterBlackMove = currentchessboard;

                            /*    console.log("Position after adding black move to existing variation:");
                               if( this.annotatedMoves.length > 0 && typeof  this.annotatedMoves[0].chessboardAfterWhiteMove !== 'undefined' ){
                                   this.printSquares( this.annotatedMoves[0].chessboardAfterWhiteMove);}
                               if( this.annotatedMoves.length > 0 && typeof  this.annotatedMoves[0].chessboardAfterBlackMove !== 'undefined' &&  this.annotatedMoves[0].chessboardAfterBlackMove.length!==0){
                                   this.printSquares( this.annotatedMoves[0].chessboardAfterBlackMove);} */
                        }
                    }

                } else {

                    this.annotatedMoves[this.moveNumber].blackMove = moveNotation;
                    /*     this.annotatedMoves[this.moveNumber].blackMoveStartSquare = startSquare;
                        this.annotatedMoves[this.moveNumber].blackMoveEndSquare = endSquare; */
                    this.annotatedMoves[this.moveNumber].chessboardAfterBlackMove = fenAfterMove;
                    // this.annotatedMoves[ this.moveNumber].chessboardAfterBlackMove = currentchessboard;

                    /* console.log("Position after new mainline black move:");
                    this.printSquares( this.annotatedMoves[0].chessboardAfterWhiteMove);
                    this.printSquares( this.annotatedMoves[0].chessboardAfterBlackMove); */
                }
                movecomplete = true;

            }
        }
        if (moveColor === COLOR.black) {
            this.moveNumber += 1;
        }
        this.highlightLastMoveInNotation(moveColor);

        this.gameService.emitAnnotatedMoves(this.annotatedMoves);

        return moveNotation;
    }

    highlightLastMoveInNotation(moveColor) {
        this.moveToHighlight.variationId = this.currentVariation ? this.currentVariation.variationId : this.MAIN_LINE;
        this.moveToHighlight.moveNumber = moveColor === COLOR.white ? this.moveNumber : this.moveNumber - 1;
        this.moveToHighlight.whiteMove = moveColor === COLOR.white;
    }

    addNewAnnotatedMove(moveNotation, moveColor, fenAfterMove) {
        let newAnnotatedMove = { whiteMove: null, blackMove: null, whiteMoveStartSquare: null, whiteMoveEndSquare: null, blackMoveStartSquare: null, blackMoveEndSquare: null, whiteMoveVariations: [], blackMoveVariations: [], moveNumber: null, chessboardAfterWhiteMove: null, chessboardAfterBlackMove: null };
        newAnnotatedMove.whiteMove = moveColor === COLOR.white ? moveNotation : "";
        newAnnotatedMove.blackMove = moveColor === COLOR.white ? "" : moveNotation;
        newAnnotatedMove.whiteMoveVariations = [];
        newAnnotatedMove.blackMoveVariations = [];
        newAnnotatedMove.moveNumber = this.moveNumber + 1;
        newAnnotatedMove.chessboardAfterWhiteMove = moveColor === COLOR.white ? fenAfterMove : "";
        newAnnotatedMove.chessboardAfterBlackMove = moveColor === COLOR.white ? "" : fenAfterMove;
        return newAnnotatedMove;
    }

    setupVariation(data) {
        this.gameService.emitGamePosition({ gameId: this.gameId, positionAsFEN: data.fen, variationId: data.variationId });
    }

    getAllMoveAlternatives(move, color) {
        let alternativemoves = []


        if (color === COLOR.white) {

            let mainMove = {};

            mainMove['moveNotation'] = move.moveNumber + ". " + move.whiteMove;
            mainMove['fen'] = move.chessboardAfterWhiteMove;
            mainMove['variation'] = this.currentVariation ? this.currentVariation.variationId : this.MAIN_LINE;
            alternativemoves[0] = mainMove;
            if (move.whiteMoveVariations) {
                for (let i = 0; i < move.whiteMoveVariations.length; i++) {
                    let alternativemove = {};
                    let firstmoveOfVariation = move.whiteMoveVariations[i].moves[0];
                    alternativemove['moveNotation'] = firstmoveOfVariation.moveNumber + ". " + firstmoveOfVariation.whiteMove;
                    alternativemove['fen'] = firstmoveOfVariation.chessboardAfterWhiteMove;
                    alternativemove['variation'] = move.whiteMoveVariations[i].variationId;
                    alternativemoves[i + 1] = alternativemove;
                }
            }
        }
        else {
            if (move.blackMoveVariations) {
                let mainMove = {};
                mainMove['moveNotation'] = move.moveNumber + "... " + move.blackMove;
                mainMove['fen'] = move.chessboardAfterBlackMove;
                mainMove['variation'] = this.currentVariation ? this.currentVariation.variationId : this.MAIN_LINE;
                alternativemoves[0] = mainMove;
                for (let i = 0; i < move.blackMoveVariations.length; i++) {
                    let alternativemove = {};
                    let firstmoveOfVariation = move.blackMoveVariations[i].moves[0];
                    alternativemove['moveNotation'] = firstmoveOfVariation.moveNumber + "... " + firstmoveOfVariation.blackMove;
                    alternativemove['fen'] = firstmoveOfVariation.chessboardAfterBlackMove;
                    alternativemove['variation'] = move.blackMoveVariations[i].variationId;
                    alternativemoves[i + 1] = alternativemove;
                }
            }
        }

        return alternativemoves;
    }

    goToNextMove() {
        let move;

        if (!this.currentVariation) {
            move = this.annotatedMoves[this.moveNumber];
            if (this.moveToHighlight.whiteMove && move.blackMove !== "") {
                let moveAlternatives = this.getAllMoveAlternatives(move, COLOR.black);
                if (moveAlternatives.length > 1) {
                    this.alternativeMoves = moveAlternatives;
                    this.gameService.emitGameAction({ gameId: this.gameId, action: "showAlternativeMoves", gamedata: this.alternativeMoves });
                } else {
                    this.gameService.emitGamePosition({ gameId: this.gameId, positionAsFEN: move.chessboardAfterBlackMove, variationId: this.currentVariation });
                    this.highlightLastMoveInNotation(COLOR.black);
                }
            }
            else if (!this.moveToHighlight.whiteMove && this.annotatedMoves.length > this.moveNumber) {
                let moveAlternatives = this.getAllMoveAlternatives(move, COLOR.white);
                if (moveAlternatives.length > 1) {
                    this.alternativeMoves = moveAlternatives;
                    this.gameService.emitGameAction({ gameId: this.gameId, action: "showAlternativeMoves", gamedata: this.alternativeMoves });
                } else {
                    this.gameService.emitGamePosition({ gameId: this.gameId, positionAsFEN: move.chessboardAfterWhiteMove, variationId: this.currentVariation });
                    this.highlightLastMoveInNotation(COLOR.white);
                }
            }
        } else {
            move = this.currentVariation.moves[this.moveNumber - this.currentVariation.moveNumber];
            let variationId = this.currentVariation.variationId;
            if (this.moveToHighlight.whiteMove && move.blackMove !== "") {
                let moveAlternatives = this.getAllMoveAlternatives(move, COLOR.black);
                if (moveAlternatives.length > 1) {
                    this.alternativeMoves = moveAlternatives;
                    this.gameService.emitGameAction({ gameId: this.gameId, action: "showAlternativeMoves", gamedata: this.alternativeMoves });
               
                } else {
                    this.gameService.emitGamePosition({ gameId: this.gameId, positionAsFEN: move.chessboardAfterBlackMove, variationId });
                    this.highlightLastMoveInNotation(COLOR.black);
                }
            } else if (!this.moveToHighlight.whiteMove && this.currentVariation.moves.length > this.moveNumber) {
                let moveAlternatives = this.getAllMoveAlternatives(move, COLOR.black);
                if (moveAlternatives.length > 1) {
                    this.alternativeMoves = moveAlternatives;
                    this.gameService.emitGameAction({ gameId: this.gameId, action: "showAlternativeMoves", gamedata: this.alternativeMoves });
                } else {
                    this.gameService.emitGamePosition({ gameId: this.gameId, positionAsFEN: move.chessboardAfterWhiteMove, variationId });
                    this.highlightLastMoveInNotation(COLOR.white);
                }
            }
        }
    }

    goToPreviousMove() {
        let move;
        if (!this.currentVariation) {
            move = this.annotatedMoves[this.moveNumber - 1];
            if (this.moveToHighlight.whiteMove && this.moveNumber - 1 >= 0) {
                this.gameService.emitGamePosition({ gameId: this.gameId, positionAsFEN: move.chessboardAfterBlackMove, variationId: "-1" });
                this.highlightLastMoveInNotation(COLOR.black);
            } else if (!this.moveToHighlight.whiteMove) {
                this.gameService.emitGamePosition({ gameId: this.gameId, positionAsFEN: move.chessboardAfterWhiteMove, variationId: "-1" })
                this.highlightLastMoveInNotation(COLOR.white);
            }
        } else {
            move = this.currentVariation.moves[this.moveNumber - this.currentVariation.moveNumber - 1];
            let variationId = this.currentVariation.variationId;
            if (this.moveToHighlight.whiteMove && this.moveNumber - 1 >= 0) {
                this.gameService.emitGamePosition({ gameId: this.gameId, positionAsFEN: move.chessboardAfterBlackMove, variationId: this.currentVariation.variationId });
                this.highlightLastMoveInNotation(COLOR.black);
            } else if (!this.moveToHighlight.whiteMove) {
                this.gameService.emitGamePosition({ gameId: this.gameId, positionAsFEN: move.chessboardAfterWhiteMove, variationId: this.currentVariation.variationId });
                this.highlightLastMoveInNotation(COLOR.white);
            }
        }
    }


    moveNotEmptyFilter(move) {
        return move.whiteMove !== '' || move.blackMove !== '';
    };



    goToFirstMove() {
        let move = this.annotatedMoves.filter(this.moveNotEmptyFilter)[0];
        this.gameService.emitGamePosition({ gameId: this.gameId, positionAsFEN: move.chessboardAfterWhiteMove, variationId: this.currentVariation ? this.currentVariation.variationId : -1 });
        this.highlightLastMoveInNotation(COLOR.white);
    }

    goToLastMove() {
        let lastMoveNumber = this.annotatedMoves.length - 1;
        let move = this.annotatedMoves[lastMoveNumber];
        if (move.blackMove !== "") {
            this.gameService.emitGamePosition({ gameId: this.gameId, positionAsFEN: move.chessboardAfterBlackMove, variationId: this.currentVariation ? this.currentVariation.variationId : -1 });
            this.highlightLastMoveInNotation(COLOR.black);
        } else {
            this.gameService.emitGamePosition({ gameId: this.gameId, positionAsFEN: move.chessboardAfterWhiteMove, variationId: this.currentVariation ? this.currentVariation.variationId : -1 });
            this.highlightLastMoveInNotation(COLOR.white);
        }
    }

    @HostListener('document:keydown', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {

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
