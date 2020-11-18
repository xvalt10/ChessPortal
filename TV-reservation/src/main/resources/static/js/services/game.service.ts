import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

interface PlayedMove{
  gameId:string;
  moveNotation: string;
  moveColor: string;
  fen:string;
  gameResult:string;
  sendMoveToOponent:boolean;
}

interface GamePosition{
  gameId:string;
  positionAsFEN:string;
  variationId:string;
}

interface ClockEvent{
  color:string;
  time:number;
}

interface GameData{
  whitePlayer:any;
  blackPlayer:any;
  time:number;
  increment:number;
  gameId:string;
  annotatedMoves:any;
}

interface GameAction{
  gameId:string;
  action:string;
  gamedata:any;
}

interface GameResult{
  gameId:string;
  tournamentId:any;
  gameResult:string;
  whitePlayerElo:number;
  whitePlayerEloChange:number;
  blackPlayerElo:number;
  blackPlayerEloChange:number;
  annotatedMoves:any[];
}

@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor() { }

  gamePositionObserver = new Subject<GamePosition>();
  public gamePositionSubscriber = this.gamePositionObserver.asObservable();

  moveObserver = new Subject<PlayedMove>();
  public moveSubscriber = this.moveObserver.asObservable();

  gameDataObserver = new Subject<GameData>();
  public gameDataSubscriber = this.gameDataObserver.asObservable();

  gameResultObserver = new Subject<GameResult>();
  public gameResultSubscriber = this.gameResultObserver.asObservable();

  gameActionObserver = new Subject<GameAction>();
  public gameActionSubscriber = this.gameActionObserver.asObservable();

  clockEventObserver = new Subject<ClockEvent>();
  public clockEventSubscriber = this.clockEventObserver.asObservable();

  annotatedMovesObserver = new Subject<any[]>();
  public annotatedMovesSubscriber = this.annotatedMovesObserver.asObservable();


  emitPlayedMove(data:PlayedMove) {
    this.moveObserver.next(data);
  }

  emitAnnotatedMoves(data:any[]){
    this.annotatedMovesObserver.next(data);
  }

  emitClockEvent(data:ClockEvent){
    this.clockEventObserver.next(data);
  }

  emitGamePosition(data:GamePosition){
    this.gamePositionObserver.next(data);
  }

  emitGameResult(data:GameResult){
    this.gameResultObserver.next(data);
  }

  emitGameData(data:GameData){
    this.gameDataObserver.next(data);
  }

  emitGameAction(data:GameAction){
    this.gameActionObserver.next(data);
  }

  getPlayerEloByGameTimeType(gameTimeType, player) {
    switch (gameTimeType) {
        case "BLITZ": return player.eloblitz;
        case "BULLET": return player.elobullet;
        case "RAPID": return player.elorapid;
        case "CLASSICAL": return player.eloclassical;
    }

    
}
}
