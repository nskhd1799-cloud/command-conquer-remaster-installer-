import React, { useState, useEffect, useRef } from 'react';
import CRTScreen from './components/CRTScreen';
import ProgressBar from './components/ProgressBar';
import BlinkingCursor from './components/BlinkingCursor';
import TechFrame from './components/TechFrame';
import RetroBackground from './components/RetroBackground';
import SchematicView from './components/SchematicView';
import LipSyncVisualizer from './components/LipSyncVisualizer';
import DataMontage from './components/DataMontage';
import { InstallStep, FILE_LIST, SYSTEM_SPECS } from './constants';
import { Volume2, VolumeX, HardDrive, Cpu, CheckSquare, Square, Disc, ShieldAlert, Wifi, Zap, Activity, Globe, Lock, User, FileText, Music, Key } from 'lucide-react';
import { SoundSystem } from './utils/sound';

export default function App() {
  const [currentStep, setCurrentStep] = useState<InstallStep>(InstallStep.BOOT_SEQUENCE);
  const [progress, setProgress] = useState(0);
  const [currentFile, setCurrentFile] = useState("");
  const [copyAddress, setCopyAddress] = useState("0x0000");
  const [logs, setLogs] = useState<string[]>([]);
  const [soundOption, setSoundOption] = useState(0);
  const [systemCheckIndex, setSystemCheckIndex] = useState(-1);
  const [transmissionText, setTransmissionText] = useState("");
  const [finalWelcomeText, setFinalWelcomeText] = useState("");
  const [isTalking, setIsTalking] = useState(false);
  const [showFinalButtons, setShowFinalButtons] = useState(false);
  const [commanderName, setCommanderName] = useState("");
  const [authStep, setAuthStep] = useState(0); // 0: Input, 1: Verifying
  const [musicTrack, setMusicTrack] = useState(0); // 0-5
  
  // New State for Boot & Serial
  const [bootLines, setBootLines] = useState<string[]>([]);
  const [serialKey, setSerialKey] = useState("");
  const [serialError, setSerialError] = useState(false);

  const logsEndRef = useRef<HTMLDivElement>(null);

  const fullTransmission = "INCOMING TRANSMISSION... \nSOURCE: UNKNOWN... \nENCRYPTION: OMEGA-4... \nDECODING... \n\nCOMMANDER,\n\nINITIATING EVA INSTALLATION PROTOCOL. \nSECURE CONNECTION REQUIRED FOR GDI/NOD DATALINK.\n\nPROCEED WITH CAUTION.";

  const welcomeMessage = "WELCOME BACK COMMANDER";

  // Auto-scroll logs
  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  // --- MAIN STEP SEQUENCER & VOICE PROMPTS ---
  useEffect(() => {
    // Determine Voice Prompt based on Step
    let prompt = "";
    switch(currentStep) {
        case InstallStep.SERIAL_INPUT: prompt = "Security clearance required. Enter serial identification."; break;
        case InstallStep.WELCOME: prompt = "Welcome to the installation interface."; break;
        case InstallStep.TRANSMISSION: prompt = "Incoming encoded transmission."; break;
        case InstallStep.LICENSE_AGREEMENT: prompt = "Review military protocol agreement."; break;
        case InstallStep.FACTION_SELECT: prompt = "Select faction allegiance."; break;
        case InstallStep.IDENTITY_AUTH: prompt = "Enter command credentials."; break;
        case InstallStep.DESTINATION: prompt = "Confirm installation target."; break;
        case InstallStep.SYSTEM_CHECK: prompt = "Analyzing hardware configuration."; break;
        case InstallStep.SOUND_CONFIG: prompt = "Configure audio output device."; break;
        case InstallStep.DATA_UPLINK: prompt = "Establishing battlefield control standby."; break;
        case InstallStep.COPYING: prompt = "Transferring tactical data packets."; break;
        case InstallStep.INSTALL_SUCCESS: prompt = "Installation complete."; break;
        case InstallStep.COMPLETE: prompt = ""; break; // Handled separately
        default: break;
    }

    if (prompt) {
        // Small delay to let the screen transition happen visually before speaking
        setTimeout(() => {
            SoundSystem.playEVACommand(prompt);
        }, 500);
    }

    // Step-Specific Logic
    
    // 0. BOOT SEQUENCE LOGIC
    if (currentStep === InstallStep.BOOT_SEQUENCE) {
        const bootText = [
            "BIOS DATE 01/15/95 14:22:55 VER 1.02",
            "CPU: INTEL 486DX2, SPEED: 66 MHZ",
            "640K RAM SYSTEM ... OK",
            "EXTENDED MEMORY 16384K ... OK",
            "CACHE MEMORY 256K ... OK",
            " ",
            "INITIALIZING VIDEO ADAPTER ... VGA FOUND",
            "INITIALIZING SOUND BLASTER 16 ... PORT 220 IRQ 5 DMA 1",
            "LOADING CD-ROM DRIVER ... MSCDEX V2.23",
            "DRIVE D: WESTWOOD_STUDIOS_VOL_1",
            " ",
            "LOADING EVA KERNEL ......................... DONE",
            "MOUNTING VIRTUAL FILESYSTEM ................ DONE",
            "CHECKING PERIPHERALS ....................... DONE",
            " ",
            "SYSTEM READY."
        ];
        
        let lineIdx = 0;
        const bInterval = setInterval(() => {
            if (lineIdx < bootText.length) {
                setBootLines(prev => [...prev, bootText[lineIdx]]);
                SoundSystem.playKey(); // Clicking sound for text
                lineIdx++;
            } else {
                clearInterval(bInterval);
                setTimeout(() => {
                    setCurrentStep(InstallStep.SERIAL_INPUT);
                }, 1500);
            }
        }, 150);
        return () => clearInterval(bInterval);
    }

    if (currentStep === InstallStep.TRANSMISSION) {
      let charIndex = 0;
      const tInterval = setInterval(() => {
        setTransmissionText(fullTransmission.slice(0, charIndex));
        charIndex++;
        SoundSystem.playNoise(0.01);
        if (charIndex > fullTransmission.length) {
          clearInterval(tInterval);
        }
      }, 30);
      return () => clearInterval(tInterval);
    }

    if (currentStep === InstallStep.SYSTEM_CHECK) {
      SoundSystem.playStartup();
    }

    if (currentStep === InstallStep.DATA_UPLINK) {
       // Simulate a connection phase
       let p = 0;
       const interval = setInterval(() => {
          p += 2;
          setProgress(p);
          SoundSystem.playNoise(0.05);
          if (p >= 100) {
             clearInterval(interval);
             setTimeout(() => {
                setProgress(0);
                setCurrentStep(InstallStep.COPYING);
             }, 1000);
          }
       }, 50);
       return () => clearInterval(interval);
    }

    if (currentStep === InstallStep.INSTALL_SUCCESS) {
        setTimeout(() => {
            setCurrentStep(InstallStep.INTRO_SEQUENCE);
        }, 3000);
    }

    if (currentStep === InstallStep.INTRO_SEQUENCE) {
        SoundSystem.playEVABootSequence();
        const duration = 8000; // Slower sequence
        setTimeout(() => {
            setCurrentStep(InstallStep.COMPLETE);
        }, duration);
    }

    if (currentStep === InstallStep.COMPLETE) {
        SoundSystem.stopMusic(); // Stop music for the finale
        let charIndex = 0;
        setTimeout(() => {
            SoundSystem.playEVACommand("Welcome back, Commander");
            setIsTalking(true);
            setTimeout(() => setIsTalking(false), 2500);

            const wInterval = setInterval(() => {
                setFinalWelcomeText(welcomeMessage.slice(0, charIndex));
                charIndex++;
                if (charIndex > welcomeMessage.length) {
                    clearInterval(wInterval);
                    setTimeout(() => setShowFinalButtons(true), 1500);
                }
            }, 80);
        }, 1000);
    }

  }, [currentStep]);


  // System Check Animation
  useEffect(() => {
    if (currentStep === InstallStep.SYSTEM_CHECK) {
      let i = 0;
      const interval = setInterval(() => {
        setSystemCheckIndex(i);
        SoundSystem.playKey();
        i++;
        if (i > SYSTEM_SPECS.length) {
          clearInterval(interval);
          setTimeout(() => setCurrentStep(InstallStep.SOUND_CONFIG), 1500);
        }
      }, 600); // Slower check
      return () => clearInterval(interval);
    }
  }, [currentStep]);

  // File Copying Animation (FASTER)
  useEffect(() => {
    if (currentStep === InstallStep.COPYING) {
      let fileIndex = 0;
      const interval = setInterval(() => {
        SoundSystem.playHardDrive();

        setProgress((prev) => {
          // Faster increment
          const newProgress = prev + (Math.random() * 0.8); 
          if (newProgress >= 100) {
            clearInterval(interval);
            setCurrentStep(InstallStep.INSTALL_SUCCESS);
            return 100;
          }
          return newProgress;
        });

        // Always update address for dynamic effect
        setCopyAddress(`0x${Math.floor(Math.random() * 65535).toString(16).toUpperCase().padStart(4, '0')}`);

        if (Math.random() > 0.3) {
           const file = FILE_LIST[fileIndex % FILE_LIST.length];
           setCurrentFile(file);
           setLogs(prev => [...prev.slice(-8), `> CPY: ${file}... OK`]);
           fileIndex++;
        }
      }, 80); // Faster tick rate (was 150)
      return () => clearInterval(interval);
    }
  }, [currentStep]);


  // --- INTERACTION HANDLERS ---

  const handleInteraction = () => {
    SoundSystem.init();
    SoundSystem.playClick();
  };

  const handleSerialInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      SoundSystem.playKey();
      let val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
      
      // Auto formatting XXXX-XXXX-XXXX-XXXX
      if (val.length > 16) val = val.slice(0, 16);
      
      const parts = [];
      for(let i=0; i<val.length; i+=4) {
          parts.push(val.slice(i, i+4));
      }
      setSerialKey(parts.join('-'));
      setSerialError(false);
  };

  const submitSerial = (e: React.FormEvent) => {
      e.preventDefault();
      // Basic validation length
      if (serialKey.length >= 19) {
          SoundSystem.playEnter();
          SoundSystem.playTone(1000, 'square', 0.1, 0.1);
          SoundSystem.playTone(1500, 'square', 0.2, 0.1); // Success chime
          setCurrentStep(InstallStep.WELCOME);
      } else {
          SoundSystem.playError();
          setSerialError(true);
      }
  };

  const startInstall = () => {
    handleInteraction();
    SoundSystem.playMusic(); // START MUSIC ENGINE
    setCurrentStep(InstallStep.TRANSMISSION);
  };

  const nextFromTransmission = () => {
    SoundSystem.playEnter();
    setCurrentStep(InstallStep.LICENSE_AGREEMENT);
  };

  const acceptLicense = () => {
    SoundSystem.playEnter();
    setCurrentStep(InstallStep.FACTION_SELECT);
  };

  const selectFaction = () => {
    SoundSystem.playEnter();
    setCurrentStep(InstallStep.IDENTITY_AUTH);
  };

  const submitAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commanderName) return;
    SoundSystem.playEnter();
    setAuthStep(1); // Verifying
    SoundSystem.playNoise(0.5);
    setTimeout(() => {
        setCurrentStep(InstallStep.DESTINATION);
    }, 2000);
  };

  const confirmDestination = () => {
    SoundSystem.playEnter();
    setCurrentStep(InstallStep.SYSTEM_CHECK);
  };

  const handleSoundSelect = (index: number) => {
    SoundSystem.playClick();
    setSoundOption(index);
  };

  const testVoice = () => {
    SoundSystem.playClick();
    setIsTalking(true);
    SoundSystem.playSpeech(1.5);
    setTimeout(() => setIsTalking(false), 1500);
  };

  const confirmSound = () => {
    SoundSystem.playEnter();
    setLogs(prev => [...prev, "Initializing Sound Hardware...", "DMA Channel 1... OK", "IRQ 5... OK"]);
    setTimeout(() => setCurrentStep(InstallStep.DATA_UPLINK), 1000);
  };

  const handleReinstall = () => {
    SoundSystem.playClick();
    SoundSystem.playNoise(0.3);
    setCurrentStep(InstallStep.SHUTDOWN);
  };

  const cycleMusic = () => {
      const nextTrack = (musicTrack + 1) % 6; // 6 Tracks total
      setMusicTrack(nextTrack);
      SoundSystem.setTrack(nextTrack);
      SoundSystem.playClick();
  };

  // RENDER: SHUTDOWN SCREEN
  if (currentStep === InstallStep.SHUTDOWN) {
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center overflow-hidden">
         <div className="w-full h-0.5 bg-white opacity-50 animate-scanline"></div>
         <div className="text-[#333] font-mono text-xs absolute bottom-4 left-4">TERMINAL DISCONNECTED.</div>
      </div>
    );
  }

  // RENDER: BOOT SEQUENCE (Raw DOS Look)
  if (currentStep === InstallStep.BOOT_SEQUENCE) {
      return (
          <div className="w-full h-screen bg-black font-mono p-8 text-[#00aa00] text-lg overflow-hidden flex flex-col justify-end">
              {bootLines.map((line, i) => (
                  <div key={i} className="mb-1">{line}</div>
              ))}
              <div className="w-4 h-6 bg-[#00aa00] animate-pulse"></div>
          </div>
      );
  }

  // RENDER: INTRO SEQUENCE
  if (currentStep === InstallStep.INTRO_SEQUENCE) {
      return (
          <div className="w-full h-screen bg-black">
              <DataMontage />
          </div>
      );
  }

  return (
    <CRTScreen>
      <RetroBackground />
      
      {/* GLOBAL HUD */}
      <div className="absolute top-2 left-2 right-2 flex justify-between text-[10px] md:text-xs text-[#004400] z-50 pointer-events-none font-mono">
          <div className="flex gap-4">
             <span className="text-[#ffaa00]">EVA_UNIT_01</span>
             <span>NET: <span className="text-[#00aa00]">{currentStep === InstallStep.SERIAL_INPUT ? 'OFFLINE' : 'CONNECTED'}</span></span>
          </div>
          <div className="flex gap-6">
             <span>MEM: 640K</span>
             <span className="flex items-center gap-1 text-[#ffaa00]">
                <Activity size={10} />
                <span>LIVE</span>
             </span>
          </div>
      </div>

      <div className="relative z-10 flex-grow flex flex-col h-full py-4 md:py-8 w-full max-w-[1400px] mx-auto">
        
        {/* Step 1: SERIAL INPUT (Security Check) */}
        {currentStep === InstallStep.SERIAL_INPUT && (
             <div className="flex flex-col items-center justify-center h-full">
                 <TechFrame title="SECURITY_VERIFICATION" theme="orange" className="max-w-xl w-full">
                     <div className="flex flex-col items-center p-8 space-y-6">
                         <Key size={60} className="text-[#ffaa00] mb-4" />
                         <div className="text-center space-y-2">
                             <div className="text-xl text-[#ffaa00] font-bold tracking-widest">ENTER SERIAL KEY</div>
                             <div className="text-xs text-[#cc8800]">Look for the 16-digit code on the back of your manual.</div>
                         </div>
                         
                         <form onSubmit={submitSerial} className="w-full flex flex-col items-center space-y-6 mt-4">
                             <input 
                                type="text" 
                                autoFocus
                                value={serialKey}
                                onChange={handleSerialInput}
                                className={`w-full bg-[#110500] border-2 ${serialError ? 'border-red-500 text-red-500' : 'border-[#ffaa00] text-[#ffaa00]'} text-2xl font-mono p-4 focus:outline-none uppercase text-center tracking-[0.2em] shadow-inner`}
                                placeholder="XXXX-XXXX-XXXX-XXXX"
                             />
                             {serialError && <div className="text-red-500 animate-pulse text-sm">INVALID SERIAL SEQUENCE</div>}
                             
                             <button type="submit" className="bg-[#884400] text-black hover:bg-[#ffaa00] w-full py-3 font-bold uppercase tracking-wider transition-colors clip-path-slanted">
                                 [ VERIFY ACCESS ]
                             </button>
                         </form>
                     </div>
                 </TechFrame>
             </div>
        )}

        {/* Step 2: Welcome (Main Menu) */}
        {currentStep === InstallStep.WELCOME && (
          <div className="flex flex-col items-center justify-center h-full space-y-8 animate-fade-in relative">
             <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                <Disc size={500} className="animate-spin-slow text-[#00ff00]" />
             </div>
             <TechFrame title="MAIN_MENU" className="w-full max-w-2xl bg-[#001100]/90 border border-[#00ff00]/30" theme="green">
              <div className="flex flex-col items-center p-6 md:p-10">
                <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-shadow-glow mb-2 chromatic-aberration text-center leading-none">C&C</h1>
                <div className="text-xl md:text-2xl tracking-[0.6em] mb-12 text-[#ffaa00] text-shadow-orange text-center">INSTALLATION PROTOCOL</div>
                <p className="mb-10 text-[#00cc00] text-center max-w-md text-sm md:text-base tracking-wide">
                  ESTABLISH BATTLEFIELD CONTROL<br/>STANDBY FOR DATA UPLINK
                </p>
                <button 
                  onClick={startInstall}
                  className="group relative bg-[#00ff00] text-black px-12 py-4 font-bold text-2xl hover:bg-[#ffaa00] hover:text-black transition-all clip-path-polygon"
                  style={{ clipPath: 'polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%)' }}
                >
                  <span className="group-hover:hidden">[ INITIALIZE ]</span>
                  <span className="hidden group-hover:inline group-hover:animate-pulse">[ EXECUTE ]</span>
                </button>
              </div>
            </TechFrame>
          </div>
        )}

        {/* Step 3: Transmission */}
        {currentStep === InstallStep.TRANSMISSION && (
           <div className="w-full max-w-5xl mx-auto mt-12">
              <TechFrame title="ENCRYPTED_CHANNEL" borderColor="#ffaa00" theme="orange">
                <div className="flex items-start gap-8">
                    <div className="hidden md:flex w-40 h-40 border border-[#ffaa00] p-4 bg-[#221100] items-center justify-center shrink-0">
                         <ShieldAlert className="w-24 h-24 text-[#ffaa00] animate-pulse" />
                    </div>
                    <div className="flex-grow">
                        <div className="font-mono text-xl md:text-2xl whitespace-pre-wrap leading-relaxed text-[#ffaa00] min-h-[200px]">
                            {transmissionText}
                            <BlinkingCursor />
                        </div>
                    </div>
                </div>
                {transmissionText.length >= fullTransmission.length && (
                     <div className="mt-8 text-right">
                        <button 
                          onClick={nextFromTransmission}
                          className="bg-[#ffaa00] text-black px-8 py-3 font-bold hover:bg-[#ffeebb] animate-bounce clip-path-slanted tracking-widest text-lg"
                        >
                          [ DECRYPT & PROCEED ]
                        </button>
                     </div>
                  )}
              </TechFrame>
           </div>
        )}

        {/* Step 4: License Agreement */}
        {currentStep === InstallStep.LICENSE_AGREEMENT && (
            <div className="w-full max-w-4xl mx-auto h-full flex flex-col justify-center">
                <TechFrame title="MILITARY_PROTOCOL" theme="green">
                    <div className="h-[400px] overflow-y-auto bg-[#001100] border border-[#004400] p-6 text-sm md:text-base font-mono leading-relaxed text-[#00cc00] shadow-inner mb-6">
                         <h3 className="text-[#ffaa00] font-bold text-xl mb-4 text-center">NON-DISCLOSURE AGREEMENT</h3>
                         <p className="mb-4">SECTION 1: CONFIDENTIALITY</p>
                         <p className="mb-4 opacity-80">
                             By accessing this terminal, you acknowledge that all data, schematics, and tactical information contained herein are classified TOP SECRET. Unauthorized dissemination of GDI/NOD operational data is punishable by court-martial or immediate execution.
                         </p>
                         <p className="mb-4">SECTION 2: ALLEGIANCE</p>
                         <p className="mb-4 opacity-80">
                             The installer agrees to utilize the installed software strictly for authorized combat simulation and command & control operations. Any attempt to reverse engineer the EVA unit will result in immediate termination of the user's command codes.
                         </p>
                         <p className="mb-4">SECTION 3: LIABILITY</p>
                         <p className="mb-4 opacity-80">
                             Westwood Studios and the Global Defense Initiative assume no responsibility for psychological trauma induced by Tiberium exposure or orbital ion cannon strikes.
                         </p>
                         <p className="mb-4 animate-pulse text-[#ffaa00]">> END OF FILE</p>
                    </div>
                    <div className="flex justify-center gap-8">
                        <button onClick={acceptLicense} className="bg-[#00ff00] text-black px-8 py-2 font-bold hover:bg-[#ffaa00] uppercase tracking-wider">[ I ACCEPT PROTOCOLS ]</button>
                    </div>
                </TechFrame>
            </div>
        )}

        {/* Step 5: Faction Select */}
        {currentStep === InstallStep.FACTION_SELECT && (
            <div className="w-full max-w-5xl mx-auto h-full flex flex-col justify-center">
                <TechFrame title="FACTION_DATA" theme="orange">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-4">
                         <button onClick={selectFaction} className="group h-64 border-2 border-[#cc8800] bg-[#221100] hover:bg-[#331500] hover:border-[#ffaa00] transition-all flex flex-col items-center justify-center relative overflow-hidden">
                             <Globe size={80} className="text-[#cc8800] mb-4 group-hover:scale-110 transition-transform" />
                             <div className="text-2xl font-bold text-[#ffaa00] tracking-widest">GDI</div>
                             <div className="text-xs text-[#cc8800] mt-2">GLOBAL DEFENSE INITIATIVE</div>
                             <div className="absolute inset-0 bg-[#ffaa00] opacity-0 group-hover:opacity-10 transition-opacity"></div>
                         </button>
                         <button onClick={selectFaction} className="group h-64 border-2 border-[#330000] bg-[#110000] hover:bg-[#220000] hover:border-[#ff0000] transition-all flex flex-col items-center justify-center relative overflow-hidden">
                             <Zap size={80} className="text-[#aa0000] mb-4 group-hover:scale-110 transition-transform" />
                             <div className="text-2xl font-bold text-[#ff0000] tracking-widest">NOD</div>
                             <div className="text-xs text-[#aa0000] mt-2">BROTHERHOOD OF NOD</div>
                             <div className="absolute inset-0 bg-[#ff0000] opacity-0 group-hover:opacity-10 transition-opacity"></div>
                         </button>
                     </div>
                     <div className="text-center mt-4 text-[#cc8800] text-xs">
                         SELECT DATA PACKET FOR DECRYPTION
                     </div>
                </TechFrame>
            </div>
        )}

        {/* Step 6: Identity Auth */}
        {currentStep === InstallStep.IDENTITY_AUTH && (
            <div className="w-full max-w-2xl mx-auto mt-20">
                <TechFrame title="COMMAND_AUTH" theme="green">
                    <div className="flex flex-col items-center p-8 space-y-8">
                        <User size={64} className="text-[#00ff00] mb-2" />
                        
                        {authStep === 0 ? (
                            <form onSubmit={submitAuth} className="w-full flex flex-col items-center space-y-6">
                                <div className="w-full">
                                    <label className="block text-xs text-[#00aa00] mb-2 tracking-widest">ENTER COMMANDER CODENAME:</label>
                                    <input 
                                        type="text" 
                                        autoFocus
                                        value={commanderName}
                                        onChange={(e) => setCommanderName(e.target.value.toUpperCase())}
                                        className="w-full bg-[#001100] border-b-2 border-[#00ff00] text-2xl text-[#ffaa00] font-mono p-2 focus:outline-none uppercase text-center"
                                        placeholder="TYPE NAME..."
                                    />
                                </div>
                                <button type="submit" className="bg-[#004400] text-[#00ff00] hover:bg-[#00ff00] hover:text-black px-8 py-2 font-bold uppercase tracking-wider transition-colors">
                                    [ AUTHENTICATE ]
                                </button>
                            </form>
                        ) : (
                            <div className="flex flex-col items-center">
                                <div className="text-2xl text-[#ffaa00] animate-pulse mb-2">VERIFYING CREDENTIALS...</div>
                                <div className="w-64 h-2 bg-[#002200] mt-4">
                                    <div className="h-full bg-[#00ff00] animate-[scanline_2s_linear_infinite]"></div>
                                </div>
                            </div>
                        )}
                    </div>
                </TechFrame>
            </div>
        )}

        {/* Step 7: Destination */}
        {currentStep === InstallStep.DESTINATION && (
           <div className="w-full max-w-4xl mx-auto h-full flex flex-col justify-center">
             <TechFrame title="TARGET_DESIGNATION" theme="green">
                <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8 mb-8 p-6 bg-[#001100]">
                   <div className="border border-[#00ff00] p-6 bg-[#002200]">
                       <HardDrive size={64} className="animate-pulse text-[#00ff00]" />
                   </div>
                   <div className="flex-grow w-full md:w-auto text-center md:text-left">
                     <div className="text-xs text-[#00aa00] mb-2 tracking-widest uppercase">Target Drive</div>
                     <div className="text-3xl md:text-5xl bg-black px-6 py-4 border-l-4 border-[#00ff00] text-shadow-glow text-[#00ff00] font-bold tracking-tight">
                       C:\WESTWOOD\C&C
                     </div>
                   </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-8 text-sm uppercase tracking-wide">
                   <div className="bg-[#002200] p-4 border-t border-[#00ff00]">
                     <div className="text-[#00aa00] mb-2">Required Space</div>
                     <div className="text-2xl text-[#00ff00]">45,291 KB</div>
                   </div>
                   <div className="bg-[#221100] p-4 border-t border-[#ffaa00]">
                     <div className="text-[#cc8800] mb-2">Available Space</div>
                     <div className="text-2xl text-[#ffaa00]">214,512 KB</div>
                   </div>
                </div>
                <div className="text-center">
                   <button 
                      onClick={confirmDestination}
                      className="bg-[#00ff00] text-black px-12 py-3 hover:bg-[#ffaa00] transition-colors font-bold text-xl skew-x-[-10deg] uppercase tracking-widest"
                    >
                      [ Confirm Target ]
                    </button>
                </div>
             </TechFrame>
           </div>
        )}

        {/* Step 8: System Check */}
        {currentStep === InstallStep.SYSTEM_CHECK && (
          <div className="w-full max-w-5xl mx-auto mt-8">
             <TechFrame title="SYS_DIAGNOSTICS" theme="green">
                 <div className="grid grid-cols-1 gap-2 p-2">
                    {SYSTEM_SPECS.map((spec, index) => (
                      <div key={index} className={`flex justify-between items-center p-3 border-b border-[#003300] transition-all duration-300 ${index <= systemCheckIndex ? 'opacity-100' : 'opacity-20'}`}>
                        <div className="flex items-center">
                            <div className={`w-2 h-2 mr-4 ${index < systemCheckIndex ? 'bg-[#00ff00]' : 'bg-[#004400]'}`}></div>
                            <span className="uppercase tracking-widest text-lg md:text-xl text-[#00cc00]">{spec.label}</span>
                        </div>
                        <span className="font-mono text-lg md:text-xl">
                           {index < systemCheckIndex && <span className="text-[#00ff00] text-shadow-glow">{spec.value}</span>}
                           {index === systemCheckIndex && <span className="animate-pulse bg-[#ffaa00] text-black px-2 font-bold">SCANNING...</span>}
                        </span>
                      </div>
                    ))}
                 </div>
                 {systemCheckIndex > SYSTEM_SPECS.length && (
                   <div className="mt-8 text-center bg-[#002200] border border-[#00ff00] p-4 animate-pulse">
                     <span className="text-[#00ff00] text-xl md:text-2xl font-bold tracking-widest">HARDWARE COMPLIANCE VERIFIED</span>
                   </div>
                 )}
             </TechFrame>
          </div>
        )}

        {/* Step 9: Sound Config */}
        {currentStep === InstallStep.SOUND_CONFIG && (
          <div className="w-full max-w-[1600px] mx-auto h-full flex flex-col justify-center">
            <TechFrame title="AUDIO_INTERFACE" className="flex-grow" theme="orange">
               <div className="flex flex-col md:flex-row gap-8 h-full">
                   <div className="flex-1 space-y-3">
                      <div className="text-xs text-[#cc8800] mb-2 uppercase tracking-widest border-b border-[#cc8800] pb-1">Select Output Device</div>
                      {[
                        { name: "Sound Blaster 16 / AWE32", icon: <Volume2 size={24} /> },
                        { name: "AdLib Gold Compatible", icon: <Cpu size={24} /> },
                        { name: "Gravis Ultrasound", icon: <HardDrive size={24} /> },
                        { name: "No Sound Device", icon: <VolumeX size={24} /> }
                      ].map((opt, idx) => (
                        <button 
                          key={idx}
                          onClick={() => handleSoundSelect(idx)}
                          onMouseEnter={() => SoundSystem.playTone(100, 'sawtooth', 0.05, 0.02)}
                          className={`w-full flex items-center p-5 border transition-all text-left group relative overflow-hidden ${soundOption === idx ? 'border-[#ffaa00] bg-[#331100]' : 'border-[#442200] bg-transparent opacity-60 hover:opacity-100 hover:border-[#884400]'}`}
                        >
                          <div className={`absolute left-0 top-0 bottom-0 w-1 ${soundOption === idx ? 'bg-[#ffaa00]' : 'bg-transparent'}`}></div>
                          <div className="mr-6 pl-2" style={{color: soundOption === idx ? '#ffaa00' : '#884400'}}>
                            {soundOption === idx ? <CheckSquare size={24} /> : <Square size={24} />}
                          </div>
                          <div className="mr-4" style={{color: soundOption === idx ? '#ffaa00' : '#cc6600'}}>
                            {opt.icon}
                          </div>
                          <span className={`text-xl font-bold tracking-wide ${soundOption === idx ? 'text-[#ffaa00] text-shadow-orange' : 'text-[#cc6600]'}`}>{opt.name}</span>
                        </button>
                      ))}
                   </div>

                   {/* Visual Feed Section */}
                   <div className="w-full md:w-5/12 flex flex-col bg-[#110500] border border-[#442200] p-1">
                      <div className="bg-[#331100] p-1 text-center text-xs text-[#ffaa00] mb-1 tracking-[0.2em] font-bold">VISUAL_FEED</div>
                      <div className="flex-grow mb-4 relative min-h-[400px]">
                         <LipSyncVisualizer isTalking={isTalking} />
                      </div>
                      <div className="flex gap-2">
                        <button 
                           onClick={testVoice}
                           disabled={isTalking}
                           className="flex-1 border border-[#ffaa00] text-[#ffaa00] py-4 hover:bg-[#331100] text-center disabled:opacity-50 text-sm tracking-widest uppercase font-bold"
                        >
                           TEST_SPEECH
                        </button>
                        <button 
                          onClick={confirmSound}
                          className="flex-1 bg-[#ffaa00] text-black py-4 font-bold hover:bg-[#ffcc66] text-sm tracking-widest uppercase"
                        >
                          INITIALIZE
                        </button>
                      </div>
                   </div>
               </div>
            </TechFrame>
          </div>
        )}

        {/* Step 10: Data Uplink */}
        {currentStep === InstallStep.DATA_UPLINK && (
            <div className="w-full max-w-3xl mx-auto flex flex-col items-center justify-center h-full">
                <TechFrame title="SAT_UPLINK" theme="green" className="w-full">
                    <div className="flex flex-col items-center p-10 space-y-8">
                        <div className="relative">
                            <Globe size={120} className="text-[#00ff00] animate-spin-slow" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Wifi size={60} className="text-[#ffaa00] animate-ping" />
                            </div>
                        </div>
                        <div className="w-full">
                            <div className="flex justify-between text-xs text-[#00aa00] mb-2 uppercase">
                                <span>Signal Strength</span>
                                <span>{progress}%</span>
                            </div>
                            <div className="w-full h-4 bg-[#002200] border border-[#004400]">
                                <div className="h-full bg-[#ffaa00]" style={{width: `${progress}%`}}></div>
                            </div>
                        </div>
                        <div className="text-[#00ff00] animate-pulse tracking-widest">
                            ESTABLISHING BATTLEFIELD CONTROL...
                        </div>
                    </div>
                </TechFrame>
            </div>
        )}

        {/* Step 11: Copying Files */}
        {currentStep === InstallStep.COPYING && (
          <div className="flex flex-col h-full justify-center space-y-6">
             <div className="flex flex-col md:flex-row gap-6 h-[500px]">
                <div className="flex-1 flex flex-col min-w-0">
                  <TechFrame title="DATA_TRANSFER" className="h-full" theme="green">
                      <div className="mb-4 flex items-center justify-between">
                         <div className="bg-[#002200] px-3 py-1 text-xs border border-[#004400] text-[#00cc00]">Target: C:\WESTWOOD\C&C</div>
                         <Zap size={16} className="text-[#ffaa00] animate-pulse" />
                      </div>
                      <ProgressBar progress={progress} label="BUFFER_STATUS" />
                      <div className="flex-grow bg-black bg-opacity-80 p-6 mt-6 overflow-hidden flex flex-col font-mono text-lg border border-[#003300] relative shadow-inner">
                          <div className="absolute top-2 right-2 p-1 opacity-50"><FileText size={16} className="animate-pulse text-[#00ff00]"/></div>
                          {logs.map((log, i) => (
                            <div key={i} className="text-[#00cc00] truncate text-sm md:text-base opacity-70">{log}</div>
                          ))}
                          <div ref={logsEndRef} />
                          <div className="text-[#00ff00] mt-2 text-base md:text-lg border-t border-[#004400] pt-2 flex items-center">
                            <span className="mr-4 text-xs font-mono text-[#006600] hidden md:inline-block w-24">ADDR:{copyAddress}</span>
                            <span className="mr-2">> Writing:</span> 
                            <span key={currentFile} className="text-[#ffaa00] font-bold animate-flash-text mr-1 bg-[#002200] px-1">
                                {currentFile}
                            </span>
                            <span className="inline-block w-3 h-5 bg-[#ffaa00] animate-pulse align-bottom ml-1"></span>
                          </div>
                      </div>
                  </TechFrame>
                </div>
                <div className="w-full md:w-5/12 h-64 md:h-full shrink-0">
                   <SchematicView progress={progress} />
                </div>
             </div>
             <div className="mt-2 flex justify-between text-xs font-mono text-[#00aa00] bg-[#001100] p-3 border-t border-b border-[#004400] tracking-widest">
                <div>PACKETS_REMAINING: {Math.floor((100 - progress) * 452)}</div>
                <div className="text-[#ffaa00]">EST_TIME: {Math.floor((100 - progress) * 0.5)}s</div>
             </div>
          </div>
        )}

        {/* Step 12: Install Success Interstitial */}
        {currentStep === InstallStep.INSTALL_SUCCESS && (
            <div className="w-full h-full flex flex-col items-center justify-center">
                <TechFrame title="SYSTEM_STATUS" theme="green">
                    <div className="p-12 flex flex-col items-center">
                        <CheckSquare size={100} className="text-[#00ff00] mb-8" />
                        <h2 className="text-4xl text-[#00ff00] font-bold tracking-widest text-center mb-4">INSTALLATION COMPLETE</h2>
                        <div className="text-[#00aa00] animate-pulse">INITIALIZING TACTICAL OVERLAY...</div>
                    </div>
                </TechFrame>
            </div>
        )}

        {/* Step 13: Complete (Finale) */}
        {currentStep === InstallStep.COMPLETE && (
          <div className="flex flex-col items-center justify-center h-full w-full relative z-50">
             <div className="relative w-full text-center px-4">
                 {/* Laser Reveal Effect */}
                 <div className="absolute inset-0 bg-[#000000] animate-[scanline_2s_ease-out_forwards] mix-blend-multiply pointer-events-none"></div>
                 
                 <h2 className="font-bold tracking-[0.1em] text-[#00ff00] whitespace-nowrap overflow-hidden text-center w-full leading-none drop-shadow-[0_0_15px_rgba(0,255,0,0.8)]" style={{fontSize: '5vw', fontFamily: 'Share Tech Mono'}}>
                   {finalWelcomeText}
                   <span className="animate-pulse text-[#ffaa00] inline-block w-[1ch] h-[0.8em] align-middle bg-[#00ff00] ml-2" style={{clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'}}></span>
                 </h2>
             </div>
             <div className={`absolute bottom-20 flex space-x-8 transition-opacity duration-1000 ${showFinalButtons ? 'opacity-100' : 'opacity-0'}`}>
                <button 
                  onClick={() => {
                    SoundSystem.playClick();
                    window.open('https://www.google.com/search?q=command+and+conquer', '_blank');
                  }}
                  className="text-[#00ff00] font-bold text-2xl hover:text-white hover:underline tracking-widest uppercase border-b-2 border-transparent hover:border-[#00ff00] pb-1 transition-all"
                >
                  [ LAUNCH MISSION ]
                </button>
                <button 
                  onClick={handleReinstall}
                  className="text-[#006600] font-bold text-2xl hover:text-[#ffaa00] hover:underline tracking-widest uppercase border-b-2 border-transparent hover:border-[#ffaa00] pb-1 transition-all"
                >
                  [ REINSTALL SYSTEM ]
                </button>
             </div>
          </div>
        )}
      </div>

      {(currentStep !== InstallStep.COMPLETE && currentStep !== InstallStep.SERIAL_INPUT) && (
        <div className="relative z-10 pt-2 pb-2 border-t border-[#003300] flex justify-between items-center text-[10px] md:text-xs opacity-70 bg-[#000800] px-4 font-mono uppercase w-full">
           <div className="text-[#006600] flex-1">GDI_DATALINK_V4.0 // <span className="text-[#ffaa00]">UNSECURE LINE</span></div>
           
           <div className="flex-1 flex justify-center">
              <button 
                onClick={cycleMusic}
                className="flex items-center gap-2 hover:bg-[#002200] px-3 py-1 border border-transparent hover:border-[#004400] transition-all group cursor-pointer"
              >
                 <Music size={12} className="text-[#00ff00] group-hover:text-[#ffaa00]" />
                 <span className="text-[#00ff00] group-hover:text-[#ffaa00]">AUDIO: TRACK 0{musicTrack + 1}</span>
              </button>
           </div>

           <div className="flex items-center space-x-6 flex-1 justify-end">
              <span>ENCRYPTION: <span className="text-[#ffaa00]">ROT-26</span></span>
              <div className="flex items-center gap-2">
                 <span>UPLINK</span>
                 <span className="w-2 h-2 rounded-full bg-[#00ff00] animate-pulse"></span>
              </div>
           </div>
        </div>
      )}
    </CRTScreen>
  );
}