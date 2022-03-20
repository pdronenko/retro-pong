import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';
import { PlayerInterface, SideEnum } from '@retro-pong/api-interfaces';

@Component({
  selector: 'pong-player-paddle',
  templateUrl: './player-paddle.component.html',
  styleUrls: ['./player-paddle.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerPaddleComponent {
  private readonly paddleIndent = 10;

  @Input() set paddle(paddle: PlayerInterface) {
    this.setPaddleStyles(paddle);
  }

  @HostBinding('style.width') width = '0px';
  @HostBinding('style.height') height = '0px';
  @HostBinding('style.transform') transform = 'none';

  private setPaddleStyles(paddle: PlayerInterface): void {
    switch (paddle.side) {
      case SideEnum.TOP:
      case SideEnum.BOTTOM:
        this.width = `${paddle.width}px`;
        this.height = `${this.paddleIndent}px`;
        this.transform = `translateX(-50%) translateX(${paddle.position}px)`;
        break;
      case SideEnum.LEFT:
      case SideEnum.RIGHT:
        this.height = `${paddle.width}px`;
        this.width = `${this.paddleIndent}px`;
        this.transform = `translateY(-50%) translateY(${paddle.position}px)`;
        break;
    }
  }
}
