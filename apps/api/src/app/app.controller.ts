import { Controller, Get, Post } from '@nestjs/common';
import { ApiRoutesEnum, GameStateInterface, PlayerInterface, SideEnum } from '@retro-pong/api-interfaces';

import { GameService } from './game/game.service';

@Controller()
export class AppController {
  constructor(private readonly gameService: GameService) {}

  @Get(ApiRoutesEnum.GAME_STATE)
  getGame(): GameStateInterface {
    return this.gameService.getGameState();
  }

  @Get(ApiRoutesEnum.PLAYER_STATE)
  getPlayers(): Record<SideEnum, PlayerInterface> {
    return this.gameService.getPlayersState();
  }

  @Post(ApiRoutesEnum.START_GAME)
  startGame(): void {
    this.gameService.startGame();
  }
}
