/* ─── Flip Card ──────────────────────────────────────── */
const card = document.getElementById("card");

card.addEventListener("click", () => {
    card.classList.toggle("flipped");
});


/* ─── SVG Gradient Injection ─────────────────────────── */
(function injectGradient() {
    const svg = card.querySelector(".card-border");
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");

    defs.innerHTML = `
        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stop-color="#c9a84c" stop-opacity="0"/>
            <stop offset="25%"  stop-color="#e8d5a3" stop-opacity="1"/>
            <stop offset="50%"  stop-color="#c9a84c" stop-opacity="1"/>
            <stop offset="75%"  stop-color="#7a6330" stop-opacity="1"/>
            <stop offset="100%" stop-color="#c9a84c" stop-opacity="0"/>
        </linearGradient>
    `;
    svg.prepend(defs);
})();


/* ─── Ambient Particle System ────────────────────────── */
(function initParticles() {
    const canvas = document.getElementById("particles");
    const ctx    = canvas.getContext("2d");

    const GOLD = [
        "rgba(201,168,76,",
        "rgba(232,213,163,",
        "rgba(122,99,48,",
    ];

    let W, H, particles;

    function resize() {
        W = canvas.width  = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }

    function randomBetween(a, b) {
        return a + Math.random() * (b - a);
    }

    function createParticle() {
        return {
            x:     randomBetween(0, W),
            y:     randomBetween(0, H),
            r:     randomBetween(0.4, 1.6),
            vy:    randomBetween(-0.12, -0.38),   // drift upward
            vx:    randomBetween(-0.08, 0.08),
            alpha: randomBetween(0.1, 0.7),
            decay: randomBetween(0.0008, 0.0022),
            color: GOLD[Math.floor(Math.random() * GOLD.length)],
        };
    }

    function init() {
        resize();
        particles = Array.from({ length: 90 }, createParticle);
    }

    function step() {
        ctx.clearRect(0, 0, W, H);

        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = p.color + p.alpha + ")";
            ctx.fill();

            p.x     += p.vx;
            p.y     += p.vy;
            p.alpha -= p.decay;

            // Respawn when faded or offscreen
            if (p.alpha <= 0 || p.y < -10) {
                particles[i] = createParticle();
                particles[i].y = H + 10;   // start from bottom
                particles[i].alpha = randomBetween(0.05, 0.4);
            }
        }

        requestAnimationFrame(step);
    }

    window.addEventListener("resize", () => {
        resize();
        particles.forEach(p => {
            p.x = randomBetween(0, W);
        });
    });

    init();
    step();
})();


/* ─── Hover: reset border animation on re-hover ─────── */
(function resetBorderOnHover() {
    const scene      = document.getElementById("card");
    const borderPath = scene.querySelector(".border-path");

    scene.addEventListener("mouseenter", () => {
        // Reset the animation so it replays each hover
        borderPath.style.animation = "none";
        // Force reflow
        void borderPath.offsetWidth;
        borderPath.style.animation = "";
    });
})();
