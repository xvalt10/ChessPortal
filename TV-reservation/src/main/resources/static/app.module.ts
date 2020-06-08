import { HttpModule } from '@angular/http';

import { JwtAuthenticationService } from './js/services/jwtAuthenticationService';
import { AuthGuard } from './js/services/auth.guard';
import { LoginComponent } from './views/login/login.component';
import { HomePageComponent } from 'views/homepage/homepage';
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
import { AuthInterceptor } from 'js/services/auth.interceptor';
import { RegistrationComponent } from './views/registration/registration.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TournamentLobbyComponent } from './views/tournament-lobby/tournament-lobby.component';

const appRoutes: Routes = [
    { path: 'analyzeGame', component: PlayingHall, canActivate: [AuthGuard]},
    { path: 'playGame/:gameId', component: PlayingHall, canActivate: [AuthGuard]},
    { path: 'observeGame/:observedPlayer', component: PlayingHall, canActivate: [AuthGuard]},
    { path: 'register', component: RegistrationComponent},
    { path: 'login', component: LoginComponent},
    { path: 'lobby', component: LobbyComponent, canActivate: [AuthGuard]},
    { path: 'tournament/:tournamentId', component: TournamentLobbyComponent, canActivate: [AuthGuard]},
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
  /*   HttpClientXsrfModule.withOptions({
      cookieName: 'XSRF-TOKEN',
      headerName: 'X-XSRF-TOKEN'
    }), */
    RouterModule.forRoot(appRoutes), 
   /*  JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        //whitelistedDomains: ["localhost:8082"],
       // blacklistedRoutes: ["example.com/examplebadroute/"]
      }
    }) */

],
  providers: [AuthGuard, JwtAuthenticationService, FormBuilder, {provide:HTTP_INTERCEPTORS,useClass : AuthInterceptor, multi: true}],
  declarations: [ HomePageComponent, PlayingHall, MoveVariationTreeComponent, LobbyComponent, LoginComponent, RegistrationComponent, TournamentLobbyComponent ],
  exports:      [ HomePageComponent ],
  bootstrap:    [ HomePageComponent ] 
})
export class AppModule { }