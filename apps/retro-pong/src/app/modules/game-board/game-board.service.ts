import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GameStateInterface, PlayerInterface, SideEnum, SocketEventEnum } from '@retro-pong/api-interfaces';
import { Socket } from 'ngx-socket-io';
import { ReplaySubject } from 'rxjs';
import { ApiService } from '../../core/services/api.service';

@Injectable({
  providedIn: 'root',
})
export class GameBoardService {
  playerBottom$ = new ReplaySubject<PlayerInterface>(1);
  playerRight$ = new ReplaySubject<PlayerInterface>(1);
  playerTop$ = new ReplaySubject<PlayerInterface>(1);
  playerLeft$ = new ReplaySubject<PlayerInterface>(1);

  gameState$ = new ReplaySubject<GameStateInterface>(1);

  constructor(private socket: Socket, private httpClient: HttpClient, private apiService: ApiService) {}

  startGame(): void {
    this.apiService.postStartGame().subscribe(); // todo naming
  }

  connect(): void {
    this.apiService.getGameState().subscribe((state) => {
      this.gameState$.next(state); // todo move subscribe somewhere?
    });

    this.apiService.getPlayersState().subscribe((state) => {
      this.playerBottom$.next(state[SideEnum.BOTTOM]);
      this.playerRight$.next(state[SideEnum.RIGHT]);
      this.playerTop$.next(state[SideEnum.TOP]);
      this.playerLeft$.next(state[SideEnum.LEFT]);
    });

    this.socket.on(SocketEventEnum.GAME_UPDATE, (payload: GameStateInterface) => {
      console.log('SOCKET IN', SocketEventEnum.GAME_UPDATE);
      if (payload.gameOver) {
        alert('GAME OVER');
      }
      this.gameState$.next(payload);
    });

    this.socket.on(SocketEventEnum.PLAYER_UPDATE, (playerUpdate: PlayerInterface) => {
      console.log('SOCKET IN', SocketEventEnum.PLAYER_UPDATE);
      switch (playerUpdate.side) {
        case SideEnum.BOTTOM:
          this.playerBottom$.next(playerUpdate);
          break;
        case SideEnum.RIGHT:
          this.playerRight$.next(playerUpdate);
          break;
        case SideEnum.TOP:
          this.playerTop$.next(playerUpdate);
          break;
        case SideEnum.LEFT:
          this.playerLeft$.next(playerUpdate);
          break;
      }
    });
  }

  disconnect(): void {
    this.socket.removeAllListeners(SocketEventEnum.PLAYER_UPDATE);
    this.socket.removeAllListeners(SocketEventEnum.GAME_UPDATE);
  }

  sendPlayerUpdate(dir: string, side: SideEnum): void {
    this.socket.emit(SocketEventEnum.PLAYER_UPDATE, { dir, side });
  }
}
