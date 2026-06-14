import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";

type Rgb = [number, number, number];
interface CfgField { key: string; type: "select" | "rgb"; options?: string[]; label?: string; }
interface WidgetCap { id: string; label: string; w: number; h: number; variants: string[]; default_cfg: Record<string, unknown>; cfg_fields: CfgField[]; }
interface OverlayCap { id: string; label: string; }
interface WidgetEntry { id: string; x: number; y: number; cfg?: Record<string, unknown>; enabled?: boolean; }
interface Layout { name?: string; model?: string; grid?: number; widgets: WidgetEntry[]; overlays?: string[]; }
interface Device { entry_id: string; device_id: string; model: string; name: string; active_layout?: string; }

const PREVIEW_TARGET_PX = 560;
const NEW_LAYOUT = "— new —";

const hex = (rgb?: Rgb): string => {
  const [r, g, b] = rgb ?? [0, 0, 0];
  return "#" + [r, g, b].map((v) => Math.max(0, Math.min(255, v | 0)).toString(16).padStart(2, "0")).join("");
};
const unhex = (s: string): Rgb => [1, 3, 5].map((i) => parseInt(s.substr(i, 2), 16)) as Rgb;

@customElement("pimoroni-unicorn-panel")
export class PimoroniUnicornPanel extends LitElement {
  @property({ attribute: false }) hass!: any;

  @state() private devices: Device[] = [];
  @state() private entryId = "";
  @state() private model = "galactic";
  @state() private layout: Layout = { widgets: [] };
  @state() private caps: WidgetCap[] = [];
  @state() private overlayCaps: OverlayCap[] = [];
  @state() private defaultLayout: Layout = { widgets: [] };
  @state() private stored: Record<string, Layout> = {};
  @state() private png = "";
  @state() private dims: [number, number] = [53, 11];
  @state() private selected = -1;
  @state() private layoutName = "default";
  @state() private live = false;
  @state() private status = "";

  private renderTimer?: number;
  private pushTimer?: number;

  static styles = css`
    :host { display: block; padding: 16px; color: var(--primary-text-color, #111); }
    .wrap { display: flex; gap: 24px; flex-wrap: wrap; align-items: flex-start; }
    .col { min-width: 280px; }
    .bar { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; margin-bottom: 16px; }
    select, input, button { font: inherit; padding: 6px 8px; border-radius: 6px;
      border: 1px solid var(--divider-color, #ccc); background: var(--card-background-color, #fff);
      color: var(--primary-text-color, #111); }
    input[type="color"] { padding: 0; width: 34px; height: 28px; }
    button { cursor: pointer; background: var(--primary-color, #03a9f4); color: #fff; border: none; }
    button.secondary { background: var(--secondary-background-color, #e0e0e0); color: var(--primary-text-color, #111); }
    button.danger { background: var(--error-color, #db4437); }
    .stage { position: relative; display: inline-block; background: #000; line-height: 0; border: 1px solid var(--divider-color, #444); }
    .stage img { image-rendering: pixelated; display: block; }
    .box { position: absolute; box-sizing: border-box; border: 1px solid rgba(255,255,255,.5); cursor: grab; touch-action: none; }
    .box.sel { border: 2px solid var(--primary-color, #03a9f4); background: rgba(3,169,244,.12); }
    .box .tag { position: absolute; top: -16px; left: 0; font: 11px monospace; color: #ccc; white-space: nowrap; }
    .wlist { list-style: none; padding: 0; margin: 0 0 12px; }
    .wlist li { display: flex; gap: 8px; align-items: center; padding: 6px 8px; border-radius: 6px; cursor: pointer; }
    .wlist li.sel { background: var(--secondary-background-color, #eef); }
    .wlist li .grow { flex: 1; }
    .panelrow { display: flex; gap: 8px; align-items: center; margin: 6px 0; flex-wrap: wrap; }
    .panelrow label { font-size: 13px; min-width: 64px; }
    h3 { margin: 4px 0 8px; }
    .status { margin-top: 12px; font: 13px monospace; color: var(--secondary-text-color, #888); min-height: 18px; }
    .hint { color: var(--secondary-text-color, #888); font-size: 13px; }
  `;

  protected firstUpdated(): void { this.loadDevices(); }

  private async loadDevices(): Promise<void> {
    const res = await this.hass.callWS({ type: "pimoroni_unicorn/devices" });
    this.devices = res.devices ?? [];
    if (this.devices.length && !this.entryId) await this.selectDevice(this.devices[0].entry_id);
  }

  private async selectDevice(entryId: string): Promise<void> {
    const dev = this.devices.find((d) => d.entry_id === entryId);
    if (!dev) return;
    this.entryId = entryId;
    this.model = dev.model;
    const caps = await this.hass.callWS({ type: "pimoroni_unicorn/capabilities", entry_id: entryId });
    this.caps = caps.widgets ?? [];
    this.overlayCaps = caps.overlays ?? [];
    this.defaultLayout = caps.default_layout;
    await this.refreshStored();
    const active = dev.active_layout ? this.stored[dev.active_layout] : undefined;
    this.loadLayout(active ?? this.defaultLayout);
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
    const res = await this.hass.callWS({ type: "pimoroni_unicorn/render", model: this.model, layout: this.layout });
    this.png = res.png;
  }

  private edited(): void {
    this.requestUpdate();
    if (this.renderTimer) clearTimeout(this.renderTimer);
    this.renderTimer = window.setTimeout(() => this.renderPreview(), 80);
    if (this.live) {
      if (this.pushTimer) clearTimeout(this.pushTimer);
      this.pushTimer = window.setTimeout(() => this.pushLive(), 250);
    }
  }

