import { GoogleGenAI, Type, type Schema } from "@google/genai";
import { generateDeterministicCase, generateHash } from "./utils";
import { fetchSpotifyTrackData } from "./spotify";

export interface AutopsyReport {
  fileNo: string;
  tag: string;
  title: string;
  artist: string;
  recorded: string;
  dead: string;
  status: string;
  tod: string;
  lifespan: string;
  cause: string;
  vitals: string;
  features: string[];
  associates: string;
  notes: string;
  date: string;
  albumArt?: string;

  // Rich song-specific forensic fields
  chartPeakFact?: string;
  examinerDegree?: string;
  examinerDegreeShort?: string;
  terminalHookLyric?: string;
  seizureLocation?: string;
  disposalDestination?: string;
  icdCode?: string;
  icdTitle?: string;

  waveformDiagnosis?: {
    subBass: string;
    lowMids: string;
    presence: string;
    highAir: string;
    lufs: string;
  };

  custodyEvidence?: {
    masterFormat: string;
    studioName: string;
    promoDetail: string;
    streamStat: string;
  };
}

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    actualReleaseYear: {
      type: Type.STRING,
      description: "Accurate release year of the song. e.g., '2011'",
    },
    chartPeakFact: {
      type: Type.STRING,
      description: "Real Billboard Hot 100 peak position, weeks at #1, or chart record. e.g., 'Peaked at No. 1 on Billboard Hot 100 for 8 consecutive weeks, topping charts in 26 countries.'",
    },
    examinerDegree: {
      type: Type.STRING,
      description: "Custom, hilarious satirical medical/forensic academic title for the artist reflecting their sound or hit. e.g., 'Doctor of Applied Memetic Virology and Post-Ska-Punk Forensic Audicology (D.A.M.V.)'",
    },
    examinerDegreeShort: {
      type: Type.STRING,
      description: "Short abbreviation of the examiner degree. e.g., 'D.A.M.V.' or 'M.D. (SAMPLE FORENSICS)'",
    },
    causeOfDeath: {
      type: Type.STRING,
      description: "Satirical, forensic description of why the song died, naming its specific musical/cultural flaw. e.g., 'Acute Catastrophic Body-Paint Asphyxiation complicated by Terminal Glockenspiel Satiation.'",
    },
    timeOfDeath: {
      type: Type.STRING,
      description: "The specific cultural moment, event, or exact timeframe the public officially turned on the song.",
    },
    lifespan: {
      type: Type.STRING,
      description: "Detailed description of how long the song lived at peak saturation before listeners got sick of it.",
    },
    peakVitals: {
      type: Type.STRING,
      description: "Forensic vitals combining actual BPM, key, dynamic range (LUFS), and viral stats. e.g., 'Tempo: 129 BPM | Key: D Minor | Peak Loudness: -8.5 LUFS | Shazam Velocity: 14.8M/wk'",
    },
    notableFeatures: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "3-4 bullet points citing REAL musical production details (samples, instruments, video directors, viral parodies, TV covers).",
    },
    knownAssociates: {
      type: Type.STRING,
      description: "Real producers, featured artists, sample sources, TV shows, and retail algorithms complicit in the song's death.",
    },
    autopsyNotes: {
      type: Type.STRING,
      description: "Chief Examiner's paragraph synthesizing the song's internal composition, viral explosion, and irreversible demise in a somber, clinical, deadpan coroner voice.",
    },
    terminalHookLyric: {
      type: Type.STRING,
      description: "The exact, iconic lyrical earworm snippet that listeners could not get out of their heads. e.g., 'Now you\\'re just somebody that I used to know...'",
    },
    seizureLocation: {
      type: Type.STRING,
      description: "Real or plausible recording studio, city, or venue where the master track was cut or seized.",
    },
    icdCode: {
      type: Type.STRING,
      description: "Official ICD-Audio diagnostic code. e.g., 'SA-101', 'SA-204', 'SA-312', 'SA-408', or 'SA-515'",
    },
    icdTitle: {
      type: Type.STRING,
      description: "Clinical title of the diagnosis. e.g., 'Acute Sync-Licensing Overdose' or 'Algorithmic Asphyxiation'",
    },
    disposalDestination: {
      type: Type.STRING,
      description: "Official disposal order remanding the song's remains. e.g., 'Remanded to permanent rotation on Adult Contemporary radio and grocery store PA loops.'",
    },
    waveformDiagnosis: {
      type: Type.OBJECT,
      properties: {
        subBass: {
          type: Type.STRING,
          description: "Sub-bass (20-60 Hz) diagnosis describing the track's real bassline or kick drum."
        },
        lowMids: {
          type: Type.STRING,
          description: "Low-mids (200-500 Hz) diagnosis describing the track's real instrument, guitar, piano, or sample riff."
        },
        presence: {
          type: Type.STRING,
          description: "Presence (2-4 kHz) diagnosis describing the track's vocal peak, drop, or brass frequency trauma."
        },
        highAir: {
          type: Type.STRING,
          description: "High air (10-20 kHz) diagnosis describing cymbals, hi-hats, vocal sibilance, or digital limiters."
        },
        lufs: {
          type: Type.STRING,
          description: "Realistic integrated loudness rating. e.g., '-8.5 LUFS (Fatal Compression)'"
        }
      },
      required: ["subBass", "lowMids", "presence", "highAir", "lufs"]
    },
    custodyEvidence: {
      type: Type.OBJECT,
      properties: {
        masterFormat: {
          type: Type.STRING,
          description: "Realistic master audio format. e.g., 'Original 2-inch 24-Track Tape' or 'Pro Tools 10 HD Session'"
        },
        studioName: {
          type: Type.STRING,
          description: "Real recording studio or facility where the track was recorded."
        },
        promoDetail: {
          type: Type.STRING,
          description: "Real radio promo CD, MTV music video, or soundtrack promo artifact."
        },
        streamStat: {
          type: Type.STRING,
          description: "Real streaming milestones. e.g., 'Exceeds 2.3 billion Spotify streams and 2.1 billion YouTube views.'"
        }
      },
      required: ["masterFormat", "studioName", "promoDetail", "streamStat"]
    }
  },
  required: [
    "actualReleaseYear",
    "chartPeakFact",
    "examinerDegree",
    "examinerDegreeShort",
    "causeOfDeath",
    "timeOfDeath",
    "lifespan",
    "peakVitals",
    "notableFeatures",
    "knownAssociates",
    "autopsyNotes",
    "terminalHookLyric",
    "seizureLocation",
    "icdCode",
    "icdTitle",
    "disposalDestination",
    "waveformDiagnosis",
    "custodyEvidence"
  ],
};

