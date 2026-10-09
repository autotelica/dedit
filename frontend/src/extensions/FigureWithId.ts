import { Node, mergeAttributes } from "@tiptap/core";

/** A document-scoped image reference. Binary media and temporary URLs stay outside Yjs. */
export const FigureWithId = Node.create({
  name: "figure",
  group: "block",
  atom: true,
  draggable: true,
  selectable: true,
  addAttributes() {
    return {
      id: { default: null, parseHTML: element => element.getAttribute("data-id") },
      assetId: { default: null, parseHTML: element => element.getAttribute("data-asset-id") },
      alt: { default: "", parseHTML: element => element.getAttribute("data-alt") ?? "" },
      caption: { default: "", parseHTML: element => element.getAttribute("data-caption") ?? "" },
      width: { default: null, parseHTML: element => {
        const value = Number(element.getAttribute("data-width"));
        return Number.isInteger(value) && value > 0 ? value : null;
      } },
    };
  },
  parseHTML() { return [{ tag: "figure[data-asset-id]" }]; },
  renderHTML({ node, HTMLAttributes }) {
    const { id, assetId, alt, caption, width } = node.attrs;
    return ["figure", mergeAttributes(HTMLAttributes, {
      "data-id": id,
      "data-asset-id": assetId,
      "data-alt": alt,
      "data-caption": caption,
      "data-width": width,
      "aria-label": alt || "Image",
    }), ["span", { class: "figure-placeholder" }, alt || "Image"],
      ...(caption ? [["figcaption", {}, caption]] : [])];
  },
});
