import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';
import { BallPositionInterface } from '@retro-pong/api-interfaces';

@Component({
  selector: 'pong-ball',
  templateUrl: './ball.component.html',
  styleUrls: ['./ball.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BallComponent {
  @Input() ballSpeed: number;
  @Input() set position(position: BallPositionInterface) {
    this.transitionDuration = `${position.distance / this.ballSpeed}ms`;
    this.transform = `translate3d(${position.x}px,${-position.y}px,0)`;
  }

  @HostBinding('style.transition-duration') transitionDuration = '0ms';
  @HostBinding('style.transform') transform = 'none';
}
