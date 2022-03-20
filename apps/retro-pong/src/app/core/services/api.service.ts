import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiRoutesEnum, GameStateInterface, PlayerInterface, SideEnum } from '@retro-pong/api-interfaces';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly baseHref = `${location.origin}/api`;

  constructor(private httpClient: HttpClient) {}

  postStartGame(playerSide: SideEnum): Observable<{ side: SideEnum }> {
    return this.httpClient.post<{ side: SideEnum }>(`${this.baseHref}/${ApiRoutesEnum.GAME}`, { side: playerSide });
  }

  getGameState(): Observable<GameStateInterface> {
    return this.httpClient.get<GameStateInterface>(`${this.baseHref}/${ApiRoutesEnum.GAME}`);
  }

  getPlayersState(): Observable<Record<SideEnum, PlayerInterface>> {
    return this.httpClient.get<Record<SideEnum, PlayerInterface>>(`${this.baseHref}/${ApiRoutesEnum.PLAYERS}`);
  }
}
