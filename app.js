/* ---------- Utils ---------- */
const $ = (q, el=document) => el.querySelector(q);
const $$ = (q, el=document) => [...el.querySelectorAll(q)];
const rand = (a,b) => a + Math.random()*(b-a);

/* ---------- Better jokes (no bad vibes, less age focus) ---------- */
const jokes = [
  "Heute ist Papas Tag: Chef-Modus aktiviert. 🎩",
  "Möge dein Kaffee stark sein und dein Tag entspannt. ☕️",
  "Wünsche dir ein Jahr voller Highlights – und ganz wenig „Kleingedrucktes“. ✨",
  "Plot Twist: Der beste Teil des Tages bist du. ❤️",
  "Wenn heute etwas schiefgeht: Wir nennen es ‚Special Effects‘. 🎬",
  "Heute gilt: Gute Laune ist Pflicht, Abwasch ist optional. 😄",
  "Möge dein WLAN stabil sein und deine Snacks nie ausgehen. 📶🥨",
  "Du bist nicht nur Papa – du bist das Upgrade. ⭐️",
  "Ich wünsche dir Momente, die sich anfühlen wie Freitagabend. 🕺",
  "Heute wird gefeiert – mit Stil, mit Witz und mit sehr guten Vibes. 🎉",
  "Wenn jemand fragt, was heute wichtig ist: Du. Punkt. ✅",
  "Mission des Tages: Lachen sammeln. Nebenmission: Kuchen. 🍰"
];

let jokeIdx = 0;
function typeLine(line){
  const el = $("#type");
  el.textContent = "";
  let i = 0;
  const timer = setInterval(() => {
    el.textContent = line.slice(0, i++);
    if(i > line.length) clearInterval(timer);
  }, 18);
}
function nextJoke(){
  typeLine(jokes[jokeIdx % jokes.length]);
  jokeIdx++;
}

$("#moreBtn").addEventListener("click", () => {
  nextJoke();
  confettiBurst(90);
});

/* ---------- Confetti ---------- */
const confettiLayer = $("#confetti");
const confColors = ["#ffd166","#06d6a0","#ef476f","#118ab2","#f7f7ff","#ff9f1c"];

function makePiece(xvw){
  const div = document.createElement("div");
  div.className = "piece";
  const shape = Math.random();
  if(shape < 0.20) div.classList.add("round");
  else if(shape < 0.32) div.classList.add("star");

  const size = rand(8, 16);
  div.style.left = xvw + "vw";
  div.style.top = (-40 - Math.random()*120) + "px";
  div.style.width = (div.classList.contains("round") ? size : size*0.75) + "px";
  div.style.height = size + "px";
  div.style.background = confColors[Math.floor(Math.random()*confColors.length)];
  const delay = rand(0, 0.55);
  const dur = rand(2.6, 5.0);
  div.style.animationDuration = dur + "s";
  div.style.animationDelay = delay + "s";
  div.style.opacity = rand(0.72, 0.98);

  confettiLayer.appendChild(div);
  setTimeout(() => div.remove(), (dur+delay)*1000 + 200);
}
function confettiBurst(amount=140, center=null){
  const c = center ?? rand(20, 80);
  for(let i=0;i<amount;i++){
    makePiece(c + rand(-18, 18));
  }
}
$("#boom").addEventListener("click", () => confettiBurst(220));

/* ---------- Balloons (subtle background wow) ---------- */
const balloonLayer = $("#balloons");
function spawnBalloon(){
  const b = document.createElement("div");
  b.className = "balloon";
  const left = rand(-5, 105);
  const dur = rand(14, 26);
  const dx = rand(-18, 18) + "vw";
  const rot = rand(-60, 60) + "deg";
  b.style.left = left + "vw";
  b.style.animationDuration = dur + "s";
  b.style.setProperty("--dx", dx);
  b.style.setProperty("--rot", rot);
  b.style.background = confColors[Math.floor(Math.random()*confColors.length)];
  balloonLayer.appendChild(b);
  setTimeout(() => b.remove(), dur*1000 + 400);
}
setInterval(() => {
  if(document.visibilityState === "visible") spawnBalloon();
}, 900);

/* ---------- Voucher reveal burst ---------- */
const voucher = $("#gutschein");
let voucherBurstDone = false;
const io = new IntersectionObserver((entries) => {
  for(const e of entries){
    if(e.isIntersecting && !voucherBurstDone){
      voucherBurstDone = true;
      confettiBurst(260);
    }
  }
}, {threshold: 0.35});
io.observe(voucher);

/* ---------- Stamp easter egg ---------- */
$("#stamp").addEventListener("click", () => {
  const el = $("#stampText");
  if(el.dataset.state !== "classified"){
    el.dataset.state = "classified";
    el.textContent = "CLASSIFIED — Geburtstag!";
  } else {
    el.dataset.state = "open";
    el.textContent = "CASE FILE: PAPA";
  }
  confettiBurst(70);
});

/* ---------- Smooth scroll top ---------- */
$("#scrollTop").addEventListener("click", () => window.scrollTo({top:0, behavior:"smooth"}));

/* ---------- Tilt cards (pro feel) ---------- */
function enableTilt(card){
  card.classList.add("tilt");
  const max = 8;
  card.addEventListener("mousemove", (e) => {
    const r = card.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    const rx = (py - 0.5) * -max;
    const ry = (px - 0.5) * max;
    card.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
  });
  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
}
$$(".card").forEach(enableTilt);

/* ---------- Tap sparkle + localized confetti (wow on mobile) ---------- */
function sparkleAt(x, y){
  const s = document.createElement("div");
  s.className = "spark";
  s.style.left = x + "px";
  s.style.top = y + "px";
  document.body.appendChild(s);
  setTimeout(() => s.remove(), 800);
}
window.addEventListener("pointerdown", (e) => {
  // ignore clicks on inputs/links/buttons to keep UX clean
  const tag = (e.target?.tagName || "").toLowerCase();
  if(["button","a","input","label"].includes(tag)) return;
  sparkleAt(e.clientX, e.clientY);
  const vw = (e.clientX / window.innerWidth) * 100;
  confettiBurst(60, vw);
}, {passive:true});

/* ---------- Stars canvas (cheap but classy) ---------- */
const canvas = $("#stars");
const ctx = canvas.getContext("2d");
let W=0,H=0,stars=[];
function resize(){
  W = canvas.width = Math.floor(window.innerWidth * devicePixelRatio);
  H = canvas.height = Math.floor(window.innerHeight * devicePixelRatio);
  stars = Array.from({length: 70}, () => ({
    x: Math.random()*W,
    y: Math.random()*H,
    r: (0.6 + Math.random()*1.6) * devicePixelRatio,
    a: 0.25 + Math.random()*0.55,
    s: 0.003 + Math.random()*0.010
  }));
}
window.addEventListener("resize", resize);
resize();

let t = 0;
function tick(){
  t += 1;
  ctx.clearRect(0,0,W,H);
  ctx.globalCompositeOperation = "lighter";
  for(const st of stars){
    st.a += Math.sin(t*st.s)*0.002;
    const a = Math.max(0.06, Math.min(0.9, st.a));
    ctx.beginPath();
    ctx.arc(st.x, st.y, st.r, 0, Math.PI*2);
    ctx.fillStyle = `rgba(255,255,255,${a})`;
    ctx.fill();
  }
  ctx.globalCompositeOperation = "source-over";
  requestAnimationFrame(tick);
}
tick();

/* ---------- Init ---------- */
nextJoke();
confettiBurst(170);
