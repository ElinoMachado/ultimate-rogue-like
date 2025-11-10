export const passives = [
  {
    id: "passive_regen_boost",
    name: "Energia Renovada",
    common: {
      description: "Regeneração +3% de HP e MP no início do seu turno.",
      apply(player) {
        player.regenHpBonus = (player.regenHpBonus || 0) + 0.03;
        player.regenMpBonus = (player.regenMpBonus || 0) + 0.03;
      },
    },
    rare: {
      description: "Regeneração +5% de HP e MP no início do seu turno.",
      apply(player) {
        player.regenHpBonus = (player.regenHpBonus || 0) + 0.05;
        player.regenMpBonus = (player.regenMpBonus || 0) + 0.05;
      },
    },
    super: {
      description: "Regeneração +8% de HP e MP no início do seu turno.",
      apply(player) {
        player.regenHpBonus = (player.regenHpBonus || 0) + 0.08;
        player.regenMpBonus = (player.regenMpBonus || 0) + 0.08;
      },
    },
    legendary: {
      description: "Regeneração +12% de HP e MP no início do seu turno.",
      apply(player) {
        player.regenHpBonus = (player.regenHpBonus || 0) + 0.12;
        player.regenMpBonus = (player.regenMpBonus || 0) + 0.12;
      },
    },
    mythic: {
      description: "Regeneração +20% de HP e MP no início do seu turno.",
      apply(player) {
        player.regenHpBonus = (player.regenHpBonus || 0) + 0.2;
        player.regenMpBonus = (player.regenMpBonus || 0) + 0.2;
      },
    },
  },
  {
    id: "passive_mana_eff",
    name: "Conservador de Mana",
    common: {
      description: "Reduz custo de mana em 20%.",
      apply(player) {
        player.manaCostMult = (player.manaCostMult || 1) * 0.8;
      },
    },
    rare: {
      description: "Reduz custo de mana em 25%.",
      apply(player) {
        player.manaCostMult = (player.manaCostMult || 1) * 0.75;
      },
    },
    super: {
      description: "Reduz custo de mana em 40%.",
      apply(player) {
        player.manaCostMult = (player.manaCostMult || 1) * 0.6;
      },
    },
    legendary: {
      description: "Reduz custo de mana em 75%.",
      apply(player) {
        player.manaCostMult = (player.manaCostMult || 1) * 0.25;
      },
    },
    mythic: {
      description: "Reduz custo de mana em 90%.",
      apply(player) {
        player.manaCostMult = (player.manaCostMult || 1) * 0.1;
      },
    },
  },
  {
    id: "passive_extra_life",
    name: "Determinação",
    common: {
      description: "Ganha +1 vida extra.",
      apply(player) {
        player.lives = (player.lives || 0) + 1;
      },
    },
    rare: {
      description: "Ganha +2 vidas extras.",
      apply(player) {
        player.lives = (player.lives || 0) + 2;
      },
    },
    super: {
      description: "Ganha +3 vidas extras.",
      apply(player) {
        player.lives = (player.lives || 0) + 3;
      },
    },
    legendary: {
      description: "Ganha +4 vidas extras.",
      apply(player) {
        player.lives = (player.lives || 0) + 4;
      },
    },
    mythic: {
      description: "Ganha +5 vidas extras.",
      apply(player) {
        player.lives = (player.lives || 0) + 5;
      },
    },
  },
  {
    id: "passive_crit_focus",
    name: "Foco Preciso",
    common: {
      description: "+5% de chance crítica e +10% de dano crítico.",
      apply(player) {
        player.critChance += 5;
        player.critDamage += 0.1;
      },
    },
    rare: {
      description: "+7% de chance crítica e +15% de dano crítico.",
      apply(player) {
        player.critChance += 7;
        player.critDamage += 0.15;
      },
    },
    super: {
      description: "+10% de chance crítica e +25% de dano crítico.",
      apply(player) {
        player.critChance += 10;
        player.critDamage += 0.25;
      },
    },
    legendary: {
      description: "+15% de chance crítica e +40% de dano crítico.",
      apply(player) {
        player.critChance += 15;
        player.critDamage += 0.4;
      },
    },
    mythic: {
      description: "+20% de chance crítica e +60% de dano crítico.",
      apply(player) {
        player.critChance += 20;
        player.critDamage += 0.6;
      },
    },
  },
];
