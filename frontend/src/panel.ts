import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";

interface WidgetCap { id: string; label: string; w: number; h: number; variants: string[]; }
interface WidgetEntry { id: string; x: number; y: number; cfg?: Record<string, unknown>; enabled?: boolean; }
interface Layout { name?: string; model?: string; grid?: number; widgets: WidgetEntry[]; overlays?: string[]; }
interface Device { entry_id: string; device_id: string; model: string; name: string; active_layout?: string; }

const PREVIEW_TARGET_PX = 640;

@customElement("pimoroni-unicorn-panel")
export class PimoroniUnicornPanel extends LitElement {
  @property({ attribute: false }) hass!: any;

  @state() private devices: Device[] = [];
  @state() private entryId = "";
  @state() private model = "galactic";
  @state() private layout: Layout = { widgets: [] };
  @state() private caps: WidgetCap[] = [];
  @state() private png = "";
  @state() private dims: [number, number] = [53, 11];
  @state() private selected = -1;
  @state() private layoutName = "default";
  @state() private status = "";

  private renderTimer?: number;

  static styles = css`
    :host { display: block; padding: 16px; }
    .bar { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; margin-bottom: 16px; }
    select, input, button { font: inherit; padding: 6px 8px; border-radius: 6px;
      border: 1px solid var(--divider-color, #ccc); background: var(--card-background-color, #fff);
      color: var(--primary-text-color, #111); }
    button { cursor: pointer; background: var(--primary-color, #03a9f4); color: #fff; border: none; }
    button.secondary { background: var(--secondary-background-color, #e0e0e0); color: var(--primary-text-color, #111); }
    .stage { position: relative; display: inline-block; background: #000; line-height: 0;
      border: 1px solid var(--divider-color, #444); }
    .stage img { image-rendering: pixelated; display: block; }
    .box { position: absolute; box-sizing: border-box; border: 1px solid rgba(255,255,255,.5);
      cursor: grab; touch-action: none; }
    .box.sel { border: 2px solid var(--primary-color, #03a9f4); background: rgba(3,169,244,.12); }
    .box .tag { position: absolute; top: -16px; left: 0; font: 11px monospace;
      color: var(--primary-text-color, #ccc); white-space: nowrap; }
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
    const stored = await this.hass.callWS({ type: "pimoroni_unicorn/layouts" });
    const active = dev.active_layout && stored.layouts?.[dev.active_layout];
    this.layout = JSON.parse(JSON.stringify(active ?? caps.default_layout));
    this.layoutName = this.layout.name ?? "default";
    this.selected = -1;
    await this.renderPreview();
  }

  private async renderPreview(): Promise<void> {
    const res = await this.hass.callWS({
      type: "pimoroni_unicorn/render", model: this.model, layout: this.layout,
    });
    this.png = res.png;
  }

  private scheduleRender(): void {
    if (this.renderTimer) clearTimeout(this.renderTimer);
    this.renderTimer = window.setTimeout(() => this.renderPreview(), 90);
  }

  private capFor(id: string): WidgetCap | undefined { return this.caps.find((c) => c.id === id); }
  private get scale(): number {
    return Math.max(4, Math.floor(PREVIEW_TARGET_PX / this.dims[0]));
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
    const sx = ev.clientX, sy = ev.clientY;
    const ox = entry.x, oy = entry.y;
    (ev.target as HTMLElement).setPointerCapture(ev.pointerId);

    const move = (e: PointerEvent) => {
      const dx = Math.round((e.clientX - sx) / this.scale / grid) * grid;
      const dy = Math.round((e.clientY - sy) / this.scale / grid) * grid;
      entry.x = Math.max(0, Math.min(W - cap.w, ox + dx));
      entry.y = Math.max(0, Math.min(H - cap.h, oy + dy));
      this.requestUpdate();
      this.scheduleRender();
    };
    const up = (e: PointerEvent) => {
      (ev.target as HTMLElement).releasePointerCapture(ev.pointerId);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      this.renderPreview();
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  }

  private async save(): Promise<void> {
    if (!this.entryId) return;
    this.layout.name = this.layoutName;
    await this.hass.callWS({
      type: "pimoroni_unicorn/save_layout",
      entry_id: this.entryId, name: this.layoutName, layout: this.layout,
    });
    this.status = `Saved "${this.layoutName}" and pushed to device.`;
  }

  render() {
    if (!this.devices.length) return html`<p class="hint">No Pimoroni Unicorn devices configured.</p>`;
    const s = this.scale;
    return html`
      <div class="bar">
        <label>Device
          <select @change=${(e: Event) => this.selectDevice((e.target as HTMLSelectElement).value)}>
            ${this.devices.map((d) => html`<option value=${d.entry_id} ?selected=${d.entry_id === this.entryId}>${d.name} (${d.model})</option>`)}
          </select>
        </label>
        <label>Name <input .value=${this.layoutName} @input=${(e: Event) => (this.layoutName = (e.target as HTMLInputElement).value)} /></label>
        <button @click=${this.save}>Save &amp; Push</button>
        <span class="hint">drag widgets to position</span>
      </div>
      <div class="stage" style=${`width:${this.dims[0] * s}px;height:${this.dims[1] * s}px`}>
        ${this.png ? html`<img src="data:image/png;base64,${this.png}" width=${this.dims[0] * s} height=${this.dims[1] * s} @load=${this.onImgLoad} />` : ""}
        ${this.layout.widgets.map((w, i) => {
          const cap = this.capFor(w.id);
          if (!cap || w.enabled === false) return "";
          return html`<div class="box ${i === this.selected ? "sel" : ""}"
            style=${`left:${w.x * s}px;top:${w.y * s}px;width:${cap.w * s}px;height:${cap.h * s}px`}
            @pointerdown=${(e: PointerEvent) => this.startDrag(i, e)}>
            <span class="tag">${w.id} ${w.x},${w.y}</span></div>`;
        })}
      </div>
      <div class="status">${this.status}</div>
    `;
  }
}

declare global { interface HTMLElementTagNameMap { "pimoroni-unicorn-panel": PimoroniUnicornPanel; } }
