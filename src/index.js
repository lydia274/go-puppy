
//  General items

const gameArea = document.querySelector("main") //the game area
const gameAreaBounding = gameArea.getBoundingClientRect() // limits of the gaming area
const gameOver = document.getElementById("end-game") // game over 
const startGameScreen = document.getElementById("start-game") //SCREEN start game
const startGameButton = document.getElementById("start-game-btn") // BUTTON start game 
startGameButton.addEventListener('click', startGame)
  startGameButton.addEventListener('click', function() {
    startGameScreen.classList.add('hidden')})


const speed = 5
const enemies = []
const life = 3
const pressedKeys = {
	left: false,
	right: false,
}
let game = null



class Player {
	constructor() {
		this.element = this.createPlayer()
		this.x = gameArea.clientWidth / 2 - this.element.clientWidth / 2
		this.setPosition()
	}
	createPlayer() {
		const div = document.createElement("div")
		div.id = "player"
		gameArea.append(div)
		return div
	}
	move(direction) {
		switch (direction) {
			case "right":
				if (this.canMoveRight()) { //if there's no right border
					this.x += speed
				}
				break
			case "left":
				if (this.canMoveLeft()) { //if there's no left border
					this.x += speed * -1
				}
				break
		}
		this.setPosition()
	}

	canMoveRight() { //set limits of the screen for the player
		const playerMoves = this.element.getBoundingClientRect()
		if (playerMoves.right < gameAreaBounding.right) {
			return true
		}
		return false
	}
	canMoveLeft() {
		const playerMoves = this.element.getBoundingClientRect()
		if (playerMoves.left > gameAreaBounding.left) {
			return true
		}
		return false
	}

	setPosition() {
		this.element.style.left = `${this.x}px`
	}
}

class Enemy {

	constructor() {
		this.element = this.Enemy() 
		this.x = Math.floor(Math.random()* gameArea.clientWidth) 
		this.y = gameArea.clientHeight * 0.05

		this.setPosition()
	}

	Enemy() {
		const div = document.createElement("div")
		div.classList.add("enemy")
		gameArea.append(div)
		return div
	}

	setPosition() {
		this.element.style.left = `${this.x}px`
		this.element.style.top = `${this.y}px`
	}

	move() {

		this.y += 1 // vertical movement
		const EnemyBounding = this.element.getBoundingClientRect()
		 if (EnemyBounding.right >= gameAreaBounding.right) {
		
		this.direction.x = -1
		 }
		if (EnemyBounding.left <= gameAreaBounding.left) {
			this.direction.x = 1
		 }

		 

		// // if (EnemyBounding.bottom >= gameAreaBounding.bottom) {
		// // 	this.direction.y = -1
		// // }
		// if (EnemyBounding.top <= gameAreaBounding.top) {
		// 	this.direction.y = 1
		// }

		this.setPosition()
	}


}

class Game {

	constructor() {
		this.player = new Player()
		this.Enemy = new Enemy()
		this.intervalId = null
		this.scoreNum = 0
		this.animate()

	}

	animate() {
		this.intervalId = setInterval(() => {
			if (this.collisionDetection()) {
				this.Enemy.direction.y = -1
			}

			if (pressedKeys.right) {
				this.player.move("right")
			}
			if (pressedKeys.left) {
				this.player.move("left")
			}

			this.Enemy.move()
			if (this.enemyPassed()) {
				//scoreNum++
				
			}
		}, 1000 / 60)
	}

	gameOver() {
		if(this.life < 0){
			clearInterval(this.intervalId)
			gameOver.showModal()
			gameOver.classList.remove('hidden')


		}
	}
	enemyPassed() {
		const EnemyBounding = this.Enemy.element.getBoundingClientRect()
		return EnemyBounding.bottom >= gameAreaBounding.bottom
	}

	collisionDetection() {
		const EnemyBounding = this.Enemy.element.getBoundingClientRect()
		const playerMoves = this.player.element.getBoundingClientRect()
		const isInX =
			EnemyBounding.left < playerMoves.right &&
			EnemyBounding.right > playerMoves.left
		const isInY =
			EnemyBounding.bottom > playerMoves.top &&
			EnemyBounding.top < playerMoves.bottom
		//console.log(isInX && isInY)
		return isInX && isInY
	}

	// scoreCount () {
	// 	const score = document.querySelector("#score")  //the score board
	// 	scoreNum ++
	// 	score.innerText = `Score: ${scoreNum}` 
	// }


}

window.addEventListener("keydown", handlePressedKeys)
window.addEventListener("keyup", handleReleasedKeys)

function startGame() {
	new Game()
	;

}

function handlePressedKeys(event) {
	switch (event.code) {
		case "ArrowLeft":
			pressedKeys.left = true
			break
		case "ArrowRight":
			pressedKeys.right = true
			break
	}
}
function handleReleasedKeys(event) {
	switch (event.code) {
		case "ArrowLeft":
			pressedKeys.left = false
			break
		case "ArrowRight":
			pressedKeys.right = false
			break
	}
}
