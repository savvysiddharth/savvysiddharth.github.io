var cols = 10;
var rows = 10;
var grid = new Array(cols);

var openSet = [];
var closedSet = [];
var start,end;
var w,h;
var path = [];

var stop = false; // stop drawing

let hrus = 0; //heuristic

let finished = false;
var ctr = 0;

function removeFromArray(arr,elt) {
  for (var i = arr.length - 1; i >= 0; i--) {
    if(arr[i] == elt) {
      arr.splice(i,1); // remove(where,how many)
    }
  }
}

function heuristic(a,b) { //educated guess
  if(hrus == 0) {
    var d = mysketch.dist(a.i, a.j, b.i, b.j); //euclidian distance
    return d;
  } else if(hrus == 1) {
    var d = abs(a.i - b.i) + abs(a.j - b.j); //manhatten distance
    return d;
  }
}

class Spot {
  constructor(i,j) {
    this.i = i;
    this.j = j;

    this.f=0;
    this.g=0;
    this.h=0;
    this.neighbours =[];
    this.previous = undefined;
    this.wall = false;
    if(mysketch.random(1) < 0.4) {
      this.wall = true;
    }
  }

  reset() {
    this.f = 0;
    this.g = 0;
    this.h = 0;
  }

  show(col) {
    mysketch.stroke(255);
    mysketch.strokeWeight(1);
    mysketch.fill(col);
    mysketch.ellipse(this.i * w+w/2, this.j * h+w/2, w/2, h/2, w/2, h/2);
    if(this.wall)
    {
      mysketch.fill(0);
      mysketch.stroke(50);
      mysketch.rect(this.i * w, this.j * h, w, h);
    }
  }

  addNeighbours(grid) {
    var col = this.i;
    var row = this.j;

    if(col < cols-1)
      this.neighbours.push(grid[col+1][row]); //right
    if(col > 0)
      this.neighbours.push(grid[col-1][row]); //left
    if(row < rows-1)
      this.neighbours.push(grid[col][row+1]); //down
    if(row > 0)
      this.neighbours.push(grid[col][row-1]); //up

    //corners
    if(col < cols-1 && row < rows-1)
      this.neighbours.push(grid[col+1][row+1]);
    if(col > 0 && row > 0)
      this.neighbours.push(grid[col-1][row-1]);
    if(col > 0 && row < rows-1)
      this.neighbours.push(grid[col-1][row+1]);
    if(col < cols-1 && row > 0)
      this.neighbours.push(grid[col+1][row-1]);
  }
}

let sketch = (p) => {
  p.setup = () => {

    p.createCanvas(500,500);

    const {width,height} = p;

    w = width /cols;
    h = height/rows;

    //making 2D array
    for(var i=0;i<cols;i++) {
      grid[i] = new Array(rows);
    }

    for(var i=0;i<cols;i++) {
      for(var j=0;j<rows;j++) {
        grid[i][j] = new Spot(i,j);
      }
    }


    for(var i=0;i<cols;i++) {
      for(var j=0;j<rows;j++) {
        grid[i][j].addNeighbours(grid);
      }
    }

    start = grid[0][0];
    end = grid[cols-1][rows-1];
    start.wall=false;
    end.wall = false;

    openSet.push(start);
    start.h = heuristic(start,end);
    p.background('rgba(255,255,255,0.1)');
  };

  p.draw = () => {
    if(!stop) {
      p.frameRate(1);
      ctr++;
      if(openSet.length > 0) {
        //keep going
        var winner = 0;
        for(var i=0; i < openSet.length; i++) {
          if(openSet[i].f < openSet[winner].f) {
            winner = i;
          }
        }

        var current = openSet[winner];

        if(current === end) {
          stop = true; //stopping the draw loop to iterate nothing

          //resetting things to initial values
          for(var i=0;i<cols;i++) {
            for(var j=0;j<rows;j++) {
              grid[i][j].reset();
            }
          }
          console.log('cost is '+path.length);
          console.log('finished');
          finished = true;
        }

        removeFromArray(openSet,current);
        closedSet.push(current);

        //calc g
        var neighbours = current.neighbours;
        for(var i=0; i<neighbours.length;i++) {
          var neighbour = neighbours[i];
          if(!closedSet.includes(neighbour) && !neighbour.wall) {
            var temp_g = current.g + 1;

            var newPath=false;
            if(openSet.includes(neighbour)) {
              if(temp_g < neighbour.g) {
                neighbour.g = temp_g;
                newPath=true;
              }
            }
            else {
              neighbour.g = temp_g;
              openSet.push(neighbour);
              newPath=true;
            }

            //calc h
            if(newPath) {
              neighbour.h = heuristic(neighbour,end);
              neighbour.f = neighbour.g + neighbour.h;
              neighbour.previous = current;
            }
          }
        }
      }
      else {
        //no soln
        console.log('NO SOLUTION')
        // noLoop();
        stop = true;
        return;
      }

      //DRAW THINGS
      p.background(50);

      p.strokeWeight(1);
      for(var i=0;i<cols;i++) {
        for(var j=0;j<rows;j++) {
          grid[i][j].show(p.color(255));
        }
      }
      p.fill('rgba(0,0,240,0.5)');
      p.rect(start.i * w, start.j * h, w, h);
      p.fill('rgba(0,240,0,0.5)');
      p.rect(end.i * w, end.j * h, w, h);

      for(var i=0; i<closedSet.length ; i++) {
        closedSet[i].show(p.color(226, 45, 45)); //red
      }

      for(var i=0; i<openSet.length ; i++) {
        openSet[i].show(p.color(58, 206, 41)); //green
      }

      path = [];
      var temp = current;
      path.push(temp);

      while(temp.previous)
      {
        path.push(temp.previous);
        temp = temp.previous;
      }


      for(var i=0;i<path.length-1;i++) {
        p.strokeWeight(6);
        p.stroke(108, 161, 247); //line color
        p.line(path[i].i*w +w/2, path[i].j*h +h/2,path[i+1].i*w +w/2, path[i+1].j*h+h/2);
      }
    }
  };
};

let mysketch = new p5(sketch,"sketchbox");


function playPause(btn) {
  if(finished) {
    resetSketch();
  }
  else {
    stop = !stop;
    if(stop) {
      btn.innerHTML = "Play";
    } else {
      btn.innerHTML = "Pause";
    }
  }
}

function resetSketch() {

  const {width,height} = mysketch;

  stop = false;

  const btn = document.querySelector("#playbtn");
  if(stop) {
    btn.innerHTML = "Play";
  } else {
    btn.innerHTML = "Pause";
  }

  openSet = [];
  closedSet = [];
  path = [];

  w = width /cols;
  h = height/rows;

  //making 2D array
  for(var i=0;i<cols;i++) {
    grid[i] = new Array(rows);
  }

  for(var i=0;i<cols;i++) {
    for(var j=0;j<rows;j++) {
      grid[i][j] = new Spot(i,j);
    }
  }


  for(var i=0;i<cols;i++) {
    for(var j=0;j<rows;j++) {
      grid[i][j].addNeighbours(grid);
    }
  }

  start = grid[0][0];
  end = grid[cols-1][rows-1];
  start.wall=false;
  end.wall = false;

  openSet.push(start);
  start.h = heuristic(start,end);

  finished = false;
}