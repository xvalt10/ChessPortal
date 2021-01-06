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

    bestPlayers = { 'BLITZ': [], 'BULLET': [], 'RAPID': [], 'CLASSICAL': [] };
    topGames = { 'BLITZ': null, 'BULLET': null, 'RAPID': null, 'CLASSICAL': null }

    socket: WebSocket;
    topGamesInterval: any;

    constructor(private httpService: HttpService, private authService: JwtAuthenticationService, private router: Router, private http: HttpClient, private gameService: GameService, private webSocketService: WebSocketService) { }
    ngOnDestroy(): void {

    }



    routerOnHomePage() {
        return this.router.url === "/";
    }

    ngOnInit() {
        //this.initialiseWebSockets();
        this.user = this.authService.getUsername();

        this.gameService.gameResultSubscriber.subscribe(game => {
            let timecontrol = game.timecontrol;
            if (this.topGames[timecontrol] == game.gameId) {
                this.topGames[timecontrol] = null;

            }
        })

        this.gameService.gameActionSubscriber.subscribe(game => {
            for (let timecontrol of ['BULLET', 'BLITZ', 'RAPID', 'CLASSICAL']) {
                if (game.gameId === this.topGames[timecontrol] && (game.action === 'gameResult' || game.action === 'resign')) {
                    this.topGames[timecontrol] = null;
                }
            }
        })

        this.setTopPlayers('BULLET');
        this.setTopPlayers('BLITZ');
        this.setTopPlayers('RAPID');


        this.topGamesInterval = setInterval(() => { if(this.routerOnHomePage()){
            this.setTopGameId('BULLET');
            this.setTopGameId('BLITZ');
            this.setTopGameId('RAPID');}
        }, 1000);

    }

    setTopPlayers(timecontrol) {
        this.httpService.getTopPlayers(timecontrol).subscribe(data => {
            console.log(data);
            this.bestPlayers[timecontrol] = data;
        }, error => {
            console.log(error);
        });
    }

    setTopGameId(timecontrol) {
        if (!this.topGames[timecontrol]) {
            this.httpService.getTopGameId(timecontrol).subscribe(game => {
                if (this.routerOnHomePage()) {
                    if (game) {
                        console.log("Starting to observe gameId:" + game['gameId']);
                        this.topGames[timecontrol] = game['gameId'];
                    } else {
                        this.topGames[timecontrol] = null;
                    }
                }
            }, error => {
                console.log(error);
            });
        };
    }


    userLoggedIn() {
        return this.authService.isUserAuthenticated();
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['login']);
    }

}