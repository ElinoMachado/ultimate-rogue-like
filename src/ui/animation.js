// src/ui/animation.js
import { playSound } from "./sound.js";

export function revealBuffCard(type, buff, onConfirm) {
  const container = document.getElementById("app");
  if (!container) return;

  const colors = {
    riqueza: "#ffcc00",
    arcana: "#9c27b0",
    poder: "#ff5252",
  };

  const sounds = {
    riqueza: "rarity-common.mp3",
    arcana: "rarity-legendary.mp3",
    poder: "rarity-mythic.mp3",
  };

  const color = colors[type] ?? "#cccccc";
  const sound = sounds[type] ?? "rarity-common.mp3";

  container.innerHTML = `
    <header class="game-header">
      <h1>RPG Arena</h1>
    </header>
    <main class="screen-center">
      <h2 class="screen-title">${(type || "").toUpperCase()}</h2>
      <div class="card" style="border: 3px solid ${color}">
        <div class="card-inner">
          <div class="card-front">
            <p>Sorteando ${type}...</p>
          </div>
          <div class="card-back" style="background: ${color}22">
            <h2 style="color:${color}">${buff.label}</h2>
            <p style="margin-top:8px; font-size:0.95rem;">${buff.effect}</p>
          </div>
        </div>
      </div>
      <button id="btn-proceed" class="btn-primary" disabled>Prosseguir</button>
    </main>
  `;

  const cardInner = container.querySelector(".card-inner");
  const btn = container.querySelector("#btn-proceed");

  let enabled = false; // controla quando o botão pode ser clicado
  let finished = false; // evita múltiplos onConfirm

  // inicia o flip em quadro posterior para garantir layout aplicado
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      playSound("flip.mp3", 0.9, "ui");
      cardInner.classList.add("flipped");
    });
  });

  // habilita o botão ao final da transição de transform (flip)
  const onTransitionEnd = (e) => {
    if (e.propertyName && e.propertyName !== "transform") return;
    enableProceed();
    cardInner.removeEventListener("transitionend", onTransitionEnd);
  };
  cardInner.addEventListener("transitionend", onTransitionEnd);

  // fallback: caso transitionend não dispare (navegadores específicos)
  const fallbackTimer = setTimeout(() => enableProceed(), 1200);

  function enableProceed() {
    if (enabled) return;
    enabled = true;
    clearTimeout(fallbackTimer);
    btn.disabled = false;
    playSound(sound, 0.9, "ui");
  }

  btn.addEventListener("click", () => {
    if (finished || btn.disabled) return;
    finished = true;
    btn.disabled = true;
    if (typeof onConfirm === "function") onConfirm();
  });
}
