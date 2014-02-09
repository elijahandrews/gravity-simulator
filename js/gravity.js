// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 1000;
canvas.height = 700;
document.body.appendChild(canvas);

var G = 10;

function Planet(radius, mass, x, y, color, vel_x, vel_y) {
  this.radius = radius;
  this.mass = mass;
  this.x = x;
  this.y = y;
  this.color = color;
  this.vel_x = vel_x;
  this.vel_y = vel_y;
}

Planet.prototype.draw = function() {
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
  ctx.fillStyle = this.color;
  ctx.fill();
  ctx.lineWidth = 3; // TODO: make this a function of radius
  ctx.strokeStyle = '#003300';
  ctx.stroke();
};

Planet.prototype.clear = function() {
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.radius + 3, 0, 2 * Math.PI, false);
  ctx.fillStyle = 'white'; // TODO: make this background color
  ctx.fill();
};

Planet.prototype.move = function(modifier) {
  this.clear();
  this.x += this.vel_x * modifier;
  this.y += this.vel_y * modifier;
  this.draw();
};

var planets = new Array();
planets.push(new Planet(20, 1500, 500, 300, 'green', 0, 0));
planets.push(new Planet(5, 30, 30, 100, 'blue', 110, -10));
planets.push(new Planet(5, 30, 800, 700, 'red', 110, -10));

var move = function (modifier) {
  planets.forEach(function(p1) {
    planets.forEach(function(p2) {
      if (p1 == p2) {
        return;
      }

      // Calculate the acceleration of p1

      // TODO: make sure we aren't using integers here
      // TODO: optimize this
      del_x = Math.abs(p2.x - p1.x);
      del_y = Math.abs(p2.y - p1.y);
      distance = Math.sqrt(Math.pow(del_x, 2) + Math.pow(del_y, 2));
      accel = G * p2.mass/Math.pow(distance, 2);
      theta = Math.atan(del_y/del_x);
      accel_x = accel * Math.cos(theta);
      accel_y = accel * Math.sin(theta);
      p1.vel_x += (p2.x - p1.x) > 0 ? accel_x : -accel_x;
      p1.vel_y += (p2.y - p1.y) > 0 ? accel_y : -accel_y;
    });
  });

  // TODO: Check for collisions

  planets.forEach(function(p) {
    p.move(modifier);
  });
}

var then = Date.now();
// The main game loop
var main = function () {
  var now = Date.now();
  var delta = now - then;

  move(delta / 1000);

  then = now;
};

setInterval(main, 1);


// canvas.onmousemove = function(e) {
//   if (prevx && prevy) {
//     ctx.moveTo(prevx, prevy);
//     ctx.lineTo(e.x - 10, e.y - 10);
//     ctx.stroke();
//   }
//   prevx = e.x - 10;
//   prevy = e.y - 10;
// }
