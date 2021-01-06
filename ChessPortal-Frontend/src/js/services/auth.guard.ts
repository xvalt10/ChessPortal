import { JwtAuthenticationService } from './jwtAuthenticationService';
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable()
export class AuthGuard implements CanActivate {

    private tokenDecoder: JwtHelperService;
    private authService: JwtAuthenticationService;

    constructor(private router: Router, authService : JwtAuthenticationService) { 
        this.tokenDecoder = new JwtHelperService();
        this.authService = authService;

    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const user = localStorage.getItem('currentUser');
        if (user) {
            let token:string = JSON.parse(user).jwtToken;
            this.authService.authenticatedUser = JSON.parse(user).username;
           // console.log(token);
           // console.log(this.tokenDecoder.getTokenExpirationDate(token.substring('Bearer '.length)))
            if (!this.tokenDecoder.isTokenExpired(token.substring('Bearer '.length))){
                // logged in so return true
                return true;
            }
            else {
                this.authService.authenticatedUser = null;
                localStorage.removeItem('currentUser');
            }
        }

        // not logged in so redirect to login page with the return url
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
    }
}