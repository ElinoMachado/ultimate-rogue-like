// src/data/classes.js
export const classes = [
  {
    id: "warrior",
    name: "Guerreiro",
    role: "Frontline",
    description: "Tanque resistente com alto dano físico e boa sobrevivência.",
    baseStats: {
      maxHp: 130,
      maxMp: 40,
      speed: 30,
      damage: 15,
      luck: 5,
      critChance: 10,
      critDamage: 1.5,
    },
  },
  {
    id: "mage",
    name: "Mago",
    role: "DPS Mágico",
    description:
      "Frágil, mas com enorme poder arcano e sinergia com habilidades raras.",
    baseStats: {
      maxHp: 80,
      maxMp: 130,
      speed: 35,
      damage: 11,
      luck: 10,
      critChance: 15,
      critDamage: 1.7,
    },
  },
  {
    id: "rogue",
    name: "Ladino",
    role: "Crítico / Sorte",
    description:
      "Ágil, crítico alto e sorte elevada para drops e efeitos secundários.",
    baseStats: {
      maxHp: 95,
      maxMp: 70,
      speed: 45,
      damage: 13,
      luck: 18,
      critChance: 25,
      critDamage: 2.0,
    },
  },
];
