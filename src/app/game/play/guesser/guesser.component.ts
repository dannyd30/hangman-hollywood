import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { GameService } from 'src/app/services/game.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-guesser',
    templateUrl: './guesser.component.html',
    styleUrls: ['./guesser.component.scss']
})
export class GuesserComponent implements OnInit {
    hollywoodArr: string[] = 'HOLLYWOOD'.split('');
    alphabetArr:string[] = "BCDFGHJKLMNPQRTSVWXYZ".split("");
    vowels:string[] = ['A','E','I','O','U'];
    charRegex: RegExp = new RegExp(/^A-Za-z/g);
    movieNameArr:string[];
    selectedAlphabets: string[] = [];
    selectedAlphaIndices: number[] = [];
    leftChance = 9;
    movieName: string;
    gameOver:boolean;
    winner: string;
    showNextTurn=false;
    pointsTable;
    playerOnePoints: number;
    playerTwoPoints: number;
    activeGuesser: boolean;

    @Output('nextGame') nextGameEvent = new EventEmitter();
    constructor(
        private readonly _gameService: GameService,
        private readonly _router: Router
    ){}

    ngOnInit(){
        this._gameService.getGameState().subscribe((gameState) => this.handleGameState(gameState))
    }

    handleGameState(gameState): void {
        this.movieName = gameState && gameState.movieName;
        this.setMovieArea();
    }

    nextGame(){
        this.nextGameEvent.emit('');
        this._gameService.activePlayer = (this._gameService.activePlayer === 'playerOne') ? 'playerTwo' : 'playerOne';
    }

    alphaSelected(alpha:string, index:number):void | false{
        if(this.selected(alpha)) return false;
        
        this.selectedAlphabets.push(alpha);
        this.selectedAlphaIndices.push(index);

        if(this.movieName.indexOf(alpha.toLowerCase()) === -1 && this.movieName.indexOf(alpha.toUpperCase()) === -1){
            this.leftChance--;
        } else {
            this.setMovieArea();
        }

        if(this.leftChance === 0) this.updatePoints('giver');
        
    }

    updatePoints(playerType: string): void{
        if(playerType === 'giver') {
            this._gameService.activePlayer === 'playerOne' ? this._gameService.updatePoints('playerTwo','giver') : this._gameService.updatePoints('playerOne', 'giver');
        } else {
            this._gameService.activePlayer === 'playerTwo' ? this._gameService.updatePoints('playerTwo','guesser') : this._gameService.updatePoints('playerOne','guesser');
        }
        this.showNextTurn = true;
        this.pointsTable = this._gameService.pointsTable;
        this.playerOnePoints = this.pointsTable.get('playerOne');
        this.playerTwoPoints = this.pointsTable.get('playerTwo');
    }

    endGame(){
        this.gameOver = true;
        const points = this._gameService.pointsTable;
        const playerOnePts = points.get('playerOne');
        const playerTwoPts = points.get('playerTwo');
        this.winner =(playerTwoPts === playerOnePts) ? 'TIE' : (playerOnePts > playerTwoPts) ? 'Player One' : 'Player Two';
        this._gameService.endGame();
    }

    selected(alpha){
        return this.selectedAlphabets.indexOf(alpha) !== -1;
    }

    chanceLeft(i):boolean {
        if(i+1 <= (9-this.leftChance))
            return true;    
        return false;
    }

    private setMovieArea(){
        this.movieNameArr = this.movieName.split('').map((char) => {
            if(this.vowels.indexOf(char.toUpperCase()) !== -1 || this.charRegex.test(char) || this.selectedAlphabets.indexOf(char.toUpperCase()) !== -1)
                return char.toUpperCase();
            if(char === ' ') return null;
            return '';
        });

        if(this.movieNameArr.map(v => v===null? ' ': v).join('') === this.movieName.toUpperCase()) this.updatePoints('guesser');
    }

    goHome(){
        this._router.navigate(['home']);
    }
}