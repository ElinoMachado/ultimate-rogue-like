export const passives = [
  {
    id: "passive_regen_boost",
    name: "Energia Renovada",
    description: "Regeneração +3% de HP e MP no início do seu turno.",
    apply(player) {
      player.regenHpBonus = (player.regenHpBonus || 0) + 0.03;
      player.regenMpBonus = (player.regenMpBonus || 0) + 0.03;
    },
  },
  {
    id: "passive_mana_eff",
    name: "Conservador de Mana",
    description: "Habilidades custam 20% menos mana.",
    apply(player) {
      player.manaCostMult = 0.8;
    },
  },
  {
    id: "passive_extra_life",
    name: "Determinação",
    description: "Ganha +1 vida extra.",
    apply(player) {
      player.lives = (player.lives || 0) + 1;
    },
  },
  {
    id: "passive_crit_focus",
    name: "Foco Preciso",
    description: "+5% de chance crítica e +10% de dano crítico.",
    apply(player) {
      player.critChance += 5;
      player.critDamage += 0.1;
    },
  },
];
