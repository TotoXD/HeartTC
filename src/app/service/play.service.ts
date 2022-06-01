// Service qui permet de gérer les actions avec les sockets

// import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
export class PlayService {

  // Déclarations utiles
  public roomID: String;
  public deck: number;
  private socket = io("https://hearttc.herokuapp.com");

  // Quand le user choisit sa carte
  chooseCard(data) {
    this.socket.emit('chooseCard', data); // On envoie un message avec l'évenement + la carte choisie
  }

  // Quand on reçoit l'information de la carte choisie de l'autre joueur
  newCardReceived() {
    let observable = new Observable<any>(observer => {
      this.socket.on('card chosen', (data) => {
        // console.log("received "+ data.name+" with img "+data.img);
        observer.next(data);
      });
      return () => { this.socket.disconnect(); }
    });

    return observable;
  }
  invalidCardChoice() {
    let observable = new Observable<any>(observer => {
      this.socket.on('choixCarteInvalide', (data) => {
        observer.next(data);
      });
      return () => { this.socket.disconnect(); }
    });

    return observable;
  }
  newGameStateReceived() {
    let observable = new Observable<any>(observer => {
      this.socket.on('GameState', (myState, opponentState, myHand, annonce) => {
        // console.log("received gamestate");
        let myPlayerNumber = myState.player;
        let myHp = myState.hp;
        let myDeckSize = myState.deckSize;
        let myEnergie = myState.energie;
        let myCard = myState.cardChosen;
        let deckType = opponentState.deckType;
        let opponentHp = opponentState.hp;
        let opponentDeckSize = opponentState.deckSize;
        let opponentEnergie = opponentState.energie;
        let opponentCard = opponentState.cardChosen

        observer.next({ myPlayerNumber, myHp, deckType, myEnergie, myDeckSize, opponentHp, myCard, opponentEnergie, opponentDeckSize, opponentCard, myHand, annonce });
      });
      return () => { this.socket.disconnect(); }
    });
    return observable;
  }
  finDePartie() {
    let observable = new Observable<any>(observer => {
      this.socket.on('fin Partie', (resultatPartie) => {
        observer.next({ resultatPartie });
      });
      return () => { this.socket.disconnect(); }
    });

    return observable;
  }

  // Quand on envoie un message à l'autre joueur
  sendMessage(data, roomID) {
    this.socket.emit('message', { data, roomID });
  }
  //pour envoyer le deck en début de partie
  sendDeck(deck, roomID, deckType, hp, pion) {
    this.socket.emit('sendDeck', deck, roomID, deckType, hp, pion);
  }
  // Quand on reçoit son message
  newMessageReceived() {
    let observable = new Observable<{ message: String }>(observer => {
      this.socket.on('new message', (data) => {
        observer.next(data);
      });
      return () => { this.socket.disconnect(); }
    });

    return observable;
  }
  connectToID() {
    this.socket.emit('connectToRoom', this.roomID);
  }

  setID(room) {
    this.roomID = room;
  }

  chooseDeck(deck) {
    this.deck = deck;
  }

  getDeck() {
    return this.deck;
  }

  //Quand le user a sélectioné sa carte et qu'il est prêt à combattre
  readyToFight() {
    var data;
    data = this.roomID;
    this.socket.emit('readyToFight', data);
  }
  //Quand le user a sélectioné sa carte et qu'il est prêt à combattre
  notreadyToFight() {
    var data;
    data = this.roomID;
    this.socket.emit('notreadyToFight', data);
  }
  //Quand le serveur annonce aux deux joueurs que le fight peut avoir lieu 
  startFight() {
    let observable = new Observable<{ message: String }>(observer => {// revoir la partie observable
      this.socket.on('fight', () => {
        observer.next();
      });
      return () => { this.socket.disconnect(); }
    });
    return observable;
  }

  connection() {
    let observable = new Observable<any>(observer => {
      this.socket.on('StartGame', (data) => {
        observer.next(data);
        // console.log("Starting game playservice");
      });
      return () => { this.socket.disconnect(); }
    });

    return observable;
  }

  disconnectFromRoom(roomID) {
    this.socket.emit('disconnectFromRoom', roomID);
  }
}
