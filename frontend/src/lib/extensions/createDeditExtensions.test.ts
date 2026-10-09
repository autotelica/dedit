// @vitest-environment node
import { describe, expect, test } from "vitest";
import { getSchema } from "@tiptap/core";
import { createDeditExtensions } from "./createDeditExtensions";

describe("createDeditExtensions", () => {
  test("factory builds schema in Node without DOM", () => {
    const schema = getSchema(createDeditExtensions({ collaboration: true }));
    for (const n of ["paragraph", "heading", "table", "figure", "rawStylesStorage", "section"])
      expect(schema.nodes[n]).toBeDefined();
    const figure = schema.node("figure", { id: "f1", assetId: "a1", alt: "Flow", caption: "A flow", width: 640 });
    expect(figure.toJSON()).toEqual({ type: "figure", attrs: { id: "f1", assetId: "a1", alt: "Flow", caption: "A flow", width: 640 } });
    for (const m of ["insertion", "deletion", "comment"])
      expect(schema.marks[m]).toBeDefined();
  });

  test("collaboration mode omits History", () => {
    const names = (c: boolean) => createDeditExtensions({ collaboration: c }).map((e) => e.name);
    expect(names(false)).toContain("history");
    expect(names(true)).not.toContain("history");
  });
});
