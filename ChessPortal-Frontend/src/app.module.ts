
import { NewGameDialogComponent } from './js/components/new-game-dialog/new-game-dialog.component';
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
import {NewsComponent} from "./views/news/news.component";
import { ChessboardAndClockComponent } from './js/components/chessboard-and-clock/chessboard-and-clock.component';
import { AnnotatedMovesComponent } from './js/components/annotated-moves/annotated-moves.component';
import { ChessClockComponent } from './js/components/chess-clock/chess-clock.component';
import { PositionSetupComponent } from './js/components/position-setup/position-setup.component';
import { UserProfileComponent } from './views/user-profile/user-profile.component';
import { RatingChartComponent } from './js/components/rating-chart/rating-chart.component';
import { TournamentSummaryComponent } from './views/tournament-summary/tournament-summary.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule } from  '@angular/material/sidenav';
import { MatListModule} from  '@angular/material/list';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { NgxMatDatetimePickerModule, NgxMatTimepickerModule,  } from '@angular-material-components/datetime-picker';
import { NgxMatMomentModule } from '@angular-material-components/moment-adapter';
import { MatInputModule } from '@angular/material/input';
import {MatDialogModule} from "@angular/material/dialog";
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSlider, MatSliderModule} from '@angular/material/slider';
import {MatCardModule} from '@angular/material/card';
import {MatTableModule} from '@angular/material/table';

import {MatCkeditorModule, MatContenteditableModule} from 'mat-contenteditable';
import {CKEditorModule} from "@ckeditor/ckeditor5-angular";
import {MatButtonModule} from "@angular/material/button";
import {MatSelectModule} from "@angular/material/select";


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
    { path: 'news', component: NewsComponent},
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
    imports: [
        CKEditorModule,
        MatContenteditableModule,
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
        MatSidenavModule,
        MatListModule,
        NgxMatTimepickerModule,
        NgxMatDatetimePickerModule,
        MatFormFieldModule,
        MatDatepickerModule,
        NgxMatMomentModule,
        MatInputModule,
        MatDialogModule,
        MatSliderModule,
        MatPaginatorModule,
        MatCardModule,
        MatTableModule,
        CKEditorModule,
        MatCkeditorModule,
        MatButtonModule,
        MatSelectModule,
        /*  JwtModule.forRoot({
           config: {
             tokenGetter: tokenGetter,
             //whitelistedDomains: ["localhost:8082"],
            // blacklistedRoutes: ["example.com/examplebadroute/"]
           }
         }) */

    ],
  providers: [AuthGuard, JwtAuthenticationService, FormBuilder, {provide:HTTP_INTERCEPTORS,useClass : AuthInterceptor, multi: true}],
  declarations: [ HomePageComponent, PlayingHall, MoveVariationTreeComponent, LobbyComponent, LoginComponent, RegistrationComponent, TournamentLobbyComponent, WatchGamesComponent, ChessboardAndClockComponent, AnnotatedMovesComponent, ChessClockComponent, PositionSetupComponent, UserProfileComponent, RatingChartComponent, TournamentSummaryComponent, NewGameDialogComponent, NewsComponent ],
  exports:      [ HomePageComponent],
  entryComponents:[NewGameDialogComponent],
  bootstrap:    [ HomePageComponent ] 
})
export class AppModule { 

}