import { ArrowDirectionEnum, PlayerInterface, SideEnum } from '@retro-pong/api-interfaces';
import { Geometry } from '../../geometry';

export class PlayerModel implements PlayerInterface {
  private static defaultLivesCount = 3;

  private static readonly paddleShiftMapper = {
    [ArrowDirectionEnum.LEFT]: -Geometry.paddleShift,
    [ArrowDirectionEnum.RIGHT]: Geometry.paddleShift,
    [ArrowDirectionEnum.UP]: Geometry.paddleShift,
    [ArrowDirectionEnum.DOWN]: -Geometry.paddleShift,
  };

  active = false;
  axis: 'x' | 'y';
  name: string;
  position = Geometry.fieldSize / 2;
  side: SideEnum;
  width = Geometry.fieldSize;
  lives = 0;

  constructor(name: string, axis: 'x' | 'y', side: SideEnum) {
    this.name = name;
    this.axis = axis;
    this.side = side;
  }

  reset(): void {
    this.lives = Math.max(this.lives - 1, 0);
    if (this.lives <= 0) {
      this.active = false;
      this.width = Geometry.fieldSize;
      this.position = Geometry.fieldSize / 2;
    }
  }

  activate(): void {
    this.active = true;
    this.lives = PlayerModel.defaultLivesCount;
    this.width = Geometry.activePaddleWidth;
  }

  updatePlayerPosition(dir: ArrowDirectionEnum): number {
    const shifted = this.position + PlayerModel.paddleShiftMapper[dir];
    const halfPaddle = this.width / 2;
    const newPosition = Math.min(shifted < halfPaddle ? halfPaddle : shifted, Geometry.fieldSize - halfPaddle);
    const isChanged = newPosition !== this.position;
    return isChanged ? (this.position = newPosition) : null;
  }
}
