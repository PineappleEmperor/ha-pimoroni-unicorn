import { LitElement, html, css } from "lit";
import { property, state } from "lit/decorators.js";

type Rgb = [number, number, number];
type Size = [number, number];
interface CfgField { key: string; type: "select" | "rgb" | "number" | "text" | "entity" | "icon"; options?: string[]; label?: string; min?: number; max?: number; step?: number; }
interface WidgetCap { id: string; label: string; w: number; h: number; variants: string[]; default_cfg: Record<string, unknown>; cfg_fields: CfgField[]; sizes: Record<string, Size>; multi?: boolean; }
interface OverlayCap { id: string; label: string; }
interface WidgetEntry { id: string; type?: string; name?: string; x: number; y: number; cfg?: Record<string, unknown>; enabled?: boolean; }
interface Layout { name?: string; model?: string; grid?: number; widgets: WidgetEntry[]; overlays?: string[]; }
interface Device { entry_id: string; device_id: string; model: string; name: string; active_layout?: string; }
interface CatalogWidget { id: string; label: string; kind: string; requires: string[]; device_file: string; hash: string; status: string; thumb?: string; }
interface ContentUnit { id: string; label: string; kind: string; compat: string[]; requires: string[]; screens: number; compatible: boolean; thumb?: string; }
interface FwManifest { engine_version?: string; files?: Record<string, string>; }

const PREVIEW_TARGET_PX = 560;

const SAMPLE_SPEC = JSON.stringify({
  id: "my_widget", label: "My Widget", w: 16, h: 7,
  default_cfg: { color: [0, 255, 0] },
  draw: [
    { op: "value", x: 0, y: 1, bind: "solar", fmt: "{:.1f}" },
    { op: "bar", x: 0, y: 6, w: 16, h: 1, bind: "soc", max: 100, color: [0, 120, 255], bg: [30, 30, 30] },
  ],
}, null, 2);
const MODELS: Record<string, Size> = { galactic: [53, 11], cosmic: [32, 32], stellar: [16, 16] };
const MOCK = "__mock__";

const hex = (rgb?: Rgb): string => {
  const [r, g, b] = rgb ?? [0, 0, 0];
  return "#" + [r, g, b].map((v) => Math.max(0, Math.min(255, v | 0)).toString(16).padStart(2, "0")).join("");
};
// Tolerates "#rrggbb" or bare "rrggbb" (the on-device config form).
const unhex = (s: string): Rgb => {
  const h = (s || "").replace("#", "");
  return [0, 2, 4].map((i) => parseInt(h.substr(i, 2), 16) || 0) as Rgb;
};

export class PimoroniUnicornPanel extends LitElement {
  @property({ attribute: false }) hass!: any;

  @state() private devices: Device[] = [];
  @state() private entryId = "";          // "" = mock (no device)
  @state() private model = "galactic";
  @state() private layout: Layout = { widgets: [] };
  @state() private caps: WidgetCap[] = [];
  @state() private overlayCaps: OverlayCap[] = [];
  @state() private defaultLayout: Layout = { widgets: [] };
  @state() private stored: Record<string, Layout> = {};
  @state() private png = "";
  @state() private wboxes: Size[] = [];
  @state() private dims: Size = [53, 11];
  @state() private zoom = 0;  // px per LED; 0 = auto-fit
  @state() private selected = -1;
  @state() private layoutName = "default";
  @state() private live = false;
  @state() private wireframe = true;
  @state() private status = "";
  @state() private tab: "layout" | "market" | "edit" | "screens" = "layout";
  @state() private catalog: CatalogWidget[] = [];
  @state() private fwManifest: FwManifest | null = null;
  @state() private contentLayouts: ContentUnit[] = [];
  @state() private contentScreensets: ContentUnit[] = [];
  @state() private showAllContent = false;
  @state() private iconNames: string[] = [];
  @state() private dirty = false;
  @state() private sectionsOpen: Record<string, boolean> = {};
  @state() private screenLayouts: string[] = [];
  @state() private screenDwell = 10;
  @state() private screenTransition: "none" | "fade" = "none";
  @state() private screenPngs: Record<string, string> = {};
  @state() private screenIdx = 0;
  @state() private screenOpacity = 1;
  private screenTimer = 0;
  @state() private specText = SAMPLE_SPEC;
  @state() private specPng = "";
  @state() private specError = "";
  private specTimer = 0;

  private renderTimer?: number;
  private pushTimer?: number;

