import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  
  //Connexion au serv
  uri = 'https://serverhearttc.herokuapp.com';

  constructor(private http: HttpClient) { }

  //Services

  getUsers() : Observable<User[]> {
    return this.http.get<User[]>(`${this.uri}/users`);
  }

  getUserByAddress(mail: String) : Observable<User[]> {
    return this.http.get<User[]>(`${this.uri}/users/mail/${mail}`);
  }

  getUserByPseudo(pseudo: String) : Observable<User[]>{
    return this.http.get<User[]>(`${this.uri}/users/pseudo/${pseudo}`);
  }

  getUserProfile() : Observable<User[]> {
    return this.http.get<User[]>(`${this.uri}/users/profile`);
  }

  login(mail: String, password: String) : Observable<User[]> {
    const user = {
      mailAddress: mail,
      password: password,
    }

    return this.http.post<User[]>(`${this.uri}/users/login`, user);
  }

  logout() : Observable<User[]> {
    return this.http.post<User[]>(`${this.uri}/users/logout`, "any");
  }

  isLoggedIn() : Observable<User[]> {
    return this.http.post<User[]>(`${this.uri}/users/isloggedin`, "any");
  }

  addUser(mailAddress: String, pseudo: String, password: String) : Observable<User[]> {
    const user = {
      mailAddress: mailAddress,
      pseudo: pseudo,
      password: password,
    };

    return this.http.post<User[]>(`${this.uri}/users/register`, user);
  }

  deleteUser(id: any) : Observable<User[]> {
    return this.http.get<User[]>(`${this.uri}/users/delete/${id}`);
  }
}
