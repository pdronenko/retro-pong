import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import {
  GameInterface,
  GameStatusEnum,
  PlayerInterface,
  PlayerPayloadInterface,
  SideEnum,
  SocketEventEnum,
} from '@retro-pong/api-interfaces';
import { Server } from 'socket.io';
import { environment } from '../../environments/environment';
import { Geometry } from './geometry';
import { GameModel } from './shared/models/game.model';
import { PlayerModel } from './shared/models/player.model';

@WebSocketGateway(environment.wsPort)
export class GameService {
  @WebSocketServer()
  private server: Server;

  private gameState = new GameModel();

  private players: Record<SideEnum, PlayerModel> = {
    [SideEnum.LEFT]: new PlayerModel('Player 1', 'y', SideEnum.LEFT),
    [SideEnum.BOTTOM]: new PlayerModel('Player 2', 'x', SideEnum.BOTTOM),
    [SideEnum.TOP]: new PlayerModel('Player 3', 'x', SideEnum.TOP),
    [SideEnum.RIGHT]: new PlayerModel('Player 4', 'y', SideEnum.RIGHT),
  };

  @SubscribeMessage(SocketEventEnum.PLAYER_UPDATE)
  updatePlayer(@MessageBody() payload: PlayerPayloadInterface): void {
    const newPosition = this.players[payload.side].updatePlayerPosition(payload.dir);
    if (newPosition) {
      this.server.emit(SocketEventEnum.PLAYER_UPDATE, this.players[payload.side]);
    }
  }

  getGameState(): GameInterface {
    return this.gameState;
  }

  getPlayersState(): Record<SideEnum, PlayerInterface> {
    return this.players;
  }

  public activatePlayer(side: SideEnum): void {
    this.players[side].activate();
    this.gameState.activePlayersCount += 1;
    this.server.emit(SocketEventEnum.PLAYER_UPDATE, this.players[side]);
    if (this.gameState.status === GameStatusEnum.IDLE) {
      this.startGame();
    }
  }

  private startGame(): void {
    if (this.gameState.activePlayersCount > 0) {
      this.gameState.startWithDelay().subscribe(
        () => this.server.emit(SocketEventEnum.GAME_UPDATE, this.gameState),
        (err) => console.log(err),
        () => this.setNewBallCoordinates(this.gameState)
      );
    }
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
    const newPosition = Geometry.calcBallNewDirection(gameState.ballDirection);
    this.gameState.ballDirection = newPosition;
    this.server.emit(SocketEventEnum.GAME_UPDATE, this.gameState);
    setTimeout(() => {
      const player = this.players[gameState.ballDirection.side];
      if (Geometry.isPlayerMissedTheBall(player.width, player.position, gameState.ballDirection[player.axis])) {
        this.resetGameState();
        this.resetPlayer(player.side);
        this.gameState.activePlayersCount -= 1;
        this.startGame();
        return;
      }
      this.setNewBallCoordinates(this.gameState);
    }, newPosition.distance / this.gameState.ballSpeed);
  }
}
