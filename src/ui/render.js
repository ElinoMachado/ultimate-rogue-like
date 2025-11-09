// src/ui/render.js
import { progression } from "../core/progression.js";

/* ================================
   🎨 Estilo injetado (não altera arena/entidades)
   ================================ */
if (!document.getElementById("battle-ui-polish")) {
  const style = document.createElement("style");
  style.id = "battle-ui-polish";
  style.textContent = `
    /* ====== Battle Meta (Fase + Recompensa) ====== */
    .battle-meta{
      display:flex; justify-content:space-between; align-items:center;
      gap:12px; padding:10px 14px; margin:8px 12px 0;
      background: linear-gradient(90deg, rgba(255,255,255,.05), rgba(255,255,255,.02));
      border:1px solid rgba(255,255,255,.08);
      border-radius:12px; backdrop-filter: blur(2px);
    }
    .battle-meta .meta-left, .battle-meta .meta-right{
      display:flex; gap:8px; flex-wrap:wrap; align-items:center;
    }
    .chip{
      display:inline-flex; align-items:center; gap:8px;
      padding:6px 10px; border-radius:999px;
      border:1px solid rgba(255,255,255,.12);
      background:rgba(0,0,0,.25); font-size:.9rem; letter-spacing:.2px;
      box-shadow: 0 2px 10px rgba(0,0,0,.15);
    }
    .chip strong{ font-weight:700; }
    .chip-stage{
      background:linear-gradient(90deg,#0f172a,#111827);
      border-color:#334155; color:#e5e7eb;
    }
    .chip-xp{
      background:linear-gradient(90deg,#0b3a9e33,#0b3a9e11);
      border-color:#3fa9f544;
    }
    .chip-gold{
      background:linear-gradient(90deg,#8a6d0033,#8a6d0011);
      border-color:#ffcc0044;
    }

    /* Bônus (+ / -) destacado ao lado do valor fixo */
    .bonus{
      display:inline-flex; align-items:center; gap:6px;
      padding:2px 8px; border-radius:999px; font-weight:700;
      border:1px solid transparent;
    }
    .bonus.positive{
      color:#22c55e; background:rgba(34,197,94,.12); border-color:rgba(34,197,94,.35);
    }
    .bonus.negative{
      color:#ef4444; background:rgba(239,68,68,.12); border-color:rgba(239,68,68,.35);
    }

    /* ====== Badges do inimigo (não altera .entity base) ====== */
    .enemy-quick{
      display:flex; gap:6px; flex-wrap:wrap; margin:6px 0 4px;
    }
    .badge-pill{
      display:inline-flex; align-items:center; gap:6px;
      padding:4px 10px; border-radius:999px; font-size:.78rem;
      border:1px solid rgba(255,255,255,.13); background:rgba(255,255,255,.06);
    }
    .entity.enemy .badge-pill{
      border-color: rgba(255,0,0,.25);
      background: rgba(255,0,0,.08);
    }
    .entity.player .badge-pill{
      border-color: rgba(0,150,255,.25);
      background: rgba(0,150,255,.08);
    }

    /* barras – só animação suave na fill existente */
    .bar-fill { transition: width .4s ease-out; }
  `;
  document.head.appendChild(style);
}

/**
 * ================================
 * 🧱 Renderização principal da batalha
 * ================================
 */
export function renderBattleUI(player, enemy) {
  const app = document.getElementById("app");
  const skill = player.skills?.[0] || {
    name: "—",
    damage: 0,
    manaCost: 0,
    cooldown: 0,
  };
  const passive =
    player.passive || (player.passives && player.passives[0]) || null;
  // 🔁 Fonte única da verdade (usa progression)
  const fixed = progression.calcRewardsPreview(player);

  app.innerHTML = `
    <header class="game-header"><h1>RPG Arena</h1></header>

    <section class="battle-meta">
      <div class="meta-left">
        <span class="chip chip-stage">🎯 Fase <strong>${
          fixed.stage
        }</strong></span>
      </div>
      <div class="meta-right">
        <span class="chip chip-xp">
          ⭐ XP <strong>${fixed.xpTotal}</strong>
          <span class="bonus ${fixed.xpBonus >= 0 ? "positive" : "negative"}">
            (${fixed.xpBonus >= 0 ? "+" : ""}${fixed.xpBonus})
          </span>
        </span>
        <span class="chip chip-gold">
          💰 Gold <strong>${fixed.goldTotal}</strong>
          <span class="bonus ${fixed.goldBonus >= 0 ? "positive" : "negative"}">
            (${fixed.goldBonus >= 0 ? "+" : ""}${fixed.goldBonus})
          </span>
        </span>
      </div>
    </section>

    <main class="battle-area">
      ${renderEntity("player", player)}
      ${renderEntity("enemy", enemy)}
    </main>

   <footer class="battle-footer">
  ${renderSkillCard(skill)}
  ${passive ? renderPassiveCard(passive) : ""}
  ${renderActionButtons(player, skill)}
</footer>

  `;
}

/**
 * Atualiza dinamicamente as barras de vida/mana/velocidade.
 */
export function updateBars(player, enemy) {
  updateEntityBars(".player", player);
  updateEntityBars(".enemy", enemy);
}

/**
 * Mostra texto flutuante (dano, status etc.)
 */
