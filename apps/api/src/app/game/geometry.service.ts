import { BallPositionInterface, GameStateInterface, SideEnum } from '@retro-pong/api-interfaces';

export class GeometryService {
  static readonly fieldSize = 600;

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

  static calcBallNewDirection(gameState: GameStateInterface): BallPositionInterface {
    const { x: x1, y: y1, degree: ballDirectionDegree, side: currentSide } = gameState.ballPosition;
    const newAngle = GeometryService.bouncedAngle(ballDirectionDegree);
    let tan = Math.tan((newAngle * Math.PI) / 180);

    let nextSide: SideEnum = GeometryService.addSide(currentSide);
    let triangleSideLength: number;
    let x2: number, y2: number;
    switch (currentSide) {
      case SideEnum.BOTTOM:
        triangleSideLength = (GeometryService.fieldSize - x1) * tan;
        x2 = GeometryService.fieldSize;
        y2 = triangleSideLength;
        if (y2 > GeometryService.fieldSize) {
          x2 = GeometryService.calculateSide2Length(Math.abs(y2), 90 - newAngle);
          y2 = GeometryService.fieldSize;
          nextSide = GeometryService.addSide(nextSide);
        }
        break;
      case SideEnum.RIGHT:
        triangleSideLength = (GeometryService.fieldSize - y1) * tan;
        x2 = GeometryService.fieldSize - triangleSideLength;
        y2 = GeometryService.fieldSize;
        if (x2 < 0) {
          y2 = GeometryService.fieldSize - GeometryService.calculateSide2Length(Math.abs(x2), 90 - newAngle);
          x2 = 0;
          nextSide = GeometryService.addSide(nextSide);
        }
        break;
      case SideEnum.TOP:
        triangleSideLength = x1 * tan;
        x2 = 0;
        y2 = GeometryService.fieldSize - triangleSideLength;
        if (y2 < 0) {
          x2 = GeometryService.calculateSide2Length(Math.abs(y2), 90 - newAngle);
          y2 = 0;
          nextSide = GeometryService.addSide(nextSide);
        }
        break;
      case SideEnum.LEFT:
        tan = Math.tan(((newAngle < 90 ? 90 - newAngle : newAngle) * Math.PI) / 180);
        triangleSideLength = (GeometryService.fieldSize - y1) * tan;
        x2 = triangleSideLength;
        y2 = 0;
        if (x2 > GeometryService.fieldSize) {
          y2 =
            GeometryService.fieldSize -
            GeometryService.calculateSide2Length(Math.abs(x2 - GeometryService.fieldSize), 90 - (90 - newAngle));
          x2 = GeometryService.fieldSize;
          nextSide = GeometryService.addSide(nextSide);
        }
        break;
    }

    const newDistance = Math.hypot(x2 - x1, y2 - y1); // todo slow?

    return { x: x2, y: y2, degree: newAngle + 90, distance: newDistance, side: nextSide };
  }
}
