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

    // Atributos base
    this.maxHp = base.maxHp ?? 100;
    this.hp = base.maxHp ?? 100;
    this.maxMp = base.maxMp ?? 50;
    this.mp = base.maxMp ?? 50;
    this.speed = base.speed ?? 30;
    this.damage = base.damage ?? 10;
    this.luck = base.luck ?? 0;
    this.critChance = base.critChance ?? 5;
    this.critDamage = base.critDamage ?? 1.5;

    // 🔒 Snapshot dos atributos puros (para reaplicar buffs sem acumular)
    this.base = {
      maxHp: this.maxHp,
      maxMp: this.maxMp,
      speed: this.speed,
      damage: this.damage,
    };

    // Estruturas dinâmicas
    this.skills = [];
    this.status = []; // legado (efeitos antigos)
    this.items = [];
    this.alive = true;

    // Buffs (referência; atributos são ajustados em applyBuffsToPlayer)
    this.buffs = {
      poder: { hp: 0, dmg: 0, speed: 0 },
      arcana: 0,
      riqueza: { bonus: 0 },
    };

    // Progressão
    this.xp = 0;
    this.gold = 0;
    this.level = 1;
    this.statPoints = 0;

    // Batalha
    this.speedGauge = 0;
    this.arcanaMultiplier = 1.0;
    this.wealthBonus = 0;

    // 🧬 Passivas / QoL
    this.manaCostMult = 1.0;
    this.regenHpBonus = 0; // adicional ao 5% base
    this.regenMpBonus = 0; // adicional ao 5% base
    this.lives = 2; // vidas iniciais
  }

  // Getters não re-aplicam buff — evitam contagem dupla
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
