import { Injectable } from '@angular/core';

// Classe service qui permet d'authentifier ou non un utilisateur, en stockant un token dans le local storage

@Injectable({
    providedIn: 'root'
})

export class AuthService {
    
    private _token?: any;

    constructor() {
        this._token = localStorage.getItem('token');
    }

    set token(_token) {
        this._token = _token;
        localStorage.setItem('token', _token);
    }

    get token() : any {
        return this._token;
    }

    removeToken() {
        this.token = null;
        localStorage.removeItem('token');
    }
}
