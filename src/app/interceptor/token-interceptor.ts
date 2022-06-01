import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpResponse, HttpRequest, HttpHandler } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/service/auth-service';

@Injectable(
    {providedIn: 'root'}
) 

export class TokenInterceptor { // Removed Auth implements HttpInterceptor {

    constructor(private authService: AuthService) {
    }

    /* Removed Auth intercept(httpRequest: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let modifiedRequest = httpRequest;
        
        // && HttpRequest. à faire checker son api
        if(this.authService.token) {
            modifiedRequest = httpRequest.clone({
                setHeaders: {
                    Authorization: `Bearer ${this.authService.token}`
                }
                //headers: httpRequest.headers.set('Authorization', this.authService.token)
            });
        }

        return next.handle(modifiedRequest);
    }*/
}