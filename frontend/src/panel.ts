import { LitElement, html, css } from "lit";
import { property, state } from "lit/decorators.js";

type Rgb = [number, number, number];
type Size = [number, number];
type Rect = [number, number, number, number];
interface CfgField { key: string; type: "select" | "rgb" | "number"; options?: string[]; label?: string; min?: number; max?: number; step?: number; }
interface WidgetCap { id: string; label: string; w: number; h: number; variants: string[]; default_cfg: Record<string, unknown>; cfg_fields: CfgField[]; sizes: Record<string, Size>; }
interface OverlayCap { id: string; label: string; }
interface WidgetEntry { id: string; x: number; y: number; cfg?: Record<string, unknown>; enabled?: boolean; }
interface Layout { name?: string; model?: string; grid?: number; widgets: WidgetEntry[]; overlays?: string[]; }
interface Device { entry_id: string; device_id: string; model: string; name: string; active_layout?: string; }
interface CatalogWidget { id: string; label: string; kind: string; requires: string[]; device_file: string; hash: string; status: string; }
interface FwManifest { engine_version?: string; files?: Record<string, string>; }
interface Sensor { id: string; entity_id: string; name: string; on_color: string; off_color: string; x_pos: number; y_pos: number; width?: number; height?: number; size?: number; spacing?: number; }
const sw = (s: Sensor): number => s.width ?? s.size ?? 2;
const sh = (s: Sensor): number => s.height ?? s.size ?? 2;

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
const dummySensors = (): Sensor[] => [
  { id: "demo_a", entity_id: "", name: "Sensor A", on_color: "#8cc050", off_color: "#233014", x_pos: 0, y_pos: 0 },
  { id: "demo_b", entity_id: "", name: "Sensor B", on_color: "#f7be12", off_color: "#3e3005", x_pos: 3, y_pos: 0 },
];

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
  @state() private sensors: Sensor[] = [];
  @state() private selSensor = -1;
  @state() private layoutName = "default";
  @state() private live = false;
  @state() private wireframe = true;
  @state() private status = "";
  @state() private tab: "layout" | "market" | "edit" = "layout";
  @state() private catalog: CatalogWidget[] = [];
  @state() private fwManifest: FwManifest | null = null;
  @state() private specText = SAMPLE_SPEC;
  @state() private specPng = "";
  @state() private specError = "";
  private specTimer = 0;

  private renderTimer?: number;
  private pushTimer?: number;

  static styles = css`
    :host { display: block; padding: 16px; color: var(--primary-text-color, #111); }
    .wrap { display: flex; gap: 24px; flex-wrap: wrap; align-items: flex-start; }
    .col { min-width: 280px; }
    .bar { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; margin-bottom: 16px; }
    select, input, button { font: inherit; padding: 6px 8px; border-radius: 6px;
      border: 1px solid var(--divider-color, #ccc); background: var(--card-background-color, #fff); color: var(--primary-text-color, #111); }
    input[type="color"] { padding: 0; width: 34px; height: 28px; }
    button { cursor: pointer; background: var(--primary-color, #03a9f4); color: #fff; border: none; }
    button[disabled] { opacity: .5; cursor: not-allowed; }
    button.secondary { background: var(--secondary-background-color, #e0e0e0); color: var(--primary-text-color, #111); }
    button.danger { background: var(--error-color, #db4437); }
    button.zbtn { padding: 4px 9px; min-width: 28px; line-height: 1; }
    .stage { position: relative; display: inline-block; background: #000; line-height: 0; border: 1px solid var(--divider-color, #444); overflow: hidden; }
    .stage img { image-rendering: pixelated; display: block; }
    .grid, .boxes { position: absolute; inset: 0; pointer-events: none; }
    .boxes { pointer-events: none; }
    .box { position: absolute; box-sizing: border-box; border: 1px solid rgba(255,255,255,.35); cursor: grab; touch-action: none; pointer-events: auto; }
    .box.sel { border: 2px solid var(--primary-color, #03a9f4); background: rgba(3,169,244,.10); }
    .box.sensor { border: 1px dashed var(--warning-color, #ffa600); }
    .box .tag { position: absolute; top: -16px; left: 0; font: 11px monospace; color: #ccc; white-space: nowrap; }
    .wlist { list-style: none; padding: 0; margin: 0 0 12px; }
    .wlist li { display: flex; gap: 8px; align-items: center; padding: 6px 8px; border-radius: 6px; cursor: pointer; }
    .wlist li.sel { background: var(--secondary-background-color, #eef); }
    .wlist li .grow { flex: 1; }
    .panelrow { display: flex; gap: 8px; align-items: center; margin: 6px 0; flex-wrap: wrap; }
    .panelrow label { font-size: 13px; min-width: 64px; }
    h3 { margin: 4px 0 8px; }
    .status { margin-top: 12px; font: 13px monospace; color: var(--secondary-text-color, #888); min-height: 18px; }
    .status.err { color: var(--error-color, #db4437); }
    .hint { color: var(--secondary-text-color, #888); font-size: 13px; }
    .tabs { display: flex; gap: 4px; margin-bottom: 12px; }
    .tab { background: var(--secondary-background-color, #e0e0e0); color: var(--primary-text-color, #111); }
    .tab.on { background: var(--primary-color, #03a9f4); color: #fff; }
    .catalog { list-style: none; padding: 0; margin: 0; max-width: 640px; }
    .catalog li { display: flex; gap: 8px; align-items: center; padding: 8px; border-bottom: 1px solid var(--divider-color, #333); }
    .catalog li .grow { flex: 1; }
    .badge { font-size: 11px; padding: 1px 6px; border-radius: 8px; background: var(--secondary-background-color, #444); color: var(--secondary-text-color, #ccc); }
    .badge.ok { background: var(--success-color, #43a047); color: #fff; }
    .badge.warn { background: var(--warning-color, #ffa600); color: #000; }
    .spec { width: 380px; height: 320px; font: 13px monospace; resize: vertical;
      border: 1px solid var(--divider-color, #ccc); border-radius: 6px; padding: 8px;
      background: var(--card-background-color, #fff); color: var(--primary-text-color, #111); }
  `;

  protected firstUpdated(): void { this.loadDevices(); }

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
    } else if (this.selSensor >= 0 && this.sensors[this.selSensor]) {
      const sn = this.sensors[this.selSensor];
      sn.x_pos = Math.max(0, Math.min(W - sw(sn), sn.x_pos + dx));
      sn.y_pos = Math.max(0, Math.min(H - sh(sn), sn.y_pos + dy));
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
    if (!dev) return;
    this.entryId = entryId;
    await this.loadCaps({ entry_id: entryId });
    const sres = await this.hass.callWS({ type: "pimoroni_unicorn/display_sensors", entry_id: entryId });
    this.sensors = (sres.sensors ?? []).map((s: Sensor) => ({
      ...s,
      on_color: s.on_color?.startsWith("#") ? s.on_color : "#" + (s.on_color || "00ff00"),
      off_color: s.off_color?.startsWith("#") ? s.off_color : "#" + (s.off_color || "1a1a1a"),
    }));
    this.selSensor = -1;
    const active = dev.active_layout ? this.stored[dev.active_layout] : undefined;
    this.loadLayout(active ?? this.defaultLayout);
  }

  private async selectMock(model: string): Promise<void> {
    this.entryId = "";
    this.sensors = [];
    this.selSensor = -1;
    await this.loadCaps({ model });
    this.loadLayout(this.defaultLayout);
    for (const sn of dummySensors()) {
      const [x, y] = this.freeSlot(sn.size ?? 2);
      this.sensors = [...this.sensors, { ...sn, x_pos: x, y_pos: y }];
    }
  }

  private renderSensors() {
    return this.sensors.map((s) => ({
      x: s.x_pos, y: s.y_pos, width: sw(s), height: sh(s),
      on_rgb: unhex(s.on_color), off_rgb: unhex(s.off_color),
      state: s.entity_id ? this.hass?.states?.[s.entity_id]?.state === "on" : true,
    }));
  }

  private async refreshStored(): Promise<void> {
    const res = await this.hass.callWS({ type: "pimoroni_unicorn/layouts" });
    this.stored = res.layouts ?? {};
  }

  private loadLayout(src: Layout): void {
    this.layout = JSON.parse(JSON.stringify(src));
    this.layoutName = this.layout.name ?? "default";
    this.selected = -1;
    this.renderPreview();
  }

  private async renderPreview(): Promise<void> {
    try {
      const res = await this.hass.callWS({ type: "pimoroni_unicorn/render", model: this.model, layout: this.layout, sensors: this.renderSensors() });
      this.png = res.png;
      this.wboxes = res.boxes ?? [];
      if (this.status.startsWith("Render failed")) this.status = "";
    } catch (err: any) {
      this.png = "";
      this.status = `Render failed: ${err?.message ?? err}`;
    }
  }

  private edited(): void {
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
  private get scale(): number { return this.zoom || Math.max(4, Math.floor(PREVIEW_TARGET_PX / this.dims[0])); }
  private zoomBy(delta: number): void {
    this.zoom = Math.min(48, Math.max(4, this.scale + delta));
  }
  private onWheel(e: WheelEvent): void {
    e.preventDefault();
    this.zoomBy(e.deltaY < 0 ? 2 : -2);
  }
  // Rectangles already occupied by enabled widgets and existing sensors.
  private occupiedRects(): Rect[] {
    const rects: Rect[] = [];
    this.layout.widgets.forEach((w, i) => {
      if (w.enabled === false || !this.capFor(w.id)) return;
      const [bw, bh] = this.boxDims(i);
      rects.push([w.x, w.y, bw, bh]);
    });
    for (const sn of this.sensors) rects.push([sn.x_pos, sn.y_pos, sw(sn), sh(sn)]);
    return rects;
  }
  // First top-left cell where a size×size box clears all occupied rects.
  private freeSlot(size: number): [number, number] {
    const [W, H] = this.dims;
    const taken = this.occupiedRects();
    const hits = (x: number, y: number) =>
      taken.some(([rx, ry, rw, rh]) => x < rx + rw && x + size > rx && y < ry + rh && y + size > ry);
    for (let y = 0; y <= H - size; y++)
      for (let x = 0; x <= W - size; x++)
        if (!hits(x, y)) return [x, y];
    return [0, 0];
  }
  // Box dims come from the backend (computed by the real widget_box), so any
  // cfg-driven sizing (variant, size, digits…) is correct without client logic.
  private boxDims(i: number): Size {
    const b = this.wboxes[i];
    if (b) return b;
    const cap = this.capFor(this.layout.widgets[i]?.id ?? "");
    return cap ? [cap.w, cap.h] : [0, 0];
  }
  private cfgVal(entry: WidgetEntry, key: string): unknown {
    return entry.cfg?.[key] ?? this.capFor(entry.id)?.default_cfg[key];
  }
  private setCfg(entry: WidgetEntry, key: string, value: unknown): void {
    entry.cfg = { ...(entry.cfg ?? {}), [key]: value };
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

  private addWidget(id: string): void {
    if (!id) return;
    this.layout.widgets.push({ id, x: 0, y: 0, cfg: {} });
    this.selected = this.layout.widgets.length - 1;
    this.edited();
  }
  private removeWidget(idx: number): void {
    this.layout.widgets.splice(idx, 1);
    this.selected = -1;
    this.edited();
  }
  private startSensorDrag(i: number, ev: PointerEvent): void {
    ev.preventDefault();
    this.selSensor = i;
    this.selected = -1;
    const s = this.sensors[i];
    const grid = this.layout.grid ?? 1;
    const [W, H] = this.dims;
    const sx = ev.clientX, sy = ev.clientY, ox = s.x_pos, oy = s.y_pos;
    (ev.target as HTMLElement).setPointerCapture(ev.pointerId);
    const move = (e: PointerEvent) => {
      const dx = Math.round((e.clientX - sx) / this.scale / grid) * grid;
      const dy = Math.round((e.clientY - sy) / this.scale / grid) * grid;
      s.x_pos = Math.max(0, Math.min(W - sw(s), ox + dx));
      s.y_pos = Math.max(0, Math.min(H - sh(s), oy + dy));
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

  private addSensor(): void {
    const [x, y] = this.freeSlot(2);
    this.sensors.push({
      id: `sensor_${this.sensors.length + 1}`, entity_id: "", name: "Sensor",
      on_color: "#00ff00", off_color: "#1a1a1a", x_pos: x, y_pos: y, width: 2, height: 2,
    });
    this.selSensor = this.sensors.length - 1;
    this.edited();
  }
  private removeSensor(i: number): void {
    this.sensors.splice(i, 1);
    this.selSensor = -1;
    this.edited();
  }
  private setSensor(i: number, key: keyof Sensor, value: string | number): void {
    (this.sensors[i] as any)[key] = value;
    this.edited();
  }
  private async saveSensors(): Promise<void> {
    if (!this.entryId) return;
    await this.hass.callWS({ type: "pimoroni_unicorn/set_display_sensors", entry_id: this.entryId, sensors: this.sensors });
    this.status = "Saved sensors to device.";
  }
  private entityOptions(): string[] {
    const states = this.hass?.states ?? {};
    return Object.keys(states)
      .filter((e) => /^(binary_sensor|sensor|light|switch|input_boolean)\./.test(e))
      .sort();
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
    this.status = `Saved "${this.layoutName}" and pushed to device.`;
  }
  private async deleteLayout(): Promise<void> {
    if (!this.stored[this.layoutName]) return;
    await this.hass.callWS({ type: "pimoroni_unicorn/delete_layout", name: this.layoutName });
    await this.refreshStored();
    this.status = `Deleted "${this.layoutName}".`;
    this.loadLayout(this.defaultLayout);
  }

  private renderWidgetEditor() {
    const entry = this.layout.widgets[this.selected];
    if (!entry) return html`<p class="hint">Select a widget to edit.</p>`;
    const cap = this.capFor(entry.id);
    if (!cap) return "";
    return html`
      <h3>${cap.label}</h3>
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
        return html`<div class="panelrow"><label>${f.label ?? f.key}</label>
          <input type="color" .value=${hex(this.cfgVal(entry, f.key) as Rgb)}
            @input=${(e: Event) => this.setCfg(entry, f.key, unhex((e.target as HTMLInputElement).value))} /></div>`;
      })}
      <div class="panelrow"><button class="danger" @click=${() => this.removeWidget(this.selected)}>Remove widget</button></div>
    `;
  }

  render() {
    return html`
      <div class="tabs">
        <button class="tab ${this.tab === "layout" ? "on" : ""}" @click=${() => (this.tab = "layout")}>Layout</button>
        <button class="tab ${this.tab === "market" ? "on" : ""}" @click=${() => { this.tab = "market"; this.loadCatalog(); }}>Marketplace</button>
        <button class="tab ${this.tab === "edit" ? "on" : ""}" @click=${() => { this.tab = "edit"; this.previewSpec(); }}>Widget editor</button>
      </div>
      ${this.tab === "market" ? this._marketplaceView()
        : this.tab === "edit" ? this._editorView()
        : this._layoutView()}
    `;
  }

  private _layoutView() {
    const s = this.scale;
    const present = new Set(this.layout.widgets.map((w) => w.id));
    const addable = this.caps.filter((c) => !present.has(c.id));
    const overlays = new Set(this.layout.overlays ?? []);
    const gridStyle = `background-image:linear-gradient(to right,rgba(255,255,255,.10) 1px,transparent 1px),linear-gradient(to bottom,rgba(255,255,255,.10) 1px,transparent 1px);background-size:${s}px ${s}px`;
    return html`
      <div class="bar">
        <label>Device
          <select @change=${(e: Event) => { const v = (e.target as HTMLSelectElement).value; v === MOCK ? this.selectMock(this.model) : this.selectDevice(v); }}>
            <option value=${MOCK} ?selected=${!this.entryId}>(mock — preview only)</option>
            ${this.devices.map((d) => html`<option value=${d.entry_id} ?selected=${d.entry_id === this.entryId}>${d.name} (${d.model})</option>`)}
          </select>
        </label>
        ${!this.entryId ? html`<label>Model
          <select @change=${(e: Event) => this.selectMock((e.target as HTMLSelectElement).value)}>
            ${Object.keys(MODELS).map((m) => html`<option ?selected=${m === this.model}>${m}</option>`)}
          </select></label>` : html`<span class="hint">model: ${this.model}</span>`}
        <span class="hint">${this.dims[0]}&times;${this.dims[1]} px</span>
        <label>Layout
          <select @change=${(e: Event) => { const v = (e.target as HTMLSelectElement).value; this.loadLayout(v === "__new__" ? this.defaultLayout : this.stored[v]); }}>
            ${Object.keys(this.stored).map((n) => html`<option ?selected=${n === this.layoutName}>${n}</option>`)}
            <option value="__new__">— new —</option>
          </select>
        </label>
        <label>Name <input .value=${this.layoutName} @input=${(e: Event) => (this.layoutName = (e.target as HTMLInputElement).value)} /></label>
        <button @click=${this.save} ?disabled=${!this.entryId} title=${this.entryId ? "" : "Select a device to save/push"}>Save &amp; Push</button>
        ${this.stored[this.layoutName] ? html`<button class="danger" @click=${this.deleteLayout}>Delete</button>` : ""}
        <label>Snap
          <select @change=${(e: Event) => { this.layout.grid = +(e.target as HTMLSelectElement).value; this.edited(); }}>
            ${[1, 2, 4].map((n) => html`<option ?selected=${(this.layout.grid ?? 2) === n}>${n}</option>`)}
          </select>
        </label>
        <label>Zoom
          <button class="zbtn" @click=${() => this.zoomBy(-2)} title="Zoom out">&minus;</button>
          <input type="range" min="4" max="48" .value=${String(this.scale)}
            @input=${(e: Event) => (this.zoom = +(e.target as HTMLInputElement).value)} />
          <button class="zbtn" @click=${() => this.zoomBy(2)} title="Zoom in">+</button>
        </label>
        <label><input type="checkbox" .checked=${this.wireframe} @change=${(e: Event) => (this.wireframe = (e.target as HTMLInputElement).checked)} /> wireframe</label>
        <label><input type="checkbox" .checked=${this.live} ?disabled=${!this.entryId} @change=${(e: Event) => (this.live = (e.target as HTMLInputElement).checked)} /> live push</label>
      </div>

      <div class="wrap">
        <div class="col">
          <div class="stage" style=${`width:${this.dims[0] * s}px;height:${this.dims[1] * s}px`}
            @wheel=${this.onWheel}>
            ${this.png ? html`<img src="data:image/png;base64,${this.png}" width=${this.dims[0] * s} height=${this.dims[1] * s} @load=${this.onImgLoad} />` : ""}
            <div class="grid" style=${gridStyle}></div>
            ${this.wireframe ? html`<div class="boxes">${this.layout.widgets.map((w, i) => {
              if (!this.capFor(w.id) || w.enabled === false) return "";
              const [bw, bh] = this.boxDims(i);
              return html`<div class="box ${i === this.selected ? "sel" : ""}"
                style=${`left:${w.x * s}px;top:${w.y * s}px;width:${bw * s}px;height:${bh * s}px`}
                @pointerdown=${(e: PointerEvent) => this.startDrag(i, e)}>
                <span class="tag">${w.id}</span></div>`;
            })}${this.sensors.map((sn, i) => html`<div class="box sensor ${i === this.selSensor ? "sel" : ""}"
                style=${`left:${sn.x_pos * s}px;top:${sn.y_pos * s}px;width:${sw(sn) * s}px;height:${sh(sn) * s}px`}
                @pointerdown=${(e: PointerEvent) => this.startSensorDrag(i, e)}></div>`)}</div>` : ""}
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
                <span class="grow">${this.capFor(w.id)?.label ?? w.id}</span>
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

          <h3>Sensors</h3>
          ${this.sensors.map((sn, i) => html`
            <div class="panelrow ${i === this.selSensor ? "sel" : ""}" @click=${() => (this.selSensor = i)}>
              <input style="width:70px" .value=${sn.name} @change=${(e: Event) => this.setSensor(i, "name", (e.target as HTMLInputElement).value)} title="Name" />
              <select .value=${sn.entity_id} @change=${(e: Event) => this.setSensor(i, "entity_id", (e.target as HTMLSelectElement).value)} title="Entity">
                <option value="">(entity)</option>
                ${this.entityOptions().map((eid) => html`<option ?selected=${eid === sn.entity_id}>${eid}</option>`)}
              </select>
              <input type="color" .value=${sn.on_color} @input=${(e: Event) => this.setSensor(i, "on_color", (e.target as HTMLInputElement).value)} title="On colour" />
              <input type="color" .value=${sn.off_color} @input=${(e: Event) => this.setSensor(i, "off_color", (e.target as HTMLInputElement).value)} title="Off colour" />
              <input type="number" style="width:42px" min="1" max="32" .value=${String(sw(sn))}
                @change=${(e: Event) => this.setSensor(i, "width", +(e.target as HTMLInputElement).value)} title="Width (px)" />
              <input type="number" style="width:42px" min="1" max="32" .value=${String(sh(sn))}
                @change=${(e: Event) => this.setSensor(i, "height", +(e.target as HTMLInputElement).value)} title="Height (px)" />
              <button class="danger" @click=${(e: Event) => { e.stopPropagation(); this.removeSensor(i); }}>✕</button>
            </div>`)}
          <div class="panelrow">
            <button class="secondary" @click=${this.addSensor}>Add sensor</button>
            <button @click=${this.saveSensors} ?disabled=${!this.entryId} title=${this.entryId ? "" : "Select a device to save sensors"}>Save sensors</button>
          </div>
        </div>
      </div>
    `;
  }

  private async loadCatalog() {
    if (!this.entryId) { this.catalog = []; this.fwManifest = null; return; }
    const c = await this.hass.callWS({ type: "pimoroni_unicorn/catalog", entry_id: this.entryId });
    this.catalog = c.widgets ?? [];
    const m = await this.hass.callWS({ type: "pimoroni_unicorn/fw_manifest", entry_id: this.entryId });
    this.fwManifest = m.manifest ?? null;
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

  private _marketplaceView() {
    if (!this.entryId) return html`<p class="hint">Select a device on the Layout tab to manage installed widgets.</p>`;
    const ev = this.fwManifest?.engine_version ?? "?";
    const cls: Record<string, string> = { installed: "ok", outdated: "warn", not_installed: "" };
    const lbl: Record<string, string> = { installed: "installed", outdated: "update available", not_installed: "not installed" };
    return html`
      <div class="bar"><span class="hint">engine v${ev}</span>
        <button class="secondary" @click=${this.loadCatalog}>Refresh</button></div>
      <ul class="catalog">
        ${this.catalog.map((w) => html`<li>
          <span class="grow">${w.label} <span class="badge ${cls[w.status] ?? ""}">${lbl[w.status] ?? w.status}</span></span>
          ${w.requires?.length ? html`<span class="hint">needs ${w.requires.join(", ")}</span>` : ""}
          ${w.status === "installed"
            ? html`<button class="danger" @click=${() => this.removeWidgetUnit(w.id)}>Remove</button>`
            : html`<button @click=${() => this.installWidget(w.id)}>${w.status === "outdated" ? "Update" : "Install"}</button>`}
        </li>`)}
      </ul>
      <p class="hint">Install pulls the widget (and any fonts it needs) to the device over the air; the device reboots and the widget becomes available on the Layout tab.</p>
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
}

declare global { interface HTMLElementTagNameMap { "pimoroni-unicorn-panel": PimoroniUnicornPanel; } }

if (!customElements.get("pimoroni-unicorn-panel")) {
  customElements.define("pimoroni-unicorn-panel", PimoroniUnicornPanel);
}
