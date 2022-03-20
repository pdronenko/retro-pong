import { PlayerInterface, SideEnum } from '@retro-pong/api-interfaces';
import { Geometry } from '../../geometry';

export class PlayerModel implements PlayerInterface {
  active = false;
  axis: 'x' | 'y';
  name: string;
  position = Geometry.centerPosition;
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
    this.position = Geometry.centerPosition;
  }
}
