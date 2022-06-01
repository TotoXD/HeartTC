// Pour mettre des actions dans le composant de base (pas utilisé)

import { Component, OnInit } from '@angular/core';
import { UserService } from './service/user.service';

// FONCTIONNE MAIS TODO / UPGRADE : Faire un model
interface User {
  mailAddress: String;
  pseudo: String;
  password: String;
  timestamps: String[];
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

  constructor(private userService: UserService) { }

  ngOnInit() {
  }
}
