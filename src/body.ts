import Vector from "./vector";

export default class Body {
  pos: Vector;
  vel: Vector;
  mass: number;
  radius: number;
  nextPos: Vector;
  nextVel: Vector;
  heat: number;

  constructor(pos: Vector, vel: Vector, mass: number, radius: number, heat: number) {
    this.pos = pos;
    this.nextPos = pos.copy();
    this.nextVel = vel.copy();
    this.vel = vel;
    this.mass = mass;
    this.radius = radius;
    this.heat = heat;
  }

  update(dt: number) {
    this.vel.mult(dt);
    this.pos.add(this.vel);
    this.heat *= 0.997; // time lowers heat

  }
}
