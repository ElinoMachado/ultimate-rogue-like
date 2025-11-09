// src/core/effects.js
import { effectsById } from "../data/effects.js";
import { playSound } from "../ui/sound.js";
import { showFloatingText } from "../ui/render.js";
import { wait } from "./utils.js";

/**
 * Garante que a entidade possui o array de efeitos.
 */
function ensureEffectsArray(entity) {
  if (!entity.effects) entity.effects = [];
}

/**
 * Aplica um efeito em uma entidade.
 *
 * options:
 *  - duration: turnos
 *  - potency: intensidade (escala o comportamento base)
 *  - source: quem aplicou (id do caster, skill, etc.)
 */
export function applyEffect(entity, effectId, options = {}) {
  ensureEffectsArray(entity);

  const cfg = effectsById[effectId];
  if (!cfg) {
    console.warn("[effects] id desconhecido:", effectId);
    return;
  }

  const duration = options.duration ?? 1;
  const potency = options.potency ?? 1;

  const existing = entity.effects.find((e) => e.id === effectId);
  if (existing) {
    existing.duration = Math.max(existing.duration, duration);
    existing.potency = Math.max(existing.potency, potency);
  } else {
    entity.effects.push({
      id: effectId,
      duration,
      potency,
      source: options.source ?? null,
    });
  }

  if (cfg.ui?.hudLabel) {
    showFloatingText(cfg.ui.hudLabel, "status");
  }
  if (cfg.sfx?.apply) {
    playSound(cfg.sfx.apply);
  }
}

/**
 * Verifica se uma entidade tem um efeito ativo.
 */
export function hasEffect(entity, effectId) {
  if (!entity?.effects) return false;
  return entity.effects.some((e) => e.id === effectId && e.duration > 0);
}

/**
 * Tica todos os efeitos no INÍCIO do turno da entidade.
 * Retorna true se a entidade morreu por efeito de status.
 */
export async function tickEffectsOnTurnStart(entity) {
  if (!entity?.effects || !entity.effects.length) return false;

  let died = false;

  for (const eff of entity.effects) {
    const cfg = effectsById[eff.id];
    if (!cfg) continue;

    if (cfg.type === "dot") {
      const behavior = cfg.behavior || {};
      const percent = behavior.hpPercentPerTurn ?? 0;
      const flat = behavior.flatDamagePerTurn ?? 0;
      const min = behavior.minDamage ?? 0;
      const pot = eff.potency || 1;

      const baseHp = entity.maxHp ?? entity.hp ?? 1;

      let dmg = 0;
      if (percent > 0) dmg += Math.floor(baseHp * percent * pot);
      if (flat > 0) dmg += flat * pot;
      if (dmg < min) dmg = min;

      if (dmg > 0) {
        entity.hp = Math.max(0, entity.hp - dmg);
        showFloatingText(`-${dmg} (${cfg.ui?.hudLabel || cfg.name})`, "status");
        if (cfg.sfx?.tick) playSound(cfg.sfx.tick);
        await wait(150);
        if (entity.hp <= 0) {
          entity.alive = false;
          died = true;
        }
      }
    }

    // Futuro: buffs contínuos (cura, escudo, etc.) podem agir aqui.
  }

  // Reduz duração de todos os efeitos
  entity.effects.forEach((eff) => (eff.duration -= 1));
  entity.effects = entity.effects.filter((eff) => eff.duration > 0);

  return died;
}

/**
 * Modificadores ofensivos agregados de buffs.
 */
export function getOffensiveModifiers(entity) {
  if (!entity?.effects) {
    return {
      damageMultiplier: 1,
      critChanceBonus: 0,
    };
  }

  let damageMultiplier = 1;
  let critChanceBonus = 0;

  for (const eff of entity.effects) {
    const cfg = effectsById[eff.id];
    if (!cfg || cfg.type !== "buff") continue;
    const pot = eff.potency || 1;
    const behavior = cfg.behavior || {};

    if (behavior.damageMultiplier) {
      damageMultiplier += behavior.damageMultiplier * pot;
    }
    if (behavior.critChanceBonus) {
      critChanceBonus += behavior.critChanceBonus * pot;
    }
  }

  return { damageMultiplier, critChanceBonus };
}

/**
 * Helper para HUD: retorna lista amigável de efeitos ativos.
 */
export function getEffectsForHUD(entity) {
  if (!entity?.effects || !entity.effects.length) return [];

  return entity.effects.map((eff) => {
    const cfg = effectsById[eff.id];
    return {
      id: eff.id,
      name: cfg?.name ?? eff.id,
      icon: cfg?.ui?.icon ?? "❔",
      label: cfg?.ui?.hudLabel ?? cfg?.name ?? eff.id,
      duration: eff.duration,
      type: cfg?.type ?? "status",
    };
  });
}
