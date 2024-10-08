import Body from "./body";
import TreeNode from "./tree_node";
import Vector from "./vector";

const G = 0.05; // Gravitational constant
const theta = 0.4; // Constant use by barnes-hut algorithm

export function gravity(bodies: Body[], root: TreeNode, dt: number) {
  bodies.forEach((b) => {
    gravitate(b, root, dt);
  })
}

function gravitate(b: Body, tn: TreeNode, dt: number) {
  // If the tree node is a leaf, then it represents a single body
  if (tn.leaf) {
    // If the body doesn't exist or is the same as the current body, then there's no gravity to apply
    if (!tn.body || b == tn.body) return;

    // Otherwise, add the acceleration due to the gravity of the body to the current body
    b.vel.add(gravityAcc(tn.body.pos, b, dt));
    return;
  }

  // If the tree node is not a leaf, then it represents a collection of bodies
  // Get the center of mass of the collection
  if (!tn.center) { tn.center = Vector.getMult(tn.totalCenter, 1.0 / tn.count); }

  // If the collection is far enough away, then treat it as a single body
  if (tn.w / dist(b.pos, tn.center) < theta) {
    // Calculate the acceleration due to the collection's gravity
    b.vel.add(gravityAcc(tn.center, b, tn.totalMass));
    return;
  }

  // If the collection is close enough, then recursively calculate the gravity of each child
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