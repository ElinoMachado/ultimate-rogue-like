// src/main.js
import { classes } from "./data/classes.js";
import { Entity } from "./core/entity.js";
import { buffs } from "./data/buffs.js";
import { revealBuffCard } from "./ui/animation.js";
import { skills } from "./data/skills.js";
import { revealSkillCard, revealPassiveCard } from "./ui/skillReveal.js";
import { startBattleScene } from "./core/battle.js";
import { progression } from "./core/progression.js";
import { levelSystem } from "./core/level.js";
import { renderHUD, updateHUD } from "./ui/hud.js";
import { passives } from "./data/passives.js";

// ================================
// 🌍 ESTADO GLOBAL DA RUN
// ================================
let selectedBuffs = {};
let selectedClass = null;
let playerEntity = null;
let selectedSkill = null;

document.addEventListener("DOMContentLoaded", () => {
  showClassSelectionScreen();
});

/* ================================
 * 🧪 Buffs no Player (reaplicáveis sem acumular)
 * ================================ */
function applyBuffsToPlayer(player, buffsSelected) {
  // Sempre recalcula a partir do snapshot base
  const base = player.base || {
    maxHp: player.maxHp,
    maxMp: player.maxMp,
    speed: player.speed,
    damage: player.damage,
  };

  // --- Poder ---
  const powerLevels = {
    1: { dmg: -0.5, hp: -0.35, speed: -0.25 },
    2: { dmg: -0.25, hp: -0.15, speed: -0.1 },
    3: { dmg: 0, hp: 0, speed: 0 },
    4: { dmg: 1.5, hp: 1.0, speed: 0.5 },
    5: { dmg: 3.0, hp: 2.0, speed: 1.0 },
  };

  const poderBuff = powerLevels[buffsSelected.poder?.level ?? 3];
  player.buffs.poder = poderBuff;

  player.damage = Math.round(base.damage * (1 + poderBuff.dmg));
  const newMaxHp = Math.round(base.maxHp * (1 + poderBuff.hp));
  const wasIncrease = newMaxHp > (player.maxHp ?? 0);
  player.maxHp = newMaxHp;
  player.hp = wasIncrease
    ? newMaxHp
    : Math.min(player.hp ?? newMaxHp, newMaxHp);
  player.speed = Math.round(base.speed * (1 + poderBuff.speed));

  // --- Arcana ---
  const arcanaLevels = { 1: -0.4, 2: -0.2, 3: 0.0, 4: 1.0, 5: 2.0 };
  const arcanaBoost = arcanaLevels[buffsSelected.arcana?.level ?? 3];
  player.buffs.arcana = arcanaBoost;
  player.arcanaMultiplier = 1 + arcanaBoost;

  // --- Riqueza ---
  player.wealthBonus = buffsSelected.riqueza?.bonus ?? 0;
  player.buffs.riqueza = buffsSelected.riqueza || { bonus: 0 };
}

/* ================================
 * 🔒 Congelar os valores atuais como novo "base"
 * (chamar ao FINAL do level up)
 * ================================ */
function commitCurrentAsBase(player) {
  player.base = {
    maxHp: player.maxHp,
    maxMp: player.maxMp,
    speed: player.speed,
    damage: player.damage,
  };
}

/* ================================
 * 👤 TELA: ESCOLHA DE CLASSE
 * ================================ */
function showClassSelectionScreen() {
  const app = document.getElementById("app");

  app.innerHTML = `
    <header class="game-header">
      <h1>RPG Arena</h1>
    </header>
    <main class="screen-center">
      <h2 class="screen-title">Escolha sua Classe</h2>
      <section class="class-grid">
        ${classes
          .map(
            (c) => `
          <article class="class-card ${c.id}" data-id="${c.id}">
            <div class="class-header">
              <span class="class-name">${c.name}</span>
              <span class="class-tag">${c.role}</span>
            </div>
            <p class="class-description">${c.description}</p>
            <div class="class-stats">
              <span class="class-stat-label">Vida</span>
              <span class="class-stat-value">${c.baseStats.maxHp}</span>
              <span class="class-stat-label">Mana</span>
              <span class="class-stat-value">${c.baseStats.maxMp}</span>
              <span class="class-stat-label">Velocidade</span>
              <span class="class-stat-value">${c.baseStats.speed}</span>
              <span class="class-stat-label">Dano</span>
              <span class="class-stat-value">${c.baseStats.damage}</span>
              <span class="class-stat-label">Sorte</span>
              <span class="class-stat-value">${c.baseStats.luck}</span>
              <span class="class-stat-label">Crítico</span>
              <span class="class-stat-value">${c.baseStats.critChance}%</span>
            </div>
          </article>
        `
          )
          .join("")}
      </section>
    </main>
  `;

  document.querySelectorAll(".class-card").forEach((card) => {
    card.addEventListener("click", () => {
      const id = card.dataset.id;
      selectedClass = classes.find((c) => c.id === id);
      playerEntity = new Entity(selectedClass);
      showClassSummaryScreen();
    });
  });
}

