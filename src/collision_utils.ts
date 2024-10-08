import Body from "./body";
import { dist } from "./phys_utils";
import TreeNode from "./tree_node";
import Vector from "./vector";
const restitution = 0.12; // Restitution coefficient

export function collide(bodies: Body[], tn: TreeNode) {
  bodies.forEach((b) => {
    b.nextPos = b.pos.copy();
    b.nextVel = b.vel.copy();
  });

  bodies.forEach((b) => doCollisions(b, tn));

  bodies.forEach((b) => {
    b.pos = b.nextPos;
    b.vel = b.nextVel;
  });
}

function doCollisions(b: Body, tn: TreeNode) {
  if (tn.leaf) {
    if (!tn.body || b == tn.body) return;

    const distance = dist(b.pos, tn.body.pos);
    handleCollision(b, tn.body, distance);
    return;
  }

  // Find which quadrant to collide with
  tn.children.forEach((child) => {
    const outside =
      b.pos.x + 2 * b.radius < child.x ||
      b.pos.x - 2 * b.radius > child.x + child.w ||
      b.pos.y + 2 * b.radius < child.y ||
      b.pos.y - 2 * b.radius > child.y + child.w;

    if (!outside) {
      doCollisions(b, child); // Recursive
    }
  });
}

function handleCollision(b1: Body, b2: Body, distance: number) {
  if (distance > b1.radius + b2.radius) {
    return;
  }

  const dPos = Vector.getSub(b1.pos, b2.pos);
  dPos.normalize();

  // Push-pull them apart (mtd stands for "minimum translation distance")
  const invHeatA = 1 / (b1.heat + 1);
  const invHeatB = 1 / (b2.heat + 1);
  const mtd: Vector = Vector.getMult(
    dPos,
    ((b1.radius + b2.radius - distance) * invHeatA) / (invHeatA + invHeatB)
  );
  b1.nextPos.add(mtd);

  const impactSpeed = Vector.dot(b1.vel, dPos);
  b1.heat += Math.abs(impactSpeed) * 0.1;

  // If already moving away from each other, return
  if (impactSpeed > 0) return;

  const force: Vector = Vector.getMult(dPos, impactSpeed * (1 + restitution) * 0.5);
  b1.nextVel.sub(force);
}
