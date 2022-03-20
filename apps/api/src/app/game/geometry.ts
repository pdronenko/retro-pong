import { BallDirectionInterface, GameInterface, SideEnum } from '@retro-pong/api-interfaces';

export class Geometry {
  static readonly fieldSize = 600;
  static readonly centerPosition = 300;
  static readonly paddleShift = 20;
  static readonly ballSpeed = 0.5;
  static readonly activePaddleWidth = 150;

  static isPlayerMissedTheBall(playerWidth: number, playerPosition: number, ballPosition: number): boolean {
    const leftPlayerBorder = playerPosition - playerWidth / 2;
    const rightPlayerBorder = playerPosition + playerWidth / 2;
    return ballPosition < leftPlayerBorder || ballPosition > rightPlayerBorder;
  }

  private static calculateSide2Length(side1Length: number, angle: number): number {
    return side1Length * Math.tan((angle * Math.PI) / 180);
  }

  private static addSide(side: SideEnum): SideEnum {
    return (side + 1) % 4;
  }

  private static bouncedAngle(angle: number): number {
    // todo normal angle calculation
    return 180 - angle;
  }

  static calcBallNewDirection(gameState: GameInterface): BallDirectionInterface {
    const { x: x1, y: y1, angle: ballDirectionDegree, side: currentSide } = gameState.ballDirection;
    const newAngle = Geometry.bouncedAngle(ballDirectionDegree);
    let tan = Math.tan((newAngle * Math.PI) / 180);

    let nextSide: SideEnum = Geometry.addSide(currentSide);
    let triangleSideLength: number;
    let x2: number, y2: number;
    switch (currentSide) {
      case SideEnum.BOTTOM:
        triangleSideLength = (Geometry.fieldSize - x1) * tan;
        x2 = Geometry.fieldSize;
        y2 = triangleSideLength;
        if (y2 > Geometry.fieldSize) {
          x2 = Geometry.calculateSide2Length(Math.abs(y2), 90 - newAngle);
          y2 = Geometry.fieldSize;
          nextSide = Geometry.addSide(nextSide);
        }
        break;
      case SideEnum.RIGHT:
        triangleSideLength = (Geometry.fieldSize - y1) * tan;
        x2 = Geometry.fieldSize - triangleSideLength;
        y2 = Geometry.fieldSize;
        if (x2 < 0) {
          y2 = Geometry.fieldSize - Geometry.calculateSide2Length(Math.abs(x2), 90 - newAngle);
          x2 = 0;
          nextSide = Geometry.addSide(nextSide);
        }
        break;
      case SideEnum.TOP:
        triangleSideLength = x1 * tan;
        x2 = 0;
        y2 = Geometry.fieldSize - triangleSideLength;
        if (y2 < 0) {
          x2 = Geometry.calculateSide2Length(Math.abs(y2), 90 - newAngle);
          y2 = 0;
          nextSide = Geometry.addSide(nextSide);
        }
        break;
      case SideEnum.LEFT:
        tan = Math.tan(((newAngle < 90 ? 90 - newAngle : newAngle) * Math.PI) / 180);
        triangleSideLength = (Geometry.fieldSize - y1) * tan;
        x2 = triangleSideLength;
        y2 = 0;
        if (x2 > Geometry.fieldSize) {
          y2 =
            Geometry.fieldSize - Geometry.calculateSide2Length(Math.abs(x2 - Geometry.fieldSize), 90 - (90 - newAngle));
          x2 = Geometry.fieldSize;
          nextSide = Geometry.addSide(nextSide);
        }
        break;
    }

    const newDistance = Math.hypot(x2 - x1, y2 - y1); // todo slow?

    return { x: x2, y: y2, angle: newAngle + 90, distance: newDistance, side: nextSide };
  }
}
