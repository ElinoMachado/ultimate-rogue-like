// src/core/progression.js

/**
 * Progressão do jogo (fases, recompensas e drops)
 * — Fonte ÚNICA da verdade para XP/Gold mostrados na batalha e na vitória.
 */
export const progression = {
  currentStage: 1,
  xp: 0,
  gold: 0,

  /** Fórmula base (estável) por fase */
  calcRewardBase(stage) {
    const s = Math.max(1, Number(stage) || 1);
    const xpBase = 50 + s * 10;
    const goldBase = 30 + s * 5;
    return { xpBase, goldBase };
  },

  /**
   * Pré-visualização de recompensas fixas da fase (sem efeitos aleatórios).
   * Usa apenas bônus de riqueza do jogador.
   */
  calcRewardsPreview(player, stage = this.currentStage) {
    const { xpBase, goldBase } = this.calcRewardBase(stage);
    const wealth = Number(player?.wealthBonus ?? 0);

    const xpBonus = Math.round(xpBase * wealth);
    const goldBonus = Math.round(goldBase * wealth);

    return {
      stage,
      xpBase,
      goldBase,
      xpBonus,
      goldBonus,
      xpTotal: xpBase + xpBonus,
      goldTotal: goldBase + goldBonus,
    };
  },

  /**
   * Recompensa efetiva ao finalizar a fase.
   * Mantida compatível com a assinatura antiga (2º arg ignorado).
   */
  calcRewards(player, _buffsIgnored) {
    const meta = this.calcRewardsPreview(player, this.currentStage);
    const drop = this.rollDrop(player);
    return {
      xp: meta.xpTotal,
      gold: meta.goldTotal,
      drop,
      meta, // útil para logs/depuração se quiser
    };
  },

  /** Chance simples de drop baseada em sorte (opcional) */
  rollDrop(player) {
    const luck = Number(player?.luck ?? 0);
    const baseChance = 0.18; // 18%
    const luckBonus = Math.min(0.22, luck * 0.002); // +0.2% por ponto de sorte, até +22%
    const chance = baseChance + luckBonus;

    if (Math.random() > chance) return null;

    // pool simples de exemplo (mantém estrutura usada na UI)
    const pool = [
      { item: "Gema Brilhante", power: 2, color: "#3fa9f5" },
      { item: "Runa Etérea", power: 3, color: "#7b61ff" },
      { item: "Anel Dourado", power: 1, color: "#ffcc00" },
    ];
    return pool[Math.floor(Math.random() * pool.length)];
  },

  /** Avança a fase */
  nextStage() {
    this.currentStage += 1;
  },
};
