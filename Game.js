let canvas = document.getElementById("gameCanvas");
let ctx = canvas.getContext("2d");

let gameInterval;
let blocks = [];
let ball;
let paddle;
let score = 0;

// Game objects
class Block {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 80;
        this.height = 20;
        this.color = "#00f";
    }
    
    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

class Ball {
    constructor() {
        this.x = canvas.width / 2;
        this.y = canvas.height - 30;
        this.radius = 10;
        this.speedX = 2;
        this.speedY = -2;
        this.color = "#f00";
    }
    
    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
    
    move() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Collision with walls
        if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
            this.speedX = -this.speedX;
        }
        if (this.y - this.radius < 0) {
            this.speedY = -this.speedY;
        }
    }
}

class Paddle {
    constructor() {
        this.width = 100;
        this.height = 20;
        this.x = canvas.width / 2 - this.width / 2;
        this.y = canvas.height - this.height - 10;
        this.speed = 7;
        this.dx = 0;
    }
    
    draw() {
        ctx.fillStyle = "#00f";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    
    move() {
        this.x += this.dx;
        
        // Boundary check
        if (this.x < 0) {
            this.x = 0;
        }
        if (this.x + this.width > canvas.width) {
            this.x = canvas.width - this.width;
        }
    }
}

function initGame() {
    // Reset game variables
    blocks = [];
    score = 0;
    paddle = new Paddle();
    ball = new Ball();
    
    // Create blocks
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 7; j++) {
            blocks.push(new Block(j * 90 + 50, i * 30 + 50));
        }
    }
    
    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, 1000 / 60);
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw game elements
    for (let block of blocks) {
        block.draw();
    }
    paddle.draw();
    ball.draw();
    
    // Move game elements
    paddle.move();
    ball.move();
    
    // Ball and paddle collision
    if (ball.y + ball.radius > paddle.y && ball.y - ball.radius < paddle.y + paddle.height &&
        ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
        ball.speedY = -ball.speedY;
        score++;
    }
    
    // Ball and block collision
    for (let i = 0; i < blocks.length; i++) {
        let block = blocks[i];
        if (ball.y - ball.radius < block.y + block.height && ball.y + ball.radius > block.y &&
            ball.x > block.x && ball.x < block.x + block.width) {
            ball.speedY = -ball.speedY;
            blocks.splice(i, 1);
            score += 10;
        }
    }
    
    // Game over check
    if (ball.y + ball.radius > canvas.height) {
        clearInterval(gameInterval);
        alert("Game Over! Score: " + score);
    }
    
    // Display score
    ctx.fillStyle = "#000";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 20, 30);
}

document.getElementById("startButton").addEventListener("click", initGame);

// Paddle movement controls
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
        paddle.dx = -paddle.speed;
    } else if (e.key === "ArrowRight") {
        paddle.dx = paddle.speed;
    }
});

document.addEventListener("keyup", (e) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        paddle.dx = 0;
    }
});
