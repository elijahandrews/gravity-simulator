// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 1000;
canvas.height = 700;
document.body.appendChild(canvas);

var G = 10;

function Planet(radius, mass, x, y, color, vel_x, vel_y) {
  this.radius = radius;
  this.orig_radius = radius;
  this.mass = mass;
  this.x = x;
  this.orig_x = x;
  this.y = y;
  this.orig_y = y;
  this.color = color;
  this.vel_x = vel_x;
  this.orig_vel_x = vel_x;
  this.vel_y = vel_y;
  this.orig_vel_y = vel_y;
  this.killed = false;
}

Planet.prototype.reset = function() {
  this.clear();
  this.killed = false;
  this.radius = this.orig_radius;
  this.x = this.orig_x;
  this.y = this.orig_y;
  this.vel_x = this.orig_vel_x;
  this.vel_y = this.orig_vel_y;
  this.draw();
};

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
  if (this.killed) {
    return
  }
  this.clear();
  this.x += this.vel_x * modifier;
  this.y += this.vel_y * modifier;
  this.draw();
};

Planet.prototype.kill = function() {
  this.clear();
  this.killed = true;
}

var planets = new Array();
planets.push(new Planet(20, 150, 500, 300, 'green', -30, -30));
planets.push(new Planet(5, 30, 30, 100, 'blue', 110, -10));
planets.push(new Planet(5, 30, 800, 700, 'red', 110, -10));
planets.push(new Planet(30, 200, 200, 400, 'red', 110, -10));
planets.push(new Planet(30, 200, 304, 700, 'purple', 20, -10));

var reset = function() {
  planets.forEach(function(p) {
    p.reset();
  });
}

var main_loop;

var start = function() {
  then = Date.now(); // reset the delta timer so movement works as expected
  document.getElementById('play-state').innerText = 'Playing';
  main_loop = setInterval(main, 1);
}

var stop = function() {
  document.getElementById('play-state').innerText = 'Stopped';
  clearInterval(main_loop);
}

var move = function (modifier) {
  planets.forEach(function(p1) {
    planets.forEach(function(p2) {
      if (p1 == p2 || p1.killed || p2.killed) {
        return;
      }

      // Calculate the acceleration of p1

      // TODO: make sure we aren't using integers here
      // TODO: optimize this
      del_x = Math.abs(p2.x - p1.x);
      del_y = Math.abs(p2.y - p1.y);
      distance = Math.sqrt(Math.pow(del_x, 2) + Math.pow(del_y, 2));

      // TODO: Handle collisiosn with multiple planets
      if (distance <= p1.radius + p2.radius) {
        if (p1.radius >= p2.radius) {
          larger = p1;
          smaller = p2;
        } else {
          larger = p2;
          smaller = p1;
        }

        smaller.kill();
        larger.radius *= 1 + smaller.radius/larger.radius;
        larger.mass += smaller.mass;

        larger.vel_x += smaller.vel_x * smaller.mass / larger.mass;
        larger.vel_y += smaller.vel_y * smaller.mass / larger.mass;
        // TODO: Combine their colours
      }

      accel = G * p2.mass/Math.pow(distance, 2);
      theta = Math.atan(del_y/del_x);
      accel_x = accel * Math.cos(theta);
      accel_y = accel * Math.sin(theta);
      p1.vel_x += (p2.x - p1.x) > 0 ? accel_x : -accel_x;
      p1.vel_y += (p2.y - p1.y) > 0 ? accel_y : -accel_y;
    });
  });

  planets.forEach(function(p) {
    p.move(modifier);
  });
}

var then = Date.now();
// The main loop
var main = function () {
  var now = Date.now();
  var delta = now - then;

  move(delta / 1000);

  then = now;
};
