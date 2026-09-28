import { describe, it, expect } from "vitest";
import { splitBind, joinBind, bindOptions, fieldIsNumeric, preview, rateSeconds, rateOverride } from "../src/bind-utils";

const lola = {
  state: "Spicy",
  attributes: {
    state: "Home", snacks: 1, friendly_name: "Lola", time_since_short: "🏡 - 53m",
    tags: ["a"], meta: { x: 1 }, "a/b": "bad", nothing: null,
  },
};

describe("splitBind / joinBind", () => {
  it("round-trips state and attribute binds", () => {
    expect(splitBind("sensor.lola")).toEqual(["sensor.lola", ""]);
    expect(splitBind("sensor.lola.attributes.state")).toEqual(["sensor.lola", "state"]);
    expect(joinBind("sensor.lola", "")).toBe("sensor.lola");
    expect(joinBind("sensor.lola", "state")).toBe("sensor.lola.attributes.state");
    expect(joinBind("", "state")).toBe("");
  });
});

describe("bindOptions", () => {
  it("lists State first, then scalar attributes by name with a value preview", () => {
    expect(bindOptions(lola, false)).toEqual([
      { attr: "", label: "State (Spicy)" },
      { attr: "friendly_name", label: "friendly_name (Lola)" },
      { attr: "snacks", label: "snacks (1)" },
      { attr: "state", label: "state (Home)" },
      { attr: "time_since_short", label: "time_since_short (🏡 - 53m)" },
    ]);
  });
  it("keeps only numeric attributes for a numeric field", () => {
    expect(bindOptions(lola, true).map((o) => o.attr)).toEqual(["", "snacks"]);
  });
  it("is empty for an unknown entity", () => {
    expect(bindOptions(undefined, false)).toEqual([]);
  });
});

describe("helpers", () => {
  it("knows which fields take numbers", () => {
    expect(fieldIsNumeric("value", "entity")).toBe(true);
    expect(fieldIsNumeric("energy", "charging_entity")).toBe(false);
    expect(fieldIsNumeric("sensor", "entity")).toBe(false);
  });
  it("truncates long previews", () => {
    expect(preview("x".repeat(30), 10)).toBe("xxxxxxxxx…");
  });
});

describe("rate override", () => {
  const uses = [
    { label: "Power big", rate: "30s", binds: ["sensor.power"] },
    { label: "Power small", rate: "live", binds: ["sensor.power"] },
    { label: "Temp", rate: "5s", binds: ["sensor.temp"] },
    { label: "Energy", rate: "5s", binds: ["sensor.power", "sensor.soc"] },
  ];
  it("parses rate names", () => {
    expect([rateSeconds("live"), rateSeconds("5s"), rateSeconds("1m"), rateSeconds("5m")]).toEqual([0, 5, 60, 300]);
  });
  it("names the fastest widget sharing a bind", () => {
    expect(rateOverride(uses, 0)).toEqual({ rate: "live", by: "Power small" });
  });
  it("is null when this widget is already the fastest or shares nothing", () => {
    expect(rateOverride(uses, 1)).toBeNull();
    expect(rateOverride(uses, 2)).toBeNull();
  });
});
