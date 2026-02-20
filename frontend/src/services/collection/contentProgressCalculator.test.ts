import { describe, it, expect } from 'vitest';
import {
  calculateContentProgress,
  progressToStatus,
} from './contentProgressCalculator';

describe('contentProgressCalculator', () => {
  describe('calculateContentProgress', () => {
    it('returns 0 when summary has no progress', () => {
      expect(calculateContentProgress([], 'video/mp4')).toBe(0);
      expect(calculateContentProgress([{}], 'application/pdf')).toBe(0);
    });

    it('playback types: returns 100 when endPageSeen', () => {
      const summary = [
        { progress: 50, endpageseen: true, visitedlength: 10, totallength: 100 },
      ];
      expect(calculateContentProgress(summary, 'application/pdf')).toBe(100);
    });

    it('playback types: returns 100 when visitedContentEnd', () => {
      const summary = [
        { progress: 30, visitedcontentend: true, visitedlength: 5, totallength: 50 },
      ];
      expect(calculateContentProgress(summary, 'video/mp4')).toBe(100);
    });

    it('playback types: returns 100 when visited > 20% of total', () => {
      const summary = [
        { progress: 15, visitedlength: 25, totallength: 100, endpageseen: false, visitedcontentend: false },
      ];
      expect(calculateContentProgress(summary, 'application/epub')).toBe(100);
    });

    it('playback types: returns raw progress when under 20% and end not seen', () => {
      const summary = [
        { progress: 10, visitedlength: 10, totallength: 100, endpageseen: false, visitedcontentend: false },
      ];
      expect(calculateContentProgress(summary, 'video/webm')).toBe(10);
    });

    it('OTHER mime types (H5P/HTML): any progress returns 100', () => {
      expect(calculateContentProgress([{ progress: 1 }], 'application/vnd.ekstep.h5p-archive')).toBe(100);
      expect(calculateContentProgress([{ progress: 50 }], 'application/vnd.ekstep.html-archive')).toBe(100);
    });

    it('OTHER mime types: 0 progress returns 0', () => {
      expect(calculateContentProgress([{ progress: 0 }], 'application/vnd.ekstep.h5p-archive')).toBe(0);
    });

    it('other mime types: only progress >= 100 returns 100', () => {
      expect(calculateContentProgress([{ progress: 99 }], 'application/vnd.sunbird.question')).toBe(0);
      expect(calculateContentProgress([{ progress: 100 }], 'application/vnd.sunbird.question')).toBe(100);
    });
  });

  describe('progressToStatus', () => {
    it('maps 0 to 0', () => {
      expect(progressToStatus(0)).toBe(0);
    });
    it('maps 1-99 to 1', () => {
      expect(progressToStatus(1)).toBe(1);
      expect(progressToStatus(50)).toBe(1);
      expect(progressToStatus(99)).toBe(1);
    });
    it('maps 100 to 2', () => {
      expect(progressToStatus(100)).toBe(2);
    });
  });
});
