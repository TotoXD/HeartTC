import { Timestamp } from "rxjs";

export interface User {
    mailAdress: String,
    pseudo: String,
    password: String,
    currentDeck: String,
    totalGames: Number,
    totalWins: Number,
    timestamps: number,
}