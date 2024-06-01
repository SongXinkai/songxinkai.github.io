const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gridSize = 20;
let snake = [{ x: 10, y: 10 }];
let direction = { x: 0, y: 0 };
let foods = [];
let score = 0;
let foodCount = 1;
let scoreIncrement = 10;
let gameSpeed = 100;

function initializeFoods() {
    foods = [];
    for (let i = 0; i < foodCount; i++) {
        foods.push({
            x: Math.floor(Math.random() * (canvas.width / gridSize)),
            y: Math.floor(Math.random() * (canvas.height / gridSize))
        });
    }
}

function gameLoop() {
    update();
    draw();
}

function update() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    // Wrap around the edges
    head.x = (head.x + canvas.width / gridSize) % (canvas.width / gridSize);
    head.y = (head.y + canvas.height / gridSize) % (canvas.height / gridSize);

    snake.unshift(head);

    for (let i = 0; i < foods.length; i++) {
        if (head.x === foods[i].x && head.y === foods[i].y) {
            score += scoreIncrement;
            foods.splice(i, 1);
            foods.push({
                x: Math.floor(Math.random() * (canvas.width / gridSize)),
                y: Math.floor(Math.random() * (canvas.height / gridSize))
            });
        }
    }

    if (!foods.some(food => food.x === head.x && food.y === head.y)) {
        snake.pop();
    }

    score--; // Decrease score by 1 for each step
    document.getElementById('score').innerText = score;

    if (snakeCollision(head)) {
        clearInterval(gameInterval);
        alert('Game Over! Your score: ' + score);
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'red';
    foods.forEach(food => {
        ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
    });

    ctx.fillStyle = 'green';
    snake.forEach(segment => {
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
    });
}

function snakeCollision(head) {
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) {
            return true;
        }
    }
    return false;
}

document.addEventListener('keydown', e => {
    switch (e.key) {
        case 'ArrowUp':
            if (direction.y === 0) direction = { x: 0, y: -1 };
            break;
        case 'ArrowDown':
            if (direction.y === 0) direction = { x: 0, y: 1 };
            break;
        case 'ArrowLeft':
            if (direction.x === 0) direction = { x: -1, y: 0 };
            break;
        case 'ArrowRight':
            if (direction.x === 0) direction = { x: 1, y: 0 };
            break;
    }
});

document.getElementById('speedUpButton').addEventListener('click', () => {
    gameSpeed = Math.max(10, gameSpeed - 10);
    restartGame();
});

document.getElementById('speedDownButton').addEventListener('click', () => {
    gameSpeed += 10;
    restartGame();
});

document.getElementById('foodCount').addEventListener('change', (e) => {
    foodCount = parseInt(e.target.value);
    initializeFoods();
});

document.getElementById('scoreIncrement').addEventListener('change', (e) => {
    scoreIncrement = parseInt(e.target.value);
});

function restartGame() {
    clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, gameSpeed);
}

initializeFoods();
const gameInterval = setInterval(gameLoop, gameSpeed);
