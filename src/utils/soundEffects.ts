/**
 * Sound Effects System for Math Practice
 * @author Anil Kumar Thatha Venkatachalapathy
 * @email aniltv06@gmail.com
 */

export type SoundType =
  | 'correct'
  | 'wrong'
  | 'complete'
  | 'achievement'
  | 'coin'
  | 'star'
  | 'streak'
  | 'click'
  | 'whoosh'
  | 'pop'
  | 'crash'
  | 'melt'
  | 'fall'
  | 'beep'
  | 'roar'
  | 'blast'
  | 'crumble'
  | 'splash';

/**
 * Sound effects using Web Audio API
 */
export class SoundEffects {
  private context: AudioContext | null = null;
  private enabled: boolean = false;

  constructor() {
    // Load preference from localStorage
    const saved = localStorage.getItem('mathplay_sound_effects');
    this.enabled = saved === 'true';
  }

  private getContext(): AudioContext {
    if (!this.context) {
      this.context = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.context;
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
    localStorage.setItem('mathplay_sound_effects', String(enabled));
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * Play a sound effect
   */
  play(type: SoundType) {
    if (!this.enabled) return;

    try {
      const ctx = this.getContext();

      switch (type) {
        case 'correct':
          this.playCorrectSound(ctx);
          break;
        case 'wrong':
          this.playWrongSound(ctx);
          break;
        case 'complete':
          this.playCompleteSound(ctx);
          break;
        case 'achievement':
          this.playAchievementSound(ctx);
          break;
        case 'coin':
          this.playCoinSound(ctx);
          break;
        case 'star':
          this.playStarSound(ctx);
          break;
        case 'streak':
          this.playStreakSound(ctx);
          break;
        case 'click':
          this.playClickSound(ctx);
          break;
        case 'whoosh':
          this.playWhooshSound(ctx);
          break;
        case 'pop':
          this.playPopSound(ctx);
          break;
        case 'crash':
          this.playCrashSound(ctx);
          break;
        case 'melt':
          this.playMeltSound(ctx);
          break;
        case 'fall':
          this.playFallSound(ctx);
          break;
        case 'beep':
          this.playBeepSound(ctx);
          break;
        case 'roar':
          this.playRoarSound(ctx);
          break;
        case 'blast':
          this.playBlastSound(ctx);
          break;
        case 'crumble':
          this.playCrumbleSound(ctx);
          break;
        case 'splash':
          this.playSplashSound(ctx);
          break;
      }
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  }

  private playCorrectSound(ctx: AudioContext) {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
    oscillator.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
    oscillator.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2); // G5

    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.3);
  }

  private playWrongSound(ctx: AudioContext) {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.setValueAtTime(200, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.2);

    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);

    oscillator.type = 'sawtooth';
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.2);
  }

  private playCompleteSound(ctx: AudioContext) {
    const times = [0, 0.1, 0.2, 0.3];
    const frequencies = [523.25, 659.25, 783.99, 1046.50]; // C-E-G-C

    times.forEach((time, index) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.setValueAtTime(frequencies[index], ctx.currentTime + time);
      gainNode.gain.setValueAtTime(0.2, ctx.currentTime + time);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + time + 0.3);

      oscillator.start(ctx.currentTime + time);
      oscillator.stop(ctx.currentTime + time + 0.3);
    });
  }

  private playAchievementSound(ctx: AudioContext) {
    const frequencies = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C-E-G-C-E
    const times = [0, 0.08, 0.16, 0.24, 0.32];

    times.forEach((time, index) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.setValueAtTime(frequencies[index], ctx.currentTime + time);
      gainNode.gain.setValueAtTime(0.25, ctx.currentTime + time);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + time + 0.4);

      oscillator.type = 'triangle';
      oscillator.start(ctx.currentTime + time);
      oscillator.stop(ctx.currentTime + time + 0.4);
    });
  }

  private playCoinSound(ctx: AudioContext) {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.setValueAtTime(800, ctx.currentTime);
    oscillator.frequency.setValueAtTime(1000, ctx.currentTime + 0.05);

    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);

    oscillator.type = 'sine';
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.15);
  }

  private playStarSound(ctx: AudioContext) {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.setValueAtTime(1000, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(2000, ctx.currentTime + 0.1);

    gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);

    oscillator.type = 'sine';
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.2);
  }

  private playStreakSound(ctx: AudioContext) {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.setValueAtTime(440, ctx.currentTime);
    oscillator.frequency.setValueAtTime(880, ctx.currentTime + 0.1);

    gainNode.gain.setValueAtTime(0.25, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);

    oscillator.type = 'triangle';
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.2);
  }

  private playClickSound(ctx: AudioContext) {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.setValueAtTime(400, ctx.currentTime);
    gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.05);
  }

  private playWhooshSound(ctx: AudioContext) {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.setValueAtTime(800, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.3);

    gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

    oscillator.type = 'sawtooth';
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.3);
  }

  private playPopSound(ctx: AudioContext) {
    // Balloon pop - quick burst
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.setValueAtTime(800, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.08);

    gainNode.gain.setValueAtTime(0.4, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);

    oscillator.type = 'square';
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.08);
  }

  private playCrashSound(ctx: AudioContext) {
    // Block crash - chaotic noise burst
    const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.3, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    const gainNode = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    noise.buffer = noiseBuffer;
    noise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(500, ctx.currentTime);

    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

    noise.start(ctx.currentTime);
    noise.stop(ctx.currentTime + 0.3);
  }

  private playMeltSound(ctx: AudioContext) {
    // Melting - slow descending tone
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.setValueAtTime(600, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.8);

    gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);

    oscillator.type = 'sine';
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.8);
  }

  private playFallSound(ctx: AudioContext) {
    // Petal falling - gentle descending chime
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.setValueAtTime(1200, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.5);

    gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

    oscillator.type = 'triangle';
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.5);
  }

  private playBeepSound(ctx: AudioContext) {
    // Robot beep - electronic
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.setValueAtTime(440, ctx.currentTime);
    oscillator.frequency.setValueAtTime(554, ctx.currentTime + 0.05);

    gainNode.gain.setValueAtTime(0.25, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);

    oscillator.type = 'square';
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.15);
  }

  private playRoarSound(ctx: AudioContext) {
    // Dinosaur roar - low growl
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.setValueAtTime(80, ctx.currentTime);
    oscillator.frequency.setValueAtTime(120, ctx.currentTime + 0.1);
    oscillator.frequency.setValueAtTime(100, ctx.currentTime + 0.2);

    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);

    oscillator.type = 'sawtooth';
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.4);
  }

  private playBlastSound(ctx: AudioContext) {
    // Rocket blast - powerful whoosh
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2000, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(500, ctx.currentTime + 0.4);

    oscillator.frequency.setValueAtTime(150, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.4);

    gainNode.gain.setValueAtTime(0.35, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);

    oscillator.type = 'sawtooth';
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.4);
  }

  private playCrumbleSound(ctx: AudioContext) {
    // Castle crumbling - multiple short bursts
    for (let i = 0; i < 5; i++) {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.setValueAtTime(200 - i * 20, ctx.currentTime + i * 0.05);
      oscillator.frequency.exponentialRampToValueAtTime(100 - i * 10, ctx.currentTime + i * 0.05 + 0.1);

      gainNode.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.05 + 0.1);

      oscillator.type = 'square';
      oscillator.start(ctx.currentTime + i * 0.05);
      oscillator.stop(ctx.currentTime + i * 0.05 + 0.1);
    }
  }

  private playSplashSound(ctx: AudioContext) {
    // Water splash - noise burst with filter
    const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.4, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
    }

    const noise = ctx.createBufferSource();
    const gainNode = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    noise.buffer = noiseBuffer;
    noise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1000, ctx.currentTime);

    gainNode.gain.setValueAtTime(0.25, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);

    noise.start(ctx.currentTime);
    noise.stop(ctx.currentTime + 0.4);
  }
}

// Export singleton instance
export const soundEffects = new SoundEffects();
