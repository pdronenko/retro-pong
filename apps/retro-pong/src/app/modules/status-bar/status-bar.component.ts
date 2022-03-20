import { Component, OnDestroy, OnInit } from '@angular/core';
import { PlayerInterface, SideEnum } from '@retro-pong/api-interfaces';
import { Observable, Subscription } from 'rxjs';
import { GameService } from '../../core/services/game.service';

@Component({
  selector: 'pong-status-bar',
  templateUrl: './status-bar.component.html',
  styleUrls: ['./status-bar.component.scss'],
})
export class StatusBarComponent implements OnInit, OnDestroy {
  playerBottom$: Observable<PlayerInterface>;
  playerRight$: Observable<PlayerInterface>;
  playerTop$: Observable<PlayerInterface>;
  playerLeft$: Observable<PlayerInterface>;
  playing = false;

  private subs = new Subscription();

  constructor(private gameService: GameService) {}

  ngOnInit(): void {
    this.subs.add(
      this.gameService.currentPlayerSide$.subscribe((side) => {
        this.playing = side !== null;
      })
    );
    this.playerBottom$ = this.gameService.playerBottom$;
    this.playerRight$ = this.gameService.playerRight$;
    this.playerTop$ = this.gameService.playerTop$;
    this.playerLeft$ = this.gameService.playerLeft$;
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  startGame(side: SideEnum): void {
    this.subs.add(this.gameService.startGame(side).subscribe());
  }
}
