class BarGroup {
  constructor(y) {
    this.height = 30;
    this.y = y; //y is starting position

    this.speedY = 1;
    this.counted = false; //counted for score.

    this.speedXr = random(1,4);
    this.speedXl = random(1,4);

    this.left = {
      x : 0,
      width : 0,
      speed : this.speedXl
    };

    this.right = {
      x : world.width,
      width : world.width,
      speed : this.speedXr
    };
  }

  draw() {
    const {y, height} = this;
    let rx = this.right.x;
    let rwidth = this.right.width;
    let lx = this.left.x;
    let lwidth = this.left.width;
    if(this.completed)
      fill(255,52,21);
    else
      fill(100);
    rect(rx, y, rwidth, height);
    rect(lx, y, lwidth, height);
  }

  move() {
    const {y, speedY} = this;

    this.y += speedY;

    this.left.width += this.left.speed;
    this.right.x -= this.right.speed;

    let gap = this.right.x - this.left.width;

    if(gap <= 0) {
      this.left.speed = 0;
      this.right.speed = 0;
    }

    if(y > world.height - 30 - 50) {
      this.speedY = 0;
    }

    if (y <= 300) {
      this.right.speed=0;
      this.left.speed=0;
    } else if(gap >= 0) {
      this.right.speed=this.speedXr;
      this.left.speed=this.speedXl;
    }
  }
}

let ball;

let rect1;

let barGroups = []; //bar groups

function setup() {
  noStroke();
  createCanvas(world.width,world.height);

  ball = new Ball(world);
  // rect1 = new Rect(0,0,0,30);
  // rect2 = new Rect(world.width, 0, world.width, 30);
  ball.x = width/2;

  barGroups[0] = new BarGroup(world.height-100);
  barGroups[0].left.width = world.width;
  for(let i = 1; i<=9 ; i++) {
    barGroups[i] = new BarGroup(-i*300);
  }
  // barGroups[1] = new BarGroup(-300);
  // barGroups[2] = new BarGroup(-600);
  // barGroups[3] = new BarGroup(-900);
  // barGroups[4] = new BarGroup(-1200);
  // barGroups[5] = new BarGroup(-1500);
}

let score = -1;

function draw() {
  frameRate(60);
  background(0);
  ball.draw();
  ball.worldEffect();
  for(b of barGroups) {
    b.draw()
    b.move();
    if(val = ball.collisionCheckv3(b)) {
      // console.log('collision', val);
      if(val < 3) { // (top surface)
        if(!b.counted) {
          score++;
          b.counted = true;
          console.log('score:',score);
          if(score%9 == 0) {
            for(let i = 1; i<=9 ; i++) {
              barGroups[i] = new BarGroup(-(i-1)*300);
            }
            console.log(barGroups);
          }
        }
        ball.speedY = b.speedY;
      } else if(val > 3) { // (bottom surface)
        ball.speedY = 3; //thrust down
      }
    }
  }

  if(ball.y >= world.height) {
    console.log('game over');
    textSize(32);
    text("game over",100,100);
    noLoop();
  }

}

function keyPressed() {
  if(keyCode == 38 ) {
    for(b of barGroups) {
      if(ball.collisionCheckv3(b) < 3) {
        ball.jump();
        return false;
      }
    }
  }

  if(keyCode == 39) //right
    ball.moveRight();

  if(keyCode == 37) //left
    ball.moveLeft();
}

function mousePressed() {
  let b = barGroups[0];
  if(ball.collisionCheckv2(b)) {
    ball.jump();
  }
  return false;
}

// function touchStarted() {
//   ball.jump();
//   return false;
// }