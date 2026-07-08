import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { hexToRgb, rgbToHex, floodFill, sampleSource } from "./pixel-utils";

type Tool = "pencil" | "eraser" | "pick" | "fill";
type DecodeFn = (req: { data?: string; url?: string; maxW: number; maxH: number })
  => Promise<{ png: string; w: number; h: number }>;

const MAX_W = 53, MAX_H = 32, UNDO_LIMIT = 50, CELL = 12;

@customElement("pixel-editor")
export class PixelEditor extends LitElement {
  @property({ type: Number }) w = 16;
  @property({ type: Number }) h = 16;
  @property({ attribute: false }) decode?: DecodeFn;

  @state() private px: Uint8ClampedArray = new Uint8ClampedArray(16 * 16 * 3);
  @state() private tool: Tool = "pencil";
  @state() private color = "#ff3355";
  @state() private swatches: string[] = ["#ffffff", "#ff3355", "#33cc66", "#3399ff"];
  @state() private name = "";
  @state() private zoomPct = 100;
  @state() private status = "";
  private undoStack: Uint8ClampedArray[] = [];
  private redoStack: Uint8ClampedArray[] = [];
  private src: { data: Uint8ClampedArray; w: number; h: number } | null = null;
  private srcOffX = 0; private srcOffY = 0;
  private painting = false;

  static styles = css`
    :host { display: block; }
    .wrap { display: flex; gap: 16px; flex-wrap: wrap; align-items: flex-start; }
    .rail { flex: 0 0 auto; min-width: 150px; display: flex; flex-direction: column; gap: 8px; }
    .stage { flex: 1 1 320px; display: flex; justify-content: center; background: #000;
             border-radius: 8px; padding: 12px; min-height: 200px; }
    canvas { image-rendering: pixelated; touch-action: none;
             box-shadow: 0 0 0 1px var(--divider-color, #444); max-width: 100%; }
    .tools { display: flex; flex-wrap: wrap; gap: 6px; }
    button { min-height: 40px; min-width: 40px; }
    button.on { outline: 2px solid var(--primary-color, #03a9f4); }
    .sw { display: flex; flex-wrap: wrap; gap: 4px; }
    .sw span { width: 24px; height: 24px; border-radius: 4px; cursor: pointer;
               box-shadow: inset 0 0 0 1px rgba(255,255,255,.3); }
    label { font-size: 14px; color: var(--secondary-text-color, #aaa); }
    input[type=text], input[type=number] { min-height: 36px; }
  `;

  protected willUpdate(changed: Map<string, unknown>): void {
    if (changed.has("w") || changed.has("h")) this.resize(this.w, this.h, false);
  }

  private resize(w: number, h: number, keep: boolean): void {
    w = Math.max(1, Math.min(MAX_W, w | 0));
    h = Math.max(1, Math.min(MAX_H, h | 0));
    const next = new Uint8ClampedArray(w * h * 3);
    if (keep) {
      for (let y = 0; y < Math.min(h, this.h); y++)
        for (let x = 0; x < Math.min(w, this.w); x++) {
          const o = (y * w + x) * 3, i = (y * this.w + x) * 3;
          next[o] = this.px[i]; next[o + 1] = this.px[i + 1]; next[o + 2] = this.px[i + 2];
        }
    }
    this.w = w; this.h = h; this.px = next; this.draw();
  }

  private snapshot(): void {
    this.undoStack.push(this.px.slice());
    if (this.undoStack.length > UNDO_LIMIT) this.undoStack.shift();
    this.redoStack = [];
  }
  private undo(): void {
    const prev = this.undoStack.pop();
    if (!prev) return;
    this.redoStack.push(this.px.slice());
    this.px = prev; this.draw();
  }
  private redo(): void {
    const next = this.redoStack.pop();
    if (!next) return;
    this.undoStack.push(this.px.slice());
    this.px = next; this.draw();
  }

  private get canvas(): HTMLCanvasElement | null {
    return this.renderRoot.querySelector("canvas");
  }

  protected updated(): void { this.draw(); }