/* ================================
 * 📜 TELA: RESUMO DA CLASSE ESCOLHIDA
 * ================================ */
function showClassSummaryScreen() {
  const app = document.getElementById("app");
  const c = selectedClass;

  app.innerHTML = `
    <header class="game-header">
      <h1>RPG Arena</h1>
    </header>
    <main class="screen-center">
      <div class="summary-box">
        <h2>Classe Selecionada: ${c.name}</h2>
        <p class="summary-line"><strong>Papel:</strong> ${c.role}</p>
        <p class="summary-line"><strong>Descrição:</strong> ${c.description}</p>
        <p class="summary-line"><strong>Vida:</strong> ${c.baseStats.maxHp}</p>
        <p class="summary-line"><strong>Mana:</strong> ${c.baseStats.maxMp}</p>
        <p class="summary-line"><strong>Velocidade:</strong> ${
          c.baseStats.speed
        }</p>
        <p class="summary-line"><strong>Dano:</strong> ${c.baseStats.damage}</p>
        <p class="summary-line"><strong>Sorte:</strong> ${c.baseStats.luck}</p>
        <p class="summary-line"><strong>Crítico:</strong> ${
          c.baseStats.critChance
        }% | x${c.baseStats.critDamage.toFixed(1)}</p>
      </div>

      <button class="btn-primary" id="btn-continue">
        Continuar (Buffs)
      </button>
    </main>
  `;

  document
    .getElementById("btn-continue")
    .addEventListener("click", () => startBuffPhase());
}

/* ================================
 * 🎴 FASE: SORTEIO DOS BUFFS
 * ================================ */
function startBuffPhase() {
  const sequence = ["riqueza", "arcana", "poder"];
  const results = {};

  function nextBuffStep() {
    if (sequence.length === 0) {
      selectedBuffs = results;
      setTimeout(() => showBuffSummary(results), 400);
      return;
    }

    const type = sequence.shift();
    const list = buffs[type];
    const randomBuff = list[Math.floor(Math.random() * list.length)];
    results[type] = randomBuff;

    revealBuffCard(type, randomBuff, nextBuffStep);
  }

  nextBuffStep();
}

/* ================================
 * 📊 TELA: RESUMO DOS BUFFS
 * ================================ */
function showBuffSummary(results) {
  const app = document.getElementById("app");

  applyBuffsToPlayer(playerEntity, selectedBuffs);

  app.innerHTML = `
    <header class="game-header">
      <h1>RPG Arena</h1>
    </header>
    <main class="screen-center">
      <div class="summary-box">
        <h2>Buffs Recebidos</h2>
        <p class="summary-line"><strong>Riqueza:</strong> ${results.riqueza.label} - ${results.riqueza.effect}</p>
        <p class="summary-line"><strong>Arcana:</strong> ${results.arcana.label} - ${results.arcana.effect}</p>
        <p class="summary-line"><strong>Poder:</strong> ${results.poder.label} - ${results.poder.effect}</p>
      </div>
      <button class="btn-primary" id="btn-continue">Continuar (Habilidade)</button>
    </main>
  `;

  document.getElementById("btn-continue").addEventListener("click", () => {
    renderHUD(playerEntity, selectedBuffs, progression, levelSystem);
    showSkillReveal();
  });
}

/* ================================
 * ✨ SORTEIO E REVELAÇÃO DA SKILL INICIAL + PASSIVA
 * ================================ */
