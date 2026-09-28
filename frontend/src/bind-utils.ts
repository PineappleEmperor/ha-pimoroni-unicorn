const ATTR_SEP = ".attributes.";

// Keys of UPDATE_RATES in the integration; "live" sends every change.
export const UPDATE_RATES = ["live", "5s", "30s", "1m", "5m"];

export interface BindOption { attr: string; label: string; }

export function splitBind(bind: string): [string, string] {
  const i = bind.indexOf(ATTR_SEP);
  return i < 0 ? [bind, ""] : [bind.slice(0, i), bind.slice(i + ATTR_SEP.length)];
}

export function joinBind(entity: string, attr: string): string {
  return entity && attr ? `${entity}${ATTR_SEP}${attr}` : entity;
}

export function preview(value: unknown, max = 24): string {
  const s = String(value);
  return s.length > max ? `${s.slice(0, max - 1)}…` : s;
}

function isNumeric(value: unknown): boolean {
  if (typeof value === "number") return Number.isFinite(value);
  if (typeof value === "boolean") return true;
  return typeof value === "string" && value.trim() !== "" && Number.isFinite(Number(value));
}

// The bind is an MQTT topic level and the device's lookup key, so `/`, `+` and `#` can't appear.
function isBindable(name: string, value: unknown, numeric: boolean): boolean {
  if (/[/+#]/.test(name) || value === null || typeof value === "object") return false;
  return !numeric || isNumeric(value);
}

export function bindOptions(
  stateObj: { state: string; attributes?: Record<string, unknown> } | undefined,
  numeric: boolean,
): BindOption[] {
  if (!stateObj) return [];
  const attrs = Object.entries(stateObj.attributes ?? {})
    .filter(([name, value]) => isBindable(name, value, numeric))
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, value]) => ({ attr: name, label: `${name} (${preview(value)})` }));
  return [{ attr: "", label: `State (${preview(stateObj.state)})` }, ...attrs];
}

const NUMERIC_FIELDS: Record<string, string[]> = {
  value: ["entity"],
  bar: ["entity"],
  energy: ["solar_entity", "consumption_entity", "soc_entity"],
};

export function fieldIsNumeric(widgetType: string, key: string): boolean {
  return NUMERIC_FIELDS[widgetType]?.includes(key) ?? false;
}
