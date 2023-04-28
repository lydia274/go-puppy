![](https://i.imgur.com/7oX5EWf.png)

Play as a cute little puppy and try your best to make it back home safely.

This racing game is built entirely on **JavaScript**, **HTML**, and **CSS**, and is designed to test your agility and reflexes.

**_Rules and objectives:_**

Help the puppy navigate through the obstacles on its way back home. Your task is to move the puppy right and left to avoid the obstacles and gain points for every successfully avoided obstacle. The game features increasing levels of difficulty as you progress, with the speed increasing every 10 points you earn.

![](https://i.imgur.com/oC1G4OS.png)

Get ready to test your skills to see if you have what it takes to bring the puppy home safely!

Here you can take a glimpse at the structure of the code:

<details>
  <summary>JS</summary>
  
 * General items declarations (game area, buttons, divs)
* Player Class
	- contructor
	- createPlayer
	- move
	- canMoveRight, canMoveLeft
	- setPosition
* Enemy Class
	- constructor
	- createEnemy (sets the properties of a static character)
	- setPosition
	- moveEnemy
* Game Class
	- constructor
	- reset
	- createEnemy (pushes multiple characters into an array)
	- animate
	- countScore
	- crash
	- gameOver
* startGame
* deleteGame
* restart
* keys down and up
</details>

<details><summary>HTML</summary>
* Game area 
* Score board
* Game Lost screen 
* Game Win screen
</details>

<details><summary>CSS</summary>
* Global settings
* Game area properties
* Start screen
* Scoreboard
* Obstacles and the player
* Special effect
* Message boxes and buttons (neutral, hovered, pressed)
* "Hidden" class 
* Game Win screen
* Game LOST screen
</details>
