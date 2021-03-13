
import { GameService } from './game.service';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface EngineOutput {
  engineReady: boolean;
  engineLoaded: boolean;
  search: string;
  line: string
  score: string;
}

@Injectable({
  providedIn: 'root'
})
export class StockfishService {

  stockfish: any;
  engineOutput: EngineOutput;

  chessRules = require("../../js/chessRules.js");
  game: any;
  positionFen: string;


  engineOutputObserver = new Subject<EngineOutput>();
  public engineOutputSubscriber = this.engineOutputObserver.asObservable();

  constructor(private gameService: GameService) {

    this.engineOutput = { engineReady: false, engineLoaded: false, line: null, search: null, score: "0.00" }
    

  }

  initializeEngine() {
    
    this.stockfish = new Worker("./assets/stockfish.js");
    this.stockfish.onmessage = (event) => {
      this.handleEngineEvent(event);
    };
    this.stockfish.postMessage("isready");
    if (!this.game) {
      this.game = new this.chessRules();
    }
  }


  private handleEngineEvent(event: any) {
    let line;

    if (event && typeof event === "object") {
      line = event.data;
    } else {
      line = event;
    }
    console.log("Reply: " + line);
    if (line == 'uciok') {
      this.engineOutput.engineLoaded = true;
    } else if (line == 'readyok') {
      this.engineOutput.engineReady = true;
    } else {
      // var match = line.match(/^bestmove ([a-h][1-8])([a-h][1-8])([qrbn])?/);
      // /// Did the AI move?
      // if(match) {
      //     isEngineRunning = false;
      //     game.move({from: match[1], to: match[2], promotion: match[3]});
      //     prepareMove();
      //     uciCmd("eval", evaler)
      //     evaluation_el.textContent = "";
      //     //uciCmd("eval");
      // /// Is it sending feedback?
      // } else 
      var match = line.match(/^info .*\bdepth (\d+) .*\bnps (\d+)/);
      if (match) {
        this.engineOutput.search = 'Depth: ' + match[1] + ' Nps: ' + match[2];
      }



      //sample line
      //Reply: info depth 21 seldepth 29 multipv 1 score cp -26 nodes 4021941 nps 53097 time 75747 pv e7e5 g1f3 b8c6 f1b5 a7a6 b5c6 d7c6 b1c3 c8g4 h2h3 g4f3 d1f3 g8f6 d2d3 f8b4 e1g1 e8g8 c1g5 f8e8 g5f6 d8f6 f3f6 g7f6 f2f3

      /// Is it sending feed back with a score?
      if (match = line.match(/^info .*\bscore (\w+) (-?\d+) .*pv (.+)/)) {
        var score = parseInt(match[2]);
        /// Is it measuring in centipawns?
        if (match[1] == 'cp') {
          this.engineOutput.score = (score / 100.0).toFixed(2);
          /// Did it find a mate?
        } else if (match[1] == 'mate') {
          this.engineOutput.score = 'Mate in ' + Math.abs(score);
        }

        this.engineOutput.line = this.convertVariationToSAN(match[3]);

        // /// Is the score bounded?
        // if(match = line.match(/\b(upper|lower)bound\b/)) {
        //     engineOutput.score = ((match[1] == 'upper') == (game.turn() == 'w') ? '<= ' : '>= ') + engineOutput.score
        // }
      }
    }
    this.gameService.emitEngineOutput(this.engineOutput);
  }

  convertVariationToSAN(variation: string) {
    this.game.reset();
    let moveNumber = 1;
    if (this.positionFen) {
      this.game.load(this.positionFen);
      moveNumber = +this.positionFen.split(" ")[5];
    }
    let movesInVariation = variation.split(" ");
    let variationWithSAN = "";
    for (let index = 0; index < movesInVariation.length; index++) {
      const move = { from: movesInVariation[index].substr(0, 2), to: movesInVariation[index].substr(2, 4), promotion: movesInVariation[index].length > 4 ? movesInVariation[index].substr(4) : null };
      const validMove = this.game.move(move);
      if (validMove) {
        if (validMove.color === "w") {
          variationWithSAN += `${moveNumber}. ${validMove.san} `
        } else {
          if (index == 0) {
            variationWithSAN += `${moveNumber}... ${validMove.san} `
          } else {
            variationWithSAN += `${validMove.san} `
          }
          moveNumber += 1;
        }
      } else {
        console.error("InvalidMove "+ movesInVariation[index]);
      }


    }
    return variationWithSAN;
  }

  startPositionAnalysis(fen) {
    if(!this.stockfish){
      this.initializeEngine();
    }
if(fen==='startpos'){
  fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
}
    this.positionFen = fen;
    this.stockfish.postMessage("ucinewgame");
  
    this.stockfish.postMessage(`position fen ${fen}`);
    this.stockfish.postMessage("go depth 15");

  }

  stopPositionAnalysis() {

    this.stockfish.postMessage("stop");
  }

  stopEngine(resetGame:boolean){
    this.stockfish.postMessage("stop");
    this.stockfish.postMessage("quit");
    if(resetGame){
      this.game = new this.chessRules();
    }
  }





}
