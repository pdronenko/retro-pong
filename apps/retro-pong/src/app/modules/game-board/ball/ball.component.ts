import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';
import { BallDirectionInterface } from '@retro-pong/api-interfaces';

@Component({
  selector: 'pong-ball',
  templateUrl: './ball.component.html',
  styleUrls: ['./ball.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BallComponent {
  @Input() ballSpeed: number;
  @Input() set direction(direction: BallDirectionInterface) {
    this.transitionDuration = `${direction.distance / this.ballSpeed}ms`;
    this.transform = `translate3d(${direction.x}px,${-direction.y}px,0)`;
  }

  @HostBinding('style.transition-duration') transitionDuration = '0ms';
  @HostBinding('style.transform') transform = 'none';
}
