import { Component, OnInit } from '@angular/core';
import { GameService } from 'src/app/services/game.service';
@Component({
    selector: 'app-giver',
    templateUrl: './giver.component.html',
    styleUrls: ['./giver.component.scss']
})
export class GiverComponent implements OnInit {
    movieName: string;
    constructor(
        private readonly _gameService: GameService
    ){

    }

    ngOnInit(){
        this._gameService.getGameState().subscribe((gameState) => {
            console.log(gameState);
        })
    }

    setMovieName(): void{
        this._gameService.setGameState('movieName', this.movieName);
        this._gameService.setGameState('timeToGuess', true);
    }
}