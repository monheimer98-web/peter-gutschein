/* ---------- Utils ---------- */
const $ = (q, el=document) => el.querySelector(q);
const $$ = (q, el=document) => [...el.querySelectorAll(q)];
const rand = (a,b) => a + Math.random()*(b-a);

/* ---------- Typewriter + Joke rotation ---------- */
const jokes = [
  "Heute ist Papas Tag: Chef-Modus aktiviert. 🎩",
  "Dein Alter? Streng geheim – Akte ist klassifiziert. 🗂️",
  "Level-Up! Papa +1. Bonus: Extra Gelassenheit & Humor. 🕹️",
  "Möge dein Kuchen groß sein und deine To-do-Liste klein. 🍰",
  "Du bist nicht älter geworden – nur wertvoller. Premiumgereift. ✨",
  "Heute gilt: Lachen ist Pflicht, Abwasch ist optional. 😄",
  "Wenn jemand fragt, wie alt du bist: Sag einfach ‚legendär‘. 🏆",
  "Wünsche dir ein Jahr voller guter Nachrichten – und noch bessere Snacks. 🥨",
  "Das Leben ist zu kurz für langweilige Geburtstage. Heute wird gefeiert! 🎉",
  "Plot Twist: Der beste Teil des Tages bist du. ❤️"
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
function confettiBurst(amount=140){
  const center = rand(20, 80);
  for(let i=0;i<amount;i++){
    makePiece(center + rand(-18, 18));
  }
}

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

/* ---------- Runner (little 3D-ish Papa) ---------- */
const runner = $("#runner");
function startRunner(){
  runner.classList.remove("running","tooting");
  // restart animation
  void runner.offsetWidth;
  runner.classList.add("running");

  // horn moment (while stopped)
  setTimeout(() => {
    runner.classList.add("tooting");
    confettiBurst(190);
  }, 3900);

  setTimeout(() => runner.classList.remove("tooting"), 5200);
}
setTimeout(startRunner, 700); // start shortly after load
$("#boom").addEventListener("click", () => confettiBurst(220));
$("#runnerBtn").addEventListener("click", startRunner);

/* ---------- Voucher reveal burst ---------- */
const voucher = $("#gutschein");
let voucherBurstDone = false;
const io = new IntersectionObserver((entries) => {
  for(const e of entries){
    if(e.isIntersecting && !voucherBurstDone){
      voucherBurstDone = true;
      confettiBurst(240);
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
  confettiBurst(60);
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

/* ---------- Init ---------- */
nextJoke();
confettiBurst(160);
