import { showFloatingText } from "../ui/render.js";
import { playSound } from "../ui/sound.js";

/**
 * ================================
 * 📈 Sistema de Progressão e Level Up
 * ================================
 */
export const levelSystem = {
  xpTable: [
    0, 100, 250, 450, 700, 1000, 1400, 1850, 2350, 2900, 3600, 4400, 5400, 6600,
    8000,
  ],

  checkLevelUp(player) {
    const currentLevel = player.level ?? 1;
    const xpRequired = this.xpTable[currentLevel] ?? Infinity;

    if (player.xp >= xpRequired) {
      player.level = currentLevel + 1;
      player.xp -= xpRequired;
      player.statPoints = (player.statPoints ?? 0) + 7;
      playSound("levelup.mp3");
      showFloatingText(`⬆️ Nível ${player.level}!`, "info");
      return true;
    }
    return false;
  },

  // Agora aplicamos os pontos na baseline (baseDynamic) e recalcFromBuffs()
  applyStat(player, stat) {
    player.baseDynamic = player.baseDynamic || {
      maxHp: player.maxHp,
      maxMp: player.maxMp,
      speed: player.speed,
      damage: player.damage,
    };
    player.buffs = player.buffs || {};
    player.buffs.poder = player.buffs.poder || { hp: 0, dmg: 0, speed: 0 };
    player.buffs.arcana = player.buffs.arcana ?? 0;
    player.buffs.riqueza = player.buffs.riqueza || { bonus: 0 };

    const poder = player.buffs.poder;
    const arcana = player.buffs.arcana;
    const riqueza = player.buffs.riqueza;

    switch (stat) {
      case "vida": {
        const inc = 10 * (1 + (poder.hp ?? 0));
        player.baseDynamic.maxHp += inc;
        showFloatingText("❤️ Vida aumentada!", "info");
        break;
      }
      case "mana": {
        const inc = 10 * (1 + (arcana ?? 0));
        player.baseDynamic.maxMp += inc;
        showFloatingText("🔷 Mana aumentada!", "info");
        break;
      }
      case "velocidade": {
        const inc = 5 * (1 + (poder.speed ?? 0));
        player.baseDynamic.speed += inc;
        showFloatingText("⚡ Velocidade aumentada!", "info");
        break;
      }
      case "dano": {
        const inc = 3 * (1 + (poder.dmg ?? 0));
        player.baseDynamic.damage += inc;
        showFloatingText("💥 Dano aumentado!", "info");
        break;
      }
      case "sorte":
        player.luck += 2 * (1 + (riqueza.bonus ?? 0));
        showFloatingText("🍀 Sorte aumentada!", "info");
        break;
      case "critChance":
        player.critChance += 1;
        showFloatingText("🎯 Chance crítica aumentada!", "info");
        break;
      case "critDamage":
        player.critDamage += 0.1;
        showFloatingText("💢 Dano crítico aumentado!", "info");
        break;
      default:
        console.warn("Atributo desconhecido:", stat);
        break;
    }

    playSound("statup.mp3");
    player.statPoints = Math.max(0, (player.statPoints ?? 0) - 1);

    // Recalcula atributos finais considerando o buff de Poder
    player.recalcFromBuffs?.();
  },

  getNextLevelXP(player) {
    return this.xpTable[player.level] ?? null;
  },
};
