/**
 * Export utilities: JSON, CSV, PDF.
 * All functions are pure (receive data, return/trigger download).
 */

import type { PlayerScore } from '../types/scoring';
import type { GameEdition } from '../types/edition';
import type { Player } from '../types/player';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function timestamp(): string {
  return new Date().toISOString().slice(0, 16).replace('T', '_').replace(':', '-');
}

// ---------------------------------------------------------------------------
// JSON export
// ---------------------------------------------------------------------------

export interface ExportPayload {
  edition: { id: string; name: string };
  date: string;
  players: Array<{
    rank: number | undefined;
    name: string;
    total: number;
    routes: number;
    tickets: number;
    bonuses: number;
  }>;
  scores: PlayerScore[];
}

export function exportJSON(
  edition: GameEdition,
  _players: Player[],
  rankedScores: PlayerScore[],
) {
  const payload: ExportPayload = {
    edition: { id: edition.id, name: edition.nameShort },
    date: new Date().toISOString(),
    players: rankedScores.map((s) => ({
      rank: s.rank,
      name: s.playerName,
      total: s.totalScore,
      routes: s.routePoints,
      tickets: s.completedTicketsPoints + s.failedTicketsPoints,
      bonuses: s.bonusPoints.reduce((acc, b) => acc + b.points, 0),
    })),
    scores: rankedScores,
  };
  const json = JSON.stringify(payload, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  downloadBlob(blob, `ttr_${edition.id}_${timestamp()}.json`);
}

// ---------------------------------------------------------------------------
// CSV export
// ---------------------------------------------------------------------------

function csvEscape(value: string | number | undefined): string {
  const str = String(value ?? '');
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function exportCSV(
  edition: GameEdition,
  _players: Player[],
  rankedScores: PlayerScore[],
) {
  const rows: string[][] = [];

  rows.push([
    'Miejsce',
    'Gracz',
    'Trasy (pkt)',
    'Bilety ukonczone',
    'Bilety nieukonczone',
    'Bilety (pkt netto)',
    'Bonusy (pkt)',
    'SUMA',
  ]);

  for (const s of rankedScores) {
    const ticketNet = s.completedTicketsPoints + s.failedTicketsPoints;
    const bonusTotal = s.bonusPoints.reduce((acc, b) => acc + b.points, 0);
    rows.push([
      String(s.rank ?? ''),
      s.playerName,
      String(s.routePoints),
      String(s.completedTicketsCount),
      String(s.failedTicketsCount),
      String(ticketNet),
      String(bonusTotal),
      String(s.totalScore),
    ]);
  }

  rows.push([]);
  rows.push(['Bonusy - szczegoly']);
  rows.push(['Gracz', 'Bonus', 'Punkty']);
  for (const s of rankedScores) {
    for (const b of s.bonusPoints) {
      rows.push([s.playerName, b.bonusNamePl, String(b.points)]);
    }
  }

  rows.push([]);
  rows.push([`Edycja: ${edition.nameShort}`, `Data: ${new Date().toLocaleString('pl-PL')}`]);

  const csv = rows.map((r) => r.map(csvEscape).join(',')).join('\r\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' });
  downloadBlob(blob, `ttr_${edition.id}_${timestamp()}.csv`);
}

// ---------------------------------------------------------------------------
// PDF export (jsPDF)
// ---------------------------------------------------------------------------

export async function exportPDF(
  edition: GameEdition,
  players: Player[],
  rankedScores: PlayerScore[],
) {
  const { jsPDF } = await import('jspdf');

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const pageW = 210;
  const margin = 15;
  const col = margin;
  let y = margin;

  const GOLD:  [number, number, number] = [212, 165, 116];
  const DARK:  [number, number, number] = [26,  26,  46];
  const LIGHT: [number, number, number] = [245, 240, 232];
  const GREY:  [number, number, number] = [107, 114, 128];
  const GREEN: [number, number, number] = [52,  211, 153];
  const RED:   [number, number, number] = [248, 113, 113];

  // Header bar
  doc.setFillColor(...DARK);
  doc.rect(0, 0, pageW, 28, 'F');

  doc.setTextColor(...GOLD);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Ticket to Ride', col, 12);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...LIGHT);
  doc.text(`Kalkulator punktow - ${edition.nameShort}`, col, 20);

  doc.setFontSize(8);
  doc.setTextColor(...GREY);
  doc.text(new Date().toLocaleString('pl-PL'), pageW - margin, 20, { align: 'right' });

  y = 36;

  // Ranking table
  const RANK_MEDAL: Record<number, string> = { 1: '1.', 2: '2.', 3: '3.' };
  const colWidths = [14, 48, 22, 22, 22, 22, 22];
  const headers   = ['#', 'Gracz', 'Trasy', 'Bilety', 'Bonusy', 'SUMA', ''];
  const rowH = 9;

  // Table header
  doc.setFillColor(...DARK);
  doc.rect(col, y, pageW - margin * 2, rowH, 'F');
  doc.setTextColor(...GOLD);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');

  let cx = col + 2;
  for (let i = 0; i < headers.length; i++) {
    doc.text(headers[i], cx, y + 6);
    cx += colWidths[i];
  }
  y += rowH;

  // Data rows
  doc.setFont('helvetica', 'normal');
  for (let ri = 0; ri < rankedScores.length; ri++) {
    const s = rankedScores[ri];
    const ticketNet = s.completedTicketsPoints + s.failedTicketsPoints;
    const bonusTotal = s.bonusPoints.reduce((acc, b) => acc + b.points, 0);
    const isWinner = s.rank === 1;

    if (ri % 2 === 0) {
      doc.setFillColor(35, 35, 60);
      doc.rect(col, y, pageW - margin * 2, rowH, 'F');
    }

    doc.setFontSize(isWinner ? 9 : 8);
    doc.setFont('helvetica', isWinner ? 'bold' : 'normal');

    cx = col + 2;
    const medal = s.rank ? (RANK_MEDAL[s.rank] ?? `${s.rank}.`) : '';
    const cells = [
      medal,
      s.playerName.length > 20 ? s.playerName.slice(0, 19) + '...' : s.playerName,
      String(s.routePoints),
      String(ticketNet >= 0 ? `+${ticketNet}` : ticketNet),
      String(bonusTotal > 0 ? `+${bonusTotal}` : bonusTotal),
      String(s.totalScore),
      '',
    ];

    for (let i = 0; i < cells.length; i++) {
      if (i === 4 && bonusTotal > 0) doc.setTextColor(...GOLD);
      else if (i === 3 && ticketNet < 0) doc.setTextColor(...RED);
      else if (i === 3 && ticketNet > 0) doc.setTextColor(...GREEN);
      else if (i === 5) doc.setTextColor(...GOLD);
      else doc.setTextColor(...LIGHT);

      doc.text(
        cells[i],
        cx + (i > 1 ? colWidths[i] - 4 : 0),
        y + 6,
        i > 1 ? { align: 'right' } : undefined,
      );
      cx += colWidths[i];
    }

    y += rowH;
  }

  y += 4;

  // Bonus detail
  const hasAnyBonus = rankedScores.some((s) => s.bonusPoints.length > 0);
  if (hasAnyBonus) {
    doc.setFillColor(...DARK);
    doc.rect(col, y, pageW - margin * 2, 7, 'F');
    doc.setTextColor(...GOLD);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text('Bonusy', col + 2, y + 5);
    y += 7;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    for (const s of rankedScores) {
      for (const b of s.bonusPoints) {
        if (y > 270) { doc.addPage(); y = margin; }
        doc.setTextColor(...GREY);
        doc.text(s.playerName, col + 2, y + 5);
        doc.setTextColor(...LIGHT);
        doc.text(b.bonusNamePl, col + 50, y + 5);
        doc.setTextColor(...GOLD);
        doc.text(`+${b.points} pkt`, pageW - margin - 2, y + 5, { align: 'right' });
        y += 7;
      }
    }
  }

  // Footer
  doc.setTextColor(...GREY);
  doc.setFontSize(7);
  doc.text(
    `Wygenerowano przez Ticket to Ride Kalkulator - ${edition.nameShort} - ${players.length} graczy`,
    pageW / 2,
    290,
    { align: 'center' },
  );

  doc.save(`ttr_${edition.id}_${timestamp()}.pdf`);
}
