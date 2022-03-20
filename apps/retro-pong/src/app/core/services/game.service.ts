import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GameStateInterface, PlayerInterface, SideEnum, SocketEventEnum } from '@retro-pong/api-interfaces';
import { Socket } from 'ngx-socket-io';
import { BehaviorSubject, Observable, ReplaySubject, tap } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  currentPlayerSide$ = new ReplaySubject<SideEnum>(1);

  playerBottom$ = new ReplaySubject<PlayerInterface>(1);
  playerRight$ = new ReplaySubject<PlayerInterface>(1);
  playerTop$ = new ReplaySubject<PlayerInterface>(1);
  playerLeft$ = new ReplaySubject<PlayerInterface>(1);

  gameState$ = new ReplaySubject<GameStateInterface>(1);

  constructor(private socket: Socket, private httpClient: HttpClient, private apiService: ApiService) {}

  startGame(playerSide: SideEnum): Observable<string> {
    return this.apiService
      .postStartGame(playerSide)
      .pipe(tap((response) => response === 'OK' && this.currentPlayerSide$.next(playerSide)));
  }

  getGameState(): Observable<GameStateInterface> {
    return this.apiService.getGameState().pipe(tap((state) => this.gameState$.next(state)));
  }

  getPlayerState(): Observable<Record<SideEnum, PlayerInterface>> {
    return this.apiService.getPlayersState().pipe(
      tap((state) => {
        this.playerBottom$.next(state[SideEnum.BOTTOM]);
        this.playerRight$.next(state[SideEnum.RIGHT]);
        this.playerTop$.next(state[SideEnum.TOP]);
        this.playerLeft$.next(state[SideEnum.LEFT]);
      })
    );
  }

  connect(): void {
    this.socket.on(SocketEventEnum.GAME_UPDATE, (payload: GameStateInterface) => {
      if (payload.gameOver) {
        alert('GAME OVER');
      }
      this.gameState$.next(payload);
    });

    this.socket.on(SocketEventEnum.PLAYER_UPDATE, (playerUpdate: PlayerInterface) => {
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
