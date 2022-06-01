// Class en typescript qui défini le comportement du composant et importe les cartes (ce qu'il se passe quand on clique sur un bouton, etc)

import { Component, Input, OnInit } from '@angular/core';
import { Card, DEFAULT_TYPE, CARD_TYPES, } from '../card';
import { Router } from '@angular/router';
import { CatalogService } from '../service/catalog.service';
import { PlayService } from '../service/play.service';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css']
})

export class CatalogComponent implements OnInit {
  public gagnant: String = "aucun";
  public playerReady: number = 0;
  public getCard: boolean = false;

  public connection: boolean = false;
  
  public atq1: number = 0;
  public def1: number = 0;
  public atq2: number = 0;
  public def2: number = 0;

  public nomAdversaire: string = "";
  public typeAdversaire: number = 0;
  public nomPlayer: string = "";

  public pvAdversaire: number = 10;
  public energieAdversaire: number = 2;
  public pvPlayer: number = 10;
  public energiePlayer: number = 2;
  public img: String = "../../assets/overlay-profile-blue.png";
  public imgClass: String = "profileImageRed";

  public list: Card[] = [];
  public types: any[] = [];
  public currentType: string = "";

  public optionDeck: number;
  public classDeckOpponent: string = "";
  public imageDeckOpponent: string = "";

  public flipped: boolean = true;



  public playerNumber: String = "Joueur";
  public opponentPlayerNumber: String = "Joueur";

  // Main du joueur qui va contenir les cartes
  public mainJoueur: Card[] = []
  public pion: Card;
  public enemyCard: Card;
  public started: String = "false";

  // Pioche du joueur
  public numberCardsInDraw: number = 0;
  public drawColor: string;

  // String affiché en haut et qui indique l'état (Qui a gagné la bataille)
  public annonce: string = "La bataille commence !";
  public selectedCard: Card;
  public newCard: Card;
  public selectedCardId: number = - 1;

  // Messages
  messageText: String;
  messageArray: Array<{ message: String }> = [];
  public roomID: String = "";

  constructor(private router: Router, public playService: PlayService, private cardService: CatalogService) {

    // On set la roomID
    this.roomID = playService.roomID;
    this.optionDeck = this.playService.getDeck();
    console.log(this.optionDeck);
    console.log(this.typeAdversaire);

    // // On initialise la carte enemie
    // this.cardService.getCardsByRace("Elfe").subscribe((elf: any)=>{
    //   this.enemyCard=elf[3];
    //   this.enemyCard.current_atk=this.enemyCard.atk;
    //   this.enemyCard.current_def=this.enemyCard.def;
    //   this.enemyCard.backColor="face back-green";
    //   this.enemyCard.overlayColor="borders-green";
    // });

    // On initialise la carte enemie


    this.enemyCard = new Card(this.newCard);


    // On initialise les cartes péons


    // Deck 2
    this.mainJoueur = mainPlayer;

    // Chat service 
    this.playService.newMessageReceived()
      .subscribe(data => this.messageArray.push(data));

    // Quand on recoit le nom de la carte, on remplace enemyCard
    this.playService.newCardReceived().subscribe(data => (this.enemyCard = new Card(data)));

    this.playService.newCardReceived()
      .subscribe(data => (this.enemyCard = data));

    this.playService.invalidCardChoice()
      .subscribe(data => {
        this.selectedCard = data;
        this.selectedCardId = data.id;
        this.playerReady = 0;
      });

    this.playService.newGameStateReceived()
      .subscribe((data) => {
        this.connection = true;
        this.typeAdversaire = data.deckType;

        this.mainJoueur = data.myHand;
        this.playerNumber = data.myPlayerNumber;
        if (data.myPlayerNumber == "Joueur 1") {
          this.opponentPlayerNumber = "Joueur 2";
        } else {
          this.opponentPlayerNumber = "Joueur 1";
        }
        this.pvPlayer = data.myHp;
        this.energiePlayer = data.myEnergie;
        this.numberCardsInDraw = data.myDeckSize;
        this.selectedCard = data.myCard;
        this.selectedCardId = data.myCard.id;

        this.pvAdversaire = data.opponentHp;
        this.energieAdversaire = data.opponentEnergie;
        this.annonce = data.annonce;
        this.enemyCard = data.opponentCard;
        this.playerReady = 0;
        this.flipped = true;

        if (this.typeAdversaire == 1) {
          this.nomAdversaire = "Verdantier, Berceau des Machines";
          this.classDeckOpponent = "profileImageRed";
          this.imageDeckOpponent = "../../assets/overlay-profile-red.png";
        }
        if (this.typeAdversaire == 2) {
          this.nomAdversaire = "Ealeen, Souveraine des Peuples Elfiques";
          this.classDeckOpponent = "profileImageGreen";
          this.imageDeckOpponent = "../../assets/overlay-profile-green.png";
        }
        if (this.typeAdversaire == 3) {
          this.nomAdversaire = "Galathur, Dragon Primordial";
          this.classDeckOpponent = "profileImageBlue";
          this.imageDeckOpponent = "../../assets/overlay-profile-blue.png";
        }

        // console.log(this.enemyCard.current_def);
        // console.log(this.selectedCard.current_def);
        if (this.enemyCard.current_def != null) {
          if (this.enemyCard.current_def <= 0) {
            this.enemyCard = new Card(this.newCard);
          }
        }
        if (this.selectedCard.current_def != null) {
          if (this.selectedCard.current_def <= 0) {
            this.selectedCard = new Card(this.newCard);
          }
        }
      });

    this.playService.finDePartie()
      .subscribe((data) => {
        this.gagnant = data.resultatPartie;
      });
    //lancementdu combat
    //this.playService.startFight() 
    //.subscribe(()=>(this.fight()));

    this.playService.connection()
      .subscribe(data => {
        this.started = String(data);
      });

    // Création des cards peons

    //this.pionElf.current_atk = 1;
    //this.pionElf.def = 1;
    //this.pionElf.name = "Péon elf";
    //this.pionElf.img = "../../assets/Elf/elfPawn.png";
    //this.pionElf.backColor="face back-green";
    //this.pionElf.overlayColor="borders-green";

    //this.enemyCard=this.peonElf;

  }



