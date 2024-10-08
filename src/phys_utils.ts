import Body from "./body";
import TreeNode from "./tree_node";
import Vector from "./vector";

const G = 0.4; // Gravitational constant
const theta = 0.7; // Constant use by barnes-hut algorithm

export function gravity(bodies: Body[], root: TreeNode, dt: number) {
  bodies.forEach((b) => {
    gravitate(b, root, dt);
  })
}

function gravitate(b: Body, tn: TreeNode, dt: number) {
  if (tn.leaf) {
    if (!tn.body || b == tn.body) return;
    b.vel.add(gravityAcc(tn.body.pos, b, dt));
    return;
  }

  if (!tn.center) { tn.center = Vector.getMult(tn.totalCenter, 1.0 / tn.count); }
  if (tn.w / dist(b.pos, tn.center) < theta) {
    b.vel.add(gravityAcc(tn.center, b, tn.totalMass));
    return;
  }

  tn.children.forEach((child) => gravitate(b, child, dt));
}

// Acceleration due to the gravity exerted by a on b
function gravityAcc(a: Vector, b: Body, dt: number) {
  const distSq = distSquared(a, b.pos);

  if (distSq <= 2 * (b.radius * b.radius)) { // To verify if 2* is good
    return new Vector(0, 0);
  }

  return Vector.getMult(Vector.getSub(a, b.pos), dt * G * b.mass / (distSq * Math.sqrt(distSq)));
}

export function dist(a: Vector, b: Vector): number {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}

function distSquared(a: Vector, b: Vector) {
  return (a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y);
}

export function totalKineticEnergy(bodies: Body[]): number {
  let total = 0;
  bodies.forEach(b => {
    total += twiceKineticEnergy(b);
  });

  return 2 * total;
}

export function twiceKineticEnergy(b: Body): number {
  return b.mass * b.vel.magSquared();
}

export function totalMomentum(bodies: Body[]) {
  let total: Vector = new Vector(0, 0);

  bodies.forEach(b => {
    total.add(momentum(b));
  });

  return total;
}

export function momentum(b: Body): Vector {
  return Vector.getMult(b.vel, b.mass);
}