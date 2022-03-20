import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiRoutesEnum, GameStateInterface, PlayerInterface, SideEnum } from '@retro-pong/api-interfaces';

import { GameService } from './game/game.service';

@Controller()
export class AppController {
  constructor(private readonly gameService: GameService) {}

  @Get(ApiRoutesEnum.GAME)
  getGame(): GameStateInterface {
    return this.gameService.getGameState();
  }

  @Get(ApiRoutesEnum.PLAYERS)
  getPlayers(): Record<SideEnum, PlayerInterface> {
    return this.gameService.getPlayersState();
  }

  @Post(ApiRoutesEnum.GAME)
  startGame(@Body() body: { side: SideEnum }): { side } {
    const { side } = body;
    this.gameService.startGame(side);
    return { side };
  }
}
