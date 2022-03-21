import { DOCUMENT } from '@angular/common';
import { Component, Inject, NgZone, OnDestroy, OnInit } from '@angular/core';
import { GameInterface, PlayerInterface, SideEnum } from '@retro-pong/api-interfaces';
import {
  distinctUntilKeyChanged,
  EMPTY,
  filter,
  fromEvent,
  map,
  merge,
  Observable,
  Subscription,
  SubscriptionLike,
  switchMap,
  tap,
  timer,
} from 'rxjs';
import { directionMapper } from '../../core/consts/direction-mapper';
import { KeyboardEventEnum } from '../../core/enums/keyboard-event.enum';
import { GameService } from '../../core/services/game.service';

@Component({
  selector: 'pong-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.scss'],
})
export class GameBoardComponent implements OnInit, OnDestroy {
  gameState$: Observable<GameInterface>;

  playerBottom$: Observable<PlayerInterface>;
  playerRight$: Observable<PlayerInterface>;
  playerTop$: Observable<PlayerInterface>;
  playerLeft$: Observable<PlayerInterface>;

  private currentPlayerSide: SideEnum | null;

  private subs = new Subscription();
  private keySub: SubscriptionLike;

  constructor(private gameService: GameService, @Inject(DOCUMENT) private document: Document, private zone: NgZone) {}

  ngOnInit(): void {
    this.gameState$ = this.gameService.gameState$;
    this.playerBottom$ = this.gameService.playerBottom$;
    this.playerRight$ = this.gameService.playerRight$;
    this.playerTop$ = this.gameService.playerTop$;
    this.playerLeft$ = this.gameService.playerLeft$;

    this.subs.add(this.gameService.getGameState().subscribe());
    this.subs.add(this.gameService.getPlayerState().subscribe());
    this.subs.add(this.gameService.connect().subscribe());
    this.subs.add(
      this.gameService.currentPlayerSide$
        .pipe(filter((currentPlayerSide) => currentPlayerSide !== null && currentPlayerSide in SideEnum))
        .subscribe((side) => {
          this.currentPlayerSide = side;
          this.zone.runOutsideAngular(() => {
            this.takeControl();
          });
        })
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
    this.keySub?.unsubscribe();
  }

  private takeControl(): void {
    this.keySub?.unsubscribe();
    this.keySub = merge(
      fromEvent<KeyboardEvent>(this.document, 'keydown'),
      fromEvent<KeyboardEvent>(this.document, 'keyup')
    )
      .pipe(
        tap((event) => event.preventDefault()),
        filter((event) => {
          if (this.currentPlayerSide === null) return false;
          return this.currentPlayerSide === SideEnum.BOTTOM || this.currentPlayerSide === SideEnum.TOP
            ? event.key === KeyboardEventEnum.LEFT || event.key === KeyboardEventEnum.RIGHT
            : event.key === KeyboardEventEnum.UP || event.key === KeyboardEventEnum.DOWN;
        }),
        distinctUntilKeyChanged('type'),
        switchMap((event) => {
          if (event.type === 'keydown') {
            const direction = directionMapper[event.key as KeyboardEventEnum];
            return timer(0, 150).pipe(map(() => direction));
          } else {
            return EMPTY;
          }
        }),
        filter(Boolean)
      )
      .subscribe((direction) => {
        this.gameService.sendPlayerUpdate(direction, this.currentPlayerSide as SideEnum);
      });
  }
}
