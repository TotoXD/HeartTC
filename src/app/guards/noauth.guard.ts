import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from "@angular/router";
import { Router } from '@angular/router';
import { AuthService } from "../service/auth-service";

@Injectable({
    providedIn: 'root'
})

export class NoAuthGuard { // Removed Auth implements CanActivate {

    constructor(private router: Router, private authService: AuthService) {
    }

    /* Removed Auth // Vérifie si null vide undef
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if(!this.authService.token) {
            return true;
        } else {
            this.router.navigate(['/lobby']);
            return false;
        }
    }*/

}