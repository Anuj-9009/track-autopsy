import React, { useState, useEffect, useRef } from 'react';
import { Settings, FolderOpen, Printer, Share2, PlusCircle, UserCheck, BadgeInfo, Activity, Download, Loader2 } from 'lucide-react';
import { toPng } from 'html-to-image';
import { generateAutopsy, type AutopsyReport } from './api';
import { generateDeterministicCase, getArtistDegree, getArtistDegreeShort } from './utils';
import { WaveformDissection } from './components/WaveformDissection';
import { ChainOfCustody } from './components/ChainOfCustody';
import { CoronerProtocols } from './components/CoronerProtocols';

const ARCHIVED_CASES: Record<string, AutopsyReport> = {
  gotye: {
    fileNo: "FILE NO. SP-2011-0881 // DE BACKER & JOHNSON (GOTYE FT. KIMBRA)",
    tag: "TAG #SP-881-014",
    title: "SOMEBODY THAT I USED TO KNOW",
    artist: "Gotye ft. Kimbra",
    recorded: "2011",
    dead: "Q3 2013",
    status: "AUTOPSY FILED",
    tod: "August 14, 2012, at 16:42 EST: Cardiac arrest occurred following Walk Off The Earth's 5-people-one-guitar cover surpassing 175M views, compounded 48 hours later by Darren Criss & Matt Bomer singing it on Glee Season 3.",
    lifespan: "14 months in active cultural hyper-rotation; spent 8 consecutive weeks atop the US Billboard Hot 100 before listeners suffered irreversible earworm desensitization.",
    cause: "Acute Catastrophic Body-Paint Asphyxiation complicated by Terminal Nursery-Rhyme Glockenspiel Satiation and Uncontrollable Suburban Radio Over-Rotation.",
    vitals: "Tempo: 129 BPM • Key: D Minor • Dynamic Peak: -8.5 LUFS • Meter: 4/4 • Sincerity: 100% (Terminal)",
    features: [
      "Skeletal guitar motif directly sampled from Luiz Bonfá's 1967 instrumental bossa-nova track 'Seville'.",
      "Iconic stop-motion body paint music video directed by Natasha Pincus with Howard Clark geometric mural.",
      "Catalyzed worldwide viral delirium via Walk off the Earth's 5-people-one-guitar viral performance.",
      "Sudden emotional dissonance spike at 02:38 upon Kimbra's explosive vocal entry causing bilateral acoustic shock."
    ],
    associates: "Natasha Pincus (Director), Ashton Kutcher (Initial Viral Vector), Walk Off The Earth, Glee Cast, Suburban Target PA Systems.",
    notes: "Internal acoustic examination reveals a skeletal structure built around a dry two-bar loop of Luiz Bonfá's 'Seville' paired with an infantile nursery-rhyme xylophone motif. Tissue analysis indicates a slow build until 02:38, where Kimbra's counter-accusatory entrance triggers irreversible dynamic trauma. The patient was consumed by its own ubiquity.",
    date: "AUG 18 2013",
    chartPeakFact: "Peaked at No. 1 on the US Billboard Hot 100 for 8 consecutive weeks in 2012; topped charts in over 26 nations; won Grammy for Record of the Year.",
    examinerDegree: "Doctor of Musical Pathology and Acoustic Forensics (D.M.P.)",
    examinerDegreeShort: "D.M.P.",
    terminalHookLyric: "But you didn't have to cut me off / Make it like it never happened and that we were nothing / Now you're just somebody that I used to know",
    seizureLocation: "Barn Studio, Mornington Peninsula, Victoria, Australia",
    disposalDestination: "Preserved in the National Film and Sound Archive; remanded to perpetual rotation on Global Adult Contemporary Radio.",
    icdCode: "SA-104",
    icdTitle: "Acute Body-Paint Asphyxiation & Glockenspiel Satiation",
    waveformDiagnosis: {
      subBass: "Restrained kick drum pulse keeping lower frequencies uncrowded for room ambience.",
      lowMids: "Dry acoustic guitar sample from Luiz Bonfá occupying the 250Hz-500Hz register.",
      presence: "Visceral peak in 2kHz-4kHz range during Kimbra's mid-song emotional outburst at 2:38.",
      highAir: "Crisp xylophone upper harmonics and open hi-hat shimmer above 10kHz.",
      lufs: "-8.5 LUFS"
    },
    custodyEvidence: {
      masterFormat: "24-bit / 44.1kHz Digital Audio Master",
      studioName: "Samples 'n' Seconds Studio / Mornington Peninsula",
      promoDetail: "Natasha Pincus stop-motion visual project; over 2.3 billion views.",
      streamStat: "Exceeds 2.4 billion Spotify streams and 2.2 billion YouTube views."
    }
  },
  smashmouth: {
    fileNo: "FILE NO. SP-1999-0114 // SMASH MOUTH, STEVE HARWELL",
    tag: "TAG #SP-501-443",
    title: "ALL STAR",
    artist: "Smash Mouth",
    recorded: "1999",
    dead: "PERPETUAL LIMBO (2001 / REVIVED 2016)",
    status: "CHRONIC REANIMATION",
    tod: "Initial expiration May 18, 2001 via movie theater surround sound; subsequent recurring zombie re-animations driven by algorithmic irony cycles and Neil Cicierega mashup albums.",
    lifespan: "25 years ongoing cyclical post-mortem activity. Biologically immune to conventional commercial decomposition.",
    cause: "Cranial trauma caused by an L-shaped finger gesture on the forehead, followed by complete surrender to green ogre cinematography.",
    vitals: "BPM: 104 (Aggressively upbeat) • Key: F# Major • Lyric Confidence Index: 100% • Sincerity Levels: Undetectable.",
    features: [
      "Opening whistling Vox organ hook capable of triggering Pavlovian nostalgia in millennials within 400 milliseconds.",
      "Overwhelming ska-pop guitar crunch with zero dynamic respite mastered by Eric Valentine.",
      "Lyrics detailing thermodynamic existential dread masked behind bowling shirts.",
      "Unmatched capacity to sound identical regardless of speaker playback fidelity."
    ],
    associates: "DreamWorks Animation SKG, Guy Fieri (Spiritual cousin), Early 2000s Mystery Men marketing teams, Neil Cicierega (Mouth Sounds), Reddit shitposters.",
    notes: "A bizarre specimen. Despite terminal overexposure at the turn of the millennium, the corpse refused decomposition. Subsequent cultural mutations transformed the subject into an immortal internet substrate. Examiner recommends containment rather than burial.",
    date: "JUL 22 2001",
    chartPeakFact: "Peaked at No. 4 on US Billboard Hot 100 (August 1999) and No. 1 on Billboard Mainstream Top 40; triple platinum certification.",
    examinerDegree: "Doctorate of Applied Memetic Virology and Post-Ska-Punk Forensic Audicology (D.A.M.V.)",
    examinerDegreeShort: "D.A.M.V.",
    terminalHookLyric: "Somebody once told me the world is gonna roll me / I ain't the sharpest tool in the shed / She was looking kind of dumb with her finger and her thumb in the shape of an 'L' on her forehead",
    seizureLocation: "H.O.S.T. Group Studios, Redwood City, California",
    disposalDestination: "Permanently stored in the Library of Congress and queued for perpetual automated playback across global nostalgia feeds.",
    icdCode: "SA-201",
    icdTitle: "Terminal Hyper-Exposure by Ogremorphic Pop-Cultural Assimilation",
    waveformDiagnosis: {
      subBass: "Tightly controlled roll-off below 40Hz to prevent boominess on turn-of-the-millennium car stereos.",
      lowMids: "Densely packed around 250Hz-400Hz with heavy bass guitar drive and aggressive snare body.",
      presence: "Severe, unyielding peak at 3kHz-5kHz keeping Steve Harwell's vocal bark perched permanently atop the mix.",
      highAir: "Brickwall limited at 16kHz; crisp 1999 digital conversion sheen across hi-hats and organ harmonics.",
      lufs: "-6.1 Integrated LUFS (Loudness War Critical Overdose)"
    },
    custodyEvidence: {
      masterFormat: "1/2-inch Analog Master Tape bounced to 16-bit / 44.1kHz Compact Disc",
      studioName: "H.O.S.T. Group Studios (Redwood City, CA)",
      promoDetail: "Featured in Mystery Men (1999) music video, Digimon: The Movie (2000), and Shrek (2001) opening titles.",
      streamStat: "Over 1.5 Billion Spotify streams as of 2024"
    }
  },
  chainsmokers: {
    fileNo: "FILE NO. SP-2016-7711 // PALL & TAGGART, THE CHAINSMOKERS",
    tag: "TAG #SP-991-032",
    title: "CLOSER",
    artist: "The Chainsmokers feat. Halsey",
    recorded: "2016",
    dead: "Q3 2017",
    status: "CADAVER COLD",
    tod: "August 24, 2017, after being played in 12 consecutive Uber rides across a single weekend in Austin, Texas.",
    lifespan: "12 months at peak saturation; survived 12 consecutive weeks atop the Hot 100 before listeners developed severe allergic reactions.",
    cause: "Terminal financial and vehicular metaphor fatigue ('Rover that you can't afford / mattress that you stole from your roommate').",
    vitals: "BPM: 95 • Vocal Doubling Co-efficient: +14 cents • Millennial Whoop density: 9.8 instances/min • Emotional temperature: Lukewarm beer.",
    features: [
      "Plinky four-chord synth progression engineered via focus group to trigger college nostalgia.",
      "Halsey guest verse introducing sudden emotional authenticity into an otherwise synthetic ecosystem.",
      "A drop consisting almost entirely of finger snaps and a vocal chop sequence.",
      "Severe lyrical specificity regarding Boulder, Colorado and bite marks on shoulders."
    ],
    associates: "Fraternity formal planning committees, Uber drivers worldwide, Vevo lyric video animators, Dormitory hallway speakers.",
    notes: "Pathological examination confirms death by ubiquitous comfort. The recording possessed no sharp edges, allowing it to slip painlessly into commercial elevators and shopping malls until listeners simply forgot it was playing. A pristine specimen of mid-2010s trop-pop obsolescence.",
    date: "SEP 11 2017",
    chartPeakFact: "Spent 12 consecutive weeks at No. 1 on Billboard Hot 100; Diamond certified in the US (10x Platinum); 32 weeks in the Top 10.",
    examinerDegree: "Doctor of Drop Cardiology and Sub-Bass Asphyxiation (D.D.C.)",
    examinerDegreeShort: "D.D.C.",
    terminalHookLyric: "So baby pull me closer in the backseat of your Rover / That I know you can't afford / Bite that tattoo on your shoulder / Pull the sheets right off the corner of the mattress that you stole from your roommate back in Boulder",
    seizureLocation: "Hotel Suite 402, West Hollywood, CA / Conway Recording Studios",
    disposalDestination: "Remanded to the 2010s Frat Revival playlist and background loop at nationwide spin fitness franchises.",
    icdCode: "SA-101",
    icdTitle: "Acute Future-Bass Synthesizer Fatigue & Rover Metaphor Overdose",
    waveformDiagnosis: {
      subBass: "Hyper-compressed 50Hz sine sub-drop triggering floor vibration without harmonic distortion.",
      lowMids: "Clean low-mid pocket carved out at 350Hz to allow Drew Taggart's conversational vocal to sit flat.",
      presence: "Ultra-wide stereo presence boost at 3.2kHz with heavy sidechain pumping on the drop chord synthesizer.",
      highAir: "Sterile digital hi-hat click and snap samples peaking cleanly at 12kHz.",
      lufs: "-5.8 LUFS (Brickwall Drop Saturation)"
    },
    custodyEvidence: {
      masterFormat: "Ableton Live 9.5 Session / 24-bit 96kHz Digital WAV",
      studioName: "Conway Recording Studios / Hollywood, CA",
      promoDetail: "Lyric video achieved 3 billion YouTube views before official music video release.",
      streamStat: "Over 2.8 Billion Spotify streams"
    }
  },
  psy: {
    fileNo: "FILE NO. SP-2012-9904 // PARK JAE-SANG, PSY",
    tag: "TAG #SP-441-002",
    title: "GANGNAM STYLE",
    artist: "PSY",
    recorded: "2012",
    dead: "MID 2013",
    status: "ARCHIVED / RETIRED",
    tod: "June 2013, following United Nations Secretary-General Ban Ki-moon executing the horse dance in a diplomatic setting.",
    lifespan: "11 months of violent geometric viral expansion (First YouTube upload to breach 1,000,000,000 views).",
    cause: "Spontaneous digital explosion. YouTube counter buffer overflow; complete institutional absorption by morning television anchors.",
    vitals: "BPM: 132 • Bass compression: Maximum • Viral Replication Factor: R0 = 19.4 • Global Gallop Velocity: 94km/h.",
    features: [
      "Synth riff calibrated to induce involuntary equestrian choreography.",
      "Satirical critique of Seoul's luxury district completely ignored by 99% of global audience.",
      "Yellow tuxedo suit jacket preserved as critical material evidence.",
      "Elevator thrust scene cited as peak global surrealism marker."
    ],
    associates: "Scooter Braun, Ban Ki-moon, YouTube Engineering Team (who had to rewrite integer code to 64-bit), Flash mob organizers.",
    notes: "Rare case of a track that destroyed its own infrastructure. The sheer weight of 2 billion views collapsed the meme's ecological niche. Subject passed quietly after every world leader and CEO attempted the horse trot on morning television.",
    date: "JUL 01 2013",
    chartPeakFact: "First video in YouTube history to hit 1 Billion views; peaked at No. 2 on Billboard Hot 100; topped charts in over 30 countries.",
    examinerDegree: "Doctor of Viral Choreography and Equestrian Audicology (D.V.C.)",
    examinerDegreeShort: "D.V.C.",
    terminalHookLyric: "Oppan Gangnam Style / Gangnam Style / Op, op, op, op, oppan Gangnam Style / Ehhh, sexy lady / Op, op, op, op, oppan Gangnam Style",
    seizureLocation: "YG Entertainment Studio, Mapo-gu, Seoul, South Korea",
    disposalDestination: "Sealed in the Seoul Digital Time Capsule; permanently retired from all diplomatic gatherings.",
    icdCode: "SA-312",
    icdTitle: "Neon Shuffle Collapse & Equestrian Meme Overflow",
    waveformDiagnosis: {
      subBass: "Four-on-the-floor electro-house kick drum tuned to 58Hz with relentless acoustic velocity.",
      lowMids: "Aggressive distorted synth brass stabs cutting heavily across 250Hz-600Hz.",
      presence: "Psy's commanding spoken baritone accented with high-resonance filter sweeps at 2.5kHz.",
      highAir: "Open white-noise snare clap risers saturating the 8kHz-14kHz corridor.",
      lufs: "-6.4 LUFS (Club Dancefloor Maximum)"
    },
    custodyEvidence: {
      masterFormat: "Pro Tools HDX / 24-bit 48kHz Digital Master",
      studioName: "YG Entertainment Recording Suite (Seoul)",
      promoDetail: "Broke YouTube's 32-bit integer counter forcing code rewrite to 64-bit.",
      streamStat: "Over 5.2 Billion YouTube views and 850 Million Spotify streams"
    }
  }
};

