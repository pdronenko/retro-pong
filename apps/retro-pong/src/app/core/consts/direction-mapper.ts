import { ArrowDirectionEnum } from '@retro-pong/api-interfaces';
import { KeyboardEventEnum } from '../enums/keyboard-event.enum';

export const directionMapper = {
  [KeyboardEventEnum.LEFT]: ArrowDirectionEnum.LEFT,
  [KeyboardEventEnum.RIGHT]: ArrowDirectionEnum.RIGHT,
  [KeyboardEventEnum.UP]: ArrowDirectionEnum.UP,
  [KeyboardEventEnum.DOWN]: ArrowDirectionEnum.DOWN,
};
