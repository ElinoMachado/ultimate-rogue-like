// src/data/passives.js
export const passives = [
  {
    id: "passive_regen_plus",
    name: "Regeneração Potente",
    rarity: "rare",
    description: "+2% de regen de HP e +2% de regen de MP por turno.",
    apply(player) {
      player.passiveRegenBonusHp = (player.passiveRegenBonusHp || 0) + 0.02;
      player.passiveRegenBonusMp = (player.passiveRegenBonusMp || 0) + 0.02;
    },
  },
  {
    id: "passive_battle_rhythm",
    name: "Ritmo de Batalha",
    rarity: "common",
    description: "Começa cada batalha com +20 de gauge de velocidade.",
    apply(player) {
      player.startGaugeBonus = Math.max(player.startGaugeBonus || 0, 20);
    },
  },
  {
    id: "passive_mana_efficiency",
    name: "Eficiência Arcana",
    rarity: "super",
    description: "Habilidades custam -20% de mana.",
    apply(player) {
      player.manaCostMultiplier = (player.manaCostMultiplier || 1) * 0.8;
    },
  },
  {
    id: "passive_steel_skin",
    name: "Pele de Aço",
    rarity: "rare",
    description: "+10% vida máxima (aplicado ao valor base).",
    apply(player) {
      if (!player.baseDynamic) return;
      player.baseDynamic.maxHp = Math.round(player.baseDynamic.maxHp * 1.1);
      player.recalcFromBuffs?.();
    },
  },
  {
    id: "passive_killer_instinct",
    name: "Instinto Assassino",
    rarity: "legendary",
    description: "+5% chance de crítico.",
    apply(player) {
      player.critChance = (player.critChance || 0) + 5;
    },
  },
];
