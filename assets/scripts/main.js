let bird = document.querySelector(".bird-image");
let birdSpecs = bird.getBoundingClientRect();
const background = document.querySelector(".game-world");
const backgroundSpecs = background.getBoundingClientRect();
const startPrompt = document.querySelector(".start-prompt");
const scoreBox = document.querySelector(".score-box");
const highScoreBox = document.querySelector(".high-score-box");
const main = document.querySelector("main");
const playAgainBtn = document.querySelector(".play-again-btn");
const resetDataBtn = document.querySelector(".reset-data-btn");
const flyBtn = document.querySelector(".fly-button");

const gravity = 0.35;
let speed = 4;
let gameDificulty = 1;
let score = 0;
let highScore = 0;
let game = "Start";
bird.classList.add("hidden");

document.addEventListener("keydown", ignitionFunction, { once: true });
startPrompt.addEventListener("click", ignitionFunction);
playAgainBtn.addEventListener("click", restartGame);
resetDataBtn.addEventListener("click", resetData);

function resetData() {
	window.location.reload();
}

function restartGame() {
	game = "Start";
	speed = 4;
	gameDificulty = 1;
	score = 0;
	scoreBox.innerHTML = `Score: ${score}`;
	bird.style.top = 116 + "px";
	birdSpecs = bird.getBoundingClientRect();
	document.querySelector(".start-prompt").innerHTML = "Press Spacebar / Touch to Start";
	playAgainBtn.classList.add("hidden");
	resetDataBtn.classList.add("hidden");
	document.addEventListener("keydown", ignitionFunction, { once: true });
	// console.log(game);
	// console.log(score);
	// ignitionFunction();
}

function ignitionFunction() {
	if (game == "Over") {
		return;
	}
	if (game != "Play") {
		document.querySelectorAll(".pipes").forEach((e) => {
			e.remove();
		});
		game = "Play";
		bird.classList.remove("hidden");
		playGame();
		console.log(game);
	}
}

function playGame() {
	playAgainBtn.classList.add("hidden");
	flyBtn.classList.remove("hidden");
	document.querySelector(".start-prompt").classList.add("hidden");
	let pipeOpening = 30;
	let pipeInterval = 0;
	let pipeDistance = 200;

	/////////////////////////////////

	function createPipes() {
		let gameDificultyforDistance = gameDificulty * 10;
		let pipeDistanceReference = pipeDistance - gameDificultyforDistance;
		console.log(pipeDistanceReference);
		if (game != "Play") return;
		if (pipeInterval > pipeDistanceReference) {
			console.log(gameDificulty);
			pipeInterval = 0;
			let randomNum = Math.floor(Math.random() * 43) + 8;
			// console.log(randomNum);
			let pipePositionY = randomNum;
			let pipeNewInverted = document.createElement("img");
			pipeNewInverted.setAttribute("src", "assets/images/pipe-green.png");
			pipeNewInverted.classList.add("pipe-block");
			pipeNewInverted.style.transform = "rotate(0.5turn)";
			pipeNewInverted.style.top = pipePositionY - 70 + "vh";
			pipeNewInverted.style.left = "100vw";
			document.body.appendChild(pipeNewInverted);

			let pipeNew = document.createElement("img");
			pipeNew.setAttribute("src", "assets/images/pipe-green.png");
			pipeNew.classList.add("pipe-block");
			pipeNew.style.top = pipeOpening + pipePositionY + "vh";
			pipeNew.style.left = "100vw";
			document.body.appendChild(pipeNew);
			pipeNew.increase_score = "1";
		}
		pipeInterval++;
		requestAnimationFrame(createPipes);
	}
	requestAnimationFrame(createPipes);

	/////////////////////////////////

	function pipeMovement() {
		if (game != "Play") return;

		let pipes = document.querySelectorAll(".pipe-block");
		pipes.forEach((e) => {
			let pipeSpecs = e.getBoundingClientRect();
			if (pipeSpecs.right <= 0) {
				e.remove();
			} else {
				if (
					birdSpecs.right > pipeSpecs.left &&
					birdSpecs.top < pipeSpecs.bottom &&
					birdSpecs.bottom > pipeSpecs.top &&
					birdSpecs.left < pipeSpecs.right
				) {
					gameOver();
					return;
				} else {
					if (
						pipeSpecs.right < birdSpecs.left &&
						pipeSpecs.right + speed >= birdSpecs.left &&
						e.increase_score === "1"
					) {
						score++;
						difficultyIncrease(score);
						scoreBox.innerHTML = `Score: ${score}`;
						if (highScore < score) {
							highScore = score;
						}
						highScoreBox.innerHTML = `High Score: ${highScore}`;
						// console.log(score);
					}
					e.style.left = pipeSpecs.left - speed + "px";
				}
			}
		});
		requestAnimationFrame(pipeMovement);
	}
	requestAnimationFrame(pipeMovement);

	/////////////////////////////////

	let birdDeltaYPosition = 0;
	function grativyEffect() {
		if (game != "Play") return;

		birdDeltaYPosition = birdDeltaYPosition + gravity;
		document.addEventListener("keydown", upMove, { once: true });
		flyBtn.addEventListener("mousedown", upClickMove);
		document.addEventListener("keyup", downMove, { once: true });
		flyBtn.addEventListener("mouseup", downClickMove);

		bird.style.top = birdSpecs.top + birdDeltaYPosition + "px";
		birdSpecs = bird.getBoundingClientRect();

		if (birdSpecs.top < 0 || birdSpecs.bottom + speed >= backgroundSpecs.bottom) {
			gameOver();
			return;
		}
		requestAnimationFrame(grativyEffect);
	}
	requestAnimationFrame(grativyEffect);

	////////////////////////////////

	function upMove(e) {
		if (e.code == "Space") {
			bird.src = "assets/images/bluebird-downflap.png";
			birdDeltaYPosition = -8;
		}
	}
	function upClickMove() {
		bird.src = "assets/images/bluebird-downflap.png";
		birdDeltaYPosition = -8;
	}

	function downMove(e) {
		if (e.code == "Space") {
			bird.src = "assets/images/bluebird-upflap.png";
		}
	}
	function downClickMove() {
		bird.src = "assets/images/bluebird-upflap.png";
	}

	function difficultyIncrease(score) {
		if (score > gameDificulty * 3) {
			let scorePrime = score;
			console.log(`scorePrime is ${scorePrime}`);
			console.log(`score is ${score}`);
			speed += 0.5;
			gameDificulty++;
			console.log(`difficulty is ${gameDificulty}`);
			return;
		}
	}

	function gameOver() {
		game = "Over";
		flyBtn.classList.add("hidden");
		bird.classList.add("hidden");
		document.querySelector(".start-prompt").innerHTML = "Game Over!";
		document.querySelector(".start-prompt").classList.remove("hidden");
		let pipes = document.querySelectorAll(".pipe-block");
		pipes.forEach((e) => {
			let pipeSpecs = e.getBoundingClientRect();
			e.remove();
		});
		playAgainBtn.classList.remove("hidden");
		resetDataBtn.classList.remove("hidden");
		// console.log("here");
		return;
	}
}
