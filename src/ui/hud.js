// src/ui/hud.js
/* -------------------------------------------
   Renderização inicial do HUD
------------------------------------------- */
export function renderHUD(player, buffs, progression, levelSystem) {
  let hud = document.getElementById("hud-panel");
  if (!hud) {
    hud = document.createElement("div");
    hud.id = "hud-panel";
    document.body.appendChild(hud);
  }

  const nextLevelXP = levelSystem?.xpTable?.[player.level] ?? null;
  const xpProgress = nextLevelXP
    ? Math.min(100, ((player.xp ?? 0) / nextLevelXP) * 100).toFixed(1)
    : 100;

  hud.innerHTML = `
    <div class="hud-top">
      <span><strong id="hud-name">${
        player.name
      }</strong> — Nível <span id="hud-level">${player.level ?? 1}</span></span>
      <span id="hud-gold">💰 ${player.gold ?? 0}</span>
    </div>

    <div class="hud-bar xp">
      <label>XP</label>
      <div class="fill" style="width:${xpProgress}%"></div>
    </div>

    <div class="hud-stats">
      <span id="hud-hpmax">❤️ ${
        (player.getFinalMaxHp?.() ?? player.maxHp) || 0
      } HP máx</span>
      <span id="hud-mpmax">🔷 ${player.maxMp ?? 0} MP máx</span>

      <span id="hud-speed">⚡ ${
        (player.getFinalSpeed?.() ?? player.speed) || 0
      } velocidade</span>
      <span id="hud-damage">🗡️ ${
        (player.getFinalDamage?.() ?? player.damage) || 0
      } dano</span>

      <span id="hud-crit">🎯 ${player.critChance ?? 0}% crit</span>
      <span id="hud-critdmg">💥 ${Math.round(
        (player.critDamage ?? 1) * 100
      )}% dano crítico</span>

      <span id="hud-luck">🍀 ${player.luck ?? 0} sorte</span>
      <span id="hud-lives">❤️ ${player.lives ?? 0} vidas</span>
    </div>

    <div class="hud-buffs">
      <span><strong>Poder:</strong> ${buffs?.poder?.effect ?? "—"}</span>
      <span><strong>Arcana:</strong> ${buffs?.arcana?.effect ?? "—"}</span>
      <span><strong>Riqueza:</strong> ${buffs?.riqueza?.effect ?? "—"}</span>
    </div>
  `;
}

/* -------------------------------------------
   Atualização em tempo real
------------------------------------------- */
export function updateHUD(player, progression, levelSystem) {
  const hud = document.getElementById("hud-panel");
  if (!hud) return;

  // topo
  const nameEl = hud.querySelector("#hud-name");
  const levelEl = hud.querySelector("#hud-level");
  const goldEl = hud.querySelector("#hud-gold");

  if (nameEl) nameEl.textContent = player.name ?? "—";
  if (levelEl) levelEl.textContent = player.level ?? 1;
  if (goldEl) goldEl.textContent = `💰 ${player.gold ?? 0}`;

  // xp
  const nextLevelXP = levelSystem?.xpTable?.[player.level] ?? null;
  const xpFill = hud.querySelector(".hud-bar.xp .fill");
  if (xpFill) {
    const pct = nextLevelXP
      ? Math.min(100, ((player.xp ?? 0) / nextLevelXP) * 100)
      : 100;
    xpFill.style.width = `${pct}%`;
  }

  // atributos (os “upáveis”)
  const hpmax = hud.querySelector("#hud-hpmax");
  const mpmax = hud.querySelector("#hud-mpmax");
  const speed = hud.querySelector("#hud-speed");
  const damage = hud.querySelector("#hud-damage");
  const crit = hud.querySelector("#hud-crit");
  const critdmg = hud.querySelector("#hud-critdmg");
  const luck = hud.querySelector("#hud-luck");
  const lives = hud.querySelector("#hud-lives");

  if (hpmax)
    hpmax.textContent = `❤️ ${
      (player.getFinalMaxHp?.() ?? player.maxHp) || 0
    } HP máx`;
  if (mpmax) mpmax.textContent = `🔷 ${player.maxMp ?? 0} MP máx`;
  if (speed)
    speed.textContent = `⚡ ${
      (player.getFinalSpeed?.() ?? player.speed) || 0
    } velocidade`;
  if (damage)
    damage.textContent = `🗡️ ${
      (player.getFinalDamage?.() ?? player.damage) || 0
    } dano`;
  if (crit) crit.textContent = `🎯 ${player.critChance ?? 0}% crit`;
  if (critdmg)
    critdmg.textContent = `💥 ${Math.round(
      (player.critDamage ?? 1) * 100
    )}% dano crítico`;
  if (luck) luck.textContent = `🍀 ${player.luck ?? 0} sorte`;
  if (lives) lives.textContent = `❤️ ${player.lives ?? 0} vidas`;
}
