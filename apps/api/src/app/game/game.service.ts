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

  private readonly paddleShiftMapper = {
    [ArrowDirectionEnum.LEFT]: -GeometryService.paddleShift,
    [ArrowDirectionEnum.RIGHT]: GeometryService.paddleShift,
    [ArrowDirectionEnum.UP]: GeometryService.paddleShift,
    [ArrowDirectionEnum.DOWN]: -GeometryService.paddleShift,
  };

  private gameState: GameStateInterface = {
    ballPosition: {
      x: GeometryService.centerPosition,
      y: GeometryService.centerPosition,
      distance: 0,
      degree: 160,
      side: SideEnum.BOTTOM,
    },
    ballSpeed: GeometryService.ballSpeed,
    status: GameStatusEnum.IDLE,
  };

  private players: Record<SideEnum, PlayerInterface> = {
    [SideEnum.BOTTOM]: {
      // todo to model?
      side: SideEnum.BOTTOM,
      width: GeometryService.fieldSize,
      position: GeometryService.centerPosition,
      name: 'Player 1',
      axis: 'x',
      active: false,
    },
    [SideEnum.RIGHT]: {
      side: SideEnum.RIGHT,
      width: GeometryService.fieldSize,
      position: GeometryService.centerPosition,
      name: 'Player 2',
      axis: 'y',
      active: false,
    },
    [SideEnum.TOP]: {
      side: SideEnum.TOP,
      width: GeometryService.fieldSize,
      position: GeometryService.centerPosition,
      name: 'Player 3',
      axis: 'x',
      active: false,
    },
    [SideEnum.LEFT]: {
      side: SideEnum.LEFT,
      width: GeometryService.fieldSize,
      position: GeometryService.centerPosition,
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
    this.players[side].width = GeometryService.activePaddleWidth;
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
    this.gameState.ballPosition.x = GeometryService.centerPosition;
    this.gameState.ballPosition.y = GeometryService.centerPosition;
    this.gameState.ballPosition.distance = 0;
    this.server.emit(SocketEventEnum.GAME_UPDATE, this.gameState);
  }

  private resetPlayer(side: SideEnum): void {
    this.players[side].active = false;
    this.players[side].width = GeometryService.fieldSize;
    this.players[side].position = GeometryService.centerPosition;
    this.server.emit(SocketEventEnum.PLAYER_UPDATE, this.players[side]);
  }

  private setNewBallCoordinates(gameState: GameStateInterface): void {
    const newPosition = GeometryService.calcBallNewDirection(gameState);
    this.gameState.ballPosition = newPosition;
    this.server.emit(SocketEventEnum.GAME_UPDATE, this.gameState);
    setTimeout(() => {
      const player = this.players[gameState.ballPosition.side];
      if (GeometryService.isPlayerMissedTheBall(player.width, player.position, gameState.ballPosition[player.axis])) {
        this.resetGameState();
        this.resetPlayer(player.side);
        return;
      }
      this.setNewBallCoordinates(this.gameState);
    }, newPosition.distance / this.gameState.ballSpeed);
  }
}
