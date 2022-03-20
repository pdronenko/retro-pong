import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusBarComponent } from './status-bar.component';
import { PlayerBarComponent } from './player-bar/player-bar.component';

@NgModule({
  declarations: [StatusBarComponent, PlayerBarComponent],
  imports: [CommonModule],
  exports: [StatusBarComponent],
})
export class StatusBarModule {}
