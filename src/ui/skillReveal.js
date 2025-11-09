import { playSound } from "./sound.js";

/**
 * ================================
 * ✨ Animação de Revelação de Habilidade
 * ================================
 * Exibe a carta de uma skill com estilo e som condizente à raridade.
 */
export function revealSkillCard(skill, rarity, onConfirm) {
  const container = document.getElementById("app");

  // 🎨 Paleta de raridades
  const rarityStyle = {
    common: {
      color: "#bbb",
      glow: "0 0 12px #888",
      sound: "rarity-common.mp3",
    },
    rare: {
      color: "#3fa9f5",
      glow: "0 0 16px #3fa9f5",
      sound: "rarity-rare.mp3",
    },
    super: {
      color: "#7b61ff",
      glow: "0 0 20px #7b61ff",
      sound: "rarity-super.mp3",
    },
    legendary: {
      color: "#d953ff",
      glow: "0 0 22px #d953ff",
      sound: "rarity-legendary.mp3",
    },
    mythic: {
      color: "#ffcc00",
      glow: "0 0 25px #ffcc00",
      sound: "rarity-mythic.mp3",
    },
  };

  const r = rarityStyle[rarity] ?? rarityStyle.common;

  // 🧱 Estrutura da tela
  container.innerHTML = `
    <header class="game-header"><h1>RPG Arena</h1></header>
    <main class="screen-center skill-reveal" style="animation: fadeIn 0.5s ease;">
      <h2 class="screen-title">Nova Habilidade</h2>

      <div class="card reveal-card" style="border: 3px solid ${
        r.color
      }; box-shadow: ${r.glow}">
        <div class="card-inner flipped">
          <div class="card-back" style="background:${r.color}22;">
            <h2 style="color:${r.color}; margin-bottom:8px;">${skill.name}</h2>
            <p><strong>Raridade:</strong> ${rarity.toUpperCase()}</p>
            <p><strong>Dano:</strong> ${skill.damage}</p>
            <p><strong>Mana:</strong> ${skill.manaCost}</p>
            <p><strong>Cooldown:</strong> ${skill.cooldown} turno(s)</p>
            <p><strong>Efeito:</strong> ${skill.effect}</p>
          </div>
        </div>
      </div>

      <button id="btn-proceed" class="btn-primary">Continuar (Batalha)</button>
    </main>
  `;

  // ✨ Som de raridade
  playSound(r.sound);

  // 🎬 Animação de aparição do botão
  const btn = container.querySelector("#btn-proceed");
  btn.style.opacity = "0";
  btn.style.transition = "opacity 0.6s ease, transform 0.4s ease";
  setTimeout(() => {
    btn.style.opacity = "1";
    btn.style.transform = "translateY(-4px)";
  }, 800);

  // 🖱️ Ação ao prosseguir (fade APENAS no wrapper interno, não no #app!)
  btn.addEventListener("click", () => {
    btn.classList.add("clicked");
    playSound("click.mp3");

    const screen = container.querySelector(".skill-reveal");
    if (screen) {
      screen.style.animation = "fadeOut 0.5s forwards";
    }

    // Espera o fade terminar e só então chama onConfirm
    setTimeout(() => {
      if (typeof onConfirm === "function") onConfirm();
    }, 520);
  });
}

/**
 * ================================
 * 🎨 Efeitos visuais extras
 * ================================
 */
const style = document.createElement("style");
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; transform: scale(0.97); }
    to { opacity: 1; transform: scale(1); }
  }

  @keyframes fadeOut {
    from { opacity: 1; transform: scale(1); }
    to { opacity: 0; transform: scale(1.03); }
  }

  .skill-reveal h2.screen-title {
    color: #fff;
    text-shadow: 0 0 12px rgba(255,255,255,0.2);
  }

  .reveal-card {
    animation: cardEnter 0.8s ease;
  }

  @keyframes cardEnter {
    from { opacity: 0; transform: translateY(30px) rotateY(-10deg); }
    to { opacity: 1; transform: translateY(0) rotateY(0); }
  }

  button#btn-proceed.clicked {
    filter: brightness(1.3);
    transform: scale(0.95);
  }
`;
document.head.appendChild(style);
