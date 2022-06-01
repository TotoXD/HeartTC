
  
// Definition de la classe carte

export class Card {
    // Attributs de la carte
    // public id: number = 0;
    // public name: string = "";
    // public desc: string = "";
    // public atk: number = 0;
    // public def: number = 0;
    // public current_atk: number = 0;
    // public current_def: number = 0;
    // public img: string = "";
    // public type: string = "";

    //La classe carte telle qu'elle sera surement à terme
    public id: number = 0;
    public name: string = "";
    public race: string = "";
    public desc: string = "";
    public cost: number = 0;
    public readyness: number = 0;
    public priority: number = 0;

    public atk: number = 0;
    public def: number = 0;

    public atknumber: number = 0;

    public current_atk: number = 0;
    public current_def: number = 0;

    public atkbuff: number = 0;
    public defbuff: number = 0;

    public show: string = "face front";

    /* Utilisation de mémoire commune pour l'affichage */
    public img:string = "";
    public backColor:string="";
    public overlayColor:string="";


    public effect:[string] = [""];
    public effectText:string = "";
    public effectSize:number = 0;
    public effectDmg:number = 0;
    public effectTarget:string = "";
    public type:string="";

    constructor(obj:any){
        this.id=obj?.id;
        this.atk=obj?.atk;
        this.def=obj?.def;
        this.name=obj?.name;
        this.img=obj?.img;
        this.race=obj?.race;
        this.desc=obj?.desc;
        this.cost=obj?.cost;
        this.readyness=obj?.readyness;
        this.priority=obj?.priority;
        this.current_atk=obj?.current_atk;
        this.current_def=obj?.current_def;
        this.atkbuff=obj?.atkbuff;
        this.defbuff=obj?.defbuff;
        this.priority=obj?.priority;
        this.effect=obj?.effect;
        this.effectText=obj?.effectText;
        this.effectDmg=obj?.effectDmg;
        this.effectTarget=obj?.effectTarget;
        this.type=obj?.type;
        this.backColor=obj?.backColor;
        this.overlayColor=obj?.overlayColor;
    }

    
    //Méthode appelée lorsque l'on joue la carte
    init(){
        return 1
    }

    //Méthode appelée à chaque fin de tour 
    endTurn(){
        this.readyness=this.readyness+1
        this.atknumber=0
        return 1
    }

    //La méthode pour attaquer qui appelle la méthode de défense et applique les effets à l'attaque
    attacking(target:Card){
        var dmg = this.current_atk
        
        if (this.atknumber<1 || (this.atknumber<2 && this.parseEffect("Frenzy")==true)){
            if (this.parseEffect("AtkBuff")==true){
                this.current_atk+=this.atkbuff
                this.current_def+=this.defbuff
            }
            target.defending(dmg,this,true)
            this.atknumber=this.atknumber+1
        }
        return 1;
    }

    //La méthode pour défendre et contre attaquer
    defending(dmg:number,target:Card,lethal:boolean){
        this.current_def=this.current_def-dmg;
        return 1;
    }

    //La méthode a lancer à la mort de la carte
    death(){
        return 1
    }

    //Cherche si la carte possède un effet en particulier
    parseEffect(effect:string):boolean{
        var present=false
        for(var i=0;i<this.effect.length;i++){
            if(this.effect[i]==effect){
                present=true
            }
        }
        return present
    }

    

}

export const DEFAULT_TYPE: string = "";

// Tous les types de cartes possibles (pour le tri)

export const CARD_TYPES: any[] = [{ type: "", name: "Tous" },
{ type: "clubs", name: "clubs" },
{ type: "diamonds", name: "diamonds" },
{ type: "hearts", name: "hearts" },
{ type: "spades", name: "spades" },]

