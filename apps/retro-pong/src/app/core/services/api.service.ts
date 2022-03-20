import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiRoutesEnum, GameStateInterface, PlayerInterface, SideEnum } from '@retro-pong/api-interfaces';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly baseHref = `${location.origin}/api/`;

  constructor(private httpClient: HttpClient) {
    console.log('baseHref', this.baseHref);
  }

  postStartGame(): Observable<void> {
    return this.httpClient.post<void>(`${this.baseHref}/${ApiRoutesEnum.START_GAME}`, null);
  }

  getGameState(): Observable<GameStateInterface> {
    return this.httpClient.get<GameStateInterface>(`${this.baseHref}/${ApiRoutesEnum.GAME_STATE}`);
  }

  getPlayersState(): Observable<Record<SideEnum, PlayerInterface>> {
    return this.httpClient.get<Record<SideEnum, PlayerInterface>>(`${this.baseHref}/${ApiRoutesEnum.PLAYER_STATE}`);
  }
}
