import { Component, OnInit, Input } from '@angular/core';
import { COLOR, MARKER_TYPE } from "../../../js/components/cm-chessboard/Chessboard.js";
import { GameService } from '../../services/game.service';


@Component({
  selector: 'app-position-setup',
  templateUrl: './position-setup.component.html',
  styleUrls: ['./position-setup.component.css']
})
export class PositionSetupComponent implements OnInit {

  @Input()
  svgChessboard;

  //Position setup variables
  currentPositionFEN: string = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
  currentPositionValid: boolean = true;
  startingMovePositionSetup: number = 0;
  showPositionSetupDiv: boolean = false;
  
  activecolor: string = 'w';
  castlingAvailability: string = 'KQkq'
  enPassantTargetSquare: string = '-';
  halfMoveClock: number = 0;
  moveNumber = 0;
  annotatedMoves = [];
  positionAsFen:string;

  chessRules = require("../../../js/chessRules.js");
  chess;
  

  constructor(private gameService:GameService) { }

  ngOnInit(): void {
    this.chess = this.chessRules();
    this.gameService.gameActionObserver.subscribe(gameAction => {
        if(gameAction.action === "positionAfterSetup"){
            this.positionAsFen = gameAction.gamedata[0].position;
            this.buildFenAfterPositionSetup();
        }
    });
  }

  setupPosition() {
    this.showPositionSetupDiv = true;   
    this.gameService.emitGameAction({gameId: null,action:"startPositionSetup",gamedata:[]});
}

buildFenAfterPositionSetup() {
    this.currentPositionFEN = this.positionAsFen + ' ' + this.activecolor + ' ' + this.castlingAvailability + ' ' + this.enPassantTargetSquare
        + ' ' + this.halfMoveClock + ' ' + (this.activecolor === COLOR.white ? (+this.startingMovePositionSetup + 1) : this.startingMovePositionSetup === 0 ? 1 : this.startingMovePositionSetup);
}

emptyBoard() {
    this.gameService.emitGameAction({gameId: null,action:"emptyBoard",gamedata:[]});

}

setPieceToMarkedSquares(piece) {
    this.gameService.emitGameAction({gameId: null,action:"setPieceOnMarkedSquares",gamedata:[{piece:piece}]});
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
     

      this.gameService.emitGameAction({gameId: null,action:"finishPositionSetup",gamedata:[{position:this.currentPositionFEN, moveNumber:this.moveNumber}]});

  } else {
      this.currentPositionValid = false;
  }
  //this.svgChessboard.enableMoveInput(this.moveInputHandler, this.activecolor);

}


setupVariation($event) {
  //this.redrawChessboard($event.fen, $event.variationId);
}

}
