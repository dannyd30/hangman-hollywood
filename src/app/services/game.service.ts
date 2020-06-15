import {Injectable} from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

interface OnlineGameState {
    
    [key:string]: CurrentPlayerState;
    // score: Score;
}

interface  CurrentPlayerState {
    activePlayer: boolean;
    activeGuesser: boolean;
    activeGiver: boolean;
}

interface Score {
    [propName: string] : number;
}
@Injectable({
    providedIn: 'root'
})
export class GameService {
    constructor(){

    }

    onlineGame:boolean;

    _onlineGameState:OnlineGameState;


    setInitOnlineGameState(){

    }
    
    _gameState:any = {};
    _pointsTable: Map<string,number> = new Map<string,number>();
    
    gameStateSubject: BehaviorSubject<any> = new BehaviorSubject<any>(this._gameState);
    gameStateObservable: Observable<any> = this.gameStateSubject.asObservable();

    _gameType:string;
    set gameType(type:string){
        this._gameType = type;
    }
    get gameType(){
        return this._gameType;
    }

    _activePlayer: string; //will be guesser
    set activePlayer(player:string){
        this._activePlayer = player;
    }

    get activePlayer(){
        return this._activePlayer;
    }

    getGameState(){
        return this.gameStateObservable;
    }

    setGameState(key:string, value:any):void{
        this._gameState[key] = value;
        this.gameStateSubject.next(this._gameState);
    }

    startGame(type): void{
        if(type==='local'){
            this._pointsTable.set('playerOne',0);
        this._pointsTable.set('playerTwo',0);
        this.activePlayer = 'playerTwo';
        this.endGame();
        this.gameStateSubject.next(this._gameState);
        }else {
            const initialOnlineState = {};
            const socketId = thi
        }
        
    }

    get pointsTable() {
        return this._pointsTable;
    }

    updatePoints(player: string, count: string){
        const currentPoints = this._pointsTable.get(player);
        const updatedPoints = (count === 'giver') ? currentPoints+1: currentPoints+2;
        this._pointsTable.set(player, updatedPoints);
    }

    endGame(){
        this._pointsTable.set('playerOne',0);
        this._pointsTable.set('playerTwo',0);
        this._gameState['movieName'] = null;
        this._gameState['timeToGuess'] = false;
    }
}