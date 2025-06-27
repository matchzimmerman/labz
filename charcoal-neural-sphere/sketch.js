let tendrils = [];
const maxTendrils = 1000;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 255);
  background(255);

  // Start with a few seed tendrils near center
  for (let i = 0; i < 20; i++) {
    tendrils.push(new Tendril(createVector(random(-50, 50), random(-50, 50), random(-50, 50))));
  }

  stroke(0, 40); // Light graphite tone
  strokeWeight(0.5); // Very thin lines
  noFill();
}

function draw() {
  background(255); // Clear every frame to prevent ghosting
  orbitControl();

  rotateX(PI / 8);

  // Grow and display tendrils
  for (let t of tendrils) {
    t.grow();
    t.display();
  }

  // Occasionally spawn offshoots for organic complexity
  if (frameCount % 60 === 0 && tendrils.length < maxTendrils) {
    let parent = random(tendrils);
    tendrils.push(new Tendril(parent.current.copy(), parent.direction.copy()));
  }
}

class Tendril {
  constructor(start, inheritDir) {
    this.points = [start.copy()];
    this.current = start.copy();
    this.direction = inheritDir ? inheritDir.copy() : p5.Vector.random3D().mult(0.5);
    this.length = 0;
    this.maxLength = int(random(500, 1200)); // How far this tendril will grow
  }

  grow() {
    if (this.length >= this.maxLength) return;

    // Local random deviation for organic feel
    let deviation = p5.Vector.random3D().mult(0.1);
    this.direction.add(deviation).normalize().mult(0.5);

    // Slight pull toward center for spherical cohesion
    let toCenter = p5.Vector.sub(createVector(0, 0, 0), this.current).normalize().mult(0.02);
    this.direction.add(toCenter);

    // Step forward
    this.current.add(this.direction);
    this.points.push(this.current.copy());
    this.length++;
  }

  display() {
    beginShape();
    for (let p of this.points) {
      vertex(p.x, p.y, p.z);
    }
    endShape();
  }
}
