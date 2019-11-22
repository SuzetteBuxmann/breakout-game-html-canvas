var canvas, ctx, x, y, dx, dy, ballRadius, paddleHeight, paddleWidth, paddleX, leftPressed, rightPressed, endState, brickRowCount, brickColumnCount, brickWidth, brickHeight, brickPadding, brickOffsetTop, brickOffsetLeft, score, lives, level, maxLevel, ballSpeed, blockColour, paused, orco;

canvas = document.getElementById('myCanvas');
//drawing context for the canvas - allows us to draw on the canvas:
ctx = canvas.getContext('2d');

blockColour = '#'+Math.floor(Math.random()*16777215).toString(16);
x = (canvas.width/2) + Math.floor(Math.random() * 41)-20;
y = (canvas.height - 30) + Math.floor(Math.random() * 41)-20;
ballSpeed = 2;
dx = ballSpeed;//speed up the ball speed
dy = -(ballSpeed); //speed up the ball speed
ballRadius = 10;
paddleHeight = 10;
paddleWidth = 75;
//starting x position on the x axis:
paddleX = (canvas.width - paddleWidth) / 2;
leftPressed = false; //37
rightPressed = false; //39
endState = false;
brickRowCount = 3;
brickColumnCount = 5;
brickWidth = 75;
brickHeight = 20;
brickPadding = 10;
brickOffsetTop = 30;
brickOffsetLeft = 30;
score = 0;
lives = 3;
level = 1;
maxLevel = 5;
paused = false;
orco = new Image;
orco.src = 'ball.png';

document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);

function keyDownHandler(e) {
	if (e.keyCode == 37) {
		leftPressed = true;
	} else if (e.keyCode === 39) {
		rightPressed = true;
	}
}

function keyUpHandler(e) {
	if (e.keyCode == 37) {
		leftPressed = false;
	} else if (e.keyCode === 39) {
		rightPressed = false;
	}
}

function drawBall() {
	/*draw circle on canvas*/
	ctx.beginPath();
	//1 & 2: xy co-ords
	//3: arc radius
	//4 & 5. start and end angle of the arc
	//Math.PI*2 = 6.28 which is about 360 degrees
	//6 optional: false: clockwise, true: anti-clockwise 
	/*ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
	ctx.fillStyle = '#'+Math.floor(Math.random()*16777215).toString(16);
	ctx.fill();*/
	//using image instead of arc:
	ctx.drawImage(orco, x, y, ballRadius*3, ballRadius*3);
	ctx.closePath();
}

function drawPaddle() {
	ctx.beginPath();
	//1 & 2: x and y co-ords on the canvas
	//3 & 4: specify the size of the rect - w & h
	ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
	ctx.fillStyle = '#8c8c8c';
	ctx.fill();
	ctx.closePath();
}

var bricks = [];
initBricks();
function initBricks() {
	for (var c = 0; c < brickColumnCount; c++) {
		bricks[c] = [];
		for (var r = 0; r < brickRowCount; r++) {
			bricks[c][r] = {
				x: 0,
				y: 0,
				status: 1
			};
		}
	}
}
for (var c = 0; c < brickColumnCount; c++) {
	bricks[c] = [];
	for (var r = 0; r < brickRowCount; r++) {
		bricks[c][r] = {
			x: 0,
			y: 0,
			status: 1
		};
	}
}

function drawBricks() {
	for (var c = 0; c < brickColumnCount; c++) {
		for (var r = 0; r < brickRowCount; r++) {
			if(bricks[c][r].status === 1) {
				var brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
				var brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
				bricks[c][r].x = brickX;
				bricks[c][r].y = brickY;
				ctx.beginPath();
				ctx.rect(brickX, brickY, brickWidth, brickHeight);
				ctx.fillStyle = blockColour;
				ctx.fill();
				ctx.closePath();
			}			
		}
	}
}

function collisionDetection() {
	for (var c = 0; c < brickColumnCount; c++) {
		for (var r = 0; r < brickRowCount; r++) {
			//var b is used to store the brick object in every loop of the collision detection
			//(b for Brick)
			var b = bricks[c][r];
			if(b.status == 1) {
				//if the x position of the ball is greater than the x position of the brick and less than the x of the brick plus the brick width, which means the ball is between the left and right sides of the brick, which is inside the brick, then we change the direction of the ball.  Similar situation with the y.
				if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
					//change the direction of the ball
					dy = -dy;
					b.status = 0;
					score++;
					if(score == brickRowCount*brickColumnCount) {
					//if(score == 1) { //less for testing purposes
						if(level === maxLevel) {
							
							paused = true;
							//next level screen
							ctx.beginPath();
							ctx.rect(0, 0, canvas.width, canvas.height);
							ctx.fillStyle = blockColour;
							ctx.fill();
							ctx.font = "20px Arial";
							ctx.textAlign = "center";
							ctx.fillStyle = '#fff';
							ctx.fillText("Winner! 😎😎😎 New game starting soon...", canvas.width / 2, canvas.height / 2);
							ctx.closePath();
							setTimeout(function() {
								paused = false;
								window.location = self.location;	
							}, 6000);
						} else {
							//start the next level
							level++;
							ballSpeed++;
							brickRowCount++;
							blockColour = '#'+Math.floor(Math.random()*16777215).toString(16);
							initBricks();
							
							dx = ballSpeed;
							dy = -(ballSpeed);
							score = 0;							
							x = (canvas.width/2) + Math.floor(Math.random() * 41)-20;
							y = (canvas.height - 30) + Math.floor(Math.random() * 41)-20;
							paddleX = (canvas.width-paddleWidth)/2;
							paused = true;
							//next level screen
							ctx.beginPath();
							ctx.rect(0, 0, canvas.width, canvas.height);
							ctx.fillStyle = blockColour;
							ctx.fill();
							ctx.font = "20px Arial";
							ctx.textAlign = "center";
							ctx.fillStyle = '#fff';
							ctx.fillText("Level "+(parseInt(level)-1)+" completed. 👽 Starting the next level...", canvas.width / 2, canvas.height / 2);
							ctx.closePath();
							setTimeout(function() {
								paused = false;
								draw();
							}, 3000);
						}
					}
				}
			}			
		}
	}
}


