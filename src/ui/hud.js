// src/ui/hud.js

/* -------------------------------------------
   CSS mínimo de segurança (não conflita com o seu)
------------------------------------------- */
if (!document.getElementById("hud-style")) {
  const s = document.createElement("style");
  s.id = "hud-style";
  s.textContent = `
    #hud-panel{
      position:fixed; top:10px; right:12px; z-index:1000;
      min-width: 320px; max-width: 420px;
      background: rgba(12,14,20,.75);
      border: 1px solid rgba(255,255,255,.08);
      border-radius: 12px; padding: 10px 12px;
      box-shadow: 0 6px 20px rgba(0,0,0,.25);
      backdrop-filter: blur(4px);
      color:#e5e7eb; font: 500 14px/1.4 system-ui,Segoe UI,Roboto,Helvetica,Arial;
    }
    #hud-panel .hud-top{
      display:flex; justify-content:space-between; align-items:center;
      gap: 12px; margin-bottom: 8px;
    }
    #hud-panel .hud-bar.xp{
      position: relative; height: 10px; border-radius:999px;
      background: rgba(255,255,255,.08); overflow: hidden; margin-bottom: 10px;
    }
    #hud-panel .hud-bar.xp .fill{
      height: 100%; width: 0%;
      background: linear-gradient(90deg,#34d399,#10b981);
      transition: width .35s ease-out;
    }
    #hud-panel .hud-bar.xp label{
      position:absolute; left:8px; top:-18px; font-size:.8rem; opacity:.85;
    }
    #hud-panel .hud-stats{
      display:grid; grid-template-columns: 1fr 1fr;
      gap: 6px 14px; margin-bottom: 10px; font-size: .92rem;
    }
    #hud-panel .hud-stats span{ opacity:.95; }
    #hud-panel .hud-buffs{
      display:flex; flex-direction:column; gap:4px;
      font-size: .9rem; opacity:.9;
      border-top:1px dashed rgba(255,255,255,.08);
      padding-top:8px;
    }
  `;
  document.head.appendChild(s);
}

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
