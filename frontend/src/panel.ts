import { LitElement, html, css } from "lit";
import { property, state } from "lit/decorators.js";
import "./pixel-editor";

type Rgb = [number, number, number];
type Size = [number, number];
interface CfgField { key: string; type: "select" | "rgb" | "rgblist" | "number" | "range" | "bool" | "text" | "entity" | "icon"; options?: string[]; label?: string; min?: number; max?: number; step?: number; }
interface WidgetCap { id: string; label: string; w: number; h: number; variants: string[]; default_cfg: Record<string, unknown>; cfg_fields: CfgField[]; sizes: Record<string, Size>; multi?: boolean; }
interface OverlayCap { id: string; label: string; }
interface WidgetEntry { id: string; type?: string; name?: string; x: number; y: number; cfg?: Record<string, unknown>; enabled?: boolean; }
interface Layout { name?: string; model?: string; grid?: number; widgets: WidgetEntry[]; overlays?: string[]; }
interface Device { entry_id: string; device_id: string; model: string; name: string; active_layout?: string; }
interface CatalogWidget { id: string; label: string; kind: string; requires: string[]; device_file: string; hash: string; status: string; thumb?: string; }
interface ContentUnit { id: string; label: string; kind: string; compat: string[]; requires: string[]; screens: number; compatible: boolean; thumb?: string; }
interface FontSpec { name: string; label: string; kind: "alpha" | "digits"; w: number; h: number; builtin?: boolean; sample: string; installed?: boolean; device_file?: string; }
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
// Firmware condition strings the device's weather widgets understand, with friendly labels.
const WEATHER_TEST: [string, string][] = [
  ["clear", "Clear"], ["partly_cloudy", "Partly cloudy"], ["cloudy", "Cloudy"],
  ["fog", "Fog"], ["rain", "Rain"], ["snow", "Snow"], ["thunderstorm", "Storm"],
];
const MOCK = "__mock__";
const DRAFT_KEY = "pu_panel_draft";

// Declarative op types and their per-op fields (all ops also carry x, y).
const OP_TYPES = ["value", "bar", "rect", "pixel", "icon", "dot"];
const OP_FIELDS: Record<string, [string, string][]> = {
  value: [["bind", "text"], ["fmt", "text"], ["color", "rgb"]],
  bar:   [["w", "num"], ["h", "num"], ["bind", "text"], ["max", "num"], ["color", "rgb"], ["bg", "rgb"]],
  rect:  [["w", "num"], ["h", "num"], ["color", "rgb"]],
  pixel: [["color", "rgb"]],
  icon:  [["name", "icon"]],
  dot:   [["w", "num"], ["h", "num"], ["bind", "text"], ["on_color", "rgb"], ["off_color", "rgb"]],
};

const OP_META: Record<string, { label: string; desc: string }> = {
  value: { label: "Value",      desc: "Draw a data value as text — pick a source and number format." },
  bar:   { label: "Bar",        desc: "Horizontal bar that fills from 0 to max by a value." },
  rect:  { label: "Rectangle",  desc: "A filled rectangle." },
  pixel: { label: "Pixel",      desc: "A single lit pixel." },
  icon:  { label: "Icon",       desc: "Draw an installed icon by name." },
  dot:   { label: "Status dot", desc: "A box that switches colour on a sensor's on/off state." },
};

const FIELD_META: Record<string, { label: string; hint?: string }> = {
  bind:      { label: "Data source", hint: "what value to show — see Available data" },
  fmt:       { label: "Number format", hint: "e.g. {:.1f}W or {}%  (Python format)" },
  color:     { label: "Colour" },
  bg:        { label: "Background", hint: "track colour behind the bar" },
  w:         { label: "Width", hint: "pixels" },
  h:         { label: "Height", hint: "pixels" },
  max:       { label: "Max value", hint: "value that fills the bar fully" },
  name:      { label: "Icon" },
  on_color:  { label: "On colour" },
  off_color: { label: "Off colour" },
};

