import { Controller, Get, Post } from '@nestjs/common';
import { GameStateInterface, PlayerInterface, SideEnum } from '@retro-pong/api-interfaces';

import { GameService } from './game/game.service';

@Controller()
export class AppController {
  constructor(private readonly gameService: GameService) {}

  @Get('game-state')
  getGame(): GameStateInterface {
    return this.gameService.getGameState();
  }

  @Get('player-state')
  getPlayers(): Record<SideEnum, PlayerInterface> {
    return this.gameService.getPlayersState();
  }

  @Post('start-game')
  startGame(): void {
    this.gameService.startGame();
  }
}
