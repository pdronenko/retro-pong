import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { GameBoardComponent } from './game-board.component';
import { PlayerPaddleComponent } from './player-paddle/player-paddle.component';
import { BallComponent } from './ball/ball.component';

@NgModule({
  declarations: [GameBoardComponent, PlayerPaddleComponent, BallComponent],
  imports: [CommonModule],
  providers: [ApiService],
  exports: [GameBoardComponent],
})
export class GameBoardModule {}
