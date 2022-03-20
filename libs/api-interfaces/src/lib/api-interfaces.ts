export interface GameStateInterface {
  ballPosition: BallPositionInterface;
  ballSpeed: number;
  gameOver: boolean;
}

export interface PlayerInterface {
  side: SideEnum;
  width: number;
  position: number;
  name: string;
  axis: 'x' | 'y';
}

export interface PlayerPayloadInterface {
  dir: ArrowDirectionEnum;
  side: SideEnum;
}

export interface BallPositionInterface {
  // todo naming
  x: number;
  y: number;
  distance: number;
  side: SideEnum;
  degree: number; // todo angle, not degree?
}

export enum SideEnum {
  BOTTOM,
  RIGHT,
  TOP,
  LEFT,
}

export enum SocketEventEnum {
  PLAYER_UPDATE = 'playerUpdate',
  GAME_UPDATE = 'gameUpdate',
}

export enum ArrowDirectionEnum {
  LEFT = 'left',
  RIGHT = 'right',
  UP = 'up',
  DOWN = 'down',
}

export enum ApiRoutesEnum {
  GAME = 'game',
  PLAYERS = 'players',
}
