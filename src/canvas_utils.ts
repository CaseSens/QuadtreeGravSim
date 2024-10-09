import Vector from "./vector";

export const initializeCanvasUtils = (
  lineDrawCallback: (initX: number, initY: number, vec: Vector) => void
) => {
  const canvas = document.getElementById("canvas2") as HTMLCanvasElement;
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

  ctx.canvas.width = window.innerHeight - 100;
  ctx.canvas.height = window.innerHeight - 100;
  canvas.width = window.innerHeight - 100;
  canvas.height = window.innerHeight - 100;

  const canvasRect = canvas.getBoundingClientRect();

  let isDragging = false;
  let initialX: number, initialY: number;
  let vec: Vector | null;

  canvas.addEventListener("mousedown", (e) => {
    isDragging = true;
    initialX = e.clientX - canvasRect.left;
    initialY = e.clientY - canvasRect.top;
  });

  canvas.addEventListener("mousemove", (e) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (isDragging) {
      const currentX = e.clientX - canvasRect.left;
      const currentY = e.clientY - canvasRect.top;

      // Calculate distance
      const distance = Math.sqrt(
        Math.pow(currentX - initialX, 2) + Math.pow(currentY - initialY, 2)
      );

      const directionX = currentX - initialX;
      const directionY = currentY - initialY;

      // Normalize the direction vector (unit vector)
      const magnitude = Math.sqrt(
        directionX * directionX + directionY * directionY
      );
      const normalizedX = directionX / magnitude;
      const normalizedY = directionY / magnitude;

      // Draw the line if distance is greater than threshold
      if (distance > 2) {
        ctx.beginPath();
        ctx.moveTo(initialX, initialY);
        ctx.lineTo(currentX, currentY);
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Scale the normalized direction by the distance (or a chosen factor)
      vec = new Vector(normalizedX, normalizedY);
      vec.mult(distance / 30); // Scale the direction vector by the distance (magnitude) with padding
    }
  });

  canvas.addEventListener("mouseup", () => {
    lineDrawCallback(initialX, initialY, vec!); // Pass back the scaled velocity vector
    isDragging = false;
    initialX = 0;
    initialY = 0;
    vec = null;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  });

  canvas.addEventListener("mouseleave", () => {
    isDragging = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  });
};
