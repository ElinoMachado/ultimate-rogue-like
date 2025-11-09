// src/data/effects.js

/**
 * Catálogo de efeitos (buffs, debuffs, status, CC).
 * Apenas dados, zero lógica aqui.
 */
export const effectsCatalog = [
  // =========================
  // CONTROLE / CC
  // =========================
  {
    id: "stun",
    name: "Atordoado",
    type: "control", // control | dot | buff | debuff
    tags: ["negative", "cc"],
    description: "Perde o próximo turno.",
    ui: {
      icon: "💫",
      hudLabel: "Atordoado",
      entityClass: "status-stun",
      cardBadgeClass: "badge-stun",
    },
    sfx: {
      apply: "stun.mp3",
      tick: null,
      end: null,
    },
    behavior: {
      skipTurn: true,
    },
  },

  // =========================
  // DANO CONTÍNUO (SANGRAMENTO)
  // =========================
  {
    id: "bleed_light",
    name: "Sangramento Leve",
    type: "dot",
    tags: ["negative"],
    description: "Perde um pouco de vida em cada turno.",
    ui: {
      icon: "🩸",
      hudLabel: "Sangramento",
      entityClass: "status-bleed",
      cardBadgeClass: "badge-bleed",
    },
    sfx: {
      apply: "bleed.mp3",
      tick: "bleed.mp3",
      end: null,
    },
    behavior: {
      hpPercentPerTurn: 0.03, // 3% da vida máx por turno
      minDamage: 1,
    },
  },
  {
    id: "bleed_heavy",
    name: "Sangramento Forte",
    type: "dot",
    tags: ["negative"],
    description: "Perde bastante vida em cada turno.",
    ui: {
      icon: "🩸",
      hudLabel: "Sangramento+",
      entityClass: "status-bleed",
      cardBadgeClass: "badge-bleed",
    },
    sfx: {
      apply: "bleed.mp3",
      tick: "bleed.mp3",
      end: null,
    },
    behavior: {
      hpPercentPerTurn: 0.06, // 6% por turno
      minDamage: 1,
    },
  },

  // =========================
  // DANO CONTÍNUO (QUEIMADURA)
  // =========================
  {
    id: "burn_light",
    name: "Queimadura",
    type: "dot",
    tags: ["negative", "fire"],
    description: "Perde vida devido a queimaduras.",
    ui: {
      icon: "🔥",
      hudLabel: "Queimando",
      entityClass: "status-burn",
      cardBadgeClass: "badge-burn",
    },
    sfx: {
      apply: "burn.mp3",
      tick: "burn.mp3",
      end: null,
    },
    behavior: {
      flatDamagePerTurn: 3, // ex: 'Queimadura 3/t'
      minDamage: 1,
    },
  },
  {
    id: "burn_heavy",
    name: "Grande Queimadura",
    type: "dot",
    tags: ["negative", "fire"],
    description: "Perde muita vida devido a queimaduras severas.",
    ui: {
      icon: "🔥",
      hudLabel: "Queimando+",
      entityClass: "status-burn",
      cardBadgeClass: "badge-burn",
    },
    sfx: {
      apply: "burn.mp3",
      tick: "burn.mp3",
      end: null,
    },
    behavior: {
      flatDamagePerTurn: 6, // ex: 'Queimadura 6/t'
      minDamage: 1,
    },
  },

  // =========================
  // BUFFS OFENSIVOS
  // =========================
  {
    id: "buff_damage_up",
    name: "Força Aumentada",
    type: "buff",
    tags: ["positive"],
    description: "Aumenta o dano causado.",
    ui: {
      icon: "⚔️",
      hudLabel: "Dano+",
      entityClass: "status-buff-damage",
      cardBadgeClass: "badge-damage-up",
    },
    sfx: {
      apply: "buff-up.mp3",
      tick: null,
      end: null,
    },
    behavior: {
      damageMultiplier: 0.2, // +20% de dano base (por ponto de potency)
    },
  },
  {
    id: "buff_crit_up",
    name: "Foco Crítico",
    type: "buff",
    tags: ["positive"],
    description: "Aumenta a chance de crítico.",
    ui: {
      icon: "💥",
      hudLabel: "Crítico+",
      entityClass: "status-buff-crit",
      cardBadgeClass: "badge-crit-up",
    },
    sfx: {
      apply: "buff-up.mp3",
      tick: null,
      end: null,
    },
    behavior: {
      critChanceBonus: 10, // +10% de crit (por ponto de potency)
    },
  },
];

export const effectsById = effectsCatalog.reduce((map, effect) => {
  map[effect.id] = effect;
  return map;
}, {});
