// src/utils/rarity.js

// Tabela de probabilidade de raridade por nível de Arcana.
// Os valores são frações (0–1) e somam 1 em cada nível.
const ARCANA_RARITY_TABLE = {
  1: { common: 0.5, rare: 0.4, super: 0.05, legendary: 0.04, mythic: 0.01 },
  2: { common: 0.45, rare: 0.35, super: 0.1, legendary: 0.08, mythic: 0.02 },
  3: { common: 0.3, rare: 0.4, super: 0.15, legendary: 0.1, mythic: 0.05 },
  4: { common: 0.1, rare: 0.2, super: 0.45, legendary: 0.15, mythic: 0.1 },
  5: { common: 0.05, rare: 0.1, super: 0.25, legendary: 0.4, mythic: 0.2 },
};

/**
 * Calcula a raridade com base no nível de Arcana e Sorte.
 * Mantém exatamente os nomes usados em skills.js:
 *   common | rare | super | legendary | mythic
 */
export function getSkillRarityFromArcana(level, luck = 0) {
  const table = ARCANA_RARITY_TABLE[level] ?? ARCANA_RARITY_TABLE[3];

  // 🎲 roll base (0–1)
  let roll = Math.random();

  // 🍀 Ajuste de sorte:
  // cada 10 pontos de sorte deslocam o roll +3%, máximo +30%.
  const luckBoost = Math.min(0.3, (luck / 10) * 0.03);
  roll = Math.min(1, roll + luckBoost);

  let acc = 0;
  for (const [rarity, chance] of Object.entries(table)) {
    acc += chance;
    if (roll <= acc) return rarity;
  }

  // fallback seguro
  return "mythic";
}
