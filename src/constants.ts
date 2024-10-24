// CONFIG
const N = 250; // Num particles
const r = 5; // Particle radius
const mass = 2; // Particle mass

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

ctx.canvas.width = window.innerHeight - 100;
ctx.canvas.height = window.innerHeight - 100;
canvas.width = window.innerHeight - 100;
canvas.height = window.innerHeight - 100;

const Constants = {
  N,
  r,
  mass,
  canvas,
  ctx
}

export default Constants;