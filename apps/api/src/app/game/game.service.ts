import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import {
  ArrowDirectionEnum,
  BallPositionInterface,
  GameStateInterface,
  PlayerInterface,
  PlayerPayloadInterface,
  SideEnum,
  SocketEventEnum,
} from '@retro-pong/api-interfaces';

@WebSocketGateway(3000)
export class GameService {
  @WebSocketServer()
  private server: Server;

  private readonly paddleShift = 20;
  private readonly fieldSize = 600;
  private readonly ballSpeed = 0.5;
  private readonly activePaddleWidth = 150;

  private readonly paddleShiftMapper = {
    [ArrowDirectionEnum.LEFT]: -this.paddleShift,
    [ArrowDirectionEnum.RIGHT]: this.paddleShift,
    [ArrowDirectionEnum.UP]: this.paddleShift,
    [ArrowDirectionEnum.DOWN]: -this.paddleShift,
  };

  private gameState: GameStateInterface = {
    ballPosition: { x: 300, y: 300, distance: 0, degree: 160, side: SideEnum.BOTTOM },
    ballSpeed: this.ballSpeed,
    gameOver: false,
  };

  private players: Record<SideEnum, PlayerInterface> = {
    [SideEnum.BOTTOM]: {
      side: SideEnum.BOTTOM,
      width: 600,
      position: 300,
      name: 'Player 1',
      axis: 'x',
      active: false,
    },
    [SideEnum.RIGHT]: {
      side: SideEnum.RIGHT,
      width: 600,
      position: 300,
      name: 'Player 2',
      axis: 'y',
      active: false,
    },
    [SideEnum.TOP]: {
      side: SideEnum.TOP,
      width: 600,
      position: 300,
      name: 'Player 3',
      axis: 'x',
      active: false,
    },
    [SideEnum.LEFT]: {
      side: SideEnum.LEFT,
      width: 600,
      position: 300,
      name: 'Player 4',
      axis: 'y',
      active: false,
    },
  };

  @SubscribeMessage(SocketEventEnum.PLAYER_UPDATE)
  updatePlayer(@MessageBody() payload: PlayerPayloadInterface): void {
    const updatedPlayer = this.updatePlayerPosition(payload);
    if (updatedPlayer) {
      this.server.emit(SocketEventEnum.PLAYER_UPDATE, updatedPlayer);
    }
  }

  getGameState(): GameStateInterface {
    return this.gameState;
  }

  getPlayersState(): Record<SideEnum, PlayerInterface> {
    return this.players;
  }

  public startGame(): void {
    this.resetGameState();
    this.setNewBallCoordinates(this.gameState);
  }

  updatePlayerPosition(payload: PlayerPayloadInterface): PlayerInterface {
    const { position, width } = this.players[payload.side];
    const newPosition = position + this.paddleShiftMapper[payload.dir];
    const leftPlayerBorder = newPosition - width / 2;
    const rightPlayerBorder = newPosition + width / 2;
    if (leftPlayerBorder < 0 || rightPlayerBorder > this.fieldSize) {
      return null;
    }
    this.players[payload.side].position += this.paddleShiftMapper[payload.dir];
    return this.players[payload.side];
  }

  private resetGameState(): void {
    this.gameState.gameOver = false;
    this.gameState.ballPosition.x = 300;
    this.gameState.ballPosition.y = 300;
  }

  private setNewBallCoordinates(gameState: GameStateInterface): void {
    const newPosition = this.calcBallNewDirection(gameState);
    this.gameState.ballPosition = newPosition;
    this.server.emit(SocketEventEnum.GAME_UPDATE, this.gameState);
    setTimeout(() => {
      const player = this.players[gameState.ballPosition.side];
      if (this.isPlayerMissedTheBall(player.width, player.position, gameState.ballPosition[player.axis])) {
        this.gameState.gameOver = true;
        this.server.emit(SocketEventEnum.GAME_UPDATE, this.gameState);
        return;
      }
      this.setNewBallCoordinates(this.gameState);
    }, newPosition.distance / this.gameState.ballSpeed);
  }

  private calcBallNewDirection(gameState: GameStateInterface): BallPositionInterface {
    const { x: x1, y: y1, degree: ballDirectionDegree, side: currentSide } = gameState.ballPosition;
    const newAngle = this.bouncedAngle(ballDirectionDegree);
    let tan = Math.tan((newAngle * Math.PI) / 180);

    // todo refactor, if top - next will be left or bottom
    let nextSide: SideEnum = this.addSide(currentSide);
    // todo next side enum
    // todo add field to state? to minimize switch
    let triangleSideLength: number;
    let x2: number, y2: number;
    switch (currentSide) {
      case SideEnum.BOTTOM:
        triangleSideLength = (this.fieldSize - x1) * tan;
        x2 = this.fieldSize;
        y2 = triangleSideLength;
        if (y2 > this.fieldSize) {
          x2 = this.calculateSide2Length(Math.abs(y2), 90 - newAngle);
          y2 = this.fieldSize;
          nextSide = this.addSide(nextSide);
        }
        break;
      case SideEnum.RIGHT:
        triangleSideLength = (this.fieldSize - y1) * tan;
        x2 = this.fieldSize - triangleSideLength;
        y2 = this.fieldSize;
        if (x2 < 0) {
          y2 = this.fieldSize - this.calculateSide2Length(Math.abs(x2), 90 - newAngle);
          x2 = 0;
          nextSide = this.addSide(nextSide);
        }
        break;
      case SideEnum.TOP:
        triangleSideLength = x1 * tan;
        x2 = 0;
        y2 = this.fieldSize - triangleSideLength;
        if (y2 < 0) {
          x2 = this.calculateSide2Length(Math.abs(y2), 90 - newAngle);
          y2 = 0;
          nextSide = this.addSide(nextSide);
        }
        break;
      case SideEnum.LEFT:
        tan = Math.tan(((newAngle < 90 ? 90 - newAngle : newAngle) * Math.PI) / 180);
        triangleSideLength = (this.fieldSize - y1) * tan;
        x2 = triangleSideLength;
        y2 = 0;
        if (x2 > this.fieldSize) {
          y2 = this.fieldSize - this.calculateSide2Length(Math.abs(x2 - this.fieldSize), 90 - (90 - newAngle));
          x2 = this.fieldSize;
          nextSide = this.addSide(nextSide);
        }
        break;
    }

    const newDistance = Math.hypot(x2 - x1, y2 - y1); // todo slow?

    return { x: x2, y: y2, degree: newAngle + 90, distance: newDistance, side: nextSide };
  }

  private calculateSide2Length(side1Length: number, angle: number): number {
    return side1Length * Math.tan((angle * Math.PI) / 180);
  }

  private addSide(side: SideEnum): SideEnum {
    return (side + 1) % 4;
  }

  private bouncedAngle(angle: number): number {
    // todo normal angle calculation
    return 180 - angle;
  }

  private isPlayerMissedTheBall(playerWidth: number, playerPosition: number, ballPosition: number): boolean {
    const leftPlayerBorder = playerPosition - playerWidth / 2;
    const rightPlayerBorder = playerPosition + playerWidth / 2;
    return ballPosition < leftPlayerBorder || ballPosition > rightPlayerBorder;
  }
}
