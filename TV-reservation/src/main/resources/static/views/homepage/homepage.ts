import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { JwtAuthenticationService } from './../../js/services/jwtAuthenticationService';
import { Component, OnInit } from '@angular/core';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs'
import { BASEURL } from '../../js/constants.js'

@Component({
    selector: 'homepage',
    templateUrl: 'homepage.html'
})

export class HomePageComponent implements OnInit {

    navbarCollapsed: boolean = true;
    user: string;
    bestPlayersBlitz: any = [];
    bestPlayersBullet: any = [];
    bestPlayersRapid: any = [];
    bestPlayersClassical: any = [];

    constructor(private authService: JwtAuthenticationService, private router: Router, private http: HttpClient) { }

    getTopPlayers(gameTimetype: string) {
        let apiURL = `${BASEURL}/users/top/${gameTimetype}`;
        return this.http.get(apiURL)
            .pipe(catchError(this.handleError))
    }

    routerOnHomePage() {
        return this.router.url === "/";
    }

    handleError(error: HttpErrorResponse) {
        let msg = '';
        if (error.error instanceof ErrorEvent) {
            // client-side error
            msg = error.error.message;
        } else {
            // server-side error
            if (error.error) {
                msg = `Error Code: ${error.status}\nMessage: ${error.error.message}`;
            } else {
                msg = `Error Code: ${error.status}\nMessage: ${error.message}`;
            }
            /*             console.log(msg);
                        console.log(error); */
        }
        return throwError(msg);
    }


    ngOnInit() {
        this.user = this.authService.authenticatedUser.username;
        if (!this.user && localStorage.getItem('currentUser')) {
            this.user = JSON.parse(localStorage.getItem('currentUser')).username;
        }

        this.getTopPlayers('blitz').subscribe(data => {
            console.log(data);
            this.bestPlayersBlitz = data;
        }, error => {
            console.log(error);
        });

        this.getTopPlayers('bullet').subscribe(data => {
            console.log(data);
            this.bestPlayersBullet = data;
        }, error => {
            console.log(error);
        });

        this.getTopPlayers('rapid').subscribe(data => {
            console.log(data);
            this.bestPlayersRapid = data;
        }, error => {
            console.log(error);
        });
        this.getTopPlayers('classical').subscribe(data => {
            console.log(data);
            this.bestPlayersClassical = data;
        }, error => {
            console.log(error);
        });
    }

    userLoggedIn() {
        return this.authService.isUserAuthenticated();
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['login']);
    }

}