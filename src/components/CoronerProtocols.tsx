import React, { useState } from 'react';
import type { AutopsyReport } from '../api';
import { getArtistDegree } from '../utils';

interface CoronerProtocolsProps {
  currentCase: AutopsyReport;
  onBackToRegistry: () => void;
}

export const CoronerProtocols: React.FC<CoronerProtocolsProps> = ({ currentCase }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [petitionSubmitted, setPetitionSubmitted] = useState(false);
  const [petitionTrack, setPetitionTrack] = useState("");
  const [petitionPathology, setPetitionPathology] = useState("CODE SA-101: Acute Sync-Licensing Overdose");
  const [petitionLocation, setPetitionLocation] = useState("");

  const degree = getArtistDegree(currentCase.artist);
  const currentCaseCode = currentCase.icdCode || "SA-101";
  const currentCaseTitle = currentCase.icdTitle || "Acute Sync-Licensing Overdose";

  const baseIcdCodes = [
    {
      code: "SA-101",
      title: "Acute Sync-Licensing Overdose",
      vector: "Automobile ad campaigns, Greek yogurt televised spots, unskippable pre-roll clips.",
      prognosis: "Terminal (99.8%)",
      prognosisBadge: "bg-primary/10 text-primary"
    },
    {
      code: "SA-109",
      title: "Chronic Karaoke Lacerations",
      vector: "Intoxicated amateur choruses shredding vocal cords at 02:14 AM; micro-tonal damage.",
      prognosis: "Permanent Spasm",
      prognosisBadge: "bg-secondary-container text-on-secondary-container"
    },
    {
      code: "SA-204",
      title: "Algorithmic Asphyxia",
      vector: "Submersion beneath recommended chill-hop / study background auto-play chains.",
      prognosis: "Brain Death",
      prognosisBadge: "bg-primary/10 text-primary"
    },
    {
      code: "SA-312",
      title: "Neon Shuffle Collapse",
      vector: "Post-viral dance craze exhaustion; immediate full-body stiffness in wedding venues.",
      prognosis: "Rigor Mortis",
      prognosisBadge: "bg-surface-container-high text-on-surface-variant"
    },
    {
      code: "SA-408",
      title: "Nostalgia Vault Remandment",
      vector: "Permanent quarantine inside commercial 'Best of the 90s' compilation syndication.",
      prognosis: "Cryogenic Hold",
      prognosisBadge: "bg-tertiary text-on-tertiary"
    },
    {
      code: "SA-515",
      title: "Whistle-Hook Atrophy",
      vector: "Manufactured earworm degeneration; listener repulsion after 14th day of exposure.",
      prognosis: "Irreversible",
      prognosisBadge: "bg-primary/10 text-primary"
    }
  ];

  const hasMatchingCode = baseIcdCodes.some(c => c.code.toLowerCase() === currentCaseCode.toLowerCase());
  const icdCodes = hasMatchingCode
    ? baseIcdCodes.map(c => c.code.toLowerCase() === currentCaseCode.toLowerCase() 
        ? { ...c, title: currentCaseTitle || c.title, isActive: true } 
        : c)
    : [
        {
          code: currentCaseCode,
          title: currentCaseTitle,
          vector: `Direct statutory observation from "${currentCase.title}" autopsy: ${currentCase.cause}`,
          prognosis: "Confirmed Deceased",
          prognosisBadge: "bg-primary text-on-primary font-bold",
          isActive: true
        },
        ...baseIcdCodes
      ];

  const filteredCodes = icdCodes.filter(c => 
    c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.vector.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePetitionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPetitionSubmitted(true);
    setTimeout(() => {
      setPetitionSubmitted(false);
      setIsModalOpen(false);
      setPetitionTrack("");
      setPetitionLocation("");
    }, 2800);
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto flex flex-col gap-space-xl animate-fade-in pb-space-xl">
      {/* TOP DOSSIER BANNER & TAB HEADER */}
      <div className="relative bg-surface-container-high p-space-md md:p-space-lg shadow-md border-b-2 border-primary/20">
        <div className="flex flex-wrap items-center justify-between gap-space-sm pb-space-sm border-b border-outline-variant/60">
          <div className="flex items-center gap-space-xs flex-wrap">
            <span className="font-label-sm text-label-sm bg-primary text-on-primary px-space-sm py-0.5 uppercase tracking-widest font-bold">
              DIRECTIVE 84-M
            </span>
            <span className="font-label-sm text-label-sm bg-secondary-container text-on-secondary-container px-space-sm py-0.5 uppercase font-bold">
              CONFIDENTIAL REGULATORY MANUAL
            </span>
            <span className="font-label-sm text-label-sm text-on-surface-variant font-bold">
              // REV. OCTOBER 1984
            </span>
          </div>
          <div className="flex items-center gap-space-xs text-on-surface-variant">
            <span className="material-symbols-outlined text-[16px]">folder_special</span>
            <span className="font-label-sm text-label-sm uppercase tracking-wider">REF: AUD-NECRO-772</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-md pt-space-sm">
          <div className="max-w-3xl">
            <div className="font-label-md text-label-md text-primary uppercase font-bold tracking-wider mb-space-xs">
              Office of the Chief Sonic Medical Examiner // Legal & Pathological Mandate
            </div>
            <h1 className="font-headline-xl text-headline-xl text-on-surface uppercase tracking-tight font-bold">
              CORONER PROTOCOLS & STATUTORY REGULATIONS
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant mt-space-xs leading-relaxed">
              Standard clinical operating procedures, criteria for legally certifying commercial sound flatlining, statutory definitions of acoustic cadavers, and mandatory internment ordinances for defunct frequency artifacts.
            </p>
          </div>

          {/* RUBBER STAMP GRAPHIC */}
          <div className="relative self-start lg:self-auto flex items-center justify-center">
            <div className="transform -rotate-6 px-space-md py-space-xs border-4 border-double border-primary text-primary font-label-lg text-label-lg uppercase tracking-widest opacity-85 select-none bg-surface-container-low shadow-sm">
              APPROVED METHODOLOGY
              <div className="font-label-sm text-label-sm text-center tracking-normal text-primary/80 -mt-0.5">
                DIV. AUDIT SEC-9
              </div>
            </div>
          </div>
        </div>

        {/* METADATA ROSTER BAR */}
        <div className="mt-space-md pt-space-sm bg-surface-container-low p-space-sm flex flex-wrap items-center justify-between gap-space-md text-on-surface border border-outline-variant/60">
          <div className="flex items-center gap-space-md flex-wrap">
            <div className="flex items-center gap-space-xs">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">AUTHORIZING BODY:</span>
              <span className="font-body-sm text-body-sm font-bold">BOARD OF ACOUSTIC INQUEST</span>
            </div>
            <span className="text-outline-variant font-label-sm">|</span>
            <div className="flex items-center gap-space-xs">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">JURISDICTION:</span>
              <span className="font-body-sm text-body-sm font-bold">ALL TERRESTRIAL & DIGITAL EMISSIONS</span>
            </div>
            <span className="text-outline-variant font-label-sm">|</span>
            <div className="flex items-center gap-space-xs">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">VALIDITY:</span>
              <span className="font-body-sm text-body-sm font-bold text-primary">PERPETUAL / BINDING</span>
            </div>
          </div>
          <div className="flex items-center gap-space-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></span>
            <span className="font-label-sm text-label-sm text-primary uppercase font-bold tracking-wider">
              REGULATORY MONITORS LIVE
            </span>
          </div>
        </div>
      </div>

      {/* ACTIVE CASE INQUEST STATUS BANNER */}
      <div className="bg-surface-container p-space-md shadow-[4px_4px_0px_#735a30] border-2 border-primary/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md">
        <div className="flex items-start gap-space-sm">
          <div className="p-2.5 bg-primary text-on-primary font-bold font-label-md shrink-0 flex items-center justify-center shadow-sm">
            <span className="material-symbols-outlined text-[24px]">gavel</span>
          </div>
          <div>
            <div className="flex items-center gap-space-xs flex-wrap">
              <span className="font-label-sm text-label-sm bg-primary text-on-primary px-1.5 py-0.5 uppercase font-bold">
                ACTIVE INQUEST SPECIMEN
              </span>
              <span className="font-label-sm text-label-sm text-primary font-bold">
                DIAGNOSTIC CODE: {currentCase.icdCode || 'SA-101'}
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant font-bold">
                // FILE NO. {currentCase.fileNo}
              </span>
            </div>
            <h2 className="font-headline-md text-headline-md text-on-surface uppercase font-bold mt-0.5">
              "{currentCase.title}" — {currentCase.artist}
            </h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 leading-snug">
              Statutory Diagnosis: <strong className="text-on-surface font-semibold">{currentCase.icdTitle || currentCase.cause}</strong>. Prescribed disposal route: <strong className="text-primary uppercase font-semibold">{currentCase.disposalDestination || 'Class-IV Commercial Deadpool'}</strong>.
            </p>
          </div>
        </div>
        <div className="shrink-0 flex items-center gap-space-xs bg-surface-container-high px-space-sm py-1.5 border border-outline-variant/60 shadow-inner">
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">LEAD EXAMINER:</span>
          <span className="font-label-sm text-label-sm font-bold text-on-surface uppercase">DR. {currentCase.artist} ({currentCase.examinerDegreeShort || 'M.D.'})</span>
        </div>
      </div>

      {/* MAIN DOSSIER SPLIT: 12 COLUMNS ASYMMETRICAL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
        {/* LEFT COLUMN: 8 COLS - THE 5 CRITERIA & CLINICAL PROTOCOLS */}
        <div className="lg:col-span-8 flex flex-col gap-space-lg">
          {/* SECTION 1: THE 5 STATUTORY CRITERIA FOR CULTURAL DEATH */}
          <div className="bg-surface-container-lowest p-space-md md:p-space-lg shadow-sm border border-outline-variant/60 relative">
            <div className="flex items-center justify-between pb-space-md border-b border-outline-variant/60">
              <div className="flex items-center gap-space-xs">
                <span className="font-label-sm text-label-sm bg-tertiary text-on-tertiary px-space-xs py-0.5 uppercase font-bold">
                  SOP-014
                </span>
                <h2 className="font-headline-md text-headline-md text-on-surface uppercase tracking-tight font-bold">
                  The 5 Statutory Criteria for Cultural Death
                </h2>
              </div>
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">PAGE 03 OF 12</span>
            </div>

            <p className="font-body-sm text-body-sm text-on-surface-variant my-space-md leading-relaxed">
              Prior to the execution of a Sonic Death Certificate (Form DC-89), an assigned audio medical examiner must document the irreversible manifestation of at least <strong className="text-on-surface">three (3)</strong> of the subsequent statutory threshold phenomena.
            </p>

            {/* PROTOCOL LIST */}
            <div className="flex flex-col gap-space-md">
              {/* PROTOCOL 1 */}
              <div className="bg-surface-container-low p-space-md transition-all hover:bg-surface-container border border-outline-variant/40">
                <div className="flex items-start justify-between gap-space-sm">
                  <div className="flex items-center gap-space-sm">
                    <div className="w-7 h-7 bg-primary text-on-primary font-label-md text-label-md font-bold flex items-center justify-center">
                      01
                    </div>
                    <div>
                      <h3 className="font-headline-md text-headline-md text-on-surface uppercase font-bold">
                        The Supermarket Frequency Threshold
                      </h3>
                      <div className="font-label-sm text-label-sm text-primary uppercase tracking-wider">
                        STATUTE REF: § 18-SUB-MKT
                      </div>
                    </div>
                  </div>
                  <span className="font-label-sm text-label-sm bg-secondary-container/80 text-on-secondary-container px-space-xs py-0.5 uppercase font-bold">
                    ATMOSPHERIC RIGOR
                  </span>
                </div>
                <p className="font-body-md text-body-md text-on-surface mt-space-sm leading-normal">
                  Subject audio piece is verified to be broadcasting concurrently in four thousand (4,000) or more commercial grocery chain produce aisles, department store elevators, or airport transfer walkways without explicit voluntary listener agency.
                </p>
                <div className="mt-space-sm pt-space-xs flex items-center justify-between text-on-surface-variant font-body-sm text-body-sm bg-surface-container-high/60 px-space-sm py-1 border border-outline-variant/30">
                  <span>Diagnostic Indicator: Involuntary Hum Frequency (~120Hz)</span>
                  <span className="font-label-sm text-label-sm text-error font-bold uppercase">THRESHOLD EXCEEDED</span>
                </div>
              </div>

              {/* PROTOCOL 2 */}
              <div className="bg-surface-container-low p-space-md transition-all hover:bg-surface-container border border-outline-variant/40">
                <div className="flex items-start justify-between gap-space-sm">
                  <div className="flex items-center gap-space-sm">
                    <div className="w-7 h-7 bg-primary text-on-primary font-label-md text-label-md font-bold flex items-center justify-center">
                      02
                    </div>
                    <div>
                      <h3 className="font-headline-md text-headline-md text-on-surface uppercase font-bold">
                        Acoustic Saturation Ceiling
                      </h3>
                      <div className="font-label-sm text-label-sm text-primary uppercase tracking-wider">
                        STATUTE REF: § 44-LUFS-MAX
                      </div>
                    </div>
                  </div>
                  <span className="font-label-sm text-label-sm bg-secondary-container/80 text-on-secondary-container px-space-xs py-0.5 uppercase font-bold">
                    DYNAMIC COLLAPSE
                  </span>
                </div>
                <p className="font-body-md text-body-md text-on-surface mt-space-sm leading-normal">
                  Integrated Loudness measuring hotter than <strong className="text-primary">-7.0 LUFS</strong> across eighty percent (80%) of entire signal duration. Auditory tissue inspection reveals total loss of transient dynamics, causing irreversible neuro-auditory blunting in test subjects.
                </p>
                <div className="mt-space-sm pt-space-xs flex items-center justify-between text-on-surface-variant font-body-sm text-body-sm bg-surface-container-high/60 px-space-sm py-1 border border-outline-variant/30">
                  <span>Clinical Test: Brickwall Limiter Micro-Cerebral Microphony</span>
                  <span className="font-label-sm text-label-sm text-error font-bold uppercase">TERMINAL SQUASH</span>
                </div>
              </div>

              {/* PROTOCOL 3 */}
              <div className="bg-surface-container-low p-space-md transition-all hover:bg-surface-container border border-outline-variant/40">
                <div className="flex items-start justify-between gap-space-sm">
                  <div className="flex items-center gap-space-sm">
                    <div className="w-7 h-7 bg-primary text-on-primary font-label-md text-label-md font-bold flex items-center justify-center">
                      03
                    </div>
                    <div>
                      <h3 className="font-headline-md text-headline-md text-on-surface uppercase font-bold">
                        Algorithmic Asphyxiation
                      </h3>
                      <div className="font-label-sm text-label-sm text-primary uppercase tracking-wider">
                        STATUTE REF: § 92-FEED-AUTO
                      </div>
                    </div>
                  </div>
                  <span className="font-label-sm text-label-sm bg-secondary-container/80 text-on-secondary-container px-space-xs py-0.5 uppercase font-bold">
                    VITAL CESSATION
                  </span>
                </div>
                <p className="font-body-md text-body-md text-on-surface mt-space-sm leading-normal">
                  Autonomous forced insertion into twelve (12) or more automated platform autoplay queues while organic human catalogue queries register less than one percent (1.0%) of total streaming volume over thirty (30) daylight cycles.
                </p>
                <div className="mt-space-sm pt-space-xs flex items-center justify-between text-on-surface-variant font-body-sm text-body-sm bg-surface-container-high/60 px-space-sm py-1 border border-outline-variant/30">
                  <span>Verification Method: Bot-Net Cluster Tracing • Server Audit 4</span>
                  <span className="font-label-sm text-label-sm text-error font-bold uppercase">ZERO WILL DETECTED</span>
                </div>
              </div>

              {/* PROTOCOL 4 */}
              <div className="bg-surface-container-low p-space-md transition-all hover:bg-surface-container border border-outline-variant/40">
                <div className="flex items-start justify-between gap-space-sm">
                  <div className="flex items-center gap-space-sm">
                    <div className="w-7 h-7 bg-primary text-on-primary font-label-md text-label-md font-bold flex items-center justify-center">
                      04
                    </div>
                    <div>
                      <h3 className="font-headline-md text-headline-md text-on-surface uppercase font-bold">
                        Meme Parody Critical Mass
                      </h3>
                      <div className="font-label-sm text-label-sm text-primary uppercase tracking-wider">
                        STATUTE REF: § 61-VIR-MUT
                      </div>
                    </div>
                  </div>
                  <span className="font-label-sm text-label-sm bg-secondary-container/80 text-on-secondary-container px-space-xs py-0.5 uppercase font-bold">
                    MEMETIC NECROSIS
                  </span>
                </div>
                <p className="font-body-md text-body-md text-on-surface mt-space-sm leading-normal">
                  Subject acoustic motif has generated in excess of two thousand five hundred (2,500) derivative fifteen-second parody clips, sped-up nightcore adaptations, or solo acoustic ukulele covers, fully eroding original semantic emotional intent.
                </p>
                <div className="mt-space-sm pt-space-xs flex items-center justify-between text-on-surface-variant font-body-sm text-body-sm bg-surface-container-high/60 px-space-sm py-1 border border-outline-variant/30">
                  <span>Pathology: Chronic Mimetic Degradation // Loss of Originality</span>
                  <span className="font-label-sm text-label-sm text-error font-bold uppercase">SOUL DISSOLUTION</span>
                </div>
              </div>

              {/* PROTOCOL 5 */}
              <div className="bg-surface-container-low p-space-md transition-all hover:bg-surface-container border border-outline-variant/40">
                <div className="flex items-start justify-between gap-space-sm">
                  <div className="flex items-center gap-space-sm">
                    <div className="w-7 h-7 bg-primary text-on-primary font-label-md text-label-md font-bold flex items-center justify-center">
                      05
                    </div>
                    <div>
                      <h3 className="font-headline-md text-headline-md text-on-surface uppercase font-bold">
                        Terminal Silence / Flatline Certification
                      </h3>
                      <div className="font-label-sm text-label-sm text-primary uppercase tracking-wider">
                        STATUTE REF: § 05-FLAT-ZERO
                      </div>
                    </div>
                  </div>
                  <span className="font-label-sm text-label-sm bg-secondary-container/80 text-on-secondary-container px-space-xs py-0.5 uppercase font-bold">
                    IRREVERSIBLE SILENCE
                  </span>
                </div>
                <p className="font-body-md text-body-md text-on-surface mt-space-sm leading-normal">
                  Zero (0) unprompted, spontaneous peer-to-peer conversational mentions recorded across certified communication channels for one hundred eighty (180) consecutive calendar days. Absolute cultural hypothermia.
                </p>
                <div className="mt-space-sm pt-space-xs flex items-center justify-between text-on-surface-variant font-body-sm text-body-sm bg-surface-container-high/60 px-space-sm py-1 border border-outline-variant/30">
                  <span>Inquest Status: Definitive Clinical Cessation (Post-Mortem Form 9)</span>
                  <span className="font-label-sm text-label-sm text-primary font-bold uppercase">READY FOR INTERNMENT</span>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: OFFICIAL ICD-AUDIO PATHOLOGY CODE DIRECTORY */}
          <div className="bg-surface-container-lowest p-space-md md:p-space-lg shadow-sm border border-outline-variant/60">
            <div className="flex flex-col md:flex-row md:items-center justify-between pb-space-sm gap-space-xs border-b border-outline-variant/60">
              <div>
                <div className="font-label-sm text-label-sm text-primary uppercase font-bold">
                  DIRECTORY ARCHIVE // SECT. 4
                </div>
                <h2 className="font-headline-md text-headline-md text-on-surface uppercase font-bold">
                  Official ICD-Audio Diagnostic Directory
                </h2>
              </div>
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="FILTER BY CODE OR SYMPTOM..."
                  className="bg-transparent border-b-2 border-on-surface py-1 px-space-xs font-body-sm text-body-sm placeholder:text-on-surface-variant focus:outline-none focus:border-primary w-64"
                />
                <span className="material-symbols-outlined text-[18px] text-on-surface-variant -ml-6 pointer-events-none">
                  search
                </span>
              </div>
            </div>

            {/* TABULATED EVIDENCE DIRECTORY */}
            <div className="overflow-x-auto mt-space-md">
              <table className="w-full text-left font-body-md text-body-md">
                <thead>
                  <tr className="bg-surface-container-high text-on-surface font-label-sm text-label-sm uppercase">
                    <th className="p-space-sm tracking-wider">ICD Code</th>
                    <th className="p-space-sm tracking-wider">Clinical Designation</th>
                    <th className="p-space-sm tracking-wider">Primary Vector / Symptom</th>
                    <th className="p-space-sm tracking-wider">Prognosis</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container-high">
                  {filteredCodes.map((item) => {
                    const isCurrent = item.code.toLowerCase() === currentCaseCode.toLowerCase();
                    return (
                      <tr 
                        key={item.code} 
                        className={`transition-colors ${
                          isCurrent 
                            ? "bg-primary/15 border-l-4 border-primary font-semibold" 
                            : "hover:bg-surface-container-low"
                        }`}
                      >
                        <td className="p-space-sm font-label-md text-label-md font-bold text-primary whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <span>{item.code}</span>
                            {isCurrent && (
                              <span className="font-label-sm text-[10px] bg-primary text-on-primary px-1 py-0.2 uppercase font-bold tracking-wider">
                                SPECIMEN
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-space-sm font-bold text-on-surface">
                          {item.title}
                        </td>
                        <td className="p-space-sm text-on-surface-variant font-body-sm text-body-sm">
                          {item.vector}
                        </td>
                        <td className="p-space-sm">
                          <span className={`font-label-sm text-label-sm px-space-xs py-0.5 font-bold uppercase ${item.prognosisBadge}`}>
                            {item.prognosis}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredCodes.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-space-md text-center text-on-surface-variant font-body-sm">
                        No ICD-Audio pathology matches "{searchTerm}".
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-space-md flex items-center justify-between text-on-surface-variant font-body-sm text-body-sm pt-space-xs border-t border-outline-variant/60">
              <span>Showing {filteredCodes.length} of {icdCodes.length} Codified Auditory Pathologies</span>
              <span className="font-label-sm text-label-sm uppercase text-primary font-bold">ANNEXURE B-7 AVAILABLE UPON REQUEST</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: 4 COLS - DISPOSAL, EXHUMATION & ATTESTATION */}
        <div className="lg:col-span-4 flex flex-col gap-space-lg">
          {/* SECTION 3: POST-MORTEM DISPOSAL REGULATIONS */}
          <div className="bg-surface-container-high p-space-md shadow-sm relative border border-outline-variant/60">
            <div className="flex items-center justify-between pb-space-xs border-b border-outline-variant/60">
              <span className="font-label-sm text-label-sm uppercase font-bold text-primary">TITLE 48 // CHAPTER II</span>
              <span className="material-symbols-outlined text-[18px] text-on-surface-variant">delete_forever</span>
            </div>
            <h2 className="font-headline-md text-headline-md text-on-surface uppercase font-bold mt-1">
              Disposal Ordinances
            </h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-xs leading-relaxed">
              Following certification, the sonic artifact must be routed to one of the statutory internment zones within 72 hours.
            </p>

            {/* Song-specific Disposal Destination Callout */}
            {currentCase.disposalDestination && (
              <div className="mt-space-sm p-space-sm bg-surface-container-lowest border-2 border-primary/70 shadow-sm">
                <div className="font-label-sm text-label-sm text-primary uppercase font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">verified</span>
                  SPECIMEN ROUTING MANDATE
                </div>
                <div className="font-body-sm text-body-sm text-on-surface mt-1 leading-snug">
                  Artifact <strong className="text-on-surface">"{currentCase.title}"</strong> assigned to: <span className="text-primary font-bold uppercase">{currentCase.disposalDestination}</span>.
                </div>
              </div>
            )}

            <div className="flex flex-col gap-space-sm mt-space-md">
              <div className="bg-surface-container-lowest p-space-sm border border-outline-variant/40">
                <div className="flex items-center justify-between">
                  <span className="font-label-sm text-label-sm font-bold text-on-surface uppercase">01. Muzak Substation</span>
                  <span className="font-label-sm text-label-sm text-primary uppercase font-bold">CODE: ZONE-A</span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  Stripped of lead vocal stem; down-sampled to 22kHz, low-pass filtered at 3kHz for endless background dental office playback.
                </p>
              </div>
              <div className="bg-surface-container-lowest p-space-sm border border-outline-variant/40">
                <div className="flex items-center justify-between">
                  <span className="font-label-sm text-label-sm font-bold text-on-surface uppercase">02. TV Re-Run Purgatory</span>
                  <span className="font-label-sm text-label-sm text-primary uppercase font-bold">CODE: ZONE-B</span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  Faded underneath mid-scene transition dialogues in syndicated 1990s sitcom broadcasts on local broadcast UHF stations.
                </p>
              </div>
              <div className="bg-surface-container-lowest p-space-sm border border-outline-variant/40">
                <div className="flex items-center justify-between">
                  <span className="font-label-sm text-label-sm font-bold text-on-surface uppercase">03. Bar Jukebox Quarantine</span>
                  <span className="font-label-sm text-label-sm text-primary uppercase font-bold">CODE: ZONE-C</span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  Restricted to touch-screen jukeboxes positioned beyond 50 feet of bowling alley taprooms; fee increased to 3 credits to disincentivize play.
                </p>
              </div>
            </div>
          </div>

          {/* SECTION 4: EXHUMATION & REVIVAL STATUTES */}
          <div className="bg-surface-container-lowest p-space-md shadow-sm relative border border-outline-variant/60">
            <div className="flex items-center justify-between pb-space-xs border-b border-outline-variant/60">
              <span className="font-label-sm text-label-sm uppercase font-bold text-secondary">EXCLUSION PROTOCOL</span>
              <span className="material-symbols-outlined text-[18px] text-secondary">history_edu</span>
            </div>
            <h2 className="font-headline-md text-headline-md text-on-surface uppercase font-bold mt-1">
              Rules for Case Exhumation
            </h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-xs leading-relaxed">
              Statutory grounds under which a culturally deceased track may be legally reclassified as living or culturally active:
            </p>
            <ul className="flex flex-col gap-space-sm mt-space-sm font-body-sm text-body-sm">
              <li className="flex items-start gap-space-xs bg-surface-container-low p-space-xs border border-outline-variant/30">
                <span className="material-symbols-outlined text-primary text-[16px] mt-0.5">check_box</span>
                <div>
                  <strong className="text-on-surface uppercase font-bold">Indie Auteur Placement:</strong> Unedited placement across end credits of an A24 or Cannes-recognized motion picture.
                </div>
              </li>
              <li className="flex items-start gap-space-xs bg-surface-container-low p-space-xs border border-outline-variant/30">
                <span className="material-symbols-outlined text-primary text-[16px] mt-0.5">check_box</span>
                <div>
                  <strong className="text-on-surface uppercase font-bold">Subcultural Recontextualization:</strong> Adoption by skate, drift, or underground dance cliques devoid of irony.
                </div>
              </li>
              <li className="flex items-start gap-space-xs bg-surface-container-low p-space-xs border border-outline-variant/30">
                <span className="material-symbols-outlined text-primary text-[16px] mt-0.5">check_box</span>
                <div>
                  <strong className="text-on-surface uppercase font-bold">Decadal Nostalgia Reset:</strong> Passage of twenty-five (25) astronomical years from original date of flatline certification.
                </div>
              </li>
            </ul>
            <div className="mt-space-md pt-space-xs border-t border-outline-variant/60">
              <div className="font-label-sm text-label-sm text-on-surface-variant uppercase mb-1">PETITION TIME LIMIT:</div>
              <div className="font-body-sm text-body-sm text-on-surface">Hearings require 3 sworn testimony affidavits from certified acoustic witnesses.</div>
            </div>
          </div>

          {/* SECTION 5: OFFICIAL SEAL, ATTESTATION & ACTIONS */}
          <div className="bg-surface-container-high p-space-md shadow-sm relative flex flex-col gap-space-md border border-outline-variant/60">
            <div className="flex items-center gap-space-sm">
              {/* Inline SVG Wax/Ink Seal */}
              <svg className="w-16 h-16 flex-shrink-0 text-primary" fill="none" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="46" stroke="currentColor" strokeDasharray="4 2" strokeWidth="3"></circle>
                <circle cx="50" cy="50" r="38" stroke="currentColor" strokeWidth="1.5"></circle>
                <polygon fill="none" points="50,18 60,38 82,41 66,56 70,78 50,67 30,78 34,56 18,41 40,38" stroke="currentColor" strokeWidth="1.5"></polygon>
                <text className="font-label-sm" fill="currentColor" fontSize="8" fontWeight="bold" textAnchor="middle" x="50" y="52">BOARD OF</text>
                <text className="font-label-sm" fill="currentColor" fontSize="7" fontWeight="bold" textAnchor="middle" x="50" y="60">INQUEST</text>
              </svg>
              <div>
                <div className="font-label-sm text-label-sm text-primary uppercase font-bold">LEGAL ATTESTATION</div>
                <div className="font-body-sm text-body-sm font-bold text-on-surface uppercase">Dr. {currentCase.artist}, {currentCase.examinerDegreeShort || 'M.D.'}</div>
                <div className="font-label-sm text-label-sm text-on-surface-variant">{currentCase.examinerDegree || degree}</div>
              </div>
            </div>

            <div className="bg-surface-container-lowest p-space-sm font-body-sm text-body-sm text-on-surface-variant leading-tight border border-outline-variant/40">
              "I hereby attest under criminal acoustic liability that the standard operating procedures documented in Directive 84-M represent statutory law for sonic necropsy."
            </div>

            {/* SIGNATURE LINE */}
            <div className="pt-space-xs flex flex-col gap-1">
              <div className="font-label-sm text-label-sm text-on-surface-variant uppercase">SIGNATURE OF EXAMINER:</div>
              <div className="font-headline-md text-headline-md text-primary tracking-widest select-none -mt-1 font-bold font-serif">
                × Dr. {currentCase.artist}, {currentCase.examinerDegreeShort || 'M.D.'}
              </div>
              <div className="w-full h-0.5 bg-on-surface"></div>
              <div className="flex justify-between font-label-sm text-label-sm text-on-surface-variant pt-0.5">
                <span>OFFICE OF VITAL FREQUENCIES</span>
                <span>DATE: {currentCase.date}</span>
              </div>
            </div>

            {/* BUTTON CALL TO ACTIONS */}
            <div className="flex flex-col gap-space-xs pt-space-xs">
              <button
                onClick={() => alert("TRANSMITTING DIRECTIVE 84-M (REVISED). ARCHIVAL FACSIMILE COPY READY.")}
                className="w-full bg-surface-container-lowest text-on-surface font-label-md text-label-md uppercase tracking-wider py-space-sm px-space-md hover:bg-on-surface hover:text-surface-container-lowest transition-all shadow-sm flex items-center justify-center gap-space-xs cursor-pointer border border-outline"
              >
                <span className="material-symbols-outlined text-[18px]">download</span>
                <span>Download Full Directive (PDF)</span>
              </button>
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full bg-primary text-on-primary font-label-md text-label-md uppercase tracking-wider py-space-sm px-space-md hover:bg-primary-container transition-all shadow-sm flex items-center justify-center gap-space-xs cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">assignment_turned_in</span>
                <span>Submit Inquest Petition</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM EVIDENCE VAULT FOOTNOTE NOTIFICATION */}
      <div className="bg-surface-container-high p-space-sm flex flex-col sm:flex-row items-center justify-between gap-space-sm text-on-surface-variant font-label-sm text-label-sm uppercase border border-outline-variant/60">
        <div className="flex items-center gap-space-xs">
          <span className="material-symbols-outlined text-primary text-[16px]">gavel</span>
          <span>Statutory Authority: 14 U.S.C. § 902 • Sonic Corpse Protection Act</span>
        </div>
        <div>
          <span>CLASSIFICATION: CONFIDENTIAL PROTOCOL HANDBOOK // COPY NO. 042</span>
        </div>
      </div>

      {/* INTERACTIVE MODAL FOR INQUEST PETITION */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-inverse-surface/60 backdrop-blur-sm flex items-center justify-center p-space-md animate-fade-in">
          <div className="bg-surface-container-lowest p-space-lg max-w-lg w-full shadow-2xl relative border-2 border-outline">
            <div className="flex items-center justify-between pb-space-sm border-b border-outline-variant/60">
              <div className="flex items-center gap-space-xs">
                <span className="font-label-sm text-label-sm bg-primary text-on-primary px-space-xs py-0.5 uppercase font-bold">
                  FORM IP-12
                </span>
                <h3 className="font-headline-md text-headline-md text-on-surface uppercase font-bold">
                  Inquest Petition
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-on-surface-variant hover:text-primary font-bold text-headline-md cursor-pointer"
              >
                ×
              </button>
            </div>

            {petitionSubmitted ? (
              <div className="py-space-lg text-center">
                <div className="inline-block p-2 bg-error-container/60 mb-2 border border-primary text-primary font-label-md font-bold uppercase">
                  PETITION ENTERED INTO COURT BLOTTER
                </div>
                <p className="font-body-md text-body-md text-on-surface">
                  DOCKET CASE #1984-{Math.floor(1000 + Math.random() * 9000)} FILED.
                </p>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  An acoustic audit squad has been dispatched to investigate {petitionTrack || currentCase.title}.
                </p>
              </div>
            ) : (
              <>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-xs leading-relaxed">
                  Submit suspected cadaverous audio track for statutory autopsy review. An acoustic pathology examiner will be assigned within forty-eight (48) hours.
                </p>

                <form className="flex flex-col gap-space-md mt-space-md" onSubmit={handlePetitionSubmit}>
                  <div>
                    <label className="block font-label-sm text-label-sm text-on-surface uppercase mb-1 font-bold">
                      Track Designation • Artist / Commercial Title
                    </label>
                    <input
                      type="text"
                      required
                      value={petitionTrack}
                      onChange={(e) => setPetitionTrack(e.target.value)}
                      placeholder="E.G., SUMMER LOVE ANTHEM - REMIX"
                      className="w-full bg-surface-container-low border-b-2 border-on-surface px-space-xs py-1.5 font-body-md text-body-md focus:outline-none focus:border-primary text-on-surface placeholder:text-on-surface-variant/60"
                    />
                  </div>

                  <div>
                    <label className="block font-label-sm text-label-sm text-on-surface uppercase mb-1 font-bold">
                      Suspected Primary Pathology
                    </label>
                    <select
                      value={petitionPathology}
                      onChange={(e) => setPetitionPathology(e.target.value)}
                      className="w-full bg-surface-container-low border-b-2 border-on-surface px-space-xs py-1.5 font-body-md text-body-md focus:outline-none focus:border-primary text-on-surface"
                    >
                      <option>CODE SA-101: Acute Sync-Licensing Overdose</option>
                      <option>CODE SA-109: Chronic Karaoke Lacerations</option>
                      <option>CODE SA-204: Algorithmic Asphyxia</option>
                      <option>CODE SA-312: Neon Shuffle Collapse</option>
                      <option>CODE SA-408: Nostalgia Vault Remandment</option>
                      <option>CODE SA-515: Whistle-Hook Atrophy</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-label-sm text-label-sm text-on-surface uppercase mb-1 font-bold">
                      Location of Last Known Unprompted Broadcast
                    </label>
                    <input
                      type="text"
                      required
                      value={petitionLocation}
                      onChange={(e) => setPetitionLocation(e.target.value)}
                      placeholder="E.G., DENTIST WAITING ROOM, SEATTLE WA"
                      className="w-full bg-surface-container-low border-b-2 border-on-surface px-space-xs py-1.5 font-body-md text-body-md focus:outline-none focus:border-primary text-on-surface placeholder:text-on-surface-variant/60"
                    />
                  </div>

                  <div className="flex items-center gap-space-xs pt-space-xs">
                    <input
                      type="checkbox"
                      id="certCheck"
                      required
                      className="w-4 h-4 text-primary bg-surface-container-low focus:ring-0 cursor-pointer"
                    />
                    <label htmlFor="certCheck" className="font-body-sm text-body-sm text-on-surface-variant cursor-pointer">
                      I certify under penalty of ear damage that subject has ceased vital cultural resonance.
                    </label>
                  </div>

                  <div className="flex items-center justify-end gap-space-sm pt-space-sm border-t border-outline-variant/60">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="bg-surface-container text-on-surface px-space-md py-space-xs font-label-sm text-label-sm uppercase hover:bg-surface-container-high cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-primary text-on-primary px-space-md py-space-xs font-label-sm text-label-sm uppercase font-bold hover:bg-primary-container shadow-sm cursor-pointer"
                    >
                      File Inquest
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
