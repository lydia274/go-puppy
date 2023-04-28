//  General items declarations

const gameArea = document.querySelector("main"); //the game area
const gameAreaBounding = gameArea.getBoundingClientRect(); // limits of the gaming area
const scoreboard = document.getElementById("scoreboard");

const gameOver = document.getElementById("game-lost"); // game LOST  screen
const gameWon = document.getElementById("game-won"); // game WON screen
const startGameScreen = document.getElementById("start-game"); //SCREEN start game
const startGameButton = document.getElementById("start-game-btn"); // BUTTON start  game

const level = document.querySelector("#level span");
const lifeNumber = document.querySelector("#life span");
const scoreNumber = document.querySelector("#score span");

//start Game
startGameButton.addEventListener("click", startGame);
startGameButton.addEventListener("click", function () {
  startGameScreen.classList.add("hidden");
  scoreboard.classList.remove("hidden");
});

const speed = 5;
const life = 3;
const pressedKeys = {
  left: false,
  right: false,
};
let game = null;

const restartGameButton = document.querySelectorAll(".restartButton"); //restart game button
restartGameButton.forEach((button) => {
  button.addEventListener("click", restartGame);
});

//Player Class
class Player {
  constructor() {
    this.element = this.createPlayer();
    this.x = gameArea.clientWidth / 2 - this.element.clientWidth / 2;
    this.y = gameArea.clientHeight - 5;
    this.setPosition();
  }
  createPlayer() {
    const div = document.createElement("div");
    div.id = "player";
    gameArea.append(div);
    return div;
  }
  move(direction) {
    switch (direction) {
      case "right":
        if (this.canMoveRight()) {
          //if there's no right border
          this.x += speed;
        }
        break;
      case "left":
        if (this.canMoveLeft()) {
          //if there's no left border
          this.x += speed * -1;
        }
        break;
    }
    this.setPosition();
  }

  canMoveRight() {
    //set limits of the screen for the player
    const playerMoves = this.element.getBoundingClientRect();
    if (playerMoves.right < gameAreaBounding.right) {
      return true;
    }
    return false;
  }
  canMoveLeft() {
    const playerMoves = this.element.getBoundingClientRect();
    if (playerMoves.left > gameAreaBounding.left) {
      return true;
    }
    return false;
  }

  setPosition() {
    this.element.style.left = `${this.x}px`;
  }
}

//Enemy class
class Enemy {
  constructor() {
    this.element = this.createEnemy();
    this.bounding = this.element.getBoundingClientRect();
    this.x = Math.round(
      Math.random() * (gameArea.clientWidth - this.bounding.width)
    ); //trying to set the initial x axis position for each new enemy with a step
    this.y = gameArea.clientHeight * 0.05;
    this.setPosition();
  }

  createEnemy() {
    const div = document.createElement("div");
    div.classList.add("enemy");
    gameArea.append(div);
    return div;
  }

  setPosition() {
    this.element.style.left = `${this.x}px`;
    this.element.style.top = `${this.y}px`;
  }

  moveEnemy(speed) {
    this.y = this.y + speed + 1; //making it move
  }
}

//Game class
class Game {
  constructor() {
    this.player = new Player();
    this.createEnemy();
    this.enemies = [];
    this.intervalId = null;
    this.counter = 0;

    this.lifeCounter = 3;
    this.levelCounter = 1;
    this.animate();
    this.playerBody = this.player.element.getBoundingClientRect();
    this.enemySpeed = 3;
    this.gameFinished = false;
  }

  reset() {
    this.player = new Player();
    this.createEnemy();
    this.enemies = [];
    this.intervalId = null;
    this.counter = 0;
    scoreNumber.innerText = this.counter;
    this.lifeCounter = 3;
    lifeNumber.innerText = this.lifeCounter;
    this.levelCounter = 1;
    level.innerText = this.levelCounter;
    this.animate();
    this.playerBody = this.player.element.getBoundingClientRect();
    this.enemySpeed = 3;
    this.gameFinished = false;
  }

  createEnemy() {
    setTimeout(() => {
      let newEnemy = new Enemy();
      this.enemies.push(newEnemy);
      if (this.gameFinished) {
        return;
      }
      this.createEnemy();
    }, 400);
  }

