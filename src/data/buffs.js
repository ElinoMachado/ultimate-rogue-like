// src/data/buffs.js
export const buffs = {
  riqueza: [
    {
      level: 1,
      label: "Riqueza Nível 1",
      effect: "-40% XP e Ouro",
      bonus: -0.4,
    },
    {
      level: 2,
      label: "Riqueza Nível 2",
      effect: "-20% XP e Ouro",
      bonus: -0.2,
    },
    {
      level: 3,
      label: "Riqueza Nível 3",
      effect: "XP e Ouro padrão",
      bonus: 0,
    },
    {
      level: 4,
      label: "Riqueza Nível 4",
      effect: "+50% XP e Ouro",
      bonus: 0.5,
    },
    {
      level: 5,
      label: "Riqueza Nível 5",
      effect: "+100% XP e Ouro",
      bonus: 1.0,
    },
  ],

  arcana: [
    {
      level: 1,
      label: "Arcana Nível 1",
      effect: "-40% poder mágico",
      bonus: -0.4,
    },
    {
      level: 2,
      label: "Arcana Nível 2",
      effect: "-20% poder mágico",
      bonus: -0.2,
    },
    {
      level: 3,
      label: "Arcana Nível 3",
      effect: "Poder mágico neutro",
      bonus: 0,
    },
    {
      level: 4,
      label: "Arcana Nível 4",
      effect: "+100% poder mágico",
      bonus: 1.0,
    },
    {
      level: 5,
      label: "Arcana Nível 5",
      effect: "+200% poder mágico",
      bonus: 2.0,
    },
  ],

  poder: [
    {
      level: 1,
      label: "Poder Nível 1",
      effect: "-50% dano, -35% vida, -25% velocidade",
    },
    {
      level: 2,
      label: "Poder Nível 2",
      effect: "-25% dano, -15% vida, -10% velocidade",
    },
    { level: 3, label: "Poder Nível 3", effect: "Sem bônus ou penalidades" },
    {
      level: 4,
      label: "Poder Nível 4",
      effect: "+150% dano, +100% vida, +50% velocidade",
    },
    {
      level: 5,
      label: "Poder Nível 5",
      effect: "+300% dano, +200% vida, +100% velocidade",
    },
  ],
};
