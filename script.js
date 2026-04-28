// --- FONDO DE PARTÍCULAS ---
const canvas = document.getElementById("fondo");
const ctx = canvas.getContext("2d");
let particulas = [];

function resize() {
    if(!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    crearParticulas();
}

function crearParticulas() {
    particulas = [];
    for(let i=0; i<100; i++) {
        particulas.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 1.5 + 0.5,
            dx: (Math.random() - 0.5) * 0.2,
            dy: (Math.random() - 0.5) * 0.2,
            brillo: Math.random()
        });
    }
}

function animarParticulas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particulas.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.brillo * 0.7})`;
        ctx.fill();
        p.x += p.dx; p.y += p.dy;
        if(p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if(p.y < 0 || p.y > canvas.height) p.dy *= -1;
    });
    requestAnimationFrame(animarParticulas);
}

// --- FÍSICA DE COLISIONES (3ra LEY) ---
let animacionFisicaId;
let simulando = false;
let p1 = { x: 50, y: 50, vx: 4, vy: 3, el: null };
let p2 = { x: 150, y: 120, vx: -3, vy: -4, el: null };

function accionReaccion() {
    p1.el = document.getElementById('pelota1');
    p2.el = document.getElementById('pelota2');
    const txt = document.getElementById('reaccion-texto');

    if (!simulando) {
        simulando = true;
        if(txt) txt.innerText = "Simulando interacción de fuerzas...";
        loopFisico();
    } else {
        simulando = false;
        cancelAnimationFrame(animacionFisicaId);
        if(txt) txt.innerText = "Simulación pausada.";
    }
}

function loopFisico() {
    const container = document.getElementById('canvas-container');
    const ancho = container.clientWidth;
    const alto = container.clientHeight;
    const radio = 35;

    // Actualizar Posiciones
    p1.x += p1.vx; p1.y += p1.vy;
    p2.x += p2.vx; p2.y += p2.vy;

    // Rebotes Pelota 1 (Con corrección para no trabarse)
    if (p1.x <= 0) { p1.vx = Math.abs(p1.vx); p1.x = 0; }
    if (p1.x >= ancho - radio) { p1.vx = -Math.abs(p1.vx); p1.x = ancho - radio; }
    if (p1.y <= 0) { p1.vy = Math.abs(p1.vy); p1.y = 0; }
    if (p1.y >= alto - radio) { p1.vy = -Math.abs(p1.vy); p1.y = alto - radio; }

    // Rebotes Pelota 2
    if (p2.x <= 0) { p2.vx = Math.abs(p2.vx); p2.x = 0; }
    if (p2.x >= ancho - radio) { p2.vx = -Math.abs(p2.vx); p2.x = ancho - radio; }
    if (p2.y <= 0) { p2.vy = Math.abs(p2.vy); p2.y = 0; }
    if (p2.y >= alto - radio) { p2.vy = -Math.abs(p2.vy); p2.y = alto - radio; }

    // Colisión entre ellas
    let dx = p2.x - p1.x;
    let dy = p2.y - p1.y;
    let distancia = Math.sqrt(dx * dx + dy * dy);

    if (distancia < radio) {
        // Intercambio de velocidades
        let v1x = p1.vx; let v1y = p1.vy;
        p1.vx = p2.vx; p1.vy = p2.vy;
        p2.vx = v1x; p2.vy = v1y;
        // Separación para evitar que se peguen
        p1.x += p1.vx; p1.y += p1.vy;
    }

    // Aplicar al DOM
    p1.el.style.transform = `translate(${p1.x}px, ${p1.y}px)`;
    p2.el.style.transform = `translate(${p2.x}px, ${p2.y}px)`;

    if (simulando) {
        animacionFisicaId = requestAnimationFrame(loopFisico);
    }
}

// --- RESTO DE FUNCIONES (Inercia, Cálculo, Quiz, Reveal) ---
function moverObjeto() {
    const obj = document.getElementById("objeto");
    if(!obj) return;
    const actualTransform = obj.style.transform;
    obj.style.transform = (actualTransform === "translateX(300px)") ? "translateX(0px)" : "translateX(300px)";
}

function resetObjeto() {
    const obj = document.getElementById("objeto");
    if(obj) obj.style.transform = "translateX(0px)";
}

function ejecutarCalculo() {
    const m = parseFloat(document.getElementById("masa").value);
    const a = parseFloat(document.getElementById("aceleracion").value);
    const res = document.getElementById("resultado");
    if (m > 0 && a > 0) {
        res.innerHTML = `<strong>Resultado: ${(m * a).toFixed(2)} N</strong>`;
        res.style.color = "#00d4ff";
    } else {
        res.innerText = "⚠ Ingresa valores válidos.";
        res.style.color = "#ef4444";
    }
}

const preguntas = [
    { q: "¿Qué ley explica por qué un pasajero se va hacia adelante cuando un auto frena?", opciones: ["1ra Ley (Inercia)", "2da Ley (Masa)", "3ra Ley (Acción/Reacción)"], correcta: 0 },
    { q: "Si aplicas la misma fuerza a un camión y a una bicicleta, ¿quién acelera más?", opciones: ["El camión", "La bicicleta", "Aceleran igual"], correcta: 1 },
    { q: "La fórmula F = m • a pertenece a la:", opciones: ["Ley de Inercia", "Ley fundamental de la dinámica", "Ley de Acción y Reacción"], correcta: 1 }
];
let preguntaActual = 0;

function cargarPregunta() {
    const container = document.getElementById("opciones-container");
    if(!container) return;
    const q = preguntas[preguntaActual];
    document.getElementById("pregunta-texto").innerText = q.q;
    container.innerHTML = "";
    document.getElementById("feedback-quiz").innerText = "";
    q.opciones.forEach((op, i) => {
        const btn = document.createElement("button");
        btn.innerText = op;
        btn.onclick = () => verificarRespuesta(i);
        container.appendChild(btn);
    });
}

function verificarRespuesta(i) {
    const btns = document.getElementById("opciones-container").getElementsByTagName("button");
    const feed = document.getElementById("feedback-quiz");
    if(i === preguntas[preguntaActual].correcta) {
        btns[i].classList.add("btn-correcto");
        feed.innerText = "¡Correcto! 🎯";
        setTimeout(() => {
            preguntaActual++;
            if(preguntaActual < preguntas.length) cargarPregunta();
            else document.getElementById("quiz-container").innerHTML = "<h3>¡Desafío completado! 🚀</h3>";
        }, 1000);
    } else {
        btns[i].classList.add("btn-error");
        feed.innerText = "Intenta de nuevo... ❌";
    }
}

function reveal() {
    document.querySelectorAll(".reveal").forEach(el => {
        if(el.getBoundingClientRect().top < window.innerHeight - 100) el.classList.add("active");
    });
}

// INICIO
window.addEventListener("resize", resize);
window.addEventListener("scroll", reveal);
window.addEventListener("DOMContentLoaded", () => {
    resize();
    animarParticulas();
    reveal();
    cargarPregunta();
});