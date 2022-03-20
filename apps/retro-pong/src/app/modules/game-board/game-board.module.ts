import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameBoardRoutingModule } from './game-board-routing.module';
import { GameBoardComponent } from './game-board.component';

@NgModule({
  declarations: [GameBoardComponent],
  imports: [CommonModule, GameBoardRoutingModule],
})
export class GameBoardModule {}
