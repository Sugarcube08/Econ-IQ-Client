import { validatePayload, SegmentSchema } from '@/lib/validators';
import { safeArray } from '@/lib/utils';

export function normalizeSegment(raw: any) {
  return validatePayload(SegmentSchema, raw, 'SegmentSchema');
}

export function normalizeSegments(rawList: any) {
  return safeArray(rawList).map(normalizeSegment);
}
