class Ball {
  constructor() {
    this.x = 0;
    this.y = 400; //initial y
    this.speedY = 0; //normal speed of moving w/o external force in y-axis
    this.speedX = 0;
    this.diameter = 40;
    this.thrust = -9; //thrust up while jumping
    this.score = 0;
  }

  draw() {
    fill('rgba(42,100,12,0.7)');
    const {x,y,diameter} = this;
    ellipse(x,y,diameter,diameter);
  }

  worldEffect() {
    const {gravity,width,height} = world;

    const {speedY,speedX} = this;
    this.y += speedY;
    this.speedY += gravity;

    // if(this.y >= world.height-35 && !keyIsPressed)
    //   this.speed=0;

    // if(this.y <= world.height-30) {
    //   const {speed} = this;
    //   this.y += speed;
    //   this.speed += gravity;
    // }

    this.x += speedX;

    if(speedX > 0) {
      this.speedX -= world.airFriction;
    } else {
      this.speedX += world.airFriction;
    }
  }

  moveRight() {
    this.speedX = 4;
  }
  moveLeft() {
    this.speedX = -4;
  }

  jump() {
    this.speedY = this.thrust;
  }

  //collision with bar group (basic true/false) (v1)
  collisionWithBar(bar) {
    const radius = this.diameter/2;

    if(this.x - radius <= bar.left.width && (this.y - radius <= bar.y + bar.height  && this.y + radius >= bar.y) ) {
      return true;
    }

    if(this.x + radius >= bar.right.x && (this.y - radius <= bar.y + bar.height  && this.y + radius >= bar.y) ) {
      return true;
    }
    return false;
  }


  /* collision detection with specific area info
   * 0 - no collision
   * 1 - left top
   * 2 - left bottom
   * 3 - right top
   * 4 - right bottom
   */
  collisionCheckv2(bar) {
    const radius = this.diameter/2;

    //left
    if(this.x - radius <= bar.left.width) {
      //top-surface
      if (this.y + radius >= bar.y && this.y + radius <= bar.y + bar.height) {
        return 1;
      }
      //bottom surface
      if (this.y - radius <= bar.y + bar.height && this.y - radius >= bar.y) {
        return 2;
      }
    }

    //right
    if(this.x + radius >= bar.right.x) {
      //top-surface
      if (this.y + radius >= bar.y && this.y + radius <= bar.y + bar.height) {
        return 3;
      }
      //bottom surface
      if (this.y - radius <= bar.y + bar.height && this.y - radius >= bar.y) {
        return 4;
      }
    }
    return 0;
  }

  /* collision detection with specific area info v3
   * 1 - left top
   * 2 - right top
   *
   * 3 - no collision
   *
   * 4 - left bottom
   * 5 - right bottom
   */
  collisionCheckv3(bar) {
    const radius = this.diameter/2;
    //top surface
    if (this.y + radius >= bar.y && this.y + radius <= bar.y + bar.height) {
      if(this.x - radius <= bar.left.width) return 1; //left
      if(this.x + radius >= bar.right.x) return 2; //right
    }
    //bottom surface
    if (this.y - radius <= bar.y + bar.height && this.y - radius >= bar.y) {
      if(this.x - radius <= bar.left.width) return 4; //left
      if(this.x + radius >= bar.right.x) return 5; //right
    }
    return 3;
  }
}