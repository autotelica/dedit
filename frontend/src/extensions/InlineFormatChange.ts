import { Mark, mergeAttributes } from "@tiptap/core";

export interface FontAttributes {
  family: string | null;
  size: string | null;
}

function parseOldFont(element: HTMLElement): FontAttributes | null {
  try {
    const value = element.getAttribute("data-old-font");
    return value ? JSON.parse(value) as FontAttributes : null;
  } catch {
    return null;
  }
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    inlineFormatChange: {
      acceptInlineFormatChange: (id: string) => ReturnType;
      rejectInlineFormatChange: (id: string) => ReturnType;
    };
  }
}

/** A reviewable font change. The current font stays on the text until rejected. */
export const InlineFormatChange = Mark.create({
  name: "inlineFormatChange",
  addAttributes() {
    return {
      id: { default: null, parseHTML: (element) => element.getAttribute("data-inline-format-change-id"),
        renderHTML: (attrs) => ({ "data-inline-format-change-id": attrs.id }) },
      author: { default: null, parseHTML: (element) => element.getAttribute("data-author"),
        renderHTML: (attrs) => ({ "data-author": attrs.author }) },
      date: { default: null, parseHTML: (element) => element.getAttribute("data-date"),
        renderHTML: (attrs) => ({ "data-date": attrs.date }) },
      oldFont: { default: null, parseHTML: parseOldFont,
        renderHTML: (attrs) => ({ "data-old-font": attrs.oldFont ? JSON.stringify(attrs.oldFont) : "" }) },
    };
  },
  parseHTML() { return [{ tag: "span[data-inline-format-change-id]" }]; },
  renderHTML({ HTMLAttributes }) {
    return ["span", mergeAttributes(HTMLAttributes, { class: "inline-format-change" }), 0];
  },
  addCommands() {
    return {
      acceptInlineFormatChange: (id) => ({ state, tr, dispatch }) => {
        let found = false;
        state.doc.descendants((node, pos) => {
          if (!node.isText || !node.marks.some((mark) => mark.type === this.type && mark.attrs.id === id)) return;
          found = true;
          if (dispatch) tr.removeMark(pos, pos + node.nodeSize, this.type);
        });
        if (found && dispatch) tr.setMeta("acceptReject", true);
        return found;
      },
      rejectInlineFormatChange: (id) => ({ state, tr, dispatch }) => {
        let found = false;
        const fontType = state.schema.marks.fontStyle;
        state.doc.descendants((node, pos) => {
          if (!node.isText) return;
          const change = node.marks.find((mark) => mark.type === this.type && mark.attrs.id === id);
          if (!change) return;
          found = true;
          if (!dispatch) return;
          const to = pos + node.nodeSize;
          tr.removeMark(pos, to, this.type);
          if (fontType) {
            tr.removeMark(pos, to, fontType);
            if (change.attrs.oldFont) tr.addMark(pos, to, fontType.create(change.attrs.oldFont));
          }
        });
        if (found && dispatch) tr.setMeta("acceptReject", true);
        return found;
      },
    };
  },
});
