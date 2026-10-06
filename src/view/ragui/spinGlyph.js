"use strict";
var __spinGlyphMod = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

  // src/spinGlyph.ts
  var spinGlyph_exports = {};
  __export(spinGlyph_exports, {
    SpinGlyph: () => SpinGlyph
  });
  var NS = "http://www.w3.org/2000/svg";
  var LAUNCH_MS = 460;
  var PASS_MS = 300;
  var LAND_MS = 620;
  var CX = 12;
  var CY = 12.8;
  var R = 7;
  var TOP_Y = CY - R;
  var LINE_Y = 12;
  var PHI0 = 75 / 180 * Math.PI;
  var L_REST = R * (2 * Math.PI - PHI0);
  var L_STRAIGHT = 15;
  var HIDE = 6;
  var STRAIGHT_AT = 16;
  var LEAD = 30;
  var HEAD_LEN = 5.2;
  var HEAD_BACK = 0.8;
  var HEAD_W = 4;
  var STROKE = 2.7;
  var N = 56;
  var clamp01 = (v) => Math.max(0, Math.min(1, v));
  var easeIn = (p) => p * p;
  var easeOut = (p) => 1 - (1 - p) * (1 - p) * (1 - p);
  var easeInOut = (p) => p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
  var onCircle = (phi) => [[CX + R * Math.sin(phi), CY - R * Math.cos(phi)], [Math.cos(phi), Math.sin(phi)]];
  var launchTrack = (s) => {
    const arc = L_REST;
    if (s <= arc) return onCircle(PHI0 + s / R);
    return [[CX + (s - arc), TOP_Y], [1, 0]];
  };
  var landTrack = (lead) => (s) => {
    if (s <= lead) return [[CX - (lead - s), TOP_Y], [1, 0]];
    return onCircle((s - lead) / R);
  };
  var SpinGlyph = class {
    constructor() {
      __publicField(this, "el");
      __publicField(this, "shaft");
      __publicField(this, "head");
      __publicField(this, "trail");
      // flight bounds (viewBox units): head fully hidden left / tail fully out right
      __publicField(this, "xIn", -16);
      __publicField(this, "xOut", 50);
      __publicField(this, "flightFx", 0.4);
      // centre -> far clip corner, as fractions of the button's W / H (setFlight)
      __publicField(this, "flightFy", 0);
      __publicField(this, "angle", 0);
      // flight direction, radians above horizontal
      __publicField(this, "mode", "idle");
      __publicField(this, "stopping", false);
      __publicField(this, "restartAfterLand", false);
      __publicField(this, "phaseStart", 0);
      __publicField(this, "raf", 0);
      __publicField(this, "runFrom", 0);
      // head x the current straight pass starts from
      __publicField(this, "reduced", typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches);
      __publicField(this, "tick", (now) => {
        if (this.phaseStart < 0) this.phaseStart = now;
        const e = now - this.phaseStart;
        if (this.mode === "launch") {
          const p = clamp01(e / LAUNCH_MS);
          this.drawLaunch(easeIn(p) * (this.xOut - CX));
          if (p >= 1) {
            this.go(this.stopping ? "land" : "run");
            return;
          }
        } else if (this.mode === "run") {
          const p = clamp01(e / PASS_MS);
          this.drawStraight(this.runFrom + (this.xOut - this.runFrom) * easeInOut(p), true);
          if (p >= 1) {
            this.go(this.stopping ? "land" : "run");
            return;
          }
        } else if (this.mode === "land") {
          const p = clamp01(e / LAND_MS);
          this.drawLand(p);
          if (p >= 1) {
            this.mode = "idle";
            this.drawRest();
            if (this.restartAfterLand) {
              this.restartAfterLand = false;
              this.go("launch");
            }
            return;
          }
        } else return;
        this.raf = requestAnimationFrame(this.tick);
      });
      this.el = document.createElementNS(NS, "svg");
      this.el.setAttribute("viewBox", "0 0 24 24");
      this.el.setAttribute("width", "34");
      this.el.setAttribute("height", "34");
      this.el.style.overflow = "visible";
      const mk = (fill) => {
        const p = document.createElementNS(NS, "path");
        p.setAttribute("fill", fill ? "currentColor" : "none");
        if (!fill) {
          p.setAttribute("stroke", "currentColor");
          p.setAttribute("stroke-linecap", "butt");
          p.setAttribute("stroke-linejoin", "miter");
        }
        return p;
      };
      this.trail = mk(false);
      this.trail.setAttribute("stroke-width", "1.3");
      this.trail.setAttribute("opacity", "0.5");
      this.shaft = mk(false);
      this.shaft.setAttribute("stroke-width", String(STROKE));
      this.head = mk(true);
      this.el.append(this.trail, this.shaft, this.head);
      this.drawRest();
    }
    /** The flight line: from the button centre towards (fx * W, -fy * H) - i.e. up-right for
     *  positive fy - clipped at that corner. */
    setFlight(fx, fy) {
      this.flightFx = fx;
      this.flightFy = fy;
      this.measure();
      this.drawRest();
    }
    /** Recompute the flight bounds from the button's current size (it changes per breakpoint). */
    measure() {
      const btn = this.el.closest("button");
      const ppu = (this.el.clientWidth || 34) / 24;
      if (!btn || !btn.offsetWidth) return;
      const vx = this.flightFx * btn.offsetWidth, vy = this.flightFy * btn.offsetHeight;
      this.angle = Math.atan2(vy, vx);
      const half = Math.hypot(vx, vy) / ppu;
      this.xIn = CX - half - HEAD_LEN - HIDE / 2;
      this.xOut = CX + half + L_STRAIGHT + HIDE / 2;
    }
    /** A spin started: launch off the circle, then keep passing through. */
    start() {
      this.measure();
      this.stopping = false;
      if (this.reduced) {
        this.mode = "idle";
        this.drawStraight(CX + L_STRAIGHT / 2, false);
        return;
      }
      if (this.mode === "idle") this.go("launch");
      else if (this.mode === "land") this.restartAfterLand = true;
    }
    /** The spin ended: finish the pass in flight, then fly in and curl up. */
    stop() {
      this.stopping = true;
      this.restartAfterLand = false;
      if (this.reduced) {
        this.mode = "idle";
        this.drawRest();
      }
    }
    go(m, runFrom = this.xIn) {
      this.mode = m;
      this.runFrom = runFrom;
      this.phaseStart = -1;
      cancelAnimationFrame(this.raf);
      this.raf = requestAnimationFrame(this.tick);
    }
    // ---- drawing ------------------------------------------------------------
    drawRest() {
      this.drawOnTrack(launchTrack, L_REST, L_REST, 0, 0, false);
    }
    /** u = how far the head has travelled along the launch line */
    drawLaunch(u) {
      const k = clamp01(u / STRAIGHT_AT);
      const len = L_REST + (L_STRAIGHT - L_REST) * k;
      const dy = (LINE_Y - TOP_Y) * easeInOut(k);
      this.drawOnTrack(launchTrack, L_REST + u, len, 0, dy, k >= 1);
    }
    drawLand(p) {
      const lead = Math.max(LEAD, CX - this.xIn + 1);
      const s0 = 0, s1 = lead + 2 * Math.PI * R;
      const s = s0 + (s1 - s0) * easeOut(p);
      const curl = clamp01((s - lead) / (2 * Math.PI * R));
      const len = L_STRAIGHT + (L_REST - L_STRAIGHT) * curl;
      const dy = (LINE_Y - TOP_Y) * (1 - easeInOut(clamp01((s - s0) / (lead - s0 + R))));
      this.drawOnTrack(landTrack(lead), s, len, 0, dy, curl === 0);
    }
    /** a straight arrow on the centre line with its head at x */
    drawStraight(headX, trail) {
      const track = (s) => [[s, LINE_Y], [1, 0]];
      this.drawOnTrack(track, headX, L_STRAIGHT, 0, 0, trail);
    }
    /** draw the body lying on `track` from (headS - len) to headS, offset by (dx, dy) */
    drawOnTrack(track, headS, len, dx, dy, trail) {
      const pts = [];
      for (let i = 0; i <= N; i++) {
        const [p] = track(headS - len + len * i / N);
        pts.push([p[0] + dx, p[1] + dy]);
      }
      const [hp, d] = track(headS);
      const end = [hp[0] + dx, hp[1] + dy];
      const n = [-d[1], d[0]];
      const tip = [end[0] + d[0] * HEAD_LEN, end[1] + d[1] * HEAD_LEN];
      const base = [end[0] - d[0] * HEAD_BACK, end[1] - d[1] * HEAD_BACK];
      const ca = Math.cos(this.angle), sa = Math.sin(this.angle);
      const rot = (q) => {
        const x = q[0] - 12, y = q[1] - 12;
        return [12 + x * ca + y * sa, 12 - x * sa + y * ca];
      };
      const f = (q) => {
        const r = rot(q);
        return `${r[0].toFixed(2)} ${r[1].toFixed(2)}`;
      };
      this.shaft.setAttribute("d", "M" + pts.map(f).join("L"));
      this.head.setAttribute("d", `M${f(tip)}L${f([base[0] + n[0] * HEAD_W, base[1] + n[1] * HEAD_W])}L${f([base[0] - n[0] * HEAD_W, base[1] - n[1] * HEAD_W])}Z`);
      if (trail) {
        const tx = pts[0][0], y = pts[0][1];
        const seg = (x0, x1, yy) => `M${f([x0, yy])}L${f([x1, yy])}`;
        this.trail.setAttribute("d", seg(tx - 11, tx - 1, y) + seg(tx - 8, tx + 3, y - 4.2) + seg(tx - 8, tx + 3, y + 4.2));
      } else this.trail.setAttribute("d", "");
    }
  };
  return __toCommonJS(spinGlyph_exports);
})();
window.SpinGlyph = __spinGlyphMod.SpinGlyph;
