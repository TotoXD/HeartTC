import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PlayService } from '../service/play.service';

@Component({
  selector: 'app-choose-deck',
  templateUrl: './choose-deck.component.html',
  styleUrls: ['./choose-deck.component.css']
})
export class ChooseDeckComponent implements OnInit {

  public nom1: string="";
  public nom2: string="";
  public nom3: string="";
  public pvPlayer: number=20;

  constructor(private router: Router, public playService:PlayService) { 
    
  }

  ngOnInit(){
    this.nom1 = "Ealeen, Souveraine des Peuples Elfiques"
    this.nom2 = "Verdantier, Berceau des Machines"
    this.nom3 = "Galathur, Dragon Primordial"
  }

  onClick(deck:number){
    this.playService.chooseDeck(deck);
    this.playService.connectToID();
    this.router.navigateByUrl('/jeu');
  }

}