  animate() {
    this.intervalId = setInterval(() => {
      this.enemies.forEach((enemy) => {
        enemy.moveEnemy(this.enemySpeed);
        enemy.setPosition();
        this.countScore(enemy);
        this.crash(enemy); //HERE trying to check for collision
      });

      if (
        this.counter !== 0 &&
        this.counter > 10 &&
        this.counter < 20 &&
        this.levelCounter === 1
      ) {
        this.enemySpeed = 5;
        this.levelCounter++; //level 2
        level.innerText = this.levelCounter;
      } else if (
        this.counter > 20 &&
        this.counter < 30 &&
        this.levelCounter === 2
      ) {
        this.enemySpeed = 7;
        this.levelCounter++; // level 3
        level.innerText = this.levelCounter;
      } else if (
        this.counter > 30 &&
        this.counter < 40 &&
        this.levelCounter === 3
      ) {
        this.enemySpeed = 9;
        this.levelCounter++; // level 4
        level.innerText = this.levelCounter;
      } else if (this.counter === 50 && this.levelCounter === 4) {
        /// YOU WIN
        this.gameFinished = true;
        gameWon.classList.remove("hidden");
        level.innerText = "WIN";
      }

      if (pressedKeys.right) {
        this.player.move("right");
      }

      if (pressedKeys.left) {
        this.player.move("left");
      }
    }, 1000 / 60); //animation
  }

  countScore(enemy) {
    //if the enemy is avoided score ++ AND the enemy is removed
    const enemyBounding = enemy.element.getBoundingClientRect();

    if (enemyBounding.bottom >= gameArea.clientHeight) {
      enemy.element.remove(); // remove enemy if it goes offscreen

      this.counter++;

      //   console.log(`score counter ${this.counter}`)
      const score = document.querySelector("#score span");
      score.innerText = this.counter;
    }
  }

  crash(enemy) {
    //if the enemy crashes into the player, the life counter goes down

    const enemyBounding = enemy.element.getBoundingClientRect();
    const playerBounding = this.player.element.getBoundingClientRect();

    const isInY =
      enemyBounding.bottom > playerBounding.top &&
      enemyBounding.top < playerBounding.bottom;
    const isInX =
      enemyBounding.right > playerBounding.left &&
      enemyBounding.left < playerBounding.right;
    if (isInX && isInY) {
      if (!this.collisionOccurred) {
        // check if collision hasn't occurred yet
        this.collisionOccurred = true; // set the variable to true to indicate a collision occurred
        console.log("boom!");

        const life = document.querySelector("#life span");
        this.lifeCounter -= 1;
        life.innerText = this.lifeCounter;

        let playerBoom = document.getElementById("player");
        setTimeout(() => {
          console.log(" big boom!");

          playerBoom.style.backgroundImage = "url('./img/boom.png')";
          playerBoom.style.width = "140px";
          playerBoom.style.height = "150px";
          playerBoom.style.animation = "kaboom 0.3s steps(7) infinite";
          playerBoom.style.transform = "translate(-30px, 0px)";
        }, 100);

        if (this.lifeCounter <= 0) {
          this.gameFinished = true;
          this.gameOver();
        }
        setTimeout(() => {
          this.collisionOccurred = false;
          playerBoom.style.backgroundImage = "url('./img/black.png')";
          playerBoom.style.width = "36px";
          playerBoom.style.height = "50px";
          playerBoom.style.animation =
            "sprite-animation 0.3s steps(3) infinite";
          playerBoom.style.transform = "translate(0px, 0px)";
        }, 500);
      }
    }
  }

  gameOver() {
    clearInterval(this.intervalId);
    gameOver.classList.remove("hidden");
  }
}

window.addEventListener("keydown", handlePressedKeys);
window.addEventListener("keyup", handleReleasedKeys);

function startGame() {
  if (!game) {
    game = new Game();
  }
}

function deleteGame() {
  game.enemies.forEach((enemy) => enemy.element.remove());
  game.player.element.remove();
  game.reset();
  gameOver.classList.add("hidden");
  gameWon.classList.add("hidden");
}

function restartGame() {
  deleteGame();
  startGame();
}

function handlePressedKeys(event) {
  switch (event.code) {
    case "ArrowLeft":
      pressedKeys.left = true;
      break;
    case "ArrowRight":
      pressedKeys.right = true;
      break;
  }
}
function handleReleasedKeys(event) {
  switch (event.code) {
    case "ArrowLeft":
      pressedKeys.left = false;
      break;
    case "ArrowRight":
      pressedKeys.right = false;
      break;
  }
}
