// Serveur qui gère les sockets pour faire du temps réel

// On appelle les modules utiles
let express = require('express');
let app = express();
var cors = require("cors");
app.use(cors());
let http = require('http');
let server = http.Server(app);
let port = (process.env.PORT || 8080);
console.log("aaaaaaaaaaaaaaaaaa");

app.use(express.static('./dist/web'));

app.get('/*', (req, res) =>
    res.sendFile('index.html', {root: 'dist/web/'}),
);

// On accepte les requêtes du server angular
const io = require("socket.io")(server, {
  cors: {
    origin: "https://hearttc.herokuapp.com",
    methods: ["GET", "POST"]
  }
});

// Variable pour gérer les utilisateurs et les salles
// On crée un objet room
class Room {
  constructor(id) {
    this.roomID = id;
    var user1;
    var pawnUser1;
    var user2;
    var pawnUser2;
    var ready;
    var resultat;

    var Player1state;
    var player1Hand = [];
    var Player1deck = [];

    var Player2deck = [];
    var player2Hand = [];
    var Player2state;

    this.annonce = "Début de la partie !";
  }
}
var rooms = [];

//définis l'état de la partie l'état est mis à jour à chaque fight puis envoit aux joueurs
class PlayerState {
  constructor() {
    this.player = "Joueur";
    this.hp = 10;
    this.deckSize = 20;
    this.energie = 2;
    this.deckType = 0;
    var cardChosen;
  }
}
// Les fonctions necessaires au combat

