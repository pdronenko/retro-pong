import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameBoardRoutingModule } from './game-board-routing.module';
import { GameBoardComponent } from './game-board.component';
import { PlayerPaddleComponent } from './player-paddle/player-paddle.component';

@NgModule({
  declarations: [GameBoardComponent, PlayerPaddleComponent],
  imports: [CommonModule, GameBoardRoutingModule],
})
export class GameBoardModule {}