function showSkillReveal() {
  const cls = selectedClass.id;
  const arcanaBuff = selectedBuffs.arcana;
  const skillTemplate = skills[cls][0];

  const rarity = getRarityFromArcana(arcanaBuff.level, playerEntity.luck);
  const baseData = skillTemplate.rarities[rarity];
  const arcanaBoost = selectedBuffs.arcana.bonus + 1;

  const skill = {
    id: skillTemplate.id,
    name: skillTemplate.baseName,
    type: skillTemplate.type,
    rarity, // ✅ agora salvo na skill
    level: 1, // ✅ nível inicial
    damage: Math.round(baseData.damage * arcanaBoost),
    manaCost: baseData.manaCost,
    cooldown: baseData.cooldown,
    effect: baseData.effect,
    effects: baseData.effects || [],
    cooldownCounter: 0,
  };

  selectedSkill = skill;
  playerEntity.skills = [selectedSkill];

  revealSkillCard(skill, rarity, () => showPassiveReveal());
}

function showPassiveReveal() {
  const base = passives[Math.floor(Math.random() * passives.length)];
  const rarity = getRarityFromArcana(
    selectedBuffs.arcana.level,
    playerEntity.luck
  );

  const selectedPassive = {
    ...base,
    level: 1, // ✅ nível inicial
    rarity, // ✅ raridade para exibição
  };

  // guarda no jogador para a UI da batalha poder mostrar
  playerEntity.passive = selectedPassive;

  revealPassiveCard(selectedPassive, () => {
    applyPassiveToPlayer(playerEntity, selectedPassive);
    startBattle();
  });
}

function applyPassiveToPlayer(player, passive) {
  try {
    passive?.apply?.(player);
  } catch (e) {
    console.warn("Erro ao aplicar passiva:", e);
  }
  // hud se já estiver visível
  updateHUD(player, progression, levelSystem);
}

/* Probabilidade de raridade baseada em Arcana + Sorte */
function getRarityFromArcana(level, luck = 0) {
  const table = {
    1: { common: 0.5, rare: 0.4, super: 0.05, legendary: 0.04, mythic: 0.01 },
    2: { common: 0.45, rare: 0.35, super: 0.1, legendary: 0.08, mythic: 0.02 },
    3: { common: 0.3, rare: 0.4, super: 0.15, legendary: 0.1, mythic: 0.05 },
    4: { common: 0.1, rare: 0.2, super: 0.45, legendary: 0.15, mythic: 0.1 },
    5: { common: 0.05, rare: 0.1, super: 0.25, legendary: 0.4, mythic: 0.2 },
  };

  const prob = table[level] ?? table[3];

  let roll = Math.random();
  const luckBoost = Math.min(0.3, (luck / 10) * 0.03);
  roll = Math.min(1, roll + luckBoost);

  let sum = 0;
  for (const [rarity, chance] of Object.entries(prob)) {
    sum += chance;
    if (roll <= sum) return rarity;
  }
  return "mythic";
}

/* ================================
 * ⚔️ INÍCIO DA BATALHA
 * ================================ */
function startBattle() {
  startBattleScene(playerEntity, selectedSkill, (result) =>
    showBattleEnd(result)
  );
}

/* ================================
 * 🏁 PÓS-BATALHA: VITÓRIA / DERROTA
 * ================================ */
