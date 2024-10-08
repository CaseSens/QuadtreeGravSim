import TreeNode from "./tree_node";
import { randomInRange } from "nuancejs";
import Vector from "./vector";
import Body from "./body";
import { gravity } from "./phys_utils";
import { collide } from "./collision_utils";

// CONFIG
const N = 100; // Num particles
const r = 5; // Particle radius
const mass = 2; // Particle mass

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

ctx.canvas.width = window.innerHeight - 100;
ctx.canvas.height = window.innerHeight - 100;

const initBounds = ctx.canvas.width; // Initial bounds of simulation in px
const initVel = 0.005; // Initial velocity in px/s

let bodies: Body[] = [];
let root: TreeNode;

function setup() {
  for (let i = 0; i < N; i++) {
    const pos = new Vector(
      randomInRange({ min: 0, max: initBounds - r }), // x
      randomInRange({ min: 0, max: initBounds - r }) // y
    );

    console.log(pos);

    const vel = new Vector(
      randomInRange({ min: -initVel, max: initVel }), // x
      randomInRange({ min: -initVel, max: initVel }) // y
    );

    bodies.push(new Body(pos, vel, mass, r, 0));
  }
}

function getBoundingBox() {
  // indices
  let minX = Number.MAX_VALUE;
  let maxX = -Number.MAX_VALUE;
  let minY = Number.MAX_VALUE;
  let maxY = -Number.MAX_VALUE;

  for (let i = 0; i < N; i++) {
    minX = Math.min(minX, bodies[i].pos.x);
    maxX = Math.max(maxX, bodies[i].pos.x);
    minY = Math.min(minY, bodies[i].pos.y);
    maxY = Math.max(maxY, bodies[i].pos.y);
  }

  return [minX, minY, Math.max(maxX - minX, maxY - minY)];
}

function constructTree() {
  /*
  1. Get bounding square
  2. Insert nodes
  */

  const boundingSquare = getBoundingBox();
  root = new TreeNode(boundingSquare[0], boundingSquare[1], boundingSquare[2]);

  bodies.forEach((b) => root.insert(b));
}

function draw(dt: number) {
  bodies.forEach((b) => b.update(1));
  constructTree();
  gravity(bodies, root, dt);
  collide(bodies, root);

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.lineWidth = 2;
  ctx.strokeStyle = "white";
  bodies.forEach((b) => {
    ctx.beginPath();
    ctx.arc(b.pos.x, b.pos.y, b.radius, 0, 2 * Math.PI);
    ctx.stroke();
  });
}

let lastTime = 0;

function animate(timestamp: number) {
  if (!lastTime) lastTime = timestamp;
  const dt = (timestamp - lastTime) / 1000; // Convert milliseconds to seconds
  lastTime = timestamp;

  draw(dt);
  requestAnimationFrame(animate);
}

setup();
requestAnimationFrame(animate);