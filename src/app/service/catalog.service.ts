import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CatalogService {

  uri = 'http://localhost:4201';

  constructor(private http: HttpClient) { }

getCards() {
  return this.http.get(`${this.uri}/cards`);
}
  
getCardsByRace(race:String) {
  return this.http.get(`${this.uri}/cards/${race}`);
}
getCardsByName(name:String) {
  return this.http.get(`${this.uri}/cards/${name}`);
}

}