function parseEffect(search, origin) {
  var present = false
  for (var i = 0; i < origin.effect.length; i++) {
    if (origin.effect[i] == search) {
      present = true
    }
  }
  return present
}
//Méthode appelée avant d'attaquer PREND TJ LA CARTE DU J1 EN PREMIER ET J2 EN 2EME
function preFight(origin, target, room) {

  let J1 = rooms[room].Player1state;
  let J2 = rooms[room].Player2state;

  if (typeof origin.readyness != "number") {
    origin.readyness = 0
  }
  if (typeof target.readyness != "number") {
    target.readyness = 0
  }

  //Effet Silence -> A CONSERVER EN PREMIERE POSITION
  silence1 = false
  silence2 = false
  if (parseEffect("Silence", origin) == true) {
    silence1 = true
  }
  if (parseEffect("Silence", target) == true) {
    silence2 = true
  }
  if (silence1) {
    target.effectText = "Réduit au silence"
    for (var i = 0; i < target.effect.length; i++) {
      target.effect[i] = ""
    }
  }
  if (silence2) {
    origin.effectText = "Réduit au silence"
    for (var i = 0; i < origin.effect.length; i++) {
      origin.effect[i] = ""
    }
  }
  //Fin Effet Silence

  //Effet GenerateMana
  if (parseEffect("GenerateMana", origin) == true) {
    J1.energie = J1.energie + origin.effectSize;
  
  }
  if (parseEffect("GenerateMana", target) == true) {
    J2.energie = J2.energie - target.effectSize;

  }
  //Effet ManBurst
  if (parseEffect("ManaBurst", origin) == true && origin.readyness == 0) {
    J1.energie = J1.energie + origin.effectSize;
  
  }
  if (parseEffect("ManaBurst", target) == true && target.readyness == 0) {
    J2.energie = J2.energie - target.effectSize;

  }



  //Effet Sacrifice
  if (parseEffect("Sacrifice", origin) == true && origin.readyness == 0) {
    if (J1.hp > J1.hp - origin.effectDmg) {
      J1.hp = J1.hp - origin.effectDmg;
    }
    else {
      J1.hp = 1
    }
  }
  if (parseEffect("Sacrifice", target) == true && target.readyness == 0) {
    if (J2.hp > J2.hp - target.effectDmg) {
      J2.hp = J2.hp - target.effectDmg;
    }
    else {
      J2.hp = 1
    }
  }
  //Fin Sacrifice

  //Effet SacrificeAll
  if (parseEffect("SacrificeAll", origin) == true && origin.readyness == 0) {
    if (J1.hp > J1.hp - origin.effectDmg) {
      J1.hp = J1.hp - origin.effectDmg;
    }
    else {
      J1.hp = 1
    }
    if (J2.hp > J2.hp - target.effectDmg) {
      J2.hp = J2.hp - target.effectDmg;
    }
    else {
      J2.hp = 1
    }
  }
  if (parseEffect("SacrificeAll", target) == true && target.readyness == 0) {
    if (J2.hp > J2.hp - target.effectDmg) {
      J2.hp = J2.hp - target.effectDmg;
    }
    else {
      J2.hp = 1
    }
    if (J1.hp > J1.hp - origin.effectDmg) {
      J1.hp = J1.hp - origin.effectDmg;
    }
    else {
      J1.hp = 1
    }
  }
  //Fin SacrificeAll

  //Effet AtkFace
  if (parseEffect("AtkFace", origin) == true) {
    J2.hp = J2.hp - origin.effectDmg
  }
  if (parseEffect("AtkFace", target) == true) {
    J1.hp = J1.hp - target.effectDmg
  }
  //Fin AtkFace

  //Effet FaceOnce
  if (parseEffect("FaceOnce", origin) == true && origin.readyness == 0) {
    J2.hp = J2.hp - origin.effectDmg
  }
  if (parseEffect("FaceOnce", target) == true && target.readyness == 0) {
    J1.hp = J1.hp - target.effectDmg
  }
  //Fin FaceOnce

  //Effect Heal
  if (parseEffect("Heal", origin) == true && origin.readyness == 0) {
    J1.hp = J1.hp + origin.effectSize
  }
  if (parseEffect("Heal", target) == true && target.readyness == 0) {
    J2.hp = J2.hp + target.effectSize
  }
  //Fin EffectHeal

  //Effet Platoon
  if (parseEffect("Platoon", origin) == true && origin.readyness == 0) {
    for (i = 0; i < rooms[room].player1Hand.length; i++) {
      if (parseEffect("Block", rooms[room].player1Hand[i]) == true) {
        rooms[room].player1Hand[i].blockSize = rooms[room].player1Hand[i].blockSize + origin.effectSize
        rooms[room].player1Hand[i].effectText = rooms[room].player1Hand[i].effectText + " // Protection + II"
      }
      else {
        rooms[room].player1Hand[i].effect.push("Block")
        rooms[room].player1Hand[i].blockSize = origin.effectSize
        rooms[room].player1Hand[i].effectText = rooms[room].player1Hand[i].effectText + " // Protection II : Réduit les dégâts reçus"
      }
    }
  }
  if (parseEffect("Platoon", target) == true && target.readyness == 0) {
    for (i = 0; i < rooms[room].player2Hand.length; i++) {
      if (parseEffect("Block", rooms[room].player2Hand[i]) == true) {
        rooms[room].player2Hand[i].blockSize = rooms[room].player2Hand[i].blockSize + target.effectSize
        rooms[room].player2Hand[i].effectText = rooms[room].player2Hand[i].effectText + " // Protection + II"
      }
      else {
        rooms[room].player2Hand[i].effect.push("Block")
        rooms[room].player2Hand[i].blockSize = target.effectSize
        rooms[room].player2Hand[i].effectText = rooms[room].player2Hand[i].effectText + " // Protection II : Réduit les dégâts reçus"
      }
    }
  }
  //Fin Platoon

  //Effet Mastermind
  if (parseEffect("Mastermind", origin) == true && origin.readyness == 0) {
    for (i = 0; i < rooms[room].player1Hand.length; i++) {
      rooms[room].player1Hand[i].current_atk = rooms[room].player1Hand[i].current_atk + origin.effectSize
      rooms[room].player1Hand[i].current_def = rooms[room].player1Hand[i].current_def + origin.effectSize
    }
  }
  if (parseEffect("Mastermind", target) == true && target.readyness == 0) {
    console.log("ici")
    for (i = 0; i < rooms[room].player2Hand.length; i++) {
      rooms[room].player2Hand[i].current_atk = rooms[room].player2Hand[i].current_atk + target.effectSize
      rooms[room].player2Hand[i].current_def = rooms[room].player2Hand[i].current_def + target.effectSize
    }
  }
  //Fin Mastermind

  return 1
}