  static styles = css`
    :host {
      display: block; padding: 24px;
      color: var(--primary-text-color, #1c1b1f);
      font-family: var(--paper-font-body1_-_font-family, Roboto, system-ui, sans-serif);
      --pu-radius: 12px;
      --pu-surface: var(--card-background-color, #fff);
      --pu-outline: var(--divider-color, #c8c5ca);
      --pu-primary: var(--primary-color, #6750a4);
      --pu-on-primary: var(--text-primary-color, #fff);
    }
    .wrap { display: flex; gap: 20px; flex-wrap: wrap; align-items: flex-start; }
    .col {
      min-width: 300px; flex: 1; box-sizing: border-box;
      background: var(--pu-surface); border-radius: var(--pu-radius);
      padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,.12), 0 1px 2px rgba(0,0,0,.08);
    }
    .bar {
      display: flex; gap: 12px 16px; align-items: center; flex-wrap: wrap;
      margin-bottom: 20px; padding: 14px 16px; border-radius: var(--pu-radius);
      background: var(--pu-surface); box-shadow: 0 1px 2px rgba(0,0,0,.08);
    }
    .group { display: inline-flex; gap: 12px; align-items: center; flex-wrap: wrap; }
    .group + .group { padding-left: 16px; border-left: 1px solid var(--pu-outline); }
    .appbar {
      display: flex; gap: 16px; align-items: center; flex-wrap: wrap;
      padding: 12px 18px; margin-bottom: 16px; border-radius: var(--pu-radius);
      background: var(--pu-surface); box-shadow: 0 1px 3px rgba(0,0,0,.12);
    }
    .brand { font-size: 16px; font-weight: 600; letter-spacing: .2px; margin-right: 4px; }
    .grow { flex: 1; }
    .chip {
      font-size: 12px; font-weight: 500; padding: 4px 12px; border-radius: 14px;
      background: color-mix(in srgb, var(--pu-primary) 12%, transparent); color: var(--pu-primary);
    }
    .chip.dim { background: color-mix(in srgb, var(--secondary-text-color, #79747e) 14%, transparent); color: var(--secondary-text-color, #49454f); }
    .chip.warn { background: color-mix(in srgb, var(--warning-color, #ed6c02) 20%, transparent); color: var(--warning-color, #ed6c02); }
    label { font-size: 13px; display: inline-flex; gap: 6px; align-items: center; color: var(--secondary-text-color, #49454f); }
    select, input, .spec {
      font: inherit; font-size: 14px; padding: 9px 12px; border-radius: 8px;
      border: 1px solid var(--pu-outline); background: var(--pu-surface);
      color: var(--primary-text-color, #1c1b1f); outline: none; transition: border-color .15s, box-shadow .15s;
    }
    select:focus, input:focus, .spec:focus { border-color: var(--pu-primary); box-shadow: 0 0 0 2px color-mix(in srgb, var(--pu-primary) 30%, transparent); }
    input[type="color"] { padding: 0; width: 38px; height: 34px; cursor: pointer; }
    input[type="range"] { padding: 0; border: none; box-shadow: none; accent-color: var(--pu-primary); }
    input[type="checkbox"] { width: 16px; height: 16px; accent-color: var(--pu-primary); }
    button {
      font: inherit; font-size: 14px; font-weight: 500; cursor: pointer;
      padding: 9px 20px; border-radius: 20px; border: none;
      background: var(--pu-primary); color: var(--pu-on-primary);
      transition: filter .15s, box-shadow .15s; box-shadow: 0 1px 2px rgba(0,0,0,.15);
    }
    button:hover:not([disabled]) { filter: brightness(1.08); box-shadow: 0 2px 5px rgba(0,0,0,.2); }
    button:active:not([disabled]) { filter: brightness(.95); }
    button[disabled] { opacity: .38; cursor: not-allowed; box-shadow: none; }
    button.secondary { background: color-mix(in srgb, var(--pu-primary) 14%, var(--pu-surface)); color: var(--pu-primary); box-shadow: none; }
    button.danger { background: var(--error-color, #ba1a1a); color: #fff; }
    button.zbtn { padding: 6px 11px; min-width: 30px; line-height: 1; border-radius: 10px; }
    .stage { position: relative; display: inline-block; background: #000; line-height: 0; border-radius: 8px; box-shadow: inset 0 0 0 1px rgba(255,255,255,.12); overflow: hidden; }
    .stage img { image-rendering: pixelated; display: block; }
    .grid, .boxes { position: absolute; inset: 0; pointer-events: none; }
    .box { position: absolute; box-sizing: border-box; border: 1px solid rgba(255,255,255,.35); cursor: grab; touch-action: none; pointer-events: auto; border-radius: 2px; }
    .box.sel { border: 2px solid var(--pu-primary); background: color-mix(in srgb, var(--pu-primary) 14%, transparent); }
    .box .tag { position: absolute; top: -17px; left: 0; font: 11px ui-monospace, monospace; color: #ddd; white-space: nowrap; }
    .wlist { list-style: none; padding: 0; margin: 0 0 12px; }
    .wlist li { display: flex; gap: 10px; align-items: center; padding: 10px 12px; border-radius: 10px; cursor: pointer; transition: background .12s; }
    .wlist li:hover { background: color-mix(in srgb, var(--pu-primary) 7%, transparent); }
    .wlist li.sel { background: color-mix(in srgb, var(--pu-primary) 14%, transparent); box-shadow: inset 3px 0 0 var(--pu-primary); }
    .wlist li .grow { flex: 1; }
    .panelrow { display: flex; gap: 10px; align-items: center; margin: 10px 0; flex-wrap: wrap; }
    .panelrow > label:first-child { min-width: 64px; }
    h3 { margin: 4px 0 14px; font-size: 16px; font-weight: 500; letter-spacing: .1px; }
    .status { margin-top: 16px; font: 13px ui-monospace, monospace; color: var(--secondary-text-color, #49454f); min-height: 18px; }
    .status.err { color: var(--error-color, #ba1a1a); }
    .hint { color: var(--secondary-text-color, #79747e); font-size: 13px; }
    .tabs { display: flex; gap: 4px; margin-bottom: 20px; border-bottom: 1px solid var(--pu-outline); }
    .tab {
      background: none; color: var(--secondary-text-color, #49454f); border: none; box-shadow: none;
      border-radius: 8px 8px 0 0; padding: 12px 20px; font-weight: 500;
      border-bottom: 2px solid transparent; margin-bottom: -1px;
    }
    .tab:hover:not(.on) { background: color-mix(in srgb, var(--pu-primary) 7%, transparent); filter: none; }
    .tab.on { color: var(--pu-primary); border-bottom-color: var(--pu-primary); }
    .section { margin-bottom: 8px; }
    .shead { display: flex; gap: 10px; align-items: center; cursor: pointer; padding: 10px 4px; user-select: none; }
    .shead:hover .stitle { color: var(--pu-primary); }
    .chev { display: inline-block; transition: transform .15s; color: var(--secondary-text-color, #79747e); font-size: 12px; }
    .chev.open { transform: rotate(90deg); }
    .stitle { font-size: 16px; font-weight: 500; }
    .mtable { max-width: 780px; margin-bottom: 8px; }
    .mhead, .mrow { display: grid; grid-template-columns: 56px minmax(120px,1fr) minmax(80px,0.9fr) 120px 110px; gap: 12px; align-items: center; }
    .mtable.compact .mhead, .mtable.compact .mrow { grid-template-columns: minmax(120px,1fr) minmax(80px,0.9fr) 120px 110px; }
    .mhead { font-size: 12px; font-weight: 600; color: var(--secondary-text-color, #79747e); padding: 0 14px 6px; }
    .mrow { border: 1px solid var(--pu-outline); border-radius: 10px; padding: 10px 14px; margin-bottom: 8px; }
    .cell-name { font-weight: 500; display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
    .cell-action { display: flex; justify-content: flex-end; }
    .thumb { width: 48px; height: 48px; object-fit: contain; image-rendering: pixelated; background: #000; border-radius: 6px; box-shadow: inset 0 0 0 1px rgba(255,255,255,.12); }
    .catalog { list-style: none; padding: 0; margin: 0; max-width: 680px; }
    .catalog li {
      display: flex; gap: 12px; align-items: center; padding: 12px 14px;
      border: 1px solid var(--pu-outline); border-radius: 10px; margin-bottom: 8px;
    }
    .catalog li .grow { flex: 1; }
    .badge { font-size: 11px; font-weight: 500; padding: 3px 10px; border-radius: 12px; background: color-mix(in srgb, var(--pu-primary) 12%, transparent); color: var(--pu-primary); }
    .badge.ok { background: color-mix(in srgb, var(--success-color, #2e7d32) 18%, transparent); color: var(--success-color, #2e7d32); }
    .badge.warn { background: color-mix(in srgb, var(--warning-color, #ed6c02) 20%, transparent); color: var(--warning-color, #ed6c02); }
    .spec { width: 380px; height: 320px; font: 13px ui-monospace, monospace; resize: vertical; }
  `;

