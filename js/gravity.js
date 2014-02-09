// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);


var prevx = null;
var prevy = null;

ctx.fillStyle = '#555555';

function Planet(radius, mass, x, y, color, x_vel, y_vel) {
  this.radius = radius;
  this.mass = mass;
  this.x = x;
  this.y = y;
  this.color = color;
  this.x_vel = x_vel;
  this.y_vel = y_vel;
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
  this.x += this.x_vel * modifier;
  this.y += this.y_vel * modifier;
  this.draw();
};

var planets = new Array();
planets.push(new Planet(40, 40, 100, 100, 'green', 10, 10));
planets.push(new Planet(30, 30, 40, 300, 'blue', 5, 3));

var move = function (modifier) {
  planets.forEach(function(p) {
    p.move(modifier);
  });
  // planets.forEach(function(p1) {
  //   planets.forEach(function(p2) {
  //     if (p1 == p2) {
  //       continue;
  //     }
  //     p1.
  //   });
  // });
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