//La méthode pour attaquer qui appelle la méthode de défense et applique les effets à l'attaque
function attacking(origin, target) {
  console.log(origin.name)
  console.log(origin.current_atk)
  var dmg = origin.current_atk
  //Effet AtkBuff
  if (parseEffect("AtkBuff", origin) == true) {
    origin.current_atk = origin.current_atk + this.atkbuff
    origin.current_def = origin.current_def + this.defbuff
  }
  //Fin AtkBuff

  //Effet Frenzy
  if (parseEffect("Frenzy", origin) == true) {
    dmg=dmg*2
  }
  //Fin Frenzy

  if (parseEffect("NoBlock", origin) == true) {
    defending(dmg, target, true, false)
  }
  else {
    defending(dmg, target, true, true)
  }
  if (parseEffect("Poison", origin) == true) {
    defending(origin.effectDmg, target, false, false)
  }
  return 1;
}
//La méthode pour défendre et appliquer les effets
function defending(dmg, origin, lethal, block) {

  //Effet DivineShield
  if (parseEffect("DivineShield", origin) == true && origin.readyness == 0 && block == true) {
    dmg = 0
  }
  //Effet Block
  if (parseEffect("Block", origin) == true && block == true) {
    dmg = dmg - origin.blockSize
    if (dmg < 0) {
      dmg = 0
    }
  }
  //Fin Effet Block

  //On gère le cas de figure des dégâts non léthaux
  if (lethal == false && origin.current_def > 0) {
    origin.current_def = origin.current_def - dmg;
    if (origin.current_def < 0) {
      origin.current_def = 1
    }
  }
  if (lethal == true) {

    origin.current_def = origin.current_def - dmg;
  }



  return 1;
}
//Méthode appelée à chaque fin de tour 
function endTurn(origin, J1, J2) { //J1 est le joueur possédant la carte, J2 son adversaire

  origin.atknumber = 0

  //Effect Metamorphose
  if (parseEffect("Metamorphose", origin) == true && origin.readyness == 0 && origin.current_def > 0) {
    origin.name = origin.newName
    origin.img = origin.newImg
    origin.atk = origin.newAtk
    origin.current_atk = origin.newAtk
    origin.def = origin.newDef
    origin.current_def = origin.newDef
    origin.effect = origin.newEffect
    origin.effectText = origin.newEffectText
  }
  //Fin Metamorphose

  //effect DeathFace
  if (parseEffect("DeathFace", origin) == true && origin.current_def <= 0) {
    J2.hp = J2.hp - origin.effectDmg
  }

  origin.readyness = origin.readyness + 1

  return 1
}

