import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GameStateInterface, PlayerInterface, SideEnum, SocketEventEnum } from '@retro-pong/api-interfaces';
import { Socket } from 'ngx-socket-io';
import { ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GameBoardService {
  playerBottom$ = new ReplaySubject<PlayerInterface>(1);
  playerRight$ = new ReplaySubject<PlayerInterface>(1);
  playerTop$ = new ReplaySubject<PlayerInterface>(1);
  playerLeft$ = new ReplaySubject<PlayerInterface>(1);

  gameState$ = new ReplaySubject<GameStateInterface>(1);

  constructor(private socket: Socket, private httpClient: HttpClient) {}

  startGame(): void {
    // todo body?
    this.httpClient.post<void>('http://localhost:3333/api/start-game', {}).subscribe();
  }

  connect(): void {
    this.httpClient.get<GameStateInterface>('http://localhost:3333/api/game-state').subscribe((state) => {
      this.gameState$.next(state); // todo move subscribe somewhere?
    });

    this.httpClient
      .get<Record<SideEnum, PlayerInterface>>('http://localhost:3333/api/player-state')
      .subscribe((state) => {
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

  sendPlayerUpdate(dir: string, side: SideEnum): void {
    this.socket.emit(SocketEventEnum.PLAYER_UPDATE, { dir, side });
  }
}
