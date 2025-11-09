// src/core/utils.js

/**
 * ================================
 * 🎲 Random, Chance, Delay e Math Helpers
 * ================================
 */
export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function chance(prob) {
  return Math.random() < prob;
}

export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export function lerp(a, b, t) {
  return a + (b - a) * t;
}

/**
 * ================================
 * ⚗️ Sistema de Resistências Elementais
 * ================================
 * Cada entidade pode ter uma tabela de resistências de 0.0 (imune) até 2.0 (dupla fraqueza)
 * Exemplo: { fire: 1.5, ice: 0.8, poison: 1.0 }
 */
export function getElementMultiplier(target, element) {
  if (!element) return 1;
  const resistances = target.resistances ?? {};
  return resistances[element] ?? 1.0;
}

/**
 * ================================
 * 💀 Sistema de Status (Buffs e Debuffs)
 * ================================
 * Cada status tem:
 *  - name: identificação
 *  - label: nome visível
 *  - turns: duração em turnos
 *  - effect: função que executa no tick
 *  - color: para feedback visual
 */
export function applyStatusTo(target, statusName, turns = 3) {
  const statusData = STATUS_LIBRARY[statusName];
  if (!statusData) return;

  const existing = target.status.find((s) => s.name === statusName);
  if (existing) {
    existing.turns = Math.max(existing.turns, turns);
    return;
  }

  const instance = {
    ...statusData,
    turns,
  };
  target.status.push(instance);
}

/**
 * Executa os efeitos de status a cada turno.
 */
export async function runStatusTicks(entity, showFloatingText, playSound) {
  if (!entity.status?.length) return;

  const toRemove = [];

  for (const s of entity.status) {
    s.turns--;

    if (s.effect) {
      const result = s.effect(entity);
      if (result && showFloatingText) {
        showFloatingText(result.text, result.type);
      }
      if (result?.sound && playSound) {
        playSound(result.sound);
      }
    }

    if (s.turns <= 0) {
      toRemove.push(s);
      showFloatingText?.(`${s.label} dissipou`, "info");
    }

    await wait(150);
  }

  entity.status = entity.status.filter((s) => !toRemove.includes(s));
}

/**
 * ================================
 * 📚 Biblioteca de Status
 * ================================
 */
export const STATUS_LIBRARY = {
  bleed: {
    name: "bleed",
    label: "Sangramento",
    color: "#ff4d4d",
    effect: (entity) => {
      const dmg = Math.round(entity.maxHp * 0.05);
      entity.takeDamage?.(dmg);
      return { text: `🩸 -${dmg} HP`, type: "damage", sound: "bleed.mp3" };
    },
  },
  poison: {
    name: "poison",
    label: "Envenenado",
    color: "#8cff66",
    effect: (entity) => {
      const dmg = Math.round(entity.maxHp * 0.04);
      entity.takeDamage?.(dmg);
      return { text: `☠️ -${dmg} HP`, type: "damage", sound: "poison.mp3" };
    },
  },
  burn: {
    name: "burn",
    label: "Queimando",
    color: "#ff6f00",
    effect: (entity) => {
      const dmg = Math.round(entity.maxHp * 0.06);
      entity.takeDamage?.(dmg);
      return { text: `🔥 -${dmg} HP`, type: "damage", sound: "burn.mp3" };
    },
  },
  freeze: {
    name: "freeze",
    label: "Congelado",
    color: "#66ccff",
    effect: (entity) => {
      if (!entity.hasStatus("freeze")) return;
      entity.stunned = true;
      return { text: `❄️ Congelado!`, type: "status", sound: "freeze.mp3" };
    },
  },
  shock: {
    name: "shock",
    label: "Eletrizado",
    color: "#ffff66",
    effect: (entity) => {
      const dmg = Math.round(entity.maxHp * 0.03);
      entity.takeDamage?.(dmg);
      if (chance(0.25)) entity.stunned = true;
      return { text: `⚡ -${dmg} HP`, type: "damage", sound: "shock.mp3" };
    },
  },
  curse: {
    name: "curse",
    label: "Amaldiçoado",
    color: "#aa00ff",
    effect: (entity) => {
      const dmg = Math.round(entity.maxHp * 0.07);
      entity.takeDamage?.(dmg);
      return { text: `☠️ -${dmg} HP`, type: "damage", sound: "curse.mp3" };
    },
  },
  stun: {
    name: "stun",
    label: "Atordoado",
    color: "#bb33ff",
    effect: (entity) => {
      entity.stunned = true;
      return { text: `💫 Atordoado!`, type: "status", sound: "stun.mp3" };
    },
  },
  regen: {
    name: "regen",
    label: "Regeneração",
    color: "#33ff99",
    effect: (entity) => {
      const heal = Math.round(entity.maxHp * 0.05);
      entity.heal?.(heal);
      return { text: `✨ +${heal} HP`, type: "info", sound: "heal.mp3" };
    },
  },
};

/**
 * ================================
 * ⚔️ Afinidades Elementais
 * ================================
 * Define multiplicadores para ataques de acordo com o tipo do dano.
 */
export function getElementalModifier(attacker, target, element) {
  const mult = getElementMultiplier(target, element);
  if (mult > 1) return mult; // fraqueza
  if (mult < 1) return mult; // resistência
  return 1;
}

/**
 * ================================
 * 🩸 Funções auxiliares para Entidades
 * ================================
 */
export function hasStatus(entity, name) {
  return entity.status?.some((s) => s.name === name);
}

export function removeStatus(entity, name) {
  entity.status = entity.status?.filter((s) => s.name !== name);
}

export function clearAllStatus(entity) {
  entity.status = [];
}

/**
 * ================================
 * 🌈 Utilidades extras
 * ================================
 */
export function formatPercent(value) {
  return `${(value * 100).toFixed(0)}%`;
}

export function randFrom(array) {
  return array[Math.floor(Math.random() * array.length)];
}