function fight(room) {
  let J1 = rooms[room].Player1state;
  let J2 = rooms[room].Player2state;
  let resultat;
  console.log("Fight starting between " + J1 + " and " + J2);
  console.log("Utilisateur 1 a choisi " + J1.cardChosen.name);

  // Les cartes s'affrontent et le joueur perds des pvs
  preFight(J1.cardChosen, J2.cardChosen, room)
  attacking(J2.cardChosen, J1.cardChosen)
  attacking(J1.cardChosen, J2.cardChosen)
  endTurn(J1.cardChosen, J1, J2)
  endTurn(J2.cardChosen, J2, J1)

  //J1.cardChosen.current_def = J1.cardChosen.current_def - J2.cardChosen.current_atk
  //J2.cardChosen.current_def = J2.cardChosen.current_def - J1.cardChosen.current_atk

  // En fonction des pvs restants, on gagne la carte ou non
  if (J2.cardChosen.current_def > 0 && J1.cardChosen.current_def <= 0) {
    // Le joueur 1 perd des points de vie équivalents au dépassement de dégats sur sa carte
    J1.hp = J1.hp + J1.cardChosen.current_def;

    // player 2 récupère sa carte et la carte de player1 meurt
    //remise à l'etat de base de la carte du J2

    // Annonce le résultat
    rooms[room].annonce = "Le Joueur 2 a gagné la bataille !";
    resultat=2;
  }
  else if (J1.cardChosen.current_def > 0 && J2.cardChosen.current_def <= 0) {
    // Le joueur 2 perd des points de vie équivalents au dépassement de dégats sur sa carte
    J2.hp = J2.hp + J2.cardChosen.current_def;

    // player 1 récupère sa carte et la carte de player2 meurt
    //remise à l'état de base de la carte

    // Annonce le résultat
    rooms[room].annonce = "Le Joueur 1 a gagné la bataille !";
    resultat=1;
  }
  else if (J1.cardChosen.current_def <= 0 && J2.cardChosen.current_def <= 0) {// dans le cas ou aucune des deux cartes ne l'emporte soit par deux KO:
    // Les deux joueurs perdent des points de vie équivalents au dépassement de dégats sur sa carte
    J1.hp = J1.hp + J1.cardChosen.current_def;
    J2.hp = J2.hp + J2.cardChosen.current_def;
    //les deux cartes meurent

    // Annonce le résultat
    rooms[room].annonce = "Egalité";
    resultat=3;
  }
  else if (J1.cardChosen.current_def > 0 && J2.cardChosen.current_def > 0) {// dans le cas ou les deux cartes survivent
    //les deux cartes survivent et restent sur le plateau(!!!!!!!!!!!! a faire !!!!!!!!!!)


    // Annonce le résultat
    rooms[room].annonce = "Egalité";
    resultat=0
  }



  //vérifie que la partie n'est pas terminée
  if (J2.hp <= 0 && J1.hp <= 0) {
    rooms[room].resultat = "Egalité";
    return 1;
  }
  else if (J2.hp <= 0) {
    rooms[room].resultat = "Le Joueur 1 a gagné la partie !";
    return 1;
  }
  else if (J1.hp <= 0) {
    rooms[room].resultat = "Le Joueur 2 a gagné la partie !";
    return 1;
  } else {
    // Comble les main de 3 cartes
    // Vérifie que le deck a encore des cartes
    if (rooms[room].pawnUser1.name!=J1.cardChosen.name){
      if (rooms[room].Player1deck.length > 0 && (resultat==2||resultat==3)) {
        for (let i = 0; i < 4 ; i++) {
          if (rooms[room].player1Hand[i].id == J1.cardChosen.id) {
            console.log(" carte 1 trouvee");
            rooms[room].player1Hand[i] = rooms[room].Player1deck[0];
            rooms[room].player1Hand[i].id=i.toString();
            rooms[room].Player1deck.shift();
            i=5;
          } 
        }
        J1.cardChosen=rooms[room].pawnUser1;
      }else if (rooms[room].Player1deck.length > 0 ){
        for (let i = 0; i < 4; i++) {
          if (rooms[room].player1Hand[i].id == J1.cardChosen.id) {
            console.log(" carte 2 trouvee");
            rooms[room].player1Hand[i] = J1.cardChosen;
            i=5;
          }
        }
      }
    }else{
      J1.cardChosen.current_def=rooms[room].pawnUser1.def;
    }
    
    // Vérifie que le deck a encore des cartes
    if (rooms[room].pawnUser2.name!=J2.cardChosen.name){
      if (rooms[room].Player2deck.length > 0 && (resultat==1||resultat==3)) {
        for (let i = 0; i < 4; i++) {
          if (rooms[room].player2Hand[i].id == J2.cardChosen.id) {
            console.log(" carte 2 trouvee");
            rooms[room].player2Hand[i] = rooms[room].Player2deck[0];
            rooms[room].player2Hand[i].id=i.toString();
            rooms[room].Player2deck.shift();
            i=5;
          }
        }
        J2.cardChosen=rooms[room].pawnUser2;
      }else if (rooms[room].Player2deck.length > 0 ){
        for (let i = 0; i < 4; i++) {
          if (rooms[room].player2Hand[i].id == J2.cardChosen.id) {
            console.log(" carte 2 trouvee");
            rooms[room].player2Hand[i] = J2.cardChosen;
            i=5;
          }
        }
      }
    }else{
      J2.cardChosen.current_def=rooms[room].pawnUser2.def;
    }
    J1.energie= J1.energie+2;
    J2.energie= J2.energie+2;
    J1.deckSize = rooms[room].Player1deck.length;
    J2.deckSize = rooms[room].Player2deck.length;
    rooms[room].Player1state = J1;
    rooms[room].Player2state = J2;
    return 0
  }
}

