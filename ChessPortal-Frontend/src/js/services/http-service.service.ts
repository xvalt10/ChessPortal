import { Injectable } from '@angular/core';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { BASEURL } from '../../js/constants.js'
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }

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

  getTopPlayers(gameTimetype: string) {
    let apiURL = `${BASEURL}/users/top/${gameTimetype}`;
    return this.http.get(apiURL)
      .pipe(catchError(this.handleError))
  }

  getTopGameId(gameTimetype) {
    let apiURL = `${BASEURL}/games/${gameTimetype}/topRated`;
    return this.http.get(apiURL)
      .pipe(catchError(this.handleError));
  }

  getGamesByPlayer(playerName: string) {
    let apiURL = `${BASEURL}/games/${playerName}`;
    return this.http.get(apiURL)
      .pipe(catchError(this.handleError))
  }

  getRatingHistoryByPlayerAndGameType(playerName: string, gameType: string) {
    let apiURL = `${BASEURL}/users/${playerName}/ratinghistory/${gameType}`;
    return this.http.get(apiURL)
      .pipe(catchError(this.handleError))
  };

  getNewJWTToken(oldtoken: string) {
    let apiURL = `${BASEURL}/extendtoken/${oldtoken}`;
    return this.http.get(apiURL)
      .pipe(catchError(this.handleError))
  }

  getTournamentsByState(state: string) {
    let apiURL = `${BASEURL}/tournaments/type/${state}`;
    return this.http.get(apiURL)
      .pipe(catchError(this.handleError))
  }

  scheduleTournament(tournamentparams: any) {
    let apiURL = `${BASEURL}/tournaments/schedule`;
    return this.http.post(apiURL, tournamentparams)
      .pipe(catchError(this.handleError));
  }

  scheduleSimul(tournamentparams: any) {
    let apiURL = `${BASEURL}/simuls/schedule`;
    return this.http.post(apiURL, tournamentparams)
        .pipe(catchError(this.handleError));
  }

  uploadFileToS3(playerName: string, file: File) {
    const uploadData = new FormData;
    uploadData.append('userImage', file, file.name)
    let apiURL = `${BASEURL}/users/${playerName}/uploadImage`;
    return this.http.post(apiURL, uploadData)
      .pipe(catchError(this.handleError));
  }

  getUserProfile(playerName:string){
    let apiURL = `${BASEURL}/users/${playerName}`;
    return this.http.get(apiURL).pipe(catchError(this.handleError));
  }

  updateUserProfile(playerName: string, email: string, countrycode: string) {
    let apiURL = `${BASEURL}/users/${playerName}/updateUserProfile`;
    return this.http.post(apiURL, { email, countrycode }).pipe(catchError(this.handleError));

  }
  getAllArticles(){
    let apiURL = `${BASEURL}/articles/`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.get(apiURL,httpOptions).pipe(catchError(this.handleError));
  }
  getArticlesByCategory(category:string){
    let apiURL = `${BASEURL}/articles/category/${category}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.get(apiURL,httpOptions).pipe(catchError(this.handleError));
  }

  getArticleById(id:number){
    let apiURL = `${BASEURL}/articles/${id}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.get(apiURL,httpOptions).pipe(catchError(this.handleError));

  }

  postArticle(article:string){
    let apiURL = `${BASEURL}/articles`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post(apiURL,article, httpOptions).pipe(catchError(this.handleError));
  }

}
