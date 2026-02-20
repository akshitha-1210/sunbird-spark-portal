/**
 * Calculates effective progress (0-100) from consumption summary for content state update.
 * Mirrors CsContentProgressCalculator: playback types use visited length / end seen;
 * H5P/HTML use absoluteProgress(progress, 0); others use absoluteProgress(progress, 100).
 */

const PLAYBACK_MIME_TYPES = [
  'video/x-youtube',
  'video/mp4',
  'video/webm',
  'application/pdf',
  'application/epub',
];

const OTHER_MIME_TYPES = [
  'application/vnd.ekstep.h5p-archive',
  'application/vnd.ekstep.html-archive',
  'application/vnd.ekstep.ecml-archive',
];

export interface ConsumptionSummary {
  progress?: number;
  visitedlength?: number;
  totallength?: number;
  endpageseen?: boolean;
  visitedcontentend?: boolean;
  [key: string]: unknown;
}

function mergeSummary(summary: ConsumptionSummary | ConsumptionSummary[]): Record<string, unknown> {
  const arr = Array.isArray(summary) ? summary : [summary];
  return arr.reduce<Record<string, unknown>>((acc, s) => {
    if (s && typeof s === 'object') {
      Object.keys(s).forEach((k) => {
        acc[k] = (s as Record<string, unknown>)[k];
      });
    }
    return acc;
  }, {});
}

function calculatePlaybackProgress(
  progress: number,
  visitedLength: number,
  totalLength: number,
  endPageSeen: boolean,
  visitedContentEnd: boolean
): number {
  if (
    endPageSeen ||
    visitedContentEnd ||
    (totalLength > 0 && (visitedLength * 100) / totalLength > 20)
  ) {
    return 100;
  }
  return progress;
}

function absoluteProgress(progress: number, threshold: number): number {
  if (progress >= threshold) return 100;
  return 0;
}

/**
 * Returns effective progress 0-100 for the given summary and mime type.
 * Use result to derive status: 0 -> 0, 1-99 -> 1, 100 -> 2.
 */
export function calculateContentProgress(
  summary: ConsumptionSummary | ConsumptionSummary[],
  mimeType: string
): number {
  const summaryMap = mergeSummary(summary) as Record<string, unknown> & { progress?: number };
  const progress = summaryMap.progress;

  if (progress === undefined || progress === null || progress === 0) {
    return 0;
  }

  const mime = (mimeType || '').toLowerCase();

  if (PLAYBACK_MIME_TYPES.includes(mime)) {
    return calculatePlaybackProgress(
      Number(summaryMap.progress) || 0,
      Number(summaryMap.visitedlength) ?? 0,
      Number(summaryMap.totallength) ?? 0,
      Boolean(summaryMap.endpageseen),
      Boolean(summaryMap.visitedcontentend)
    );
  }

  if (OTHER_MIME_TYPES.includes(mime)) {
    return absoluteProgress(Number(progress), 0);
  }

  return absoluteProgress(Number(progress), 100);
}

/**
 * Maps effective progress (0-100) to content status: 0 = not started, 1 = in progress, 2 = completed.
 */
export function progressToStatus(effectiveProgress: number): 0 | 1 | 2 {
  if (effectiveProgress >= 100) return 2;
  if (effectiveProgress > 0) return 1;
  return 0;
}
