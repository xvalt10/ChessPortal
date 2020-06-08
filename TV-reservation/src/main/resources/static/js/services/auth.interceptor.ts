
import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler } from "@angular/common/http";
import { JwtAuthenticationService } from "./jwtAuthenticationService";

@Injectable()

export class AuthInterceptor implements HttpInterceptor {
    constructor(private authService: JwtAuthenticationService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        if(this.authService.isUserAuthenticated()){
        const authToken = this.authService.getJwtToken();
        if (authToken) {
            req = req.clone({
                setHeaders: {
                    Authorization: authToken
                }
            });
        }
    }
        return next.handle(req);
    }
}