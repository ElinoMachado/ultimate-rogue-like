// src/ui/hud.js

export function renderHUD(player, buffs, progression, levelSystem) {
  let hud = document.getElementById("hud-panel");
  if (!hud) {
    hud = document.createElement("div");
    hud.id = "hud-panel";
    document.body.appendChild(hud);
  }

  const nextLevelXP = levelSystem.xpTable[player.level] ?? "—";
  const xpProgress =
    nextLevelXP === "—"
      ? 100
      : Math.min(100, (player.xp / nextLevelXP) * 100).toFixed(1);

  const finalSpeed =
    typeof player.getFinalSpeed === "function"
      ? player.getFinalSpeed()
      : player.speed;

  const arcanaPower = player.arcanaMultiplier
    ? (player.arcanaMultiplier * 100 - 100).toFixed(0)
    : "0";

  hud.innerHTML = `
    <div class="hud-top">
      <span><strong>${player.name}</strong> — Nível ${player.level ?? 1}</span>
      <span>💰 ${player.gold ?? 0}</span>
    </div>

    <div class="hud-bar xp">
      <label>XP</label>
      <div class="fill" style="width:${xpProgress}%"></div>
    </div>

    <div class="hud-stats">
      <span>⚡ ${finalSpeed} velocidade</span>
      <span>💥 ${player.critChance}% chance de crítico</span>
      <span>💥 ${(player.critDamage * 100).toFixed(0)}% dano crítico</span>
      <span>🍀 ${player.luck} sorte</span>
      <span>🧠 ${arcanaPower}% Poder arcano</span>
    </div>

    <div class="hud-buffs">
      <span><strong>Poder:</strong> ${buffs.poder?.effect ?? "—"}</span>
      <span><strong>Arcana:</strong> ${buffs.arcana?.effect ?? "—"}</span>
      <span><strong>Riqueza:</strong> ${buffs.riqueza?.effect ?? "—"}</span>
    </div>
  `;
}

export function updateHUD(player, progression, levelSystem) {
  const hud = document.getElementById("hud-panel");
  if (!hud) return;

  const nextLevelXP = levelSystem.xpTable[player.level] ?? "—";
  const xpProgress =
    nextLevelXP === "—"
      ? 100
      : Math.min(100, (player.xp / nextLevelXP) * 100).toFixed(1);

  const xpFill = hud.querySelector(".hud-bar.xp .fill");
  if (xpFill) xpFill.style.width = `${xpProgress}%`;

  const goldSpan = hud.querySelector(".hud-top span:last-child");
  const nameSpan = hud.querySelector(".hud-top strong");

  if (goldSpan) goldSpan.textContent = `💰 ${player.gold ?? 0}`;
  if (nameSpan)
    nameSpan.textContent = `${player.name} — Nível ${player.level ?? 1}`;
}