// Quand un user se connecte au serveur
io.on('connection', (socket) => {
  console.log("User " + socket.id + " connected"); // On log sur la console

  // Quand un user se connecte à une salle
  socket.on('connectToRoom', (roomID) => {

    console.log('User ' + socket.id + ' connecting to ' + roomID + "..."); // On log sur la console

    // On test si la salle existe déjà
    let test = false;
    for (let i = 0; i < rooms.length; i++) { // On met le joueur dans sa salle
      if (rooms[i].roomID == roomID) {
        console.log('la salle :' + roomID + ' existe déjà');
        test = true;
      }
    }
    if (test == false) { // Si cette salle n'est pas contenu dans la liste
      let room = new Room(roomID);
      rooms.unshift(room)// Ajoute une salle au début de la liste
      room.user1 = socket.id;
      socket.join(roomID);
      console.log('User connecté sur la salle :' + roomID);
    }

    // On met le joueur dans sa salle
    for (let i = 0; i < rooms.length; i++) {
      if (rooms[i].roomID == roomID) {
        if (rooms[i].user1 != null && rooms[i].user2 != null) {
          console.log("La salle est déjà pleine!")
          break;
        }
        if (rooms[i].user1 == null && rooms[i].user2 != socket.id) {
          rooms[i].user1 = socket.id;
          console.log('User connecté sur la salle ' + roomID);
          socket.join(roomID); // Le user rejoint la salle correspondante
        }
        if (rooms[i].user2 == null && rooms[i].user1 != socket.id) {
          rooms[i].user2 = socket.id;
          console.log('User connecté sur la salle ' + roomID);
          socket.join(roomID); // Le user rejoint la salle correspondante
        }
        if (rooms[i].user1 != null && rooms[i].user2 != null) {
          io.to(roomID).emit('StartGame', "true"); // On commence la partie
          console.log("Starting game in room " + roomID + " with " + rooms[i].user1 + " and " + rooms[i].user2);
        }
      }
    }
  });

  //Quand on reçoit le deck du joueur en début de partie
  socket.on('sendDeck', (deck, roomID, deckType, hp, pion) => {
    //on cherche la salle
    pion.id="pion";
    console.log('carte pion : ' + pion);
    for (let i = 0; i < rooms.length; i++) {
      if (rooms[i].roomID == roomID) {
        //on pioche pour le joueur on donne le deck au joueur puis on lui donne les cartes piochées
        //pioche
        deck.sort(() => Math.random() - 0.5);// on mélange le deck
        let mainJoueur = [pion,pion,pion,pion];
        let nb=3;
        mainJoueur[3].id=nb.toString();
        for (let i = 0; i < 3; i++) {
          mainJoueur[i]=deck[0];
          mainJoueur[i].id=i.toString();
          deck.shift()
        }
        console.log('deck reçu');
        //donne le deck et la main initiale au joueur
        if (rooms[i].user1 == socket.id) {
          rooms[i].Player1deck = deck;
          rooms[i].pawnUser1=pion;
          rooms[i].Player1state = new PlayerState();
          rooms[i].Player1state.cardChosen=pion;
          rooms[i].Player1state.hp=hp;
          rooms[i].Player1state.deckType = deckType;
          rooms[i].Player1state.player = "Joueur 1";
          rooms[i].player1Hand = mainJoueur;
          //il faut emit la main du joueur pour qu'il la connaisse
        } else if (rooms[i].user2 == socket.id) {
          rooms[i].Player2deck = deck;
          rooms[i].pawnUser2=pion;

          rooms[i].Player2state = new PlayerState();
          rooms[i].Player2state.cardChosen=pion;
          rooms[i].Player2state.hp=hp;
          rooms[i].Player2state.deckType = deckType;
          rooms[i].Player2state.player = "Joueur 2";
          rooms[i].player2Hand = mainJoueur;
        }
        if (rooms[i].user1 != null && rooms[i].user2 != null) {//quand les deux joueurs sont présents on leur envoit leurs cartes
          io.to(rooms[i].user1).emit('GameState', rooms[i].Player1state, rooms[i].Player2state, rooms[i].player1Hand, rooms[i].annonce);
          io.to(rooms[i].user2).emit('GameState', rooms[i].Player2state, rooms[i].Player1state, rooms[i].player2Hand, rooms[i].annonce);
        }
      }
    }
  });


  // Quand un user envoie un message dans le tchat
  socket.on('message', ({ data, roomID }) => {
    console.log(data.message + ': message sent in room ' + roomID.roomID);
    io.to(roomID.roomID).emit('new message', { message: (socket.id + " said: " + data.message) });
  });

  // Quand un user choisi la carte qu'il veut jouer
  socket.on('chooseCard', (data) => {
    console.log(data.name + ': card received');
    // On cherche qui est l'autre user dans la salle
    for (let i = 0; i < rooms.length; i++) {
      if (rooms[i].user1 == socket.id) {
        if (data.cost > rooms[i].Player1state.energie){
          io.to(rooms[i].user1).emit('choixCarteInvalide',rooms[i].Player1state.cardChosen);
        }else{
          rooms[i].Player1state.cardChosen = data;
          io.to(rooms[i].user2).emit('card chosen', data);
        }
        //on met cette carte en carte choisie par le joueur
      }
      if (rooms[i].user2 == socket.id) {
        if (data.cost > rooms[i].Player2state.energie){
          io.to(rooms[i].user2).emit('choixCarteInvalide',rooms[i].Player2state.cardChosen);
        }else{
          rooms[i].Player2state.cardChosen = data;
          io.to(rooms[i].user1).emit('card chosen', data);
        }
      }
    }
  });
  //quand on est pret pour combattre
  socket.on('readyToFight', (roomID) => {
    console.log('player ready');
    for (let i = 0; i < rooms.length; i++) {
      if (rooms[i].roomID == roomID) { // On selectionne la salle en cours
        if (rooms[i].ready != 1) {//On regarde si l'autre joueur est prêt. Si il ne l'est pas, on marque le compteur pour prévenir qu'on l'est
          rooms[i].ready = 1//si il ne l'est pas on dit qu'on l'est
        } else {//si il l'est on effectue le combat on réinitialise le compteur de joueur prêts et on envoit le nouvel état de la partie aux deux joueurs
          console.log('fight');
          rooms[i].Player2state.energie=rooms[i].Player2state.energie-rooms[i].Player2state.cardChosen.cost;
          rooms[i].Player1state.energie=rooms[i].Player1state.energie-rooms[i].Player1state.cardChosen.cost;
          rooms[i].Player2state.cardChosen.cost = 0;
          rooms[i].Player1state.cardChosen.cost = 0;
          rooms[i].ready = 0;
          result = fight(i);// on effectue le fight
          //si les deux joueurs ont encore de la vie on envoie aux joueurs le nouvel etat de la partie
          if (result == 0) {
            io.to(rooms[i].user1).emit('GameState', rooms[i].Player1state, rooms[i].Player2state, rooms[i].player1Hand, rooms[i].annonce);
            io.to(rooms[i].user2).emit('GameState', rooms[i].Player2state, rooms[i].Player1state, rooms[i].player2Hand, rooms[i].annonce);
          } else if (result == 1) {//sinon on envoie le résultat de la partie
            console.log('Fin de la partie');
            io.to(roomID).emit('fin Partie', rooms[i].resultat);
          }
        }
      }
    }
  });

  //quand on n'est plus pret pour combattre
  socket.on('notreadyToFight', (roomID) => {
    console.log('player not ready');
    for (let i = 0; i < rooms.length; i++) {
      if (rooms[i].roomID == roomID) { // On selectionne la salle en cours
        if (rooms[i].ready != 0) {
          rooms[i].ready = 0
        }
      }
    }
  });

  // Quand un user se déconnecte de la salle
  socket.on('disconnectFromRoom', (roomID) => {
    console.log('Utilisateurs déconnecté de la salle ' + roomID);
    for (let i = 0; i < rooms.length; i++) { // On enlève le joueur de la salle
      if (rooms[i].roomID == roomID) { // On selectionne la salle en cours
        if (rooms[i].user1 == socket.id) {
          rooms[i].user1 = null;
        }
        if (rooms[i].user2 == socket.id) {
          rooms[i].user2 = null;
        }
        console.log("Utilisateurs restants : " + rooms[i].user1 + rooms[i].user2);
        if (rooms[i].user1 == null && rooms[i].user2 == null) {
          rooms[i].roomID = null;
        }
      }
    }
    console.log('Utilisateur déconnecté ' + roomID);
  });

  // Quand un user se déconnecte
  socket.on('disconnect', () => {
    for (let i = 0; i < rooms.length; i++) { // On enlève le joueur de la salle
      if (rooms[i].user1 == socket.id || rooms[i].user2 == socket.id) {
        if (rooms[i].user1 == socket.id) {
          rooms[i].user1 = null;
        }
        if (rooms[i].user2 == socket.id) {
          rooms[i].user2 = null;
        }
        console.log("Utilisateurs restants : " + rooms[i].user1 + " " + rooms[i].user2);
        if (rooms[i].user1 == null && rooms[i].user2 == null) {
          rooms[i].roomID = null;
        }
      }
    }
    console.log('Utilisateur déconnecté');
  });

});

// On lance le serveur sur un port
server.listen(port, () => {
  console.log(`Démarré sur le port : ${port}`);
});


