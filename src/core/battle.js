import { renderBattleUI, updateBars, showFloatingText } from "../ui/render.js";
import { playSound, playBGM, stopBGM } from "../ui/sound.js";
import { wait, chance, randomInt } from "./utils.js";
import { updateHUD } from "../ui/hud.js";
import { progression } from "./progression.js";
import { levelSystem } from "./level.js";
import { enemies } from "../data/enemies.js";
import { Entity } from "./entity.js";
import {
  applyEffect,
  hasEffect,
  tickEffectsOnTurnStart,
  getOffensiveModifiers,
} from "./effects.js";

let player, enemy, currentSkill, onBattleEnd;
let battleRunning = false;

/** Regen passiva do JOGADOR: 5% base + bônus de passivas */
function applyPlayerPassiveRegen(p) {
  const hpRate = 0.05 + (p.regenHpBonus || 0);
  const mpRate = 0.05 + (p.regenMpBonus || 0);

  const heal = Math.max(0, Math.floor(p.maxHp * hpRate));
  const mana = Math.max(0, Math.floor(p.maxMp * mpRate));

  const prevHp = p.hp;
  const prevMp = p.mp;

  p.hp = Math.min(p.maxHp, p.hp + heal);
  p.mp = Math.min(p.maxMp, p.mp + mana);

  if (p.hp > prevHp || p.mp > prevMp) {
    showFloatingText(`+${p.hp - prevHp} HP / +${p.mp - prevMp} MP`, "info");
  }
}

/** Ponto de entrada da batalha */
export function startBattleScene(playerEntity, skill, callback) {
  player = playerEntity;
  currentSkill = skill;
  onBattleEnd = callback;

  enemy = createEnemyForLevel(progression.currentStage || 1);
  prepareEntity(player);
  prepareEntity(enemy);
  battleRunning = true;

  startBattleMusic(enemy);

  renderBattleUI(player, enemy);
  updateBars(player, enemy);
  updateHUD(player, progression, levelSystem);
  loop();
}

/** Gera inimigo com base no nível do jogador */
function createEnemyForLevel(level) {
  const template = enemies[randomInt(0, enemies.length - 1)];
  const e = new Entity(template);

  const scale = 1 + level * 0.2;
  e.maxHp = Math.round(e.maxHp * scale);
  e.hp = e.maxHp;
  e.damage = Math.round(e.damage * scale);
  e.speed = Math.round(e.speed * (1 + level * 0.05));

  e.name = template.name;
  e.id = template.id;
  e.effects = [];
  e.level = level; // usado no header rápido do inimigo
  return e;
}

/** Inicializa propriedades seguras */
function prepareEntity(ent) {
  ent.speedGauge = 0;
  ent.hp = ent.hp ?? ent.maxHp ?? 100;
  ent.mp = ent.mp ?? ent.maxMp ?? 100;
  ent.maxHp = ent.maxHp ?? ent.hp;
  ent.maxMp = ent.maxMp ?? ent.mp;
  ent.alive = true;
  ent.effects = ent.effects || [];
}

/** BGM */
function startBattleMusic(enemy) {
  let track = "battle-normal.mp3";
  if (enemy.id?.includes("skeleton")) track = "battle-ominous.mp3";
  if (enemy.id?.includes("boss")) track = "battle-boss.mp3";
  playBGM(track, 0.6, true);
}

/** Loop principal */
async function loop() {
  while (battleRunning) {
    if (checkBattleEnd()) break;

    tickSpeed(player);
    tickSpeed(enemy);

    updateBars(player, enemy);
    updateHUD(player, progression, levelSystem);

    if (player.speedGauge >= 100) {
      player.speedGauge = 0;
      await handleTurn(player, enemy, true);
    }

    if (enemy.speedGauge >= 100) {
      enemy.speedGauge = 0;
      await handleTurn(enemy, player, false);
    }

    await wait(100);
  }
}

/** Incrementa gauge */
function tickSpeed(ent) {
  const baseSpeed = ent.getFinalSpeed ? ent.getFinalSpeed() : ent.speed || 30;
  ent.speedGauge += baseSpeed * 0.05;
}

/** Verifica fim da batalha */
function checkBattleEnd() {
  const over = !player.alive || !enemy.alive || player.hp <= 0 || enemy.hp <= 0;
  if (!over) return false;

  battleRunning = false;

  const playerWon = enemy.hp <= 0;
  stopBGM();
  if (playerWon) {
    playSound("victory.mp3");
    playBGM("victory-theme.mp3", 0.7, false);
  } else {
    playSound("defeat.mp3");
    playBGM("defeat-theme.mp3", 0.6, false);
  }

  wait(800).then(() => {
    onBattleEnd && onBattleEnd(playerWon ? "win" : "lose");
  });

  return true;
}

/** Controla o turno de uma entidade */
async function handleTurn(attacker, target, isPlayerTurn) {
  // Efeitos em início de turno
  const diedFromDot = await tickEffectsOnTurnStart(attacker);
  if (diedFromDot) {
    showFloatingText(`${attacker.name} sucumbiu a um efeito!`, "status");
    updateBars(player, enemy);
    updateHUD(player, progression, levelSystem);
    return;
  }

  // Stun cancela turno
  if (hasEffect(attacker, "stun")) {
    showFloatingText(`${attacker.name} está atordoado!`, "status");
    applyStatusVisual(attacker === player ? "player" : "enemy", "stun");
    updateBars(player, enemy);
    updateHUD(player, progression, levelSystem);
    return;
  }

  if (isPlayerTurn) {
    // Regen passiva sempre no começo do SEU turno
    applyPlayerPassiveRegen(player);
    updateBars(player, enemy);
    updateHUD(player, progression, levelSystem);
    await playerTurn();
  } else {
    await enemyTurn();
  }

  updateBars(player, enemy);
  updateHUD(player, progression, levelSystem);
}