function showBattleEnd(result) {
  const app = document.getElementById("app");
  const rewards = progression.calcRewards(playerEntity, selectedBuffs);

  playerEntity.xp += rewards.xp;
  playerEntity.gold += rewards.gold;
  if (rewards.drop) playerEntity.items.push(rewards.drop);

  if (result === "win") {
    progression.xp += rewards.xp;
    progression.gold += rewards.gold;

    if (levelSystem.checkLevelUp(playerEntity)) {
      showLevelUpScreen();
      return;
    }

    const dropText = rewards.drop
      ? `<p><strong>Drop:</strong> <span style="color:${rewards.drop.color}">${rewards.drop.item}</span> (+${rewards.drop.power} poder)</p>`
      : `<p><strong>Drop:</strong> Nenhum</p>`;

    app.innerHTML = `
      <header class="game-header"><h1>RPG Arena</h1></header>
      <main class="screen-center">
        <h2 class="screen-title">🏆 Vitória!</h2>
        <div class="summary-box">
          <p><strong>Fase:</strong> ${progression.currentStage}</p>
          <p><strong>XP ganho:</strong> +${rewards.xp}</p>
          <p><strong>Ouro ganho:</strong> +${rewards.gold}</p>
          ${dropText}
        </div>
        <button class="btn-primary" id="btn-next">Próxima Fase</button>
      </main>
    `;

    document.getElementById("btn-next").addEventListener("click", () => {
      progression.nextStage();
      startBattle();
    });
  } else {
    if ((playerEntity.lives ?? 0) > 0) {
      const vidas = playerEntity.lives;

      const mkBuffChip = (key, label) => {
        const lvl = selectedBuffs[key]?.level ?? 3;
        const can = lvl < 5;
        return `
          <button class="btn-primary buff-up-btn" data-buff="${key}" ${
          can ? "" : "disabled"
        }>
            ${label}: Nível ${lvl} ${can ? "→ " + (lvl + 1) : "(máx)"}
          </button>
        `;
      };

      app.innerHTML = `
        <header class="game-header"><h1>RPG Arena</h1></header>
        <main class="screen-center">
          <h2 class="screen-title">💀 Derrota...</h2>
          <p style="margin-top:10px;">Você alcançou a fase ${
            progression.currentStage
          }.</p>
          <p style="margin-top:14px;">Você tem <strong>${vidas}</strong> vida(s).</p>
          <p style="opacity:.85">Gaste <strong>1 vida</strong> para tentar novamente esta fase e aumentar <strong>+1 nível</strong> em um dos seus buffs:</p>

          <div style="display:flex; gap:8px; flex-wrap:wrap; margin:12px 0;">
            ${mkBuffChip("riqueza", "Riqueza")}
            ${mkBuffChip("arcana", "Arcana")}
            ${mkBuffChip("poder", "Poder")}
          </div>

          <div style="display:flex; gap:10px; margin-top:6px;">
            <button class="btn-primary" id="btn-skip-retry">Desistir</button>
          </div>
        </main>
      `;

      app.querySelectorAll(".buff-up-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          const key = btn.dataset.buff;
          tryUpgradeBuffAndRetry(key);
        });
      });

      document
        .getElementById("btn-skip-retry")
        .addEventListener("click", () => {
          app.innerHTML = `
          <header class="game-header"><h1>RPG Arena</h1></header>
          <main class="screen-center">
            <h2 class="screen-title">💀 Derrota...</h2>
            <p style="margin-top:10px;">Você alcançou a fase ${progression.currentStage}.</p>
            <button class="btn-primary" id="btn-restart">Recomeçar</button>
          </main>
        `;
          document
            .getElementById("btn-restart")
            .addEventListener("click", () => location.reload());
        });
    } else {
      app.innerHTML = `
        <header class="game-header"><h1>RPG Arena</h1></header>
        <main class="screen-center">
          <h2 class="screen-title">💀 Derrota...</h2>
          <p style="margin-top:10px;">Você alcançou a fase ${progression.currentStage}.</p>
          <button class="btn-primary" id="btn-restart">Recomeçar</button>
        </main>
      `;
      document
        .getElementById("btn-restart")
        .addEventListener("click", () => location.reload());
    }
  }
}

/* Retry com +1 nível em um buff e mesma fase */
function tryUpgradeBuffAndRetry(key) {
  const current = selectedBuffs[key];
  const list = buffs[key];
  const currentLevel = current?.level ?? 3;
  const next = list.find((b) => b.level === currentLevel + 1);

  if (next) selectedBuffs[key] = next;

  // reaplica buffs (sem perder upgrades de atributos)
  applyBuffsToPlayer(playerEntity, selectedBuffs);

  // restaura e consome vida
  playerEntity.hp = playerEntity.maxHp;
  playerEntity.mp = playerEntity.maxMp;
  playerEntity.lives = Math.max(0, (playerEntity.lives ?? 0) - 1);

  renderHUD(playerEntity, selectedBuffs, progression, levelSystem);

  retrySameStage();
}

function retrySameStage() {
  startBattle();
}

/* ================================
 * ⚙️ TELA DE LEVEL UP (atributos + skill)
 * ================================ */
