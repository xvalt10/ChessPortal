import { WebSocketService } from './../../js/services/websocketService';
import { GameService } from './../../js/services/game.service';

import { Router } from '@angular/router';
import { JwtAuthenticationService } from './../../js/services/jwtAuthenticationService';
import { HttpService } from './../../js/services/http-service.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs'
import { BASEURL } from '../../js/constants.js'
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'homepage',
    templateUrl: 'homepage.html'
})

export class HomePageComponent implements OnInit, OnDestroy {

    navbarCollapsed: boolean = true;
    user: string;
    bestPlayersBlitz: any = [];
    bestPlayersBullet: any = [];
    bestPlayersRapid: any = [];
    bestPlayersClassical: any = [];
    topBlitzGameId: any;
    socket: WebSocket;

    constructor(private httpService:HttpService,private authService: JwtAuthenticationService, private router: Router, private http: HttpClient, private gameService: GameService, private webSocketService: WebSocketService) { }
    ngOnDestroy(): void {
        throw new Error('Method not implemented.');
    }



    routerOnHomePage() {
        return this.router.url === "/";
    }




    ngOnInit() {
        //this.initialiseWebSockets();
        this.user = this.authService.getUsername();

        this.gameService.gameResultSubscriber.subscribe(game => {
            if (this.topBlitzGameId == game.gameId) {
                this.topBlitzGameId = null;
              
            }
        })

        this.gameService.gameActionSubscriber.subscribe(game =>{
            if(game.gameId === this.topBlitzGameId && (game.action === 'gameResult' || game.action === 'resign')){
                this.topBlitzGameId = null;
            }
        })

        this.httpService.getTopPlayers('blitz').subscribe(data => {
            console.log(data);
            this.bestPlayersBlitz = data;
        }, error => {
            console.log(error);
        });

        this.httpService.getTopPlayers('bullet').subscribe(data => {
            console.log(data);
            this.bestPlayersBullet = data;
        }, error => {
            console.log(error);
        });

        this.httpService.getTopPlayers('rapid').subscribe(data => {
            console.log(data);
            this.bestPlayersRapid = data;
        }, error => {
            console.log(error);
        });
        this.httpService.getTopPlayers('classical').subscribe(data => {
            console.log(data);
            this.bestPlayersClassical = data;
        }, error => {
            console.log(error);
        });

        // setInterval(() => {if(!this.topBlitzGameId){this.httpService.getTopGameId('blitz').subscribe(game => {
        //     if (game) {
        //         console.log("Starting to observe gameId:" + game['gameId']);
        //         this.topBlitzGameId = game['gameId'];
        //     }else{
        //         this.topBlitzGameId = null;
        //     }
        //   }, error => {
        //     console.log(error);
        //   });}}, 1000);

    }

   

    userLoggedIn() {
        return this.authService.isUserAuthenticated();
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['login']);
    }

}