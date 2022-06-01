import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PlayService } from '../service/play.service';
import { AuthService } from '../service/auth-service';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit {

  lobbyID: string;

  constructor(private router: Router, public playService:PlayService, public authService: AuthService, private userService: UserService) { 
  }

  ngOnInit(){
    this.lobbyID = "";
  }

  onClick(){
    this.playService.setID(this.lobbyID);
    this.router.navigateByUrl('/deck');
  }

  clickMenu(){
    this.router.navigateByUrl('');
  }

  logout() {
    // Vérifie que l'on était connecté
    this.userService.logout().subscribe(() => {
      // Enlève le token stocké sur le local storage et dans le service 
      this.authService.removeToken();
      this.router.navigateByUrl('');
    }, error => {
      if(error.status === 403) {
        // Cas ou le token a expiré
        // Enlève le token stocké sur le local storage et dans le service 
        this.authService.removeToken();
        this.router.navigateByUrl('');
      }
    });
  }

  profile() {
    this.router.navigateByUrl('/profile');
  }

  getValue(val: string){
    this.lobbyID = val;
  }
}

