const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const unit = 20;
const row = canvas.height / unit;
const column = canvas.width / unit;

let snake = [];
function createSnake() {
  //object is to save the snake's location ->(x,y)
  snake[0] = {
    x: 80,
    y: 0,
  };

  snake[1] = {
    x: 60,
    y: 0,
  };

  snake[2] = {
    x: 40,
    y: 0,
  };

  snake[3] = {
    x: 20,
    y: 0,
  };
}

//Fruit Object: to draw several, random, alike fruits，use constructor func
class Fruit {
  constructor() {
    this.x = Math.floor(Math.random() * column) * unit;
    this.y = Math.floor(Math.random() * row) * unit;
  }

  drawFruit() {
    ctx.fillStyle = "#39362f";
    ctx.fillRect(this.x, this.y, unit, unit);
  }
  pickALocation() {
    let overlapping = false;
    let new_x;
    let new_y;

    function checkOverlap(new_x, new_y) {
      //to check (x,y) is overlap or not
      for (let i = 0; i < snake.length; i++) {
        if (new_x == snake[i].x && new_y == snake[i].y) {
          overlapping = true;
          return;
        } else {
          overlapping = false;
        }
      }
    }

    //when overlapping is true which means overlapping = false
    while (true) {
      new_x = Math.floor(Math.random() * column) * unit;
      new_y = Math.floor(Math.random() * row) * unit;

      if (!overlapping) {
        break;
      }
    }
    this.x = new_x;
    this.y = new_y;
  }
}

/////Initial Setting////
createSnake();
let myFruit = new Fruit();
//control the snake's movement by add events on keydown
window.addEventListener("keydown", changeDirection);
//default direction
let d = "Right";
function changeDirection(e) {
  if (e.key == "ArrowRight" && d != "Left") {
    d = "Right";
  } else if (e.key == "ArrowDown" && d != "Up") {
    d = "Down";
  } else if (e.key == "ArrowLeft" && d != "Right") {
    d = "Left";
  } else if (e.key == "ArrowUp" && d != "Down") {
    d = "Up";
  }
  //prevent the continuous clicking up,down,right,left keyboards which causes the fast moving that the snake bites by itself
  //before the next move,do not accept any keydown event
  window.removeEventListener("keydown", changeDirection);
}

//Score counting
let highestScore;
loadHighestScore();

let score = 0;
document.getElementById("myScore").innerHTML = "Score: " + score;
document.getElementById("myScore2").innerHTML =
  "Highest Score: " + highestScore;

//load HighestScore
function loadHighestScore() {
  if (localStorage.getItem("highestScore") == null) {
    highestScore = 0;
  } else {
    highestScore = Number(localStorage.getItem("highestScore"));
  }
}

//set the HighestScore
function setHighestScore(score) {
  if (score > highestScore) {
    localStorage.setItem("highestScore", score);
    highestScore = score;
  }
}

//to draw the snake
function draw() {
  ctx.fillStyle = "#ccb28b";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  myFruit.drawFruit();
  // draw the every part of the snake
  for (let i = 0; i < snake.length; i++) {
    //the beginning
    if (i == 0) {
      ctx.fillStyle = "#944345";
    } else {
      ctx.fillStyle = "#ba7943";
    }
    ctx.strokeStyle = "white";
    //check the whole parts of snake oversteps the canvas or not (穿牆功能)
    if (snake[i].x >= canvas.width) {
      snake[i].x = 0;
    }
    if (snake[i].x < 0) {
      snake[i].x = canvas.width - unit;
    }
    if (snake[i].y >= canvas.height) {
      snake[i].y = 0;
    }
    if (snake[i].y < 0) {
      snake[i].y = canvas.height - unit;
    }
    //get the correct i to draw the snake
    ctx.fillRect(snake[i].x, snake[i].y, unit, unit);
    ctx.strokeRect(snake[i].x, snake[i].y, unit, unit);
  }
  //decide the next step of the snake (the head of the snake)
  let snakeX = snake[0].x;
  let snakeY = snake[0].y;
  if (d == "Left") {
    snakeX -= unit;
  } else if (d == "Right") {
    snakeX += unit;
  } else if (d == "Up") {
    snakeY -= unit;
  } else if (d == "Down") {
    snakeY += unit;
  }

  let newHead = {
    x: snakeX,
    y: snakeY,
  };

  //checking point1: the snake eats the fruit or not
  if (snake[0].x == myFruit.x && snake[0].y == myFruit.y) {
    //1. choose the new fruit;s location
    myFruit.pickALocation();
    //2. draw new fruit
    myFruit.drawFruit();
    //3. update score
    score++;
    setHighestScore(score);
    document.getElementById("myScore").innerHTML = "Score: " + score;
    document.getElementById("myScore2").innerHTML =
      "Highest Score: " + highestScore;
  } else {
    snake.pop();
  }
  snake.unshift(newHead);

  //checking point2: the snake bites itself or not -> if yes, game over
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x == snake[0].x && snake[i].y == snake[0].y) {
      clearInterval(myGame);
      window.alert("Game Over!!!");
      return;
    }
  }

  //done with the next movement of snake,add back the event listener to keep tracking the following events
  window.addEventListener("keydown", changeDirection);
}

//game's timer
let myGame = setInterval(draw, 100);
