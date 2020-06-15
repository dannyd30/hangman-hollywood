import { Component, OnInit } from '@angular/core';
import { GameService } from '../services/game.service';
import { OnlineComponent } from './online/online.component';
import { PlayComponent } from './play/play.component'; 
import { Router } from '@angular/router';
import { SocketioService } from '../services/socketio.service';
@Component({
    selector: 'app-game',
    templateUrl: './game.component.html',
    styleUrls:['./game.component.scss']
})
export class GameComponent implements OnInit{
    gameType: string;
    roomType: string;
    roomId;
    enterGame = false;
    showRoomIdError= false;
    startGame: boolean;
    constructor(
        private readonly _gameService: GameService,
        private readonly router: Router,
        private readonly _socket: SocketioService
    ){

    }

    ngOnInit(){
        this.gameType = this._gameService.gameType;
        if(!this.gameType) this.router.navigate(['home']);

       
    }

    onOnlineEvent(event){
        if(event && event.type){
            switch(event.type){
                case 'back':
                    this.enterGame = false;
            }
        }
    }

    setRoomType(type:string):void{
        this.roomType=type;
        this.enterGame = true;
        
    }

    startTheGame(){
        this.startGame = true;
        this._gameService.startGame('local');
    }
}