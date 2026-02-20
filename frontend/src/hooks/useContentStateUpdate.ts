import { useCallback, useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { batchService } from "../services/collection";
import {
  calculateContentProgress,
  progressToStatus,
} from "../services/collection/contentProgressCalculator";
import type { ConsumptionSummary } from "../services/collection/contentProgressCalculator";
import userAuthInfoService from "../services/userAuthInfoService/userAuthInfoService";

interface UseContentStateUpdateParams {
  collectionId: string | undefined;
  contentId: string | undefined;
  effectiveBatchId: string | undefined;
  isEnrolledInCurrentBatch: boolean;
  mimeType: string | undefined;
}

/** Telemetry callback receives the raw player detail (e.g. { eid, edata }), not { type, data }. */
type TelemetryEvent = {
  eid?: string;
  type?: string;
  edata?: { summary?: ConsumptionSummary[] };
  summary?: ConsumptionSummary | ConsumptionSummary[];
  data?: {
    eid?: string;
    edata?: { summary?: ConsumptionSummary[] };
    summary?: ConsumptionSummary | ConsumptionSummary[];
  };
};

export function useContentStateUpdate({
  collectionId,
  contentId,
  effectiveBatchId,
  isEnrolledInCurrentBatch,
  mimeType,
}: UseContentStateUpdateParams): (event: TelemetryEvent) => void {
  const queryClient = useQueryClient();
  const lastSentStatusRef = useRef<number | null>(null);

  useEffect(() => {
    lastSentStatusRef.current = null;
  }, [contentId]);

  const handleContentStateUpdate = useCallback(
    async (status: number, invalidate: boolean) => {
      if (!collectionId || !contentId || !effectiveBatchId) return;
      const userId = userAuthInfoService.getUserId();
      if (!userId) return;
      try {
        await batchService.contentStateUpdate({
          userId,
          courseId: collectionId,
          batchId: effectiveBatchId,
          contents: [{ contentId, status }],
        });
        if (invalidate) {
          await queryClient.invalidateQueries({ queryKey: ["contentState"] });
        }
      } catch (err) {
        console.error("Content state update failed:", err);
      }
    },
    [collectionId, contentId, effectiveBatchId, queryClient]
  );

  return useCallback(
    (event: TelemetryEvent) => {
      if (!isEnrolledInCurrentBatch || !collectionId || !contentId || !effectiveBatchId) return;
      const eid = (event?.eid ?? event?.data?.eid ?? event?.type ?? "") as string;
      const eidUpper = eid.toUpperCase();

      if (eidUpper === "START") {
        if (lastSentStatusRef.current !== 1) {
          lastSentStatusRef.current = 1;
          void handleContentStateUpdate(1, false);
        }
        return;
      }

      if (eidUpper === "END") {
        const rawSummary =
          event?.edata?.summary ??
          event?.data?.edata?.summary ??
          event?.summary ??
          event?.data?.summary;
        const summary = Array.isArray(rawSummary) ? rawSummary : rawSummary ? [rawSummary] : [];
        const effectiveProgress = calculateContentProgress(summary as ConsumptionSummary[], mimeType ?? "");
        const status = progressToStatus(effectiveProgress);
        lastSentStatusRef.current = null;
        void handleContentStateUpdate(status, true);
      }
    },
    [
      isEnrolledInCurrentBatch,
      collectionId,
      contentId,
      effectiveBatchId,
      mimeType,
      handleContentStateUpdate,
    ]
  );
}
