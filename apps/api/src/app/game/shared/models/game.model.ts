import { BallDirectionInterface, GameInterface, GameStatusEnum, SideEnum } from '@retro-pong/api-interfaces';
import { Observable, take, tap, timer } from 'rxjs';
import { Geometry } from '../../geometry';

export class GameModel implements GameInterface {
  private readonly defaultBallDirection: BallDirectionInterface = {
    x: Geometry.fieldSize / 2 - 50, // todo random
    y: Geometry.fieldSize / 2 + 50,
    distance: 0,
    side: SideEnum.BOTTOM,
  };

  ballDirection: BallDirectionInterface = { ...this.defaultBallDirection };
  ballSpeed = Geometry.ballSpeed;
  status = GameStatusEnum.IDLE;
  activePlayersCount = 0;
  count = null;

  reset(): void {
    this.ballDirection = { ...this.defaultBallDirection };
    this.status = GameStatusEnum.IDLE;
  }

  startWithDelay(): Observable<number> {
    this.status = GameStatusEnum.COUNTING;
    return timer(0, 1000).pipe(
      take(Geometry.countdown + 1),
      tap((num) => {
        if (num < Geometry.countdown) {
          this.count = Geometry.countdown - num;
        } else {
          this.count = null;
          this.status = GameStatusEnum.PLAYING;
        }
      })
    );
  }
}
