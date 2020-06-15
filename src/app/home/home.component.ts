import {Component} from '@angular/core';
import { GameService } from '../services/game.service';
import { Router } from '@angular/router';
import { SocketioService } from '../services/socketio.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent {
    constructor(
        private readonly _gameService: GameService,
        private readonly _router: Router,
        private readonly _socket: SocketioService
    ){}

    setGameType(type: string): void{
        this._gameService.gameType = type;
        this._router.navigate(["/game"]);

        if(type === 'online'){
            this._socket.setUpSocketIOConnection()
        }
    }
}