import { HttpService } from './../../services/http-service.service';
import { JwtAuthenticationService } from './../../services/jwtAuthenticationService';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  games:any;
  showUserStatistics:boolean;
  showGameHistory:boolean;

  constructor(private httpService:HttpService, private authenticationService: JwtAuthenticationService) {
    
   }

  ngOnInit(): void {
    let username = this.authenticationService.getUsername();
    this.httpService.getGamesByPlayer(username).subscribe(data => {       
      this.games = data;
      console.log(this.games);
      this.games.games.forEach(game => {
        game.annotatedMoves = JSON.parse(game.movesJson);
      });
      this.showUserStatistics = true
      console.log(this.games);
    });

  }

  clickGameHistory(){
    this.showGameHistory = true;
    this.showUserStatistics = false;
  }

  clickUserStatistics(){
    this.showGameHistory = false;
    this.showUserStatistics = true;
  }

}