export function showFloatingText(text, type = "damage") {
  const div = document.createElement("div");
  div.className = `floating-${type}`;
  div.textContent = text;
  document.body.appendChild(div);

  div.animate(
    [
      { transform: "translateY(0)", opacity: 1 },
      { transform: "translateY(-40px)", opacity: 0 },
    ],
    { duration: 1200, easing: "ease-out" }
  );

  setTimeout(() => div.remove(), 1200);
}

/* ================================
 * 🧩 Auxiliares de HTML
 * ================================ */
function renderEntity(type, entity) {
  const isEnemy = type === "enemy";
  const enemyBadges = isEnemy
    ? `<div class="enemy-quick">
         <span class="badge-pill">🔰 NV ${safeInt(entity.level)}</span>
         <span class="badge-pill">⚔️ ATK ${safeInt(entity.damage)}</span>
         <span class="badge-pill">⚡ VEL ${safeInt(entity.speed)}</span>
       </div>`
    : "";

  return `
    <div class="entity ${type}">
      <h2>${entity.name}</h2>

      ${enemyBadges}

      ${makeBar("life", "Vida", entity.hp, entity.maxHp)}
      ${makeBar("mana", "Mana", entity.mp, entity.maxMp)}
      ${makeBar("speed", "Velocidade", entity.speedGauge, 100)}

      <div class="status-icons">
        ${(entity.status || [])
          .map(
            (s) =>
              `<span class="status-icon ${s.name}" title="${
                s.name
              }">${getStatusEmoji(s.name)}</span>`
          )
          .join("")}
      </div>
    </div>
  `;
}
function renderPassiveCard(passive) {
  const rarityText = (passive.rarity || "common").toString().toUpperCase();
  const levelText = passive.level != null ? passive.level : 1;
  return `
    <div class="skill-info-card" style="right:16px; left:auto;">
      <h3>${passive.name}</h3>
      <p><strong>Raridade:</strong> ${rarityText}</p>
      <p><strong>Nível:</strong> ${levelText}</p>
      <p><strong>Tipo:</strong> Passiva</p>
      <p><strong>Efeito:</strong> ${passive.description || "—"}</p>
    </div>
  `;
}

function renderSkillCard(skill) {
  const rarityText = (skill.rarity || "common").toString().toUpperCase();
  const levelText = skill.level != null ? skill.level : 1;
  return `
    <div class="skill-info-card" style="left:16px; right:auto;">
      <h3>${skill.name}</h3>
      <p><strong>Raridade:</strong> ${rarityText}</p>
      <p><strong>Nível:</strong> ${levelText}</p>
      <p><strong>Dano:</strong> ${skill.damage}</p>
      <p><strong>Mana:</strong> ${skill.manaCost}</p>
      <p><strong>Cooldown:</strong> ${skill.cooldown} turnos</p>
      <p><strong>Restante:</strong> <span id="skill-cd">${
        skill.cooldownCounter ?? 0
      }</span></p>
      <p><strong>Efeito:</strong> ${skill.effect || "—"}</p>
    </div>
  `;
}

function renderActionButtons(player, skill) {
  return `
    <div class="actions">
      <button class="action-btn" data-action="basic">
        ⚔️ Ataque Básico (${player.damage})
      </button>
      <button class="action-btn" data-action="skill">
        🔥 ${skill.name} (${skill.damage})
      </button>
    </div>
  `;
}

function updateEntityBars(selector, entity) {
  const container = document.querySelector(selector);
  if (!container) return;

  ["life", "mana", "speed"].forEach((type) => {
    const bar = container.querySelector(`.bar.${type} .bar-fill`);
    const text = container.querySelector(`.bar.${type} .bar-text`);

    let value, max;
    if (type === "life") [value, max] = [entity.hp, entity.maxHp];
    if (type === "mana") [value, max] = [entity.mp, entity.maxMp];
    if (type === "speed") [value, max] = [entity.speedGauge, 100];

    const pct = Math.max(0, Math.min(100, (value / max) * 100));

    if (bar) {
      bar.style.width = `${pct}%`;
      bar.dataset.value = value;
      bar.dataset.max = max;
    }
    if (text) text.textContent = `${Math.floor(value)} / ${Math.floor(max)}`;
  });

  // Atualiza status icons dinamicamente
  const statusContainer = container.querySelector(".status-icons");
  if (statusContainer) {
    statusContainer.innerHTML = (entity.status || [])
      .map(
        (s) =>
          `<span class="status-icon ${s.name}" title="${
            s.name
          }">${getStatusEmoji(s.name)}</span>`
      )
      .join("");
  }
}

/**
 * Cria uma barra genérica com cor e rótulo.
 */
function makeBar(type, label, value, max) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const colors = {
    life: "linear-gradient(90deg, #5aff5a, #00ff6e)",
    mana: "linear-gradient(90deg, #3fa9f5, #007fff)",
    speed: "linear-gradient(90deg, #f5e13f, #ffc107)",
  };
  return `
    <div class="bar ${type}">
      <span class="label">${label}</span>
      <div class="bar-fill-wrapper">
        <div class="bar-fill" style="width:${pct}%; background:${colors[type]}"
             data-value="${value}" data-max="${max}"></div>
      </div>
      <span class="bar-text">${Math.floor(value)} / ${Math.floor(max)}</span>
    </div>
  `;
}

/**
 * Ícones de status por tipo.
 */
function getStatusEmoji(name) {
  const map = { stun: "💫", bleed: "🩸", poison: "☠️", shield: "🛡️" };
  return map[name] || "⚙️";
}

/* ================================
 * 🔢 Helpers
 * ================================ */
function safeInt(v, d = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? Math.floor(n) : d;
}
