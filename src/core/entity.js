// src/core/entity.js

/**
 * Representa qualquer unidade do jogo (jogador ou inimigo).
 * Compatível com o uso atual em main.js e battle.js.
 */
export class Entity {
  constructor(template) {
    const base = template.baseStats ?? {};

    // Identificação
    this.id =
      template.id ||
      `ent_${Math.random().toString(36).slice(2)}_${Date.now().toString(36)}`;
    this.name = template.name ?? "???";

    // Atributos base atuais (visíveis em jogo)
    this.maxHp = base.maxHp ?? 100;
    this.hp = base.maxHp ?? 100;
    this.maxMp = base.maxMp ?? 50;
    this.mp = base.maxMp ?? 50;
    this.speed = base.speed ?? 30;
    this.damage = base.damage ?? 10;
    this.luck = base.luck ?? 0;
    this.critChance = base.critChance ?? 5;
    this.critDamage = base.critDamage ?? 1.5;

    // Baseline dinâmica (acumula level ups, passivas etc. sem multiplicadores de Poder)
    this.baseDynamic = {
      maxHp: this.maxHp,
      maxMp: this.maxMp,
      speed: this.speed,
      damage: this.damage,
    };

    // Estruturas dinâmicas
    this.skills = [];
    this.status = [];
    this.items = [];
    this.alive = true;

    // Buffs (os multiplicadores de Poder são aplicados via recalcFromBuffs)
    this.buffs = {
      poder: { hp: 0, dmg: 0, speed: 0 },
      arcana: 0,
      riqueza: { bonus: 0 },
    };

    // Passivas
    this.passives = [];
    this.passiveRegenBonusHp = 0;
    this.passiveRegenBonusMp = 0;
    this.manaCostMultiplier = 1.0;
    this.startGaugeBonus = 0;

    // Progressão
    this.xp = 0;
    this.gold = 0;
    this.level = 1;
    this.statPoints = 0;
    this.lives = 2; // vidas iniciais

    // Batalha
    this.speedGauge = 0;
    this.arcanaMultiplier = 1.0;
    this.wealthBonus = 0;
  }

  /**
   * Recalcula atributos a partir da baseline + multiplicadores de Poder.
   * Mantém a proporção de HP/MP atuais ao trocar max.
   */
  recalcFromBuffs() {
    const poder = this.buffs?.poder ?? { hp: 0, dmg: 0, speed: 0 };

    const prevMaxHp = this.maxHp;
    const prevMaxMp = this.maxMp;
    const hpPct = prevMaxHp > 0 ? this.hp / prevMaxHp : 1;
    const mpPct = prevMaxMp > 0 ? this.mp / prevMaxMp : 1;

    this.maxHp = Math.max(
      1,
      Math.round(this.baseDynamic.maxHp * (1 + (poder.hp || 0)))
    );
    this.maxMp = Math.max(
      0,
      Math.round(this.baseDynamic.maxMp * 1) // Poder não altera MP
    );
    this.speed = Math.max(
      1,
      Math.round(this.baseDynamic.speed * (1 + (poder.speed || 0)))
    );
    this.damage = Math.max(
      0,
      Math.round(this.baseDynamic.damage * (1 + (poder.dmg || 0)))
    );

    // preserva proporção de HP/MP
    this.hp = Math.min(this.maxHp, Math.max(1, Math.round(this.maxHp * hpPct)));
    this.mp = Math.min(this.maxMp, Math.max(0, Math.round(this.maxMp * mpPct)));
  }

  // Getters sem recalc/multiplicação (evita contagem dupla)
  getFinalSpeed() {
    return Math.max(1, Math.floor(this.speed));
  }
  getFinalMaxHp() {
    return Math.max(1, Math.floor(this.maxHp));
  }
  getFinalDamage() {
    return Math.max(0, Math.floor(this.damage));
  }
}