export async function generateAutopsy(
  title: string, 
  artist: string, 
  apiKey?: string, 
  spotifyClientId?: string, 
  spotifyClientSecret?: string
): Promise<AutopsyReport> {
  const spotifyData = await fetchSpotifyTrackData(title, artist, spotifyClientId, spotifyClientSecret);
  
  // Use real data if available, otherwise original input
  const actualTitle = spotifyData?.name || title;
  const actualArtist = spotifyData?.artist || artist;
  const albumArt = spotifyData?.albumArt || undefined;

  // If no API key is provided, use the deterministic fallback generator immediately.
  if (!apiKey) {
    if (!spotifyData) await new Promise(resolve => setTimeout(resolve, 1500));
    return {
      ...generateDeterministicCase(actualTitle, actualArtist, spotifyData),
      albumArt
    };
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const hash = generateHash((actualTitle + actualArtist).toLowerCase());
  const tagId = 100 + ((hash >> 6) % 899);
  
  const monthsArr = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  const deadMonth = monthsArr[(hash >> 8) % 12];
  const deadDay = 1 + ((hash >> 10) % 28);

  const prompt = `You are the Chief Medical Examiner at the Bureau of Forensic Acoustics and Sonic Pathology.
You are performing an exhaustive, deadpan, highly satirical yet technically accurate forensic coroner autopsy on the commercial and cultural death of the song:
TRACK TITLE: "${actualTitle}"
ARTIST / PERPETRATOR: "${actualArtist}"
${spotifyData?.releaseYear ? `CONFIRMED RELEASE YEAR: ${spotifyData.releaseYear}` : ""}

CRITICAL REQUIREMENTS (MAKE THIS INDISPUTABLY SPECIFIC TO THIS EXACT SONG):
1. RESEARCH & ACCURACY:
   - Identify the real release year, actual Billboard Hot 100 peak position (e.g., weeks at #1 or peak position), worldwide chart success, and Grammy or MTV awards.
   - Identify real musical instruments, specific key signatures, BPM, signature riffs, synthesizers, drum patterns, vocal delivery, and ANY sampled tracks or original artists (cite original composer and song sampled).
   - Identify real featured artists, producers, recording studios, mixing engineers, and record labels.
   - Identify real cultural vectors of fatal overplay: movie soundtracks (e.g. Shrek, Twilight), television features (e.g. Glee, commercials), viral video parodies, TikTok/Vine trends, or celebrity tweets that triggered hyper-saturation.
   - Pinpoint the exact cultural tipping point where the public burnt out or turned on the song (the "Time of Death").

2. EXAMINER CREDENTIAL:
   - Invent a hilarious, custom, highly tailored satirical medical/forensic degree for "${actualArtist}" that mocks or commemorates their musical style, signature sound, or hit (e.g., "Doctor of Applied Memetic Virology and Post-Ska-Punk Forensic Audicology (D.A.M.V.)").
   - Short version for badge: e.g. "D.A.M.V." or "M.D. (SAMPLE PATH.)".

3. ACOUSTIC FREQUENCY DISSECTION (Waveform Diagnosis):
   - Provide realistic, song-specific diagnostic notes for the 4 frequency bands:
     * subBass (20-60 Hz): Describe the song's actual bass/kick characteristics.
     * lowMids (200-500 Hz): Describe the specific rhythm guitar, acoustic sample, piano, or synthesizer riff in the song.
     * presence (2-4 kHz): Describe the vocal aggression, specific drop, brass, or vocal hook frequency trauma.
     * highAir (10-20 kHz): Describe the specific cymbals, hi-hats, vocal sibilance, or synth sparkle.
     * lufs: Realistic integrated loudness reading (e.g., "-8.5 LUFS" or "-6.1 LUFS").

4. CHAIN OF CUSTODY EVIDENCE:
   - seizureLocation: The real or plausible recording studio, city, or venue where the track was recorded or seized.
   - masterFormat: Realistic master recording medium (e.g., "Original 2-inch 24-Track Tape" or "Pro Tools Session").
   - studioName: Real recording facility where it was tracked or mixed.
   - promoDetail: Real radio promo, music video detail, or physical promo artifact with realistic stats.
   - streamStat: Real streaming milestones (e.g. Spotify play count, YouTube billions of views, or platinum certifications).

5. TERMINAL HOOK LYRIC:
   - Quote the exact, iconic lyrical earworm phrase from "${actualTitle}" that listeners could not get out of their heads.

6. DISPOSAL DESTINATION:
   - The clinical disposal order remanding the song's remains (e.g., "Remanded to permanent rotation in suburban supermarket PA loops, dentist waiting rooms, and nostalgia playlists.").

7. TONE:
   - Deadpan, severe, institutional, darkly satirical coroner report. Zero modern corporate SaaS fluff. Write with the clinical gravity of an official autopsy on a flatlined cadaver.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      }
    });

    if (!response.text) {
      throw new Error("No text returned from Gemini");
    }

    const data = JSON.parse(response.text);
    const recordedYear = data.actualReleaseYear || spotifyData?.releaseYear || "2010";
    const deadYear = parseInt(recordedYear) + 1 + ((hash >> 2) % 4);

    return {
      fileNo: `FILE NO. SP-${recordedYear}-${tagId} // ${actualArtist.toUpperCase()}`,
      tag: `TAG #SP-${tagId}-X`,
      title: actualTitle.toUpperCase(),
      artist: actualArtist,
      recorded: `${recordedYear}`,
      dead: `Q3 ${deadYear}`,
      status: "AUTOPSY FILED",
      tod: data.timeOfDeath,
      lifespan: data.lifespan,
      cause: data.causeOfDeath,
      vitals: data.peakVitals,
      features: data.notableFeatures,
      associates: data.knownAssociates,
      notes: data.autopsyNotes,
      date: `${deadMonth} ${deadDay} ${deadYear}`,
      albumArt: albumArt,

      chartPeakFact: data.chartPeakFact,
      examinerDegree: data.examinerDegree,
      examinerDegreeShort: data.examinerDegreeShort,
      terminalHookLyric: data.terminalHookLyric,
      seizureLocation: data.seizureLocation,
      disposalDestination: data.disposalDestination,
      icdCode: data.icdCode,
      icdTitle: data.icdTitle,
      waveformDiagnosis: data.waveformDiagnosis,
      custodyEvidence: data.custodyEvidence
    };
  } catch (error) {
    console.error("LLM Generation failed, using fallback:", error);
    return {
      ...generateDeterministicCase(actualTitle, actualArtist, spotifyData),
      albumArt
    };
  }
}
