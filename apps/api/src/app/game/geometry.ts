import { BallDirectionInterface, SideEnum } from '@retro-pong/api-interfaces';

export class Geometry {
  static readonly fieldSize = 600;
  static readonly paddleShift = 45;
  static readonly ballSpeed = 0.5;
  static readonly activePaddleWidth = 200;
  static readonly countdown = 3;

  static xDirection = 2;
  static yDirection = 2;

  static sideMapper = [
    { check: (x, y) => y === Geometry.fieldSize, side: SideEnum.TOP },
    { check: (x) => x === Geometry.fieldSize, side: SideEnum.RIGHT },
    { check: (x, y) => y === 0, side: SideEnum.BOTTOM },
    { check: () => true, side: SideEnum.LEFT },
  ];

  static isPlayerMissedTheBall(playerWidth: number, playerPosition: number, ballPosition: number): boolean {
    const leftPlayerBorder = playerPosition - playerWidth / 2;
    const rightPlayerBorder = playerPosition + playerWidth / 2;
    return ballPosition < leftPlayerBorder || ballPosition > rightPlayerBorder;
  }

  static calcBallNewDirection(ballDirection: BallDirectionInterface): BallDirectionInterface {
    const { x: x1, y: y1 } = ballDirection;

    let x2 = x1;
    let y2 = y1;
    for (;;) {
      if (x2 + Geometry.xDirection > Geometry.fieldSize || x2 + Geometry.xDirection < 0) {
        Geometry.xDirection = -Geometry.xDirection;
        break;
      } else if (y2 + Geometry.yDirection > Geometry.fieldSize || y2 + Geometry.yDirection < 0) {
        Geometry.yDirection = -Geometry.yDirection;
        break;
      }

      x2 += Geometry.xDirection;
      y2 += Geometry.yDirection;
    }

    const distance = Math.hypot(x2 - x1, y2 - y1);
    const side = Geometry.sideMapper.find(({ check }) => check(x2, y2)).side;
    return { x: x2, y: y2, distance, side };
  }

  private static randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}
