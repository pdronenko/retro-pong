import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SoundService } from '../../core/services/sound.service';
import { PlayerBarComponent } from './player-bar/player-bar.component';
import { StatusBarComponent } from './status-bar.component';

@NgModule({
  declarations: [StatusBarComponent, PlayerBarComponent],
  imports: [CommonModule],
  exports: [StatusBarComponent],
  providers: [SoundService],
})
export class StatusBarModule {}
