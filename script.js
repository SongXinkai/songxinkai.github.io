const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gridSize = 20;
let piece = { x: 10, y: 10 };
let direction = { x: 0, y: 0 };
let foods = [];
let score = 0; // 吃到食物的数量
let hp = 100; // 血量
const maxHP = 100;
let foodCount = 1;
let scoreIncrement = 10;

function initializeFoods() {
    foods = [];
    for (let i = 0; i < foodCount; i++) {
        foods.push({
            x: Math.floor(Math.random() * (canvas.width / gridSize)),
            y: Math.floor(Math.random() * (canvas.height / gridSize))
        });
    }
}

function update() {
    const head = { x: piece.x + direction.x, y: piece.y + direction.y };

    // Wrap around the edges
    head.x = (head.x + canvas.width / gridSize) % (canvas.width / gridSize);
    head.y = (head.y + canvas.height / gridSize) % (canvas.height / gridSize);
    piece = head;

    for (let i = 0; i < foods.length; i++) {
        if (piece.x === foods[i].x && piece.y === foods[i].y) {
            hp = Math.min(maxHP, hp + scoreIncrement);
            score++;
            foods.splice(i, 1);
            foods.push({
                x: Math.floor(Math.random() * (canvas.width / gridSize)),
                y: Math.floor(Math.random() * (canvas.height / gridSize))
            });
            break;
        }
    }
    hp = Math.max(0, hp - 1);

    document.getElementById('score').innerText = score;
    updateHealthBar();

    if (hp === 0) {
        gameOver();
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'red';
    foods.forEach(food => {
        ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
    });

    ctx.fillStyle = 'green';
    ctx.fillRect(piece.x * gridSize, piece.y * gridSize, gridSize, gridSize);
}

function updateHealthBar() {
    const healthBarFill = document.getElementById('healthBarFill');
    healthBarFill.style.width = `${(hp / maxHP) * 100}%`;
}

function gameOver() {
    document.getElementById('gameOver').style.display = 'block';
    document.getElementById('totalScore').innerText = score;
    direction = { x: 0, y: 0 }; // Stop the game
}

document.addEventListener('keydown', e => {
    e.preventDefault();  // 阻止默认行为
    let newDirection = { x: 0, y: 0 };
    switch (e.key) {
        case 'ArrowUp':
            newDirection = { x: 0, y: -1 };
            break;
        case 'ArrowDown':
            newDirection = { x: 0, y: 1 };
            break;
        case 'ArrowLeft':
            newDirection = { x: -1, y: 0 };
            break;
        case 'ArrowRight':
            newDirection = { x: 1, y: 0 };
            break;
    }
    if ((newDirection.x !== 0 || newDirection.y !== 0)) {
        direction = newDirection;
        update();
        draw();
    }
});

document.getElementById('decreaseFoodCount').addEventListener('click', () => {
    if (foodCount > 1) {
        foodCount--;
        document.getElementById('foodCount').innerText = foodCount;
        initializeFoods();
        draw();
    }
});

document.getElementById('increaseFoodCount').addEventListener('click', () => {
    foodCount++;
    document.getElementById('foodCount').innerText = foodCount;
    initializeFoods();
    draw();
});

document.getElementById('decreaseScoreIncrement').addEventListener('click', () => {
    if (scoreIncrement > 1) {
        scoreIncrement--;
        document.getElementById('scoreIncrement').innerText = scoreIncrement;
    }
});

document.getElementById('increaseScoreIncrement').addEventListener('click', () => {
    scoreIncrement++;
    document.getElementById('scoreIncrement').innerText = scoreIncrement;
});

document.getElementById('restartButton').addEventListener('click', () => {
    document.getElementById('gameOver').style.display = 'none';
    piece = { x: 10, y: 10 };
    direction = { x: 0, y: 0 };
    score = 0;
    hp = maxHP;
    initializeFoods();
    update();
    draw();
    updateHealthBar();
});

function initializeGame() {
    initializeFoods();
    draw();
    updateHealthBar();
}

initializeGame();