/** Turno do jogador */
async function playerTurn() {
  const basicBtn = document.querySelector('.action-btn[data-action="basic"]');
  const skillBtn = document.querySelector('.action-btn[data-action="skill"]');
  if (!basicBtn || !skillBtn) return;

  updateCooldownText();
  let skillDisabled =
    !currentSkill ||
    currentSkill.cooldownCounter > 0 ||
    player.mp < Math.ceil(currentSkill.manaCost * (player.manaCostMult || 1));
  basicBtn.disabled = false;
  skillBtn.disabled = skillDisabled;
  playSound("turn-player.mp3");

  return new Promise((resolve) => {
    const disable = () => {
      basicBtn.disabled = true;
      skillBtn.disabled = true;
    };

    basicBtn.addEventListener(
      "click",
      async () => {
        disable();
        await attack(player, enemy, player.damage, "basic");
        resolve();
      },
      { once: true }
    );

    skillBtn.addEventListener(
      "click",
      async () => {
        if (skillDisabled) {
          showFloatingText("❌ Habilidade indisponível!", "info");
          playSound("no-mana.mp3");
          return;
        }
        disable();
        const cost = Math.ceil(
          currentSkill.manaCost * (player.manaCostMult || 1)
        );
        player.mp -= cost;

        await attack(player, enemy, currentSkill.damage, "skill");
        currentSkill.cooldownCounter = currentSkill.cooldown;
        updateCooldownText();
        resolve();
      },
      { once: true }
    );
  });
}

/** Atualiza cooldown */
function updateCooldownText() {
  if (!currentSkill) return;
  const cdText = document.getElementById("skill-cd");
  if (cdText) cdText.textContent = currentSkill.cooldownCounter ?? 0;

  if (currentSkill.cooldownCounter > 0) {
    currentSkill.cooldownCounter = Math.max(
      0,
      currentSkill.cooldownCounter - 1
    );
  }
}

/** Turno do inimigo */
async function enemyTurn() {
  if (!enemy.alive) return;

  playSound("turn-enemy.mp3");
  showFloatingText(`${enemy.name} ataca!`, "status");

  const useSkill = enemy.mp >= 10 && chance(0.3);
  if (useSkill) {
    enemy.mp -= 10;
    await attack(enemy, player, enemy.damage + 5, "skill");
  } else {
    await attack(enemy, player, enemy.damage, "basic");
  }
}

/** Ataque genérico */
async function attack(attacker, target, damage, type) {
  if (!attacker.alive || !target.alive) return;

  playSound(type === "skill" ? "skill-cast.mp3" : "attack-basic.mp3");

  // Modificadores de buffs
  const offensive = getOffensiveModifiers(attacker);
  let dmg = (Number(damage) || 0) * (offensive.damageMultiplier ?? 1);

  // Arcana em skills
  if (attacker.arcanaMultiplier && type === "skill") {
    dmg *= attacker.arcanaMultiplier;
  }

  // Crítico
  const isCrit = chance((attacker.critChance ?? 0) / 100);
  if (isCrit) dmg *= attacker.critDamage || 1.5;

  dmg = Math.max(1, Math.floor(dmg));
  target.hp = Math.max(0, target.hp - dmg);
  if (target.hp <= 0) target.alive = false;

  showFloatingText(
    `${dmg}${isCrit ? " CRIT!" : ""}`,
    "damage",
    target === player ? "player" : "enemy"
  );
  const side = target === player ? "player" : "enemy";
  shakeEntity(side, isCrit);
  applyHitFlash(side, isCrit);

  updateBars(player, enemy);
  updateHUD(player, progression, levelSystem);

  // Aplicação de efeitos de skill do jogador
  if (type === "skill" && attacker === player && currentSkill?.effects) {
    for (const eff of currentSkill.effects) {
      if (Math.random() <= (eff.chance ?? 1)) {
        applyEffect(target, eff.id, {
          duration: eff.duration,
          potency: eff.potency ?? 1,
          source: attacker.name,
        });
        showFloatingText(`${target.name} sofre ${eff.id}`, "status");
        await wait(150);
      }
    }
  }

  await wait(600);
  if (!target.alive) {
    showFloatingText(`${target.name} foi derrotado!`, "status");
    playSound("kill.mp3");
  }
}

/** Feedbacks visuais */
function shakeEntity(side, isCrit = false) {
  const selector = side === "player" ? ".entity.player" : ".entity.enemy";
  const el = document.querySelector(selector);
  if (!el || !el.animate) return;
  const intensity = isCrit ? 6 : 3;
  el.animate(
    [
      { transform: "translateX(0)" },
      { transform: `translateX(-${intensity}px)` },
      { transform: `translateX(${intensity}px)` },
      { transform: "translateX(0)" },
    ],
    { duration: isCrit ? 250 : 150, easing: "ease-in-out" }
  );
}

function applyHitFlash(side, isCrit = false) {
  const selector = side === "player" ? ".entity.player" : ".entity.enemy";
  const el = document.querySelector(selector);
  if (!el) return;
  const className = isCrit ? "hit-flash-crit" : "hit-flash";
  el.classList.add(className);
  setTimeout(() => el.classList.remove(className), 180);
}

function applyStatusVisual(side, statusName) {
  const selector = side === "player" ? ".entity.player" : ".entity.enemy";
  const el = document.querySelector(selector);
  if (!el) return;
  const className = `status-${statusName}`;
  el.classList.add(className);
  setTimeout(() => el.classList.remove(className), 600);
}
