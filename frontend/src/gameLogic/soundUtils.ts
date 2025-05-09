// Extend the Window interface to include webkitAudioContext for older Safari
declare global {
  interface Window {
    webkitAudioContext?: new () => AudioContext;
  }
}

export const playSound = (type: 'click' | 'teleport' | 'timer_expiry' | 'lose_life' | 'game_over') => {
  const ModernAudioContext = window.AudioContext;
  const LegacyAudioContext = window.webkitAudioContext;

  let audioCtx: AudioContext | null = null;

  if (ModernAudioContext) {
    audioCtx = new ModernAudioContext();
  } else if (LegacyAudioContext) {
    try {
      audioCtx = new LegacyAudioContext();
    } catch (e) {
      console.error("Error creating legacy AudioContext", e);
      return;
    }
  } else {
    console.warn("Web Audio API is not supported in this browser.");
    return;
  }
  
  if (!audioCtx) return;
  const finalAudioContext = audioCtx;

  const oscillator = finalAudioContext.createOscillator();
  const gainNode = finalAudioContext.createGain();
  oscillator.connect(gainNode);
  gainNode.connect(finalAudioContext.destination);
  gainNode.gain.setValueAtTime(0.1, finalAudioContext.currentTime);

  switch (type) {
    case 'click':
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(440, finalAudioContext.currentTime); // A4
      gainNode.gain.exponentialRampToValueAtTime(0.00001, finalAudioContext.currentTime + 0.2);
      break;
    case 'teleport':
      oscillator.type = 'square';
      oscillator.frequency.setValueAtTime(660, finalAudioContext.currentTime); // E5
      gainNode.gain.exponentialRampToValueAtTime(0.00001, finalAudioContext.currentTime + 0.15);
      break;
    case 'timer_expiry':
      oscillator.type = 'sawtooth';
      oscillator.frequency.setValueAtTime(330, finalAudioContext.currentTime); // E4
      gainNode.gain.exponentialRampToValueAtTime(0.00001, finalAudioContext.currentTime + 0.3);
      break;
    case 'lose_life':
      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(220, finalAudioContext.currentTime); // A3
      oscillator.frequency.linearRampToValueAtTime(110, finalAudioContext.currentTime + 0.3);
      gainNode.gain.exponentialRampToValueAtTime(0.00001, finalAudioContext.currentTime + 0.3);
      break;
    case 'game_over':
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(165, finalAudioContext.currentTime); // E3
      gainNode.gain.exponentialRampToValueAtTime(0.00001, finalAudioContext.currentTime + 0.5);
      break;
    default:
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(110, finalAudioContext.currentTime); // A2
      gainNode.gain.exponentialRampToValueAtTime(0.00001, finalAudioContext.currentTime + 0.1);
      break;
  }
  oscillator.start(finalAudioContext.currentTime);
  const duration = type === 'game_over' ? 0.5 : (type === 'lose_life' || type === 'timer_expiry' ? 0.3 : (type === 'teleport' ? 0.15 : 0.2));
  oscillator.stop(finalAudioContext.currentTime + duration);
};