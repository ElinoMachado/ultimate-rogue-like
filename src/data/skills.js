// src/data/skills.js

export const skills = {
  warrior: [
    {
      id: "warrior_strike",
      baseName: "Golpe Brutal",
      type: "fisico",
      rarities: {
        common: {
          damage: 10,
          manaCost: 20,
          cooldown: 3,
          effect: "Nenhum",
          effects: [],
        },
        rare: {
          damage: 15,
          manaCost: 18,
          cooldown: 3,
          effect: "Atordoa por 1 turno (15%)",
          effects: [{ id: "stun", chance: 0.15, duration: 1 }],
        },
        super: {
          damage: 22,
          manaCost: 16,
          cooldown: 2,
          effect: "Atordoa por 1 turno (35%)",
          effects: [{ id: "stun", chance: 0.35, duration: 1 }],
        },
        legendary: {
          damage: 30,
          manaCost: 14,
          cooldown: 2,
          effect: "Grande chance de atordoar e reduzir defesa",
          effects: [
            { id: "stun", chance: 0.6, duration: 1 },
            // futuro: debuff de defesa, ex: { id: "defense_down", chance: 0.5, duration: 2 }
          ],
        },
        mythic: {
          damage: 42,
          manaCost: 10,
          cooldown: 1,
          effect: "Atordoa e aumenta seu dano por 2 turnos",
          effects: [
            { id: "stun", chance: 1.0, duration: 1 },
            { id: "buff_damage_up", chance: 1.0, duration: 2, potency: 1 },
          ],
        },
      },
    },
    {
      id: "warrior_cleave",
      baseName: "Corte Giratório",
      type: "fisico",
      rarities: {
        common: {
          damage: 8,
          manaCost: 18,
          cooldown: 3,
          effect: "Atinge 2 inimigos (quando houver)",
          effects: [],
        },
        rare: {
          damage: 13,
          manaCost: 16,
          cooldown: 3,
          effect: "Atinge todos os inimigos (leve)",
          effects: [],
        },
        super: {
          damage: 18,
          manaCost: 14,
          cooldown: 2,
          effect: "Atinge todos os inimigos",
          effects: [],
        },
        legendary: {
          damage: 26,
          manaCost: 12,
          cooldown: 2,
          effect: "Atinge todos e aplica sangramento leve",
          effects: [{ id: "bleed_light", chance: 0.6, duration: 3 }],
        },
        mythic: {
          damage: 36,
          manaCost: 10,
          cooldown: 1,
          effect: "Atinge todos com grande sangramento",
          effects: [{ id: "bleed_heavy", chance: 0.8, duration: 4 }],
        },
      },
    },
  ],

  mage: [
    {
      id: "mage_fireball",
      baseName: "Bola de Fogo",
      type: "magico",
      rarities: {
        common: {
          damage: 10,
          manaCost: 50,
          cooldown: 3,
          effect: "Nenhum",
          effects: [],
        },
        rare: {
          damage: 15,
          manaCost: 40,
          cooldown: 3,
          effect: "Nenhum",
          effects: [],
        },
        super: {
          damage: 20,
          manaCost: 30,
          cooldown: 2,
          effect: "Nenhum",
          effects: [],
        },
        legendary: {
          damage: 30,
          manaCost: 20,
          cooldown: 2,
          effect: "Queimadura 3/t por 4 turnos",
          effects: [{ id: "burn_light", chance: 1.0, duration: 4, potency: 1 }],
        },
        mythic: {
          damage: 50,
          manaCost: 5,
          cooldown: 1,
          effect: "Queimadura 6/t por 4 turnos em área",
          effects: [{ id: "burn_heavy", chance: 1.0, duration: 4, potency: 1 }],
        },
      },
    },
    {
      id: "mage_ice_lance",
      baseName: "Lança Gélida",
      type: "magico",
      rarities: {
        common: {
          damage: 9,
          manaCost: 35,
          cooldown: 3,
          effect: "Nenhum",
          effects: [],
        },
        rare: {
          damage: 14,
          manaCost: 30,
          cooldown: 3,
          effect: "Rápida, pequena chance de reduzir velocidade",
          effects: [
            // futuro: slow leve, ex: { id: "slow_light", chance: 0.25, duration: 2 }
          ],
        },
        super: {
          damage: 19,
          manaCost: 28,
          cooldown: 2,
          effect: "Boa chance de reduzir velocidade",
          effects: [
            // futuro: slow moderado
          ],
        },
        legendary: {
          damage: 25,
          manaCost: 24,
          cooldown: 2,
          effect: "Reduz bastante a velocidade inimiga",
          effects: [
            // futuro: slow forte
          ],
        },
        mythic: {
          damage: 34,
          manaCost: 18,
          cooldown: 1,
          effect: "Congela temporariamente inimigos",
          effects: [
            // futuro: stun + slow
          ],
        },
      },
    },
  ],

  rogue: [
    {
      id: "rogue_shadow_strike",
      baseName: "Ataque Sombrio",
      type: "agilidade",
      rarities: {
        common: {
          damage: 8,
          manaCost: 15,
          cooldown: 3,
          effect: "Nenhum",
          effects: [],
        },
        rare: {
          damage: 14,
          manaCost: 12,
          cooldown: 3,
          effect: "Dano dobrado em crítico",
          effects: [],
        },
        super: {
          damage: 20,
          manaCost: 10,
          cooldown: 2,
          effect: "Alta chance de crítico",
          effects: [],
        },
        legendary: {
          damage: 28,
          manaCost: 8,
          cooldown: 2,
          effect: "Alto crítico e sangramento 2/t",
          effects: [
            { id: "bleed_light", chance: 0.9, duration: 3, potency: 1 },
          ],
        },
        mythic: {
          damage: 38,
          manaCost: 6,
          cooldown: 1,
          effect: "Crítico monstruoso e sangramento 4/t",
          effects: [
            { id: "bleed_heavy", chance: 1.0, duration: 4, potency: 1 },
          ],
        },
      },
    },
    {
      id: "rogue_rend",
      baseName: "Dilacerar",
      type: "agilidade",
      rarities: {
        common: {
          damage: 7,
          manaCost: 12,
          cooldown: 3,
          effect: "Sangramento leve",
          effects: [
            { id: "bleed_light", chance: 1.0, duration: 3, potency: 1 },
          ],
        },
        rare: {
          damage: 11,
          manaCost: 10,
          cooldown: 3,
          effect: "Sangramento moderado",
          effects: [
            { id: "bleed_light", chance: 1.0, duration: 4, potency: 1.2 },
          ],
        },
        super: {
          damage: 17,
          manaCost: 9,
          cooldown: 2,
          effect: "Sangramento forte",
          effects: [
            { id: "bleed_heavy", chance: 1.0, duration: 3, potency: 1 },
          ],
        },
        legendary: {
          damage: 24,
          manaCost: 8,
          cooldown: 2,
          effect: "Sangramento muito forte",
          effects: [
            { id: "bleed_heavy", chance: 1.0, duration: 4, potency: 1.2 },
          ],
        },
        mythic: {
          damage: 32,
          manaCost: 6,
          cooldown: 1,
          effect: "Sangramento extremo, alta chance de crítico",
          effects: [
            { id: "bleed_heavy", chance: 1.0, duration: 4, potency: 1.5 },
            // futuro: buff_crit_up se quiser
          ],
        },
      },
    },
  ],

  global: [
    {
      id: "global_arcane_blast",
      baseName: "Explosão Arcana",
      type: "magico",
      rarities: {
        common: {
          damage: 9,
          manaCost: 30,
          cooldown: 3,
          effect: "Nenhum",
          effects: [],
        },
        rare: {
          damage: 14,
          manaCost: 26,
          cooldown: 3,
          effect: "Escala levemente com sua mana máxima",
          effects: [],
        },
        super: {
          damage: 20,
          manaCost: 24,
          cooldown: 2,
          effect: "Escala bem com sua mana máxima",
          effects: [],
        },
        legendary: {
          damage: 27,
          manaCost: 22,
          cooldown: 2,
          effect: "Ignora parte da defesa",
          effects: [],
        },
        mythic: {
          damage: 36,
          manaCost: 20,
          cooldown: 1,
          effect: "Ignora grande parte da defesa inimiga",
          effects: [],
        },
      },
    },
    {
      id: "global_smite",
      baseName: "Golpe Divino",
      type: "hibrido",
      rarities: {
        common: {
          damage: 10,
          manaCost: 25,
          cooldown: 3,
          effect: "Nenhum",
          effects: [],
        },
        rare: {
          damage: 15,
          manaCost: 22,
          cooldown: 3,
          effect: "Bônus se estiver com pouca vida",
          effects: [],
        },
        super: {
          damage: 22,
          manaCost: 20,
          cooldown: 2,
          effect: "Grande bônus com pouca vida",
          effects: [],
        },
        legendary: {
          damage: 30,
          manaCost: 18,
          cooldown: 2,
          effect: "Bônus e pequena cura",
          effects: [],
        },
        mythic: {
          damage: 40,
          manaCost: 15,
          cooldown: 1,
          effect: "Bônus massivo e boa cura",
          effects: [],
        },
      },
    },
  ],
};