  // Initialisation des composants

  ngOnInit(): void {
    
    // Si on a choisi le deck humain

    if (this.optionDeck==1){
      console.log("test:"+this.playService.deck);
      this.nomPlayer = "Verdantier, Berceau des Machines";
      this.drawColor="../../assets/Overlay-back-red.png";
      
      this.cardService.getCardsByName("PawnHuman").subscribe((pawn: any)=>{
        this.pion=pawn[0];
        this.pion.current_atk=this.pion.atk;
        this.pion.current_def=this.pion.def;
        this.pion.overlayColor="borders-red";
        this.pion.backColor="face back-red";
        this.pvPlayer=40;
        if (this.getCard){
          this.playService.sendDeck(CARD_DECK2,this.roomID, this.optionDeck,this.pvPlayer,this.pion);
        }else{
          this.getCard=true;
        }

      });
      this.cardService.getCardsByRace("Humain").subscribe((human: any)=>{

        //initialisation du deck du joueur
        for(var i=0;i<human.length;i++){
          CARD_DECK2[i]=human[i];
          CARD_DECK2[i].current_atk=CARD_DECK2[i].atk;
          CARD_DECK2[i].current_def=CARD_DECK2[i].def;
          CARD_DECK2[i].id=i;
          CARD_DECK2[i].overlayColor="borders-red";
          CARD_DECK2[i].backColor="face back-red";
          //CARD_DECK2[i].sendToCardComponent()
        }
        
        this.nomPlayer = "Verdantier, Berceau des Machines";
        this.img="../../assets/overlay-profile-red.png"
        this.imgClass="profileImageRed"
        this.atq1 = 0;
        this.def1 = 0;
        if (this.getCard){
          this.playService.sendDeck(CARD_DECK2,this.roomID, this.optionDeck,this.pvPlayer,this.pion);
        }else{
          this.getCard=true;
        }
      });
      
    }

    if (this.optionDeck==2){
      console.log("test:"+this.playService.deck);
      this.drawColor="../../assets/Overlay-back-green.png";
      this.cardService.getCardsByName("PawnElf").subscribe((pawn: any)=>{
        this.pion=pawn[0];
        this.pion.current_atk=this.pion.atk;
        this.pion.current_def=this.pion.def;
        this.pion.overlayColor="borders-green";
        this.pion.backColor="face back-green";
        this.pvPlayer=25;
        if (this.getCard){
          this.playService.sendDeck(CARD_DECK2,this.roomID, this.optionDeck,this.pvPlayer,this.pion);
        }else{
          this.getCard=true;
        }
      });
      this.cardService.getCardsByRace("Elfe").subscribe((Elfe: any)=>{

        //initialisation du deck du joueur
        for(var i=0;i<Elfe.length;i++){
          CARD_DECK2[i]=Elfe[i];
          CARD_DECK2[i].current_atk=CARD_DECK2[i].atk;
          CARD_DECK2[i].current_def=CARD_DECK2[i].def;
          CARD_DECK2[i].id=i;
          CARD_DECK2[i].overlayColor="borders-green";
          CARD_DECK2[i].backColor="face back-green";
          //CARD_DECK2[i].sendToCardComponent()
        }
        
        this.nomPlayer = "Ealeen, Souveraine des Peuples Elfiques";
        this.img="../../assets/overlay-profile-green.png"
        this.imgClass="profileImageGreen"
        this.atq1 = 0;
        this.def1 = 0;
        if (this.getCard){
          this.playService.sendDeck(CARD_DECK2,this.roomID, this.optionDeck,this.pvPlayer,this.pion);
        }else{
          this.getCard=true;
        }
      });
    }

    if (this.optionDeck==3){
      console.log("test:"+this.playService.deck);

      this.nomPlayer = "Verdantier, Berceau des Machines";
      this.drawColor="../../assets/Overlay-back-blue.png";
      this.cardService.getCardsByName("PawnDragon").subscribe((pawn: any)=>{
        this.pion=pawn[0];
        this.pion.current_atk=this.pion.atk;
        this.pion.current_def=this.pion.def;
        this.pion.overlayColor="borders-blue";
        this.pion.backColor="face back-blue";
        this.pvPlayer=30;
        if (this.getCard){
          this.playService.sendDeck(CARD_DECK2,this.roomID, this.optionDeck,this.pvPlayer,this.pion);
        }else{
          this.getCard=true;
        }
      });
      this.cardService.getCardsByRace("Dragonkin").subscribe((Dragonkin: any)=>{

        //initialisation du deck du joueur
        for(var i=0;i<Dragonkin.length;i++){
          CARD_DECK2[i]=Dragonkin[i];
          CARD_DECK2[i].current_atk=CARD_DECK2[i].atk;
          CARD_DECK2[i].current_def=CARD_DECK2[i].def;
          CARD_DECK2[i].id=i;
          CARD_DECK2[i].overlayColor="borders-blue";
          CARD_DECK2[i].backColor="face back-blue";
          //CARD_DECK2[i].sendToCardComponent()
        }
        
        this.nomPlayer = "Monster Muller, Effaceur de vendredi matin";

        this.img="../../assets/overlay-profile-blue.png"
        this.imgClass="profileImageBlue"
        this.atq1 = 0;
        this.def1 = 0;
        if (this.getCard){
          this.playService.sendDeck(CARD_DECK2,this.roomID, this.optionDeck,this.pvPlayer,this.pion);
        }else{
          this.getCard=true;
        }
      });
    }

    this.numberCardsInDraw = CARD_DECK2.length; 
  }

  sendMessage() {
    this.playService.sendMessage({ message: this.messageText }, { roomID: this.roomID });
  }

  chooseCard(chosenCard: Card) {
    this.playService.chooseCard(chosenCard);
    console.log(this.enemyCard);

  }

  onSelect(card: Card): void {
    this.selectedCard = card;
    this.selectedCardId = card.id;
    // this.playerReady=0;

    this.atq2 = this.selectedCard.current_atk;
    this.def2 = this.selectedCard.current_def;

    this.chooseCard(card);

  }
  clickMenu() {
    if (this.roomID != null) {
      this.playService.disconnectFromRoom(this.roomID);
    }
    this.router.navigateByUrl('');
  }
  clickfight() {  //envoit qu'on est prêt à se battre, ou annule si on était déjà prêt
    if (this.playerReady == 0 && this.selectedCard.def != null) {
      this.playerReady = 1;
      this.playService.readyToFight();
    } /*else if (this.playerReady == 1) {
      this.playerReady = 0;
      this.playService.notreadyToFight();
    }*/
  }
}



export const CARD_LIST: Card[] = []
export const CARD_ELF: Card[] = []
export const CARD_HUMAN: Card[] = []
export const CARD_DECK2: Card[] = []
export const mainPlayer: Card[] = []

