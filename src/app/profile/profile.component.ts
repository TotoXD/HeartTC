import { Component, OnInit } from '@angular/core';
import { User } from '../models/user.model';
import { DeckService } from '../service/deck.service';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  
  public userProfile?;
  public decksAvailable?;
  public winrate = 0;

  constructor(private userService: UserService, private deckService: DeckService) { 
  }

  ngOnInit(): void {
    this.userService.getUserProfile().subscribe((user: any) => {
      this.deckService.getDecks().subscribe((decks: any) => {
        this.decksAvailable = decks;
        this.userProfile = user;
        if(user.totalGames != 0) {
          this.winrate = (user.totalWins / user.totalGames);
        }
      });
    });
  }

  saveDeck(): void {

  }
}
