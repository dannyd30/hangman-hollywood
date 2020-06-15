import { Component, OnInit, Input } from '@angular/core';
import { GameService } from 'src/app/services/game.service';
import { GuesserComponent } from './guesser/guesser.component';
import { GiverComponent } from './giver/giver.component';
@Component({
    selector: 'app-play',
    templateUrl: './play.component.html',
    styleUrls: ['./play.component.scss']
})
export class PlayComponent implements OnInit {
    timeToGuess: boolean = false;
    @Input() online:boolean;
    @Input() roomCode:string;
    @Input() initialState:any;
    waitingForWord:boolean;
    waitingForNextTurn:boolean;
    constructor(
        private readonly _gameService: GameService
    ){}
    ngOnInit(){
        if(this.online){
            this._gameService.startGame('online');
            this.handleOnlineState();
        } else {
            this._gameService.getGameState().subscribe(gameState => this.handleGameState(gameState));
        }
        
    }

    handleOnlineState(){

    }

    handleGameState(gameState): void {
        this.timeToGuess = gameState.timeToGuess;
    }

    onNextGame():void{
        this.timeToGuess = false;
    }
}