function showLevelUpScreen() {
  const app = document.getElementById("app");

  let remaining = playerEntity.statPoints || 7;
  playerEntity.statPoints = remaining;

  let skillChoice = null; // "upgrade" | "new" | "refuse"

  // helpers de rótulo com o passo exato
  const stepTxt = (stat) => {
    const v = levelSystem.getStep(playerEntity, stat);
    if (stat === "critChance") return `Crítico (+${v.toFixed(1)}%)`;
    if (stat === "critDamage")
      return `Dano Crítico (+${(v * 100).toFixed(0)}%)`;
    if (stat === "vida") return `Vida (+${v} HP)`;
    if (stat === "mana") return `Mana (+${v} MP)`;
    if (stat === "velocidade") return `Velocidade (+${v})`;
    if (stat === "dano") return `Dano (+${v})`;
    if (stat === "sorte") return `Sorte (+${v})`;
    return stat;
  };

  app.innerHTML = `
    <header class="game-header"><h1>RPG Arena</h1></header>
    <main class="screen-center">
      <h2 class="screen-title">⚔️ Level Up!</h2>
      <p>Nível atual: ${playerEntity.level}</p>
      <p>Pontos de atributo disponíveis: <span id="points">${remaining}</span></p>

      <div class="stat-buttons"></div>

      <h3 style="margin-top:16px;">Escolha de Habilidade</h3>
      <p style="font-size:0.85rem; opacity:.8;">
        Você pode upar sua skill atual, escolher uma nova (2 da classe + 1 global)
        ou recusar e ganhar +3 pontos de atributo.
      </p>

      <div class="skill-choice-buttons">
        <button id="btn-upgrade-skill">Upar habilidade atual</button>
        <button id="btn-new-skill">Nova habilidade (3 cartas)</button>
        <button id="btn-refuse-skill">Recusar (+3 atributos)</button>
      </div>

      <button class="btn-primary" id="btn-continue" disabled>Continuar</button>
    </main>
  `;

  const stats = [
    { id: "vida", label: stepTxt("vida") },
    { id: "mana", label: stepTxt("mana") },
    { id: "velocidade", label: stepTxt("velocidade") },
    { id: "dano", label: stepTxt("dano") },
    { id: "sorte", label: stepTxt("sorte") },
    { id: "critChance", label: stepTxt("critChance") },
    { id: "critDamage", label: stepTxt("critDamage") },
  ];

  const statContainer = document.querySelector(".stat-buttons");
  const spent = Object.fromEntries(stats.map((s) => [s.id, 0]));

  statContainer.innerHTML = stats
    .map(
      (s) => `
      <div class="stat-row" data-stat="${s.id}">
        <button class="btn-minus">−</button>
        <span class="stat-label">${s.label}</span>
        <button class="btn-plus">+</button>
        <span class="stat-count" id="count-${s.id}">0</span>
      </div>`
    )
    .join("");

  const pointsText = document.getElementById("points");
  const btnContinue = document.getElementById("btn-continue");
  const btnUpgrade = document.getElementById("btn-upgrade-skill");
  const btnNew = document.getElementById("btn-new-skill");
  const btnRefuse = document.getElementById("btn-refuse-skill");

  // liga os botões +/− com aplicação e reversão exatas
  statContainer.querySelectorAll(".stat-row").forEach((row) => {
    const stat = row.dataset.stat;
    const plus = row.querySelector(".btn-plus");
    const minus = row.querySelector(".btn-minus");
    const count = row.querySelector(`#count-${stat}`);

    plus.addEventListener("click", () => {
      if (remaining <= 0) return;
      levelSystem.applyStat(playerEntity, stat);
      remaining--;
      spent[stat]++;
      playerEntity.statPoints = remaining;
      pointsText.textContent = remaining;
      count.textContent = spent[stat];

      updateHUD(playerEntity, progression, levelSystem);
      checkCanContinue();
    });

    minus.addEventListener("click", () => {
      if (spent[stat] <= 0) return;
      levelSystem.revertStat(playerEntity, stat);
      spent[stat]--;
      remaining++;
      playerEntity.statPoints = remaining;
      pointsText.textContent = remaining;
      count.textContent = spent[stat];

      updateHUD(playerEntity, progression, levelSystem);
      checkCanContinue();
    });
  });

  // ----- Escolha de habilidade -----
  btnUpgrade.addEventListener("click", () => {
    if (skillChoice === "refuse") return;
    skillChoice = "upgrade";
    highlightSkillChoice(btnUpgrade, [btnNew, btnRefuse]);
    checkCanContinue();
  });

  btnNew.addEventListener("click", () => {
    if (skillChoice === "refuse") return;
    skillChoice = "new";
    highlightSkillChoice(btnNew, [btnUpgrade, btnRefuse]);
    checkCanContinue();
  });

  btnRefuse.addEventListener("click", () => {
    if (skillChoice) return;
    skillChoice = "refuse";
    remaining += 3;
    playerEntity.statPoints = remaining;
    pointsText.textContent = remaining;
    highlightSkillChoice(btnRefuse, [btnUpgrade, btnNew]);
    btnUpgrade.disabled = true;
    btnNew.disabled = true;
    checkCanContinue();
  });

  function checkCanContinue() {
    if (remaining === 0 && skillChoice) btnContinue.disabled = false;
    else btnContinue.disabled = true;
  }

  btnContinue.addEventListener("click", () => {
    if (skillChoice === "upgrade") {
      upgradeCurrentSkill();
    } else if (skillChoice === "new") {
      return showNewSkillCards(); // a própria escolha já chama startBattle
    }
    // refuse ou upgrade: segue direto
    // congela como base para não perder upgrades em reaplicação de buffs
    commitCurrentAsBase(playerEntity);
    progression.nextStage();
    startBattle();
  });
}

