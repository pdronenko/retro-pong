import { GameInterface, GameStatusEnum, SideEnum } from '@retro-pong/api-interfaces';
import { Observable, take, tap, timer } from 'rxjs';
import { Geometry } from '../../geometry';

export class GameModel implements GameInterface {
  ballDirection = {
    x: Geometry.centerPosition,
    y: Geometry.centerPosition,
    distance: 0,
    angle: 160,
    side: SideEnum.BOTTOM,
  };
  ballSpeed = Geometry.ballSpeed;
  status = GameStatusEnum.IDLE;
  count = null;

  reset(): void {
    this.status = GameStatusEnum.IDLE;
    this.ballDirection.x = Geometry.centerPosition;
    this.ballDirection.y = Geometry.centerPosition;
    this.ballDirection.distance = 0;
  }

  startWithDelay(): Observable<number> {
    this.status = GameStatusEnum.COUNTING;
    return timer(0, 1000).pipe(
      take(4),
      tap((num) => {
        if (num < 3) {
          this.count = 3 - num;
        } else {
          this.count = null;
          this.status = GameStatusEnum.PLAYING;
        }
      })
    );
  }
}
