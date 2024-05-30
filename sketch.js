// Defines an empty array to store all created objects
let circles = [];

// Defines the speed of movement
let speed = 1;

// Define the background circles
let bgCircles = [];

// Define a variable for controlling the wave pattern
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Calls the draw function repeatedly
  frameRate(60);
  noStroke();
  generateBackgroundCircles(); // Generate background circles only once
}

function draw() {
  // Move all existing circles to the right
  for (let circle of circles) {
    circle.x += speed;
  }

  // Increment time for the wave pattern effect
  time += 0.01;

  // Draw the background pattern
  drawBackgroundPattern();

  // Draw each circle in the array
  for (let i = circles.length - 1; i >= 0; i--) {
    let circle = circles[i];
    circle.y = height * noise(time + circle.x * 0.01); // Use noise() for y-coordinate
    circle.draw();

    // Remove circles that have moved off-screen
    if (circle.x - circle.size / 2 > width) {
      circles.splice(i, 1);
    }
  }

  // Check if new circles should be created
  if (random() < 0.01) { // Adjust the frequency of new circles here
    let newCircle = createCircle(-100); // Spawn new circles just outside the canvas on the left
    circles.push(newCircle);
  }
}

// Function to draw the background pattern
function drawBackgroundPattern() {
  background(20, 10, 0);
  // Draw each background circle
  for (let circle of bgCircles) {
    fill(circle.color);
    noStroke(); // Remove stroke
    ellipse(circle.x, circle.y, circle.size, circle.size);
  }
}

// Function to generate background circles
function generateBackgroundCircles() {
  // Define the number of background circles
  let numBgCircles = 100;
  // Loop to generate background circles
  for (let i = 0; i < numBgCircles; i++) {
    let x = random(width);
    let y = random(height);
    let size = random(50, 150);
    let color = randomWarmColor(50);
    bgCircles.push({ x: x, y: y, size: size, color: color });
  }
}

// Function to create a new circle object
function createCircle(x) {
  let y = random(height);
  let size = random(100, 200);
  let type = int(random(6));
  return new Circle(x, y, size, type);
}

// Circle class
class Circle {
  constructor(x, y, size, type) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.type = type;
  }

  draw() {
    // Randomly generate an integer that determines the number of layers of the circle
    let numLayers = int(random(3, 6));
    // Loop through each layer
    for (let i = numLayers; i > 0; i--) {
      // Calculate the size of the current layer
      let layerSize = (this.size / numLayers) * i;
      // Create gradient color
      let gradientColor = lerpColor(randomWarmColor(200), randomWarmColor(200), i / numLayers);
      // Randomly decide whether to fill or stroke
      if (random() > 0.5) {
        fill(gradientColor);
        noStroke();
      } else {
        noFill();
        stroke(gradientColor);
        strokeWeight(2);
      }
      // Draw the circle of the current layer
      ellipse(this.x, this.y, layerSize, layerSize);
      // Draw the pattern of the current layer
      this.drawPattern(layerSize);
    }
  }

  drawPattern(diameter) {
    // A random integer is generated to determine the number of patterns
    let numPatterns = int(random(10, 20));
    // Draw each pattern in a loop
    for (let i = 0; i < numPatterns; i++) {
      // Calculate the angle of the current pattern
      let angle = map(i, 0, numPatterns, 0, TWO_PI);
      // Calculate the X-coordinate of the current pattern
      let px = this.x + (diameter / 2) * cos(angle);
      // Calculate the Y-coordinate of the current pattern
      let py = this.y + (diameter / 2) * sin(angle);
      // Generate the color of the pattern
      let shapeColor = lerpColor(randomWarmColor(200), randomWarmColor(200), i / numPatterns);
      // Set fill color
      fill(shapeColor);
      // Draw different patterns according to the type
      switch (this.type) {
        case 0:
          // Ellipse
          ellipse(px, py, diameter / 10, diameter / 10);
          break;
        case 1:
          // Rectangle
          rectMode(CENTER);
          rect(px, py, diameter / 10, diameter / 10);
          break;
        case 2:
          // Line
          stroke(shapeColor);
          line(this.x, this.y, px, py);
          noStroke();
          break;
        case 3:
          // Polygon
          drawPolygon(px, py, diameter / 20, 6);
          break;
      }
    }
  }
}

// Function to draw a polygon
function drawPolygon(x, y, radius, npoints) {
  // Calculate the angle of each vertex
  let angle = TWO_PI / npoints;
  // Start drawing shapes
  beginShape();
  // Loop over each vertex
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a) * radius;
    let sy = y + sin(a) * radius;
    vertex(sx, sy);
  }
  // Finish drawing and closing the shape
  endShape(CLOSE);
}

// Function to generate random warm colors
function randomWarmColor(alpha) {
  // Define a set of warm colors
  let colors = [
    color(255, 102, 102, alpha),
    color(255, 178, 102, alpha),
    color(255, 255, 102, alpha),
    color(255, 153, 102, alpha),
    color(255, 204, 153, alpha)
  ];
  // Randomly return a warm color
  return colors[int(random(colors.length))];
}
