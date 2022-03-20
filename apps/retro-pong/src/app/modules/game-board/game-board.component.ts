import { DOCUMENT } from '@angular/common';
import { Component, Inject, NgZone, OnDestroy, OnInit } from '@angular/core';
import { GameStateInterface, PlayerInterface, SideEnum } from '@retro-pong/api-interfaces';
import {
  distinctUntilKeyChanged,
  EMPTY,
  filter,
  fromEvent,
  map,
  merge,
  Observable,
  SubscriptionLike,
  switchMap,
  tap,
  timer,
} from 'rxjs';
import { directionMapper } from '../../core/consts/direction-mapper';
import { KeyboardEventEnum } from '../../core/enums/keyboard-event.enum';
import { GameBoardService } from './game-board.service';

@Component({
  selector: 'pong-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.scss'],
})
export class GameBoardComponent implements OnInit, OnDestroy {
  activePlayer = SideEnum.RIGHT; // how to get? not websocket I think

  gameState$: Observable<GameStateInterface>;

  playerBottom$: Observable<PlayerInterface>;
  playerRight$: Observable<PlayerInterface>;
  playerTop$: Observable<PlayerInterface>;
  playerLeft$: Observable<PlayerInterface>;

  private keySub: SubscriptionLike;

  constructor(
    private gameBoardService: GameBoardService,
    @Inject(DOCUMENT) private document: Document,
    private zone: NgZone
  ) {}

  ngOnInit(): void {
    this.gameState$ = this.gameBoardService.gameState$;
    this.playerBottom$ = this.gameBoardService.playerBottom$;
    this.playerRight$ = this.gameBoardService.playerRight$;
    this.playerTop$ = this.gameBoardService.playerTop$;
    this.playerLeft$ = this.gameBoardService.playerLeft$;

    this.gameBoardService.connect();
    this.zone.runOutsideAngular(() => {
      this.takeControl();
    });
  }

  ngOnDestroy(): void {
    this.keySub?.unsubscribe();
  }

  startGame(): void {
    this.gameBoardService.startGame();
  }

  private takeControl(): void {
    this.keySub = merge(
      fromEvent<KeyboardEvent>(this.document, 'keydown'),
      fromEvent<KeyboardEvent>(this.document, 'keyup')
    )
      .pipe(
        tap((event) => event.preventDefault()),
        filter((event) => {
          return this.activePlayer === SideEnum.BOTTOM || this.activePlayer === SideEnum.TOP
            ? event.key === KeyboardEventEnum.LEFT || event.key === KeyboardEventEnum.RIGHT
            : event.key === KeyboardEventEnum.UP || event.key === KeyboardEventEnum.DOWN;
        }),
        distinctUntilKeyChanged('type'),
        switchMap((event) => {
          if (event.type === 'keydown') {
            const direction = directionMapper[event.key as KeyboardEventEnum];
            return timer(0, 50).pipe(map(() => direction));
          } else {
            return EMPTY;
          }
        }),
        filter(Boolean)
      )
      .subscribe((direction) => {
        this.gameBoardService.sendPlayerUpdate(direction, this.activePlayer);
      });
  }
}