/** Upa a skill atual */
function upgradeCurrentSkill() {
  if (!selectedSkill && playerEntity.skills?.length) {
    selectedSkill = playerEntity.skills[0];
  }
  if (!selectedSkill) return;

  selectedSkill.level = (selectedSkill.level || 1) + 1;
  selectedSkill.damage = Math.round(selectedSkill.damage * 1.2);
  if (selectedSkill.cooldown > 1) selectedSkill.cooldown -= 1;
  selectedSkill.cooldownCounter = 0;

  playerEntity.skills[0] = selectedSkill;
}

function highlightSkillChoice(activeBtn, others) {
  activeBtn.classList.add("skill-choice-active");
  others.forEach((b) => b.classList.remove("skill-choice-active"));
}

/* ================================
 * 🧠 ESCOLHA DE NOVA HABILIDADE (3 CARTAS)
 * ================================ */
function showNewSkillCards() {
  const app = document.getElementById("app");
  const clsId = selectedClass.id;
  const classSkills = skills[clsId];
  const globalSkills = skills.global;

  const currentId = playerEntity.skills?.[0]?.id;

  const classPool = classSkills.filter((s) => s.id !== currentId);
  const firstClass = classPool[0] || classSkills[0];
  const secondClass = classPool[1] || classSkills[0];

  const globalSkillTemplate =
    globalSkills[Math.floor(Math.random() * globalSkills.length)];

  const arcanaLevel = selectedBuffs.arcana.level;

  const options = [
    createSkillFromTemplate(firstClass, arcanaLevel),
    createSkillFromTemplate(secondClass, arcanaLevel),
    createSkillFromTemplate(globalSkillTemplate, arcanaLevel),
  ];

  app.innerHTML = `
    <header class="game-header"><h1>RPG Arena</h1></header>
    <main class="screen-center">
      <h2 class="screen-title">Escolha uma nova habilidade</h2>
      <div class="skill-card-grid">
        ${options
          .map(
            (s, idx) => `
          <article class="skill-card" data-index="${idx}">
            <h3 style="color:${rarityColor(s.rarity)}">${s.name}</h3>
            <p><strong>Raridade:</strong> ${s.rarity}</p>
            <p><strong>Dano:</strong> ${s.damage}</p>
            <p><strong>Mana:</strong> ${s.manaCost}</p>
            <p><strong>Cooldown:</strong> ${s.cooldown} turnos</p>
            <p><strong>Efeito:</strong> ${s.effect}</p>
          </article>
        `
          )
          .join("")}
      </div>
    </main>
  `;

  document.querySelectorAll(".skill-card").forEach((card) => {
    card.addEventListener("click", () => {
      const idx = Number(card.dataset.index);
      const chosen = options[idx];
      selectedSkill = chosen;
      playerEntity.skills[0] = chosen;

      // congela upgrades atuais como base antes de seguir
      commitCurrentAsBase(playerEntity);
      progression.nextStage();
      startBattle();
    });
  });
}

function createSkillFromTemplate(template, arcanaLevel) {
  const rarity = getRarityFromArcana(arcanaLevel, playerEntity.luck);
  const baseData = template.rarities[rarity];

  // use o multiplicador já calculado nos buffs do player
  const arcanaBoost = playerEntity.arcanaMultiplier ?? 1;

  return {
    id: template.id,
    name: template.baseName,
    type: template.type,
    rarity,
    level: 1,
    damage: Math.round(baseData.damage * arcanaBoost), // ✅ aplica Arcana aqui
    manaCost: baseData.manaCost,
    cooldown: baseData.cooldown,
    effect: baseData.effect,
    effects: baseData.effects || [],
    cooldownCounter: 0,
  };
}

function rarityColor(rarity) {
  const map = {
    common: "#bbb",
    rare: "#3fa9f5",
    super: "#7b61ff",
    legendary: "#d953ff",
    mythic: "#ffcc00",
  };
  return map[rarity] || "#fff";
}
