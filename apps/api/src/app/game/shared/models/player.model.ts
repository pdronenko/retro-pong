import { ArrowDirectionEnum, PlayerInterface, SideEnum } from '@retro-pong/api-interfaces';
import { Geometry } from '../../geometry';

export class PlayerModel implements PlayerInterface {
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

  constructor(name: string, axis: 'x' | 'y', side: SideEnum) {
    this.name = name;
    this.axis = axis;
    this.side = side;
  }

  reset(): void {
    this.active = false;
    this.width = Geometry.fieldSize;
    this.position = Geometry.fieldSize / 2;
  }

  activate(): void {
    this.active = true;
    this.width = Geometry.activePaddleWidth;
  }

  updatePlayerPosition(dir: ArrowDirectionEnum): PlayerInterface {
    const newPosition = this.position + PlayerModel.paddleShiftMapper[dir];
    const leftPlayerBorder = newPosition - this.width / 2;
    const rightPlayerBorder = newPosition + this.width / 2;
    if (leftPlayerBorder < 0 || rightPlayerBorder > Geometry.fieldSize) {
      return null;
    }
    this.position += PlayerModel.paddleShiftMapper[dir];
    return this;
  }
}
