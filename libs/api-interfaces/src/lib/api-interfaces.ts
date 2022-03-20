export interface GameInterface {
  ballDirection: BallDirectionInterface;
  ballSpeed: number;
  status: GameStatusEnum;
  count?: number;
}

export interface PlayerInterface {
  side: SideEnum;
  width: number;
  position: number;
  name: string;
  axis: 'x' | 'y';
  active: boolean;
}

export interface PlayerPayloadInterface {
  dir: ArrowDirectionEnum;
  side: SideEnum;
}

export interface BallDirectionInterface {
  x: number;
  y: number;
  distance: number;
  side: SideEnum;
  angle: number;
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

export enum GameStatusEnum {
  IDLE = 'idle',
  PLAYING = 'playing',
  COUNTING = 'counting',
}

export enum ApiRoutesEnum {
  GAME = 'game',
  PLAYERS = 'players',
}
