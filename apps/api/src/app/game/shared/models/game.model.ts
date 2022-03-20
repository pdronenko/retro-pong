import { GameInterface, GameStatusEnum, SideEnum } from '@retro-pong/api-interfaces';
import { Geometry } from '../../geometry';

export class GameModel implements GameInterface {
  ballPosition = {
    x: Geometry.centerPosition,
    y: Geometry.centerPosition,
    distance: 0,
    degree: 160,
    side: SideEnum.BOTTOM,
  };
  ballSpeed = Geometry.ballSpeed;
  status = GameStatusEnum.IDLE;

  reset(): void {
    this.status = GameStatusEnum.IDLE;
    this.ballPosition.x = Geometry.centerPosition;
    this.ballPosition.y = Geometry.centerPosition;
    this.ballPosition.distance = 0;
  }
}
