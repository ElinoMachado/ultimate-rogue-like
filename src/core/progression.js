// src/core/progression.js
import { randomInt, chance } from "./utils.js";

/**
 * Sistema de progressão e recompensas.
 * Compatível com o uso atual em main.js (calcRewards(player, buffs)).
 */
export const progression = {
  currentStage: 1,
  gold: 0,
  xp: 0,

  nextStage() {
    this.currentStage++;
  },

  /**
   * Calcula recompensas da fase:
   * - leva em conta fase atual
   * - buff de riqueza
   * - sorte do jogador
   */
  calcRewards(player, buffs) {
    const baseXP = 50 + this.currentStage * 10;
    const baseGold = 30 + this.currentStage * 5;

    const riquezaBonus = buffs?.riqueza?.bonus ?? 0;
    const luckyBonus = (player.luck ?? 0) / 100;
    const arcanaBonus = buffs?.arcana?.bonus ?? 0; // influência extra opcional

    // pequena variação aleatória ±10%
    const variation = () => 0.9 + Math.random() * 0.2;

    const finalXP = Math.floor(
      baseXP * (1 + riquezaBonus + luckyBonus + arcanaBonus) * variation()
    );
    const finalGold = Math.floor(
      baseGold * (1 + riquezaBonus + luckyBonus) * variation()
    );

    // chance de drop base + sorte
    const dropChance = 0.15 + luckyBonus * 2;
    const gotDrop = chance(dropChance);

    return {
      xp: finalXP,
      gold: finalGold,
      drop: gotDrop ? generateDrop(player, this.currentStage) : null,
    };
  },
};

/**
 * Geração de drop escalável, mas mantendo:
 *   drop.item
 *   drop.color
 *   drop.power
 * que são usados em main.js.
 */
function generateDrop(player, stage) {
  const luck = player.luck ?? 0;

  const rarityTable = [
    { id: "common", name: "Comum", color: "#bbb", weight: 60 },
    { id: "rare", name: "Raro", color: "#3fa9f5", weight: 25 },
    { id: "super", name: "Super", color: "#7b61ff", weight: 8 },
    { id: "legendary", name: "Lendário", color: "#d953ff", weight: 5 },
    { id: "mythic", name: "Mítico", color: "#ffcc00", weight: 2 },
  ];

  // sorte aumenta levemente chance de raridades melhores
  const luckBoost = 1 + Math.min(luck / 100, 0.5); // até +50% de peso total
  const totalWeight =
    rarityTable.reduce((sum, r) => sum + r.weight, 0) * luckBoost;

  let roll = randomInt(1, totalWeight);
  let rarity = rarityTable[0];

  for (const r of rarityTable) {
    roll -= r.weight;
    if (roll <= 0) {
      rarity = r;
      break;
    }
  }

  const basePower = randomInt(5 + stage, 15 + stage * 2) + Math.floor(luck / 5);
  const rarityMult =
    {
      common: 1,
      rare: 1.2,
      super: 1.5,
      legendary: 2.0,
      mythic: 3.0,
    }[rarity.id] ?? 1;

  const power = Math.floor(basePower * rarityMult);

  // Mantém campos antigos e adiciona extras opcionais
  return {
    item: `Item ${rarity.name}`, // <<< compatível com main.js
    color: rarity.color,
    power,
    // extras para uso futuro
    rarity: rarity.id,
    type: "equipment",
    id: `drop_${rarity.id}_${Date.now()}_${randomInt(1000, 9999)}`,
    description: `Um item ${rarity.name.toLowerCase()} obtido na fase ${stage}.`,
  };
}
