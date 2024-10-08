export default class Vector {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  copy(): Vector {
    return new Vector(this.x, this.y);
  }

  equals(v: Vector) {
    return this.x == v.x && this.y == v.y;
  }

  add(v: Vector) {
    this.x += v.x;
    this.y += v.y;
  }

  sub(v: Vector) {
    this.x -= v.x;
    this.y -= v.y;
  }

  mult(scalar: number) {
    this.x *= scalar;
    this.y *= scalar;
  }

  div(v: Vector) {
    this.x /= v.x;
    this.y /= v.y;
  }

  magSquared(): number {
    return this.x ** 2 + this.y ** 2;
  }

  mag(): number {
    return Math.sqrt(this.magSquared());
  }

  static getMult(v: Vector, scalar: number): Vector {
    return new Vector(v.x * scalar, v.y * scalar);
  }

  static getSub(v1: Vector, v2: Vector): Vector {
    return new Vector(v1.x - v2.x, v1.y - v2.y);
  }

  static dot(v1: Vector, v2: Vector): number {
    return v1.x * v2.x + v1.y * v2.y;
  }

  normalize() {
    this.mult(1 / this.mag());
  }
}