const KNOWN_BINDS = ["solar", "consumption", "soc", "temp", "weather", "energy_mode", "co2"];
const fieldLabel = (k: string) => FIELD_META[k]?.label ?? k;

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
  @state() private widgetThumbs: Record<string, string> = {};
  @state() private overlayCaps: OverlayCap[] = [];
  @state() private defaultLayout: Layout = { widgets: [] };
  @state() private stored: Record<string, Layout> = {};
  @state() private png = "";
  @state() private wboxes: Size[] = [];
  @state() private dims: Size = [53, 11];
  @state() private orientation = 0;  // device mounting rotation; affects effective dims
  @state() private previewWeather = "";  // "" = live; else a forced condition for the preview
  @state() private zoom = 0;  // px per LED; 0 = auto-fit
  @state() private selected = -1;
  @state() private dragIdx = -1;
  @state() private dragOverIdx = -1;
  @state() private layoutName = "default";
  @state() private live = false;
  @state() private wireframe = false;
  @state() private locked = false;
  @state() private status = "";
  @state() private tab: "layout" | "market" | "edit" | "screens" | "paint" = "layout";
  @state() private catalog: CatalogWidget[] = [];
  @state() private busyUnits: Record<string, string> = {};
  @state() private fwManifest: FwManifest | null = null;
  @state() private activePage: string | null = null;  // page name the device reports rendering
  @state() private contentLayouts: ContentUnit[] = [];
  @state() private contentScreensets: ContentUnit[] = [];
  @state() private showAllContent = false;
  @state() private iconNames: string[] = [];
  @state() private installedIcons: string[] = [];
  @state() private iconThumbs: Record<string, string> = {};
  @state() private deviceIcons: string[] = [];
  @state() private iconCode = "";
  @state() private iconName = "";
  @state() private iconTargets: string[] = [];
  @state() private iconUrl = "";
  @state() private iconImgName = "";
  @state() private iconFileData = "";     // base64 of a chosen image/GIF (no data: prefix)
  @state() private iconFilePreview = "";  // data URL for the local preview thumbnail
  @state() private iconImportNote = "";
  @state() private iconDims: Record<string, [number, number]> = {};
  @state() private iconSizeMode: "device" | "native" | "custom" = "device";
  @state() private iconCustomW = 16;
  @state() private iconCustomH = 16;
  @state() private fonts: FontSpec[] = [];
  @state() private fontText = "";
  @state() private fontPngs: Record<string, string> = {};
  private fontTimer = 0;
  @state() private dirty = false;
  @state() private undoStack: Layout[] = [];
  @state() private redoStack: Layout[] = [];
  private snapshot: Layout = { widgets: [] };
  @state() private sectionsOpen: Record<string, boolean> = {};
  @state() private screenLayouts: string[] = [];
  @state() private screenDwell = 10;
  @state() private screenTransition: "none" | "fade" = "none";
  @state() private screenPngs: Record<string, string> = {};
  @state() private screenIdx = 0;
  @state() private screenOpacity = 1;
  private screenTimer = 0;
  @state() private specText = SAMPLE_SPEC;
  @state() private editMode: "form" | "yaml" = "form";
  @state() private specPng = "";
  @state() private specError = "";
  private specTimer = 0;

  private renderTimer?: number;
  private pushTimer?: number;
  private _frameTimers: Record<string, number> = {};
  private _pendingDraft: { entryId: string; layoutName: string; layout: Layout } | null = null;
  private _onBeforeUnload = (e: BeforeUnloadEvent): void => { if (this.dirty) { e.preventDefault(); e.returnValue = ""; } };

  private _persistDraft(): void {
    try { localStorage.setItem(DRAFT_KEY, JSON.stringify({ entryId: this.entryId, layoutName: this.layoutName, layout: this.layout })); } catch { /* storage unavailable */ }
  }
  private _clearDraft(): void {
    try { localStorage.removeItem(DRAFT_KEY); } catch { /* ignore */ }
  }
  private _applyPendingDraft(): void {
    const d = this._pendingDraft;
    this._pendingDraft = null;
    if (!d || d.entryId !== this.entryId || !d.layout?.widgets) return;
    this.layout = JSON.parse(JSON.stringify(d.layout));
    this.layoutName = d.layoutName || this.layoutName;
    this.snapshot = JSON.parse(JSON.stringify(this.layout));
    this.dirty = true;
    this.status = "Restored your unsaved changes — Save to keep them, or pick another page to discard.";
    this.renderPreview();
  }

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
    .grouplabel { font-size: 11px; font-weight: 600; color: var(--secondary-text-color, #79747e); }
    .help { font-size: 13px; color: var(--pu-primary); text-decoration: none; }
    .help:hover { text-decoration: underline; }
    .firstrun { margin: 4px 0 16px; padding: 12px 16px; border-radius: var(--pu-radius); font-size: 14px;
      color: var(--primary-text-color, #1c1b1f); background: color-mix(in srgb, var(--pu-primary) 8%, var(--pu-surface)); }
    .empty { background:
      repeating-linear-gradient(45deg, var(--pu-outline) 0 1px, transparent 1px 7px), var(--pu-surface) !important; }
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
    .colorctl { display: inline-flex; align-items: center; gap: 8px; }
    .hexin { width: 84px; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; text-transform: lowercase; }
    .rangeval { min-width: 32px; text-align: right; color: var(--secondary-text-color, #49454f); font-variant-numeric: tabular-nums; }
    input[type="checkbox"] { width: 16px; height: 16px; accent-color: var(--pu-primary); }
    button {
      font: inherit; font-size: 14px; font-weight: 500; cursor: pointer;
      padding: 11px 20px; border-radius: 20px; border: none;
      background: var(--pu-primary); color: var(--pu-on-primary);
      transition: filter .15s, box-shadow .15s; box-shadow: 0 1px 2px rgba(0,0,0,.15);
    }
    button:hover:not([disabled]) { filter: brightness(1.08); box-shadow: 0 2px 5px rgba(0,0,0,.2); }
    button:active:not([disabled]) { filter: brightness(.95); }
    :focus-visible { outline: 2px solid var(--pu-primary); outline-offset: 2px; border-radius: 4px; }
    button[disabled] { opacity: .38; cursor: not-allowed; box-shadow: none; }
    button.secondary { background: color-mix(in srgb, var(--pu-primary) 14%, var(--pu-surface)); color: var(--pu-primary); box-shadow: none; }
    button.danger { background: var(--error-color, #ba1a1a); color: #fff; }
    button.zbtn { padding: 6px; min-width: 40px; min-height: 40px; line-height: 1; border-radius: 10px; }
    .stagewrap { max-width: 100%; max-height: 62vh; overflow: auto; overscroll-behavior: contain; padding-top: 18px; cursor: grab; }
    .stagewrap.panning { cursor: grabbing; }
    .stage { position: relative; display: inline-block; background: #000; line-height: 0; border-radius: 8px; box-shadow: inset 0 0 0 1px rgba(255,255,255,.12); overflow: hidden; }
    .stage img { image-rendering: pixelated; display: block; }
    .grid, .boxes { position: absolute; inset: 0; pointer-events: none; }
    /* Boxes are draggable hit-areas always (unless locked); only visible in wireframe mode or when selected. */
    .box { position: absolute; box-sizing: border-box; border: 1px solid transparent; cursor: grab; touch-action: none; pointer-events: auto; border-radius: 2px; }
    .box:hover { border-color: rgba(255,255,255,.25); }
    .boxes.wf .box { border-color: rgba(255,255,255,.35); }
    .box.sel, .boxes.wf .box.sel { border: 2px solid var(--pu-primary); background: color-mix(in srgb, var(--pu-primary) 14%, transparent); }
    .box .tag { position: absolute; top: -17px; left: 0; font: 11px ui-monospace, monospace; color: #ddd; white-space: nowrap; display: none; }
    .boxes.wf .box .tag, .box.sel .tag { display: block; }
    .wlist { list-style: none; padding: 0; margin: 0 0 12px; }
    .wlist li { display: flex; gap: 10px; align-items: center; padding: 10px 12px; min-height: 48px; box-sizing: border-box; border-radius: 10px; cursor: pointer; transition: background .12s; }
    .wlist li:hover { background: color-mix(in srgb, var(--pu-primary) 7%, transparent); }
    .wlist li.sel { background: color-mix(in srgb, var(--pu-primary) 14%, transparent); box-shadow: inset 3px 0 0 var(--pu-primary); }
    .wlist li .grow { flex: 1; }
    .wlist li.dragging { opacity: .4; }
    .wlist li.dragover { outline: 2px solid var(--pu-primary); outline-offset: -2px; }
    .wlist li .drag { cursor: grab; color: var(--secondary-text-color, #79747e); user-select: none; line-height: 1; }
    .wlist li .drag:active { cursor: grabbing; }
    .wlist li .wlx { border: none; background: none; color: var(--secondary-text-color, #79747e); font-size: 20px; line-height: 1; width: 40px; height: 40px; border-radius: 8px; cursor: pointer; padding: 0; display: grid; place-items: center; flex: none; }
    .wlist li .wlx:hover { background: color-mix(in srgb, var(--error-color, #ba1a1a) 16%, transparent); color: var(--error-color, #ba1a1a); }
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
    .shead { display: flex; gap: 10px; align-items: center; cursor: pointer; padding: 12px 4px; min-height: 48px; box-sizing: border-box; user-select: none; }
    .shead:hover .stitle { color: var(--pu-primary); }
    .chev { width: 24px; height: 24px; flex: none; transition: transform .15s; fill: var(--secondary-text-color, #79747e); }
    .chev.open { transform: rotate(90deg); }
    .stitle { font-size: 22px; line-height: 28px; font-weight: 400; letter-spacing: 0; }
    .mtable { max-width: 780px; margin-bottom: 8px; }
    .mhead, .mrow { display: grid; grid-template-columns: 108px minmax(120px,1fr) minmax(80px,0.9fr) 120px 150px; gap: 12px; align-items: center; }
    .mhead { font-size: 12px; font-weight: 600; color: var(--secondary-text-color, #79747e); padding: 0 14px 6px; }
    .mrow { border: 1px solid var(--pu-outline); border-radius: 10px; padding: 10px 14px; margin-bottom: 8px; }
    .cell-name { font-weight: 500; display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
    .cell-action { display: flex; justify-content: flex-end; gap: 8px; }
    .cell-action button { white-space: nowrap; }
    .thumb { width: 100px; height: 64px; object-fit: contain; image-rendering: pixelated; background: #000; border-radius: 6px; box-shadow: inset 0 0 0 1px rgba(255,255,255,.12); }
    .iconprev { width: 128px; height: 128px; flex: none; object-fit: contain; image-rendering: pixelated; background: #000; border-radius: 8px; box-shadow: inset 0 0 0 1px rgba(255,255,255,.12); }
    .iconthumb { width: 64px; height: 64px; flex: none; object-fit: contain; image-rendering: pixelated; background: #000; border-radius: 6px; box-shadow: inset 0 0 0 1px rgba(255,255,255,.12); }
    .addchips { display: flex; flex-wrap: wrap; gap: 8px; margin: 6px 0 10px; }
    .addchip { font-size: 14px; font-weight: 500; line-height: 20px; padding: 9px 14px; min-height: 40px; border-radius: 20px; border: 1px solid var(--pu-outline); background: transparent; color: inherit; cursor: pointer; }
    .addchip:hover { background: color-mix(in srgb, var(--pu-primary) 12%, transparent); border-color: var(--pu-primary); color: var(--pu-primary); }
    .addgrid { display: grid; grid-template-columns: repeat(auto-fill, minmax(92px, 1fr)); gap: 8px; margin: 6px 0 10px; }
    .addtile { display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 8px; border-radius: 12px; border: 1px solid var(--pu-outline); background: transparent; color: inherit; cursor: pointer; transition: background .12s, border-color .12s; }
    .addtile:hover { background: color-mix(in srgb, var(--pu-primary) 12%, transparent); border-color: var(--pu-primary); }
    .addthumb { width: 100%; height: 40px; object-fit: contain; image-rendering: pixelated; background: #000; border-radius: 6px; }
    .addtile-label { font-size: 12px; font-weight: 500; line-height: 16px; text-align: center; }
    .targets { display: flex; gap: 12px; flex-wrap: wrap; align-items: center; }
    .chk { display: inline-flex; gap: 4px; align-items: center; font-weight: 400; }
    .catalog { list-style: none; padding: 0; margin: 0; max-width: 680px; }
    .catalog li {
      display: flex; gap: 12px; align-items: center; padding: 12px 14px;
      border: 1px solid var(--pu-outline); border-radius: 10px; margin-bottom: 8px;
    }
    .catalog li .grow { flex: 1; }
    .badge { font-size: 11px; font-weight: 500; padding: 3px 10px; border-radius: 12px; white-space: nowrap; background: color-mix(in srgb, var(--pu-primary) 12%, transparent); color: var(--pu-primary); }
    .badge.working { animation: pupulse 1.2s ease-in-out infinite; }
    @keyframes pupulse { 50% { opacity: .5; } }
    .badges { display: flex; flex-wrap: wrap; gap: 6px; }
    .badge.ok { background: color-mix(in srgb, var(--success-color, #2e7d32) 18%, transparent); color: var(--success-color, #2e7d32); }
    .badge.warn { background: color-mix(in srgb, var(--warning-color, #ed6c02) 20%, transparent); color: var(--warning-color, #ed6c02); }
    .spec { width: 380px; height: 320px; font: 13px ui-monospace, monospace; resize: vertical; }
    .opcard { border: 1px solid var(--pu-outline); border-radius: 10px; padding: 12px 14px; margin-bottom: 12px; }
    .ophead { display: flex; gap: 10px; align-items: center; margin-bottom: 4px; }
    .optitle { font-size: 16px; font-weight: 500; }
    .opdesc { color: var(--secondary-text-color, #79747e); font-size: 13px; margin: 0 0 10px; }
    .fieldgrid { display: grid; grid-template-columns: max-content 1fr; gap: 8px 12px; align-items: center; }
    .flabel { font-size: 14px; color: var(--secondary-text-color, #49454f); }
    .fhint { font-size: 12px; color: var(--secondary-text-color, #79747e); margin-left: 8px; }
    .fmtchip { font-family: ui-monospace, monospace; font-size: 11px; padding: 3px 8px; border-radius: 8px; border: 1px solid var(--pu-outline); background: transparent; color: var(--secondary-text-color, #79747e); cursor: pointer; }
    .fmtchip:hover { border-color: var(--pu-primary); color: var(--pu-primary); }
    .fcell { display: flex; align-items: center; flex-wrap: wrap; gap: 4px; }
    .frow { display: flex; align-items: center; gap: 14px; padding: 8px 10px; border: 1px solid var(--pu-outline); border-radius: 8px; margin-bottom: 6px; }
    .iconrow { display: flex; align-items: center; gap: 12px; min-height: 48px; padding: 6px 12px; border: 1px solid var(--pu-outline); border-radius: 10px; margin-bottom: 6px; }
    .fmeta { display: flex; flex-direction: column; gap: 2px; width: 160px; flex: none; }
    .fprev { height: 40px; image-rendering: pixelated; background: #000; border-radius: 6px; padding: 0 8px; object-fit: contain; box-shadow: inset 0 0 0 1px rgba(255,255,255,.12); }
    .swatches { display: flex; align-items: center; gap: 4px; flex-wrap: wrap; }
    .swatch { position: relative; display: inline-flex; }
    .swatch .x { position: absolute; top: -7px; right: -7px; width: 18px; height: 18px; line-height: 16px; padding: 0; border-radius: 50%; border: none; background: var(--pu-outline); color: #fff; font-size: 12px; cursor: pointer; }
    .swatches .add { width: 32px; height: 32px; padding: 0; border-radius: 6px; border: 1px dashed var(--pu-outline); background: transparent; color: inherit; font-size: 16px; cursor: pointer; }
    @media (prefers-reduced-motion: reduce) {
      * { transition-duration: 0.01ms !important; animation-duration: 0.01ms !important; }
    }
  `;

  protected firstUpdated(): void {
    try { const raw = localStorage.getItem(DRAFT_KEY); this._pendingDraft = raw ? JSON.parse(raw) : null; } catch { this._pendingDraft = null; }
    this.loadDevices(); this.loadIcons(); this.loadFonts();
  }
  protected updated(): void {
    if (this._ro) return;
    const wrap = this.renderRoot.querySelector(".stagewrap");
    if (!wrap) return;
    this._ro = new ResizeObserver((es) => {
      const w = es[0]?.contentRect.width;
      if (w && w > 8) this.fitPx = Math.max(120, Math.floor(w));
    });
    this._ro.observe(wrap);
  }

  private async loadIcons() {
    try {
      const q: Record<string, unknown> = { type: "pimoroni_unicorn/icons" };
      if (this.entryId) q.entry_id = this.entryId;
      const r = await this.hass.callWS(q);
      this.iconNames = [...(r.builtin ?? []), ...(r.installed ?? [])];
      this.installedIcons = r.installed ?? [];
      this.iconThumbs = r.thumbs ?? {};
      this.iconDims = r.dims ?? {};
      this.deviceIcons = r.device_installed ?? [];
    } catch { /* icons list optional */ }
  }
  // Device install/remove round-trips through MQTT (cmd -> device writes -> manifest republish
  // -> HA). Re-poll a couple of times so the device-installed state catches up.
  private reloadIconsSoon() {
    this.loadIcons();
    window.setTimeout(() => this.loadIcons(), 1500);
    window.setTimeout(() => this.loadIcons(), 4000);
  }
  // An icon is oversize when it's wider or taller than the selected device's screen.
  private iconOversize(name: string): boolean {
    const d = this.iconDims[name];
    return !!d && (d[0] > this.dims[0] || d[1] > this.dims[1]);
  }
  private async pushIconToDevice(name: string, allowOversize = false) {
    if (!this.entryId) return;
    if (this.iconOversize(name) && !allowOversize) {
      const d = this.iconDims[name];
      if (!confirm(`⚠️ TEST MODE — "${name}" is ${d[0]}×${d[1]}, larger than this device (${this.dims[0]}×${this.dims[1]}).\n\nPushing an oversize icon can hang or crash the device until it is power-cycled. Only do this to test. Continue?`)) return;
      allowOversize = true;
    }
    try {
      await this.hass.callWS({ type: "pimoroni_unicorn/icon_push", entry_id: this.entryId, name, allow_oversize: allowOversize });
      this.status = `Installing "${name}" on this device…`;
      this.reloadIconsSoon();
    } catch (e) { this.status = `Install failed: ${(e as { message?: string })?.message ?? e}`; }
  }
  private async removeIconFromDevice(name: string) {
    if (!this.entryId) return;
    try {
      await this.hass.callWS({ type: "pimoroni_unicorn/icon_device_remove", entry_id: this.entryId, name });
      this.status = `Removed "${name}" from this device.`;
      this.reloadIconsSoon();
    } catch (e) { this.status = `Remove failed: ${(e as { message?: string })?.message ?? e}`; }
  }

  // Install targets default to every device; user can narrow the selection.
  private iconTargetIds(): string[] {
    return this.iconTargets.length ? this.iconTargets : this.devices.map((d) => d.entry_id);
  }
  private toggleIconTarget(entryId: string) {
    const ids = new Set(this.iconTargetIds());
    if (ids.has(entryId)) ids.delete(entryId); else ids.add(entryId);
    this.iconTargets = this.devices.map((d) => d.entry_id).filter((id) => ids.has(id));
  }
  private async installIcon() {
    const code = parseInt(this.iconCode, 10);
    const name = this.iconName.trim();
    if (!code || !name) return;
    const entry_ids = this.iconTargetIds();
    const r = await this.hass.callWS({ type: "pimoroni_unicorn/icon_install", code, name, entry_ids });
    if (!r.ok) { this.status = "Couldn't fetch that LaMetric code."; return; }
    const sent: string[] = r.sent ?? [];
    this.status = sent.length
      ? `Installed "${name}" → ${sent.join(", ")}.`
      : `Saved "${name}" (no devices to push to).`;
    this.iconCode = ""; this.iconName = "";
    this.reloadIconsSoon();
  }
  private async removeIcon(name: string) {
    if (!confirm(`Delete "${name}" everywhere? This removes it from the library and every device, and can't be undone.`)) return;
    await this.hass.callWS({ type: "pimoroni_unicorn/icon_remove", name });
    this.status = `Removed icon "${name}".`;
    this.reloadIconsSoon();
  }

  // Read a chosen image/GIF into base64; suggest a name from the filename.
  private onIconFile(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const url = String(reader.result ?? "");
      this.iconFilePreview = url;
      this.iconFileData = url.includes(",") ? url.slice(url.indexOf(",") + 1) : "";
      this.iconUrl = "";  // a chosen file takes precedence over a URL
      if (!this.iconImgName.trim()) {
        this.iconImgName = file.name.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 32);
      }
    };
    reader.readAsDataURL(file);
  }

  private async importIconImage() {
    const name = this.iconImgName.trim();
    const hasFile = !!this.iconFileData;
    const url = this.iconUrl.trim();
    if (!name || (!hasFile && !url)) return;
    const entry_ids = this.iconTargetIds();
    const fit = this.iconSizeMode === "device" ? { max_w: this.dims[0], max_h: this.dims[1] }
      : this.iconSizeMode === "custom"
        ? { max_w: Math.max(1, this.iconCustomW | 0), max_h: Math.max(1, this.iconCustomH | 0) }
        : {};  // native: no cap beyond the device-memory maximum
    try {
      const r = (hasFile
        ? await this.hass.callWS({ type: "pimoroni_unicorn/icon_upload", name, data: this.iconFileData, ...fit, entry_ids })
        : await this.hass.callWS({ type: "pimoroni_unicorn/icon_url", name, url, ...fit, entry_ids })
      ) as { ok?: boolean; sent?: string[]; w?: number; h?: number; n_kept?: number; n_total?: number };
      const sent = r.sent ?? [];
      const size = r.w && r.h ? ` ${r.w}×${r.h}` : "";
      const trimmed = r.n_total && r.n_kept && r.n_kept < r.n_total
        ? ` (kept ${r.n_kept} of ${r.n_total} frames to fit the device)`
        : (r.n_kept && r.n_kept > 1 ? ` (${r.n_kept} frames)` : "");
      this.iconImportNote = `Imported "${name}"${size}${trimmed}.`;
      this.status = sent.length
        ? `Imported "${name}"${size} → ${sent.join(", ")}.`
        : `Saved "${name}"${size} (no devices to push to).`;
      this.iconImgName = ""; this.iconUrl = ""; this.iconFileData = ""; this.iconFilePreview = "";
      this.reloadIconsSoon();
    } catch (e) {
      this.status = `Import failed: ${(e as { message?: string })?.message ?? e}`;
    }
  }

  private async loadFonts() {
    try {
      const q: Record<string, unknown> = { type: "pimoroni_unicorn/fonts" };
      if (this.entryId) q.entry_id = this.entryId;
      const r = await this.hass.callWS(q);
      this.fonts = r.fonts ?? [];
      this.refreshFontPreviews();
    } catch { /* font catalog optional */ }
  }
  private onFontInput(text: string) {
    this.fontText = text;
    clearTimeout(this.fontTimer);
    this.fontTimer = window.setTimeout(() => this.refreshFontPreviews(), 250);
  }
  private async refreshFontPreviews() {
    const out: Record<string, string> = {};
    await Promise.all(this.fonts.map(async (f) => {
      const text = this.fontText.trim() || f.sample;
      try {
        const r = await this.hass.callWS({ type: "pimoroni_unicorn/font_preview", font: f.name, text });
        out[f.name] = r.png;
      } catch { /* skip unrenderable */ }
    }));
    this.fontPngs = out;
  }

  connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener("keydown", this._onKey);
    window.addEventListener("beforeunload", this._onBeforeUnload);
  }
  disconnectedCallback(): void {
    window.removeEventListener("keydown", this._onKey);
    window.removeEventListener("beforeunload", this._onBeforeUnload);
    this._ro?.disconnect();
    this._ro = undefined;
    Object.values(this._frameTimers).forEach((t) => clearInterval(t));
    this._frameTimers = {};
    clearInterval(this.screenTimer);
    clearTimeout(this.renderTimer);
    clearTimeout(this.pushTimer);
    clearTimeout(this.fontTimer);
    clearTimeout(this.specTimer);
    super.disconnectedCallback();
  }

  private _onKey = (e: KeyboardEvent): void => {
    // composedPath()[0] pierces the shadow DOM; e.target is retargeted to the host on window.
    const t = e.composedPath()[0] as HTMLElement | undefined;
    const tag = t?.tagName;
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") { e.preventDefault(); this.save(); return; }
    if (tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA" || t?.isContentEditable) return;
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z" && this.tab === "layout") {
      e.preventDefault();
      if (e.shiftKey) this.redo(); else this.undo();
      return;
    }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y" && this.tab === "layout") {
      e.preventDefault();
      this.redo();
      return;
    }
    if ((e.key === "Delete" || e.key === "Backspace") && this.tab === "layout"
        && this.selected >= 0 && this.layout.widgets[this.selected]) {
      e.preventDefault();
      this.removeWidget(this.selected);
      return;
    }
    const d: Record<string, [number, number]> = {
      ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0],
    };
    const delta = d[e.key];
    if (!delta || this.tab !== "layout") return;
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
    this.orientation = caps.orientation ?? 0;
    this.dims = (caps.dims as Size) ?? MODELS[this.model] ?? [53, 11];
    this.loadWidgetThumbs();
    await this.refreshStored();
  }

  private async loadWidgetThumbs(): Promise<void> {
    try {
      const r = await this.hass.callWS({ type: "pimoroni_unicorn/widget_thumbs", model: this.model });
      this.widgetThumbs = (r as { thumbs?: Record<string, string> }).thumbs ?? {};
    } catch { /* thumbnails are optional polish */ }
  }

  private async selectDevice(entryId: string): Promise<void> {
    const dev = this.devices.find((d) => d.entry_id === entryId);
    if (!dev || !this.guardDiscard()) { this.requestUpdate(); return; }
    this.entryId = entryId;
    await this.loadCaps({ entry_id: entryId });
    this.loadIcons();
    this.loadFonts();  // refresh per-device font install state
    this.loadCatalog();  // refresh available pages/screens + engine version for this device
    const active = dev.active_layout ? this.stored[dev.active_layout] : undefined;
    this.loadLayout(active ?? this.defaultLayout);
    this._applyPendingDraft();
  }

  private async selectMock(model: string): Promise<void> {
    if (!this.guardDiscard()) { this.requestUpdate(); return; }
    this.entryId = "";
    await this.loadCaps({ model });
    this.loadIcons();
    this.loadCatalog();  // clears device catalog; refreshes shareable content list
    this.loadLayout(this.defaultLayout);
    this._applyPendingDraft();
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
    this.undoStack = [];
    this.redoStack = [];
    this.snapshot = JSON.parse(JSON.stringify(this.layout));
    this.renderPreview();
  }

  // True if it's safe to discard the current page (not dirty, or user confirms).
  private guardDiscard(): boolean {
    return !this.dirty || confirm("Discard unsaved changes to this page?");
  }

  // Cycle base64 PNG frames into a setter so animated content (icons, weather) plays.
  private playFrames(key: string, frames: string[], set: (f: string) => void): void {
    window.clearInterval(this._frameTimers[key]);
    set(frames[0] ?? "");
    if (frames.length > 1) {
      let i = 0;
      this._frameTimers[key] = window.setInterval(() => { i = (i + 1) % frames.length; set(frames[i]); }, 200);
    }
  }

  private async renderPreview(): Promise<void> {
    try {
      const res = await this.hass.callWS({ type: "pimoroni_unicorn/render", model: this.model, layout: this.layout, orientation: this.orientation, weather: this.previewWeather || undefined, entry_id: this.entryId || undefined });
      this.wboxes = res.boxes ?? [];
      this.playFrames("layout", res.frames ?? (res.png ? [res.png] : []), (f) => { this.png = f; });
      if (this.status.startsWith("Render failed")) this.status = "";
    } catch (err: any) {
      this.png = "";
      this.status = `Render failed: ${err?.message ?? err}`;
    }
  }

  private edited(): void {
    this.undoStack = [...this.undoStack.slice(-99), this.snapshot];
    this.redoStack = [];
    this.snapshot = JSON.parse(JSON.stringify(this.layout));
    this.dirty = true;
    this._persistDraft();
    this.requestUpdate();
    this.scheduleRender();
  }

  private scheduleRender(): void {
    if (this.renderTimer) clearTimeout(this.renderTimer);
    this.renderTimer = window.setTimeout(() => this.renderPreview(), 80);
    if (this.live && this.entryId) {
      if (this.pushTimer) clearTimeout(this.pushTimer);
      this.pushTimer = window.setTimeout(() => this.pushLive(), 250);
    }
  }

  private undo(): void {
    if (!this.undoStack.length) return;
    this.redoStack = [...this.redoStack, this.snapshot];
    const prev = this.undoStack[this.undoStack.length - 1];
    this.undoStack = this.undoStack.slice(0, -1);
    this.applyHistory(prev);
  }

  private redo(): void {
    if (!this.redoStack.length) return;
    this.undoStack = [...this.undoStack, this.snapshot];
    const next = this.redoStack[this.redoStack.length - 1];
    this.redoStack = this.redoStack.slice(0, -1);
    this.applyHistory(next);
  }

  private applyHistory(target: Layout): void {
    this.layout = JSON.parse(JSON.stringify(target));
    this.snapshot = JSON.parse(JSON.stringify(target));
    if (this.selected >= this.layout.widgets.length) this.selected = this.layout.widgets.length - 1;
    this.layoutName = this.layout.name ?? this.layoutName;
    this.dirty = true;
    this.requestUpdate();
    this.scheduleRender();
  }

  private async pushLive(): Promise<void> {
    const layout = { ...this.layout, name: this.layoutName };
    await this.hass.callWS({ type: "pimoroni_unicorn/push_layout", entry_id: this.entryId, layout });
  }

  private capFor(id: string): WidgetCap | undefined { return this.caps.find((c) => c.id === id); }
  private typeOf(entry: WidgetEntry): string { return entry.type ?? entry.id; }
  private capForEntry(entry: WidgetEntry): WidgetCap | undefined { return this.capFor(this.typeOf(entry)); }
  @state() private fitPx = PREVIEW_TARGET_PX;  // measured preview-container width (auto-fit)
  private _ro?: ResizeObserver;
  // Auto-fit: scale the preview to fill its container; an explicit zoom overrides.
  private get scale(): number { return this.zoom || Math.max(4, Math.floor(this.fitPx / this.dims[0])); }
  // Snap so scale*devicePixelRatio is whole: each source pixel maps to an integer number of
  // device pixels, so lines stay straight on fractional-DPR (e.g. Windows 125%) displays.
  private get pxScale(): number { const dpr = window.devicePixelRatio || 1; return Math.max(1, Math.round(this.scale * dpr)) / dpr; }
  private zoomBy(delta: number): void {
    this.zoom = Math.min(48, Math.max(4, this.scale + delta));
  }
  private onWheel(e: WheelEvent): void {
    if (!e.ctrlKey && !e.metaKey) return;  // plain wheel/trackpad pans natively; ctrl/⌘+wheel zooms
    e.preventDefault();
    this.zoomBy(e.deltaY < 0 ? 2 : -2);
  }
  private startPan(e: PointerEvent): void {
    if ((e.target as HTMLElement).closest(".box")) return;  // dragging a widget moves it, not pans
    const wrap = e.currentTarget as HTMLElement;
    e.preventDefault();
    const sx = e.clientX, sy = e.clientY, sl = wrap.scrollLeft, st = wrap.scrollTop;
    wrap.setPointerCapture(e.pointerId);
    wrap.classList.add("panning");
    const move = (ev: PointerEvent) => {
      wrap.scrollLeft = sl - (ev.clientX - sx);
      wrap.scrollTop = st - (ev.clientY - sy);
    };
    const up = (ev: PointerEvent) => {
      wrap.releasePointerCapture(ev.pointerId);
      wrap.classList.remove("panning");
      wrap.removeEventListener("pointermove", move);
      wrap.removeEventListener("pointerup", up);
    };
    wrap.addEventListener("pointermove", move);
    wrap.addEventListener("pointerup", up);
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
  private colorCtl(rgb: Rgb, on: (v: Rgb) => void) {
    return html`<span class="colorctl">
      <input type="color" .value=${hex(rgb)}
        @input=${(e: Event) => on(unhex((e.target as HTMLInputElement).value))} />
      <input type="text" class="hexin" .value=${hex(rgb)} maxlength="7" spellcheck="false" aria-label="Hex colour"
        @change=${(e: Event) => on(unhex((e.target as HTMLInputElement).value))} />
    </span>`;
  }
  private setCfg(entry: WidgetEntry, key: string, value: unknown): void {
    entry.cfg = { ...(entry.cfg ?? {}), [key]: value };
    this.edited();
  }
  private cfgPalette(entry: WidgetEntry, key: string): Rgb[] {
    const p = this.cfgVal(entry, key) as Rgb[] | undefined;
    if (p && p.length) return p.map((c) => [...c] as Rgb);
    return [((this.cfgVal(entry, "color") as Rgb) ?? [255, 255, 255])];
  }
  private setCfgColor(entry: WidgetEntry, key: string, i: number, rgb: Rgb): void {
    const p = this.cfgPalette(entry, key); p[i] = rgb; this.setCfg(entry, key, p);
  }
  private addCfgColor(entry: WidgetEntry, key: string): void {
    const p = this.cfgPalette(entry, key); p.push([255, 255, 255]); this.setCfg(entry, key, p);
  }
  private removeCfgColor(entry: WidgetEntry, key: string, i: number): void {
    const p = this.cfgPalette(entry, key);
    if (p.length > 1) { p.splice(i, 1); this.setCfg(entry, key, p); }
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
      const dx = Math.round((e.clientX - sx) / this.pxScale / grid) * grid;
      const dy = Math.round((e.clientY - sy) / this.pxScale / grid) * grid;
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
    const w = this.layout.widgets[idx];
    if (!w) return;
    this.layout.widgets.splice(idx, 1);
    this.selected = -1;
    this.edited();
  }
  private duplicateWidget(idx: number): void {
    const src = this.layout.widgets[idx];
    if (!src) return;
    const present = new Set(this.layout.widgets.map((w) => w.id));
    const base = src.type ?? src.id;
    let n = 2, id = `${base}-${n}`;
    while (present.has(id)) id = `${base}-${++n}`;
    const copy: WidgetEntry = JSON.parse(JSON.stringify(src));
    copy.id = id;
    copy.x = (src.x ?? 0) + 1;
    copy.y = (src.y ?? 0) + 1;
    this.layout.widgets.splice(idx + 1, 0, copy);
    this.selected = idx + 1;
    this.edited();
  }
  // Array order is z-order: later entries draw on top. Drag a layer onto another to reorder.
  private dropWidget(target: number): void {
    const from = this.dragIdx;
    this.dragIdx = -1;
    if (from < 0 || from === target) return;
    const ws = this.layout.widgets;
    const [item] = ws.splice(from, 1);
    ws.splice(target, 0, item);
    this.selected = ws.indexOf(item);
    this.edited();
  }
  private moveLayer(i: number, dir: -1 | 1): void {
    const j = i + dir;
    const ws = this.layout.widgets;
    if (j < 0 || j >= ws.length) return;
    [ws[i], ws[j]] = [ws[j], ws[i]];
    this.selected = j;
    this.edited();
  }
  private toggleOverlay(id: string, on: boolean): void {
    const set = new Set(this.layout.overlays ?? []);
    if (on) set.add(id); else set.delete(id);
    this.layout.overlays = [...set];
    this.edited();
  }

  private async save(): Promise<void> {
    if (!this.layoutName.trim()) { this.status = "Name the page before saving."; return; }
    this.layout.name = this.layoutName;
    await this.hass.callWS({ type: "pimoroni_unicorn/save_layout", name: this.layoutName, layout: this.layout });
    await this.refreshStored();
    this.dirty = false;
    this._clearDraft();
    this.status = `Saved "${this.layoutName}" to the library.`;
  }
  private newPage(): void {
    if (!this.guardDiscard()) return;
    this.loadLayout(this.defaultLayout);
    this.layoutName = "";
    this.switchTab("layout");
  }
  private async editCurrentPage(): Promise<void> {
    if (!this.entryId || !this.guardDiscard()) return;
    const res = await this.hass.callWS({ type: "pimoroni_unicorn/devices" });
    const dev = (res.devices ?? []).find((d: Device) => d.entry_id === this.entryId);
    await this.refreshStored();
    const active = dev?.active_layout ? this.stored[dev.active_layout] : undefined;
    if (!active) { this.status = "This device has no active page saved in the library yet."; return; }
    this.layoutName = dev.active_layout!;
    this.loadLayout(active);
    this.switchTab("layout");
    this.status = `Loaded the device's current page "${dev.active_layout}".`;
  }
  private async deployCurrent(): Promise<void> {
    if (!this.entryId) return;
    if (!this.layoutName.trim()) { this.status = "Name the page before deploying."; return; }
    this.layout.name = this.layoutName;
    this.status = `Deploying "${this.layoutName}"…`;
    try {
      await this.hass.callWS({ type: "pimoroni_unicorn/save_layout", name: this.layoutName, layout: this.layout });
      await this.refreshStored();
      const r = await this.hass.callWS({ type: "pimoroni_unicorn/deploy_layout", entry_id: this.entryId, name: this.layoutName, override: true });
      this.status = r.ok ? `Deployed "${this.layoutName}" (installed any missing widgets/fonts first).` : "Deploy failed.";
      this.dirty = false;
      this._clearDraft();
    } catch (e) { this.status = `Deploy failed: ${(e as { message?: string })?.message ?? e}`; }
  }
  private async deleteLayout(): Promise<void> {
    if (!this.stored[this.layoutName]) return;
    if (!confirm(`Delete page "${this.layoutName}"? This can't be undone.`)) return;
    await this.hass.callWS({ type: "pimoroni_unicorn/delete_layout", name: this.layoutName });
    await this.refreshStored();
    this.status = `Deleted "${this.layoutName}".`;
    this.loadLayout(this.defaultLayout);
  }
  // Delete a page straight from the marketplace Pages list (no need to load it first).
  private async deletePage(id: string, label: string): Promise<void> {
    if (!confirm(`Delete page "${label}"? This can't be undone.`)) return;
    await this.hass.callWS({ type: "pimoroni_unicorn/delete_layout", name: id });
    await this.refreshStored();
    await this.loadCatalog();
    this.status = `Deleted page "${label}".`;
  }
  // Delete a playlist (screenset) from the marketplace Playlists list.
  private async deletePlaylist(id: string, label: string): Promise<void> {
    if (!confirm(`Delete playlist "${label}"? This can't be undone.`)) return;
    await this.hass.callWS({ type: "pimoroni_unicorn/delete_screenset", name: id });
    await this.loadCatalog();
    this.status = `Deleted playlist "${label}".`;
  }

  private renderWidgetEditor() {
    const entry = this.layout.widgets[this.selected];
    if (!entry) return html`<p class="hint">Select a widget to edit.</p>`;
    const cap = this.capForEntry(entry);
    if (!cap) return "";
    return html`
      <h3>${entry.name ?? cap.label}</h3>
      ${cap.id === "weather" ? html`<div class="panelrow"><label>Preview condition</label>
        <select @change=${(e: Event) => { this.previewWeather = (e.target as HTMLSelectElement).value; this.renderPreview(); }}>
          <option value="" ?selected=${this.previewWeather === ""}>live</option>
          ${WEATHER_TEST.map(([v, l]) => html`<option value=${v} ?selected=${this.previewWeather === v}>${l}</option>`)}
        </select></div>` : ""}
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
        const mode = this.cfgVal(entry, "color_mode");
        if (f.key === "speed" && mode !== "rainbow") return "";
        if (f.type === "rgblist" && mode !== "per_char") return "";
        const offMode = this.cfgVal(entry, "off_mode");
        if (f.key === "off_brightness" && offMode === "colour") return "";
        if (f.key === "off_color" && offMode !== "colour") return "";
        if (f.type === "rgblist") {
          const palette = this.cfgPalette(entry, f.key);
          return html`<div class="panelrow"><label>${f.label ?? f.key}</label>
            <span class="swatches">
              ${palette.map((c, i) => html`<span class="swatch">
                <input type="color" .value=${hex(c)}
                  @input=${(e: Event) => this.setCfgColor(entry, f.key, i, unhex((e.target as HTMLInputElement).value))} />
                ${palette.length > 1 ? html`<button class="x" title="Remove"
                  @click=${() => this.removeCfgColor(entry, f.key, i)}>×</button>` : ""}
              </span>`)}
              <button class="add" title="Add colour" @click=${() => this.addCfgColor(entry, f.key)}>+</button>
            </span></div>`;
        }
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
              @input=${(e: Event) => { const v = (e.target as HTMLInputElement).value; if (v !== "" && !Number.isNaN(+v)) this.setCfg(entry, f.key, +v); }} /></div>`;
        }
        if (f.type === "bool") {
          return html`<div class="panelrow"><label>${f.label ?? f.key}</label>
            <input type="checkbox" .checked=${!!this.cfgVal(entry, f.key)}
              @change=${(e: Event) => this.setCfg(entry, f.key, (e.target as HTMLInputElement).checked)} /></div>`;
        }
        if (f.type === "range") {
          const rv = Number(this.cfgVal(entry, f.key) ?? f.max ?? 100);
          return html`<div class="panelrow"><label>${f.label ?? f.key}</label>
            <input type="range" min=${f.min ?? 0} max=${f.max ?? 100} step=${f.step ?? 1} .value=${String(rv)}
              @input=${(e: Event) => this.setCfg(entry, f.key, +(e.target as HTMLInputElement).value)} />
            <span class="rangeval">${rv}</span></div>`;
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
          ${this.colorCtl((this.cfgVal(entry, f.key) as Rgb) ?? [255, 255, 255], (v) => this.setCfg(entry, f.key, v))}</div>`;
      })}
      <div class="panelrow"><button class="danger" @click=${() => this.removeWidget(this.selected)}>Remove widget</button></div>
    `;
  }

  private switchTab(tab: "layout" | "market" | "edit" | "screens" | "paint"): void {
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
        <a class="help" href="https://github.com/PineappleEmperor/ha-pimoroni-unicorn#readme" target="_blank" rel="noopener noreferrer" title="Open the documentation in a new tab">Help</a>
      </div>`;
  }

  render() {
    return html`
      ${this._appBar()}
      <div class="tabs">
        <button class="tab ${this.tab === "layout" ? "on" : ""}" @click=${() => this.switchTab("layout")}>Designer</button>
        <button class="tab ${this.tab === "market" ? "on" : ""}" @click=${() => this.switchTab("market")}>Marketplace</button>
        <button class="tab ${this.tab === "edit" ? "on" : ""}" @click=${() => this.switchTab("edit")}>Widget editor</button>
        <button class="tab ${this.tab === "paint" ? "on" : ""}" @click=${() => this.switchTab("paint")}>Icon editor</button>
        <button class="tab ${this.tab === "screens" ? "on" : ""}" @click=${() => this.switchTab("screens")}>Playlists</button>
      </div>
      ${this.status ? html`<div class="status ${/fail/i.test(this.status) ? "err" : ""}" role="status" aria-live="polite">${this.status}</div>` : ""}
      ${!this.devices.length ? html`<div class="firstrun">No Pimoroni Unicorn device connected yet — you're previewing on a mock ${this.model}. Add one under <strong>Settings → Devices &amp; Services</strong>, then pick it above to install content and push live.</div>` : ""}
      ${this.tab === "market" ? this._marketplaceView()
        : this.tab === "edit" ? this._editorView()
        : this.tab === "paint" ? this._paintView()
        : this.tab === "screens" ? this._screensView()
        : this._layoutView()}
    `;
  }

  private _layoutView() {
    const s = this.pxScale;
    const presentTypes = new Set(this.layout.widgets.map((w) => this.typeOf(w)));
    const addable = this.caps.filter((c) => c.multi || !presentTypes.has(c.id));
    const overlays = new Set(this.layout.overlays ?? []);
    const gridStyle = `background-image:linear-gradient(to right,rgba(255,255,255,.10) 1px,transparent 1px),linear-gradient(to bottom,rgba(255,255,255,.10) 1px,transparent 1px);background-size:${s}px ${s}px`;
    return html`
      <div class="bar">
        <div class="group">
          <label>Page
            <select @change=${(e: Event) => { const v = (e.target as HTMLSelectElement).value; if (v === "__new__") this.newPage(); else if (this.guardDiscard()) this.loadLayout(this.stored[v]); else this.requestUpdate(); }}>
              ${Object.keys(this.stored).map((n) => html`<option ?selected=${n === this.layoutName}>${n}</option>`)}
              <option value="__new__">+ new page</option>
            </select>
          </label>
          <label>Name <input .value=${this.layoutName} @input=${(e: Event) => (this.layoutName = (e.target as HTMLInputElement).value)} /></label>
        </div>
        <div class="group">
          <button class="secondary" @click=${this.undo} ?disabled=${!this.undoStack.length} title="Undo (Ctrl+Z)">↶ Undo</button>
          <button class="secondary" @click=${this.redo} ?disabled=${!this.redoStack.length} title="Redo (Ctrl+Shift+Z)">↷ Redo</button>
        </div>
        <div class="group" role="group" aria-label="Library actions">
          <span class="grouplabel">Library</span>
          <button @click=${this.save} title="Save this page to the library (no device needed)">Save</button>
          <button class="secondary" @click=${this.exportLayout} title="Copy this page's JSON to clipboard to share or import elsewhere">Export JSON</button>
          ${this.stored[this.layoutName] ? html`<button class="secondary" @click=${() => this.publishLayout(true)} title="List this page in the marketplace">Publish</button>` : ""}
          ${this.stored[this.layoutName] ? html`<button class="danger" @click=${this.deleteLayout}>Delete</button>` : ""}
        </div>
        <div class="group" role="group" aria-label="Device actions">
          <span class="grouplabel">Device</span>
          <button class="secondary" @click=${this.editCurrentPage} ?disabled=${!this.entryId} title=${this.entryId ? "Load the page currently active on the device to edit it" : "Select a device first"}>Edit current</button>
          <button @click=${this.deployCurrent} ?disabled=${!this.entryId} title=${this.entryId ? "Save, install any missing widgets/fonts, then push to the selected device" : "Select a device to deploy"}>Deploy</button>
        </div>
        <span class="grow"></span>
        <div class="group">
          <label>Snap
            <select @change=${(e: Event) => { this.layout.grid = +(e.target as HTMLSelectElement).value; this.edited(); }}>
              ${[1, 2, 4].map((n) => html`<option ?selected=${(this.layout.grid ?? 2) === n}>${n}</option>`)}
            </select> px</label>
          <label>Zoom
            <button class="zbtn" @click=${() => this.zoomBy(-2)} title="Zoom out" aria-label="Zoom out">&minus;</button>
            <input type="range" min="4" max="48" .value=${String(this.scale)}
              @input=${(e: Event) => (this.zoom = +(e.target as HTMLInputElement).value)} />
            <button class="zbtn" @click=${() => this.zoomBy(2)} title="Zoom in" aria-label="Zoom in">+</button>
          </label>
          <label>Weather
            <select @change=${(e: Event) => { this.previewWeather = (e.target as HTMLSelectElement).value; this.renderPreview(); }}>
              <option value="" ?selected=${this.previewWeather === ""}>live</option>
              ${WEATHER_TEST.map(([v, l]) => html`<option value=${v} ?selected=${this.previewWeather === v}>${l}</option>`)}
            </select></label>
          <label><input type="checkbox" .checked=${this.wireframe} @change=${(e: Event) => (this.wireframe = (e.target as HTMLInputElement).checked)} /> wireframe</label>
          <label><input type="checkbox" .checked=${this.locked} @change=${(e: Event) => (this.locked = (e.target as HTMLInputElement).checked)} /> lock</label>
          <label><input type="checkbox" .checked=${this.live} ?disabled=${!this.entryId} @change=${(e: Event) => (this.live = (e.target as HTMLInputElement).checked)} /> live push</label>
        </div>
      </div>

      <div class="wrap">
        <div class="col">
          <div class="stagewrap" @wheel=${this.onWheel} @pointerdown=${this.startPan}>
            <div class="stage" style=${`width:${this.dims[0] * s}px;height:${this.dims[1] * s}px`}>
              ${this.png ? html`<img src="data:image/png;base64,${this.png}" alt="Live layout preview" width=${this.dims[0] * s} height=${this.dims[1] * s} @load=${this.onImgLoad} />` : ""}
              <div class="grid" style=${gridStyle}></div>
              ${this.locked ? "" : html`<div class="boxes ${this.wireframe ? "wf" : ""}">${this.layout.widgets.map((w, i) => {
                if (!this.capForEntry(w) || w.enabled === false) return "";
                const [bw, bh] = this.boxDims(i);
                return html`<div class="box ${i === this.selected ? "sel" : ""}"
                  style=${`left:${w.x * s}px;top:${w.y * s}px;width:${bw * s}px;height:${bh * s}px`}
                  @pointerdown=${(e: PointerEvent) => this.startDrag(i, e)}>
                  <span class="tag">${w.name ?? this.capForEntry(w)?.label ?? w.id}</span></div>`;
              })}</div>`}
            </div>
          </div>
        </div>

        <div class="col">
          <h3>Layers</h3>
          <ul class="wlist">
            ${[...this.layout.widgets.keys()].reverse().map((i) => {
              const w = this.layout.widgets[i];
              return html`
              <li class="${i === this.selected ? "sel" : ""} ${i === this.dragIdx ? "dragging" : ""} ${i === this.dragOverIdx && i !== this.dragIdx ? "dragover" : ""}"
                  tabindex="0" role="option" aria-selected=${i === this.selected}
                  @click=${() => (this.selected = i)}
                  @keydown=${(e: KeyboardEvent) => {
                    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); e.stopPropagation(); this.selected = i; }
                    else if (e.altKey && e.key === "ArrowUp") { e.preventDefault(); e.stopPropagation(); this.moveLayer(i, 1); }
                    else if (e.altKey && e.key === "ArrowDown") { e.preventDefault(); e.stopPropagation(); this.moveLayer(i, -1); }
                  }}
                  @dragover=${(e: DragEvent) => { e.preventDefault(); if (e.dataTransfer) e.dataTransfer.dropEffect = "move"; this.dragOverIdx = i; }}
                  @dragleave=${() => { if (this.dragOverIdx === i) this.dragOverIdx = -1; }}
                  @drop=${(e: DragEvent) => { e.preventDefault(); this.dropWidget(i); this.dragOverIdx = -1; }}>
                <span class="drag" title="Drag to reorder (or focus the row and use Alt+↑/↓)" aria-hidden="true" draggable="true"
                  @dragstart=${(e: DragEvent) => {
                    this.dragIdx = i;
                    if (e.dataTransfer) {
                      e.dataTransfer.effectAllowed = "move";
                      e.dataTransfer.setData("text/plain", String(i));  // required for Firefox to start a drag
                      const li = (e.target as HTMLElement).closest("li");
                      if (li) e.dataTransfer.setDragImage(li, 0, 0);
                    }
                  }}
                  @dragend=${() => { this.dragIdx = -1; this.dragOverIdx = -1; }}>⣿</span>
                <input type="checkbox" .checked=${w.enabled !== false} title="Show / hide"
                  aria-label="Show or hide ${w.name ?? this.capForEntry(w)?.label ?? w.id}"
                  @click=${(e: Event) => { e.stopPropagation(); w.enabled = (e.target as HTMLInputElement).checked; this.edited(); }} />
                <span class="grow">${w.name ?? this.capForEntry(w)?.label ?? w.id}</span>
                <button class="wlx" title="Duplicate layer" aria-label="Duplicate layer"
                  @click=${(e: Event) => { e.stopPropagation(); this.duplicateWidget(i); }}>⧉</button>
                <button class="wlx" title="Delete layer" aria-label="Delete layer"
                  @click=${(e: Event) => { e.stopPropagation(); this.removeWidget(i); }}>×</button>
              </li>`;
            })}
          </ul>
          ${this.layout.widgets.length > 1 ? html`<p class="hint">Top of the list draws on top.</p>` : ""}
          ${addable.length ? html`<div class="addgrid">
            ${addable.map((c) => html`<button class="addtile" @click=${() => this.addWidget(c.id)} title="Add ${c.label}">
              ${this.widgetThumbs[c.id]
                ? html`<img class="addthumb" src="data:image/png;base64,${this.widgetThumbs[c.id]}" alt="" />`
                : html`<div class="addthumb empty"></div>`}
              <span class="addtile-label">${c.label}</span>
            </button>`)}
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
    this._reconcileBusy();
  }
  private _reconcileBusy(): void {
    if (!Object.keys(this.busyUnits).length) return;
    const next = { ...this.busyUnits };
    let changed = false;
    for (const [id, action] of Object.entries(this.busyUnits)) {
      const w = this.catalog.find((x) => x.id === id);
      const done = action === "Installing" ? w?.status === "installed" : !w || w.status === "not_installed";
      if (done) { delete next[id]; changed = true; }
    }
    if (changed) this.busyUnits = next;
  }
  private _setBusy(id: string, action: string | null): void {
    const next = { ...this.busyUnits };
    if (action) next[id] = action; else delete next[id];
    this.busyUnits = next;
  }

  private async loadContent() {
    const q = this.entryId ? { entry_id: this.entryId } : {};
    const c = await this.hass.callWS({ type: "pimoroni_unicorn/content_catalog", ...q });
    this.activePage = c.active_page ?? null;
    this.contentLayouts = c.layouts ?? [];
    this.contentScreensets = c.screensets ?? [];
  }

  private async deployLayout(name: string, compatible: boolean) {
    if (!this.entryId) { this.status = "Select a device to deploy."; return; }
    if (!compatible && !confirm(`"${name}" isn't built for this device's model. Deploy anyway?`)) return;
    this.status = `Deploying "${name}"…`;
    try {
      const r = await this.hass.callWS({
        type: "pimoroni_unicorn/deploy_layout", entry_id: this.entryId, name, override: !compatible });
      this.status = r.ok ? `Deployed "${name}" (installing any missing widgets/fonts first).` : `Deploy failed.`;
    } catch (e) {
      this.status = `Deploy failed: ${(e as { message?: string })?.message ?? e}`;
    }
  }

  private async deployScreenset(id: string, compatible: boolean) {
    if (!this.entryId) { this.status = "Select a device to deploy."; return; }
    if (!compatible && !confirm(`"${id}" isn't built for this device's model. Deploy anyway?`)) return;
    this.status = `Deploying "${id}"…`;
    try {
      const r = await this.hass.callWS({
        type: "pimoroni_unicorn/deploy_screenset", entry_id: this.entryId, name: id, override: !compatible });
      this.status = r.ok ? `Deployed screen set "${id}".` : `Deploy failed.`;
    } catch (e) {
      this.status = `Deploy failed: ${(e as { message?: string })?.message ?? e}`;
    }
  }

  private async exportLayout(): Promise<void> {
    const out = { ...this.layout, name: this.layoutName, model: this.model };
    const json = JSON.stringify(out, null, 2);
    try {
      await navigator.clipboard.writeText(json);
      this.status = `Copied "${this.layoutName}" JSON (${this.model}) to clipboard.`;
    } catch {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([json], { type: "application/json" }));
      a.download = `${this.layoutName || "layout"}.json`;
      a.click();
      URL.revokeObjectURL(a.href);
      this.status = `Downloaded "${this.layoutName}.json".`;
    }
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
      type: "pimoroni_unicorn/save_screenset", name: id,
      screenset: { label: id, layouts: this.screenLayouts, dwell: this.screenDwell,
                   transition: this.screenTransition, triggers: [] } });
    this.status = `Saved screen set "${id}".`;
    this.loadContent();
  }

  // Widget install/remove OTA-reboots the device (~10-20s); re-poll across the reboot
  // window so the catalog reflects the new manifest once it republishes on reconnect.
  private reloadCatalogSoon() {
    for (const ms of [8000, 15000, 25000]) setTimeout(() => this.loadCatalog(), ms);
  }
  private async installFont(name: string) {
    if (!this.entryId) return;
    try {
      await this.hass.callWS({ type: "pimoroni_unicorn/font_install", entry_id: this.entryId, font: name });
      this.status = `Installing font ${name}…`;
      for (const ms of [2000, 5000]) setTimeout(() => this.loadFonts(), ms);  // hot-loads, no reboot
    } catch (e) { this.status = `Font install failed: ${(e as { message?: string })?.message ?? e}`; }
  }
  private async installWidget(id: string) {
    if (!confirm(`Install "${id}" on the device? It will reboot (~20s) and briefly go dark.`)) return;
    this._setBusy(id, "Installing");
    try {
      await this.hass.callWS({ type: "pimoroni_unicorn/fw_install", entry_id: this.entryId, widget_id: id });
      this.status = `Installing ${id}… the device will reboot and reconnect.`;
      this.reloadCatalogSoon();
      this._busyTimeout(id);
    } catch (e) { this._setBusy(id, null); this.status = `Install failed: ${(e as { message?: string })?.message ?? e}`; }
  }

  private async removeWidgetUnit(id: string) {
    if (!confirm(`Remove "${id}" from the device? It will reboot (~20s) and briefly go dark.`)) return;
    this._setBusy(id, "Removing");
    try {
      await this.hass.callWS({ type: "pimoroni_unicorn/fw_remove", entry_id: this.entryId, widget_id: id });
      this.status = `Removing ${id}… the device will reboot and reconnect.`;
      this.reloadCatalogSoon();
      this._busyTimeout(id);
    } catch (e) { this._setBusy(id, null); this.status = `Remove failed: ${(e as { message?: string })?.message ?? e}`; }
  }
  private _busyTimeout(id: string): void {
    window.setTimeout(() => {
      if (this.busyUnits[id]) { this._setBusy(id, null); this.status = `"${id}" didn't confirm — check the device is powered and back on Wi-Fi, then Refresh.`; }
    }, 30000);
  }

  private _thumb(src?: string) {
    return src
      ? html`<img class="thumb" alt="" src="data:image/png;base64,${src}" />`
      : html`<div class="thumb empty"></div>`;
  }
  private _mhead() {
    return html`<div class="mhead"><span>Preview</span><span>Name</span><span>Dependencies</span><span>Status</span><span></span></div>`;
  }
  private _section(key: string, title: string, count: number, body: unknown) {
    const open = this.sectionsOpen[key] !== false;
    const toggle = () => { this.sectionsOpen = { ...this.sectionsOpen, [key]: !open }; };
    return html`<div class="section">
      <div class="shead" role="button" tabindex="0" aria-expanded=${open}
        @click=${toggle}
        @keydown=${(e: KeyboardEvent) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); } }}>
        <svg class="chev ${open ? "open" : ""}" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" /></svg>
        <span class="stitle">${title}</span>
        <span class="chip dim">${count}</span>
      </div>
      ${open ? body : ""}
    </div>`;
  }
  private _contentRow(u: ContentUnit, kind: "layout" | "screenset") {
    const onDevice = kind === "layout" && !!this.activePage && u.id === this.activePage;
    return html`<div class="mrow">
      ${this._thumb(u.thumb)}
      <div class="cell-name">${u.label}
        ${u.compat?.length ? html`<span class="hint">[${u.compat.join("/")}]</span>` : ""}
        ${kind === "screenset" ? html`<span class="hint">${u.screens} page(s)</span>` : ""}</div>
      <div class="hint">${u.requires?.length ? html`<span title=${u.requires.join(", ")}>${u.requires.length} dep(s)</span>` : "—"}</div>
      <div class="badges">${onDevice ? html`<span class="badge ok">on device</span>` : ""}${u.compatible ? html`<span class="badge ok">compatible</span>` : html`<span class="badge warn">other model</span>`}</div>
      <div class="cell-action"><button ?disabled=${!this.entryId} title=${this.entryId ? "" : "Select a device to deploy"}
        @click=${() => kind === "layout" ? this.deployLayout(u.id, u.compatible) : this.deployScreenset(u.id, u.compatible)}>${onDevice ? "Re-deploy" : "Deploy"}</button>
        <button class="danger" title=${kind === "layout" ? "Delete this page from the library" : "Delete this playlist"}
          @click=${() => kind === "layout" ? this.deletePage(u.id, u.label) : this.deletePlaylist(u.id, u.label)}>Delete</button></div>
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

      ${this._section("pages", "Pages", apps.length, html`
        <div class="panelrow"><button @click=${this.newPage} title="Start a new page in the Designer">+ New page</button></div>
        ${apps.length
          ? html`<div class="mtable">${this._mhead()}${apps.map((a) => this._contentRow(a, "layout"))}</div>`
          : html`<p class="hint">No published pages${all ? "" : " for this device"} yet. Create one above, then Publish it from the Designer.</p>`}`)}

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
              <div class="cell-action">${this.busyUnits[w.id]
                ? html`<span class="badge working">${this.busyUnits[w.id]}…</span>`
                : w.status === "installed"
                  ? html`<button class="danger" @click=${() => this.removeWidgetUnit(w.id)}>Remove</button>`
                  : html`<button @click=${() => this.installWidget(w.id)}>${w.status === "outdated" ? "Update" : "Install"}</button>`}</div>
            </div>`)}
          </div>`
        : html`<p class="hint">Select a device to manage installed widgets.</p>`)}

      ${this._section("icons", "Icons", this.installedIcons.length, html`
        <p class="hint">Built-in icons ship with the engine. Add LaMetric gallery icons by code, then choose which devices to install them on.</p>
        <div class="panelrow">
          ${this.iconCode ? html`<img class="iconprev" alt=""
            src="https://developer.lametric.com/content/apps/icon_thumbs/${this.iconCode}"
            @load=${(e: Event) => ((e.target as HTMLImageElement).style.visibility = "visible")}
            @error=${(e: Event) => ((e.target as HTMLImageElement).style.visibility = "hidden")} />`
            : html`<div class="iconprev empty"></div>`}
          <div class="grow">
            <div class="panelrow">
              <label>LaMetric code</label>
              <input type="number" style="width:100px" .value=${this.iconCode}
                @input=${(e: Event) => { this.iconCode = (e.target as HTMLInputElement).value; }} />
              <label>Name</label>
              <input style="width:120px" .value=${this.iconName}
                @input=${(e: Event) => { this.iconName = (e.target as HTMLInputElement).value; }} />
            </div>
            ${this.devices.length ? html`<div class="panelrow">
              <label>Install on</label>
              <span class="targets">
                ${this.devices.map((d) => html`<label class="chk">
                  <input type="checkbox" ?checked=${this.iconTargetIds().includes(d.entry_id)}
                    @change=${() => this.toggleIconTarget(d.entry_id)} />${d.name}</label>`)}
              </span>
            </div>` : ""}
            <div class="panelrow">
              <button ?disabled=${!this.iconCode || !this.iconName.trim() || (this.devices.length > 0 && this.iconTargetIds().length === 0)}
                @click=${this.installIcon}>Add</button>
            </div>
          </div>
        </div>
        <p class="hint">Or import your own image or animation — PNG, GIF or APNG. It’s auto-fit to your display (aspect kept, never upscaled) and animations play frame-by-frame, up to a full-screen animation. Large or long clips are trimmed to fit device memory. Uses the “Install on” selection above.</p>
        <div class="panelrow">
          ${this.iconFilePreview
            ? html`<img class="iconprev" alt="" src=${this.iconFilePreview} />`
            : html`<div class="iconprev empty"></div>`}
          <div class="grow">
            <div class="panelrow">
              <label>Image file</label>
              <input type="file" accept="image/png,image/gif,image/apng,image/webp"
                @change=${this.onIconFile} />
            </div>
            <div class="panelrow">
              <label>or URL</label>
              <input style="width:220px" placeholder="https://…/animation.gif" .value=${this.iconUrl}
                @input=${(e: Event) => { this.iconUrl = (e.target as HTMLInputElement).value; this.iconFileData = ""; this.iconFilePreview = ""; }} />
            </div>
            <div class="panelrow">
              <label>Size</label>
              <select @change=${(e: Event) => { this.iconSizeMode = (e.target as HTMLSelectElement).value as "device" | "native" | "custom"; }}>
                <option value="device" ?selected=${this.iconSizeMode === "device"}>Device screen (${this.dims[0]}×${this.dims[1]})</option>
                <option value="native" ?selected=${this.iconSizeMode === "native"}>Native (keep source)</option>
                <option value="custom" ?selected=${this.iconSizeMode === "custom"}>Custom</option>
              </select>
              ${this.iconSizeMode === "custom" ? html`
                <input type="number" min="1" max="53" style="width:56px" .value=${String(this.iconCustomW)}
                  @input=${(e: Event) => { this.iconCustomW = parseInt((e.target as HTMLInputElement).value, 10) || 1; }} />
                <span>×</span>
                <input type="number" min="1" max="32" style="width:56px" .value=${String(this.iconCustomH)}
                  @input=${(e: Event) => { this.iconCustomH = parseInt((e.target as HTMLInputElement).value, 10) || 1; }} />` : ""}
            </div>
            <div class="panelrow">
              <label>Name</label>
              <input style="width:120px" .value=${this.iconImgName}
                @input=${(e: Event) => { this.iconImgName = (e.target as HTMLInputElement).value; }} />
              <button ?disabled=${!this.iconImgName.trim() || (!this.iconFileData && !this.iconUrl.trim()) || (this.devices.length > 0 && this.iconTargetIds().length === 0)}
                @click=${this.importIconImage}>Import</button>
            </div>
            ${this.iconImportNote ? html`<p class="hint">${this.iconImportNote}</p>` : ""}
          </div>
        </div>
        ${this.entryId
          ? html`<p class="hint">“Install on device” / “Remove from device” affect only the selected device. “Delete everywhere” removes the icon from the library and every device.</p>`
          : html`<p class="hint">Select a device above to install or remove these on a specific device. “Delete everywhere” removes an icon from the library and every device.</p>`}
        ${this.installedIcons.length
          ? this.installedIcons.map((n) => {
              const onDevice = this.deviceIcons.includes(n);
              return html`<div class="iconrow">
              ${this.iconThumbs[n]
                ? html`<img class="iconthumb" alt="" src="data:image/gif;base64,${this.iconThumbs[n]}" />`
                : html`<div class="iconthumb empty"></div>`}
              <span class="grow">${n}${this.iconDims[n]
                ? html` <span class="hint">${this.iconDims[n][0]}×${this.iconDims[n][1]}</span>` : ""}
                ${this.entryId && this.iconOversize(n)
                  ? html`<span class="badge warn" title="Larger than this device (${this.dims[0]}×${this.dims[1]}) — won't fit and may hang it">too big for this device</span>` : ""}</span>
              ${this.entryId
                ? (onDevice
                  ? html`<span class="badge ok">on this device</span>
                      <button class="secondary" title="Take this icon off the selected device (stays in the library)"
                        @click=${() => this.removeIconFromDevice(n)}>Remove from device</button>`
                  : this.iconOversize(n)
                    ? html`<button class="danger" title="This icon is larger than the device screen. Pushing it is for testing only and may hang the device."
                        @click=${() => this.pushIconToDevice(n)}>Test on device ⚠</button>`
                    : html`<button class="secondary" title="Push this icon to the selected device"
                        @click=${() => this.pushIconToDevice(n)}>Install on device</button>`)
                : ""}
              <button class="danger" title="Delete from the library and every device"
                @click=${() => this.removeIcon(n)}>Delete everywhere</button></div>`;
            })
          : html`<p class="hint">No custom icons installed yet.</p>`}
      `)}

      ${this._section("fonts", "Fonts", this.fonts.length, html`
        <p class="hint">Type below to preview live in every font. Digit fonts (clock faces) show only numerals; alpha fonts cover A–Z. Fonts install automatically with any widget that needs them, or install one directly onto the selected device here (no reboot).</p>
        <div class="panelrow">
          <label>Preview text</label>
          <input style="width:220px" placeholder="type to preview…" .value=${this.fontText}
            @input=${(e: Event) => this.onFontInput((e.target as HTMLInputElement).value)} />
        </div>
        ${[...this.fonts].sort((a, b) => a.h - b.h || a.w - b.w || a.label.localeCompare(b.label)).map((f) => html`<div class="frow">
          <div class="fmeta"><span class="cell-name">${f.label}</span>
            <span class="hint">${f.kind === "digits" ? "digits" : "A–Z 0–9"} · ${f.w}×${f.h}</span></div>
          ${this.fontPngs[f.name]
            ? html`<img class="fprev" alt="" src="data:image/png;base64,${this.fontPngs[f.name]}" />`
            : html`<div class="fprev empty"></div>`}
          ${f.builtin
            ? html`<span class="badge ok">built-in</span>`
            : (this.entryId
                ? (f.installed
                    ? html`<span class="badge ok">installed</span>`
                    : html`<button @click=${() => this.installFont(f.name)}>Install</button>`)
                : "")}
        </div>`)}
      `)}
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
      this.playFrames("spec", r.frames ?? (r.png ? [r.png] : []), (f) => { this.specPng = f; }); this.specError = "";
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

  private parsedSpec(): Record<string, any> | null {
    try { return JSON.parse(this.specText); } catch { return null; }
  }
  private writeSpec(spec: Record<string, any>): void {
    this.specText = JSON.stringify(spec, null, 2);
    this.specError = "";
    clearTimeout(this.specTimer);
    this.specTimer = window.setTimeout(() => this.previewSpec(), 120);
  }
  private setSpecField(key: string, val: unknown): void {
    const s = this.parsedSpec(); if (!s) return;
    s[key] = val; this.writeSpec(s);
  }
  private setOpField(i: number, key: string, val: unknown): void {
    const s = this.parsedSpec(); if (!s || !Array.isArray(s.draw)) return;
    const prev = s.draw[i] ?? {};
    s.draw[i] = key === "op"
      ? { op: val, x: prev.x ?? 0, y: prev.y ?? 0 }
      : { ...prev, [key]: val };
    this.writeSpec(s);
  }
  private addOp(type: string): void {
    const s = this.parsedSpec() ?? {}; s.draw = [...(s.draw ?? []), { op: type, x: 0, y: 0 }]; this.writeSpec(s);
  }
  private removeOp(i: number): void {
    const s = this.parsedSpec(); if (!s || !Array.isArray(s.draw)) return;
    s.draw.splice(i, 1); this.writeSpec(s);
  }

  private _opField(op: Record<string, any>, i: number, key: string, type: string) {
    const hint = FIELD_META[key]?.hint;
    const label = html`<span class="flabel">${fieldLabel(key)}</span>`;
    let control;
    if (type === "rgb") control = this.colorCtl((op[key] as Rgb) ?? [255, 255, 255], (v) => this.setOpField(i, key, v));
    else if (type === "num") control = html`<input type="number" style="width:64px" .value=${String(op[key] ?? 0)} @change=${(e: Event) => this.setOpField(i, key, +(e.target as HTMLInputElement).value)} />`;
    else if (type === "icon") control = html`<select @change=${(e: Event) => this.setOpField(i, key, (e.target as HTMLSelectElement).value)}>
        ${this.iconNames.map((o) => html`<option ?selected=${op[key] === o}>${o}</option>`)}</select>`;
    else if (key === "bind") control = html`<input type="text" style="width:140px" list="pu-bind-list" placeholder="solar…"
        .value=${String(op[key] ?? "")} @change=${(e: Event) => this.setOpField(i, key, (e.target as HTMLInputElement).value)} />`;
    else if (key === "fmt") control = html`<input type="text" style="width:96px" placeholder="{:.1f}"
        .value=${String(op[key] ?? "")} @change=${(e: Event) => this.setOpField(i, key, (e.target as HTMLInputElement).value)} />
        ${["{}", "{:.0f}", "{:.1f}", "{}%", "{:.1f}°"].map((p) => html`<button class="fmtchip" title="Use ${p}" @click=${() => this.setOpField(i, "fmt", p)}>${p}</button>`)}`;
    else control = html`<input type="text" style="width:120px" .value=${String(op[key] ?? "")} @change=${(e: Event) => this.setOpField(i, key, (e.target as HTMLInputElement).value)} />`;
    return html`${label}<span class="fcell">${control}${hint ? html`<span class="fhint">${hint}</span>` : ""}</span>`;
  }
  private _opEditor(op: Record<string, any>, i: number) {
    const meta = OP_META[op.op] ?? { label: op.op, desc: "" };
    return html`<div class="opcard">
      <div class="ophead">
        <span class="optitle">${meta.label}</span>
        <select title="Change op type" @change=${(e: Event) => this.setOpField(i, "op", (e.target as HTMLSelectElement).value)}>
          ${OP_TYPES.map((t) => html`<option value=${t} ?selected=${t === op.op}>${OP_META[t]?.label ?? t}</option>`)}</select>
        <span class="grow"></span>
        <button class="danger zbtn" title="Remove op" @click=${() => this.removeOp(i)}>✕</button>
      </div>
      ${meta.desc ? html`<p class="opdesc">${meta.desc}</p>` : ""}
      <div class="fieldgrid">
        <span class="flabel">Position</span>
        <span class="fcell">
          <label class="fhint">X</label><input type="number" style="width:64px" .value=${String(op.x ?? 0)} @change=${(e: Event) => this.setOpField(i, "x", +(e.target as HTMLInputElement).value)} />
          <label class="fhint">Y</label><input type="number" style="width:64px" .value=${String(op.y ?? 0)} @change=${(e: Event) => this.setOpField(i, "y", +(e.target as HTMLInputElement).value)} />
        </span>
        ${(OP_FIELDS[op.op] ?? []).map(([k, t]) => this._opField(op, i, k, t))}
      </div>
    </div>`;
  }
  private _formView() {
    const s = this.parsedSpec();
    if (!s) return html`<p class="status err">Spec isn't valid JSON — switch to YAML / JSON to fix it.</p>`;
    return html`
      <datalist id="pu-bind-list">
        ${KNOWN_BINDS.map((b) => html`<option value=${b}></option>`)}
        ${Object.keys(this.hass?.states ?? {}).map((e) => html`<option value=${e}></option>`)}
      </datalist>
      <div class="fieldgrid">
        <span class="flabel">ID</span><span class="fcell"><input style="width:140px" .value=${s.id ?? ""} @change=${(e: Event) => this.setSpecField("id", (e.target as HTMLInputElement).value)} /><span class="fhint">unique id, e.g. my_widget</span></span>
        <span class="flabel">Label</span><span class="fcell"><input style="width:140px" .value=${s.label ?? ""} @change=${(e: Event) => this.setSpecField("label", (e.target as HTMLInputElement).value)} /></span>
        <span class="flabel">Size</span><span class="fcell">
          <label class="fhint">W</label><input type="number" style="width:64px" .value=${String(s.w ?? "")} @change=${(e: Event) => this.setSpecField("w", +(e.target as HTMLInputElement).value)} />
          <label class="fhint">H</label><input type="number" style="width:64px" .value=${String(s.h ?? "")} @change=${(e: Event) => this.setSpecField("h", +(e.target as HTMLInputElement).value)} />
        </span>
      </div>
      <h3>Draw ops</h3>
      <p class="hint">Each op draws one element, in order. Available data: ${KNOWN_BINDS.join(", ")} (unknown binds preview as 123).</p>
      ${(s.draw ?? []).map((op: Record<string, any>, i: number) => this._opEditor(op, i))}
      <p class="hint">Add an op:</p>
      <div class="addchips">
        ${OP_TYPES.map((t) => html`<button class="addchip" title=${OP_META[t]?.desc ?? ""} @click=${() => this.addOp(t)}>+ ${OP_META[t]?.label ?? t}</button>`)}
      </div>
    `;
  }

  private _paintView() {
    return html`<div class="pane">
      <p class="hint">Paint an icon at this device's resolution, or load an image and edit it. Black = off (checkerboard). Saves to your icon library.</p>
      <pixel-editor .w=${this.dims[0]} .h=${this.dims[1]}
        .decode=${this._iconDecode}
        @save=${(e: CustomEvent) => this._saveEditorIcon(e.detail)}></pixel-editor>
    </div>`;
  }

  private _iconDecode = async (req: { data?: string; url?: string; maxW: number; maxH: number }) => {
    return (await this.hass.callWS({
      type: "pimoroni_unicorn/icon_decode",
      data: req.data, url: req.url, max_w: req.maxW, max_h: req.maxH,
    })) as { png: string; w: number; h: number };
  };

  private async _saveEditorIcon(detail: { name: string; dataUrl: string; w: number; h: number }) {
    const data = detail.dataUrl.slice(detail.dataUrl.indexOf(",") + 1);
    const entry_ids = this.iconTargetIds();
    try {
      const r = (await this.hass.callWS({
        type: "pimoroni_unicorn/icon_upload", name: detail.name, data,
        max_w: detail.w, max_h: detail.h, entry_ids,
      })) as { sent?: string[] };
      const sent = r.sent ?? [];
      this.status = sent.length ? `Saved "${detail.name}" → ${sent.join(", ")}.`
        : `Saved "${detail.name}" (no devices to push to).`;
      this.reloadIconsSoon();
    } catch (e) {
      this.status = `Save failed: ${(e as { message?: string })?.message ?? e}`;
    }
  }

  private _editorView() {
    const sc = Math.max(6, Math.floor(PREVIEW_TARGET_PX / this.dims[0]));
    return html`
      <div class="bar">
        <span class="hint">declarative widget — previewed on ${this.model}</span>
        <span class="grow"></span>
        <div class="group">
          <button class="${this.editMode === "form" ? "" : "secondary"}" @click=${() => { this.editMode = "form"; }}>Form</button>
          <button class="${this.editMode === "yaml" ? "" : "secondary"}" @click=${() => { this.editMode = "yaml"; }}>YAML / JSON</button>
        </div>
      </div>
      <div class="wrap">
        <div class="col">
          ${this.editMode === "form"
            ? this._formView()
            : html`<textarea class="spec" .value=${this.specText}
                @input=${(e: Event) => this.onSpecInput((e.target as HTMLTextAreaElement).value)}></textarea>`}
          <div class="panelrow">
            <button @click=${this.saveSpec}>Save custom</button>
            <button class="secondary" @click=${() => { const t = prompt("Paste YAML or JSON widget spec:"); if (t) this.importSpec(t); }}>Import…</button>
          </div>
          ${this.specError ? html`<div class="status err">${this.specError}</div>` : html`<div class="hint">binds: solar, soc, consumption, co2… (unknown binds preview as 123)</div>`}
        </div>
        <div class="col">
          <div class="stage" style=${`width:${this.dims[0] * sc}px;height:${this.dims[1] * sc}px`}>
            ${this.specPng ? html`<img src="data:image/png;base64,${this.specPng}" alt="Widget preview" width=${this.dims[0] * sc} height=${this.dims[1] * sc} />` : ""}
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

  private moveScreen(name: string, dir: -1 | 1) {
    const order = [...this.screenLayouts];
    const i = order.indexOf(name);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= order.length) return;
    [order[i], order[j]] = [order[j], order[i]];
    this.screenLayouts = order;
    this.buildScreenPreview();
  }

  private async buildScreenPreview() {
    clearInterval(this.screenTimer);
    const pngs: Record<string, string> = {};
    await Promise.all(this.screenLayouts.map(async (name) => {
      const lay = this.stored[name];
      if (!lay) return;
      try {
        const r = await this.hass.callWS({ type: "pimoroni_unicorn/render", model: this.model, layout: lay });
        pngs[name] = r.png;
      } catch { /* skip unrenderable */ }
    }));
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
          <p class="hint">Tick pages to include, then order them with ▲ ▼.</p>
          ${names.length ? names.map((n) => {
            const on = this.screenLayouts.includes(n);
            const pos = this.screenLayouts.indexOf(n);
            return html`<div class="panelrow" tabindex=${on ? "0" : "-1"}
              @keydown=${on ? (e: KeyboardEvent) => {
                if (e.altKey && e.key === "ArrowUp") { e.preventDefault(); this.moveScreen(n, -1); }
                else if (e.altKey && e.key === "ArrowDown") { e.preventDefault(); this.moveScreen(n, 1); }
              } : undefined}>
              <input type="checkbox" ?checked=${on}
                @change=${(e: Event) => this.toggleScreen(n, (e.target as HTMLInputElement).checked)} />
              ${on ? html`<span class="chip" title="Position ${pos + 1}">${pos + 1}</span>` : ""}
              <span class="grow">${n}</span>
              ${on ? html`
                <button class="zbtn secondary" ?disabled=${pos === 0} @click=${() => this.moveScreen(n, -1)} title="Move up" aria-label="Move ${n} up">▲</button>
                <button class="zbtn secondary" ?disabled=${pos === this.screenLayouts.length - 1} @click=${() => this.moveScreen(n, 1)} title="Move down" aria-label="Move ${n} down">▼</button>` : ""}
            </div>`; })
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
            ${png ? html`<img src="data:image/png;base64,${png}" alt="Playlist preview" width=${this.dims[0] * sc} height=${this.dims[1] * sc}
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