function drawLives() {
	ctx.font = '16px Arial';
	ctx.fillStyle = '#8c8c8c';
	ctx.fillText('Lives: ' + lives, canvas.width-65, 20); //x & y
}

function drawLevel() {
	ctx.font = '16px Arial';
	ctx.fillStyle = '000';
	ctx.textAlign = "center";
	ctx.fillText('Level: ' + level, canvas.width/2, 20); //x & y
}

function drawScore() {
	ctx.font = '16px Arial';
	ctx.fillStyle = '#8c8c8c';
	ctx.fillText('Score: ' + score, brickOffsetLeft*2, 20); //x & y
}


function draw() {
	/*clear circle from the canvas*/
	//1 & 2: top left xy of canvas
	//3 & 4: bottom right xy of canvas
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawBall();
	drawPaddle();
	drawBricks();
	//console.log(bricks);
	drawScore();
	drawLives();
	drawLevel();
	collisionDetection();

	// if the y position of the ball lower than ball radius (top and bottom),
	// or greater than the height of the canvas , 
	//change the direction of the movement on the y axis by setting the dy variable to itself, but reversed (neg + neg = pos)

	if (y + dy < ballRadius) { //if the ball touches the top
		dy = -dy;
	} else if (y + dy > canvas.height - ballRadius) { // - bottom
		//check if the center of the ball is between the left and right edges of the paddle
		if (x > paddleX && x < paddleX + paddleWidth) {
			dy = -dy;
			dx = -dx+1; // change x direction on paddle hit too
		} else {
			lives--;
			if(!lives) {
				paused = true;
				
				
				//game over
				ctx.beginPath();
				ctx.rect(0, 0, canvas.width, canvas.height);
				ctx.fillStyle = blockColour;
				ctx.fill();
				ctx.font = "20px Arial";
				ctx.textAlign = "center";
				ctx.fillStyle = '#fff';
				ctx.fillText("Game Over! 😖 New game starting soon...", canvas.width / 2, canvas.height / 2);
				ctx.closePath();
				
				setTimeout(function() {
					paused = false;
					window.location = self.location;
				}, 6000);
				
			} else {
				x = (canvas.width/2) + Math.floor(Math.random() * 41)-20;
				y = (canvas.height - 30) + Math.floor(Math.random() * 41)-20;
				dx = ballSpeed;
				dy = -(ballSpeed);
				paddleX = (canvas.width-paddleWidth)/2;
			}			
		}
	}

	//same as above, except right side & left side
	if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
		dx = -dx;
	}

	//moving the paddle left or right
	if (leftPressed && paddleX > 0) {
		paddleX -= 7;
	} else if (rightPressed && paddleX < canvas.width - paddleWidth) {
		paddleX += 7;
	}

	/*move the circle to a different position on the canvas*/
	//updating balls x and y co-ords on the canvas every 10 millisecons to make the ball 'move'
	x += dx;
	y += dy;
	if(!paused) {
		//
		requestAnimationFrame(draw);
	} 	
}

//allows us to use the mouse instead of the left/right arrow keys
//finding the x position of the mouse
//clientX: returns the x position of the mouse
//horizontal mouse position in the view port minus the distance between the left edge of the canvas and the mouse pointer
function mouseMoveHandler(e) {
	var relativeX = e.clientX - canvas.offsetLeft;
	if(relativeX > paddleWidth/2 && relativeX < canvas.width-paddleWidth/2) {
		paddleX = relativeX - paddleWidth/2;
	}
}

document.addEventListener('mousemove', mouseMoveHandler);

//2 parameters - function, time in milliseconds
//setInterval(draw, 10); - used requestAnimationFrame in draw function instead, and called draw below
draw();

/*
[0][0] {x:0, y:0, status: 1}
[0][1] {x:0, y:0, status: 1}
[0][2] {x:0, y:0, status: 1}

[1][0] {x:0, y:0, status: 1}
[1][1] {x:0, y:0, status: 1}
[1][2] {x:0, y:0, status: 1}

[2][0] {x:0, y:0, status: 1}
[2][1] {x:0, y:0, status: 1}
[2][2] {x:0, y:0, status: 1}

[3][0] {x:0, y:0, status: 1}
[3][1] {x:0, y:0, status: 1}
[3][2] {x:0, y:0, status: 1}

[4][0] {x:0, y:0, status: 1}
[4][1] {x:0, y:0, status: 1}
[4][2] {x:0, y:0, status: 1}
*/

//ctx.beginPath();
//1 & 2: co-ords on the canvas
//3 & 4: specify the size of the rectangle: w, h
//ctx.rect(20, 40, 50, 50);
//ctx.fillStyle = '#FF0000';
//ctx.fill();
//ctx.closePath();

//ctx.beginPath();
//ctx.rect(160, 10, 100, 40);
//1, 2, 3: rgb - in this case blue
//4: transparency (opacity)
//ctx.strokeStyle = 'rgba(0, 0, 255, 0.5)';
//ctx.stroke();
//ctx.closePath();