import React, { useState } from 'react';
import type { AutopsyReport } from '../api';
import { getArtistDegree, generateHash } from '../utils';

interface ChainOfCustodyProps {
  currentCase: AutopsyReport;
  onBackToRegistry: () => void;
}

export const ChainOfCustody: React.FC<ChainOfCustodyProps> = ({ currentCase }) => {
  const [stampText, setStampText] = useState("[ RE-AFFIX AUDIT STAMP ]");
  const [stampAffixed, setStampAffixed] = useState(false);

  const hash = generateHash(currentCase.title + currentCase.artist);
  const degree = getArtistDegree(currentCase.artist);
  const year = currentCase.recorded || "2012";

  const handleStamp = () => {
    setStampText("[ AUDIT STAMP AFFIXED - 14:02 UTC ]");
    setStampAffixed(true);
    setTimeout(() => {
      setStampText("[ RE-AFFIX AUDIT STAMP ]");
      setStampAffixed(false);
    }, 3500);
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto flex flex-col gap-space-xl animate-fade-in pb-space-xl">
      {/* TOP FOLDER TAB & MASTHEAD DOSSIER */}
      <div className="relative bg-surface-container-low shadow-[4px_4px_0px_rgba(29,27,24,0.25)] rounded-t-lg">
        {/* Simulated Manila Top Binder Tab */}
        <div className="absolute -top-7 left-6 bg-surface-container-low px-space-lg py-1 rounded-t-md shadow-[0_-2px_4px_rgba(0,0,0,0.06)] flex items-center gap-space-md border-t border-x border-outline-variant/60">
          <span className="font-label-sm text-label-sm tracking-widest text-primary uppercase font-bold">
            DOC. B-77 // ARCHIVE VAULT
          </span>
          <div className="w-2.5 h-2.5 rounded-full bg-secondary/40"></div>
          <span className="font-label-sm text-label-sm text-on-surface-variant font-bold">
            CUSTODY CHAIN MASTER
          </span>
        </div>

        {/* Simulated Staple Top Right */}
        <div className="absolute top-3 right-6 w-8 h-2 bg-neutral-700 rounded-sm shadow-inner rotate-3 opacity-80"></div>

        <div className="p-space-lg md:p-space-xl flex flex-col gap-space-md">
          <div className="flex flex-wrap items-center justify-between gap-space-sm">
            <div className="flex items-center gap-space-sm flex-wrap">
              <span className="bg-primary text-on-primary font-label-sm text-label-sm px-space-sm py-0.5 tracking-widest uppercase">
                FORM 77-B
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant tracking-wider uppercase">
                EVIDENCE LOG & PHYSICAL REEL RECOVERY // BUREAU OF RECORDED ARTIFACTS
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-error animate-ping"></span>
              <span className="font-label-sm text-label-sm font-bold text-error uppercase tracking-widest">
                VAULT LOCK ENGAGED
              </span>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-lg">
            <div className="max-w-3xl">
              <h1 className="font-headline-xl text-headline-xl uppercase tracking-tight text-on-surface leading-tight">
                CHAIN OF CUSTODY & EVIDENCE MANIFEST
              </h1>
              <p className="font-body-md text-body-md text-on-surface-variant mt-space-xs">
                Official un-tampered chronological transfer logs, seizure warrants, seized physical master tapes, radio promo CD-Rs, and digital streaming transit records for <strong className="text-on-surface">"{currentCase.title}"</strong>. All acoustic properties cataloged post-seizure.
              </p>
            </div>

            {/* Rubber Stamp Header Status */}
            <div className="self-start lg:self-center shrink-0">
              <div className="rotate-[-3deg] border-2 border-primary text-primary px-space-md py-1.5 uppercase font-label-lg text-label-lg tracking-[0.25em] font-bold shadow-[2px_2px_0px_#5d0705] bg-surface/80 mix-blend-multiply">
                SEALED IN EVIDENCE
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CASE DOCKET & VAULT STORAGE SPECIFICATION SUMMARY (Asymmetric Ledger Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-space-md">
        {/* Left 4 Columns: Ledger Docket Card */}
        <div className="md:col-span-4 bg-surface-container p-space-md md:p-space-lg shadow-[3px_3px_0px_#735a30] flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-surface-variant/40 -rotate-45 translate-x-8 -translate-y-8"></div>
          <div className="flex flex-col gap-space-md">
            <div className="flex items-center justify-between pb-space-xs border-b border-outline-variant/60">
              <span className="font-label-sm text-label-sm text-primary uppercase font-bold tracking-widest">// PRIMARY CASE DOCKET</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">SERIAL {currentCase.tag || "881-A"}</span>
            </div>
            <div className="space-y-space-sm">
              <div>
                <div className="font-label-sm text-label-sm text-on-surface-variant uppercase">Case File Identification</div>
                <div className="font-headline-md text-headline-md text-on-surface font-bold uppercase tracking-wide">
                  {currentCase.fileNo}
                </div>
              </div>
              <div>
                <div className="font-label-sm text-label-sm text-on-surface-variant uppercase">Subject / Specimen Composition</div>
                <div className="font-body-lg text-body-lg text-primary font-bold">{currentCase.title}</div>
                <div className="font-body-sm text-body-sm text-on-surface-variant">{currentCase.artist} • Division Master</div>
              </div>
              <div>
                <div className="font-label-sm text-label-sm text-on-surface-variant uppercase">Seizure Location & Lock</div>
                <div className="font-body-md text-body-md text-on-surface font-bold">
                  {currentCase.seizureLocation || `Locker Box #${10 + (hash % 89)} • Shelf ${19 + (hash % 10)}-B • Crypt 4`}
                </div>
                <div className="font-body-sm text-body-sm text-on-surface-variant">Temp: 18.2°C • Humidity: 39% Regulated</div>
              </div>
              <div>
                <div className="font-label-sm text-label-sm text-on-surface-variant uppercase">Investigative Lead Officer</div>
                <div className="font-body-md text-body-md text-on-surface font-bold">
                  Dr. {currentCase.artist}
                </div>
                <div className="font-body-sm text-body-sm text-on-surface-variant">
                  {currentCase.examinerDegree || degree}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-space-lg pt-space-sm">
            <div className="bg-surface-container-high p-space-sm text-center border border-outline-variant/60">
              <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-bold">
                WARRANT NO. {400 + (hash % 199)}-SOUND-VIC
              </span>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                Approved by Magistrates Court of Acoustic Pathology
              </p>
            </div>
          </div>
        </div>

        {/* Right 8 Columns: Live Evidence Custody Timeline / Metric Gauges */}
        <div className="md:col-span-8 bg-surface-container-low p-space-md md:p-space-lg shadow-[3px_3px_0px_rgba(29,27,24,0.15)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-space-sm mb-space-md border-b border-outline-variant/60">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-[20px]">security</span>
                <span className="font-label-md text-label-md font-bold uppercase tracking-wider text-on-surface">
                  ACOUSTIC EVIDENCE STATUS & CUSTODIAL METRICS
                </span>
              </div>
              <span className="font-label-sm text-label-sm px-2 py-0.5 bg-secondary/15 text-secondary font-bold uppercase">
                4 PIECES LODGED
              </span>
            </div>

            {/* Mini Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-sm mb-space-md">
              <div className="bg-surface-container p-space-sm border border-outline-variant/40">
                <div className="font-label-sm text-label-sm text-on-surface-variant uppercase">Airplay Saturation</div>
                <div className="font-headline-md text-headline-md font-bold text-primary">99.8%</div>
                <div className="font-body-sm text-body-sm text-on-surface-variant">Critical Overexposure</div>
              </div>
              <div className="bg-surface-container p-space-sm border border-outline-variant/40">
                <div className="font-label-sm text-label-sm text-on-surface-variant uppercase">Magnetic Drift</div>
                <div className="font-headline-md text-headline-md font-bold text-secondary">0.04%</div>
                <div className="font-body-sm text-body-sm text-on-surface-variant">Stable Reel Matrix</div>
              </div>
              <div className="bg-surface-container p-space-sm border border-outline-variant/40">
                <div className="font-label-sm text-label-sm text-on-surface-variant uppercase">Groove Wear Index</div>
                <div className="font-headline-md text-headline-md font-bold text-error">Grade 4</div>
                <div className="font-body-sm text-body-sm text-on-surface-variant">Heavy Surface Scratch</div>
              </div>
              <div className="bg-surface-container p-space-sm border border-outline-variant/40">
                <div className="font-label-sm text-label-sm text-on-surface-variant uppercase">Seals Intact</div>
                <div className="font-headline-md text-headline-md font-bold text-on-surface">4 / 4</div>
                <div className="font-body-sm text-body-sm text-on-surface-variant">Tamper Void Secure</div>
              </div>
            </div>

            {/* Coarse Frequency Spectrogram Representation */}
            <div className="bg-surface-container p-space-sm flex flex-col gap-1 border border-outline-variant/60">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">
                  FORENSIC SPECTRUM EMISSION PATTERN • MASTER TAPE 01-A
                </span>
                <span className="font-label-sm text-label-sm text-primary font-bold uppercase truncate max-w-[320px] text-right">
                  VITALS: {currentCase.vitals.split('•')[0] || `${120 + (hash % 30)} BPM`}
                </span>
              </div>
              <div className="h-16 w-full flex items-end gap-[3px] bg-surface-container-high p-2 overflow-hidden border border-outline-variant/40">
                <div className="bg-on-surface w-full h-[30%]"></div>
                <div className="bg-on-surface w-full h-[45%]"></div>
                <div className="bg-on-surface w-full h-[60%]"></div>
                <div className="bg-primary w-full h-[85%]"></div>
                <div className="bg-primary w-full h-[95%]"></div>
                <div className="bg-primary w-full h-[70%]"></div>
                <div className="bg-on-surface w-full h-[40%]"></div>
                <div className="bg-on-surface w-full h-[25%]"></div>
                <div className="bg-on-surface w-full h-[50%]"></div>
                <div className="bg-primary w-full h-[100%]"></div>
                <div className="bg-primary w-full h-[90%]"></div>
                <div className="bg-on-surface w-full h-[65%]"></div>
                <div className="bg-on-surface w-full h-[35%]"></div>
                <div className="bg-on-surface w-full h-[48%]"></div>
                <div className="bg-primary w-full h-[80%]"></div>
                <div className="bg-on-surface w-full h-[55%]"></div>
                <div className="bg-on-surface w-full h-[20%]"></div>
                <div className="bg-on-surface w-full h-[30%]"></div>
                <div className="bg-on-surface w-full h-[40%]"></div>
                <div className="bg-primary w-full h-[75%]"></div>
                <div className="bg-on-surface w-full h-[60%]"></div>
                <div className="bg-on-surface w-full h-[35%]"></div>
                <div className="bg-on-surface w-full h-[15%]"></div>
                <div className="bg-on-surface w-full h-[45%]"></div>
              </div>
            </div>
          </div>
          <div className="mt-space-md flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm">
            <span>DEPOSIT CLEARANCE: STATION BLOTTER 09</span>
            <span className="uppercase tracking-widest text-primary font-bold">DIGITAL AUDIT VERIFIED MMXXIV</span>
          </div>
        </div>
      </div>

      {/* CHRONOLOGICAL EVIDENCE TRANSFER LEDGER (Vintage Police Blotter Ledger) */}
      <div className="bg-surface-container-low shadow-[3px_3px_0px_#735a30] p-space-md md:p-space-lg flex flex-col gap-space-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs pb-space-sm border-b border-outline-variant/60">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-primary text-[22px]">history_edu</span>
            <h2 className="font-headline-md text-headline-md uppercase text-on-surface tracking-wide">
              CHRONOLOGICAL EVIDENCE TRANSFER LEDGER
            </h2>
          </div>
          <span className="font-label-sm text-label-sm tracking-widest text-on-surface-variant uppercase">
            FORM 77-B • ARTICLE 4 SEC. 12
          </span>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left font-body-sm text-body-sm">
            <thead>
              <tr className="bg-surface-container font-label-sm text-label-sm text-on-surface uppercase tracking-wider">
                <th className="p-space-sm">Item Designation</th>
                <th className="p-space-sm">Date / Timestamp</th>
                <th className="p-space-sm">Source / Transferor</th>
                <th className="p-space-sm">Facility / Recipient</th>
                <th className="p-space-sm">Purpose & Custody Action</th>
                <th className="p-space-sm text-right">Seal Clearance</th>
              </tr>
            </thead>
            <tbody className="text-on-surface">
              {/* Row 1 */}
              <tr className="bg-surface-container-lowest/60 hover:bg-surface-container-high transition-colors border-b border-outline-variant/30">
                <td className="p-space-sm font-bold text-primary font-label-md text-label-md">
                  ITEM 01-A
                  <span className="block font-body-sm text-body-sm text-on-surface-variant font-normal">
                    {currentCase.custodyEvidence?.masterFormat || 'Original 2" 24-Track Master Reel'}
                  </span>
                </td>
                <td className="p-space-sm font-label-sm text-label-sm">
                  18-AUG-{year}<br/><span className="text-on-surface-variant">03:42 HRS</span>
                </td>
                <td className="p-space-sm">
                  {currentCase.custodyEvidence?.studioName || 'Primary Recording Facility'}<br/>
                  <span className="text-on-surface-variant">Primary Tracking Suite</span>
                </td>
                <td className="p-space-sm">
                  Forensic Audio Vault #4<br/><span className="text-on-surface-variant">Dr. {currentCase.artist}</span>
                </td>
                <td className="p-space-sm">
                  Master multitrack seized pursuant to Sound Ordinance Warrant #{400 + (hash % 199)} for severe viral earworm proliferation.
                </td>
                <td className="p-space-sm text-right align-middle">
                  <span className="inline-block px-space-xs py-0.5 font-label-sm text-label-sm text-primary font-bold uppercase tracking-widest bg-primary-fixed-dim/60 shadow-[1px_1px_0px_#5d0705] rotate-[-1.5deg]">
                    VERIFIED SEAL
                  </span>
                </td>
              </tr>

              {/* Row 2 */}
              <tr className="bg-surface-container-low hover:bg-surface-container-high transition-colors border-b border-outline-variant/30">
                <td className="p-space-sm font-bold text-primary font-label-md text-label-md">
                  ITEM 01-B
                  <span className="block font-body-sm text-body-sm text-on-surface-variant font-normal">Radio Promo CD-R / Broadcast Reel</span>
                </td>
                <td className="p-space-sm font-label-sm text-label-sm">
                  14-FEB-{parseInt(year) + 1}<br/><span className="text-on-surface-variant">11:15 HRS</span>
                </td>
                <td className="p-space-sm">
                  Commercial Broadcast Hub<br/><span className="text-on-surface-variant">Major Market Radio Desk</span>
                </td>
                <td className="p-space-sm">
                  Acoustic Crime Lab Div.<br/><span className="text-on-surface-variant">Forensic Telemetry Desk</span>
                </td>
                <td className="p-space-sm">
                  {currentCase.custodyEvidence?.promoDetail || 'Recovered from broadcast console; subjected to groove density laser telemetry and fingerprint lifting.'}
                </td>
                <td className="p-space-sm text-right align-middle">
                  <span className="inline-block px-space-xs py-0.5 font-label-sm text-label-sm text-secondary font-bold uppercase tracking-widest bg-secondary-container shadow-[1px_1px_0px_#735a30]">
                    SCUFFS NOTED
                  </span>
                </td>
              </tr>

              {/* Row 3 */}
              <tr className="bg-surface-container-lowest/60 hover:bg-surface-container-high transition-colors border-b border-outline-variant/30">
                <td className="p-space-sm font-bold text-primary font-label-md text-label-md">
                  ITEM 01-C
                  <span className="block font-body-sm text-body-sm text-on-surface-variant font-normal">Streaming Telemetry Log Dump</span>
                </td>
                <td className="p-space-sm font-label-sm text-label-sm">
                  22-OCT-{parseInt(year) + 2}<br/><span className="text-on-surface-variant">23:09 HRS</span>
                </td>
                <td className="p-space-sm">
                  Retail Streaming Node Cluster<br/><span className="text-on-surface-variant">Datacenter Backbone</span>
                </td>
                <td className="p-space-sm">
                  Magnetic Tape Archival Bank<br/><span className="text-on-surface-variant">Algorithmic Oversight Unit</span>
                </td>
                <td className="p-space-sm">
                  {currentCase.custodyEvidence?.streamStat ? `Subpoenaed server log: ${currentCase.custodyEvidence.streamStat}. Fatal algorithmic overplay certified.` : 'Subpoenaed server log confirming over 1.4 billion automated repeat transmissions. Fatal overplay verified.'}
                </td>
                <td className="p-space-sm text-right align-middle">
                  <span className="inline-block px-space-xs py-0.5 font-label-sm text-label-sm text-primary font-bold uppercase tracking-widest bg-primary-fixed-dim/60 shadow-[1px_1px_0px_#5d0705] rotate-[-2deg]">
                    OVERPLAY EXPOSURE
                  </span>
                </td>
              </tr>

              {/* Row 4 */}
              <tr className="bg-surface-container-low hover:bg-surface-container-high transition-colors">
                <td className="p-space-sm font-bold text-primary font-label-md text-label-md">
                  ITEM 01-D
                  <span className="block font-body-sm text-body-sm text-on-surface-variant font-normal">7" Warped Single / Thrift Relic</span>
                </td>
                <td className="p-space-sm font-label-sm text-label-sm">
                  04-MAY-{parseInt(year) + 4}<br/><span className="text-on-surface-variant">14:20 HRS</span>
                </td>
                <td className="p-space-sm">
                  Goodwill Thrift Store Bin<br/><span className="text-on-surface-variant">Donation Intake Slip #{100 + (hash % 899)}</span>
                </td>
                <td className="p-space-sm">
                  Sonic Cold Case Crypt #12<br/><span className="text-on-surface-variant">Vault Custodian</span>
                </td>
                <td className="p-space-sm">
                  Physical commercial release of "{currentCase.title}" surrendered voluntarily. Thermal groove warping; permanent regulatory isolation locked.
                </td>
                <td className="p-space-sm text-right align-middle">
                  <span className="inline-block px-space-xs py-0.5 font-label-sm text-label-sm text-on-surface-variant font-bold uppercase tracking-widest bg-surface-variant shadow-[1px_1px_0px_#57423f]">
                    PERMANENT ARCHIVE
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm pt-space-xs border-t border-outline-variant/60">
          <span>LEDGER INTEGRITY VERIFIED • ZERO MISSING RECORD LINES</span>
          <span className="text-primary font-bold">ALL PHYSICAL ARTIFACTS ACCOUNTED FOR</span>
        </div>
      </div>

      {/* PHYSICAL EVIDENCE SPECIMEN BAG CARDS (3-COLUMN MOSAIC) */}
      <div className="flex flex-col gap-space-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-primary text-[22px]">inventory_2</span>
            <h2 className="font-headline-md text-headline-md uppercase text-on-surface tracking-wide">
              SEIZED EVIDENCE BAG INSPECTION CARDS
            </h2>
          </div>
          <span className="font-label-sm text-label-sm uppercase text-on-surface-variant">
            SERIES 1958-B SPECIMEN POUCHES
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
          {/* Specimen Card 1: Master Tape */}
          <div className="relative bg-surface-container p-space-md shadow-[4px_4px_0px_#735a30] rotate-[-0.5deg] flex flex-col justify-between border border-outline-variant/60">
            {/* Top Grommet / Eyelet Punch Hole */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-surface-container-high border-2 border-secondary flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-secondary/80"></div>
            </div>
            
            {/* Tamper Evident Red Tape Stripe */}
            <div className="bg-primary/90 text-on-primary font-label-sm text-label-sm py-0.5 px-space-sm uppercase tracking-[0.2em] text-center font-bold mb-space-sm shadow-sm">
              // EVIDENCE SEAL • DO NOT BREAK //
            </div>

            <div className="flex flex-col gap-space-sm">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">SPECIMEN #</span>
                  <div className="font-headline-md text-headline-md font-bold text-primary">01-A (REEL)</div>
                </div>
                {/* Barcode Graphic Simulation */}
                <div className="h-8 flex items-center gap-0.5">
                  <div className="w-0.5 h-full bg-on-surface"></div>
                  <div className="w-1 h-full bg-on-surface"></div>
                  <div className="w-0.5 h-full bg-on-surface"></div>
                  <div className="w-1.5 h-full bg-on-surface"></div>
                  <div className="w-0.5 h-full bg-on-surface"></div>
                  <div className="w-1 h-full bg-on-surface"></div>
                  <div className="w-0.5 h-full bg-on-surface"></div>
                </div>
              </div>

              {/* Visual Media Container */}
              <div className="relative h-44 w-full bg-surface-container-high overflow-hidden shadow-inner flex items-center justify-center border border-outline-variant/40">
                <img
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCql9UjcZ-YUGMG6x_TnjbPR6WWoh4NSKnRzx4nV2Fe7cQBJjDL-2YveJgchHCp3XkyGyt-c2cSIaVMY5PTKzGfkR6qyqojS3Z_HfPdyW6gkbXE07DCQX_1Y95nFHFrKjbhjX-k5k0jcwIHEmDpGyNAeLf9KXMXrqv0yEbn3VVc1CH5Kj0SeGSOS9r_1i1vkoHauTD96HP85wBS2J8wIWasmeOcWqbePxG4vh5MncBlp6A6NUJBaGgA7w"
                  alt="Vintage 2-inch audio reel in evidence box"
                />
                <div className="absolute bottom-2 left-2 bg-surface-container-lowest/90 px-1.5 py-0.5 font-label-sm text-label-sm text-on-surface uppercase font-bold">
                  REEL 24-TRK AMV-91
                </div>
              </div>

              <div className="space-y-1 font-body-sm text-body-sm text-on-surface mt-space-xs">
                <div className="flex justify-between">
                  <span className="text-on-surface-variant font-label-sm text-label-sm uppercase">Oxide Condition:</span>
                  <span className="font-bold">92% Intact (Low Shed)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant font-label-sm text-label-sm uppercase">Tape Speed:</span>
                  <span className="font-bold">30 IPS / CCIR EQ</span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant pt-1 leading-tight">
                  Forensic note: Original studio tracking reel seized from {currentCase.custodyEvidence?.studioName || 'Studio Archive'}. Harmonic frequencies exhibit uncompressed dynamic vitality prior to commercial master destruction.
                </p>
              </div>
            </div>

            <div className="mt-space-md pt-space-xs flex items-center justify-between border-t border-outline-variant/40">
              <span className="font-label-sm text-label-sm uppercase text-on-surface-variant">
                EXAMINER: <span className="font-bold text-on-surface">DR. {currentCase.artist.toUpperCase()}{currentCase.examinerDegreeShort ? `, ${currentCase.examinerDegreeShort}` : ''}</span>
              </span>
              <span className="font-label-sm text-label-sm font-bold text-primary">INITIALED • CERT</span>
            </div>
          </div>

          {/* Specimen Card 2: Promo CD-R */}
          <div className="relative bg-surface-container p-space-md shadow-[4px_4px_0px_#735a30] rotate-[0.4deg] flex flex-col justify-between border border-outline-variant/60">
            {/* Top Grommet / Eyelet Punch Hole */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-surface-container-high border-2 border-secondary flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-secondary/80"></div>
            </div>

            {/* Tamper Evident Red Tape Stripe */}
            <div className="bg-primary/90 text-on-primary font-label-sm text-label-sm py-0.5 px-space-sm uppercase tracking-[0.2em] text-center font-bold mb-space-sm shadow-sm">
              // EVIDENCE SEAL • DO NOT BREAK //
            </div>

            <div className="flex flex-col gap-space-sm">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">SPECIMEN #</span>
                  <div className="font-headline-md text-headline-md font-bold text-primary">01-B (CD-R)</div>
                </div>
                {/* Barcode Graphic Simulation */}
                <div className="h-8 flex items-center gap-0.5">
                  <div className="w-1 h-full bg-on-surface"></div>
                  <div className="w-0.5 h-full bg-on-surface"></div>
                  <div className="w-1.5 h-full bg-on-surface"></div>
                  <div className="w-1 h-full bg-on-surface"></div>
                  <div className="w-0.5 h-full bg-on-surface"></div>
                  <div className="w-0.5 h-full bg-on-surface"></div>
                </div>
              </div>

              {/* Visual Media Container */}
              <div className="relative h-44 w-full bg-surface-container-high overflow-hidden shadow-inner flex items-center justify-center border border-outline-variant/40">
                <img
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuA7AG5z76mjui_r59RPt2dHwcIEU9qA_o7iq1XzPnqD4JpdmTTKZfg3w46vQAC0KX44CB7Qd3M1ZGPH9okYLPkDUd1kH6vSBUImiqjl2icpNxB9mbt7mmNR9__avLTFsZQpqMTrdHhSu-ndBVNNIkCRezcfxtvNhrv1EQVgoZNqWunZMwCCapnxRlT80CyPt-YKSPr66iTq_nssQF2MZpWrpColKSJY7Lu-psDuJcXA2sszCynebhcAqw"
                  alt="Clear jewel case with CD-R labeled promo"
                />
                <div className="absolute bottom-2 left-2 bg-surface-container-lowest/90 px-1.5 py-0.5 font-label-sm text-label-sm text-on-surface uppercase font-bold">
                  RADIO STATION PROMO #9
                </div>
              </div>

              <div className="space-y-1 font-body-sm text-body-sm text-on-surface mt-space-xs">
                <div className="flex justify-between">
                  <span className="text-on-surface-variant font-label-sm text-label-sm uppercase">Jewel Smudge:</span>
                  <span className="font-bold text-error">Fingerprints Lifted</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant font-label-sm text-label-sm uppercase">Track Length:</span>
                  <span className="font-bold">Radio Broadcast Cut</span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant pt-1 leading-tight">
                  Forensic note: {currentCase.custodyEvidence?.promoDetail || 'Disc surface exhibits heavy concentric scratches consistent with high-velocity repeated playback in terrestrial broadcast automation towers.'}
                </p>
              </div>
            </div>

            <div className="mt-space-md pt-space-xs flex items-center justify-between border-t border-outline-variant/40">
              <span className="font-label-sm text-label-sm uppercase text-on-surface-variant">
                EXAMINER: <span className="font-bold text-on-surface">TECH J. DELGADO</span>
              </span>
              <span className="font-label-sm text-label-sm font-bold text-primary">INITIALED • JD</span>
            </div>
          </div>

          {/* Specimen Card 3: Warped Vinyl */}
          <div className="relative bg-surface-container p-space-md shadow-[4px_4px_0px_#735a30] rotate-[-0.3deg] flex flex-col justify-between border border-outline-variant/60">
            {/* Top Grommet / Eyelet Punch Hole */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-surface-container-high border-2 border-secondary flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-secondary/80"></div>
            </div>

            {/* Tamper Evident Red Tape Stripe */}
            <div className="bg-primary/90 text-on-primary font-label-sm text-label-sm py-0.5 px-space-sm uppercase tracking-[0.2em] text-center font-bold mb-space-sm shadow-sm">
              // EVIDENCE SEAL • DO NOT BREAK //
            </div>

            <div className="flex flex-col gap-space-sm">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">SPECIMEN #</span>
                  <div className="font-headline-md text-headline-md font-bold text-primary">01-D (VINYL)</div>
                </div>
                {/* Barcode Graphic Simulation */}
                <div className="h-8 flex items-center gap-0.5">
                  <div className="w-1.5 h-full bg-on-surface"></div>
                  <div className="w-0.5 h-full bg-on-surface"></div>
                  <div className="w-0.5 h-full bg-on-surface"></div>
                  <div className="w-1 h-full bg-on-surface"></div>
                  <div className="w-1 h-full bg-on-surface"></div>
                  <div className="w-1.5 h-full bg-on-surface"></div>
                </div>
              </div>

              {/* Visual Media Container */}
              <div className="relative h-44 w-full bg-surface-container-high overflow-hidden shadow-inner flex items-center justify-center border border-outline-variant/40">
                <img
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB3BQAAMmy46cjbZv_bOeMpxBnRXdEsuCau1IrJAjW1afwPXxtP2WpMjMkkBQmc3yse-i1GiUk7EznW7vw0x15jmg0T8BQ_NtHbYsn0ZGCZQ8fCVXu_0kuH8B1Oz7jVnQk6BgRHgRRqxJihUegrNs7CMKGqGuapTUNGrl4XGqRD3S9KI-LmrmVJmyX-y93YaVXuQ-A9hJMqSIzfLU7oykgSbOWK6oZq-10R7E9R3q80Wqz5C21uqfIMYw"
                  alt="Warped 7-inch vinyl record on file folder"
                />
                <div className="absolute bottom-2 left-2 bg-surface-container-lowest/90 px-1.5 py-0.5 font-label-sm text-label-sm text-on-surface uppercase font-bold">
                  7-INCH SINGLE (45 RPM)
                </div>
              </div>

              <div className="space-y-1 font-body-sm text-body-sm text-on-surface mt-space-xs">
                <div className="flex justify-between">
                  <span className="text-on-surface-variant font-label-sm text-label-sm uppercase">Curvature Warping:</span>
                  <span className="font-bold text-error">12.4mm Deflection</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant font-label-sm text-label-sm uppercase">Run-out Matrix:</span>
                  <span className="font-bold">SMP-881-A-RE</span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant pt-1 leading-tight">
                  Forensic note: Physical specimen of "{currentCase.title}" recovered from {currentCase.seizureLocation || 'distribution vault'}. Preserved for historical sonic pathology.
                </p>
              </div>
            </div>

            <div className="mt-space-md pt-space-xs flex items-center justify-between border-t border-outline-variant/40">
              <span className="font-label-sm text-label-sm uppercase text-on-surface-variant">
                EXAMINER: <span className="font-bold text-on-surface">DR. {currentCase.artist.toUpperCase()}{currentCase.examinerDegreeShort ? `, ${currentCase.examinerDegreeShort}` : ''}</span>
              </span>
              <span className="font-label-sm text-label-sm font-bold text-primary">INITIALED • ARCH</span>
            </div>
          </div>
        </div>
      </div>

      {/* CUSTODY VERIFICATION & LEGAL SIGN-OFF CERTIFICATION BLOCK */}
      <div className="bg-surface-container p-space-lg md:p-space-xl shadow-[4px_4px_0px_#735a30] flex flex-col md:flex-row items-start md:items-center justify-between gap-space-lg relative overflow-hidden border border-outline-variant/60">
        <div className="max-w-2xl flex flex-col gap-space-sm">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-primary text-[24px]">verified_user</span>
            <span className="font-label-md text-label-md uppercase tracking-wider text-primary font-bold">
              CUSTODIAN OATH OF ISOLATION • SECTION 9 CERTIFICATION
            </span>
          </div>
          <p className="font-body-md text-body-md text-on-surface italic leading-relaxed">
            “I hereby certify on my official oath as Chief Acoustic Examiner that the sonic artifacts and evidentiary recording materials for <strong className="text-on-surface">"{currentCase.title}"</strong> cataloged herein have remained in sealed regulatory isolation without unauthorized radio broadcast, illicit sampling, digital compression transcoding, or commercial extraction.”
          </p>
          <div className="flex flex-wrap items-center gap-space-lg font-label-sm text-label-sm text-on-surface-variant pt-space-xs">
            <span>SIGNATORY: <strong className="text-on-surface uppercase">DR. {currentCase.artist}</strong></span>
            <span>CREDENTIALS: <strong className="text-on-surface">{currentCase.examinerDegree || degree}</strong></span>
            <span>DATE: <strong className="text-on-surface uppercase">{currentCase.date}</strong></span>
          </div>
        </div>

        {/* Signature & Rubber Stamp Block */}
        <div className="flex flex-col items-center md:items-end gap-space-sm shrink-0 w-full md:w-auto">
          {/* Mechanical Red Ink Stamp */}
          <div className="rotate-[-4deg] border-2 border-primary text-primary px-space-md py-1.5 uppercase font-label-md text-label-md tracking-[0.2em] font-bold shadow-[2px_2px_0px_#5d0705] bg-surface/90 mix-blend-multiply">
            RESTRICTED ACCESS ARCHIVE
          </div>

          {/* Physical Typewriter Signature Line */}
          <div className="w-full sm:w-72 pt-space-sm text-left">
            <div className="font-headline-md text-headline-md font-bold text-primary italic font-serif truncate">
              Dr. {currentCase.artist}, {currentCase.examinerDegreeShort || 'M.D.'}
            </div>
            <div className="w-full h-[1.5px] bg-on-surface mt-1"></div>
            <div className="flex justify-between font-label-sm text-label-sm text-on-surface-variant uppercase mt-1">
              <span>X Chief Examiner</span>
              <span>Badge #{100 + (hash % 899)}</span>
            </div>
          </div>

          {/* Action Stamp Button */}
          <button
            onClick={handleStamp}
            className={`mt-space-sm px-space-lg py-2 border-2 border-primary font-label-sm text-label-sm uppercase tracking-widest font-bold shadow-[2px_2px_0px_#5d0705] transition-all active:translate-x-[1px] active:translate-y-[1px] cursor-pointer ${
              stampAffixed
                ? 'bg-primary text-on-primary'
                : 'bg-surface-container-high text-primary hover:bg-primary hover:text-on-primary'
            }`}
          >
            {stampText}
          </button>
        </div>
      </div>
    </div>
  );
};
