import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { SocketioService } from '../../services/socketio.service';
import { GameService } from '../../services/game.service';
@Component({
    selector:'app-online',
    templateUrl: './online.component.html',
    styleUrls: ['./online.component.scss']
})
export class OnlineComponent implements OnInit{
    @Input('roomType') roomType: string;
    @Output('onlineEvent') onlineEvent = new EventEmitter();
    roomCode:string;
    playerName:string;
    showRoomError:boolean;
    showId = false;
    nameError = false;
    roomObservable;
    errorObservable;
    startGame=false;
    readyToStart=false;
    gameState;
    constructor(
        private readonly _socket: SocketioService,
        private readonly _gameService: GameService
    ){}

    ngOnInit(): void{
        this.roomObservable =  this._socket.createRoomObservable.subscribe(event => {
            if(!event || !event.data || (event.data && event.data.length === 0)){
                this.showRoomError = true;
               
            } else if(event && event.type === 'room'){
                this.roomCode = event.data;
                this.showId=true;
            }

            if(event && event.type==='readyToStart'){
                this.readyToStart = true;
            }

            if(event && event.type === 'startGame'){
                this.readyToStart = false;
                this.startGame = true;
                this.gameState = event.data;
            }
        });

        this.errorObservable = this._socket.errorObservable.subscribe(error => {
            if(!!error)
                this.showRoomError = true;
        })
    }

    createRoom(): void{
        if(!this.playerName || (this.playerName && this.playerName.length === 0)) {
            this.nameError = true;
            return;
        }
        this._socket.createRoom();
    }

    joinRoom(): void{
        if(!this.roomCode || (this.roomCode && this.roomCode.length === 0)) this.showRoomError = true;
        this._socket.joinRoom(this.roomCode);
    }

    start():void{
        this._socket.startGame();
    }

    goBack(): void{
        this.onlineEvent.emit({
            type: 'back',
            value: null
        });
    }

   

    ngOnDestroy(): void{
        if(this.roomObservable) this.roomObservable.unsubscribe();
        if(this.errorObservable) this.errorObservable.unsubscribe();
    }
}