  private draw(): void {
    const c = this.canvas;
    if (!c) return;
    c.width = this.w * CELL; c.height = this.h * CELL;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    for (let y = 0; y < this.h; y++)
      for (let x = 0; x < this.w; x++) {
        const i = (y * this.w + x) * 3;
        const r = this.px[i], g = this.px[i + 1], b = this.px[i + 2];
        if (r === 0 && g === 0 && b === 0) {
          ctx.fillStyle = (x + y) % 2 === 0 ? "#111" : "#1d1d1d"; // checkerboard = off
        } else {
          ctx.fillStyle = `rgb(${r},${g},${b})`;
        }
        ctx.fillRect(x * CELL, y * CELL, CELL, CELL);
      }
  }

  private cellAt(ev: PointerEvent): [number, number] | null {
    const c = this.canvas;
    if (!c) return null;
    const rect = c.getBoundingClientRect();
    const x = Math.floor(((ev.clientX - rect.left) / rect.width) * this.w);
    const y = Math.floor(((ev.clientY - rect.top) / rect.height) * this.h);
    if (x < 0 || y < 0 || x >= this.w || y >= this.h) return null;
    return [x, y];
  }

  private applyAt(x: number, y: number): void {
    const i = (y * this.w + x) * 3;
    if (this.tool === "pick") {
      this.color = rgbToHex(this.px[i], this.px[i + 1], this.px[i + 2]);
      return;
    }
    if (this.tool === "fill") {
      floodFill(this.px, this.w, this.h, x, y, hexToRgb(this.color));
      this.draw();
      return;
    }
    const rgb = this.tool === "eraser" ? [0, 0, 0] : hexToRgb(this.color);
    this.px[i] = rgb[0]; this.px[i + 1] = rgb[1]; this.px[i + 2] = rgb[2];
    this.draw();
  }

  private onDown(ev: PointerEvent): void {
    const cell = this.cellAt(ev);
    if (!cell) return;
    this.snapshot();
    this.painting = this.tool === "pencil" || this.tool === "eraser";
    (ev.target as HTMLElement).setPointerCapture(ev.pointerId);
    this.applyAt(cell[0], cell[1]);
  }
  private onMove(ev: PointerEvent): void {
    if (!this.painting) return;
    const cell = this.cellAt(ev);
    if (cell) this.applyAt(cell[0], cell[1]);
  }
  private onUp(): void { this.painting = false; }

