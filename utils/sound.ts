

export const SoundSystem = {
  ctx: null as AudioContext | null,
  musicInterval: null as number | null,
  musicNote: 0,
  currentTrack: 0,
  
  init: () => {
    if (!SoundSystem.ctx) {
      SoundSystem.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (SoundSystem.ctx.state === 'suspended') {
      SoundSystem.ctx.resume();
    }
  },

  setTrack: (trackIndex: number) => {
      SoundSystem.currentTrack = trackIndex % 6;
      SoundSystem.musicNote = 0; // Reset position on track change
  },

  // --- Music Engine ---
  playMusic: () => {
    SoundSystem.init();
    if (SoundSystem.musicInterval) return;
    
    // TEMPO: 140 BPM (Classic C&C Tempo)
    const bpm = 140;
    const stepTime = (60 / bpm) / 4 * 1000; // 16th notes
    
    SoundSystem.musicInterval = window.setInterval(() => {
        if (!SoundSystem.ctx) return;
        const t = SoundSystem.ctx.currentTime;
        // Use a 64-step cycle for longer loops (approx 11 seconds per cycle, repeats)
        const step = SoundSystem.musicNote % 64; 
        const track = SoundSystem.currentTrack;

        // --- COMMON INSTRUMENTS ---
        
        // Helper: Distortion
        const makeDistortion = (amount: number) => {
            const k = typeof amount === 'number' ? amount : 50;
            const n_samples = 44100;
            const curve = new Float32Array(n_samples);
            for (let i = 0; i < n_samples; ++i) {
                const x = i * 2 / n_samples - 1;
                curve[i] = (3 + k) * x * 20 * (Math.PI / 180) / (Math.PI + k * Math.abs(x));
            }
            return curve;
        };

        // Helper: Play Drum
        const kick = (vol: number = 1.0, decay: number = 0.3) => {
            const osc = SoundSystem.ctx!.createOscillator();
            const gain = SoundSystem.ctx!.createGain();
            osc.frequency.setValueAtTime(150, t);
            osc.frequency.exponentialRampToValueAtTime(0.01, t + decay);
            gain.gain.setValueAtTime(vol, t);
            gain.gain.exponentialRampToValueAtTime(0.01, t + decay);
            
            // Slight distortion for industrial feel
            const shaper = SoundSystem.ctx!.createWaveShaper();
            shaper.curve = makeDistortion(20);
            
            osc.connect(shaper);
            shaper.connect(gain);
            gain.connect(SoundSystem.ctx!.destination);
            osc.start(t);
            osc.stop(t + decay);
        };

        const snare = (vol: number = 0.8) => {
            const bufferSize = SoundSystem.ctx!.sampleRate * 0.2;
            const buffer = SoundSystem.ctx!.createBuffer(1, bufferSize, SoundSystem.ctx!.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1);
            
            const noise = SoundSystem.ctx!.createBufferSource();
            noise.buffer = buffer;
            
            const filter = SoundSystem.ctx!.createBiquadFilter();
            filter.type = 'highpass';
            filter.frequency.value = 1000;
            
            const gain = SoundSystem.ctx!.createGain();
            gain.gain.setValueAtTime(vol, t);
            gain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);
            
            noise.connect(filter);
            filter.connect(gain);
            gain.connect(SoundSystem.ctx!.destination);
            noise.start(t);
        };

        const hihat = (open: boolean = false) => {
             const osc = SoundSystem.ctx!.createOscillator();
             const gain = SoundSystem.ctx!.createGain();
             // Metal simulation
             osc.type = 'square';
             osc.frequency.setValueAtTime(8000, t);
             const filter = SoundSystem.ctx!.createBiquadFilter();
             filter.type = 'highpass';
             filter.frequency.value = 7000;
             
             gain.gain.setValueAtTime(0.1, t);
             gain.gain.exponentialRampToValueAtTime(0.01, t + (open ? 0.2 : 0.05));
             
             osc.connect(filter);
             filter.connect(gain);
             gain.connect(SoundSystem.ctx!.destination);
             osc.start(t);
             osc.stop(t + (open ? 0.2 : 0.05));
        };

        const bassPluck = (freq: number, length: number = 0.2) => {
             const osc = SoundSystem.ctx!.createOscillator();
             const gain = SoundSystem.ctx!.createGain();
             const filter = SoundSystem.ctx!.createBiquadFilter();
             
             osc.type = 'sawtooth';
             osc.frequency.setValueAtTime(freq, t);
             
             filter.type = 'lowpass';
             filter.frequency.setValueAtTime(800, t);
             filter.frequency.exponentialRampToValueAtTime(100, t + length);
             
             gain.gain.setValueAtTime(0.4, t);
             gain.gain.linearRampToValueAtTime(0, t + length);
             
             osc.connect(filter);
             filter.connect(gain);
             gain.connect(SoundSystem.ctx!.destination);
             osc.start(t);
             osc.stop(t + length);
        };

        const guitarStab = (freq: number) => {
             const osc1 = SoundSystem.ctx!.createOscillator();
             const osc2 = SoundSystem.ctx!.createOscillator();
             const gain = SoundSystem.ctx!.createGain();
             const shaper = SoundSystem.ctx!.createWaveShaper();
             
             osc1.type = 'sawtooth';
             osc1.frequency.value = freq;
             osc2.type = 'square';
             osc2.frequency.value = freq * 1.01; // Detune
             
             shaper.curve = makeDistortion(400); // Heavy distortion
             
             gain.gain.setValueAtTime(0.3, t);
             gain.gain.exponentialRampToValueAtTime(0.01, t + 0.3);
             
             osc1.connect(shaper);
             osc2.connect(shaper);
             shaper.connect(gain);
             gain.connect(SoundSystem.ctx!.destination);
             
             osc1.start(t);
             osc2.start(t);
             osc1.stop(t+0.3);
             osc2.stop(t+0.3);
        }

        // --- TRACK LOGIC ---

        // TRACK 1: "ACT ON INSTINCT" STYLE (Rock/Synth)
        if (track === 0) {
            // Kick: 4-on-the-floor
            if (step % 4 === 0) kick(1.0);
            // Snare: 2 and 4
            if (step % 8 === 4) snare(0.8);
            // HiHats: 8th notes
            if (step % 2 === 0) hihat(step % 4 === 2);

            // Bassline (E minor pentatonic riff)
            const bassPattern = [
                55, 0, 0, 55, 65, 0, 55, 0, 
                82, 0, 82, 0, 73, 0, 73, 65,
                55, 0, 0, 55, 65, 0, 55, 0,
                41, 0, 41, 0, 49, 0, 49, 52
            ];
            const note = bassPattern[step % 32];
            if (note > 0) bassPluck(note, 0.2);

            // Synth Lead (Higher octave)
            if (step >= 32 && step % 4 === 0) {
                 // Simple melody overlay
                 const melody = [330, 0, 330, 0, 440, 0, 293, 0];
                 const m = melody[(step/4)%8];
                 if(m > 0) guitarStab(m);
            }
        }

        // TRACK 2: "MECHANICAL" (Industrial)
        else if (track === 1) {
             // Clanking Beat
             if (step % 8 === 0 || step % 8 === 3 || step % 8 === 5) kick(0.9, 0.2);
             if (step % 8 === 4) {
                 // Metallic Snare
                 snare(0.9);
                 SoundSystem.playTone(800, 'square', 0.05, 0.1); 
             }
             
             // 16th note bass chug
             if (step % 2 === 0) bassPluck(43.65, 0.1); // F1
             
             // Alarm / Industrial FX
             if (step % 32 === 0) SoundSystem.playTone(880, 'sawtooth', 0.5, 0.2);
             if (step % 32 === 16) SoundSystem.playTone(660, 'sawtooth', 0.5, 0.2);
        }

        // TRACK 3: "PREPARE" (Suspense)
        else if (track === 2) {
            // Sparse Kick
            if (step % 16 === 0 || step % 16 === 10) kick(0.8);
            // Rimshot
            if (step % 16 === 4 || step % 16 === 12) SoundSystem.playTone(600, 'triangle', 0.02, 0.1);
            
            // Deep Drone
            if (step % 64 === 0) {
                 bassPluck(36, 2.0); // Low C drone
            }
            
            // Arpeggio
            if (step % 4 === 0) {
                const arp = [261, 311, 392, 523];
                const note = arp[(step/4)%4];
                SoundSystem.playTone(note, 'sine', 0.1, 0.1);
            }
        }

        // TRACK 4: "WARFARE" (Breakbeat)
        else if (track === 3) {
            // Breakbeat pattern
            const beat = [1,0,0,0, 1,0,0,0, 0,0,1,0, 1,0,0,0]; // Kick
            if (beat[step % 16]) kick(1.0);
            
            const snares = [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,1,0]; // Snare
            if (snares[step % 16]) snare(0.9);

            if (step % 2 === 0) hihat();

            // Orchestral Hit Simulation (Sawtooth stack)
            if (step % 32 === 0) {
                [220, 440, 660, 880].forEach(f => guitarStab(f));
            }
        }

        // TRACK 5: "DRILL" (Marching)
        else if (track === 4) {
            // Marching Snare Rolls
            if (step % 4 !== 0) {
                // Ghost notes
                if (Math.random() > 0.3) snare(0.2); 
            } else {
                // Accent
                snare(0.8);
            }
            // Stomp Kick
            if (step % 8 === 0) kick(1.2, 0.5);

            // Siren Pad
            if (step % 64 === 0) {
                const osc = SoundSystem.ctx!.createOscillator();
                const gain = SoundSystem.ctx!.createGain();
                osc.frequency.setValueAtTime(440, t);
                osc.frequency.linearRampToValueAtTime(880, t + 4);
                gain.gain.setValueAtTime(0.1, t);
                gain.gain.linearRampToValueAtTime(0, t + 4);
                osc.connect(gain);
                gain.connect(SoundSystem.ctx!.destination);
                osc.start(t);
            }
        }

        // TRACK 6: "HELL MARCH" STYLE (Aggressive)
        else if (track === 5) {
            // 4-on-the-floor STOMP
            if (step % 4 === 0) {
                kick(1.5, 0.4);
                // Layer a low crash/noise with kick
                snare(0.4); 
            }
            
            // Guitar Grind (Distorted Sawtooth Bass)
            // Rhythm:  DUM - da - DUM - da
            if (step % 4 === 0 || step % 4 === 2) {
                guitarStab(step % 8 === 0 ? 55 : 82); // A1 -> E2
            }
            
            // High metal percussion
            if (step % 2 === 0) hihat(true);
            
            // Vocal grunt simulation (noise burst + filter)
            if (step % 64 === 0) {
                 SoundSystem.playNoise(0.4);
            }
        }

        SoundSystem.musicNote++;
    }, stepTime);
  },

  stopMusic: () => {
    if (SoundSystem.musicInterval) {
        clearInterval(SoundSystem.musicInterval);
        SoundSystem.musicInterval = null;
    }
  },

  // --- Sound FX ---

  playTone: (freq: number, type: OscillatorType, duration: number, vol: number = 0.1) => {
    if (!SoundSystem.ctx) return;
    const osc = SoundSystem.ctx.createOscillator();
    const gain = SoundSystem.ctx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, SoundSystem.ctx.currentTime);
    
    gain.gain.setValueAtTime(vol, SoundSystem.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, SoundSystem.ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(SoundSystem.ctx.destination);
    
    osc.start();
    osc.stop(SoundSystem.ctx.currentTime + duration);
  },

  playNoise: (duration: number = 0.1) => {
    if (!SoundSystem.ctx) return;
    const bufferSize = SoundSystem.ctx.sampleRate * duration;
    const buffer = SoundSystem.ctx.createBuffer(1, bufferSize, SoundSystem.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = SoundSystem.ctx.createBufferSource();
    noise.buffer = buffer;
    
    const filter = SoundSystem.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1000;

    const gain = SoundSystem.ctx.createGain();
    gain.gain.value = 0.05;

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(SoundSystem.ctx.destination);
    
    noise.start();
  },

  // Public SFX methods
  playClick: () => {
    SoundSystem.init();
    SoundSystem.playTone(800, 'square', 0.05, 0.05);
  },

  playKey: () => {
    SoundSystem.init();
    SoundSystem.playTone(1200, 'triangle', 0.03, 0.02);
  },

  playEnter: () => {
    SoundSystem.init();
    SoundSystem.playTone(600, 'square', 0.1, 0.1);
    setTimeout(() => SoundSystem.playTone(400, 'square', 0.1, 0.1), 50);
  },

  playError: () => {
    SoundSystem.init();
    SoundSystem.playTone(150, 'sawtooth', 0.3, 0.2);
  },

  playHardDrive: () => {
    SoundSystem.init();
    if (Math.random() > 0.5) {
      SoundSystem.playNoise(0.05 + Math.random() * 0.05);
    }
  },
  
  playStartup: () => {
    SoundSystem.init();
    [220, 440, 880].forEach((freq, i) => {
        setTimeout(() => SoundSystem.playTone(freq, 'square', 0.2, 0.1), i * 150);
    });
  },

  playSpeech: (duration: number) => {
    SoundSystem.init();
    if (!SoundSystem.ctx) return;
    
    const steps = 10;
    const stepDur = duration / steps;
    
    for(let i=0; i<steps; i++) {
        setTimeout(() => {
            if(Math.random() > 0.3) {
                 SoundSystem.playTone(100 + Math.random() * 400, 'sawtooth', stepDur, 0.05);
            } else {
                 SoundSystem.playNoise(stepDur);
            }
        }, i * (stepDur * 1000));
    }
  },

  playEVABootSequence: () => {
    SoundSystem.init();
    if (!SoundSystem.ctx) return;
    
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            SoundSystem.playTone(1000 + Math.random() * 2000, 'square', 0.05, 0.05);
        }, i * 100);
    }

    const osc = SoundSystem.ctx.createOscillator();
    const gain = SoundSystem.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(50, SoundSystem.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, SoundSystem.ctx.currentTime + 4); 
    gain.gain.setValueAtTime(0.2, SoundSystem.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, SoundSystem.ctx.currentTime + 4);
    osc.connect(gain);
    gain.connect(SoundSystem.ctx.destination);
    osc.start();
    osc.stop(SoundSystem.ctx.currentTime + 4);

    setTimeout(() => {
        SoundSystem.playTone(440, 'sine', 1.0, 0.3);
        SoundSystem.playTone(880, 'sine', 1.0, 0.2);
    }, 4000);
  },

  playEVACommand: (text: string) => {
      if (!('speechSynthesis' in window)) return;
      
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const voices = window.speechSynthesis.getVoices();
      
      const preferredVoices = [
        "Google US English",
        "Microsoft Zira",
        "Samantha",
        "Google UK English Female"
      ];
      
      const selectedVoice = voices.find(v => preferredVoices.some(name => v.name.includes(name))) 
                         || voices.find(v => v.name.includes('Female'))
                         || voices[0];

      if (selectedVoice) {
          utterance.voice = selectedVoice;
      }

      utterance.pitch = 1.05;
      utterance.rate = 0.95; 
      utterance.volume = 1.0; 

      window.speechSynthesis.speak(utterance);
  }
};