  private async pushLive(): Promise<void> {
    if (!this.entryId) return;
    await this.hass.callWS({ type: "pimoroni_unicorn/push_layout", entry_id: this.entryId, layout: this.layout });
  }

  private capFor(id: string): WidgetCap | undefined { return this.caps.find((c) => c.id === id); }
  private get scale(): number { return Math.max(4, Math.floor(PREVIEW_TARGET_PX / this.dims[0])); }
  private cfgVal(entry: WidgetEntry, key: string): unknown {
    const cap = this.capFor(entry.id);
    return entry.cfg?.[key] ?? cap?.default_cfg[key];
  }
  private setCfg(entry: WidgetEntry, key: string, value: unknown): void {
    entry.cfg = { ...(entry.cfg ?? {}), [key]: value };
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
    const cap = this.capFor(entry.id);
    if (!cap) return;
    const grid = this.layout.grid ?? 2;
    const [W, H] = this.dims;
    const sx = ev.clientX, sy = ev.clientY, ox = entry.x, oy = entry.y;
    (ev.target as HTMLElement).setPointerCapture(ev.pointerId);
    const move = (e: PointerEvent) => {
      const dx = Math.round((e.clientX - sx) / this.scale / grid) * grid;
      const dy = Math.round((e.clientY - sy) / this.scale / grid) * grid;
      entry.x = Math.max(0, Math.min(W - cap.w, ox + dx));
      entry.y = Math.max(0, Math.min(H - cap.h, oy + dy));
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
  private toggleOverlay(id: string, on: boolean): void {
    const set = new Set(this.layout.overlays ?? []);
    on ? set.add(id) : set.delete(id);
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
      <div class="panelrow"><label>X</label>${entry.x} <label>Y</label>${entry.y}</div>
      ${cap.cfg_fields.map((f) => {
        if (f.type === "select") {
          return html`<div class="panelrow"><label>${f.label ?? f.key}</label>
            <select @change=${(e: Event) => this.setCfg(entry, f.key, (e.target as HTMLSelectElement).value)}>
              ${(f.options ?? []).map((o) => html`<option ?selected=${this.cfgVal(entry, f.key) === o}>${o}</option>`)}
            </select></div>`;
        }
        return html`<div class="panelrow"><label>${f.label ?? f.key}</label>
          <input type="color" .value=${hex(this.cfgVal(entry, f.key) as Rgb)}
            @input=${(e: Event) => this.setCfg(entry, f.key, unhex((e.target as HTMLInputElement).value))} /></div>`;
      })}
      <div class="panelrow"><button class="danger" @click=${() => this.removeWidget(this.selected)}>Remove widget</button></div>
    `;
  }

  render() {
    if (!this.devices.length) return html`<p class="hint">No Pimoroni Unicorn devices configured.</p>`;
    const s = this.scale;
    const present = new Set(this.layout.widgets.map((w) => w.id));
    const addable = this.caps.filter((c) => !present.has(c.id));
    const overlays = new Set(this.layout.overlays ?? []);
    return html`
      <div class="bar">
        <label>Device
          <select @change=${(e: Event) => this.selectDevice((e.target as HTMLSelectElement).value)}>
            ${this.devices.map((d) => html`<option value=${d.entry_id} ?selected=${d.entry_id === this.entryId}>${d.name} (${d.model})</option>`)}
          </select>
        </label>
        <label>Layout
          <select @change=${(e: Event) => { const v = (e.target as HTMLSelectElement).value; this.loadLayout(v === NEW_LAYOUT ? this.defaultLayout : this.stored[v]); }}>
            ${Object.keys(this.stored).map((n) => html`<option ?selected=${n === this.layoutName}>${n}</option>`)}
            <option>${NEW_LAYOUT}</option>
          </select>
        </label>
        <label>Name <input .value=${this.layoutName} @input=${(e: Event) => (this.layoutName = (e.target as HTMLInputElement).value)} /></label>
        <button @click=${this.save}>Save &amp; Push</button>
        ${this.stored[this.layoutName] ? html`<button class="danger" @click=${this.deleteLayout}>Delete</button>` : ""}
        <label><input type="checkbox" .checked=${this.live} @change=${(e: Event) => (this.live = (e.target as HTMLInputElement).checked)} /> live push</label>
      </div>

      <div class="wrap">
        <div class="col">
          <div class="stage" style=${`width:${this.dims[0] * s}px;height:${this.dims[1] * s}px`}>
            ${this.png ? html`<img src="data:image/png;base64,${this.png}" width=${this.dims[0] * s} height=${this.dims[1] * s} @load=${this.onImgLoad} />` : ""}
            ${this.layout.widgets.map((w, i) => {
              const cap = this.capFor(w.id);
              if (!cap || w.enabled === false) return "";
              return html`<div class="box ${i === this.selected ? "sel" : ""}"
                style=${`left:${w.x * s}px;top:${w.y * s}px;width:${cap.w * s}px;height:${cap.h * s}px`}
                @pointerdown=${(e: PointerEvent) => this.startDrag(i, e)}>
                <span class="tag">${w.id}</span></div>`;
            })}
          </div>
          <div class="status">${this.status}</div>
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
        </div>
      </div>
    `;
  }
}

declare global { interface HTMLElementTagNameMap { "pimoroni-unicorn-panel": PimoroniUnicornPanel; } }
