import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PlayerInterface, SideEnum } from '@retro-pong/api-interfaces';

@Component({
  selector: 'pong-player-bar',
  templateUrl: './player-bar.component.html',
  styleUrls: ['./player-bar.component.scss'],
})
export class PlayerBarComponent {
  @Input() player: PlayerInterface;
  @Output() startGame = new EventEmitter<SideEnum>();
}
