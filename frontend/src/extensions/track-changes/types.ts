import type { Mark } from "@tiptap/pm/model";
import type { FontAttributes } from "../InlineFormatChange";

export interface TrackChangesModeOptions {
  enabled: boolean;
  author: string;
}

export interface TrackChangesModeStorage {
  enabled: boolean;
  author: string;
}

/**
 * A fragment of deleted text with its original marks preserved.
 */
export interface DeletedFragment {
  text: string;
  marks: readonly Mark[];
}

/**
 * A pending change to be applied to the document.
 */
export interface PendingChange {
  type: "deletion" | "insertion" | "restore-deleted" | "inline-format" | "clear-inline-format";
  /** Position in newState where the change applies */
  from: number;
  /** End position (same as from for deletions/restores, end of inserted text for insertions) */
  to: number;
  /** The text content */
  text: string;
  /** For deletions: the original text fragments with their marks */
  deletedFragments?: DeletedFragment[];
  /** For restore-deleted: the original marks to preserve (including deletion mark) */
  originalMarks?: readonly Mark[];
  /** For font changes: the font to restore if the change is rejected. */
  oldFont?: FontAttributes | null;
  /** For font changes: keep an existing pending change's identity. */
  id?: string;
}
