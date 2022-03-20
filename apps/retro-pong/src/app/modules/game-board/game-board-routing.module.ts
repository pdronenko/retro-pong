import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoutesEnum } from '../../core/enums/routes.enum'; // todo make short link
import { GameBoardComponent } from './game-board.component';

const routes: Routes = [{ path: RoutesEnum.GAME_BOARD, component: GameBoardComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GameBoardRoutingModule {}
