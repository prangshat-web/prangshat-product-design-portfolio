import { useState, useEffect, useRef, Fragment } from "react";

const PORTRAIT =
  "/assets/portrait.jpg";


/* ─────────────────────────────────────────────
   GLOBAL STYLES
   Dark-only — tokens defined once on .pf-root (no theme switching).
   Display: Inter Tight · Body: Inter · Mono: JetBrains Mono
───────────────────────────────────────────── */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter+Tight:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    .pf-root {
      --bg: #0A0A0A;          /* primary background */
      --bg-2: #111111;        /* secondary background */
      --bg-deep: #000000;     /* deepest band */
      --surface: #171717;     /* surface / card */
      --surface-2: #1c1c1c;
      --ink: #FFFFFF;         /* primary text */
      --ink-soft: #A1A1AA;    /* secondary text */
      --ink-muted: #71717A;   /* decorative labels */
      --line: #27272A;        /* border */
      --line-strong: #3F3F46; /* emphasis border */
      --accent: #FFFFFF;      /* accent (monochrome) */
      --accent-soft: rgba(255,255,255,0.10);
      --grad: linear-gradient(135deg, #ee0979 0%, #ff6a00 100%);
      --grad-soft: rgba(238,9,121,0.16);
      --invert-bg: #111111;   /* (legacy "inverted" sections → now dark) */
      --invert-ink: #FFFFFF;
      --mymo-shot-h: clamp(280px, 52vw, 640px); /* shared height for all static MyMo screenshots */
    }

    html { scroll-behavior: smooth; }

    .pf-root {
      font-family: 'Inter', sans-serif;
      background: var(--bg);
      color: var(--ink);
      -webkit-font-smoothing: antialiased;
      overflow-x: hidden;
      min-height: 100vh;
    }

    .font-display { font-family: 'Inter Tight', sans-serif; }
    .font-mono { font-family: 'JetBrains Mono', monospace; }

    /* ── Reusable bits ── */
    .eyebrow {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: var(--ink-muted);
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }
    .eyebrow::before {
      content: '';
      width: 6px; height: 6px;
      background: var(--grad);
      border-radius: 50%;
      display: inline-block;
    }

    .rule { border: none; border-top: 1px solid var(--line); }

    .tag {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      letter-spacing: 0.06em;
      color: var(--ink-soft);
      border: 1px solid var(--line);
      padding: 5px 11px;
      border-radius: 100px;
      white-space: nowrap;
    }

    /* ── Animations ── */
    @keyframes fadeUp { from { opacity:0; transform:translateY(26px);} to {opacity:1; transform:translateY(0);} }
    @keyframes fadeIn { from { opacity:0;} to {opacity:1;} }
    .anim-up { animation: fadeUp 0.8s cubic-bezier(0.22,1,0.36,1) both; }
    /* Hero showcase: single load-time entrance only (no scroll/float/parallax) */
    @keyframes heroIn { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
    .hero-in { animation: heroIn 0.8s cubic-bezier(0.16,1,0.3,1) both; }
    @media (prefers-reduced-motion: reduce) { .hero-in { animation: none; } }
    .anim-in { animation: fadeIn 0.6s ease both; }
    .d1{animation-delay:.06s}.d2{animation-delay:.16s}.d3{animation-delay:.26s}
    .d4{animation-delay:.36s}.d5{animation-delay:.46s}.d6{animation-delay:.56s}

    .reveal { opacity:0; transform: translateY(22px);
      transition: opacity .8s cubic-bezier(0.22,1,0.36,1), transform .8s cubic-bezier(0.22,1,0.36,1); }
    .reveal.visible { opacity:1; transform: translateY(0); }

    /* Case studies: static content, no scroll-reveal motion */
    .cs-static .reveal { opacity: 1 !important; transform: none !important; transition: none !important; }

    /* ── Hover line ── */
    .hover-line { position: relative; display: inline-block; }
    .hover-line::after {
      content:''; position:absolute; bottom:-3px; left:0; width:100%; height:1px;
      background: var(--accent); transform: scaleX(0); transform-origin: right;
      transition: transform .35s cubic-bezier(0.22,1,0.36,1);
    }
    .hover-line:hover::after { transform: scaleX(1); transform-origin: left; }

    /* ── Nav ── */
    .nav-link {
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px; letter-spacing: 0.06em; text-transform: uppercase;
      color: var(--ink-soft); transition: color .2s; cursor: pointer;
      background: none; border: none;
    }
    .nav-link:hover { color: var(--ink); }

    /* ── Buttons ── */
    .btn {
      display: inline-flex; align-items: center; gap: 9px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px; font-weight: 500; letter-spacing: 0.06em; text-transform: uppercase;
      padding: 13px 22px; border-radius: 4px; cursor: pointer; text-decoration: none;
      transition: transform .2s, background .25s, color .25s, border-color .25s;
    }
    .btn-fill { background: var(--grad); color: #fff; border: none; }
    .btn-fill:hover { transform: scale(1.03); box-shadow: 0 12px 34px -8px rgba(238,9,121,0.55), 0 0 22px -6px rgba(255,106,0,0.4); }
    .btn-ghost { background: transparent; color: var(--ink); border: 1px solid var(--line-strong); }
    .btn-ghost:hover { border-color: var(--ink); transform: translateY(-2px); }
    .btn-invert { background: var(--invert-bg); color: var(--invert-ink); border: 1px solid var(--line-strong); }
    .btn-invert:hover { transform: translateY(-2px); border-color: var(--ink); }

    /* gradient text treatment for emphasis (keywords, numbers, labels, arrows) */
    .grad-text {
      background: var(--grad);
      -webkit-background-clip: text; background-clip: text;
      -webkit-text-fill-color: transparent; color: transparent;
    }

    /* ── Work card ── */
    .work-row { transition: background .35s ease, padding-left .35s ease; }
    .work-row:hover { background: var(--surface); padding-left: 12px; }
    .work-row .arrow { opacity:0; transform: translateX(-8px);
      transition: opacity .3s, transform .3s cubic-bezier(0.22,1,0.36,1);
      background: var(--grad); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; color: transparent; }
    .work-row:hover .arrow { opacity:1; transform: translateX(0); }
    .work-row .idx { transition: color .3s; }
    .work-row:hover .idx { color: var(--accent); }

    /* Selected Work row — responsive grid */
    .cs-grid {
      display: grid;
      grid-template-columns: 56px minmax(0,1fr) auto 40px;
      grid-template-areas: "idx body tags arrow";
      align-items: center;
      gap: 20px;
      padding: 32px 0;
    }
    .cs-grid .idx { grid-area: idx; align-self: start; }
    .cs-grid .cs-body { grid-area: body; max-width: 560px; }
    .cs-grid .cs-tags { grid-area: tags; display: flex; gap: 7px; flex-wrap: wrap; justify-content: flex-end; max-width: 250px; }
    .cs-grid .arrow { grid-area: arrow; text-align: right; }
    /* Tablet: two rows — title gets full width, tags drop below description */
    @media (max-width: 1024px) {
      .cs-grid {
        grid-template-columns: 44px minmax(0,1fr) 28px;
        grid-template-areas:
          "idx body arrow"
          "idx tags arrow";
        align-items: start;
        column-gap: 18px;
        row-gap: 18px;
      }
      .cs-grid .cs-body { max-width: 640px; }
      .cs-grid .cs-tags { justify-content: flex-start; max-width: none; }
      .cs-grid .arrow { align-self: center; }
    }
    /* Mobile: full vertical stack — index, title, description, tags */
    @media (max-width: 600px) {
      .cs-grid {
        grid-template-columns: 1fr;
        grid-template-areas: "idx" "body" "tags";
        row-gap: 14px;
        padding: 30px 0;
      }
      .cs-grid .cs-body { max-width: none; }
      .cs-grid .arrow { display: none; }
    }

    /* ── Hero product showcase ── */
    .showcase-card {
      text-align: left; background: #0a0a0a;
      border: 1px solid rgba(255,255,255,0.09); border-radius: 16px;
      overflow: hidden; cursor: pointer; padding: 0; width: 100%;
      box-shadow: 0 22px 50px -30px rgba(0,0,0,0.75);
      transition: transform .45s cubic-bezier(.22,1,.36,1), border-color .3s, box-shadow .45s;
    }
    .showcase-card:hover { transform: translateY(-4px); border-color: rgba(255,255,255,0.45); box-shadow: 0 32px 64px -30px rgba(0,0,0,0.85); }
    .showcase-card .sc-media { position: relative; padding: 16px 16px 0; }
    .showcase-card .sc-media img { display: block; width: 100%; height: 100%; object-fit: contain; }
    .showcase-card .sc-arrow { transition: transform .3s cubic-bezier(.22,1,.36,1); background: var(--grad); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; color: transparent; }
    .showcase-card:hover .sc-arrow { transform: translateX(5px); }

    /* ── Case-study product showcase ── */
    .ps-stage { position: relative; width: 100%; }
    .ps-screen, .ps-phone { position: relative; overflow: hidden; background: #000; display: block; }
    .ps-screen { border-radius: 14px; border: 1px solid var(--line); box-shadow: 0 44px 90px -34px rgba(0,0,0,0.85), 0 14px 34px -18px rgba(0,0,0,0.6); }
    .ps-phone { border-radius: 30px; border: 5px solid #0c0c0c; box-shadow: 0 36px 70px -28px rgba(0,0,0,0.9), inset 0 0 0 1px rgba(255,255,255,0.06); }
    .ps-screen img, .ps-phone img { width: 100%; height: 100%; object-fit: cover; display: block; }
    /* Hero showcase: image is the source of truth — natural aspect ratio, no fixed-height/aspect container */
    .ps-stage.hero .ps-screen, .ps-stage.hero .ps-phone { width: 100%; height: auto; }
    .ps-stage.hero .ps-screen img, .ps-stage.hero .ps-phone img { width: 100%; height: auto; object-fit: contain; }
    /* MyMo hero — clean white CSS device frame (scoped; does not affect Easy Smart overlay or case-body screenshots) */
    .mymo-hero .ps-phone { border: 4px solid #ffffff; border-radius: 48px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.35); }
    /* Case-study hero showcase image — rounded corners (24px) */
    .ps-stage.hero .ps-screen, .ps-stage.hero .ps-phone, .ps-stage.hero.mymo-hero .ps-phone { border-radius: 24px; }
    /* Easy Smart hero showcase — responsive width (Easy Smart only; desktop keeps 50%) */
    @media (min-width: 768px) and (max-width: 1023px) { .es-hero-shot { width: 75% !important; } }
    @media (max-width: 767px) { .es-hero-shot { width: 92% !important; } }
    /* Additional Product Screens (Easy Smart) — plain screenshots, scoped slide-up reveal (not .reveal, which cs-static disables) */
    .aps-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; justify-items: center; align-items: start; }
    .aps-shot { display: block; width: auto; max-width: 100%; max-height: clamp(420px, 60vh, 600px); border-radius: 20px; border: 1px solid var(--line); box-shadow: 0 24px 60px -20px rgba(0,0,0,0.55); }
    .aps-anim { opacity: 0; transform: translateY(60px); transition: opacity 0.8s ease-out, transform 0.8s ease-out; }
    .aps-anim.in { opacity: 1; transform: translateY(0); }
    @media (max-width: 760px) { .aps-grid { grid-template-columns: 1fr; gap: 32px; } .aps-shot { max-height: none; width: 100%; } }
    .ps-float-a { animation: floatA 8s ease-in-out infinite; }
    .ps-float-b { animation: floatB 10s ease-in-out infinite; }

    /* Case-study static image presentation */
    .mf-compare { display: grid; grid-template-columns: 1fr 1fr; gap: 20px 26px; align-items: start; }
    .mf-compare .ps-phone { margin: 0 auto; }
    .mf-head { font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--ink-muted); }
    .mf-head.mf-after { background: var(--grad); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; color: transparent; }

    .shot-row { display: flex; gap: 18px; overflow-x: auto; scrollbar-width: none; padding-bottom: 4px;
      -webkit-mask-image: linear-gradient(90deg, transparent, #000 2%, #000 98%, transparent);
              mask-image: linear-gradient(90deg, transparent, #000 2%, #000 98%, transparent); }
    .shot-row::-webkit-scrollbar { display: none; }
    /* one shared screenshot frame — height-driven, width from aspect ratio */
    .shot-frame { height: var(--mymo-shot-h); width: auto; max-width: 100%; flex: 0 0 auto; }
    @media (max-width: 600px) {
      .shot-row { -webkit-mask-image: none; mask-image: none; }
    }

    /* ── Plain UI image galleries (Easy Smart showcase + MyMo) ── */
    .mymo-gallery { display: grid; gap: 24px; align-items: start; justify-items: center; }
    .mymo-gallery > img { width: 100%; height: auto; }
    .mymo-gallery.cols-3 { grid-template-columns: repeat(3, 1fr); }
    .mymo-gallery.cols-2 { grid-template-columns: repeat(2, 1fr); }
    @media (max-width: 1024px) { .mymo-gallery.cols-3 { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 600px) {
      .mymo-gallery.cols-3, .mymo-gallery.cols-2 { grid-template-columns: 1fr; }
    }

    /* ── Ecosystem flow ── */
    .eco-section { position: relative; overflow: hidden; background: var(--bg-deep); border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }
    .eco-bg { position: absolute; inset: 0; z-index: 0; pointer-events: none; }
    .eco-grid { position: absolute; inset: 0; opacity: .32;
      background-image: linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px);
      background-size: 46px 46px;
      -webkit-mask-image: radial-gradient(ellipse 72% 64% at 50% 46%, #000 0%, transparent 80%);
              mask-image: radial-gradient(ellipse 72% 64% at 50% 46%, #000 0%, transparent 80%); }
    .eco-glow { position: absolute; left: 50%; top: 44%; width: 760px; height: 420px; transform: translate(-50%,-50%);
      background: radial-gradient(circle, rgba(238,9,121,0.15), rgba(255,106,0,0.06) 42%, transparent 70%); filter: blur(26px); }
    .eco-nodes { position: absolute; inset: 0; width: 100%; height: 100%; opacity: .55; }

    .eco-head { opacity: 0; transform: translateY(16px); transition: opacity .7s ease, transform .7s cubic-bezier(.22,1,.36,1); }
    .eco-in .eco-head { opacity: 1; transform: none; }

    .eco-track { position: relative; display: flex; align-items: stretch; justify-content: center; gap: 0;
      overflow-x: auto; scrollbar-width: none; padding: 4px 2px 8px;
      -webkit-mask-image: linear-gradient(90deg, transparent, #000 3.5%, #000 96.5%, transparent);
              mask-image: linear-gradient(90deg, transparent, #000 3.5%, #000 96.5%, transparent); }
    .eco-track::-webkit-scrollbar { display: none; }

    .eco-card { position: relative; flex: 0 0 clamp(150px, 15vw, 178px); align-self: center;
      display: flex; flex-direction: column; align-items: flex-start;
      background: var(--surface); border: 1px solid var(--line); border-radius: 24px; padding: 22px 18px 20px;
      box-shadow: 0 14px 30px -18px rgba(0,0,0,.7);
      opacity: 0; transform: translateY(20px);
      transition: opacity .55s ease, transform .55s cubic-bezier(.22,1,.36,1), box-shadow .3s, border-color .3s; }
    .eco-in .eco-card { opacity: 1; transform: none; }
    .eco-card:hover { transform: translateY(-4px); box-shadow: 0 24px 46px -22px rgba(0,0,0,.85); border-color: var(--line-strong); }

    .eco-ic { width: 46px; height: 46px; border-radius: 14px; display: flex; align-items: center; justify-content: center;
      background: rgba(255,255,255,.04); border: 1px solid var(--line); color: var(--ink); margin-bottom: 16px; }
    .eco-or { display: flex; align-items: center; gap: 5px; }
    .eco-or > span { font-family: 'JetBrains Mono', monospace; font-size: 9px; letter-spacing: .08em; text-transform: uppercase;
      background: var(--grad); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; color: transparent; }
    .eco-title { font-size: 15px; font-weight: 600; letter-spacing: -.01em; line-height: 1.2; color: var(--ink); }
    .eco-desc { font-size: 12.5px; font-weight: 300; color: var(--ink-soft); line-height: 1.5; margin-top: 7px; }

    .eco-core { flex-basis: clamp(166px, 16.5vw, 198px); padding: 26px 20px 22px;
      background: linear-gradient(var(--surface), var(--surface)) padding-box, var(--grad) border-box; border: 1.5px solid transparent;
      box-shadow: 0 24px 50px -22px rgba(238,9,121,.4), 0 10px 24px -16px rgba(0,0,0,.8); }
    .eco-core:hover { transform: translateY(-4px); box-shadow: 0 30px 58px -24px rgba(238,9,121,.5), 0 12px 26px -16px rgba(0,0,0,.85); }
    .eco-core .eco-ic { background: var(--grad); border-color: transparent; color: #fff; box-shadow: 0 8px 18px -8px rgba(238,9,121,.7); }
    .eco-badge { display: inline-block; font-family: 'JetBrains Mono', monospace; font-size: 9px; letter-spacing: .14em; text-transform: uppercase;
      padding: 4px 9px; border-radius: 999px; margin-bottom: 14px; color: #fff;
      background: var(--grad-soft); border: 1px solid rgba(238,9,121,.4); }

    .eco-line { position: relative; flex: 0 0 clamp(26px, 3vw, 46px); align-self: center; height: 2px; overflow: hidden;
      background: var(--line); border-radius: 2px; transform: scaleX(0); transform-origin: left center;
      transition: transform .55s cubic-bezier(.22,1,.36,1); }
    .eco-in .eco-line { transform: scaleX(1); }
    .eco-pulse { position: absolute; top: 0; left: 0; height: 100%; width: 60%; border-radius: 2px;
      background: linear-gradient(90deg, transparent, #ee0979, #ff6a00, transparent);
      transform: translateX(-120%); animation: ecoPulse 2.6s linear infinite; }
    .eco-track:hover .eco-pulse { animation-duration: 1.5s; }
    @keyframes ecoPulse { from { transform: translateX(-120%); } to { transform: translateX(220%); } }

    .eco-in .eco-final { animation: ecoSuccess 1.3s ease .95s 1; }
    @keyframes ecoSuccess {
      0%   { box-shadow: 0 14px 30px -18px rgba(0,0,0,.7), 0 0 0 0 rgba(238,9,121,.55); }
      55%  { box-shadow: 0 14px 30px -18px rgba(0,0,0,.7), 0 0 0 16px rgba(238,9,121,0); }
      100% { box-shadow: 0 14px 30px -18px rgba(0,0,0,.7), 0 0 0 0 rgba(238,9,121,0); }
    }

    @media (max-width: 900px) { .eco-track { justify-content: flex-start; } }
    @media (max-width: 680px) {
      .eco-track { flex-direction: column; align-items: stretch; overflow-x: visible;
        -webkit-mask-image: none; mask-image: none; }
      .eco-card, .eco-core { flex-basis: auto; width: 100%; align-self: stretch; }
      .eco-line { width: 2px; height: clamp(26px, 6vw, 40px); flex-basis: auto; align-self: center;
        transform: scaleY(0); transform-origin: top center; }
      .eco-in .eco-line { transform: scaleY(1); }
      .eco-pulse { width: 100%; height: 60%; left: 0; top: 0;
        background: linear-gradient(180deg, transparent, #ee0979, #ff6a00, transparent);
        transform: translateY(-120%); animation: ecoPulseV 2.6s linear infinite; }
      @keyframes ecoPulseV { from { transform: translateY(-120%); } to { transform: translateY(220%); } }
    }

    /* ── Marquee ── */
    @keyframes marquee { from { transform: translateX(0);} to { transform: translateX(-50%);} }
    .marquee-track { display:flex; gap:64px; width:max-content; animation: marquee 26s linear infinite; }
    .marquee-mask { -webkit-mask-image: linear-gradient(90deg, transparent, #000 14%, #000 86%, transparent);
                    mask-image: linear-gradient(90deg, transparent, #000 14%, #000 86%, transparent); }

    /* ── Field ── */
    .field {
      width:100%; font-family:'Inter',sans-serif; font-size:15px; font-weight:400;
      color: var(--ink); background: transparent; border:none;
      border-bottom: 1px solid var(--line); padding: 12px 0; outline:none;
      transition: border-color .25s;
    }
    .field:focus { border-color: var(--accent); }
    .field::placeholder { color: var(--ink-muted); }
    textarea.field { resize:none; height: 110px; }

    /* ── Editorial portrait ── */
    .portrait {
      position: relative;
      width: 100%;
      aspect-ratio: 4 / 5;
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid var(--line);
      background: var(--surface);
      box-shadow: 0 1px 1px rgba(0,0,0,0.04),
                  0 18px 40px -16px rgba(0,0,0,0.45),
                  0 4px 10px -6px rgba(0,0,0,0.30);
    }
    .portrait img {
      width: 100%; height: 100%;
      object-fit: cover; object-position: 50% 22%;
      display: block;
      filter: saturate(0.96) contrast(1.02);
      transition: transform 1.1s cubic-bezier(0.22,1,0.36,1), filter .6s ease;
    }
    .portrait:hover img { transform: scale(1.035); filter: saturate(1.05) contrast(1.03); }
    .portrait .caption {
      position: absolute; left: 0; right: 0; bottom: 0;
      padding: 16px 20px;
      display: flex; justify-content: space-between; align-items: center;
      background: linear-gradient(to top, rgba(8,8,8,0.62), rgba(8,8,8,0));
      color: #fff;
    }
    .portrait .caption .cap-name { font-family: 'JetBrains Mono', monospace; font-size: 12px; letter-spacing: 0.02em; }
    .portrait .caption .cap-loc { font-family: 'JetBrains Mono', monospace; font-size: 11px; opacity: 0.7; }

    /* portrait fade-in (paired with .reveal) */
    .portrait.reveal { transform: translateY(28px) scale(0.985); }
    .portrait.reveal.visible { transform: translateY(0) scale(1); }

    /* ── Device showcase ── */
    .device-stage { position: relative; width: 100%; min-height: 600px; }
    .device-wrap { position: absolute; }
    .device {
      position: relative; border-radius: 44px; padding: 9px;
      background: linear-gradient(155deg, #34343a 0%, #101012 46%, #050506 100%);
      box-shadow: inset 0 0 0 2px rgba(255,255,255,0.05), inset 0 1px 1px rgba(255,255,255,0.18);
      will-change: transform;
    }
    .device-screen {
      position: relative; border-radius: 36px; overflow: hidden;
      background: #fff; aspect-ratio: 250 / 522;
    }
    .island {
      position: absolute; top: 11px; left: 50%; transform: translateX(-50%);
      width: 74px; height: 21px; background: #000; border-radius: 13px; z-index: 8;
    }
    .scr {
      position: absolute; inset: 0; opacity: 0; pointer-events: none;
      transform: translateY(12px) scale(0.996);
      transition: opacity .85s cubic-bezier(.4,0,.2,1), transform .85s cubic-bezier(.4,0,.2,1);
    }
    .scr.on { opacity: 1; transform: translateY(0) scale(1); }

    .floatA { animation: floatA 7s ease-in-out infinite; }
    .floatB { animation: floatB 9s ease-in-out infinite; }
    @keyframes floatA { 0%,100%{transform:translateY(0) rotate(-3deg);} 50%{transform:translateY(-16px) rotate(-2.1deg);} }
    @keyframes floatB { 0%,100%{transform:translateY(0) rotate(3.6deg);} 50%{transform:translateY(-24px) rotate(2.8deg);} }

    .dev-shadow {
      position: absolute; left: 50%; bottom: -36px; width: 72%; height: 30px;
      transform: translateX(-50%);
      background: radial-gradient(ellipse at center, rgba(0,0,0,0.55), transparent 70%);
      filter: blur(9px); border-radius: 50%; z-index: -1;
    }
    .shadowA { animation: shadowA 7s ease-in-out infinite; }
    .shadowB { animation: shadowB 9s ease-in-out infinite; }
    @keyframes shadowA { 0%,100%{transform:translateX(-50%) scaleX(1); opacity:.42;} 50%{transform:translateX(-50%) scaleX(.84); opacity:.24;} }
    @keyframes shadowB { 0%,100%{transform:translateX(-50%) scaleX(1); opacity:.34;} 50%{transform:translateX(-50%) scaleX(.8); opacity:.2;} }

    .stage-glow {
      position: absolute; z-index:-2; width: 420px; height: 420px; border-radius:50%;
      top: 30%; left: 50%; transform: translate(-50%,-50%);
      background: radial-gradient(circle, var(--accent-soft) 0%, transparent 66%);
      filter: blur(24px); animation: glowPulse 8s ease-in-out infinite;
    }

    @media (max-width: 820px) {
      .device-stage { transform: scale(.8); transform-origin: top center; min-height: 470px !important; }
    }

    /* ── Hero ambient grid ── */
    .hero-grid {
      position:absolute; inset:0; pointer-events:none; z-index:0;
      background-image:
        linear-gradient(var(--line) 1px, transparent 1px),
        linear-gradient(90deg, var(--line) 1px, transparent 1px);
      background-size: 64px 64px;
      -webkit-mask-image: radial-gradient(ellipse 70% 60% at 50% 35%, #000 0%, transparent 75%);
      mask-image: radial-gradient(ellipse 70% 60% at 50% 35%, #000 0%, transparent 75%);
      opacity:.6;
    }
    @keyframes glowPulse { 0%,100%{opacity:.5; transform:scale(1);} 50%{opacity:.85; transform:scale(1.06);} }
    .hero-glow {
      position:absolute; z-index:0; pointer-events:none;
      width: 520px; height: 520px; border-radius:50%;
      background: radial-gradient(circle, var(--accent-soft) 0%, transparent 68%);
      filter: blur(20px); animation: glowPulse 7s ease-in-out infinite;
    }

    /* ── Layout helpers ── */
    .wrap { max-width: 1180px; margin: 0 auto; padding-left: 40px; padding-right: 40px; }

    .mobile-menu { display:none; flex-direction:column; gap:5px; cursor:pointer; padding:6px; background:none; border:none; }
    .mobile-menu span { display:block; width:22px; height:1.5px; background: var(--ink); transition: transform .3s, opacity .3s; }

    @media (max-width: 820px) {
      .mobile-menu { display:flex; }
      .desktop-nav { display:none !important; }
      .wrap { padding-left: 22px; padding-right: 22px; }
      .grid-2 { grid-template-columns: 1fr !important; gap: 48px !important; }
      .meta-row { gap: 28px !important; }
      .process-row { grid-template-columns: 1fr !important; gap: 8px !important; }
      .exp-row { grid-template-columns: 1fr !important; gap: 6px !important; }
      .cs-2col { grid-template-columns: 1fr !important; }
      .hero-showcase { grid-template-columns: 1fr !important; }
      .about-portrait { position: static !important; }
      .strength-grid { grid-template-columns: 1fr !important; }
    }

    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after { animation: none !important; transition: none !important; }
      html { scroll-behavior: auto; }
    }
  `}</style>
);

/* ─────────────────────────────────────────────
   DATA — real résumé content
───────────────────────────────────────────── */
const PROFILE = {
  name: "Prangshat Khamwiset",
  nick: "Maprang",
  title: "Product Designer",
  tagline: "Transforming complex business systems into intuitive digital experiences.",
  email: "prangshat@gmail.com",
  tel: "062-963-9240",
  portfolio: "t.ly/NHZbw",
  linkedin: "linkedin.com/in/prangshat-khamwiset",
  resume: "/Resume_Prangshat_2026.pdf",
  location: "Bangkok, Thailand",
};

const STATS = [
  { n: "5+", l: "Years designing" },
  { n: "4", l: "Industries" },
  { n: "M+", l: "Users reached" },
];

const CASE_MEDIA = {
  "newpawn_assetlist": { src: "/assets/newpawn_assetlist.jpg", ar: 1.7333 },
  "easysmart_outlet": { src: "/assets/easysmart_outlet.jpg", ar: 0.4644 },
  "mymo_home_edit": { src: "/assets/mymo_home_edit.jpg", ar: 0.4643 },
  "mymo_splash_edit": { src: "/assets/mymo_splash_edit.jpg", ar: 0.4643 },
  "myfund_before_01": { src: "/assets/myfund_before_01.jpg", ar: 0.4622 },
  "myfund_before_02": { src: "/assets/myfund_before_02.jpg", ar: 0.4622 },
  "myfund_after_01": { src: "/assets/myfund_after_01.jpg", ar: 0.4622 },
  "myfund_after_02": { src: "/assets/myfund_after_02.jpg", ar: 0.4626 },
  "hl_01": { src: "/assets/hl_01.jpg", ar: 0.4622 },
  "hl_02": { src: "/assets/hl_02.jpg", ar: 0.4622 },
  "hl_03": { src: "/assets/hl_03.jpg", ar: 0.4622 },
  "hl_04": { src: "/assets/hl_04.jpg", ar: 0.4622 },
  "hl_05": { src: "/assets/hl_05.jpg", ar: 0.4622 },
  "easysmart_ui_outlet": { src: "/assets/easysmart_ui_outlet.jpg", ar: 0.4622 },
  "easysmart_ui_detail": { src: "/assets/easysmart_ui_detail.jpg", ar: 0.2664 },
  "myfund_before_03": { src: "/assets/myfund_before_03.jpg", ar: 0.4622 },
};

const CASE_STUDIES = [
  {
    id: "easy-smart",
    index: "01",
    title: "Easy Smart Ecosystem",
    subtitle: "Designing a connected pawnshop ecosystem that bridges branch operations, customer self-service, and online commerce.",
    preview: "Connecting branch operations, customer self-service, and online commerce.",
    company: "Tungthanasin Co., Ltd.",
    year: "2024 — Present",
    role: "Product Designer",
    hero: "easy-smart",
    tags: ["Product Strategy", "Service Design", "Systems Thinking", "UX Architecture"],
    detailTitle: "Designing an End-to-End Pawnshop Ecosystem",
    detailSubtitle: "Connecting branch operations, customer self-service, and online asset sales through a unified digital experience.",
    overview: [
      "Easy Smart Ecosystem supports the complete lifecycle of pawned assets.",
      "Customers begin their journey at a branch where staff use the New Pawn Shop System to appraise assets, verify identities, and create pawn tickets.",
      "After the transaction is completed, customers can continue managing their assets through the Easy Smart mobile application.",
      "They can track pawn tickets, pay interest, increase principal, repay principal, and review transaction history.",
      "If assets are not redeemed before the due date, eligible items become available through Easy Outlet, the marketplace integrated within the ecosystem.",
      "The result is a connected service experience spanning branch operations, mobile self-service, and online commerce.",
    ],
    responsibilities: ["UX Strategy", "Service Design", "User Flow Design", "Information Architecture", "UI Design", "Design System", "Stakeholder Collaboration", "Developer Handoff"],
    ecosystemFlow: true,
    challenge: "Traditional pawnshop services relied heavily on branch visits and manual processes. Customers had limited visibility into their transactions while staff operated across disconnected workflows and systems.",
    constraints: ["Legacy operational processes", "Existing backend limitations", "Financial compliance requirements", "Multiple stakeholder expectations"],
    solution: [
      { group: "New Pawn Shop System", note: "Supporting branch operations", items: ["Asset Appraisal", "Customer Verification", "Ticket Creation", "Redemption Management", "AI-Assisted Asset Registration"] },
      { group: "Easy Smart Mobile App", note: "Supporting customer self-service", items: ["Pawn Ticket Tracking", "Interest Payment", "Principal Top-up", "Principal Repayment", "Transaction History", "Easy Outlet Marketplace"] },
    ],
    impact: [
      { group: "Customer Experience", items: ["Improved transaction visibility", "Increased self-service adoption", "Reduced dependency on branch visits"] },
      { group: "Business Operations", items: ["Streamlined operational workflows", "Reduced manual processes", "Improved asset lifecycle management"] },
    ],
  },
  {
    id: "mymo",
    index: "02",
    title: "MyMo",
    subtitle: "Simplifying financial services for millions of users.",
    preview: "Designing financial products that simplify banking and investment experiences.",
    company: "TN Digital Solution · GSB",
    year: "2023 — 2024",
    role: "UX/UI Designer",
    hero: "mymo",
    tags: ["Financial Product Design", "User Experience Design", "Information Architecture", "Design System"],
    detailTitle: "MyMo",
    detailSubtitle: "Simplifying financial services for millions of users.",
    overview: [
      "I conceptualised and developed new features, enhancing the original design to improve usability.",
      "In alignment with the established Design System, I also contributed to the design of various other products under the GSB brand.",
    ],
    responsibilities: ["User Experience Design", "Information Architecture", "User Flow Design", "UI Design", "Design System Alignment", "Developer Handoff"],
  },
];

const EXPERIENCE = [
  {
    co: "Tungthanasin Co., Ltd.",
    role: "UX/UI Designer (Outsource)",
    period: "Nov 2024 — Present",
    industry: "Pawnshop services",
    desc: "Led end-to-end UX/UI for the pawnshop management system and the Easy Smart mobile app. Designed flows and interfaces to improve operational efficiency across internal workflows, working with stakeholders and developers from concept to delivery.",
    tags: ["Easy Smart", "Pawnshop Management", "Easy Outlet"],
  },
  {
    co: "TN Digital Solution",
    role: "UX/UI Designer (Contract)",
    period: "Nov 2023 — Aug 2024",
    industry: "Mobile banking",
    desc: "Designed and improved UX/UI for the MyMo by GSB mobile banking app. Delivered new features and redesigns from wireframe to high-fidelity UI, partnering with business analysts and developers to align requirements with implementation.",
    tags: ["GSB MyMo", "Fintech"],
  },
  {
    co: "LivingInsider",
    role: "UX/UI Designer (Permanent)",
    period: "Jan 2022 — Aug 2023",
    industry: "Real-estate marketplace",
    desc: "Designed marketplace and communication experiences for the LivingStock and LivingOneChat products. Worked cross-functionally with developers and the Product Owner to turn business requirements into digital solutions, from ideation through implementation.",
    tags: ["Marketplace", "Communication"],
  },
  {
    co: "Naresuan University",
    role: "Research Assistant (Contract)",
    period: "Jun 2020 — Dec 2021",
    industry: "Telemedicine · software",
    desc: "Designed UI for a telemedicine software platform supporting healthcare initiatives, and produced digital and promotional media assets for project communications.",
    tags: ["Telemedicine", "Healthcare"],
  },
];

const SKILLS = [
  { cat: "Design", items: ["Product Design", "UX Strategy", "Interaction Design", "UI / Visual Design", "Design Systems"] },
  { cat: "Methods", items: ["User Research", "Usability Testing", "User Flow Design", "Information Architecture", "Requirement Gathering"] },
  { cat: "Craft", items: ["Wireframing", "Prototyping", "Stakeholder Management", "Cross-functional Collab", "Journey Mapping"] },
  { cat: "Tools", items: ["Figma", "FigJam", "Adobe Creative Suite", "Mobile (iOS & Android)", "Web Applications"] },
];

const CERTS = [
  "Psychology and UX — Skoodio (Apr 2022)",
  "Chimnovate Hackathon 2022",
  "UI Bootcamp — Upskill UX (Nov 2021)",
];

/* ─────────────────────────────────────────────
   HOOKS
───────────────────────────────────────────── */
function useScrollReveal(dep) {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal:not(.visible)");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); }
      }),
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [dep]);
}

function useScrolled() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return scrolled;
}

/* ─────────────────────────────────────────────
   NAV
───────────────────────────────────────────── */
function Nav({ page, go }) {
  const scrolled = useScrolled();
  const [open, setOpen] = useState(false);
  const links = [
    { label: "About", p: "about" },
    { label: "Work", p: "home" },
    { label: "Contact", p: "contact" },
  ];
  const nav = (p) => { go(p); setOpen(false); };

  return (
    <header
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        transition: "border-color .3s, backdrop-filter .3s, background .3s",
        background: scrolled ? "color-mix(in srgb, var(--bg) 82%, transparent)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid var(--line)" : "1px solid transparent",
      }}
    >
      <div className="wrap" style={{ height: 70, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button onClick={() => nav("home")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ width: 9, height: 9, background: "var(--grad)", borderRadius: 2, display: "inline-block" }} />
          <span className="font-display" style={{ fontSize: 17, fontWeight: 600, color: "var(--ink)", letterSpacing: "-0.02em" }}>
            Portfolio<span style={{ color: "var(--ink-muted)", fontWeight: 400 }}>.</span>
          </span>
        </button>

        <nav className="desktop-nav" style={{ display: "flex", gap: 30, alignItems: "center" }}>
          {links.map(({ label, p }) => (
            <button key={p} onClick={() => nav(p)} className={`nav-link hover-line${page === p ? " grad-text" : ""}`}
              style={{ color: page === p ? undefined : "var(--ink-soft)" }}>
              {label}
            </button>
          ))}
          <button className="btn btn-fill" onClick={() => nav("contact")} style={{ padding: "9px 16px" }}>
            Let's Connect
          </button>
        </nav>

        <button className="mobile-menu" onClick={() => setOpen(!open)} aria-label="Menu">
          <span style={{ transform: open ? "rotate(45deg) translateY(6px)" : "none" }} />
          <span style={{ opacity: open ? 0 : 1 }} />
          <span style={{ transform: open ? "rotate(-45deg) translateY(-6px)" : "none" }} />
        </button>
      </div>

      {open && (
        <div style={{ background: "var(--bg)", borderTop: "1px solid var(--line)", padding: "22px 22px 30px", display: "flex", flexDirection: "column", gap: 4 }}>
          {links.map(({ label, p }) => (
            <button key={p} onClick={() => nav(p)} className={page === p ? "grad-text" : ""} style={{ background: "none", border: "none", textAlign: "left", padding: "12px 0", fontSize: 26, fontFamily: "'Inter Tight', sans-serif", fontWeight: 500, color: page === p ? undefined : "var(--ink)", cursor: "pointer" }}>
              {label}
            </button>
          ))}
          <div style={{ display: "flex", gap: 12, marginTop: 16, alignItems: "center" }}>
            <button className="btn btn-fill" onClick={() => nav("contact")}>Let's Connect</button>
          </div>
        </div>
      )}
    </header>
  );
}

/* ─────────────────────────────────────────────
   SECTION HEADER
───────────────────────────────────────────── */
function SectionHead({ kicker, title, em, right }) {
  return (
    <div className="reveal" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16, marginBottom: 44 }}>
      <div>
        <span className="eyebrow">{kicker}</span>
        <h2 className="font-display" style={{ fontSize: "clamp(28px,4.2vw,46px)", fontWeight: 600, letterSpacing: "-0.025em", marginTop: 14, lineHeight: 1.08 }}>
          {title}{em && <em style={{ fontStyle: "italic", fontWeight: 400, color: "var(--ink-soft)" }}> {em}</em>}
        </h2>
      </div>
      {right && <span className="font-mono" style={{ fontSize: 12, color: "var(--ink-muted)" }}>{right}</span>}
    </div>
  );
}

/* ─────────────────────────────────────────────
   HOME
───────────────────────────────────────────── */
function HomePage({ go, openCase }) {
  useScrollReveal("home");
  return (
    <main style={{ paddingTop: 70 }}>
      {/* HERO */}
      <section style={{ position: "relative", overflow: "hidden" }}>
        <div className="hero-grid" />
        <div className="hero-glow" style={{ top: -120, left: "50%", transform: "translateX(-50%)" }} />
        <div className="wrap" style={{ position: "relative", zIndex: 1, padding: "104px 40px 96px" }}>
          <div className="anim-up d1" style={{ marginBottom: 26 }}>
            <span className="eyebrow">{PROFILE.title} · {PROFILE.location}</span>
          </div>
          <h1 className="font-display anim-up d2" style={{ fontSize: "clamp(40px,7.4vw,96px)", fontWeight: 600, lineHeight: 1.0, letterSpacing: "-0.035em", maxWidth: 1000 }}>
            Prangshat<br />Khamwiset
          </h1>
          <div className="anim-up d3" style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 22 }}>
            <p style={{ fontSize: 18, fontWeight: 300, color: "var(--ink-soft)", lineHeight: 1.7, maxWidth: 600 }}>
              Product Designer with 5 years of experience designing digital products across Banking,
              Financial Services, Marketplace, and Enterprise platforms.
            </p>
            <p style={{ fontSize: 18, fontWeight: 300, color: "var(--ink-soft)", lineHeight: 1.7, maxWidth: 600 }}>
              I transform complex business requirements into <em className="grad-text" style={{ fontStyle: "italic", fontWeight: 400 }}>intuitive digital experiences</em> that
              help users complete critical tasks with confidence.
            </p>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 10 }}>
              <button className="btn btn-fill" onClick={() => document.getElementById("work")?.scrollIntoView({ behavior: "smooth" })}>
                View Case Studies <span>↓</span>
              </button>
              <a className="btn btn-ghost" href={PROFILE.resume} download="Resume_Prangshat_2026.pdf">Download Resume</a>
            </div>
          </div>

          {/* Stats */}
          <div className="anim-up d4" style={{ display: "flex", gap: 44, marginTop: 76, paddingTop: 40, borderTop: "1px solid var(--line)", flexWrap: "wrap" }}>
            {STATS.map(({ n, l }) => (
              <div key={l}>
                <div className="font-display grad-text" style={{ fontSize: 34, fontWeight: 600, letterSpacing: "-0.03em", display: "inline-block" }}>{n}</div>
                <div className="font-mono" style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink-muted)", marginTop: 6 }}>{l}</div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* WORK */}
      <section id="work" className="wrap" style={{ padding: "92px 40px 40px" }}>
        <SectionHead kicker="Selected Work" title="Case studies" right="2022 — present" />
      </section>
      <div className="wrap" style={{ borderTop: "1px solid var(--line)", paddingLeft: 40, paddingRight: 40 }}>
        {CASE_STUDIES.map((cs) => (
          <div key={cs.id} className="work-row reveal" style={{ borderBottom: "1px solid var(--line)", cursor: "pointer" }} onClick={() => openCase(cs)}>
            <div className="cs-grid">
              <span className="font-mono idx grad-text" style={{ fontSize: 13 }}>{cs.index}</span>
              <div className="cs-body">
                <h3 className="font-display" style={{ fontSize: "clamp(20px,3vw,30px)", fontWeight: 500, letterSpacing: "-0.02em" }}>{cs.title}</h3>
                <p style={{ fontSize: 14.5, color: "var(--ink-soft)", marginTop: 6, lineHeight: 1.5 }}>{cs.subtitle}</p>
                <p style={{ fontSize: 13.5, color: "var(--ink-muted)", marginTop: 8, lineHeight: 1.6 }}>{cs.preview}</p>
                <div className="font-mono" style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink-muted)", marginTop: 14 }}>
                  Role · <span style={{ color: "var(--ink-soft)" }}>{cs.role}</span>
                </div>
              </div>
              <div className="cs-tags">
                {cs.tags.map((t) => <span className="tag" key={t}>{t}</span>)}
              </div>
              <div className="arrow" style={{ fontSize: 22 }}>→</div>
            </div>
          </div>
        ))}
      </div>

      {/* ABOUT SNIPPET */}
      <section className="wrap grid-2" style={{ padding: "104px 40px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 72, alignItems: "center" }}>
        <div className="reveal">
          <span className="eyebrow">About</span>
          <h2 className="font-display" style={{ fontSize: "clamp(26px,3.6vw,42px)", fontWeight: 600, letterSpacing: "-0.025em", lineHeight: 1.14, marginTop: 14, marginBottom: 22 }}>
            I turn complex business<br />requirements into <em style={{ fontStyle: "italic", fontWeight: 400, color: "var(--ink-soft)" }}>intuitive experiences.</em>
          </h2>
          <p style={{ fontSize: 16, fontWeight: 300, color: "var(--ink-soft)", lineHeight: 1.8, marginBottom: 18 }}>
            I'm a Product Designer with 5 years of experience creating digital products across financial
            services, banking, marketplace, and enterprise platforms.
          </p>
          <p style={{ fontSize: 16, fontWeight: 300, color: "var(--ink-soft)", lineHeight: 1.8, marginBottom: 30 }}>
            My work balances customer needs, operational efficiency, and business goals — through systems
            thinking, service design, and cross-functional collaboration.
          </p>
          <button className="btn btn-ghost" onClick={() => go("about")}>Read full story →</button>
        </div>
        <div className="portrait reveal">
          <img src={PORTRAIT} alt="Prangshat Khamwiset" loading="lazy" />
          <div className="caption">
            <span className="cap-name">Prangshat Khamwiset</span>
            <span className="cap-loc">BKK · GMT+7</span>
          </div>
        </div>
      </section>

      {/* CONTACT CTA */}
      <section className="wrap" style={{ padding: "118px 40px", textAlign: "center", borderTop: "1px solid var(--line)" }}>
        <div className="reveal" style={{ maxWidth: 660, margin: "0 auto" }}>
          <span className="eyebrow" style={{ justifyContent: "center", display: "inline-flex" }}>Contact</span>
          <h2 className="font-display grad-text" style={{ fontSize: "clamp(34px,6vw,66px)", fontWeight: 600, letterSpacing: "-0.035em", lineHeight: 1.04, marginTop: 18, marginBottom: 26 }}>
            Let's Build Better Products
          </h2>
          <p style={{ fontSize: 17, fontWeight: 300, color: "var(--ink-soft)", lineHeight: 1.7, marginBottom: 36 }}>
            Interested in product design, UX strategy, or digital transformation projects? Let's connect.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <button className="btn btn-fill" onClick={() => go("contact")}>Get in touch →</button>
            <a className="btn btn-ghost" href={PROFILE.resume} download="Resume_Prangshat_2026.pdf">Download Resume</a>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ─────────────────────────────────────────────
   PRODUCT SHOWCASE HEROES (Apple-style)
───────────────────────────────────────────── */
function EasySmartVisual() {
  const D = CASE_MEDIA.newpawn_assetlist;
  const M = CASE_MEDIA.easysmart_outlet;
  return (
    <div className="ps-stage hero hero-in" style={{ width: "92%", margin: "0 auto", position: "relative" }}>
      {/* Desktop mockup — primary, rendered at natural ratio; defines section height */}
      <div style={{ position: "relative", width: "88%", zIndex: 1 }}>
        <div className="ps-screen">
          <img src={D.src} alt="New Pawn Shop System — redemption asset list" loading="lazy" decoding="async" />
        </div>
      </div>
      {/* Mobile mockup — supporting, reaches the right edge so the composition fills the width */}
      <div style={{ position: "absolute", right: "0%", bottom: "-2%", width: "23%", zIndex: 3 }}>
        <div className="ps-phone">
          <img src={M.src} alt="Easy Smart — home & Easy Outlet marketplace" loading="lazy" decoding="async" />
        </div>
      </div>
    </div>
  );
}

function MyMoVisual() {
  const B = CASE_MEDIA.mymo_splash_edit;
  const F = CASE_MEDIA.mymo_home_edit;
  return (
    <div className="ps-stage hero hero-in mymo-hero" style={{ width: "88%", margin: "0 auto", position: "relative" }}>
      {/* Splash — supporting device, sits partially behind and is staggered downward */}
      <div style={{ position: "absolute", left: "2%", top: "8%", width: "51%", zIndex: 1 }}>
        <div className="ps-phone">
          <img src={B.src} alt="MyMo — welcome splash screen" loading="lazy" decoding="async" />
        </div>
      </div>
      {/* Home — primary device in front; overlaps the splash by ~26% to read as one composition */}
      <div style={{ position: "relative", width: "58%", marginLeft: "38%", zIndex: 3 }}>
        <div className="ps-phone">
          <img src={F.src} alt="MyMo — home dashboard" loading="lazy" decoding="async" />
        </div>
      </div>
    </div>
  );
}

const Cap = ({ children }) => (
  <div className="font-mono" style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-muted)", marginBottom: 6 }}>{children}</div>
);

function CaseHero({ cs, go, visual }) {
  return (
    <div style={{ position: "relative", overflow: "hidden", borderBottom: "1px solid var(--line)" }}>
      <div className="hero-grid" />
      <div className="wrap" style={{ position: "relative", zIndex: 1, paddingTop: 52, paddingBottom: 40 }}>
        <button onClick={() => go("home")} className="nav-link anim-in" style={{ marginBottom: 30 }}>← All work</button>
        <div className="anim-up d1 font-mono" style={{ fontSize: 13, marginBottom: 14 }}>
          <span className="grad-text" style={{ fontWeight: 600 }}>{cs.index}</span>
          <span style={{ color: "var(--ink-muted)" }}> / {cs.company}</span>
        </div>
        <h1 className="font-display anim-up d2" style={{ fontSize: "clamp(34px,4.6vw,62px)", fontWeight: 600, letterSpacing: "-0.04em", lineHeight: 1.04, maxWidth: 760 }}>{cs.detailTitle || cs.title}</h1>
        <p className="anim-up d3" style={{ fontSize: 17, fontWeight: 300, color: "var(--ink-soft)", lineHeight: 1.6, marginTop: 18, maxWidth: 620 }}>{cs.detailSubtitle || cs.subtitle}</p>
        <div className="anim-up d4" style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 26 }}>
          {cs.tags.map((t) => <span key={t} className="tag grad-text">{t}</span>)}
        </div>
        <div className="anim-up d5" style={{ display: "flex", gap: 44, marginTop: 30, paddingTop: 24, borderTop: "1px solid var(--line)" }}>
          <div><Cap>Role</Cap><div style={{ fontSize: 14, color: "var(--ink)" }}>{cs.role}</div></div>
          <div><Cap>Timeline</Cap><div style={{ fontSize: 14, color: "var(--ink)" }}>{cs.year}</div></div>
        </div>
      </div>
      {/* Wide, centered product showcase — the image defines the section size */}
      <div style={{ position: "relative", zIndex: 1, padding: "8px clamp(16px,4vw,40px) 88px" }}>
        <div className={cs.id === "easy-smart" ? "es-hero-shot" : undefined} style={{ width: "50%", margin: "0 auto", minWidth: "min(100%, 220px)" }}>
          {visual}
        </div>
      </div>
    </div>
  );
}

function useInView(threshold = 0.18) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

/* Reveal-on-view plain image — slide/fade from bottom (Framer-style via project's useInView) */
function RevealImage({ src, alt, y = 40, radius = 24, style }) {
  const [ref, inView] = useInView(0.2);
  return (
    <img
      ref={ref}
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      style={{
        display: "block",
        width: "100%",
        height: "auto",
        borderRadius: radius,
        border: "1px solid #D9D9D9",
        overflow: "hidden",
        background: "white",
        boxShadow: "none",
        objectFit: "contain",
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : `translateY(${y}px)`,
        transition: "opacity 0.7s ease-out, transform 0.7s ease-out",
        ...style,
      }}
    />
  );
}

function EcoIcon({ name }) {
  const p = { width: 22, height: 22, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" };
  switch (name) {
    case "user":   return <svg {...p}><circle cx="12" cy="8" r="3.4" /><path d="M5.5 19.5a6.5 6.5 0 0 1 13 0" /></svg>;
    case "store":  return <svg {...p}><path d="M3.6 9 5 4.6h14L20.4 9" /><path d="M5 9v10.4h14V9" /><path d="M9.6 19.4v-4.8h4.8v4.8" /></svg>;
    case "mobile": return <svg {...p}><rect x="7" y="3" width="10" height="18" rx="2.4" /><path d="M11 17.8h2" /></svg>;
    case "coins":  return <svg {...p}><circle cx="12" cy="12" r="8.2" /><path d="M12 7.4v9.2M9.7 9.6h3.5a1.7 1.7 0 0 1 0 3.4h-2.4a1.7 1.7 0 0 0 0 3.4h3.5" /></svg>;
    case "unlock": return <svg {...p}><rect x="5" y="11" width="14" height="9" rx="2.2" /><path d="M8 11V8a4 4 0 0 1 7.6-1.8" /></svg>;
    case "clock":  return <svg {...p}><circle cx="12" cy="12" r="8.2" /><path d="M12 7.6V12l3 2" /></svg>;
    case "bag":    return <svg {...p}><path d="M6 8h12l-1 12.2H7L6 8z" /><path d="M9 8V6.6a3 3 0 0 1 6 0V8" /></svg>;
    case "check":  return <svg {...p}><circle cx="12" cy="12" r="8.2" /><path d="M8.5 12.3l2.4 2.3 4.6-5" /></svg>;
    default:       return null;
  }
}

function EcosystemFlow({ data }) {
  const [ref, inView] = useInView(0.16);
  const nodes = [
    { icon: "user",   title: "Customer",                    desc: "Brings an asset to a branch." },
    { icon: "store",  title: "New Pawn Shop System",        desc: "Appraisal, verification & ticket creation.", core: true },
    { icon: "mobile", title: "Easy Smart",                  desc: "Self-service ticket & payment management.",  core: true },
    { or: true,       title: "Pay Interest / Redeem",       desc: "Continue interest — or reclaim the asset." },
    { icon: "clock",  title: "No Transaction Before Due",   desc: "Asset becomes eligible for resale." },
    { icon: "bag",    title: "Easy Outlet Marketplace",     desc: "Listed for online resale.",                  core: true },
    { icon: "check",  title: "Asset Sold Online",           desc: "Lifecycle complete.",                        final: true },
  ];

  return (
    <div className={`eco-section${inView ? " eco-in" : ""}`} ref={ref}>
      <div className="eco-bg" aria-hidden="true">
        <div className="eco-grid" />
        <div className="eco-glow" />
        <svg className="eco-nodes" viewBox="0 0 1200 420" preserveAspectRatio="xMidYMid slice">
          <g stroke="rgba(255,255,255,0.10)" strokeWidth="1" fill="none">
            <path d="M120 300 L320 120 L560 260 L820 90 L1040 230" />
            <path d="M200 372 L460 300 L760 344 L980 296" />
          </g>
          <g fill="rgba(238,9,121,0.22)">
            <circle cx="120" cy="300" r="3.4" /><circle cx="320" cy="120" r="3.4" /><circle cx="560" cy="260" r="3.4" />
            <circle cx="820" cy="90" r="3.4" /><circle cx="1040" cy="230" r="3.4" /><circle cx="460" cy="300" r="2.8" />
            <circle cx="760" cy="344" r="2.8" /><circle cx="980" cy="296" r="2.8" />
          </g>
        </svg>
      </div>

      <div className="wrap" style={{ position: "relative", zIndex: 1, padding: "96px 40px" }}>
        <div className="eco-head" style={{ textAlign: "center", maxWidth: 640, margin: "0 auto 58px" }}>
          <div style={{ display: "flex", justifyContent: "center" }}><span className="eyebrow">Ecosystem</span></div>
          <h2 className="font-display" style={{ fontSize: "clamp(30px,5vw,56px)", fontWeight: 600, letterSpacing: "-0.03em", marginTop: 14, lineHeight: 1.05 }}>
            From Appraisal <span className="grad-text">to Marketplace</span>
          </h2>
          <p style={{ fontSize: 16, fontWeight: 300, color: "var(--ink-soft)", lineHeight: 1.7, marginTop: 18 }}>
            Designing a connected ecosystem that manages the complete lifecycle of pawned assets.
          </p>
        </div>

        <div className="eco-track">
          {nodes.map((n, i) => (
            <Fragment key={i}>
              <div
                className={`eco-card${n.core ? " eco-core" : ""}${n.final ? " eco-final" : ""}`}
                style={{ transitionDelay: inView ? `${120 + i * 90}ms` : "0ms" }}
              >
                {n.core && <span className="eco-badge">Core Platform</span>}
                <span className="eco-ic">
                  {n.or
                    ? <span className="eco-or"><EcoIcon name="coins" /><span>or</span><EcoIcon name="unlock" /></span>
                    : <EcoIcon name={n.icon} />}
                </span>
                <div className="eco-title font-display">{n.title}</div>
                <div className="eco-desc">{n.desc}</div>
              </div>
              {i < nodes.length - 1 && (
                <div className="eco-line" style={{ transitionDelay: inView ? `${170 + i * 90}ms` : "0ms" }}>
                  <span className="eco-pulse" style={{ animationDelay: `${i * 0.32}s` }} />
                </div>
              )}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

function MyMoBody() {
  const M = CASE_MEDIA;
  const Bullet = ({ ch = "→" }) => <span className="grad-text" style={{ fontWeight: 700, flexShrink: 0 }}>{ch}</span>;
  const P = ({ children, mt = 14 }) => (
    <p style={{ fontSize: 16, fontWeight: 300, color: "var(--ink-soft)", lineHeight: 1.7, marginTop: mt }}>{children}</p>
  );
  // Single reusable screenshot component — every static MyMo image renders through this.
  // Sizing is owned here via the shared --mymo-shot-h height variable (.shot-frame),
  // so all sections share one consistent frame height and device size.
  const Shot = ({ k, alt }) => (
    <RevealImage src={M[k].src} alt={alt} y={40} radius={32} style={{ maxWidth: 300 }} />
  );
  const SecLabel = ({ no, badge, title }) => (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
        <span className="font-mono grad-text" style={{ fontSize: 13, fontWeight: 700 }}>Section {no}</span>
        <span className="font-mono" style={{ fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "#fff", padding: "4px 10px", borderRadius: 999, background: "var(--grad-soft)", border: "1px solid rgba(238,9,121,0.4)" }}>{badge}</span>
      </div>
      <h2 className="font-display" style={{ fontSize: "clamp(28px,4vw,46px)", fontWeight: 600, letterSpacing: "-0.03em", marginTop: 14 }}>{title}</h2>
    </>
  );
  const fundCats = ["Fixed-Income Funds", "Equity Funds", "Mixed Funds", "Foreign Funds", "Tax-Saving Funds"];
  const hlConstraints = ["Banking compliance requirements", "Large active user base", "Limited development timeline", "Existing infrastructure limitations"];
  const hlSolution = ["Plain-language data input", "Eligibility and affordability assessment", "Loan calculation experience", "Clear borrowing results", "Branch appointment booking"];
  const impacts = [
    { n: "01", t: "Simplified Housing Loan Onboarding", b: "Plain-language guidance replaced complex financial terminology and reduced cognitive load." },
    { n: "02", t: "Improved Financial Planning Experience", b: "Clear borrowing estimates and repayment information helped customers make informed decisions." },
    { n: "03", t: "Reduced Complexity of Loan Calculations", b: "Users received one clear result instead of relying on manual calculations and interpretation." },
  ];

  return (
    <>
      {/* SECTION 01 — REDESIGN MYFUND */}
      <div className="wrap" style={{ padding: "74px 40px", borderTop: "1px solid var(--line)" }}>
        <SecLabel no="01" badge="Product Redesign" title="Redesign MyFund" />
        <div className="cs-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "start", marginTop: 40 }}>
          <div>
            <span className="eyebrow">Overview</span>
            <P>MyFund is a feature within MyMo that helps customers discover, monitor, and manage investment funds.</P>
            <P>The redesign focused on improving information clarity and making fund navigation easier as the number of available funds continued to grow.</P>
            <div style={{ marginTop: 30 }}>
              <span className="eyebrow">Problem</span>
              <P>The original model used color coding to represent fund names, which worked well when there were only a few funds and a limited palette of colors.</P>
              <P>But with the number of funds now exceeding ten, the need for additional colors led to similar shades being reused — making it increasingly difficult for customers to distinguish between funds.</P>
            </div>
          </div>
          <div>
            <span className="eyebrow">Solution</span>
            <P mt={14}>To improve clarity and scalability:</P>
            <div className="font-mono" style={{ fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--ink-muted)", margin: "22px 0 12px" }}>Funds reorganized into five categories</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {fundCats.map((c) => <span key={c} className="tag">{c}</span>)}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 22 }}>
              <div style={{ display: "flex", gap: 11, alignItems: "baseline", fontSize: 15, color: "var(--ink-soft)", fontWeight: 300 }}><Bullet />Each category was assigned a dedicated color system based on fund type rather than individual fund names.</div>
              <div style={{ display: "flex", gap: 11, alignItems: "baseline", fontSize: 15, color: "var(--ink-soft)", fontWeight: 300 }}><Bullet />Existing screens were redesigned to simplify navigation and create a more intuitive investment experience.</div>
            </div>
          </div>
        </div>
      </div>

      {/* BEFORE & AFTER */}
      <div style={{ background: "var(--bg-2)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
        <div className="wrap" style={{ padding: "82px 40px" }}>
          <span className="eyebrow">Comparison</span>
          <h3 className="font-display" style={{ fontSize: "clamp(26px,4vw,40px)", fontWeight: 600, letterSpacing: "-0.03em", marginTop: 14 }}>Before &amp; After</h3>
          <p style={{ fontSize: 16, fontWeight: 300, color: "var(--ink-soft)", lineHeight: 1.7, marginTop: 14, maxWidth: 620, marginBottom: 46 }}>
            A redesign focused on improving fund categorization, visual clarity, and investment portfolio readability.
          </p>
          <div className="mf-head" style={{ marginBottom: 18 }}>Before</div>
          <div className="mymo-gallery cols-3">
            <Shot k="myfund_before_01" alt="MyFund before redesign — portfolio overview" />
            <Shot k="myfund_before_02" alt="MyFund before redesign — fund list" />
            <Shot k="myfund_before_03" alt="MyFund before redesign — fund detail" />
          </div>
          <div className="mf-head mf-after" style={{ margin: "44px 0 18px" }}>After</div>
          <div className="mymo-gallery cols-2">
            <Shot k="myfund_after_01" alt="MyFund after redesign — categorized portfolio" />
            <Shot k="myfund_after_02" alt="MyFund after redesign — fund detail" />
          </div>
        </div>
      </div>

      {/* SECTION 02 — HOUSING LOAN */}
      <div className="wrap" style={{ padding: "74px 40px", borderTop: "1px solid var(--line)" }}>
        <SecLabel no="02" badge="New Feature" title="MyMo Housing Loan" />
        <p className="font-display" style={{ fontSize: "clamp(18px,2.4vw,24px)", fontWeight: 400, fontStyle: "italic", color: "var(--ink-soft)", lineHeight: 1.5, marginTop: 12 }}>
          Simplifying housing-loan onboarding inside a national banking app.
        </p>
        <div className="cs-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "start", marginTop: 38 }}>
          <div>
            <span className="eyebrow">Overview</span>
            <P>MyMo by GSB is one of Thailand's most widely used mobile banking applications.</P>
            <P>I designed the housing-loan journey from eligibility assessment through appointment booking, helping customers better understand their borrowing potential before visiting a branch.</P>
            <P>The solution was designed for a broad audience with varying levels of digital confidence.</P>
            <div style={{ marginTop: 30 }}>
              <span className="eyebrow">Problem</span>
              <P>Housing-loan onboarding required first-time borrowers to understand complex financial information before receiving any meaningful result.</P>
              <P>At national scale, even small usability issues created confusion, increased customer stress, and generated unnecessary call-centre inquiries.</P>
            </div>
          </div>
          <div>
            <span className="eyebrow">Constraints</span>
            <P mt={14}>Designing within a live banking environment meant balancing customer needs with operational and technical constraints.</P>
            <div style={{ marginTop: 14 }}>
              {hlConstraints.map((c) => (
                <div key={c} style={{ display: "flex", gap: 12, alignItems: "baseline", padding: "11px 0", borderBottom: "1px solid var(--line)", fontSize: 15, color: "var(--ink-soft)", fontWeight: 300 }}><Bullet ch="—" />{c}</div>
              ))}
            </div>
            <div style={{ marginTop: 30 }}>
              <span className="eyebrow">Solution</span>
              <P mt={14}>A guided housing-loan experience built directly within the MyMo ecosystem. The journey included:</P>
              <div style={{ display: "flex", flexDirection: "column", gap: 11, marginTop: 14 }}>
                {hlSolution.map((it) => (
                  <div key={it} style={{ display: "flex", gap: 11, alignItems: "baseline", fontSize: 15, color: "var(--ink-soft)", fontWeight: 300 }}><Bullet />{it}</div>
                ))}
              </div>
              <p className="font-mono" style={{ fontSize: 12, color: "var(--ink-muted)", lineHeight: 1.6, marginTop: 18 }}>
                Built using the existing GSB Design System to ensure consistency and scalability.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* UI SHOWCASE */}
      <div style={{ background: "var(--bg-2)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
        <div className="wrap" style={{ padding: "82px 40px" }}>
          <span className="eyebrow">UI Showcase</span>
          <h3 className="font-display" style={{ fontSize: "clamp(26px,4vw,40px)", fontWeight: 600, letterSpacing: "-0.03em", marginTop: 14, marginBottom: 8 }}>Housing-loan journey</h3>

          <div style={{ marginTop: 40 }}>
            <div className="font-mono grad-text" style={{ fontSize: 12, letterSpacing: "0.12em", fontWeight: 700, display: "inline-block" }}>Stage 01</div>
            <h4 className="font-display" style={{ fontSize: 21, fontWeight: 600, letterSpacing: "-0.015em", marginTop: 6 }}>Pre-screen &amp; Appointment</h4>
            <p style={{ fontSize: 14.5, fontWeight: 300, color: "var(--ink-soft)", lineHeight: 1.6, marginTop: 8, maxWidth: 560 }}>
              Helping customers assess eligibility and schedule branch appointments with confidence.
            </p>
            <div className="mymo-gallery cols-3" style={{ marginTop: 24 }}>
              <Shot k="hl_01" alt="Housing loan — eligibility pre-screen" />
              <Shot k="hl_02" alt="Housing loan — information input" />
              <Shot k="hl_03" alt="Housing loan — appointment booking" />
            </div>
          </div>

          <div style={{ marginTop: 60 }}>
            <div className="font-mono grad-text" style={{ fontSize: 12, letterSpacing: "0.12em", fontWeight: 700, display: "inline-block" }}>Stage 02</div>
            <h4 className="font-display" style={{ fontSize: 21, fontWeight: 600, letterSpacing: "-0.015em", marginTop: 6 }}>Loan Calculator &amp; Result</h4>
            <p style={{ fontSize: 14.5, fontWeight: 300, color: "var(--ink-soft)", lineHeight: 1.6, marginTop: 8, maxWidth: 560 }}>
              Providing a clear borrowing estimate and repayment information through a simplified calculation experience.
            </p>
            <div className="mymo-gallery cols-2" style={{ marginTop: 24 }}>
              <Shot k="hl_04" alt="Housing loan — calculator inputs" />
              <Shot k="hl_05" alt="Housing loan — borrowing result" />
            </div>
          </div>
        </div>
      </div>

      {/* IMPACT */}
      <div style={{ background: "var(--invert-bg)", color: "var(--invert-ink)" }}>
        <div className="wrap" style={{ padding: "82px 40px" }}>
          <div style={{ marginBottom: 40 }}>
            <span className="font-mono grad-text" style={{ fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", fontWeight: 600 }}>✦ Impact</span>
            <h2 className="font-display" style={{ fontSize: "clamp(26px,4vw,44px)", fontWeight: 600, letterSpacing: "-0.03em", marginTop: 12 }}>What changed.</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 28 }}>
            {impacts.map((it) => (
              <div key={it.n} style={{ borderTop: "1px solid rgba(255,255,255,0.16)", paddingTop: 20 }}>
                <div className="font-mono grad-text" style={{ fontSize: 13, fontWeight: 700, display: "inline-block", marginBottom: 14 }}>{it.n}</div>
                <h3 className="font-display" style={{ fontSize: 18, fontWeight: 600, letterSpacing: "-0.01em", lineHeight: 1.25, marginBottom: 10 }}>{it.t}</h3>
                <p style={{ fontSize: 14.5, fontWeight: 300, color: "rgba(255,255,255,0.7)", lineHeight: 1.65 }}>{it.b}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────
   CASE STUDY
───────────────────────────────────────────── */
function CaseStudyPage({ cs, go, openCase }) {
  const nextIdx = (CASE_STUDIES.findIndex((c) => c.id === cs.id) + 1) % CASE_STUDIES.length;
  const next = CASE_STUDIES[nextIdx];
  const visual = cs.hero === "easy-smart" ? <EasySmartVisual /> : <MyMoVisual />;
  const sideList = cs.responsibilities
    ? { label: "Responsibilities", items: cs.responsibilities }
    : { label: "Projects", items: cs.projects || [] };

  const Bullet = ({ ch = "→" }) => <span className="grad-text" style={{ fontWeight: 700, flexShrink: 0 }}>{ch}</span>;

  return (
    <main className="cs-static" style={{ paddingTop: 70 }}>
      <CaseHero cs={cs} go={go} visual={visual} />

      {/* OVERVIEW */}
      <div className="wrap grid-2" style={{ padding: "78px 40px", display: "grid", gridTemplateColumns: "1.5fr 0.55fr", gap: 64, alignItems: "start" }}>
        <div>
          <span className="eyebrow">Overview</span>
          {cs.overview.map((para, i) => (
            <p key={i} style={{ fontSize: i === 0 ? 21 : 16, fontWeight: i === 0 ? 400 : 300, color: i === 0 ? "var(--ink)" : "var(--ink-soft)", lineHeight: 1.7, marginTop: i === 0 ? 18 : 14 }}>{para}</p>
          ))}
        </div>
        <div style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 14, padding: "26px 24px" }}>
          <Cap>Role</Cap>
          <div style={{ fontSize: 15, color: "var(--ink)", marginBottom: 22 }}>{cs.role}</div>
          <Cap>{sideList.label}</Cap>
          <div style={{ display: "flex", flexDirection: "column", gap: 9, marginTop: 4 }}>
            {sideList.items.map((it) => (
              <div key={it} style={{ display: "flex", gap: 9, alignItems: "baseline", fontSize: 14, color: "var(--ink-soft)" }}><Bullet />{it}</div>
            ))}
          </div>
        </div>
      </div>

      {/* ECOSYSTEM FLOW */}
      {cs.ecosystemFlow && <EcosystemFlow data={cs.ecosystemFlow} />}

      {/* MYMO — initiatives, showcases & impact */}
      {cs.id === "mymo" && <MyMoBody />}

      {/* CHALLENGE + CONSTRAINTS */}
      {cs.challenge && (
      <div className="wrap grid-2" style={{ padding: "78px 40px", display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 64, alignItems: "start" }}>
        <div>
          <span className="eyebrow">Challenge</span>
          <p className="font-display" style={{ fontSize: "clamp(20px,2.8vw,28px)", fontWeight: 400, fontStyle: "italic", color: "var(--ink)", lineHeight: 1.5, marginTop: 16 }}>{cs.challenge}</p>
        </div>
        <div>
          <span className="eyebrow">Constraints</span>
          <div style={{ marginTop: 16 }}>
            {cs.constraints.map((c) => (
              <div key={c} style={{ display: "flex", gap: 12, alignItems: "baseline", padding: "11px 0", borderBottom: "1px solid var(--line)", fontSize: 15, color: "var(--ink-soft)", fontWeight: 300 }}><Bullet ch="—" />{c}</div>
            ))}
          </div>
        </div>
      </div>
      )}

      {/* SOLUTION */}
      {cs.solution && (
      <div style={{ background: "var(--bg-2)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
        <div className="wrap" style={{ padding: "82px 40px" }}>
          <span className="eyebrow">Solution</span>
          <h2 className="font-display" style={{ fontSize: "clamp(26px,4vw,44px)", fontWeight: 600, letterSpacing: "-0.03em", marginTop: 14, marginBottom: 44 }}>What we shipped.</h2>
          <div className="cs-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            {cs.solution.map((g) => (
              <div key={g.group} style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 14, padding: "30px 28px" }}>
                <h3 className="font-display" style={{ fontSize: 19, fontWeight: 600, letterSpacing: "-0.01em", marginBottom: g.note ? 4 : 18 }}>{g.group}</h3>
                {g.note && <div className="font-mono" style={{ fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--ink-muted)", marginBottom: 18 }}>{g.note}</div>}
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {g.items.map((it) => (
                    <div key={it} style={{ display: "flex", gap: 11, alignItems: "baseline", fontSize: 15, color: "var(--ink-soft)", fontWeight: 300 }}><Bullet />{it}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      )}

      {/* IMPACT */}
      {cs.impact && (
      <div style={{ background: "var(--invert-bg)", color: "var(--invert-ink)" }}>
        <div className="wrap" style={{ padding: "82px 40px" }}>
          <div style={{ marginBottom: 40 }}>
            <span className="font-mono grad-text" style={{ fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", fontWeight: 600 }}>✦ Impact</span>
            <h2 className="font-display" style={{ fontSize: "clamp(26px,4vw,44px)", fontWeight: 600, letterSpacing: "-0.03em", marginTop: 12 }}>What changed.</h2>
          </div>
          <div className="cs-2col" style={{ display: "grid", gridTemplateColumns: cs.impact.length > 1 ? "1fr 1fr" : "1fr", gap: 40 }}>
            {cs.impact.map((g, gi) => (
              <div key={gi}>
                {g.group && <h3 className="font-display" style={{ fontSize: 18, fontWeight: 600, marginBottom: 18 }}>{g.group}</h3>}
                <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                  {g.items.map((it) => (
                    <div key={it} style={{ display: "flex", gap: 13, alignItems: "baseline", padding: "13px 0", borderBottom: "1px solid rgba(255,255,255,0.12)" }}>
                      <span className="grad-text" style={{ fontWeight: 700 }}>✦</span>
                      <span style={{ fontSize: 15.5 }}>{it}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      )}

      {/* UI SHOWCASE — Easy Smart (added) */}
      {cs.id === "easy-smart" && (
        <div style={{ background: "var(--bg-2)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
          <div className="wrap" style={{ padding: "82px 40px" }}>
            <span className="eyebrow">UI Showcase</span>
            <h2 className="font-display" style={{ fontSize: "clamp(26px,4vw,44px)", fontWeight: 600, letterSpacing: "-0.03em", marginTop: 14, marginBottom: 44 }}>Easy Outlet marketplace.</h2>
            <div className="mymo-gallery cols-2" style={{ maxWidth: 760, margin: "0 auto" }}>
              <RevealImage src={CASE_MEDIA.easysmart_ui_outlet.src} alt="Easy Outlet — home page" y={60} style={{ maxWidth: 320 }} />
              <RevealImage src={CASE_MEDIA.easysmart_ui_detail.src} alt="Easy Outlet — product detail" y={60} style={{ maxWidth: 320 }} />
            </div>
          </div>
        </div>
      )}

      {/* NEXT CASE */}
      <div className="wrap" style={{ borderTop: "1px solid var(--line)" }}>
        <div className="work-row" style={{ cursor: "pointer" }} onClick={() => { openCase(next); window.scrollTo({ top: 0 }); }}>
          <div style={{ padding: "44px 0", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
            <div>
              <span className="font-mono" style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-muted)" }}>Next case</span>
              <h3 className="font-display" style={{ fontSize: "clamp(24px,3.6vw,40px)", fontWeight: 600, letterSpacing: "-0.025em", marginTop: 8 }}>{next.title}</h3>
            </div>
            <span className="arrow grad-text" style={{ fontSize: 30 }}>→</span>
          </div>
        </div>
      </div>
    </main>
  );
}

/* ─────────────────────────────────────────────
   ABOUT
───────────────────────────────────────────── */
function AboutPage({ go }) {
  useScrollReveal("about");
  const story = [
    { h: "The story.", b: "I studied Innovative Media Design at Naresuan University, but I found my real craft in the gap between what a business needs and what a user can actually understand. That gap is where product design lives — and it's where I've spent the last five-plus years.\n\nFrom telemedicine to real-estate marketplaces, mobile banking, and pawnshop systems, the through-line is the same: take something tangled and operationally heavy, and make it feel obvious to the person using it." },
    { h: "How I work.", b: "I'm a systems thinker who's comfortable moving between strategy and pixels — a stakeholder conversation in the morning, interaction details in the afternoon. I gather requirements directly, map the journey end-to-end, and design with the constraints of real engineering teams in mind.\n\nI believe great UX is mostly listening: research, synthesis, and testing are where the real design decisions get made. The screens are just the output." },
  ];
  const philosophy = "Design from the business model out, not the screen in. Reduce the complexity before adding anything. Design the whole journey — including the handoffs between screens, channels, and teams. And remember that design only matters when it ships.";
  const industries = [
    "Fintech & mobile banking",
    "Proptech & real-estate marketplaces",
    "Enterprise & internal systems",
    "Pawnshop & financial services",
    "Telemedicine & healthcare",
  ];
  const strengths = [
    { t: "Complexity → simplicity", d: "Finding the simple system hiding inside an operationally heavy one." },
    { t: "End-to-end ownership", d: "From requirement gathering and flows to high-fidelity UI and handoff." },
    { t: "Business fluency", d: "Translating business goals into product decisions, not just visuals." },
    { t: "Cross-functional delivery", d: "Working shoulder-to-shoulder with BAs, POs, and developers to ship." },
  ];
  return (
    <main style={{ paddingTop: 70 }}>
      <div className="wrap" style={{ padding: "64px 40px 52px" }}>
        <div className="anim-up d1"><span className="eyebrow">About</span></div>
        <h1 className="font-display anim-up d2" style={{ fontSize: "clamp(30px,4.4vw,56px)", fontWeight: 600, letterSpacing: "-0.03em", lineHeight: 1.08, maxWidth: 920, marginTop: 14 }}>
          Product Designer with 5+ years designing <em className="grad-text" style={{ fontStyle: "italic", fontWeight: 400 }}>fintech, marketplace, and enterprise</em> products.
        </h1>
      </div>
      <hr className="rule" style={{ margin: "0 40px" }} />

      <div className="wrap grid-2" style={{ padding: "72px 40px", display: "grid", gridTemplateColumns: "0.85fr 1.15fr", gap: 72, alignItems: "start" }}>
        <div className="about-portrait" style={{ position: "sticky", top: 100 }}>
          <div className="portrait reveal">
            <img src={PORTRAIT} alt="Prangshat Khamwiset, Product Designer" loading="lazy" />
            <div className="caption">
              <span className="cap-name">Prangshat Khamwiset</span>
              <span className="cap-loc">Bangkok · GMT+7</span>
            </div>
          </div>
        </div>

        <div>
          {story.map(({ h, b }) => (
            <div className="reveal" key={h} style={{ marginBottom: 44 }}>
              <h3 className="font-display" style={{ fontSize: 21, fontWeight: 600, letterSpacing: "-0.01em", marginBottom: 14 }}>{h}</h3>
              {b.split("\n\n").map((p, i) => (
                <p key={i} style={{ fontSize: 16, fontWeight: 300, color: "var(--ink-soft)", lineHeight: 1.8, marginBottom: 12 }}>{p}</p>
              ))}
            </div>
          ))}

          {/* Design philosophy */}
          <div className="reveal" style={{ marginBottom: 44, paddingLeft: 20, borderLeft: "2px solid var(--accent)" }}>
            <h3 className="font-display" style={{ fontSize: 21, fontWeight: 600, letterSpacing: "-0.01em", marginBottom: 14 }}>Design philosophy.</h3>
            <p className="font-display" style={{ fontSize: 19, fontWeight: 400, fontStyle: "italic", color: "var(--ink)", lineHeight: 1.6 }}>{philosophy}</p>
          </div>

          {/* Industries */}
          <div className="reveal" style={{ marginBottom: 44 }}>
            <h3 className="font-display" style={{ fontSize: 21, fontWeight: 600, letterSpacing: "-0.01em", marginBottom: 16 }}>Industries.</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {industries.map((it) => <span key={it} className="tag">{it}</span>)}
            </div>
          </div>

          {/* Key strengths */}
          <div className="reveal">
            <h3 className="font-display" style={{ fontSize: 21, fontWeight: 600, letterSpacing: "-0.01em", marginBottom: 18 }}>Key strengths.</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: "var(--line)", border: "1px solid var(--line)", borderRadius: 8, overflow: "hidden" }} className="strength-grid">
              {strengths.map((s) => (
                <div key={s.t} style={{ background: "var(--bg)", padding: "20px 20px" }}>
                  <div className="font-mono" style={{ fontSize: 12, color: "var(--accent)", marginBottom: 8 }}>{s.t}</div>
                  <p style={{ fontSize: 14, fontWeight: 300, color: "var(--ink-soft)", lineHeight: 1.6 }}>{s.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CAREER TIMELINE */}
      <div style={{ borderTop: "1px solid var(--line)", background: "var(--bg-deep)" }}>
        <div style={{ maxWidth: 880, margin: "0 auto", padding: "76px 40px" }}>
          <SectionHead kicker="Career timeline" title="Where I've" em="shipped." right="2020 — present" />
          {EXPERIENCE.map((e, i) => (
            <div className="reveal exp-row" key={e.co} style={{ display: "grid", gridTemplateColumns: "150px 1fr", gap: 28, paddingBottom: 26, marginBottom: 26, borderBottom: i < EXPERIENCE.length - 1 ? "1px solid var(--line)" : "none" }}>
              <div className="font-mono" style={{ fontSize: 12, color: "var(--accent)", paddingTop: 3 }}>{e.period}</div>
              <div>
                <h4 className="font-display" style={{ fontSize: 19, fontWeight: 600, letterSpacing: "-0.01em" }}>{e.co}</h4>
                <div style={{ fontSize: 13, color: "var(--ink-muted)", marginTop: 3 }}>{e.role} · {e.industry}</div>
              </div>
            </div>
          ))}
          <div className="reveal" style={{ marginTop: 8 }}>
            <button className="btn btn-ghost" onClick={() => go("experience")}>Full experience →</button>
          </div>
        </div>
      </div>

      {/* SKILLS */}
      <div style={{ background: "var(--surface)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
        <div className="wrap" style={{ padding: "76px 40px" }}>
          <SectionHead kicker="Expertise" title="Skills &" em="tools." />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 40 }}>
            {SKILLS.map(({ cat, items }) => (
              <div className="reveal" key={cat}>
                <div className="font-mono" style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 14, paddingBottom: 12, borderBottom: "1px solid var(--line)" }}>{cat}</div>
                {items.map((it) => (
                  <div key={it} style={{ fontSize: 15, fontWeight: 300, color: "var(--ink-soft)", padding: "9px 0", borderBottom: "1px solid var(--line)" }}>{it}</div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* EDUCATION + CERTS */}
      <div className="wrap grid-2" style={{ padding: "76px 40px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64 }}>
        <div className="reveal">
          <span className="eyebrow">Education</span>
          <h3 className="font-display" style={{ fontSize: 22, fontWeight: 600, marginTop: 16, letterSpacing: "-0.01em" }}>Naresuan University</h3>
          <p style={{ fontSize: 15, color: "var(--ink-soft)", fontWeight: 300, marginTop: 8, lineHeight: 1.7 }}>
            Bachelor of Fine and Applied Arts — Innovative Media Design. Phitsanulok, Thailand.
          </p>
        </div>
        <div className="reveal">
          <span className="eyebrow">Certificates</span>
          <div style={{ marginTop: 16 }}>
            {CERTS.map((c) => (
              <div key={c} style={{ fontSize: 15, color: "var(--ink-soft)", fontWeight: 300, padding: "11px 0", borderBottom: "1px solid var(--line)" }}>{c}</div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ background: "var(--invert-bg)", color: "var(--invert-ink)", textAlign: "center" }}>
        <div className="wrap" style={{ padding: "80px 40px" }}>
          <div className="reveal">
            <h2 className="font-display" style={{ fontSize: "clamp(30px,5vw,58px)", fontWeight: 600, letterSpacing: "-0.035em", marginBottom: 30 }}>
              Let's build something <em className="grad-text" style={{ fontStyle: "italic", fontWeight: 400 }}>great.</em>
            </h2>
            <button className="btn btn-fill" onClick={() => go("contact")}>Get in touch →</button>
          </div>
        </div>
      </div>
    </main>
  );
}

/* ─────────────────────────────────────────────
   EXPERIENCE
───────────────────────────────────────────── */
function ExperiencePage({ go }) {
  useScrollReveal("experience");
  return (
    <main style={{ paddingTop: 70 }}>
      <div className="wrap" style={{ padding: "64px 40px 52px" }}>
        <div className="anim-up d1"><span className="eyebrow">Experience</span></div>
        <h1 className="font-display anim-up d2" style={{ fontSize: "clamp(38px,6vw,78px)", fontWeight: 600, letterSpacing: "-0.035em", lineHeight: 1.03, maxWidth: 800, marginTop: 14 }}>
          Five years of <em className="grad-text" style={{ fontStyle: "italic", fontWeight: 400 }}>shipping</em> product.
        </h1>
        <p className="anim-up d3" style={{ fontSize: 17, fontWeight: 300, color: "var(--ink-soft)", marginTop: 18, maxWidth: 560, lineHeight: 1.7 }}>
          Across pawnshop systems, mobile banking, real-estate marketplaces, and telemedicine —
          always from concept to delivery, always close to business and engineering.
        </p>
      </div>
      <hr className="rule" style={{ margin: "0 40px" }} />

      <div style={{ maxWidth: 880, margin: "0 auto", padding: "64px 40px" }}>
        {EXPERIENCE.map((e, i) => (
          <div className="reveal exp-row" key={e.co} style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 36, paddingBottom: 44, marginBottom: 44, borderBottom: i < EXPERIENCE.length - 1 ? "1px solid var(--line)" : "none" }}>
            <div>
              <div className="font-mono" style={{ fontSize: 13, color: "var(--accent)" }}>{e.period}</div>
              <div className="font-mono" style={{ fontSize: 11, color: "var(--ink-muted)", marginTop: 8, letterSpacing: "0.04em" }}>{e.industry}</div>
            </div>
            <div>
              <h3 className="font-display" style={{ fontSize: 23, fontWeight: 600, letterSpacing: "-0.015em" }}>{e.co}</h3>
              <div style={{ fontSize: 14, color: "var(--ink-muted)", marginTop: 4, marginBottom: 14 }}>{e.role}</div>
              <p style={{ fontSize: 15, fontWeight: 300, color: "var(--ink-soft)", lineHeight: 1.75, marginBottom: 16 }}>{e.desc}</p>
              <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
                {e.tags.map((t) => <span key={t} className="tag">{t}</span>)}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: "var(--surface)", borderTop: "1px solid var(--line)", textAlign: "center" }}>
        <div className="wrap" style={{ padding: "76px 40px" }}>
          <div className="reveal">
            <span className="eyebrow" style={{ display: "inline-flex", justifyContent: "center" }}>What's next</span>
            <h2 className="font-display" style={{ fontSize: "clamp(28px,4.5vw,52px)", fontWeight: 600, letterSpacing: "-0.03em", margin: "16px 0 28px" }}>
              See the work behind the roles.
            </h2>
            <button className="btn btn-fill" onClick={() => go("home")}>View case studies →</button>
          </div>
        </div>
      </div>
    </main>
  );
}

/* ─────────────────────────────────────────────
   CONTACT
───────────────────────────────────────────── */
function ContactPage() {
  useScrollReveal("contact");
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", project: "", message: "" });
  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const submit = () => { if (form.name && form.email && form.message) setSent(true); };

  const info = [
    { l: "Email", v: PROFILE.email, href: `mailto:${PROFILE.email}` },
    { l: "LinkedIn", v: PROFILE.linkedin, href: `https://${PROFILE.linkedin}` },
  ];

  return (
    <main style={{ paddingTop: 70 }}>
      <div className="wrap grid-2" style={{ padding: "64px 40px 108px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 88, alignItems: "start" }}>
        <div>
          <div className="anim-up d1"><span className="eyebrow">Contact</span></div>
          <h1 className="font-display anim-up d2 grad-text" style={{ fontSize: "clamp(36px,5vw,64px)", fontWeight: 600, letterSpacing: "-0.035em", lineHeight: 1.04, marginTop: 14, marginBottom: 28 }}>
            Let's Build Better Products
          </h1>
          <p className="anim-up d3" style={{ fontSize: 16, fontWeight: 300, color: "var(--ink-soft)", lineHeight: 1.8, marginBottom: 44, maxWidth: 430 }}>
            Interested in product design, UX strategy, or digital transformation projects? Let's connect.
          </p>
          <div className="anim-up d4" style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {info.map(({ l, v, href }) => (
              <div key={l} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--line)", padding: "16px 0" }}>
                <span className="font-mono" style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-muted)" }}>{l}</span>
                {href ? <a href={href} target="_blank" rel="noreferrer" className="hover-line" style={{ fontSize: 15, color: "var(--ink)", textDecoration: "none" }}>{v}</a>
                      : <span style={{ fontSize: 15, color: "var(--ink)" }}>{v}</span>}
              </div>
            ))}
          </div>
          <a className="btn btn-fill anim-up d5" href={PROFILE.resume} download="Resume_Prangshat_2026.pdf" style={{ marginTop: 30, display: "inline-flex" }}>
            Download Résumé ↓
          </a>
        </div>

        <div className="anim-up d3">
          {sent ? (
            <div style={{ padding: "60px 40px", border: "1px solid var(--line)", borderRadius: 8, textAlign: "center", background: "var(--surface)" }}>
              <div className="grad-text" style={{ fontSize: 40, marginBottom: 14 }}>✦</div>
              <h3 className="font-display" style={{ fontSize: 26, fontWeight: 600, marginBottom: 12 }}>Message ready.</h3>
              <p style={{ fontSize: 15, fontWeight: 300, color: "var(--ink-soft)", lineHeight: 1.7 }}>
                Thanks for reaching out — I'll reply within 48 hours. You can also email me directly at {PROFILE.email}.
              </p>
            </div>
          ) : (
            <div style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 8, padding: "44px 38px" }}>
              <h3 className="font-display" style={{ fontSize: 21, fontWeight: 600, marginBottom: 34, letterSpacing: "-0.01em" }}>Send a message</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
                {[
                  { name: "name", label: "Your name", placeholder: "Jane Smith" },
                  { name: "email", label: "Email address", placeholder: "jane@company.com" },
                  { name: "project", label: "Project type", placeholder: "Full-time, freelance, advisory…" },
                ].map(({ name, label, placeholder }) => (
                  <div key={name}>
                    <label className="font-mono" style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-muted)", display: "block", marginBottom: 8 }}>{label}</label>
                    <input className="field" name={name} placeholder={placeholder} value={form[name]} onChange={handle} />
                  </div>
                ))}
                <div>
                  <label className="font-mono" style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-muted)", display: "block", marginBottom: 8 }}>Message</label>
                  <textarea className="field" name="message" placeholder="Tell me about your project, timeline, and what you're looking for…" value={form.message} onChange={handle} />
                </div>
                <button className="btn btn-fill" onClick={submit} style={{ alignSelf: "flex-start" }}>Send message →</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

/* ─────────────────────────────────────────────
   FOOTER
───────────────────────────────────────────── */
function Footer({ go }) {
  const links = [
    { label: "About", p: "about" }, { label: "Work", p: "home" },
    { label: "Contact", p: "contact" },
  ];
  return (
    <footer style={{ borderTop: "1px solid var(--line)", background: "var(--bg-deep)" }}>
      <div className="wrap" style={{ padding: "44px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ width: 9, height: 9, background: "var(--grad)", borderRadius: 2 }} />
          <div>
            <div className="font-display" style={{ fontSize: 17, fontWeight: 600, letterSpacing: "-0.02em" }}>Portfolio.</div>
            <div className="font-mono" style={{ fontSize: 11, color: "var(--ink-muted)", marginTop: 3 }}>© 2025 Prangshat Khamwiset</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 26 }}>
          {links.map(({ label, p }) => (
            <button key={p} onClick={() => go(p)} className="nav-link hover-line">{label}</button>
          ))}
        </div>
      </div>
    </footer>
  );
}

/* ─────────────────────────────────────────────
   ROOT
───────────────────────────────────────────── */
export default function Portfolio() {
  const [page, setPage] = useState("home");
  const [cs, setCs] = useState(null);

  const go = (p) => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const openCase = (c) => { setCs(c); setPage("case-study"); window.scrollTo({ top: 0 }); };

  return (
    <div className="pf-root">
      <GlobalStyles />
      <Nav page={page} go={go} />
      {page === "home" && <HomePage go={go} openCase={openCase} />}
      {page === "case-study" && cs && <CaseStudyPage cs={cs} go={go} openCase={openCase} />}
      {page === "about" && <AboutPage go={go} />}
      {page === "experience" && <ExperiencePage go={go} />}
      {page === "contact" && <ContactPage />}
      <Footer go={go} />
    </div>
  );
}