  private async onFile(ev: Event): Promise<void> {
    const file = (ev.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const url = await new Promise<string>((res) => {
      const r = new FileReader(); r.onload = () => res(String(r.result)); r.readAsDataURL(file);
    });
    await this.loadImage(url);
  }

  private async onUrl(): Promise<void> {
    const url = prompt("Image or GIF URL:");
    if (!url || !this.decode) return;
    try {
      const r = await this.decode({ url, maxW: this.w, maxH: this.h });
      await this.loadImage(`data:image/png;base64,${r.png}`);
    } catch (e) { this.status = `Load failed: ${(e as { message?: string })?.message ?? e}`; }
  }

  private async loadImage(dataUrl: string): Promise<void> {
    const img = new Image();
    await new Promise<void>((res, rej) => { img.onload = () => res(); img.onerror = rej; img.src = dataUrl; });
    const off = document.createElement("canvas");
    off.width = img.naturalWidth; off.height = img.naturalHeight;
    const ictx = off.getContext("2d");
    if (!ictx) return;
    ictx.drawImage(img, 0, 0);
    const data = ictx.getImageData(0, 0, off.width, off.height).data;
    this.src = { data: new Uint8ClampedArray(data), w: off.width, h: off.height };
    this.zoomPct = 100; this.srcOffX = 0; this.srcOffY = 0;
    this.stampSource();
  }

  private stampSource(): void {
    if (!this.src) return;
    this.snapshot();
    const baseScale = Math.max(this.src.w / this.w, this.src.h / this.h);
    const scale = baseScale * (100 / Math.max(1, this.zoomPct));
    this.px = sampleSource(this.src.data, this.src.w, this.src.h,
      this.srcOffX, this.srcOffY, scale, this.w, this.h);
    this.draw();
  }

  private toDataUrl(): string {
    const off = document.createElement("canvas");
    off.width = this.w; off.height = this.h;
    const ctx = off.getContext("2d");
    if (!ctx) return "";
    const img = ctx.createImageData(this.w, this.h);
    for (let p = 0; p < this.w * this.h; p++) {
      img.data[p * 4] = this.px[p * 3];
      img.data[p * 4 + 1] = this.px[p * 3 + 1];
      img.data[p * 4 + 2] = this.px[p * 3 + 2];
      img.data[p * 4 + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
    return off.toDataURL("image/png");
  }

  private save(): void {
    const name = this.name.trim();
    if (!name) { this.status = "Name the icon first."; return; }
    this.dispatchEvent(new CustomEvent("save", {
      detail: { name, dataUrl: this.toDataUrl(), w: this.w, h: this.h },
      bubbles: true, composed: true,
    }));
  }

  private pickColor(hex: string): void {
    this.color = hex;
    if (!this.swatches.includes(hex)) this.swatches = [hex, ...this.swatches].slice(0, 8);
  }

  render() {
    const toolBtn = (t: Tool, label: string) => html`
      <button class=${this.tool === t ? "on" : ""} title=${label}
        @click=${() => { this.tool = t; }}>${label}</button>`;
    return html`
      <div class="wrap">
        <div class="rail">
          <div class="tools">
            ${toolBtn("pencil", "✏️")}${toolBtn("eraser", "🧽")}
            ${toolBtn("pick", "💧")}${toolBtn("fill", "🪣")}
            <button title="Undo" @click=${this.undo}>↶</button>
            <button title="Redo" @click=${this.redo}>↷</button>
          </div>
          <label>Colour</label>
          <input type="color" .value=${this.color}
            @input=${(e: Event) => this.pickColor((e.target as HTMLInputElement).value)} />
          <input type="text" .value=${this.color} style="width:100px"
            @change=${(e: Event) => this.pickColor((e.target as HTMLInputElement).value)} />
          <div class="sw">
            ${this.swatches.map((s) => html`<span style="background:${s}"
              @click=${() => this.pickColor(s)}></span>`)}
          </div>
        </div>

        <div class="stage">
          <canvas
            @pointerdown=${this.onDown} @pointermove=${this.onMove}
            @pointerup=${this.onUp} @pointercancel=${this.onUp}></canvas>
        </div>

        <div class="rail">
          <label>Source</label>
          <input type="file" accept="image/png,image/gif,image/apng,image/webp" @change=${this.onFile} />
          <button @click=${this.onUrl}>From URL…</button>
          ${this.src ? html`
            <label>Zoom ${this.zoomPct}%</label>
            <input type="range" min="50" max="400" .value=${String(this.zoomPct)}
              @input=${(e: Event) => { this.zoomPct = +(e.target as HTMLInputElement).value; this.stampSource(); }} />
            <div class="tools">
              <button @click=${() => { this.srcOffX -= 1; this.stampSource(); }}>←</button>
              <button @click=${() => { this.srcOffX += 1; this.stampSource(); }}>→</button>
              <button @click=${() => { this.srcOffY -= 1; this.stampSource(); }}>↑</button>
              <button @click=${() => { this.srcOffY += 1; this.stampSource(); }}>↓</button>
            </div>` : ""}
          <label>Size</label>
          <div class="tools">
            <input type="number" min="1" max="53" .value=${String(this.w)} style="width:56px"
              @change=${(e: Event) => this.resize(+(e.target as HTMLInputElement).value, this.h, true)} />
            <span>×</span>
            <input type="number" min="1" max="32" .value=${String(this.h)} style="width:56px"
              @change=${(e: Event) => this.resize(this.w, +(e.target as HTMLInputElement).value, true)} />
          </div>
          <label>Name</label>
          <input type="text" .value=${this.name} style="width:120px"
            @input=${(e: Event) => { this.name = (e.target as HTMLInputElement).value; }} />
          <button @click=${this.save}>Save as icon</button>
          ${this.status ? html`<span>${this.status}</span>` : ""}
        </div>
      </div>`;
  }
}
