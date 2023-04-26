
//  General items

const gameArea = document.querySelector("main") //the game area
const gameAreaBounding = gameArea.getBoundingClientRect() // limits of the gaming area
const gameOver = document.getElementById("end-game") // game over 
const startGameScreen = document.getElementById("start-game") //SCREEN start game
const startGameButton = document.getElementById("start-game-btn") // BUTTON start game 

startGameButton.addEventListener('click', startGame)

startGameButton.addEventListener('click', function() {
	startGameScreen.classList.add('hidden')
	})

	const speed = 5
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
		this.element = this.createEnemy() 
		this.bounding = this.element.getBoundingClientRect()
		this.x = Math.round(Math.random() * (gameArea.clientWidth - this.bounding.width)); //trying to set the initial x axis position for each new enemy with a step
		this.y = gameArea.clientHeight * 0.05
		this.setPosition()
	}

	width() {

	}

	createEnemy() {
		const div = document.createElement("div")
		div.classList.add("enemy")
		gameArea.append(div)
		return div
	}
	
	setPosition() {
		this.element.style.left = `${this.x}px`
		this.element.style.top = `${this.y}px`
	}
	
	moveEnemy() {
		this.y++ //making it move
				
	}

}



class Game {
	
	constructor() {
		this.player = new Player()
		this.enemies = []
		this.intervalId = null
		this.counter = 0
		this.lifeCounter = 3
		this.delay = 1500
		this.animate()
		this.createEnemy()	
		this.playerBody = this.player.element.getBoundingClientRect()
		
		
		
	}

	
	createEnemy(){
		setTimeout(()=>{
			let newEnemy = new Enemy()
			this.enemies.push(newEnemy)
			
			this.createEnemy()
		}, this.delay)
	}
	

	animate() {
		this.intervalId = setInterval(() => {
			this.enemies.forEach((enemy) => {
				enemy.moveEnemy()
				enemy.setPosition()
				this.countScore(enemy) 
				this.crash(enemy) //HERE trying to check for collision
			})

			if (pressedKeys.right) {
				this.player.move("right")
			}

			if (pressedKeys.left) {
				this.player.move("left")	
				}
			}, 1500 / 60) //animation speed
		}
		

		countScore(enemy) { //if the enemy is avoided score ++ AND the enemy is removed
			const enemyBounding = enemy.element.getBoundingClientRect();
		  
			if (enemyBounding.bottom >= gameArea.clientHeight) {
			  enemy.element.remove(); // remove enemy if it goes offscreen
			  
			  this.counter++;
			  if (this.delay > 200) {
				  this.delay -= 50
			  }
			//   console.log(`score counter ${this.counter}`)
			  const score = document.querySelector("#score span")
			  score.innerText = this.counter
			}
		  }

		crash(enemy) { //if the enemy crashes into the player, the life counter goes down
			
			// this.collisionOccurred = false
			const enemyBounding = enemy.element.getBoundingClientRect();
			const playerBounding = this.player.element.getBoundingClientRect();
			
			// if (enemyBounding.bottom >= playerBounding.top && ) 
			const isInY = enemyBounding.bottom > playerBounding.top && enemyBounding.top < playerBounding.bottom
			const isInX = enemyBounding.right > playerBounding.left && enemyBounding.left < playerBounding.right
				if(
			  isInX && isInY
				)
			{
				if (!this.collisionOccurred) { // check if collision hasn't occurred yet
					this.collisionOccurred = true; // set the variable to true to indicate a collision occurred
					console.log('boom!');

					
					this.lifeCounter -=1
					setTimeout(() => {
						this.collisionOccurred = false
					}, 1500)
			} else {
				console.log('no boom')
			}
			// return console.log('boom!');
		  }}

		//   crash(enemy){
		// 	const enemyBounding = enemy.element.getBoundingClientRect();
		// 	const enemyFromLeft = Math.floor (gameArea.clientWidth + enemyBounding.left)
		// 	const playerFromLeft = Math.floor (gameArea.clientWidth + this.playerBody.left)
		// 	console.log(enemyFromLeft, playerFromLeft)
		// 	if(enemyBounding.bottom >= this.playerBody.top && enemyFromLeft === playerFromLeft){
		// 		console.log('boom')
		// 		this.lifeCounter -=1
		// 		console.log(`life ${this.lifeCounter}`)
		// 		}
				
		// 		const life = document.querySelector("#life span")
		// 		life.innerText = this.lifeCounter
		// 	}
		  



		gameOver() {
			  if(this.lifeCounter < 0){
				  clearInterval(this.intervalId)
				  gameOver.showModal()
				  gameOver.classList.remove('hidden')
			  }
			  }
			}
	
	



window.addEventListener("keydown", handlePressedKeys)
window.addEventListener("keyup", handleReleasedKeys)

function startGame() {
	new Game()

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
