import { HttpService } from './http-service.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs'
import { BASEURL } from '../constants.js'

@Injectable()
export class JwtAuthenticationService {

    public authenticatedUser = { username: null, jwtToken: null }
    tokenDecoder: JwtHelperService;

    constructor(private http: HttpClient, private httpService: HttpService) {
        this.tokenDecoder = new JwtHelperService();
    }

    authenticate(credentials: any) {
        return this.http.post<any>(`${BASEURL}/authenticate`, credentials, { observe: 'response' })
            .pipe(map(response => {
                console.log(response);
                let jwtToken = response.headers.get('Authorization');
                // let user = {};
                // login successful if there's a jwt token in the response
                if (jwtToken) {
                    this.authenticatedUser = { username: credentials.username, jwtToken: jwtToken }
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(this.authenticatedUser));
                }
                return this.authenticatedUser;
            }));
    }

    registerUser(username: string, password: string) {

        let apiURL = `${BASEURL}/register?username=${username}&password=${password}`;
        return this.http.post(apiURL, null)
            .pipe(catchError(this.handleError))

    }

    getJwtToken() {
        let authenticatedUser = this.getUsername();
        if (authenticatedUser) {
            return JSON.parse(localStorage.getItem('currentUser')).jwtToken.substring('Bearer '.length);
        } else {
            return null;
        }

    }

    getUsername() {
        if (!localStorage.getItem('currentUser')) {
            return null;
        } else {
            return JSON.parse(localStorage.getItem('currentUser')).username;
        }
    }

    renewTokenIfNecessary(token) {
        let tokenExpirationDate: Date = this.tokenDecoder.getTokenExpirationDate(token);
        let secondsTillTokenExpiration = (tokenExpirationDate.getDate() - new Date().getTime()) / 1000;
        if (secondsTillTokenExpiration < 60 * 60 * 24) {
            this.httpService.getNewJWTToken(token).subscribe(newtoken => {
                if (newtoken) {
                    JSON.parse(localStorage.getItem('currentUser')).jwtToken = `Bearer:${newtoken}`;
                }
            });
        }

    }

    isUserAuthenticated() {
        let user: string = localStorage.getItem('currentUser');
        if (user) {
            let token = this.getJwtToken();

            if (!this.tokenDecoder.isTokenExpired(token)) {

                return true;
            } else {
                this.authenticatedUser = null;
                localStorage.removeItem('currentUser');
            }
        }
        return false;
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        this.authenticatedUser = null;
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
}