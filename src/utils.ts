import type { SpotifyData } from "./spotify";

export function generateHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

export function getArtistDegree(artist: string): string {
  const degrees = [
    "M.D. (Path.), Ph.D. (Sonic Forensics)",
    "M.D., FACS (Cranial Acoustics)",
    "Ph.D. (Acoustic Pathology & Algorithmic Decay)",
    "M.D. (Auditory Post-Mortem Systems)",
    "Sc.D., M.D. (Acoustic Traumatology)",
    "D.M.A., M.D. (Forensic Musicology)",
    "M.D. (Harmonic Decomposition & Audio Necrosis)",
    "Ph.D. in Frequency Atrophy, M.D. (Sonic Path.)"
  ];
  const hash = generateHash(artist);
  return degrees[hash % degrees.length];
}

export function getArtistDegreeShort(artist: string): string {
  const degrees = [
    "M.D. (PATH.)",
    "PH.D. (FORENSICS)",
    "M.D., FACS",
    "SC.D. (ACOUSTICS)",
    "M.D. (SONIC PATH.)",
    "D.M.A., M.D."
  ];
  const hash = generateHash(artist);
  return degrees[hash % degrees.length];
}

export function generateDeterministicCase(title: string, artist: string, spotifyData?: SpotifyData | null) {
  const hash = generateHash((title + artist).toLowerCase());
  
  // Use hash to deterministically generate dates and case numbers
  // year between 2000 and 2023
  const year = spotifyData?.releaseYear || (2000 + (hash % 24)).toString();
  const deadYear = parseInt(year) + 1 + ((hash >> 2) % 4);
  const months = 3 + ((hash >> 4) % 18);
  const tagId = 100 + ((hash >> 6) % 899);
  
  const monthsArr = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  const deadMonth = monthsArr[(hash >> 8) % 12];
  const deadDay = 1 + ((hash >> 10) % 28);
  
  const vitalsStr = `BPM: ${110 + (hash % 30)} • Loudness: -7.2 LUFS • Organic Resonance: Flat • Terminal Replay Value: 0.04%`;
  const degree = getArtistDegree(artist);
  const degreeShort = getArtistDegreeShort(artist);

  return {
    fileNo: `FILE NO. SP-${year}-${tagId} // ${artist.toUpperCase()}`,
    tag: `TAG #SP-${tagId}-X`,
    title: title.toUpperCase(),
    artist: artist,
    recorded: `${year}`,
    dead: `Q3 ${deadYear}`,
    status: "AUTOPSY FILED",
    tod: `Official flatline certified circa ${deadYear} following acute listener desensitization across all streaming algorithms and supermarket loudspeakers.`,
    lifespan: `${months} months in active cultural circulation before fatal rotation fatigue set in.`,
    cause: `Irreversible hook asphyxiation exacerbated by secondary viral derivative fatigue and algorithmic over-indexing.`,
    vitals: vitalsStr,
    features: [
      `Repetitive melodic phrase designed for instant neural capture, followed by steep listener burnout.`,
      `High initial viral velocity followed by catastrophic drops in Shazam retention curves.`,
      `Unsubstantiated claims of organic grassroots growth contradicted by label payola records.`,
      `Specimen exhibited immediate onset of listener eye-rolling upon unprompted speaker playback.`
    ],
    associates: `Short-form video influencers, Target commercial sync coordinators, Overzealous wedding DJs.`,
    notes: `Examination of "${title}" by ${artist} demonstrates classic symptoms of accelerated cultural consumption. Subject burned bright and brief. Coroner recommends safe internment in the digital streaming archives with strictly limited anniversary playback.`,
    date: `${deadMonth} ${deadDay} ${deadYear}`,

    chartPeakFact: `Peaked inside the Top 10 on the Global Digital Charts before catastrophic streaming churn.`,
    examinerDegree: degree,
    examinerDegreeShort: degreeShort,
    terminalHookLyric: `"${title} (Terminal Chorale Repetition)"`,
    seizureLocation: `Audio Custody Vault #${10 + (hash % 89)} • Commercial Radio Archive`,
    disposalDestination: `Remanded to permanent quarantine inside regional supermarket PA rotation and 2010s nostalgia playlists.`,
    icdCode: `SA-${100 + (hash % 415)}`,
    icdTitle: `Acute Algorithmic Asphyxiation & Hook Atrophy`,
    waveformDiagnosis: {
      subBass: `High-pass filtered at 38Hz to eliminate sub-cabinet boominess during retail broadcast.`,
      lowMids: `Slight contour scoop between 300Hz-500Hz to maximize synthetic punch.`,
      presence: `Aggressive +3.4 dB presence shelf across 2.8kHz-4kHz driving vocal earworm fatigue.`,
      highAir: `Terminal brickwall limiter ceiling at 16.5kHz with negligible dynamic decay.`,
      lufs: `-7.4 LUFS (Critical Over-Compression)`
    },
    custodyEvidence: {
      masterFormat: `24-bit / 48kHz Digital PCM Session`,
      studioName: `Primary Production Facility`,
      promoDetail: `Radio station promotional master file with high compression flags.`,
      streamStat: `Multi-platinum digital streaming tier exceeded before broadcast cessation.`
    }
  };
}
