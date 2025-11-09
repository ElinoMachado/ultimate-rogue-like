// src/ui/sound.js

/**
 * ================================
 * 🎧 Sistema de Áudio Centralizado
 * ================================
 * Gerencia sons de interface, efeitos e música de fundo.
 */

const audioState = {
  bgm: null,
  channels: new Map(),
  masterVolume: 0.7,
  muted: false,
};

/**
 * 🔊 Reproduz um som (efeito curto ou evento de interface)
 */
export function playSound(name, volume = 1.0, channel = "sfx") {
  if (audioState.muted) return;

  // Evita sobreposição de sons idênticos em loop rápido
  const key = `${channel}:${name}`;
  const last = audioState.channels.get(key);
  if (last && !last.paused) {
    last.currentTime = 0;
    return last.play().catch(() => {});
  }

  const audio = new Audio(`./assets/sounds/${name}`);
  audio.volume = audioState.masterVolume * volume;
  audio.play().catch(() => {});

  // Registra canal
  audioState.channels.set(key, audio);
  audio.addEventListener("ended", () => {
    audioState.channels.delete(key);
  });

  return audio;
}

/**
 * 🎵 Inicia ou troca a música de fundo (loop automático)
 */
export function playBGM(name, volume = 0.6, loop = true) {
  if (audioState.bgm && audioState.bgm.src.includes(name)) return; // já está tocando
  stopBGM();

  const bgm = new Audio(`./assets/sounds/${name}`);
  bgm.loop = loop;
  bgm.volume = audioState.masterVolume * volume;
  bgm.play().catch(() => {});

  audioState.bgm = bgm;
  return bgm;
}

/**
 * ⏹️ Para a música de fundo
 */
export function stopBGM() {
  if (audioState.bgm) {
    audioState.bgm.pause();
    audioState.bgm.currentTime = 0;
    audioState.bgm = null;
  }
}

/**
 * 🔇 Liga / desliga som global
 */
export function toggleMute() {
  audioState.muted = !audioState.muted;
  if (audioState.bgm) audioState.bgm.muted = audioState.muted;

  // Silencia todos os canais ativos
  audioState.channels.forEach((audio) => {
    audio.muted = audioState.muted;
  });
}

/**
 * 🔈 Ajusta volume global (0.0 a 1.0)
 */
export function setMasterVolume(value) {
  audioState.masterVolume = Math.max(0, Math.min(1, value));
  if (audioState.bgm) audioState.bgm.volume = audioState.masterVolume * 0.6;

  audioState.channels.forEach((audio) => {
    audio.volume = audioState.masterVolume;
  });
}

/**
 * 🎛️ HUD opcional de controle de áudio
 * (Pode ser ativado no menu de opções ou debug)
 */
export function renderAudioHUD() {
  let hud = document.getElementById("audio-hud");
  if (!hud) {
    hud = document.createElement("div");
    hud.id = "audio-hud";
    hud.innerHTML = `
      <div class="audio-controls">
        <button id="btn-mute">🔇</button>
        <input id="slider-volume" type="range" min="0" max="1" step="0.05" value="${audioState.masterVolume}">
      </div>
    `;
    document.body.appendChild(hud);

    const btn = hud.querySelector("#btn-mute");
    const slider = hud.querySelector("#slider-volume");

    btn.addEventListener("click", () => {
      toggleMute();
      btn.textContent = audioState.muted ? "🔈" : "🔇";
    });

    slider.addEventListener("input", (e) => {
      setMasterVolume(parseFloat(e.target.value));
    });
  }
}

/**
 * ================================
 * 🎨 Estilo do HUD de áudio
 * ================================
 */
const style = document.createElement("style");
style.textContent = `
  #audio-hud {
    position: fixed;
    bottom: 10px;
    right: 14px;
    z-index: 3000;
    background: rgba(15, 15, 25, 0.8);
    border-radius: 8px;
    padding: 6px 10px;
    border: 1px solid rgba(255,255,255,0.1);
    display: flex;
    align-items: center;
    gap: 8px;
  }

  #audio-hud button {
    background: transparent;
    border: none;
    font-size: 1.1rem;
    cursor: pointer;
    color: #fff;
  }

  #audio-hud input[type="range"] {
    width: 80px;
    accent-color: #ffcc00;
  }
`;
document.head.appendChild(style);
