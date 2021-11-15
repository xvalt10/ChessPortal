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
import {Article} from "../news/news.component";

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
    articles: Article[];

    constructor(private httpService: HttpService, private authService: JwtAuthenticationService, private router: Router, private http: HttpClient, private gameService: GameService, private webSocketService: WebSocketService) { }
    ngOnDestroy(): void {

    }



    routerOnHomePage() {
        return this.router.url === "/";
    }

    ngOnInit() {
        //this.initialiseWebSockets();
        this.httpService.getArticlesByCategory("two").subscribe((articles:Article[])=>{
            this.articles = articles.slice(articles.length-3);
        })

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

    setTopPlayers(timecontrol:string) {
        this.httpService.getTopPlayers(timecontrol).subscribe((data:[]) => {
            const eloparam = 'elo'+timecontrol.toLowerCase();
            console.log(data);
            this.bestPlayers[timecontrol] = data.sort((player1:any, player2:any)=> player1[eloparam] < player2[eloparam] ? 1 : player1[eloparam] > player2[eloparam] ? -1 : 0);
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