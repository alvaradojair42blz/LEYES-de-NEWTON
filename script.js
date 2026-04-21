// FONDO DE PARTÍCULAS
const canvas = document.getElementById("fondo");
const ctx = canvas.getContext("2d");
let particulas = [];

function resize() {
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

function animar() {
    ctx.clearRect(0,0,canvas.width, canvas.height);
    particulas.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.brillo * 0.7})`;
        ctx.fill();
        p.x += p.dx; p.y += p.dy;
        if(p.x<0 || p.x>canvas.width) p.dx *= -1;
        if(p.y<0 || p.y>canvas.height) p.dy *= -1;
    });
    requestAnimationFrame(animar);
}
window.addEventListener("resize", resize);
resize(); animar();

// PRIMERA LEY
let movido = false;
function moverObjeto() {
    const obj = document.getElementById("objeto");
    const area = document.querySelector(".demo-area");
    obj.style.left = movido ? "20px" : (area.offsetWidth - 60) + "px";
    movido = !movido;
}

function resetObjeto() {
    document.getElementById("objeto").style.left = "20px";
    movido = false;
}

// SEGUNDA LEY
function calcularFuerza() {
    const m = parseFloat(document.getElementById("masa").value);
    const a = parseFloat(document.getElementById("aceleracion").value);
    const res = document.getElementById("resultado");
    if(isNaN(m) || isNaN(a)) {
        res.style.color = "#ef4444";
        res.innerText = "⚠ Por favor ingresa valores válidos.";
    } else {
        res.style.color = "var(--accent2)";
        res.innerText = `Fuerza resultante: ${(m*a).toFixed(2)} N`;
    }
}

// TERCERA LEY (CORREGIDO)
function accionReaccion() {
    const cont = document.getElementById("reaccion-container");
    const texto = document.getElementById("reaccion-texto");

    if (cont.classList.contains("reaccion-hidden")) {
        cont.classList.remove("reaccion-hidden");
        cont.classList.add("reaccion-visible");
        texto.innerText = "✔ A toda acción corresponde una reacción igual y opuesta.";
    } else {
        cont.classList.remove("reaccion-visible");
        cont.classList.add("reaccion-hidden");
        texto.innerText = "";
    }
}

// ANIMACIÓN REVEAL
function reveal() {
    document.querySelectorAll(".reveal").forEach(el => {
        if(el.getBoundingClientRect().top < window.innerHeight - 100) {
            el.classList.add("active");
        }
    });
}
window.addEventListener("scroll", reveal);
window.addEventListener("DOMContentLoaded", reveal);