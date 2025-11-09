// src/data/enemies.js

/**
 * ================================
 * 🧩 Sistema de inimigos
 * ================================
 *
 * Cada inimigo define:
 * - id, name, baseStats: atributos essenciais
 * - traits: afinidades e fraquezas (ex: "resistant:poison", "weak:bleed")
 * - behavior: comportamento básico em combate (AI futura)
 * - loot: chance de drop e tipo (para integração com progression)
 */

export const enemies = [
  {
    id: "slime_green",
    name: "Slime Verde",
    role: "Tank Mágico",
    traits: ["resistant:poison", "weak:fire"],
    behavior: "defensive",
    baseStats: {
      maxHp: 60,
      maxMp: 20,
      speed: 25,
      damage: 8,
      luck: 0,
      critChance: 5,
      critDamage: 1.3,
    },
    loot: {
      gold: [5, 15],
      xp: [15, 25],
    },
  },
  {
    id: "goblin",
    name: "Goblin",
    role: "Agressivo",
    traits: ["weak:bleed", "resistant:stun"],
    behavior: "aggressive",
    baseStats: {
      maxHp: 80,
      maxMp: 30,
      speed: 35,
      damage: 10,
      luck: 2,
      critChance: 8,
      critDamage: 1.4,
    },
    loot: {
      gold: [10, 25],
      xp: [25, 40],
    },
  },
  {
    id: "skeleton_warrior",
    name: "Esqueleto Guerreiro",
    role: "Frontline",
    traits: ["resistant:bleed", "weak:holy"],
    behavior: "balanced",
    baseStats: {
      maxHp: 100,
      maxMp: 10,
      speed: 20,
      damage: 14,
      luck: 0,
      critChance: 10,
      critDamage: 1.6,
    },
    loot: {
      gold: [20, 35],
      xp: [40, 60],
    },
  },
  {
    id: "ghost_apparition",
    name: "Aparição Fantasma",
    role: "Mago Espiritual",
    traits: ["immune:bleed", "weak:arcane", "resistant:poison"],
    behavior: "caster",
    baseStats: {
      maxHp: 75,
      maxMp: 120,
      speed: 28,
      damage: 16,
      luck: 5,
      critChance: 15,
      critDamage: 1.8,
    },
    loot: {
      gold: [30, 45],
      xp: [60, 90],
    },
  },
  {
    id: "orc_berserker",
    name: "Orc Berserker",
    role: "DPS Físico",
    traits: ["weak:stun", "resistant:bleed"],
    behavior: "berserker",
    baseStats: {
      maxHp: 140,
      maxMp: 40,
      speed: 22,
      damage: 22,
      luck: 3,
      critChance: 12,
      critDamage: 1.7,
    },
    loot: {
      gold: [40, 60],
      xp: [80, 120],
    },
  },
];

/**
 * ================================
 * ⚔️ Funções auxiliares
 * ================================
 */

/** Retorna uma cópia aleatória de inimigo (template puro) */
export function getRandomEnemyTemplate() {
  return JSON.parse(
    JSON.stringify(enemies[Math.floor(Math.random() * enemies.length)])
  );
}

/**
 * Retorna modificadores de dano com base em traits
 * @param {Object} enemy - entidade inimiga
 * @param {string} status - ex: "bleed", "poison", "stun", "fire"
 * @returns {number} multiplicador (ex: 1.5 se fraco, 0.5 se resistente)
 */
export function getTraitModifier(enemy, status) {
  const traits = enemy.traits || [];
  if (traits.some((t) => t === `immune:${status}`)) return 0;
  if (traits.some((t) => t === `resistant:${status}`)) return 0.5;
  if (traits.some((t) => t === `weak:${status}`)) return 1.5;
  return 1;
}

/**
 * Gera inimigos escalados por nível com base no jogador
 * (chamado no sistema de batalha)
 */
export function generateEnemyByLevel(level) {
  const base = getRandomEnemyTemplate();
  const scale = 1 + level * 0.2;

  base.baseStats.maxHp = Math.round(base.baseStats.maxHp * scale);
  base.baseStats.damage = Math.round(base.baseStats.damage * scale);
  base.baseStats.speed = Math.round(base.baseStats.speed * (1 + level * 0.05));
  return base;
}
