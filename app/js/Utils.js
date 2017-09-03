class Utils {

  static inCircleArea(point, circle) {
    return Math.sqrt((point.x-circle.position.x) ** 2 + (point.y - circle.position.y) ** 2) < circle.radius;
  }

  static inRectangularArea(point, rectangle) {
    let maxWith = rectangle.position.x + rectangle.dimensions.width,
        maxHeight = rectangle.position.y + rectangle.dimensions.height;

    return point.x >= rectangle.position.x && point.x <= maxWith
            && point.y >= rectangle.position.y && point.y <= maxHeight;
  }

  static randomBetween(min, max) {
    return  Math.floor(Math.random() * max) + min;
  }

  static calculateDistance(pointA, pointB) {
    return Math.sqrt(((pointB.x - pointA.x) * (pointB.x - pointA.x)) + ((pointB.y - pointA.y) * (pointB.y - pointA.y)));
  }
}
