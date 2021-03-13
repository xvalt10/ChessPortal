import { Component, OnInit } from '@angular/core';
import { HttpService } from './../../js/services/http-service.service';
import { GameService } from './../../js/services/game.service';
@Component({
  selector: 'app-watch-games',
  templateUrl: './watch-games.component.html',
  styleUrls: ['./watch-games.component.css']
})
export class WatchGamesComponent implements OnInit {

  constructor(private httpService:HttpService, private gameService:GameService) { 

  }
annotatedMoves =[];
  observedGameId:null;
  gameResultMessage:string;
  selectedTimeControl:string;

  ngOnInit(): void {
    this.selectedTimeControl = 'blitz';
    this.gameService.gameResultSubscriber.subscribe(game => {
      if (this.observedGameId == game.gameId) {
          this.gameResultMessage = game.gameResult;
          setTimeout(()=>{this.observedGameId = null;this.gameResultMessage = "";}, 5000);
          
        
      }
  })

  this.gameService.gameActionSubscriber.subscribe(game =>{
      if(game.gameId === this.observedGameId && (game.action === 'gameResult' || game.action === 'resign')){
        this.gameResultMessage = game.gamedata.gameResult;
        setTimeout(()=>{this.observedGameId = null;this.gameResultMessage = ""}, 5000);
      }
  })

    setInterval(() => {if(!this.observedGameId){this.observeGame(this.selectedTimeControl)}}, 1000);
  }

  observeGame(gameType){
    this.selectedTimeControl = gameType;
    this.httpService.getTopGameId(gameType).subscribe(game => {
      if (game) {
          console.log("Starting to observe gameId:" + game['gameId']);
          this.annotatedMoves =[];
          this.observedGameId = game['gameId'];
      }else{
        
          this.observedGameId = null;
      }
    }, error => {
      console.log(error);
    });}
  }




