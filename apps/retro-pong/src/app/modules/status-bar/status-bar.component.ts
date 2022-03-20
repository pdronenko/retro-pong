import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { PlayerInterface, SideEnum } from '@retro-pong/api-interfaces';
import { Observable, Subscription } from 'rxjs';
import { GameService } from '../../core/services/game.service';

@Component({
  selector: 'pong-status-bar',
  templateUrl: './status-bar.component.html',
  styleUrls: ['./status-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusBarComponent implements OnInit, OnDestroy {
  currentPlayerSide$: Observable<SideEnum>;
  playerBottom$: Observable<PlayerInterface>;
  playerRight$: Observable<PlayerInterface>;
  playerTop$: Observable<PlayerInterface>;
  playerLeft$: Observable<PlayerInterface>;
  playing = false;

  private subs = new Subscription();

  constructor(private gameService: GameService) {}

  ngOnInit(): void {
    this.currentPlayerSide$ = this.gameService.currentPlayerSide$;
    this.playerBottom$ = this.gameService.playerBottom$;
    this.playerRight$ = this.gameService.playerRight$;
    this.playerTop$ = this.gameService.playerTop$;
    this.playerLeft$ = this.gameService.playerLeft$;
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  startGame(side: SideEnum): void {
    this.subs.add(
      this.gameService.startGame(side).subscribe(({ side }) => {
        if (side in SideEnum) {
          this.playing = true;
        }
      })
    );
  }
}
