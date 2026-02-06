import { reasons, galleryImages, giftMessage } from './data.js';

document.addEventListener('DOMContentLoaded', () => {
    initHero();
    renderReasons();
    renderGallery();
    initGame();
    initGift();
});

// --- Hero & Confetti ---
function initHero() {
    document.getElementById('start-btn').addEventListener('click', () => {
        document.getElementById('reasons').scrollIntoView({ behavior: 'smooth' });
    });

    // Simple Confetti (Canvas)
    const canvas = document.getElementById('confetti-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const confetti = [];
    const colors = ['#A8E6CF', '#FF8B94', '#FFD3B6', '#FFFFFF'];

    function createConfetti() {
        return {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            size: Math.random() * 10 + 5,
            color: colors[Math.floor(Math.random() * colors.length)],
            speedY: Math.random() * 3 + 2,
            speedX: Math.random() * 2 - 1
        };
    }

    for (let i = 0; i < 150; i++) {
        confetti.push(createConfetti());
    }

    function animateConfetti() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        confetti.forEach((p, i) => {
            p.y += p.speedY;
            p.x += p.speedX;
            ctx.fillStyle = p.color;
            ctx.fillRect(p.x, p.y, p.size, p.size);

            if (p.y > canvas.height) {
                confetti[i] = createConfetti();
            }
        });
        requestAnimationFrame(animateConfetti);
    }
    animateConfetti();
    
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// --- Render Reasons ---
function renderReasons() {
    const grid = document.getElementById('reasons-grid');
    reasons.forEach((reason, index) => {
        const card = document.createElement('div');
        card.className = 'reason-card';
        card.innerHTML = `
            <div class="reason-number">${index + 1}</div>
            <p>${reason}</p>
        `;
        grid.appendChild(card);
    });
}

// --- Render Gallery ---
function renderGallery() {
    const container = document.getElementById('gallery-container');
    galleryImages.forEach(src => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.innerHTML = `<img src="${src}" alt="Memory" loading="lazy">`;
        container.appendChild(item);
    });
}

// --- Game Logic ---
function initGame() {
    const startBtn = document.getElementById('start-game-btn');
    const gameArea = document.getElementById('game-area');
    const scoreEl = document.getElementById('score');
    let score = 0;
    let gameInterval;
    let isPlaying = false;

    startBtn.addEventListener('click', startGame);

    function startGame() {
        if (isPlaying) return;
        isPlaying = true;
        score = 0;
        scoreEl.innerText = score;
        startBtn.style.display = 'none';

        // Spawn cakes
        gameInterval = setInterval(spawnCake, 800);
    }

    function spawnCake() {
        if (!isPlaying) return;
        
        const cake = document.createElement('div');
        cake.innerText = '🎂';
        cake.className = 'cake';
        
        // Random position
        const x = Math.random() * (gameArea.clientWidth - 50);
        const y = Math.random() * (gameArea.clientHeight - 50);
        
        cake.style.left = `${x}px`;
        cake.style.top = `${y}px`;
        
        cake.addEventListener('click', () => {
            score++;
            scoreEl.innerText = score;
            cake.remove();
            
            if (score >= 30) {
                endGame();
            }
        });

        gameArea.appendChild(cake);

        // Remove cake after a few seconds
        setTimeout(() => {
            if (cake.parentNode) cake.remove();
        }, 2000);
    }

    function endGame() {
        isPlaying = false;
        clearInterval(gameInterval);
        gameArea.innerHTML = '<h3 style="color: var(--color-accent); font-size: 2rem;">YAY! You won! 🎉</h3><p>Scroll down for your gift!</p>';
        
        // Reveal Gift Section
        const giftSection = document.getElementById('gift');
        giftSection.classList.remove('hidden-section');
        
        giftSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// --- Gift Reveal ---
function initGift() {
    const box = document.getElementById('gift-box');
    const content = document.getElementById('gift-content');
    const msg = document.getElementById('gift-message');

    msg.innerText = giftMessage;

    box.addEventListener('click', () => {
        box.style.display = 'none';
        content.classList.remove('hidden');
        // Optional: Play sound or added animation here
    });
}
