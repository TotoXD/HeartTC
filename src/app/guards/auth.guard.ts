import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Router } from '@angular/router';
import { Observable } from "rxjs/internal/Observable";
import { AuthService } from "../service/auth-service";
import { UserService } from "../service/user.service";

@Injectable({
    providedIn: 'root'
})

export class AuthGuard { // Removed Auth implements CanActivate, CanActivateChild {

    constructor(private router: Router, private authService: AuthService, private userService: UserService) {
    }

    /* Removed Auth // Vérifie ni null ni vide ni undef
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.isAuth();
    }

    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.isAuth();
    }
    
    isAuth() {
        if(this.authService.token) {
            // Vérifie que l'on était connecté
            this.userService.isLoggedIn().subscribe(() => {}, error => {
                // Cas ou le token a expiré
                // Enlève le token stocké sur le local storage et dans le service 
                this.authService.removeToken();
                this.router.navigate(['login']);
                return false;
            });
            return true;
        } else {
            this.router.navigate(['login']);
            return false;
        }
    }*/
}