function App() {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("gemini_api_key") || (import.meta.env.VITE_GEMINI_API_KEY as string) || "");
  const [spotifyId, setSpotifyId] = useState(() => localStorage.getItem("spotify_client_id") || (import.meta.env.VITE_SPOTIFY_CLIENT_ID as string) || "");
  const [spotifySecret, setSpotifySecret] = useState(() => localStorage.getItem("spotify_client_secret") || (import.meta.env.VITE_SPOTIFY_CLIENT_SECRET as string) || "");
  
  const [showSettings, setShowSettings] = useState(false);
  const [tempKey, setTempKey] = useState(apiKey);
  const [tempSpotifyId, setTempSpotifyId] = useState(spotifyId);
  const [tempSpotifySecret, setTempSpotifySecret] = useState(spotifySecret);

  const openSettings = () => {
    setTempKey(apiKey);
    setTempSpotifyId(spotifyId);
    setTempSpotifySecret(spotifySecret);
    setShowSettings(true);
  };
  
  const [titleInput, setTitleInput] = useState("Somebody That I Used to Know");
  const [artistInput, setArtistInput] = useState("Gotye ft. Kimbra");
  
  const [loading, setLoading] = useState(false);
  const [currentCase, setCurrentCase] = useState<AutopsyReport | null>(null);
  const [activeTab, setActiveTab] = useState<'registry' | 'waveform' | 'chain' | 'protocols'>('registry');
  const [toast, setToast] = useState("");

  useEffect(() => {
    // Load default case
    setCurrentCase(generateDeterministicCase(titleInput, artistInput));
  }, []);

  const saveSettings = () => {
    localStorage.setItem("gemini_api_key", tempKey);
    localStorage.setItem("spotify_client_id", tempSpotifyId);
    localStorage.setItem("spotify_client_secret", tempSpotifySecret);
    setApiKey(tempKey);
    setSpotifyId(tempSpotifyId);
    setSpotifySecret(tempSpotifySecret);
    setShowSettings(false);
    showToast("SETTINGS SAVED");
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2600);
  };

  const loadPreset = (key: string) => {
    if (ARCHIVED_CASES[key]) {
      const c = ARCHIVED_CASES[key];
      setTitleInput(c.title);
      setArtistInput(c.artist);
      setCurrentCase(c);
      showToast(`CASE FILE LOADED: ${c.title}`);
    }
  };

  const handleExamine = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleInput.trim() || !artistInput.trim()) return;

    setLoading(true);
    try {
      const report = await generateAutopsy(titleInput, artistInput, apiKey, spotifyId, spotifySecret);
      setCurrentCase(report);
      showToast(`AUTOPSY COMPLETE: ${titleInput.toUpperCase()}`);
    } catch (err) {
      console.error(err);
      showToast("EXAMINATION ERROR. USING FALLBACK PROTOCOL.");
      setCurrentCase(generateDeterministicCase(titleInput, artistInput));
    } finally {
      setLoading(false);
    }
  };

  const shareVerdict = () => {
    if (!currentCase) return;
    const shareText = `TRACK AUTOPSY REPORT // Subject: ${currentCase.title} (${currentCase.artist}) • Cause of Death: ${currentCase.cause}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText).then(() => {
        showToast("VERDICT COPIED TO BLOTTER");
      }).catch(() => {
        showToast("VERDICT LOGGED");
      });
    } else {
      showToast("VERDICT LOGGED");
    }
  };

  const [isDownloadingPng, setIsDownloadingPng] = useState(false);
  const dossierRef = useRef<HTMLDivElement>(null);
  const waveformRef = useRef<HTMLDivElement>(null);
  const custodyRef = useRef<HTMLDivElement>(null);
  const protocolsRef = useRef<HTMLDivElement>(null);

  const handleDownloadPng = async () => {
    if (!currentCase) return;

    let targetEl: HTMLElement | null = null;
    let reportType = "DOSSIER";

    if (activeTab === 'registry') {
      targetEl = dossierRef.current;
      reportType = "CASE_DOSSIER";
    } else if (activeTab === 'waveform') {
      targetEl = waveformRef.current;
      reportType = "WAVEFORM_DISSECTION";
    } else if (activeTab === 'chain') {
      targetEl = custodyRef.current;
      reportType = "CHAIN_OF_CUSTODY";
    } else if (activeTab === 'protocols') {
      targetEl = protocolsRef.current;
      reportType = "CORONER_PROTOCOLS";
    }

    if (!targetEl) return;

    setIsDownloadingPng(true);
    showToast("PREPARING ARCHIVAL PNG SNAPSHOT...");

    try {
      await new Promise((r) => setTimeout(r, 120));

      const dataUrl = await toPng(targetEl, {
        quality: 0.98,
        pixelRatio: 2,
        backgroundColor: '#ece8df',
        cacheBust: true,
        filter: (node: HTMLElement) => {
          if (node.classList && node.classList.contains('no-export')) {
            return false;
          }
          return true;
        },
      });

      const sanitizedArtist = currentCase.artist.replace(/[^a-zA-Z0-9_-]/g, '_').toUpperCase();
      const sanitizedTitle = currentCase.title.replace(/[^a-zA-Z0-9_-]/g, '_').toUpperCase();
      const filename = `TRACK_AUTOPSY_${sanitizedArtist}_${sanitizedTitle}_${reportType}.png`;

      const link = document.createElement('a');
      link.download = filename;
      link.href = dataUrl;
      link.click();
      showToast("REPORT DOWNLOADED AS PNG");
    } catch (err) {
      console.error("Failed to export high-res PNG, falling back:", err);
      try {
        const fallbackDataUrl = await toPng(targetEl, {
          quality: 0.9,
          backgroundColor: '#ece8df',
          skipFonts: true,
          filter: (node: HTMLElement) => !node.classList?.contains('no-export'),
        });
        const link = document.createElement('a');
        link.download = `TRACK_AUTOPSY_REPORT.png`;
        link.href = fallbackDataUrl;
        link.click();
        showToast("REPORT DOWNLOADED AS PNG");
      } catch (fallbackErr) {
        console.error("Fallback PNG export failed:", fallbackErr);
        showToast("PNG EXPORT FAILED - PLEASE RETRY");
      }
    } finally {
      setIsDownloadingPng(false);
    }
  };

  return (
    <div className="bg-secondary/20 text-on-surface font-body-md text-body-md min-h-screen selection:bg-primary-container selection:text-on-primary">
      <header className="fixed top-0 w-full z-50 bg-surface-container-high/95 backdrop-blur-sm shadow-[0_3px_0px_rgba(28,26,23,0.15)]">
        <div className="h-20 w-full px-gutter md:px-margin flex items-center justify-between">
          <div className="flex items-center gap-space-md">
            <div className="flex flex-col">
              <div className="flex items-center gap-space-xs">
                <span className="font-label-sm text-label-sm tracking-widest text-primary uppercase bg-secondary-container/60 px-space-xs py-0.5 border border-primary/20">RECORD GROUP 84-E</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">// CLASSIFICATION: CONFIDENTIAL</span>
              </div>
              <div className="flex items-baseline gap-space-xs">
                <span className="font-headline-md text-headline-md font-bold tracking-tight text-on-surface uppercase">TRACK AUTOPSY</span>
                <span className="hidden md:inline font-body-sm text-body-sm text-on-surface-variant">— Office of the Medical Examiner / Sonic Pathology Div.</span>
              </div>
            </div>
          </div>
          
          <nav className="hidden lg:flex items-center gap-space-sm bg-surface-variant/70 p-1 border border-outline-variant">
            <button
              onClick={() => setActiveTab('registry')}
              className={`px-space-md py-1.5 uppercase transition-all font-label-md text-label-md cursor-pointer ${
                activeTab === 'registry'
                  ? 'bg-surface-container-lowest text-primary font-bold shadow-[2px_2px_0px_#735a30]'
                  : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
              }`}
            >
              Case Registry
            </button>
            <button
              onClick={() => setActiveTab('waveform')}
              className={`px-space-md py-1.5 uppercase transition-all font-label-md text-label-md cursor-pointer ${
                activeTab === 'waveform'
                  ? 'bg-surface-container-lowest text-primary font-bold shadow-[2px_2px_0px_#735a30]'
                  : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
              }`}
            >
              Waveform Dissection
            </button>
            <button
              onClick={() => setActiveTab('chain')}
              className={`px-space-md py-1.5 uppercase transition-all font-label-md text-label-md cursor-pointer ${
                activeTab === 'chain'
                  ? 'bg-surface-container-lowest text-primary font-bold shadow-[2px_2px_0px_#735a30]'
                  : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
              }`}
            >
              Chain of Custody
            </button>
            <button
              onClick={() => setActiveTab('protocols')}
              className={`px-space-md py-1.5 uppercase transition-all font-label-md text-label-md cursor-pointer ${
                activeTab === 'protocols'
                  ? 'bg-surface-container-lowest text-primary font-bold shadow-[2px_2px_0px_#735a30]'
                  : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
              }`}
            >
              Coroner Protocols
            </button>
            <button onClick={openSettings} className="font-label-md text-label-md px-space-md py-1.5 uppercase transition-colors text-on-surface-variant hover:bg-surface-container hover:text-on-surface flex items-center gap-2 cursor-pointer">
              <Settings size={14} /> Config
            </button>
          </nav>

          <div className="flex items-center gap-space-md">
            {currentCase && (
              <button
                type="button"
                onClick={handleDownloadPng}
                disabled={isDownloadingPng}
                title="Download Current Report as PNG"
                className="no-export flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-primary text-on-primary hover:bg-primary/90 font-label-sm text-label-sm uppercase tracking-wider shadow-sm transition-all cursor-pointer font-bold disabled:opacity-50"
              >
                {isDownloadingPng ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span className="hidden sm:inline">EXPORTING...</span>
                  </>
                ) : (
                  <>
                    <Download size={14} />
                    <span className="hidden sm:inline">DOWNLOAD REPORT (PNG)</span>
                    <span className="sm:hidden">PNG</span>
                  </>
                )}
              </button>
            )}
            <div className="hidden sm:flex flex-col items-end text-right max-w-[240px]">
              <span className="font-label-sm text-label-sm uppercase text-on-surface-variant">EXAMINER ON DUTY</span>
              <span className="font-body-sm text-body-sm font-bold text-on-surface truncate w-full text-right" title={currentCase ? `Dr. ${currentCase.artist}` : "DR. H. VANE"}>
                {currentCase ? `DR. ${currentCase.artist.toUpperCase()}` : "DR. H. VANE"}, {currentCase ? (currentCase.examinerDegreeShort || getArtistDegreeShort(currentCase.artist)) : "MD (PATH.)"}
              </span>
            </div>
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <UserCheck size={18} className="text-on-primary" />
            </div>
            <button onClick={openSettings} className="lg:hidden w-8 h-8 rounded bg-surface-variant flex items-center justify-center border border-outline-variant">
              <Settings size={18} className="text-on-surface-variant" />
            </button>
          </div>
        </div>
      </header>

      <main className="w-full pt-20 bg-transparent min-h-screen">
        <div className="flex flex-col w-full">
          <div className="w-full px-gutter-mobile md:px-margin py-space-md md:py-space-xl flex flex-col items-center">
            {/* Mobile / Tablet Tab Navigation */}
            <div className="lg:hidden w-full max-w-5xl mb-space-md flex items-center justify-center gap-1 bg-surface-variant/80 p-1 border border-outline-variant">
              <button
                onClick={() => setActiveTab('registry')}
                className={`flex-1 py-1.5 uppercase text-[11px] font-label-sm text-center transition-all ${
                  activeTab === 'registry'
                    ? 'bg-surface-container-lowest text-primary font-bold shadow-sm'
                    : 'text-on-surface-variant'
                }`}
              >
                Registry
              </button>
              <button
                onClick={() => setActiveTab('waveform')}
                className={`flex-1 py-1.5 uppercase text-[11px] font-label-sm text-center transition-all ${
                  activeTab === 'waveform'
                    ? 'bg-surface-container-lowest text-primary font-bold shadow-sm'
                    : 'text-on-surface-variant'
                }`}
              >
                Waveform
              </button>
              <button
                onClick={() => setActiveTab('chain')}
                className={`flex-1 py-1.5 uppercase text-[11px] font-label-sm text-center transition-all ${
                  activeTab === 'chain'
                    ? 'bg-surface-container-lowest text-primary font-bold shadow-sm'
                    : 'text-on-surface-variant'
                }`}
              >
                Custody
              </button>
              <button
                onClick={() => setActiveTab('protocols')}
                className={`flex-1 py-1.5 uppercase text-[11px] font-label-sm text-center transition-all ${
                  activeTab === 'protocols'
                    ? 'bg-surface-container-lowest text-primary font-bold shadow-sm'
                    : 'text-on-surface-variant'
                }`}
              >
                Protocols
              </button>
            </div>

            {/* TAB VIEW: WAVEFORM DISSECTION */}
            {activeTab === 'waveform' && currentCase && (
              <div ref={waveformRef} className="w-full flex flex-col items-center">
                <WaveformDissection
                  currentCase={currentCase}
                  onBackToRegistry={() => setActiveTab('registry')}
                />
              </div>
            )}

            {/* TAB VIEW: CHAIN OF CUSTODY */}
            {activeTab === 'chain' && currentCase && (
              <div ref={custodyRef} className="w-full flex flex-col items-center">
                <ChainOfCustody
                  currentCase={currentCase}
                  onBackToRegistry={() => setActiveTab('registry')}
                />
              </div>
            )}

            {/* TAB VIEW: CORONER PROTOCOLS */}
            {activeTab === 'protocols' && currentCase && (
              <div ref={protocolsRef} className="w-full flex flex-col items-center">
                <CoronerProtocols
                  currentCase={currentCase}
                  onBackToRegistry={() => setActiveTab('registry')}
                />
              </div>
            )}

            {/* TAB VIEW: CASE REGISTRY (DEFAULT) */}
            {activeTab === 'registry' && (
              <>
                {/* HEADER / FOLDER TAB */}
                <div className="w-full max-w-5xl mb-space-lg">
                  <div className="flex items-center gap-space-xs mb-space-xs">
                    <span className="font-label-sm text-label-sm text-on-surface-variant font-bold uppercase">ARCHIVE SECTION 4</span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">/</span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant font-bold uppercase">COLD CASE LEDGER</span>
                  </div>
                  
                  <div className="relative bg-surface-container-high p-space-md md:p-space-lg shadow-md border-b-2 border-primary/20">
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-md">
                      <div className="max-w-3xl">
                        <h1 className="font-headline-xl md:font-headline-xl text-headline-xl-mobile md:text-headline-xl uppercase tracking-tight text-on-surface leading-none mb-space-xs">
                          TRACK AUTOPSY
                        </h1>
                        <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed max-w-2xl">
                          Comprehensive forensic post-mortem examination into the terminal decline, cultural fatigue, and critical flatlining of commercial audio recordings. Certified by the Bureau of Forensic Acoustics.
                        </p>
                      </div>
                      <div className="self-start lg:self-end">
                        <div className="inline-block p-1.5 rotate-[-4deg] bg-surface-container-highest shadow-sm">
                          <div className="px-space-md py-1 bg-surface-container-lowest text-primary text-center">
                            <span className="font-label-sm text-label-sm block font-bold tracking-widest leading-none">OFFICIAL POLICE EVIDENCE</span>
                            <span className="font-label-sm text-label-sm text-primary tracking-tight block mt-0.5">RESTRICTED JURISDICTION</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* INTAKE FORM */}
                <div className="w-full max-w-5xl mb-space-xl">
                  <div className="bg-surface-variant/90 p-space-md md:p-space-lg shadow-[4px_4px_0px_#735a30] relative">
                    <div className="flex items-center justify-between pb-space-xs mb-space-md">
                      <div className="flex items-center gap-space-xs">
                        <BadgeInfo size={20} className="text-secondary" />
                        <span className="font-label-lg text-label-lg uppercase tracking-wider text-on-surface font-bold">
                          CASE INTAKE DESK • REQUEST FOR EXAMINATION
                        </span>
                      </div>
                      <span className="font-label-sm text-label-sm text-on-surface-variant">SEC CLEARANCE REQ. LEVEL 3</span>
                    </div>
                    
                    <form className="space-y-space-md" onSubmit={handleExamine}>
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-space-md items-end">
                        <div className="md:col-span-5 flex flex-col">
                          <label className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant mb-1" htmlFor="track-title">
                            SUBJECT TRACK TITLE (DECEASED)
                          </label>
                          <div className="bg-surface-container-lowest px-space-sm py-2 shadow-inner">
                            <input 
                              id="track-title" 
                              type="text" 
                              value={titleInput}
                              onChange={(e) => setTitleInput(e.target.value)}
                              className="w-full bg-transparent font-body-md text-body-md text-on-surface focus:outline-none placeholder:text-outline-variant" 
                              placeholder="e.g. Gangnam Style, Closer, Bad Blood..." 
                            />
                          </div>
                        </div>
                        
                        <div className="md:col-span-5 flex flex-col">
                          <label className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant mb-1" htmlFor="track-artist">
                            PRIMARY PERPETRATOR / ARTIST OF RECORD
                          </label>
                          <div className="bg-surface-container-lowest px-space-sm py-2 shadow-inner">
                            <input 
                              id="track-artist" 
                              type="text" 
                              value={artistInput}
                              onChange={(e) => setArtistInput(e.target.value)}
                              className="w-full bg-transparent font-body-md text-body-md text-on-surface focus:outline-none placeholder:text-outline-variant" 
                              placeholder="e.g. Smash Mouth, LMFAO, The Chainsmokers..." 
                            />
                          </div>
                        </div>
                        
                        <div className="md:col-span-2">
                          <button 
                            type="submit" 
                            disabled={loading}
                            className={`w-full ${loading ? 'bg-outline text-surface-container' : 'bg-primary hover:bg-primary-container text-on-primary'} py-2.5 px-space-md font-label-md text-label-md uppercase tracking-widest flex items-center justify-center gap-1.5 shadow-[2px_2px_0px_#1d1b18] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer`}
                          >
                            <FolderOpen size={16} />
                            <span>{loading ? 'ANALYZING...' : 'EXAMINE'}</span>
                          </button>
                        </div>
                      </div>
                    </form>

                    <div className="mt-space-md pt-space-sm flex flex-col sm:flex-row sm:items-center gap-space-xs md:gap-space-sm">
                      <span className="font-label-sm text-label-sm uppercase text-on-surface-variant shrink-0">
                        LOAD ARCHIVED SPECIMEN:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {Object.entries(ARCHIVED_CASES).map(([key, c]) => (
                          <button 
                            key={key}
                            type="button" 
                            onClick={() => loadPreset(key)}
                            className="px-2 py-1 bg-surface-container hover:bg-surface-container-high font-label-sm text-label-sm text-on-surface uppercase shadow-sm cursor-pointer transition-colors"
                          >
                            {c.title}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* DOSSIER */}
                {currentCase && (
                  <div ref={dossierRef} className={`w-full max-w-5xl relative pb-space-xl transition-opacity duration-500 ${loading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                    <div className="flex justify-between items-center pr-4 -mb-1">
                      <button
                        type="button"
                        onClick={handleDownloadPng}
                        disabled={isDownloadingPng}
                        className="no-export ml-2 px-3 py-1 bg-surface-container-high hover:bg-surface-variant text-on-surface font-label-sm text-label-sm font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-[2px_-2px_0px_#735a30] transition-colors cursor-pointer disabled:opacity-50"
                        title="Download Dossier as High-Resolution PNG"
                      >
                        {isDownloadingPng ? (
                          <>
                            <Loader2 size={13} className="animate-spin text-primary" />
                            <span>GENERATING PNG...</span>
                          </>
                        ) : (
                          <>
                            <Download size={13} className="text-primary" />
                            <span>DOWNLOAD REPORT (PNG)</span>
                          </>
                        )}
                      </button>

                      <div className="bg-surface-container-high px-space-md py-1.5 shadow-[2px_-2px_0px_#735a30] relative z-10 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary/70 inline-block"></span>
                        <span className="font-label-sm text-label-sm font-bold text-on-surface tracking-wider uppercase">
                          {currentCase.fileNo}
                        </span>
                      </div>
                    </div>
                    
                    <div className="bg-surface-container p-space-md md:p-space-xl shadow-[5px_5px_0px_#735a30] relative overflow-hidden transition-all duration-300">
                      
                      <div className="absolute -top-3 left-12 w-6 h-14 pointer-events-none z-20 flex flex-col items-center">
                        <div className="w-3.5 h-12 bg-secondary/80 rounded-full shadow-sm"></div>
                        <div className="w-2 h-8 -mt-10 bg-surface-container-low rounded-full"></div>
                      </div>
                      
                      <div className="absolute top-6 right-6 md:right-12 pointer-events-none z-20 select-none flex flex-col items-end gap-2">
                        <div className="rotate-[-14deg] bg-error-container/40 p-1 shadow-sm mix-blend-multiply">
                          <div className="px-space-md py-1 bg-surface-container-lowest text-primary text-center">
                            <span className="font-headline-md text-headline-md font-bold tracking-widest uppercase block leading-none">
                              {currentCase.status}
                            </span>
                            <span className="font-label-sm text-label-sm tracking-wider uppercase text-primary block mt-0.5">
                              SONIC PATHOLOGY VERIFIED
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-surface-container-lowest p-space-md md:p-space-lg shadow-[3px_3px_0px_rgba(29,27,24,0.18)] relative rotate-[0.1deg]">
                        
                        <div className="pb-space-md mb-space-md flex flex-col md:flex-row md:items-start justify-between gap-space-md">
                          <div className="flex gap-space-md items-start">
                            {currentCase.albumArt && (
                              <div className="w-24 h-24 shrink-0 shadow-[2px_2px_0px_#1d1b18] border-2 border-surface-variant p-1 bg-surface-container-lowest rotate-[-2deg]">
                                <img src={currentCase.albumArt} alt="Album Art" crossOrigin="anonymous" className="w-full h-full object-cover grayscale contrast-125" />
                              </div>
                            )}
                            <div className="space-y-1 max-w-xl">
                              <div className="flex items-center gap-space-xs flex-wrap">
                                <span className="font-label-sm text-label-sm bg-surface-variant px-1.5 py-0.5 uppercase tracking-widest text-on-surface-variant font-bold">
                                  DECEASED SPECIMEN
                                </span>
                                <span className="font-label-sm text-label-sm text-on-surface-variant font-bold">
                                  {currentCase.tag}
                                </span>
                                {currentCase.icdCode && (
                                  <span className="bg-primary/10 text-primary font-label-sm text-label-sm px-1.5 py-0.5 uppercase tracking-wider font-bold border border-primary/20">
                                    PROTOCOL: {currentCase.icdCode}
                                  </span>
                                )}
                              </div>
                              <h2 className="font-headline-lg md:font-headline-lg text-headline-lg-mobile md:text-headline-lg font-bold uppercase tracking-tight text-on-surface pt-1">
                                {currentCase.title}
                              </h2>
                              <div className="flex flex-wrap items-center gap-x-space-md gap-y-1 font-body-md text-body-md text-on-surface-variant">
                                <div>
                                  <span className="font-label-sm text-label-sm uppercase font-bold text-on-surface">PERPETRATOR:</span>
                                  <span className="text-on-surface font-bold ml-1">{currentCase.artist}</span>
                                </div>
                                <div>•</div>
                                <div>
                                  <span className="font-label-sm text-label-sm uppercase font-bold text-on-surface">RECORDED:</span>
                                  <span className="ml-1">{currentCase.recorded}</span>
                                </div>
                                <div>•</div>
                                <div>
                                  <span className="font-label-sm text-label-sm uppercase font-bold text-primary">CERTIFIED DEAD:</span>
                                  <span className="ml-1 font-bold text-primary">{currentCase.dead}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div 
                            onClick={() => setActiveTab('waveform')}
                            className="w-full md:w-56 bg-surface-container-low p-space-sm flex flex-col justify-between self-stretch cursor-pointer border border-transparent hover:border-primary/50 hover:bg-surface-container transition-all group shadow-sm"
                            title="Click to inspect Waveform Dissection"
                          >
                            <div className="flex items-center justify-between text-on-surface-variant pb-1">
                              <span className="font-label-sm text-label-sm uppercase font-bold group-hover:text-primary transition-colors flex items-center gap-1">
                                <Activity size={12} /> SPECTROGRAM TRACE
                              </span>
                              <span className="font-label-sm text-label-sm text-primary font-bold animate-pulse">FLATLINE 0.0 Hz</span>
                            </div>
                            <div className="py-1">
                              <svg className="w-full h-12 stroke-primary fill-none" preserveAspectRatio="none" viewBox="0 0 160 40">
                                <path d="M 0 20 L 25 20 L 30 5 L 35 36 L 40 18 L 45 22 L 50 20 L 80 20 L 82 23 L 84 17 L 86 20 L 160 20" strokeLinecap="square" strokeWidth="1.75"></path>
                              </svg>
                            </div>
                            <div className="flex justify-between font-label-sm text-label-sm text-on-surface-variant pt-1 text-[9px]">
                              <span>PEAK: +6 dB</span>
                              <span className="text-primary underline font-bold group-hover:text-primary-container">DISSECT ↗</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-space-md font-body-md text-body-md text-on-surface">
                          {/* Dedicated Chart Histopathology Biopsy */}
                          {currentCase.chartPeakFact && (
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-space-xs md:gap-space-md py-space-xs bg-primary/5 px-space-xs border-l-2 border-primary">
                              <div className="md:col-span-3 flex items-start">
                                <span className="font-label-sm text-label-sm uppercase tracking-wider font-bold text-primary pt-0.5">CHART BIOPSY:</span>
                              </div>
                              <div className="md:col-span-9 text-on-surface font-body-md leading-relaxed font-bold">{currentCase.chartPeakFact}</div>
                            </div>
                          )}

                          <div className="grid grid-cols-1 md:grid-cols-12 gap-space-xs md:gap-space-md py-space-xs bg-surface-container/20 px-space-xs">
                            <div className="md:col-span-3 flex items-start">
                              <span className="font-label-sm text-label-sm uppercase tracking-wider font-bold text-on-surface-variant pt-0.5">TIME OF DEATH:</span>
                            </div>
                            <div className="md:col-span-9 text-on-surface font-body-md leading-relaxed">{currentCase.tod}</div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-12 gap-space-xs md:gap-space-md py-space-xs px-space-xs">
                            <div className="md:col-span-3 flex items-start">
                              <span className="font-label-sm text-label-sm uppercase tracking-wider font-bold text-on-surface-variant pt-0.5">ESTIMATED LIFESPAN:</span>
                            </div>
                            <div className="md:col-span-9 text-on-surface font-body-md leading-relaxed">{currentCase.lifespan}</div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-12 gap-space-xs md:gap-space-md py-space-xs bg-surface-container/20 px-space-xs">
                            <div className="md:col-span-3 flex items-start">
                              <span className="font-label-sm text-label-sm uppercase tracking-wider font-bold text-primary pt-0.5">PRIMARY CAUSE:</span>
                            </div>
                            <div className="md:col-span-9 text-on-surface font-body-md leading-relaxed font-bold">
                              {currentCase.cause}
                              {currentCase.icdTitle && (
                                <span className="block font-body-sm text-body-sm text-on-surface-variant font-normal mt-0.5">
                                  Classification: {currentCase.icdCode || 'SA-101'} — {currentCase.icdTitle}
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-12 gap-space-xs md:gap-space-md py-space-xs px-space-xs">
                            <div className="md:col-span-3 flex items-start">
                              <span className="font-label-sm text-label-sm uppercase tracking-wider font-bold text-on-surface-variant pt-0.5">PEAK VITALS:</span>
                            </div>
                            <div className="md:col-span-9 text-on-surface font-body-md leading-relaxed">{currentCase.vitals}</div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-12 gap-space-xs md:gap-space-md py-space-xs bg-surface-container/20 px-space-xs">
                            <div className="md:col-span-3 flex items-start">
                              <span className="font-label-sm text-label-sm uppercase tracking-wider font-bold text-on-surface-variant pt-0.5">NOTABLE FEATURES:</span>
                            </div>
                            <div className="md:col-span-9 text-on-surface font-body-md leading-relaxed">
                              <ul className="space-y-1.5 list-disc pl-5">
                                {currentCase.features.map((feat, i) => (
                                  <li key={i}>{feat}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-12 gap-space-xs md:gap-space-md py-space-xs px-space-xs">
                            <div className="md:col-span-3 flex items-start">
                              <span className="font-label-sm text-label-sm uppercase tracking-wider font-bold text-on-surface-variant pt-0.5">KNOWN ASSOCIATES:</span>
                            </div>
                            <div className="md:col-span-9 text-on-surface font-body-md leading-relaxed">{currentCase.associates}</div>
                          </div>

                          {/* Transcription of Fatal Earworm Hook */}
                          {currentCase.terminalHookLyric && (
                            <div className="my-space-sm p-space-sm bg-surface-container-high/70 border border-outline-variant/60 relative">
                              <div className="flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider pb-1 mb-1 border-b border-outline-variant/40">
                                <span className="text-primary font-bold flex items-center gap-1">
                                  <Activity size={12} /> TRANSCRIPTION OF FATAL EARWORM HOOK [AUDIO EVIDENCE ITEM 00-A]
                                </span>
                                <span className="text-[10px] bg-primary-fixed-dim/40 px-1 text-primary font-bold">TERMINAL NEURAL RETENTION</span>
                              </div>
                              <blockquote className="font-headline-md text-headline-md italic font-serif text-on-surface px-2 py-1 leading-snug">
                                “{currentCase.terminalHookLyric}”
                              </blockquote>
                              <div className="text-right text-[10px] text-on-surface-variant font-label-sm tracking-wider uppercase pt-0.5">
                                ACOUSTIC PATHOLOGY LAB // PERMANENT RETENTION COEFFICIENT: 99.4%
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="mt-space-lg pt-space-md bg-surface-container-low p-space-md relative">
                          <div className="flex items-center justify-between mb-space-xs">
                            <span className="font-label-sm text-label-sm uppercase font-bold tracking-widest text-on-surface">CHIEF EXAMINER'S PATHOLOGY SUMMARY</span>
                            <span className="font-label-sm text-label-sm text-on-surface-variant">TRANSCRIPTION SEC-9</span>
                          </div>
                          <p className="font-body-md text-body-md text-on-surface leading-relaxed italic mb-space-md">
                            “{currentCase.notes}”
                          </p>

                          {currentCase.disposalDestination && (
                            <div className="mt-space-sm pt-space-xs border-t border-outline-variant/40 flex items-start gap-2">
                              <span className="font-label-sm text-label-sm uppercase font-bold text-primary shrink-0">DISPOSAL ORDER:</span>
                              <span className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed font-bold">{currentCase.disposalDestination}</span>
                            </div>
                          )}
                          
                          <div className="pt-space-sm flex flex-col md:flex-row md:items-end justify-between gap-space-md">
                            <div className="flex flex-col">
                              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-bold">
                                CORONER ATTESTATION • VALIDATED UNDER PENALTY OF LAW
                              </span>
                              <div className="pt-1 flex items-baseline gap-2">
                                <span className="font-label-md text-label-md font-bold text-primary">X</span>
                                <span className="font-headline-md text-headline-md tracking-wider text-primary select-none font-bold">
                                  Dr. {currentCase.artist}, {currentCase.examinerDegree || getArtistDegree(currentCase.artist)}
                                </span>
                              </div>
                              <span className="font-label-sm text-label-sm text-on-surface-variant">
                                Chief Audio Coroner, Division of Vital Frequencies
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-space-md">
                              <div className="text-right">
                                <span className="font-label-sm text-label-sm block uppercase text-on-surface-variant">AUTOPSY DATE</span>
                                <span className="font-label-md text-label-md font-bold text-on-surface bg-surface-container px-2 py-0.5 inline-block">
                                  {currentCase.date}
                                </span>
                              </div>
                              <div className="rotate-[-6deg] bg-secondary-container/70 px-space-sm py-1 shadow-sm mix-blend-multiply">
                                <span className="font-label-sm text-label-sm block text-primary font-bold uppercase leading-none">
                                  EXAMINED
                                </span>
                                <span className="font-label-sm text-label-sm text-on-surface text-[8px] tracking-tight block">
                                  SEAL #774-AUDIO
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-space-md pt-space-sm flex flex-wrap items-center justify-between gap-space-sm">
                          <button 
                            type="button" 
                            onClick={() => setActiveTab('chain')} 
                            className="flex items-center gap-space-xs font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                          >
                            <UserCheck size={16} className="text-secondary" />
                            <span className="underline decoration-dotted">CHAIN OF CUSTODY VERIFIED BY REEL AUDIT LAB ↗</span>
                          </button>
                          <div className="no-export flex flex-wrap items-center gap-2">
                            <button 
                              type="button" 
                              onClick={handleDownloadPng} 
                              disabled={isDownloadingPng}
                              className="px-space-sm py-1 bg-primary text-on-primary hover:bg-primary/90 font-label-sm text-label-sm uppercase tracking-wider shadow-sm flex items-center gap-1.5 cursor-pointer transition-colors font-bold disabled:opacity-50"
                              title="Download full archival post-mortem report as high-resolution PNG"
                            >
                              {isDownloadingPng ? (
                                <>
                                  <Loader2 size={15} className="animate-spin" />
                                  <span>GENERATING PNG...</span>
                                </>
                              ) : (
                                <>
                                  <Download size={15} />
                                  <span>DOWNLOAD REPORT (PNG)</span>
                                </>
                              )}
                            </button>
                            <button type="button" onClick={() => window.print()} className="px-space-sm py-1 bg-surface-variant hover:bg-surface-container font-label-sm text-label-sm text-on-surface uppercase tracking-wider shadow-sm flex items-center gap-1 cursor-pointer transition-colors">
                              <Printer size={15} />
                              <span>PRINT DOSSIER</span>
                            </button>
                            <button type="button" onClick={shareVerdict} className="px-space-sm py-1 bg-surface-variant hover:bg-surface-container font-label-sm text-label-sm text-on-surface uppercase tracking-wider shadow-sm flex items-center gap-1 cursor-pointer transition-colors">
                              <Share2 size={15} />
                              <span>SHARE VERDICT</span>
                            </button>
                            <button type="button" onClick={() => { setTitleInput(""); setArtistInput(""); setCurrentCase(null); }} className="px-space-sm py-1 bg-surface-variant hover:bg-surface-container font-label-sm text-label-sm text-on-surface uppercase tracking-wider shadow-sm flex items-center gap-1 cursor-pointer transition-colors">
                              <PlusCircle size={15} />
                              <span>EXHUME ANOTHER</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Toast */}
        <div className={`fixed bottom-6 right-6 bg-inverse-surface text-inverse-on-surface px-space-md py-2 shadow-lg font-label-sm text-label-sm uppercase tracking-widest transition-opacity duration-300 pointer-events-none z-50 ${toast ? 'opacity-100' : 'opacity-0'}`}>
          {toast}
        </div>
        
        {/* Settings Modal */}
        {showSettings && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-surface-container p-space-lg shadow-xl max-w-md w-full border border-outline-variant">
              <h2 className="font-headline-md text-headline-md mb-2">Configuration</h2>
              <p className="font-body-sm text-on-surface-variant mb-4">
                Enter your API keys below. If left blank, the system will use the procedural fallback generator (no AI or Spotify data).
              </p>
              
              <label className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant block mb-1">Google Gemini API Key</label>
              <input
                type="password"
                placeholder="AIzaSy..."
                value={tempKey}
                onChange={(e) => setTempKey(e.target.value)}
                className="w-full bg-surface-container-lowest p-2 border border-outline font-body-md mb-4"
              />

              <label className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant block mb-1">Spotify Client ID</label>
              <input
                type="text"
                placeholder="Spotify Client ID"
                value={tempSpotifyId}
                onChange={(e) => setTempSpotifyId(e.target.value)}
                className="w-full bg-surface-container-lowest p-2 border border-outline font-body-md mb-4"
              />

              <label className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant block mb-1">Spotify Client Secret</label>
              <input
                type="password"
                placeholder="Spotify Client Secret"
                value={tempSpotifySecret}
                onChange={(e) => setTempSpotifySecret(e.target.value)}
                className="w-full bg-surface-container-lowest p-2 border border-outline font-body-md mb-4"
              />

              <div className="flex justify-end gap-2 mt-2">
                <button onClick={() => setShowSettings(false)} className="px-4 py-2 border border-outline font-label-sm text-label-sm uppercase">Cancel</button>
                <button onClick={saveSettings} className="px-4 py-2 bg-primary text-on-primary font-label-sm text-label-sm uppercase">Save</button>
              </div>
            </div>
          </div>
        )}
      </main>
      
      <footer className="w-full bg-surface-container-high py-space-lg border-t border-outline-variant/60">
        <div className="w-full px-gutter md:px-margin flex flex-col md:flex-row items-center justify-between gap-space-md">
          <div className="flex flex-col items-center md:items-start">
            <span className="font-label-sm text-label-sm uppercase text-on-surface-variant">BUREAU OF FORENSIC ACOUSTICS • DIVISION OF VITAL FREQUENCIES</span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">Physical Document Archive System • Series 1958-B • Station Blotter 09</span>
          </div>
          <div className="flex items-center gap-space-lg text-center md:text-right">
            <span className="font-label-sm text-label-sm uppercase text-primary border border-primary/40 px-2 py-0.5">SECURITY CLEARANCE LEVEL 4 REQUIRED</span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">© MMXXIV Office of the Medical Examiner. Unlawful transcription strictly prohibited.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