  protected firstUpdated(): void { this.loadDevices(); this.loadIcons(); }

  private async loadIcons() {
    try {
      const r = await this.hass.callWS({ type: "pimoroni_unicorn/icons" });
      this.iconNames = [...(r.builtin ?? []), ...(r.installed ?? [])];
    } catch { /* icons list optional */ }
  }

  connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener("keydown", this._onKey);
  }
  disconnectedCallback(): void {
    window.removeEventListener("keydown", this._onKey);
    super.disconnectedCallback();
  }

  private _onKey = (e: KeyboardEvent): void => {
    const tag = (e.target as HTMLElement)?.tagName;
    if (tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA") return;
    const d: Record<string, [number, number]> = {
      ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0],
    };
    const delta = d[e.key];
    if (!delta) return;
    e.preventDefault();
    this._nudge(delta[0], delta[1]);
  };

  private _nudge(dx: number, dy: number): void {
    const [W, H] = this.dims;
    if (this.selected >= 0 && this.layout.widgets[this.selected]) {
      const entry = this.layout.widgets[this.selected];
      const [bw, bh] = this.boxDims(this.selected);
      entry.x = Math.max(1 - bw, Math.min(W - 1, entry.x + dx));
      entry.y = Math.max(1 - bh, Math.min(H - 1, entry.y + dy));
      this.edited();
    }
  }

  private async loadDevices(): Promise<void> {
    const res = await this.hass.callWS({ type: "pimoroni_unicorn/devices" });
    this.devices = res.devices ?? [];
    if (this.devices.length) await this.selectDevice(this.devices[0].entry_id);
    else await this.selectMock(this.model);
  }

  private async loadCaps(query: Record<string, unknown>): Promise<void> {
    const caps = await this.hass.callWS({ type: "pimoroni_unicorn/capabilities", ...query });
    this.caps = caps.widgets ?? [];
    this.overlayCaps = caps.overlays ?? [];
    this.defaultLayout = caps.default_layout;
    this.model = caps.model;
    this.dims = MODELS[this.model] ?? [53, 11];
    await this.refreshStored();
  }

  private async selectDevice(entryId: string): Promise<void> {
    const dev = this.devices.find((d) => d.entry_id === entryId);
    if (!dev || !this.guardDiscard()) return;
    this.entryId = entryId;
    await this.loadCaps({ entry_id: entryId });
    const active = dev.active_layout ? this.stored[dev.active_layout] : undefined;
    this.loadLayout(active ?? this.defaultLayout);
  }

  private async selectMock(model: string): Promise<void> {
    if (!this.guardDiscard()) return;
    this.entryId = "";
    await this.loadCaps({ model });
    this.loadLayout(this.defaultLayout);
  }

  private async refreshStored(): Promise<void> {
    const res = await this.hass.callWS({ type: "pimoroni_unicorn/layouts" });
    this.stored = res.layouts ?? {};
  }

  private loadLayout(src: Layout): void {
    this.layout = JSON.parse(JSON.stringify(src));
    this.layoutName = this.layout.name ?? "default";
    this.selected = -1;
    this.dirty = false;
    this.renderPreview();
  }

  // True if it's safe to discard the current page (not dirty, or user confirms).
  private guardDiscard(): boolean {
    return !this.dirty || confirm("Discard unsaved changes to this page?");
  }

  private async renderPreview(): Promise<void> {
    try {
      const res = await this.hass.callWS({ type: "pimoroni_unicorn/render", model: this.model, layout: this.layout });
      this.png = res.png;
      this.wboxes = res.boxes ?? [];
      if (this.status.startsWith("Render failed")) this.status = "";
    } catch (err: any) {
      this.png = "";
      this.status = `Render failed: ${err?.message ?? err}`;
    }
  }

  private edited(): void {
    this.dirty = true;
    this.requestUpdate();
    if (this.renderTimer) clearTimeout(this.renderTimer);
    this.renderTimer = window.setTimeout(() => this.renderPreview(), 80);
    if (this.live && this.entryId) {
      if (this.pushTimer) clearTimeout(this.pushTimer);
      this.pushTimer = window.setTimeout(() => this.pushLive(), 250);
    }
  }

  private async pushLive(): Promise<void> {
    await this.hass.callWS({ type: "pimoroni_unicorn/push_layout", entry_id: this.entryId, layout: this.layout });
  }

  private capFor(id: string): WidgetCap | undefined { return this.caps.find((c) => c.id === id); }
  private typeOf(entry: WidgetEntry): string { return entry.type ?? entry.id; }
  private capForEntry(entry: WidgetEntry): WidgetCap | undefined { return this.capFor(this.typeOf(entry)); }
  private get scale(): number { return this.zoom || Math.max(4, Math.floor(PREVIEW_TARGET_PX / this.dims[0])); }
  private zoomBy(delta: number): void {
    this.zoom = Math.min(48, Math.max(4, this.scale + delta));
  }
  private onWheel(e: WheelEvent): void {
    e.preventDefault();
    this.zoomBy(e.deltaY < 0 ? 2 : -2);
  }
  // Box dims come from the backend (computed by the real widget_box), so any
  // cfg-driven sizing (variant, size, digits…) is correct without client logic.
  private boxDims(i: number): Size {
    const b = this.wboxes[i];
    if (b) return b;
    const entry = this.layout.widgets[i];
    const cap = entry ? this.capForEntry(entry) : undefined;
    return cap ? [cap.w, cap.h] : [0, 0];
  }
  private cfgVal(entry: WidgetEntry, key: string): unknown {
    return entry.cfg?.[key] ?? this.capForEntry(entry)?.default_cfg[key];
  }
  private setCfg(entry: WidgetEntry, key: string, value: unknown): void {
    entry.cfg = { ...(entry.cfg ?? {}), [key]: value };
    this.edited();
  }
  private setName(entry: WidgetEntry, value: string): void {
    const name = value.trim();
    if (name) entry.name = name; else delete entry.name;
    this.edited();
  }
  private setPos(entry: WidgetEntry, axis: "x" | "y", value: number): void {
    const [bw, bh] = this.boxDims(this.selected);
    const [W, H] = this.dims;
    const v = Math.round(value);
    if (axis === "x") entry.x = Math.max(1 - bw, Math.min(W - 1, v));
    else entry.y = Math.max(1 - bh, Math.min(H - 1, v));
    this.edited();
  }

  private onImgLoad(e: Event): void {
    const img = e.target as HTMLImageElement;
    this.dims = [img.naturalWidth, img.naturalHeight];
  }

  private startDrag(idx: number, ev: PointerEvent): void {
    ev.preventDefault();
    this.selected = idx;
    const entry = this.layout.widgets[idx];
    const [bw, bh] = this.boxDims(idx);
    const grid = this.layout.grid ?? 2;
    const [W, H] = this.dims;
    const sx = ev.clientX, sy = ev.clientY, ox = entry.x, oy = entry.y;
    (ev.target as HTMLElement).setPointerCapture(ev.pointerId);
    const move = (e: PointerEvent) => {
      const dx = Math.round((e.clientX - sx) / this.scale / grid) * grid;
      const dy = Math.round((e.clientY - sy) / this.scale / grid) * grid;
      // Allow hanging off either edge, keeping at least 1px on screen.
      entry.x = Math.max(1 - bw, Math.min(W - 1, ox + dx));
      entry.y = Math.max(1 - bh, Math.min(H - 1, oy + dy));
      this.edited();
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      this.renderPreview();
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  }

  private addWidget(type: string): void {
    if (!type) return;
    const cap = this.capFor(type);
    const present = new Set(this.layout.widgets.map((w) => w.id));
    let entry: WidgetEntry;
    if (cap?.multi || present.has(type)) {
      let n = 2, id = `${type}-${n}`;
      while (present.has(id)) id = `${type}-${++n}`;
      entry = { id, type, name: `${cap?.label ?? type} ${n}`, x: 0, y: 0, cfg: {} };
    } else {
      entry = { id: type, type, x: 0, y: 0, cfg: {} };
    }
    this.layout.widgets.push(entry);
    this.selected = this.layout.widgets.length - 1;
    this.edited();
  }
  private removeWidget(idx: number): void {
    this.layout.widgets.splice(idx, 1);
    this.selected = -1;
    this.edited();
  }
  private toggleOverlay(id: string, on: boolean): void {
    const set = new Set(this.layout.overlays ?? []);
    if (on) set.add(id); else set.delete(id);
    this.layout.overlays = [...set];
    this.edited();
  }

  private async save(): Promise<void> {
    if (!this.entryId) return;
    this.layout.name = this.layoutName;
    await this.hass.callWS({ type: "pimoroni_unicorn/save_layout", entry_id: this.entryId, name: this.layoutName, layout: this.layout });
    await this.refreshStored();
    this.dirty = false;
    this.status = `Saved "${this.layoutName}" and pushed to device.`;
  }
  private async deleteLayout(): Promise<void> {
    if (!this.stored[this.layoutName]) return;
    if (!confirm(`Delete page "${this.layoutName}"? This can't be undone.`)) return;
    await this.hass.callWS({ type: "pimoroni_unicorn/delete_layout", name: this.layoutName });
    await this.refreshStored();
    this.status = `Deleted "${this.layoutName}".`;
    this.loadLayout(this.defaultLayout);
  }

  private renderWidgetEditor() {
    const entry = this.layout.widgets[this.selected];
    if (!entry) return html`<p class="hint">Select a widget to edit.</p>`;
    const cap = this.capForEntry(entry);
    if (!cap) return "";
    return html`
      <h3>${entry.name ?? cap.label}</h3>
      <div class="panelrow"><label>Name</label>
        <input type="text" style="width:160px" placeholder=${cap.label} .value=${entry.name ?? ""}
          @change=${(e: Event) => this.setName(entry, (e.target as HTMLInputElement).value)} /></div>
      <div class="panelrow">
        <label>X</label><input type="number" style="width:60px" .value=${String(entry.x)}
          @change=${(e: Event) => this.setPos(entry, "x", +(e.target as HTMLInputElement).value)} />
        <label>Y</label><input type="number" style="width:60px" .value=${String(entry.y)}
          @change=${(e: Event) => this.setPos(entry, "y", +(e.target as HTMLInputElement).value)} />
      </div>
      ${cap.cfg_fields.map((f) => {
        if (f.type === "select") {
          return html`<div class="panelrow"><label>${f.label ?? f.key}</label>
            <select @change=${(e: Event) => this.setCfg(entry, f.key, (e.target as HTMLSelectElement).value)}>
              ${(f.options ?? []).map((o) => html`<option ?selected=${this.cfgVal(entry, f.key) === o}>${o}</option>`)}
            </select></div>`;
        }
        if (f.type === "number") {
          return html`<div class="panelrow"><label>${f.label ?? f.key}</label>
            <input type="number" style="width:60px" min=${f.min ?? 1} max=${f.max ?? 64} step=${f.step ?? 1}
              .value=${String(this.cfgVal(entry, f.key))}
              @change=${(e: Event) => this.setCfg(entry, f.key, +(e.target as HTMLInputElement).value)} /></div>`;
        }
        if (f.type === "icon") {
          return html`<div class="panelrow"><label>${f.label ?? f.key}</label>
            <select @change=${(e: Event) => this.setCfg(entry, f.key, (e.target as HTMLSelectElement).value)}>
              ${this.iconNames.map((o) => html`<option ?selected=${this.cfgVal(entry, f.key) === o}>${o}</option>`)}
            </select></div>`;
        }
        if (f.type === "entity") {
          return html`<div class="panelrow"><label>${f.label ?? f.key}</label>
            <input type="text" style="width:200px" list="pu-entity-list" placeholder="entity id…"
              .value=${String(this.cfgVal(entry, f.key) ?? "")}
              @change=${(e: Event) => this.setCfg(entry, f.key, (e.target as HTMLInputElement).value)} />
            <datalist id="pu-entity-list">
              ${Object.keys(this.hass?.states ?? {}).map((eid) => html`<option value=${eid}></option>`)}
            </datalist></div>`;
        }
        if (f.type === "text") {
          return html`<div class="panelrow"><label>${f.label ?? f.key}</label>
            <input type="text" style="width:120px" .value=${String(this.cfgVal(entry, f.key) ?? "")}
              @change=${(e: Event) => this.setCfg(entry, f.key, (e.target as HTMLInputElement).value)} /></div>`;
        }
        return html`<div class="panelrow"><label>${f.label ?? f.key}</label>
          <input type="color" .value=${hex(this.cfgVal(entry, f.key) as Rgb)}
            @input=${(e: Event) => this.setCfg(entry, f.key, unhex((e.target as HTMLInputElement).value))} /></div>`;
      })}
      <div class="panelrow"><button class="danger" @click=${() => this.removeWidget(this.selected)}>Remove widget</button></div>
    `;
  }

  private switchTab(tab: "layout" | "market" | "edit" | "screens"): void {
    this.tab = tab;
    if (tab === "market") this.loadCatalog();
    else if (tab === "edit") this.previewSpec();
    else if (tab === "screens") this.buildScreenPreview();
  }

  private _appBar() {
    const dev = this.devices.find((d) => d.entry_id === this.entryId);
    return html`
      <div class="appbar">
        <span class="brand">Pimoroni Unicorn</span>
        <label>Device
          <select @change=${(e: Event) => { const v = (e.target as HTMLSelectElement).value; v === MOCK ? this.selectMock(this.model) : this.selectDevice(v); }}>
            <option value=${MOCK} ?selected=${!this.entryId}>Mock (preview only)</option>
            ${this.devices.map((d) => html`<option value=${d.entry_id} ?selected=${d.entry_id === this.entryId}>${d.name}</option>`)}
          </select>
        </label>
        ${!this.entryId
          ? html`<label>Model
              <select @change=${(e: Event) => this.selectMock((e.target as HTMLSelectElement).value)}>
                ${Object.keys(MODELS).map((m) => html`<option ?selected=${m === this.model}>${m}</option>`)}
              </select></label>`
          : html`<span class="chip">${dev?.model ?? this.model}</span>`}
        <span class="chip dim">${this.dims[0]}&times;${this.dims[1]} px</span>
        <span class="grow"></span>
        ${this.dirty ? html`<span class="chip warn">unsaved changes</span>` : ""}
        ${this.fwManifest?.engine_version ? html`<span class="hint">engine v${this.fwManifest.engine_version}</span>` : ""}
      </div>`;
  }

  render() {
    return html`
      ${this._appBar()}
      <div class="tabs">
        <button class="tab ${this.tab === "layout" ? "on" : ""}" @click=${() => this.switchTab("layout")}>Designer</button>
        <button class="tab ${this.tab === "market" ? "on" : ""}" @click=${() => this.switchTab("market")}>Marketplace</button>
        <button class="tab ${this.tab === "edit" ? "on" : ""}" @click=${() => this.switchTab("edit")}>Widget editor</button>
        <button class="tab ${this.tab === "screens" ? "on" : ""}" @click=${() => this.switchTab("screens")}>Playlists</button>
      </div>
      ${this.tab === "market" ? this._marketplaceView()
        : this.tab === "edit" ? this._editorView()
        : this.tab === "screens" ? this._screensView()
        : this._layoutView()}
    `;
  }

  private _layoutView() {
    const s = this.scale;
    const presentTypes = new Set(this.layout.widgets.map((w) => this.typeOf(w)));
    const addable = this.caps.filter((c) => c.multi || !presentTypes.has(c.id));
    const overlays = new Set(this.layout.overlays ?? []);
    const gridStyle = `background-image:linear-gradient(to right,rgba(255,255,255,.10) 1px,transparent 1px),linear-gradient(to bottom,rgba(255,255,255,.10) 1px,transparent 1px);background-size:${s}px ${s}px`;
    return html`
      <div class="bar">
        <div class="group">
          <label>Page
            <select @change=${(e: Event) => { const v = (e.target as HTMLSelectElement).value; if (this.guardDiscard()) this.loadLayout(v === "__new__" ? this.defaultLayout : this.stored[v]); }}>
              ${Object.keys(this.stored).map((n) => html`<option ?selected=${n === this.layoutName}>${n}</option>`)}
              <option value="__new__">+ new page</option>
            </select>
          </label>
          <label>Name <input .value=${this.layoutName} @input=${(e: Event) => (this.layoutName = (e.target as HTMLInputElement).value)} /></label>
        </div>
        <div class="group">
          <button @click=${this.save} ?disabled=${!this.entryId} title=${this.entryId ? "" : "Select a device to save/push"}>Save &amp; Push</button>
          ${this.stored[this.layoutName] ? html`<button class="secondary" @click=${() => this.publishLayout(true)} title="List this page in the marketplace">Publish</button>` : ""}
          ${this.stored[this.layoutName] ? html`<button class="danger" @click=${this.deleteLayout}>Delete</button>` : ""}
        </div>
        <span class="grow"></span>
        <div class="group">
          <label>Snap
            <select @change=${(e: Event) => { this.layout.grid = +(e.target as HTMLSelectElement).value; this.edited(); }}>
              ${[1, 2, 4].map((n) => html`<option ?selected=${(this.layout.grid ?? 2) === n}>${n}</option>`)}
            </select> px</label>
          <label>Zoom
            <button class="zbtn" @click=${() => this.zoomBy(-2)} title="Zoom out">&minus;</button>
            <input type="range" min="4" max="48" .value=${String(this.scale)}
              @input=${(e: Event) => (this.zoom = +(e.target as HTMLInputElement).value)} />
            <button class="zbtn" @click=${() => this.zoomBy(2)} title="Zoom in">+</button>
          </label>
          <label><input type="checkbox" .checked=${this.wireframe} @change=${(e: Event) => (this.wireframe = (e.target as HTMLInputElement).checked)} /> wireframe</label>
          <label><input type="checkbox" .checked=${this.live} ?disabled=${!this.entryId} @change=${(e: Event) => (this.live = (e.target as HTMLInputElement).checked)} /> live push</label>
        </div>
      </div>

      <div class="wrap">
        <div class="col">
          <div class="stage" style=${`width:${this.dims[0] * s}px;height:${this.dims[1] * s}px`}
            @wheel=${this.onWheel}>
            ${this.png ? html`<img src="data:image/png;base64,${this.png}" width=${this.dims[0] * s} height=${this.dims[1] * s} @load=${this.onImgLoad} />` : ""}
            <div class="grid" style=${gridStyle}></div>
            ${this.wireframe ? html`<div class="boxes">${this.layout.widgets.map((w, i) => {
              if (!this.capForEntry(w) || w.enabled === false) return "";
              const [bw, bh] = this.boxDims(i);
              return html`<div class="box ${i === this.selected ? "sel" : ""}"
                style=${`left:${w.x * s}px;top:${w.y * s}px;width:${bw * s}px;height:${bh * s}px`}
                @pointerdown=${(e: PointerEvent) => this.startDrag(i, e)}>
                <span class="tag">${w.name ?? this.capForEntry(w)?.label ?? w.id}</span></div>`;
            })}</div>` : ""}
          </div>
          <div class="status ${this.status.startsWith("Render failed") ? "err" : ""}">${this.status}</div>
        </div>

        <div class="col">
          <h3>Widgets</h3>
          <ul class="wlist">
            ${this.layout.widgets.map((w, i) => html`
              <li class="${i === this.selected ? "sel" : ""}" @click=${() => (this.selected = i)}>
                <input type="checkbox" .checked=${w.enabled !== false}
                  @click=${(e: Event) => { e.stopPropagation(); w.enabled = (e.target as HTMLInputElement).checked; this.edited(); }} />
                <span class="grow">${w.name ?? this.capForEntry(w)?.label ?? w.id}</span>
              </li>`)}
          </ul>
          ${addable.length ? html`<div class="panelrow">
            <select id="addsel"><option value="">add widget…</option>${addable.map((c) => html`<option value=${c.id}>${c.label}</option>`)}</select>
            <button class="secondary" @click=${() => { const sel = this.renderRoot.querySelector("#addsel") as HTMLSelectElement; this.addWidget(sel.value); sel.value = ""; }}>Add</button>
          </div>` : ""}
          <h3>Overlays</h3>
          ${this.overlayCaps.map((o) => html`<div class="panelrow"><label>
            <input type="checkbox" .checked=${overlays.has(o.id)} @change=${(e: Event) => this.toggleOverlay(o.id, (e.target as HTMLInputElement).checked)} /> ${o.label}</label></div>`)}
          <h3>Selected</h3>
          ${this.renderWidgetEditor()}
        </div>
      </div>
    `;
  }

  private async loadCatalog() {
    await this.loadContent();
    if (!this.entryId) { this.catalog = []; this.fwManifest = null; return; }
    const c = await this.hass.callWS({ type: "pimoroni_unicorn/catalog", entry_id: this.entryId });
    this.catalog = c.widgets ?? [];
    const m = await this.hass.callWS({ type: "pimoroni_unicorn/fw_manifest", entry_id: this.entryId });
    this.fwManifest = m.manifest ?? null;
  }

  private async loadContent() {
    const q = this.entryId ? { entry_id: this.entryId } : {};
    const c = await this.hass.callWS({ type: "pimoroni_unicorn/content_catalog", ...q });
    this.contentLayouts = c.layouts ?? [];
    this.contentScreensets = c.screensets ?? [];
  }

  private async deployLayout(name: string, compatible: boolean) {
    if (!this.entryId) { this.status = "Select a device to deploy."; return; }
    if (!compatible && !confirm(`"${name}" isn't built for this device's model. Deploy anyway?`)) return;
    const r = await this.hass.callWS({
      type: "pimoroni_unicorn/deploy_layout", entry_id: this.entryId, name, override: !compatible });
    this.status = r.ok ? `Deployed "${name}" (installing any missing widgets/fonts first).` : `Deploy failed.`;
  }

  private async deployScreenset(id: string, compatible: boolean) {
    if (!this.entryId) { this.status = "Select a device to deploy."; return; }
    if (!compatible && !confirm(`"${id}" isn't built for this device's model. Deploy anyway?`)) return;
    const r = await this.hass.callWS({
      type: "pimoroni_unicorn/deploy_screenset", entry_id: this.entryId, id, override: !compatible });
    this.status = r.ok ? `Deployed screen set "${id}".` : `Deploy failed.`;
  }

  private async publishLayout(published: boolean) {
    if (!this.stored[this.layoutName]) { this.status = "Save the layout first, then publish."; return; }
    await this.hass.callWS({ type: "pimoroni_unicorn/publish_layout", name: this.layoutName, published });
    this.status = published ? `Published "${this.layoutName}" to the marketplace.` : `Unpublished "${this.layoutName}".`;
    this.loadContent();
  }

  private async saveScreenset() {
    if (!this.screenLayouts.length) { this.status = "Add at least one screen first."; return; }
    const id = prompt("Name this screen set:");
    if (!id) return;
    await this.hass.callWS({
      type: "pimoroni_unicorn/save_screenset", id,
      screenset: { label: id, layouts: this.screenLayouts, dwell: this.screenDwell,
                   transition: this.screenTransition, triggers: [] } });
    this.status = `Saved screen set "${id}".`;
    this.loadContent();
  }

  private async installWidget(id: string) {
    await this.hass.callWS({ type: "pimoroni_unicorn/fw_install", entry_id: this.entryId, widget_id: id });
    this.status = `Installing ${id}… device will reboot.`;
    setTimeout(() => this.loadCatalog(), 8000);
  }

  private async removeWidgetUnit(id: string) {
    await this.hass.callWS({ type: "pimoroni_unicorn/fw_remove", entry_id: this.entryId, widget_id: id });
    this.status = `Removing ${id}… device will reboot.`;
    setTimeout(() => this.loadCatalog(), 8000);
  }

  private _thumb(src?: string) {
    return src
      ? html`<img class="thumb" src="data:image/png;base64,${src}" />`
      : html`<div class="thumb"></div>`;
  }
  private _mhead() {
    return html`<div class="mhead"><span>Preview</span><span>Name</span><span>Dependencies</span><span>Status</span><span></span></div>`;
  }
  private _section(key: string, title: string, count: number, body: unknown) {
    const open = this.sectionsOpen[key] !== false;
    return html`<div class="section">
      <div class="shead" @click=${() => { this.sectionsOpen = { ...this.sectionsOpen, [key]: !open }; }}>
        <span class="chev ${open ? "open" : ""}">▸</span>
        <span class="stitle">${title}</span>
        <span class="chip dim">${count}</span>
      </div>
      ${open ? body : ""}
    </div>`;
  }
  private _contentRow(u: ContentUnit, kind: "layout" | "screenset") {
    return html`<div class="mrow">
      ${this._thumb(u.thumb)}
      <div class="cell-name">${u.label}
        ${u.compat?.length ? html`<span class="hint">[${u.compat.join("/")}]</span>` : ""}
        ${kind === "screenset" ? html`<span class="hint">${u.screens} page(s)</span>` : ""}</div>
      <div class="hint">${u.requires?.length ? html`<span title=${u.requires.join(", ")}>${u.requires.length} dep(s)</span>` : "—"}</div>
      <div>${u.compatible ? html`<span class="badge ok">compatible</span>` : html`<span class="badge warn">other model</span>`}</div>
      <div class="cell-action"><button ?disabled=${!this.entryId} title=${this.entryId ? "" : "Select a device to deploy"}
        @click=${() => kind === "layout" ? this.deployLayout(u.id, u.compatible) : this.deployScreenset(u.id, u.compatible)}>Deploy</button></div>
    </div>`;
  }

  private _marketplaceView() {
    const all = this.showAllContent;
    const apps = this.contentLayouts.filter((a) => all || a.compatible);
    const sets = this.contentScreensets.filter((s) => all || s.compatible);
    const cls: Record<string, string> = { installed: "ok", outdated: "warn", not_installed: "" };
    const lbl: Record<string, string> = { installed: "installed", outdated: "update available", not_installed: "not installed" };
    return html`
      <div class="bar">
        <label><input type="checkbox" .checked=${this.showAllContent}
          @change=${(e: Event) => { this.showAllContent = (e.target as HTMLInputElement).checked; }} /> show all models</label>
        <span class="grow"></span>
        <button class="secondary" @click=${this.loadCatalog}>Refresh</button>
      </div>

      ${this._section("pages", "Pages", apps.length, apps.length
        ? html`<div class="mtable">${this._mhead()}${apps.map((a) => this._contentRow(a, "layout"))}</div>`
        : html`<p class="hint">No published pages${all ? "" : " for this device"}. Publish one from the Designer tab.</p>`)}

      ${this._section("playlists", "Playlists", sets.length, sets.length
        ? html`<div class="mtable">${this._mhead()}${sets.map((s) => this._contentRow(s, "screenset"))}</div>`
        : html`<p class="hint">No playlists${all ? "" : " for this device"}. Compose one on the Playlists tab.</p>`)}

      ${this._section("widgets", "Widgets & fonts", this.catalog.length, this.entryId
        ? html`<div class="mtable">${this._mhead()}
            ${this.catalog.map((w) => html`<div class="mrow">
              ${this._thumb(w.thumb)}
              <div class="cell-name">${w.label}</div>
              <div class="hint">${w.requires?.length ? html`<span title=${w.requires.join(", ")}>${w.requires.length} dep(s)</span>` : "—"}</div>
              <div><span class="badge ${cls[w.status] ?? ""}">${lbl[w.status] ?? w.status}</span></div>
              <div class="cell-action">${w.status === "installed"
                ? html`<button class="danger" @click=${() => this.removeWidgetUnit(w.id)}>Remove</button>`
                : html`<button @click=${() => this.installWidget(w.id)}>${w.status === "outdated" ? "Update" : "Install"}</button>`}</div>
            </div>`)}
          </div>`
        : html`<p class="hint">Select a device to manage installed widgets.</p>`)}
      <p class="hint">Deploying a page installs any widgets/fonts it needs over the air first, then pushes it; the device reboots if files changed.</p>
    `;
  }

  private onSpecInput(text: string) {
    this.specText = text;
    clearTimeout(this.specTimer);
    this.specTimer = window.setTimeout(() => this.previewSpec(), 400);
  }

  private async previewSpec() {
    let spec: unknown;
    try { spec = JSON.parse(this.specText); }
    catch (e) { this.specError = `JSON: ${(e as Error).message}`; return; }
    try {
      const r = await this.hass.callWS({ type: "pimoroni_unicorn/widget_preview", model: this.model, spec });
      this.specPng = r.png; this.specError = "";
    } catch (err: any) { this.specError = err?.message ?? String(err); }
  }

  private async importSpec(text: string) {
    try {
      const r = await this.hass.callWS({ type: "pimoroni_unicorn/widget_import", text });
      this.specText = JSON.stringify(r.spec, null, 2);
      this.specError = ""; this.previewSpec();
    } catch (err: any) { this.specError = err?.message ?? String(err); }
  }

  private async saveSpec() {
    let spec: unknown;
    try { spec = JSON.parse(this.specText); }
    catch (e) { this.specError = `JSON: ${(e as Error).message}`; return; }
    try {
      const r = await this.hass.callWS({ type: "pimoroni_unicorn/widget_save", spec });
      this.specError = ""; this.status = `Saved custom widget "${r.id}". Install it from the Marketplace tab.`;
    } catch (err: any) { this.specError = err?.message ?? String(err); }
  }

  private _editorView() {
    const sc = Math.max(6, Math.floor(PREVIEW_TARGET_PX / this.dims[0]));
    return html`
      <div class="bar"><span class="hint">declarative widget — JSON spec, previewed on ${this.model}</span></div>
      <div class="wrap">
        <div class="col">
          <textarea class="spec" .value=${this.specText}
            @input=${(e: Event) => this.onSpecInput((e.target as HTMLTextAreaElement).value)}></textarea>
          <div class="panelrow">
            <button @click=${this.saveSpec}>Save custom</button>
            <button class="secondary" @click=${() => { const t = prompt("Paste YAML or JSON widget spec:"); if (t) this.importSpec(t); }}>Import…</button>
          </div>
          ${this.specError ? html`<div class="status err">${this.specError}</div>` : html`<div class="hint">binds: solar, soc, consumption, co2… (unknown binds preview as 123)</div>`}
        </div>
        <div class="col">
          <div class="stage" style=${`width:${this.dims[0] * sc}px;height:${this.dims[1] * sc}px`}>
            ${this.specPng ? html`<img src="data:image/png;base64,${this.specPng}" width=${this.dims[0] * sc} height=${this.dims[1] * sc} />` : ""}
          </div>
        </div>
      </div>
    `;
  }

  private toggleScreen(name: string, on: boolean) {
    this.screenLayouts = on
      ? [...this.screenLayouts, name]
      : this.screenLayouts.filter((n) => n !== name);
    this.buildScreenPreview();
  }

  private async buildScreenPreview() {
    clearInterval(this.screenTimer);
    const pngs: Record<string, string> = {};
    for (const name of this.screenLayouts) {
      const lay = this.stored[name];
      if (!lay) continue;
      try {
        const r = await this.hass.callWS({ type: "pimoroni_unicorn/render", model: this.model, layout: lay });
        pngs[name] = r.png;
      } catch { /* skip unrenderable */ }
    }
    this.screenPngs = pngs;
    this.screenIdx = 0;
    this.screenOpacity = 1;
    if (this.screenLayouts.length > 1 && this.screenDwell > 0) {
      this.screenTimer = window.setInterval(() => this._advancePreview(), this.screenDwell * 1000);
    }
  }

  private _advancePreview() {
    const next = (this.screenIdx + 1) % this.screenLayouts.length;
    if (this.screenTransition === "fade") {
      this.screenOpacity = 0;
      setTimeout(() => { this.screenIdx = next; this.screenOpacity = 1; }, 280);
    } else {
      this.screenIdx = next;
    }
  }

  private async pushScreens() {
    if (!this.entryId || !this.screenLayouts.length) return;
    await this.hass.callWS({
      type: "pimoroni_unicorn/push_screens", entry_id: this.entryId,
      layouts: this.screenLayouts, dwell: this.screenDwell, transition: this.screenTransition,
    });
    this.status = `Pushed ${this.screenLayouts.length} page(s) to device.`;
  }

  private _screensView() {
    const sc = Math.max(6, Math.floor(PREVIEW_TARGET_PX / this.dims[0]));
    const names = Object.keys(this.stored);
    const cur = this.screenLayouts[this.screenIdx];
    const png = cur ? this.screenPngs[cur] : "";
    return html`
      <div class="bar"><span class="hint">compose a playlist — pages cycle on a timer; preview on ${this.model}</span></div>
      <div class="wrap">
        <div class="col">
          <h3>Pages in this playlist</h3>
          <p class="hint">Tick pages to include; play order follows the order you tick.</p>
          ${names.length ? names.map((n) => html`<div class="panelrow"><label>
            <input type="checkbox" ?checked=${this.screenLayouts.includes(n)}
              @change=${(e: Event) => this.toggleScreen(n, (e.target as HTMLInputElement).checked)} />
            ${this.screenLayouts.includes(n) ? html`<span class="chip">${this.screenLayouts.indexOf(n) + 1}</span>` : ""} ${n}</label></div>`)
            : html`<p class="hint">No saved pages yet — create one on the Designer tab.</p>`}
          <div class="panelrow"><label>Dwell (s)
            <input type="number" style="width:60px" min="1" max="600" .value=${String(this.screenDwell)}
              @change=${(e: Event) => { this.screenDwell = +(e.target as HTMLInputElement).value; this.buildScreenPreview(); }} /></label></div>
          <div class="panelrow"><label>Transition
            <select @change=${(e: Event) => { this.screenTransition = (e.target as HTMLSelectElement).value as "none" | "fade"; this.buildScreenPreview(); }}>
              ${["none", "fade"].map((t) => html`<option ?selected=${t === this.screenTransition}>${t}</option>`)}
            </select></label></div>
          <div class="panelrow">
            <button @click=${this.pushScreens} ?disabled=${!this.entryId} title=${this.entryId ? "" : "Select a device to push"}>Push to device</button>
            <button class="secondary" @click=${this.saveScreenset} ?disabled=${!this.screenLayouts.length} title="Save as a reusable playlist in the marketplace">Save as playlist</button>
          </div>
        </div>
        <div class="col">
          <div class="stage" style=${`width:${this.dims[0] * sc}px;height:${this.dims[1] * sc}px`}>
            ${png ? html`<img src="data:image/png;base64,${png}" width=${this.dims[0] * sc} height=${this.dims[1] * sc}
              style=${`opacity:${this.screenOpacity};transition:opacity 280ms`} />` : ""}
          </div>
          <div class="hint">${this.screenLayouts.length > 1 ? `playing ${this.screenIdx + 1}/${this.screenLayouts.length}: ${cur ?? ""}` : (cur ?? "tick pages to preview")}</div>
        </div>
      </div>
    `;
  }
}

declare global { interface HTMLElementTagNameMap { "pimoroni-unicorn-panel": PimoroniUnicornPanel; } }

if (!customElements.get("pimoroni-unicorn-panel")) {
  customElements.define("pimoroni-unicorn-panel", PimoroniUnicornPanel);
}
