import { HttpModule } from '@angular/http';

import { ChartsModule } from 'ng2-charts';
import {  NgToggleModule  } from 'ng-toggle-button';
//import { MatSelectCountryModule } from '@angular-material-extensions/select-country'; 

import { JwtAuthenticationService } from './js/services/jwtAuthenticationService';
import { AuthGuard } from './js/services/auth.guard';
import { LoginComponent } from './views/login/login.component';
import { HomePageComponent } from './views/homepage/homepage';
import { PlayingHall } from './views/playingHall/playingHall';
import { NgModule }      from '@angular/core';
import { HttpClientModule, HttpClientXsrfModule, HTTP_INTERCEPTORS}   from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes} from '@angular/router';
import { MoveVariationTreeComponent } from './views/playingHall/subcomponents/moveVariationTree/move-variation-tree/move-variation-tree.component';
import { LobbyComponent } from './views/lobby/lobby.component';
import { JwtModule } from "@auth0/angular-jwt";
import { FormBuilder} from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthInterceptor } from './js/services/auth.interceptor';
import { RegistrationComponent } from './views/registration/registration.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TournamentLobbyComponent } from './views/tournament-lobby/tournament-lobby.component';
import { WatchGamesComponent } from './views/watch-games/watch-games.component';
import { ChessboardAndClockComponent } from './js/components/chessboard-and-clock/chessboard-and-clock.component';
import { AnnotatedMovesComponent } from './js/components/annotated-moves/annotated-moves.component';
import { ChessClockComponent } from './js/components/chess-clock/chess-clock.component';
import { PositionSetupComponent } from './js/components/position-setup/position-setup.component';
import { UserProfileComponent } from './views/user-profile/user-profile.component';
import { RatingChartComponent } from './js/components/rating-chart/rating-chart.component';
import { TournamentSummaryComponent } from './views/tournament-summary/tournament-summary.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const appRoutes: Routes = [
    { path: 'analyzeGame', component: PlayingHall, canActivate: [AuthGuard]},
    { path: 'game/:gameId/:action', component: PlayingHall, canActivate: [AuthGuard]},  
    { path: 'tournaments', component: TournamentSummaryComponent, canActivate: [AuthGuard]},
    { path: 'tournaments/:tournamentId', component: TournamentLobbyComponent, canActivate: [AuthGuard]},
    { path: 'tournamentgame/:tournamentId/:gameId/:action', component: PlayingHall, canActivate: [AuthGuard]},
    //{ path: 'observeGame/:gameId', component: PlayingHall, canActivate: [AuthGuard]},
    { path: 'register', component: RegistrationComponent},
    { path: 'watchGames', component: WatchGamesComponent},
    { path: 'login', component: LoginComponent},
    { path: 'lobby', component: LobbyComponent, canActivate: [AuthGuard]},

    { path: 'userprofile', component: UserProfileComponent},
    { path: '*', redirectTo:'index.html'} 
  ];

export function tokenGetter(){
  
  let user:any = localStorage.getItem('currentUser');
  console.log(user);
  console.log("calling tokenGetter:"+user.jwtToken);
  return user.jwtToken;
}

@NgModule({
  imports:      [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule, 
    FlexLayoutModule,
    /* HttpModule, */
    HttpClientModule,
ChartsModule,
NgToggleModule,
//MatSelectCountryModule.forRoot('en'),

  /*   HttpClientXsrfModule.withOptions({
      cookieName: 'XSRF-TOKEN',
      headerName: 'X-XSRF-TOKEN'
    }), */
    RouterModule.forRoot(appRoutes),
BrowserAnimationsModule, 
   /*  JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        //whitelistedDomains: ["localhost:8082"],
       // blacklistedRoutes: ["example.com/examplebadroute/"]
      }
    }) */

],
  providers: [AuthGuard, JwtAuthenticationService, FormBuilder, {provide:HTTP_INTERCEPTORS,useClass : AuthInterceptor, multi: true}],
  declarations: [ HomePageComponent, PlayingHall, MoveVariationTreeComponent, LobbyComponent, LoginComponent, RegistrationComponent, TournamentLobbyComponent, WatchGamesComponent, ChessboardAndClockComponent, AnnotatedMovesComponent, ChessClockComponent, PositionSetupComponent, UserProfileComponent, RatingChartComponent, TournamentSummaryComponent ],
  exports:      [ HomePageComponent ],
  bootstrap:    [ HomePageComponent ] 
})
export class AppModule { 

}