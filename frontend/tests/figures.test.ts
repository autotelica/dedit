import { expect, test } from "vitest";
import { doc, makeEditor, para, txt } from "./helpers";

test("figure metadata survives HTML and JSON round trips without embedding image bytes", () => {
  const attrs = { id: "figure-1", assetId: "a".repeat(64), alt: "Workflow", caption: "A workflow diagram", width: 640 };
  const editor = makeEditor(doc(para(txt("Before")), { type: "figure", attrs }, para(txt("After"))));
  const html = editor.getHTML();
  expect(html).toContain("data-asset-id");
  expect(html).toContain("aria-label=\"Workflow\"");
  expect(html).not.toContain("data:image");
  const copied = makeEditor();
  copied.commands.setContent(html);
  expect(copied.state.doc.child(1).toJSON()).toEqual({ type: "figure", attrs });
  copied.commands.setContent(editor.getJSON());
  expect(copied.state.doc.child(1).attrs).toMatchObject(attrs);
});
