// src/core/level.js
import { showFloatingText } from "../ui/render.js";
import { playSound } from "../ui/sound.js";

/**
 * ================================
 * 📈 Sistema de Progressão e Level Up
 * ================================
 *
 * Observação importante:
 * - `applyStat` e `revertStat` **não** mexem mais em `statPoints`.
 *   O controle de pontos fica na tela de Level Up (UI), para permitir desfazer (−).
 * - Os passos (quanto cada atributo sobe) são definidos por `getStep`.
 *   Assim o HUD, os rótulos e a aplicação real ficam consistentes.
 */
export const levelSystem = {
  /** XP necessária para cada nível */
  xpTable: [
    0, 100, 250, 450, 700, 1000, 1400, 1850, 2350, 2900, 3600, 4400, 5400, 6600,
    8000,
  ],

  /**
   * Verifica se o jogador atingiu XP suficiente para subir de nível.
   * Retorna `true` se subir de nível.
   */
  checkLevelUp(player) {
    const currentLevel = player.level ?? 1;
    const xpRequired = this.xpTable[currentLevel] ?? Infinity;

    if ((player.xp ?? 0) >= xpRequired) {
      player.level = currentLevel + 1;
      player.xp -= xpRequired;
      player.statPoints = (player.statPoints ?? 0) + 7;
      playSound("levelup.mp3");
      showFloatingText(`⬆️ Nível ${player.level}!`, "info");
      return true;
    }
    return false;
  },

  /**
   * Retorna o tamanho do passo para cada atributo, baseado nos buffs atuais.
   * Isso PRECISA bater com o que a UI exibe.
   */
  getStep(player, stat) {
    // garantias
    const poder = player?.buffs?.poder ?? { hp: 0, dmg: 0, speed: 0 };
    const arcana = player?.buffs?.arcana ?? 0;
    const riquezaBonus = player?.wealthBonus ?? 0;

    switch (stat) {
      case "vida":
        return 10 * (1 + (poder.hp ?? 0)); // HP máx
      case "mana":
        return 10 * (1 + (arcana ?? 0)); // MP máx
      case "velocidade":
        return 5 * (1 + (poder.speed ?? 0));
      case "dano":
        return 3 * (1 + (poder.dmg ?? 0));
      case "sorte":
        return 2 * (1 + riquezaBonus);
      case "critChance":
        // passo em PONTOS percentuais, ex.: 0.5, 1.0, 1.5...
        return 1 * (1 + riquezaBonus);
      case "critDamage":
        // passo em multiplicador (0.1 == +10%)
        return 0.1 * (1 + riquezaBonus);
      default:
        return 0;
    }
  },

  /**
   * Aplica UM ponto no atributo informado (não mexe em statPoints).
   */
  applyStat(player, stat) {
    const step = this.getStep(player, stat);
    if (!step) return;

    switch (stat) {
      case "vida":
        player.maxHp = Math.max(1, Math.floor(player.maxHp + step));
        player.hp = player.maxHp; // enche a vida ao upar vida
        showFloatingText("❤️ Vida aumentada!", "info");
        break;

      case "mana":
        player.maxMp = Math.max(0, Math.floor(player.maxMp + step));
        player.mp = Math.min(player.maxMp, (player.mp ?? 0) + step);
        showFloatingText("🔷 Mana aumentada!", "info");
        break;

      case "velocidade":
        player.speed = Math.max(1, Math.floor(player.speed + step));
        showFloatingText("⚡ Velocidade aumentada!", "info");
        break;

      case "dano":
        player.damage = Math.max(0, Math.floor(player.damage + step));
        showFloatingText("💥 Dano aumentado!", "info");
        break;

      case "sorte":
        player.luck = Math.max(0, Math.floor(player.luck + step));
        showFloatingText("🍀 Sorte aumentada!", "info");
        break;

      case "critChance":
        player.critChance = Math.max(0, +(player.critChance + step).toFixed(2));
        showFloatingText("🎯 Chance crítica aumentada!", "info");
        break;

      case "critDamage":
        player.critDamage = Math.max(0, +(player.critDamage + step).toFixed(3));
        showFloatingText("💢 Dano crítico aumentado!", "info");
        break;

      default:
        console.warn("Atributo desconhecido:", stat);
        return;
    }

    playSound("statup.mp3");
  },

  /**
   * Reverte UM ponto previamente aplicado no atributo informado.
   * (usa o MESMO passo da aplicação)
   */
  revertStat(player, stat) {
    const step = this.getStep(player, stat);
    if (!step) return;

    switch (stat) {
      case "vida":
        player.maxHp = Math.max(1, Math.floor(player.maxHp - step));
        player.hp = Math.min(player.hp, player.maxHp);
        break;

      case "mana":
        player.maxMp = Math.max(0, Math.floor(player.maxMp - step));
        player.mp = Math.min(player.mp, player.maxMp);
        break;

      case "velocidade":
        player.speed = Math.max(1, Math.floor(player.speed - step));
        break;

      case "dano":
        player.damage = Math.max(0, Math.floor(player.damage - step));
        break;

      case "sorte":
        player.luck = Math.max(0, Math.floor(player.luck - step));
        break;

      case "critChance":
        player.critChance = Math.max(0, +(player.critChance - step).toFixed(2));
        break;

      case "critDamage":
        player.critDamage = Math.max(0, +(player.critDamage - step).toFixed(3));
        break;

      default:
        console.warn("Atributo desconhecido (revert):", stat);
        return;
    }
  },

  /**
   * Retorna a XP necessária para o próximo nível.
   */
  getNextLevelXP(player) {
    return this.xpTable[player.level] ?? null;
  },
};
