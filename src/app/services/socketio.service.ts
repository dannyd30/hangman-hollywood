import { Injectable,EventEmitter } from '@angular/core';
import * as io from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { GameService } from './game.service';
@Injectable({
  providedIn: 'root'
})
export class SocketioService {
    socket;
    roomId: string;
    socketId:string;
    showErrorMsg: EventEmitter<any> = new EventEmitter<any>();
    _createRoomSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    createRoomObservable: Observable<any> = this._createRoomSubject.asObservable();
    _errorSubject:BehaviorSubject<any> = new BehaviorSubject<any>(null);
    errorObservable: Observable<any> = this._errorSubject.asObservable();
    gameState = {
      score:{},
      player:{},
      currentGame:null
    };

    constructor(
      private readonly _gameService: GameService
    ) { }

    setUpSocketIOConnection(){
      
        this.socket = io(environment.SOCKET_ENDPOINT);
        
        this.socket.emit('message', 'Hi There');
        this.socket.on('broadcast', (msg)=>{
          if(msg && msg === 'connected'){
            this.socketId = this.socket.id;
          }
        });
      this.socket.on('connError',(data)=>{
        console.error(data);
        this._errorSubject.next(data);
      });

      this.socket.on('roomId', (roomId) => {
        this.roomId = roomId;
        this._createRoomSubject.next({
          type:'room',
          data:roomId
        });
      });

      this.socket.on('readyToStart', (data) => {
        this._createRoomSubject.next({
          type: 'readyToStart'
        });
        this.mergeState(data);
      });

      this.socket.on('startGame', (data) => {
        this._createRoomSubject.next({
          type: 'startGame',
          data
        });
      });
    }

    createRoom(){
      this.setInitialState('create');
      this.socket.emit('create', this.gameState);
    }

    mergeState(state) {
      const gameState = {...this.gameState,...state};
      gameState.score = {...this.gameState.score,...state.score};
      gameState.player = {...this.gameState.player,...state.player};
      gameState.currentGame.activeGuesser =   (this.gameState.currentGame.activeGuesser.length > 0) ? this.gameState.currentGame.activeGuesser : state.currentGame.activeGuesser;
      gameState.currentGame.activeGiver = (this.gameState.currentGame.activeGiver.length > 0) ? this.gameState.currentGame.activeGiver : state.currentGame.activeGiver;
      
      this.gameState = gameState;
      console.dir(this.gameState);
    }

    setInitialState(type){
      if(type === 'create'){
        this.gameState[this.socketId] = {
          activePlayer:true,
          activeGuesser:false,
          activeGiver:true,
          passiveGuesser:true
        };
        this.gameState.score[this.socketId]= 0;
        this.gameState.player[this.socketId] = 'Player One';
        this.gameState.currentGame = {
          activeGuesser: '',
          selectedLetters:[],
          currentLetter:'',
          remainingChance:9,
          currentWord:'',
          foundWord:'',
          activeGiver: this.socketId 
        };
      } else {
        this.gameState[this.socketId] = {
          activePlayer:false,
          activeGuesser:true,
          activeGiver:false,
          passiveGuesser:false
        };
        this.gameState.score[this.socketId]= 0;
        this.gameState.player[this.socketId] = 'Player Two';
        this.gameState.currentGame = {
          activeGuesser:  this.socketId ,
          selectedLetters:[],
          currentLetter:'',
          remainingChance:9,
          currentWord:'',
          foundWord:'',
          activeGiver:''
        };
      }
      
    }

    startGame(){
      this.socket.emit('startGame', this.roomId, this.gameState);
    }
    
    joinRoom(roomId){
      this.setInitialState('join');
      this.socket.emit('join',roomId,this.gameState);
    }

    

}
