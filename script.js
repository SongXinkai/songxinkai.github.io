const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gridSize = 20;
let piece = { x: 10, y: 10 };
let direction = { x: 0, y: 0 };
let foods = [];
let score = 100;
const maxScore = 100;
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
            score = Math.min(maxScore, score + scoreIncrement);
            foods.splice(i, 1);
            foods.push({
                x: Math.floor(Math.random() * (canvas.width / gridSize)),
                y: Math.floor(Math.random() * (canvas.height / gridSize))
            });
        }
    }

    score = Math.max(0, score - 1);

    document.getElementById('score').innerText = score;
    updateHealthBar();
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
    healthBarFill.style.width = `${(score / maxScore) * 100}%`;
}

document.addEventListener('keydown', e => {
    e.preventDefault();  // 阻止默认行为
    let newDirection = { ...direction };
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
    if ((newDirection.x !== -direction.x || newDirection.y !== -direction.y) && (newDirection.x !== 0 || newDirection.y !== 0)) {
        direction = newDirection;
        update();
        draw();
    }
});

document.getElementById('foodCount').addEventListener('change', (e) => {
    foodCount = parseInt(e.target.value);
    initializeFoods();
    draw();
});

document.getElementById('scoreIncrement').addEventListener('change', (e) => {
    scoreIncrement = parseInt(e.target.value);
});

initializeFoods();
draw();
updateHealthBar();
