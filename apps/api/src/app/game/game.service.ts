import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import {
  ArrowDirectionEnum,
  GameInterface,
  GameStatusEnum,
  PlayerInterface,
  PlayerPayloadInterface,
  SideEnum,
  SocketEventEnum,
} from '@retro-pong/api-interfaces';
import { Server } from 'socket.io';
import { Geometry } from './geometry';
import { GameModel } from './shared/models/game.model';
import { PlayerModel } from './shared/models/player.model';

@WebSocketGateway()
export class GameService {
  @WebSocketServer()
  private server: Server;

  private readonly paddleShiftMapper = {
    [ArrowDirectionEnum.LEFT]: -Geometry.paddleShift,
    [ArrowDirectionEnum.RIGHT]: Geometry.paddleShift,
    [ArrowDirectionEnum.UP]: Geometry.paddleShift,
    [ArrowDirectionEnum.DOWN]: -Geometry.paddleShift,
  };

  private gameState = new GameModel();

  private players: Record<SideEnum, PlayerModel> = {
    [SideEnum.BOTTOM]: new PlayerModel('Player 1', 'x', SideEnum.BOTTOM),
    [SideEnum.RIGHT]: new PlayerModel('Player 2', 'y', SideEnum.RIGHT),
    [SideEnum.TOP]: new PlayerModel('Player 3', 'x', SideEnum.TOP),
    [SideEnum.LEFT]: new PlayerModel('Player 4', 'y', SideEnum.LEFT),
  };

  @SubscribeMessage(SocketEventEnum.PLAYER_UPDATE)
  updatePlayer(@MessageBody() payload: PlayerPayloadInterface): void {
    const updatedPlayer = this.updatePlayerPosition(payload);
    if (updatedPlayer) {
      this.server.emit(SocketEventEnum.PLAYER_UPDATE, updatedPlayer);
    }
  }

  getGameState(): GameInterface {
    return this.gameState;
  }

  getPlayersState(): Record<SideEnum, PlayerInterface> {
    return this.players;
  }

  public startGame(side: SideEnum): void {
    this.players[side].active = true;
    this.players[side].width = Geometry.activePaddleWidth;
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
    if (leftPlayerBorder < 0 || rightPlayerBorder > Geometry.fieldSize) {
      return null;
    }
    this.players[payload.side].position += this.paddleShiftMapper[payload.dir];
    return this.players[payload.side];
  }

  private resetGameState(): void {
    this.gameState.reset();
    this.server.emit(SocketEventEnum.GAME_UPDATE, this.gameState);
  }

  private resetPlayer(side: SideEnum): void {
    this.players[side].reset();
    this.server.emit(SocketEventEnum.PLAYER_UPDATE, this.players[side]);
  }

  private setNewBallCoordinates(gameState: GameInterface): void {
    const newPosition = Geometry.calcBallNewDirection(gameState);
    this.gameState.ballPosition = newPosition;
    this.server.emit(SocketEventEnum.GAME_UPDATE, this.gameState);
    setTimeout(() => {
      const player = this.players[gameState.ballPosition.side];
      if (Geometry.isPlayerMissedTheBall(player.width, player.position, gameState.ballPosition[player.axis])) {
        this.resetGameState();
        this.resetPlayer(player.side);
        return;
      }
      this.setNewBallCoordinates(this.gameState);
    }, newPosition.distance / this.gameState.ballSpeed);
  }
}
