import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import {
  ArrowDirectionEnum,
  GameStateInterface,
  GameStatusEnum,
  PlayerInterface,
  PlayerPayloadInterface,
  SideEnum,
  SocketEventEnum,
} from '@retro-pong/api-interfaces';
import { Server } from 'socket.io';
import { GeometryService } from './geometry.service';

@WebSocketGateway()
export class GameService {
  @WebSocketServer()
  private server: Server;

  private readonly paddleShift = 20;
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
    status: GameStatusEnum.IDLE,
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

  public startGame(side: SideEnum): void {
    this.players[side].active = true;
    this.players[side].width = this.activePaddleWidth;
    this.server.emit(SocketEventEnum.PLAYER_UPDATE, this.players[side]);

    if (this.gameState.status === GameStatusEnum.IDLE) {
      this.gameState.status = GameStatusEnum.PLAYING;
      this.setNewBallCoordinates(this.gameState);
    }
  }

  updatePlayerPosition(payload: PlayerPayloadInterface): PlayerInterface {
    const { position, width } = this.players[payload.side];
    const newPosition = position + this.paddleShiftMapper[payload.dir];
    const leftPlayerBorder = newPosition - width / 2;
    const rightPlayerBorder = newPosition + width / 2;
    if (leftPlayerBorder < 0 || rightPlayerBorder > GeometryService.fieldSize) {
      return null;
    }
    this.players[payload.side].position += this.paddleShiftMapper[payload.dir];
    return this.players[payload.side];
  }

  private resetGameState(): void {
    this.gameState.status = GameStatusEnum.IDLE;
    this.gameState.ballPosition.x = 300;
    this.gameState.ballPosition.y = 300;
    this.gameState.ballPosition.distance = 0;
  }

  private setNewBallCoordinates(gameState: GameStateInterface): void {
    const newPosition = GeometryService.calcBallNewDirection(gameState);
    this.gameState.ballPosition = newPosition;
    this.server.emit(SocketEventEnum.GAME_UPDATE, this.gameState);
    setTimeout(() => {
      const player = this.players[gameState.ballPosition.side];
      if (GeometryService.isPlayerMissedTheBall(player.width, player.position, gameState.ballPosition[player.axis])) {
        this.resetGameState();
        this.server.emit(SocketEventEnum.GAME_UPDATE, this.gameState);
        return;
      }
      this.setNewBallCoordinates(this.gameState);
    }, newPosition.distance / this.gameState.ballSpeed);
  }
}
