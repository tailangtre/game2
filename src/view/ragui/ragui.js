/*
 * Boar Market control layer - a port of RAGNAROK's HTML UI (C:/tiedam/ragnarok/frontend/src/ui.ts),
 * tom 2026-10-03: "the ui elements need to be exactly the same as ragnarok's ones, just remove the
 * auto play button, use the different frame and add language change section".
 *
 * Same markup, CSS (copied verbatim), icons, spin glyph and behaviour as RAGNAROK; differences:
 *  - no autoplay button, no buy-bonus tile (this game has neither)
 *  - Boar Market's square frame art (assets/images/ui/uiframe_*.png, 9-slice 20)
 *  - a LANGUAGE section in the menu popover
 *  - the bet popover also carries the BET MULTIPLIER (this game's coin value)
 * It drives the existing game: every action goes through ButtonMobileClass (btnClick / setters), and
 * the readouts are read back from it, so the game logic and server flow are unchanged. Landscape only;
 * portrait keeps the canvas controls.
 */
(function () {
  'use strict';
  var CSS = "    #bhp-ui{position:fixed;inset:0;pointer-events:none;color:var(--ink);z-index:20;\n      font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text','SF Pro Display','Segoe UI Variable Text','Segoe UI',Inter,Roboto,system-ui,sans-serif;\n      -webkit-font-smoothing:antialiased;font-feature-settings:'tnum' 1;\n      --tilt:0deg;--uiscale:1.12;\n      --display:'BHPGame','SF Pro Display','Segoe UI',system-ui,sans-serif;\n      /* palette */\n      --ink:#e9f4f1;--muted:rgba(233,244,241,.58);--faint:rgba(233,244,241,.34);\n      --gold:#cfa76a;--goldhi:#9ff7e2;--golddk:#7a5a32;--ember:#3dffd0;\n      /* glass */\n      --glass:rgba(8,20,30,.52);--glass2:rgba(12,28,40,.66);--glass3:rgba(6,15,22,.78);\n      --hair:rgba(190,245,232,.14);--hair2:rgba(190,245,232,.24);\n      --blur:blur(22px) saturate(165%);\n      --lift:0 1px 0 rgba(225,250,245,.07) inset,0 10px 30px rgba(0,0,0,.38),0 2px 8px rgba(0,0,0,.28);\n      --goldfill:linear-gradient(180deg,#f0dcb0 0%,#c79c5e 42%,#7a5a32 100%);\n      /* motion */\n      --spring:cubic-bezier(.34,1.56,.64,1);--ease:cubic-bezier(.22,1,.36,1);--quick:.18s;--med:.32s;\n      /* squared futuristic geometry (user 2026-09-30: \"more modern and futuristic, squares\n         instead of round/circle elements\") */\n      --r-xs:0;--r-sm:0;--r-md:0;--r-lg:0;\n      --brk-c:rgba(140,240,214,.6);--brk-l:10px;--brk-w:1.5px;\n      --brk:linear-gradient(var(--brk-c),var(--brk-c)) left 4px top 4px/var(--brk-l) var(--brk-w) no-repeat,\n        linear-gradient(var(--brk-c),var(--brk-c)) left 4px top 4px/var(--brk-w) var(--brk-l) no-repeat,\n        linear-gradient(var(--brk-c),var(--brk-c)) right 4px top 4px/var(--brk-l) var(--brk-w) no-repeat,\n        linear-gradient(var(--brk-c),var(--brk-c)) right 4px top 4px/var(--brk-w) var(--brk-l) no-repeat,\n        linear-gradient(var(--brk-c),var(--brk-c)) left 4px bottom 4px/var(--brk-l) var(--brk-w) no-repeat,\n        linear-gradient(var(--brk-c),var(--brk-c)) left 4px bottom 4px/var(--brk-w) var(--brk-l) no-repeat,\n        linear-gradient(var(--brk-c),var(--brk-c)) right 4px bottom 4px/var(--brk-l) var(--brk-w) no-repeat,\n        linear-gradient(var(--brk-c),var(--brk-c)) right 4px bottom 4px/var(--brk-w) var(--brk-l) no-repeat;}\n    #bhp-ui *{box-sizing:border-box}\n    #bhp-ui button{font-family:inherit;-webkit-tap-highlight-color:transparent}\n    /* --- corner clusters ------------------------------------------------- */\n    #bhp-ui .cluster{position:absolute;bottom:20px;display:flex;align-items:flex-end;gap:12px;pointer-events:none;\n      transition:opacity .5s var(--ease),transform .5s var(--ease)}\n    #bhp-ui .cluster>*{pointer-events:auto}\n    #bhp-ui.prestart .cluster,#bhp-ui.prestart .winmid{opacity:0;pointer-events:none}\n    /* reveal: the controls rise in (their CHILDREN move, so the cluster box the board\n       layout measures stays put) */\n    #bhp-ui:not(.prestart) .cluster>*{animation:bhpup .6s var(--spring) backwards}\n    #bhp-ui:not(.prestart) .cluster>*:nth-child(2){animation-delay:.06s}\n    @keyframes bhpup{from{opacity:0;transform:translateY(18px)}}\n    #bhp-ui .cluster.left{left:22px;transform-origin:bottom left;transform:rotate(var(--tilt)) scale(var(--uiscale))}\n    #bhp-ui .cluster.right{right:22px;transform-origin:bottom right;transform:rotate(calc(var(--tilt) * -1)) scale(var(--uiscale))}\n    #bhp-ui .lstack{display:flex;flex-direction:column;gap:8px;align-items:stretch}\n    #bhp-ui .rcol{display:flex;flex-direction:column;gap:10px;align-items:center}\n    #bhp-ui .rtop{position:relative;display:flex;align-items:center;justify-content:center}\n    #bhp-ui .rside{position:absolute;left:calc(100% + 10px);top:50%;transform:translateY(-50%);display:flex;flex-direction:column;gap:8px;align-items:center}\n    /* --- round glass icon buttons ------------------------------------------ */\n    #bhp-ui .ic{width:44px;height:44px;border-radius:0;display:flex;align-items:center;justify-content:center;cursor:pointer;\n      background:var(--glass);-webkit-backdrop-filter:var(--blur);backdrop-filter:var(--blur);border:1px solid var(--hair);color:var(--ink);\n      box-shadow:var(--lift);transition:transform var(--quick) var(--spring),background var(--quick),color var(--quick),border-color var(--quick),box-shadow var(--quick)}\n    #bhp-ui .ic svg,#bhp-ui .spin svg,#bhp-ui .betctl .arw svg{display:block}\n    #bhp-ui .ic svg{width:20px;height:20px}\n    #bhp-ui .ic:hover{background:var(--glass2);border-color:var(--hair2);transform:translateY(-1px)}\n    #bhp-ui .ic:active{transform:scale(.9)}\n    #bhp-ui .ic.on{background:var(--goldfill);color:#2a1706;border-color:rgba(190,250,236,.7);box-shadow:var(--lift),0 0 18px rgba(61,255,208,.45)}\n    #bhp-ui .ic.sm{width:40px;height:40px}\n    #bhp-ui .ic.sm svg{width:18px;height:18px}\n    /* --- buy-bonus tile (the team logo) -------------------------------------- */\n    #bhp-ui .buybg{display:flex;justify-content:center;background:var(--glass);-webkit-backdrop-filter:var(--blur);backdrop-filter:var(--blur);\n      border:1px solid var(--hair);border-radius:0;padding:8px 14px 8px;box-shadow:var(--lift);\n      transition:transform var(--quick) var(--spring),border-color var(--quick),box-shadow var(--quick)}\n    #bhp-ui .buybg:hover{border-color:var(--hair2);transform:translateY(-1px)}\n    #bhp-ui .buybg:active{transform:scale(.95)}\n    #bhp-ui .logo{display:flex;flex-direction:column;align-items:center;gap:4px;cursor:pointer}\n    #bhp-ui .logo img{height:44px;width:auto;filter:drop-shadow(0 2px 10px rgba(61,255,208,.35));transition:transform var(--med) var(--spring)}\n    #bhp-ui .buybg:hover .logo img{transform:scale(1.06)}\n    #bhp-ui .logo .ll{font-size:10px;letter-spacing:.12em;font-weight:700;color:var(--goldhi);white-space:nowrap;text-transform:uppercase}\n    #bhp-ui .logo.armed img{filter:drop-shadow(0 0 12px var(--arm,#c2318a));animation:bhparm 1.6s ease-in-out infinite}\n    #bhp-ui .logo.armed .ll{color:#fff;background:var(--arm,#c2318a);padding:3px 10px;border-radius:0;\n      letter-spacing:.06em;box-shadow:0 0 14px color-mix(in srgb,var(--arm,#c2318a) 60%,transparent)}\n    #bhp-ui .buybg:has(.logo.armed){border-color:color-mix(in srgb,var(--arm,#c2318a) 70%,transparent);\n      box-shadow:var(--lift),0 0 22px color-mix(in srgb,var(--arm,#c2318a) 40%,transparent)}\n    #bhp-ui .logo.off{cursor:default}#bhp-ui .buybg:has(.logo.off):hover{transform:none}\n    @keyframes bhparm{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}\n    /* --- readouts ------------------------------------------------------------ */\n    #bhp-ui .readout{display:flex;flex-direction:column;line-height:1.1;min-width:84px;padding:7px 14px 8px;border-radius:0;\n      background:var(--glass);-webkit-backdrop-filter:var(--blur);backdrop-filter:var(--blur);border:1px solid var(--hair);box-shadow:var(--lift)}\n    #bhp-ui .readout .k{font-size:10px;letter-spacing:.1em;color:var(--muted);font-weight:600;text-transform:uppercase}\n    #bhp-ui .readout .v{font-size:17px;font-weight:700;color:var(--ink);letter-spacing:-.01em;font-variant-numeric:tabular-nums}\n    #bhp-ui .fsr{display:none;margin-top:3px}#bhp-ui .fsr b{color:var(--goldhi)!important;font-weight:700}\n    /* --- bet stepper: a glass capsule ( - BET + ) ----------------------------------- */\n    #bhp-ui .betctl{display:flex;align-items:center;gap:2px;padding:4px;border-radius:0;background:var(--glass);\n      -webkit-backdrop-filter:var(--blur);backdrop-filter:var(--blur);border:1px solid var(--hair);box-shadow:var(--lift);transition:opacity var(--med)}\n    #bhp-ui .betctl .arw{width:32px;height:32px;border-radius:0;display:flex;align-items:center;justify-content:center;cursor:pointer;padding:0;\n      background:rgba(215,245,240,.07);border:none;color:var(--ink);transition:transform var(--quick) var(--spring),background var(--quick)}\n    #bhp-ui .betctl .arw svg{width:16px;height:16px}\n    #bhp-ui .betctl .arw:hover{background:rgba(215,245,240,.16)}\n    #bhp-ui .betctl .arw:active{transform:scale(.86)}\n    #bhp-ui .betctl .arw:disabled{opacity:.3;cursor:default;transform:none}\n    #bhp-ui .betctl .bv{min-width:78px;text-align:center;cursor:pointer;line-height:1.1;padding:0 4px}\n    #bhp-ui .betctl .bv .k{font-size:9px;letter-spacing:.12em;color:var(--muted);font-weight:600;text-transform:uppercase}\n    #bhp-ui .betctl .bv .v{font-size:15px;font-weight:700;color:var(--ink);font-variant-numeric:tabular-nums}\n    #bhp-ui .betctl.disabled{opacity:.45;pointer-events:none}\n    #bhp-ui .betctl.armed{border-color:color-mix(in srgb,var(--armlt,#d0bcff) 45%,transparent)}\n    #bhp-ui .betctl.armed .k,#bhp-ui .betctl.armed .v{color:var(--armlt,#d0bcff)}\n    /* --- spin: a gold disc with a breathing halo ------------------------------------ */\n    #bhp-ui .spin{width:76px;height:76px;border-radius:0;border:none;cursor:pointer;position:relative;color:#2a1706;\n      background:var(--goldfill);\n      box-shadow:0 1px 0 rgba(255,255,255,.55) inset,0 -6px 14px rgba(20,70,62,.45) inset,0 0 0 1px rgba(14,60,52,.55),\n        0 12px 28px rgba(0,0,0,.45),0 0 26px rgba(61,230,200,.35);\n      display:flex;align-items:center;justify-content:center;transition:transform .22s var(--spring),filter var(--quick),box-shadow var(--quick)}\n    #bhp-ui .spin::after{content:'';position:absolute;inset:-6px;border-radius:0;border:2px solid rgba(130,240,208,.55);pointer-events:none;\n      animation:bhphalo 2.6s var(--ease) infinite}\n    @keyframes bhphalo{0%{transform:scale(.94);opacity:.9}70%,100%{transform:scale(1.22);opacity:0}}\n    #bhp-ui .spin .sv{position:absolute;inset:7px;display:flex;align-items:center;justify-content:center;overflow:hidden}   /* the flying arrow is clipped by the inner frame */\n    #bhp-ui .spin svg{width:34px;height:34px;overflow:visible;filter:drop-shadow(0 1px 0 rgba(200,250,240,.5))}\n    #bhp-ui .spin:hover{transform:scale(1.04)}\n    #bhp-ui .spin:active{transform:scale(.92)}\n    #bhp-ui .spin:disabled{cursor:default;transform:none;filter:saturate(.75) brightness(.92)}\n    #bhp-ui .spin:disabled::after,#bhp-ui .spin.spinning::after{animation:none;opacity:0}\n    #bhp-ui .spin.cantbet{filter:grayscale(.6) brightness(.85)}\n    #bhp-ui .spin .cnt{position:absolute;font-family:var(--display);font-size:22px;font-weight:900;color:#2a1706}\n    #bhp-ui .spin.armed{box-shadow:0 1px 0 rgba(255,255,255,.55) inset,0 -6px 14px rgba(20,70,62,.45) inset,0 0 0 2px var(--arm,#c2318a),\n        0 12px 28px rgba(0,0,0,.45),0 0 30px var(--arm,#c2318a)}\n    #bhp-ui .spin.armed::after{border-color:var(--arm,#c2318a)}\n    @keyframes bhpspin{to{transform:rotate(360deg)}}\n    /* --- centred WIN capsule ------------------------------------------------------- */\n    #bhp-ui .winmid{position:absolute;left:50%;bottom:22px;transform:translateX(-50%) translateY(10px) scale(calc(var(--ws,1) * .9));text-align:center;opacity:0;pointer-events:none;\n      padding:7px 28px 9px;border-radius:0;background:var(--glass3);-webkit-backdrop-filter:var(--blur);backdrop-filter:var(--blur);\n      border:1px solid rgba(140,240,214,.32);box-shadow:var(--lift),0 0 30px rgba(61,230,200,.22);\n      transition:opacity .3s var(--ease),transform .45s var(--spring)}\n    #bhp-ui .winmid.show{opacity:1;transform:translateX(-50%) translateY(0) scale(var(--ws,1))}\n    #bhp-ui .winmid .k{font-size:11px;letter-spacing:.34em;color:var(--gold);font-weight:700;text-transform:uppercase;padding-left:.34em}\n    #bhp-ui .winmid .v{font-family:var(--display);font-size:28px;font-weight:900;line-height:1.1;letter-spacing:.01em;\n      background:linear-gradient(180deg,#fff6de,#ffd27a 55%,#e29a3c);-webkit-background-clip:text;background-clip:text;color:transparent;\n      filter:drop-shadow(0 0 12px rgba(61,230,200,.35))}\n    #bhp-ui .winmid .v.bump{animation:bhpbump .38s var(--spring)}\n    @keyframes bhpbump{0%{transform:scale(1)}40%{transform:scale(1.14)}100%{transform:scale(1)}}\n    /* --- jurisdiction strip ---------------------------------------------------------- */\n    #bhp-ui .jurisbar{position:absolute;top:10px;left:12px;display:none;gap:10px;align-items:center;pointer-events:none;\n      font-size:11px;letter-spacing:.06em;color:var(--muted);background:var(--glass);-webkit-backdrop-filter:var(--blur);backdrop-filter:var(--blur);\n      padding:6px 14px;border-radius:0;border:1px solid var(--hair);box-shadow:var(--lift)}\n    #bhp-ui .jurisbar.show{display:flex}\n    #bhp-ui .jurisbar b{color:var(--ink);font-weight:700;margin-left:5px}\n    #bhp-ui .jurisbar .jsep{opacity:.35}\n    /* --- popovers (menu, bet slider) ------------------------------------------------- */\n    #bhp-ui .pop{position:absolute;bottom:196px;display:flex;flex-direction:column;gap:14px;pointer-events:none;visibility:hidden;\n      background:var(--glass3);-webkit-backdrop-filter:var(--blur);backdrop-filter:var(--blur);border:1px solid var(--hair);\n      border-radius:0;padding:16px 16px 14px;box-shadow:var(--lift),0 24px 60px rgba(0,0,0,.45);\n      opacity:0;transform:translateY(10px) scale(.94);\n      transition:opacity .2s var(--ease),transform .38s var(--spring),visibility 0s linear .2s}\n    #bhp-ui .pop.show{pointer-events:auto;visibility:visible;opacity:1;transform:none;transition:opacity .2s var(--ease),transform .38s var(--spring)}\n    #bhp-ui .pop.menupop{left:22px;width:min(260px,calc(100vw - 24px));transform-origin:bottom left}\n    #bhp-ui .pop.betpop{right:22px;width:min(280px,calc(100vw - 24px));transform-origin:bottom right}\n    #bhp-ui .poptitle{font-size:11px;letter-spacing:.1em;color:var(--muted);font-weight:600;text-transform:uppercase}\n    #bhp-ui .audiorow{display:flex;align-items:center;gap:12px}\n    #bhp-ui .audiorow .ai{flex:0 0 20px;color:var(--ink);opacity:.8;display:flex}\n    /* iOS-style sliders: thin track, gold fill up to the thumb (--p set from JS) */\n    #bhp-ui input[type=range]{-webkit-appearance:none;appearance:none;height:6px;border-radius:0;cursor:pointer;outline:none;margin:8px 0;\n      background:linear-gradient(90deg,var(--gold) 0 var(--p,50%),rgba(215,245,240,.16) var(--p,50%) 100%)}\n    #bhp-ui .audiorow input[type=range]{flex:1}#bhp-ui .betpop input[type=range]{width:100%}\n    #bhp-ui input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:24px;height:24px;border-radius:0;\n      background:#fffaf0;border:none;box-shadow:0 2px 8px rgba(0,0,0,.45),0 0 0 .5px rgba(0,0,0,.2);transition:transform .15s var(--spring)}\n    #bhp-ui input[type=range]:active::-webkit-slider-thumb{transform:scale(1.12)}\n    #bhp-ui input[type=range]::-moz-range-thumb{width:24px;height:24px;border-radius:0;background:#fffaf0;border:none;box-shadow:0 2px 8px rgba(0,0,0,.45)}\n    #bhp-ui input[type=range]:disabled{opacity:.4}\n    #bhp-ui .infobtn{display:flex;align-items:center;justify-content:center;gap:8px;pointer-events:auto;border:1px solid var(--hair);\n      background:rgba(215,245,240,.08);color:var(--ink);border-radius:0;padding:11px;cursor:pointer;font-weight:600;font-size:14px;\n      transition:background var(--quick),transform var(--quick) var(--spring)}\n    #bhp-ui .infobtn:hover{background:rgba(215,245,240,.14)}\n    #bhp-ui .infobtn:active{transform:scale(.96)}\n    #bhp-ui .betpop .row{display:flex;justify-content:space-between;align-items:baseline;font-size:12px;color:var(--muted);font-weight:500;font-variant-numeric:tabular-nums}\n    #bhp-ui .betpop #bhp-betpopval{font-family:var(--display);font-size:20px;color:var(--goldhi)}\n    /* --- modals: dimmed blurred backdrop + a glass sheet that springs in --------------- */\n    #bhp-ui .panel{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;pointer-events:none;visibility:hidden;opacity:0;\n      background:rgba(3,8,12,.46);-webkit-backdrop-filter:blur(10px) saturate(120%);backdrop-filter:blur(10px) saturate(120%);\n      transition:opacity .26s var(--ease),visibility 0s linear .26s}\n    #bhp-ui .panel.show{pointer-events:auto;visibility:visible;opacity:1;transition:opacity .26s var(--ease)}\n    #bhp-ui .card{background:var(--glass3);-webkit-backdrop-filter:blur(30px) saturate(170%);backdrop-filter:blur(30px) saturate(170%);\n      border:1px solid var(--hair);border-radius:0;padding:24px 26px;width:min(520px,92vw);\n      box-shadow:0 1px 0 rgba(225,250,245,.08) inset,0 30px 80px rgba(0,0,0,.55);\n      transform:translateY(18px) scale(.96);transition:transform .46s var(--spring)}\n    #bhp-ui .panel.show .card{transform:none}\n    #bhp-ui .card h2{margin:0 0 6px;font-family:var(--display);font-size:24px;letter-spacing:.04em;font-weight:900;\n      background:linear-gradient(180deg,#fff4d6,#f2c56e 60%,#d39443);-webkit-background-clip:text;background-clip:text;color:transparent}\n    #bhp-ui .card p.sub{margin:0 0 18px;color:var(--muted);font-size:14px;line-height:1.45}\n    #bhp-ui .confirmrow{display:flex;gap:10px;margin-top:6px}\n    /* buttons: primary = gold capsule, secondary = tinted glass */\n    #bhp-ui .cbtn{flex:1;pointer-events:auto;border:none;border-radius:0;padding:14px;cursor:pointer;font-weight:700;font-size:16px;\n      transition:transform var(--quick) var(--spring),filter var(--quick),background var(--quick)}\n    #bhp-ui .cbtn:active{transform:scale(.96)}\n    #bhp-ui .cbtn.cancel{background:rgba(215,245,240,.1);color:var(--ink)}\n    #bhp-ui .cbtn.cancel:hover{background:rgba(215,245,240,.16)}\n    #bhp-ui .cbtn.go{background:var(--goldfill);color:#2a1706;box-shadow:0 1px 0 rgba(255,255,255,.5) inset,0 8px 22px rgba(61,240,200,.3)}\n    #bhp-ui .cbtn.go:hover{filter:none}\n    #bhp-ui .cbtn:disabled{opacity:.45;cursor:default;filter:grayscale(.5);transform:none}\n    #bhp-ui .confirmcard{text-align:center}\n    #bhp-ui .confirmcard h2{font-size:26px}\n    #bhp-ui .confirmtxt{font-size:16px;line-height:1.55;text-align:center;color:var(--ink);margin:0 0 22px}\n    #bhp-ui .card p.confirmtxt{color:var(--ink)}\n    #bhp-ui .confirmtxt .ceff{display:block;margin-top:10px;font-size:.84em;line-height:1.45;color:var(--muted)}\n    #bhp-ui .confirmtxt .amt{color:var(--goldhi);font-weight:700;white-space:nowrap}\n    /* --- bonus menu ------------------------------------------------------------------- */\n    #bhp-ui .card.wide{width:min(900px,95vw);max-height:calc(100dvh - 24px);overflow-y:auto;scrollbar-width:thin}\n    #bhp-ui .tgroup + .tgroup{margin-top:16px}\n    #bhp-ui .thead{margin:0 0 10px 2px;font-size:12px;letter-spacing:.1em;font-weight:600;color:var(--muted);text-transform:uppercase}\n    #bhp-ui .tiers{display:grid;grid-template-columns:repeat(var(--n,3),minmax(0,1fr));gap:12px}   /* one row per group */\n    #bhp-ui .tier{position:relative;min-width:0;pointer-events:auto;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:7px;\n      color:var(--ink);padding:16px 12px 14px;border-radius:0;overflow:hidden;\n      background:radial-gradient(120% 70% at 50% 0%,color-mix(in srgb,var(--glow) 26%,transparent),transparent 62%),rgba(215,245,240,.05);\n      border:1px solid var(--hair);box-shadow:0 1px 0 rgba(225,250,245,.06) inset;\n      transition:transform .3s var(--spring),border-color var(--quick),box-shadow var(--quick),background var(--quick)}\n    #bhp-ui .tier:hover{transform:translateY(-3px);border-color:color-mix(in srgb,var(--glow) 55%,transparent);\n      box-shadow:0 1px 0 rgba(225,250,245,.06) inset,0 14px 30px rgba(0,0,0,.35),0 0 24px color-mix(in srgb,var(--glow) 30%,transparent)}\n    #bhp-ui .tier:active{transform:scale(.97)}\n    #bhp-ui .tier .scwrap{display:flex;justify-content:center;align-items:center;height:60px;transition:transform .35s var(--spring)}\n    #bhp-ui .tier:hover .scwrap{transform:scale(1.07)}\n    #bhp-ui .tier .stack{display:flex;align-items:center}\n    #bhp-ui .tier .sc{width:42px;height:42px;object-fit:contain;margin-left:-14px;filter:drop-shadow(0 3px 6px rgba(0,0,0,.6))}\n    #bhp-ui .tier .sc:first-child{margin-left:0}\n    #bhp-ui .tier .emb{width:60px;height:60px;object-fit:contain;filter:drop-shadow(0 3px 8px rgba(0,0,0,.6)) drop-shadow(0 0 10px color-mix(in srgb,var(--glow) 55%,transparent))}\n    #bhp-ui .tier .scount{font-size:10px;letter-spacing:.1em;font-weight:700;text-transform:uppercase;padding:3px 9px;border-radius:0;\n      color:color-mix(in srgb,var(--glow) 55%,#fff);background:color-mix(in srgb,var(--glow) 20%,transparent)}\n    #bhp-ui .tier .tname{font-family:var(--display);font-size:15px;font-weight:900;letter-spacing:.04em;text-align:center;color:var(--ink)}\n    #bhp-ui .tier .trule{display:none}\n    #bhp-ui .tier .teff{font-size:12px;color:var(--muted);text-align:center;min-height:32px;line-height:1.35}\n    #bhp-ui .tier .tprice{margin-top:2px;font-size:15px;font-weight:700;color:#2a1706;padding:6px 16px;border-radius:0;background:var(--goldfill);\n      box-shadow:0 1px 0 rgba(255,255,255,.5) inset,0 4px 12px rgba(61,240,200,.25);font-variant-numeric:tabular-nums}\n    /* --- autoplay chips: a tidy grid ------------------------------------------------------ */\n    #bhp-ui .chips{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin-top:4px}\n    #bhp-ui .chips button{pointer-events:auto;border:1px solid var(--hair);background:rgba(215,245,240,.07);color:var(--ink);border-radius:0;padding:13px 10px;\n      cursor:pointer;font-weight:700;font-size:16px;font-variant-numeric:tabular-nums;transition:transform var(--quick) var(--spring),background var(--quick),border-color var(--quick)}\n    #bhp-ui .chips button:hover{background:rgba(215,245,240,.14);border-color:var(--hair2)}\n    #bhp-ui .chips button:active{transform:scale(.94)}\n    #bhp-ui .close{margin-top:18px;width:100%;pointer-events:auto;border:none;background:rgba(215,245,240,.1);color:var(--ink);border-radius:0;padding:13px;\n      cursor:pointer;font-weight:600;font-size:15px;transition:background var(--quick),transform var(--quick) var(--spring)}\n    #bhp-ui .close:hover{background:rgba(215,245,240,.16)}\n    #bhp-ui .close:active{transform:scale(.97)}\n    #bhp-ui .card.infocard{width:min(660px,94vw)}\n    /* --- game info ---------------------------------------------------------------------- */\n    #bhp-ui .info{font-size:14px;line-height:1.6;color:rgba(233,244,241,.82);max-height:58vh;overflow:auto;padding-right:8px;scrollbar-width:thin}\n    #bhp-ui .info::-webkit-scrollbar{width:6px}#bhp-ui .info::-webkit-scrollbar-thumb{background:rgba(215,245,240,.2);border-radius:0}\n    #bhp-ui .info b{color:var(--ink);font-weight:650}\n    #bhp-ui .info p{margin:6px 0 12px}\n    #bhp-ui .info ul{margin:6px 0 14px;padding-left:20px}\n    #bhp-ui .info li{margin:6px 0}\n    #bhp-ui .info h3{margin:22px 0 8px;font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:var(--gold);font-weight:700}\n    #bhp-ui .info h3:first-child{margin-top:0}\n    #bhp-ui .info .sc{width:24px;height:24px;vertical-align:middle}\n    #bhp-ui .paytbl{width:100%;border-collapse:separate;border-spacing:0;font-size:13px;margin:6px 0 10px;border-radius:0;overflow:hidden;background:rgba(215,245,240,.04)}\n    #bhp-ui .paytbl th{color:var(--muted);font-weight:600;padding:8px 6px;text-align:center;font-size:11px;letter-spacing:.06em;background:rgba(215,245,240,.05)}\n    #bhp-ui .paytbl th.sym,#bhp-ui .paytbl td.sym{text-align:left;padding-left:12px}\n    #bhp-ui .paytbl td{padding:6px;text-align:center;border-top:1px solid rgba(215,245,240,.07);white-space:nowrap;font-weight:600;font-variant-numeric:tabular-nums}\n    #bhp-ui .paytbl tr:hover td{background:rgba(215,245,240,.04)}\n    #bhp-ui .paytbl td.sym{font-weight:500;color:var(--ink)}\n    #bhp-ui .paytbl td.sym img{width:28px;height:28px;vertical-align:middle;margin-right:9px}\n    #bhp-ui .info .tc{font-size:12px;color:var(--faint);line-height:1.55}\n    /* --- toast / fatal ----------------------------------------------------------------------- */\n    #bhp-ui .toast{position:absolute;left:50%;bottom:120px;transform:translateX(-50%) translateY(14px) scale(.92);pointer-events:none;\n      background:var(--glass3);-webkit-backdrop-filter:var(--blur);backdrop-filter:var(--blur);border:1px solid var(--hair);color:var(--ink);\n      font-weight:600;font-size:14px;padding:11px 20px;border-radius:0;box-shadow:var(--lift),0 16px 40px rgba(0,0,0,.4);opacity:0;\n      transition:opacity .22s var(--ease),transform .42s var(--spring);z-index:30}\n    #bhp-ui .toast.show{opacity:1;transform:translateX(-50%) translateY(0) scale(1)}\n    #bhp-ui .fatal{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;pointer-events:auto;\n      background:rgba(2,6,9,.7);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);z-index:60;animation:bhpfade .3s var(--ease)}\n    #bhp-ui .fatalcard{max-width:min(420px,88vw);text-align:center;background:var(--glass3);border:1px solid rgba(255,140,120,.3);border-radius:0;\n      padding:30px 26px;box-shadow:0 30px 80px rgba(0,0,0,.5);animation:bhppop .45s var(--spring)}\n    #bhp-ui .fatalcard .fi{font-size:38px;margin-bottom:10px;color:#ffb199}\n    #bhp-ui .fatalcard .ft{font-size:16px;line-height:1.5;color:var(--ink);font-weight:600}\n    @keyframes bhpfade{from{opacity:0}}\n    @keyframes bhppop{from{transform:translateY(16px) scale(.94);opacity:0}}\n    /* ---- squared / futuristic layer (2026-09-30) ---------------------------------- */\n    #bhp-ui .ic{border-radius:0}\n    #bhp-ui .ic.on{box-shadow:var(--lift),0 0 18px rgba(61,255,208,.45),inset 0 0 0 1px rgba(14,60,52,.4)}\n    #bhp-ui .betctl{border-radius:0;padding:4px}\n    #bhp-ui .betctl .arw{border-radius:0}\n    #bhp-ui .readout,#bhp-ui .buybg{border-radius:0}\n    /* HUD corner brackets on the framed surfaces */\n    #bhp-ui .card{background:var(--brk),var(--glass3);border-radius:0}\n    #bhp-ui .pop{background:var(--brk),var(--glass3);border-radius:0}\n    #bhp-ui .winmid{background:var(--brk),var(--glass3);border-radius:0;--brk-l:8px}\n    #bhp-ui .readout{background:var(--brk),var(--glass);--brk-l:6px;--brk-c:rgba(140,240,214,.4)}\n    #bhp-ui .buybg{background:var(--brk),var(--glass);--brk-l:7px;--brk-c:rgba(140,240,214,.45)}\n    #bhp-ui .tier{border-radius:0;background:var(--brk),radial-gradient(120% 70% at 50% 0%,color-mix(in srgb,var(--glow) 26%,transparent),transparent 62%),rgba(215,245,240,.05);\n      --brk-l:8px;--brk-c:color-mix(in srgb,var(--glow) 70%,#fff 10%)}\n    #bhp-ui .tier .scount,#bhp-ui .tier .tprice,#bhp-ui .logo.armed .ll,#bhp-ui .jurisbar,#bhp-ui .toast{border-radius:0}\n    #bhp-ui .cbtn,#bhp-ui .close,#bhp-ui .chips button,#bhp-ui .infobtn{border-radius:0}\n    #bhp-ui .paytbl{border-radius:0}\n    /* spin: a square gold tile with an inset frame line and a square pulse ring */\n    #bhp-ui .spin{border-radius:0}\n    #bhp-ui .spin::before{content:'';position:absolute;inset:6px;border-radius:0;border:1px solid rgba(14,60,52,.38);pointer-events:none}\n    #bhp-ui .spin::after{border-radius:0;inset:-5px}\n    /* square slider thumbs on a hairline track */\n    #bhp-ui input[type=range]{height:4px;border-radius:0}\n    #bhp-ui input[type=range]::-webkit-slider-thumb{width:18px;height:18px;border-radius:0;transform:rotate(45deg)}\n    #bhp-ui input[type=range]:active::-webkit-slider-thumb{transform:rotate(45deg) scale(1.15)}\n    #bhp-ui input[type=range]::-moz-range-thumb{width:16px;height:16px;border-radius:0;transform:rotate(45deg)}\n    /* labels: wider tracking reads more \"instrument panel\" */\n    #bhp-ui .readout .k,#bhp-ui .betctl .bv .k,#bhp-ui .poptitle,#bhp-ui .thead{letter-spacing:.18em}\n    /* --- responsive --------------------------------------------------------------------------- */\n    @media (max-width:720px){\n      #bhp-ui{--uiscale:1.02}\n      #bhp-ui .cluster{gap:8px;bottom:14px}\n      #bhp-ui .cluster.left{left:10px}#bhp-ui .cluster.right{right:10px}\n      #bhp-ui .pop{bottom:156px}\n      #bhp-ui .logo img{height:36px}\n      #bhp-ui .readout{min-width:0;padding:6px 11px 7px}#bhp-ui .readout .v{font-size:15px}\n      #bhp-ui .ic{width:40px;height:40px}#bhp-ui .ic.sm{width:36px;height:36px}\n      #bhp-ui .spin{width:64px;height:64px}#bhp-ui .spin svg{width:28px;height:28px}\n      #bhp-ui .betctl .arw{width:30px;height:30px}#bhp-ui .betctl .bv{min-width:62px}\n      #bhp-ui .winmid{padding:5px 20px 7px}#bhp-ui .winmid .v{font-size:22px}#bhp-ui .winmid .k{font-size:10px}\n    }\n    @media (max-width:440px){\n      #bhp-ui{--uiscale:1}\n      #bhp-ui .cluster{gap:6px}\n      #bhp-ui .logo .ll{display:none}#bhp-ui .logo img{height:32px}#bhp-ui .buybg{padding:6px 10px}\n      #bhp-ui .balrk{display:none}\n      #bhp-ui .ic.sm{width:34px;height:34px}\n      #bhp-ui .pop.menupop{left:10px}#bhp-ui .pop.betpop{right:10px}\n    }\n    /* bonus menu on shorter desktop screens (e.g. 1366x768): smaller cards */\n    @media (max-height:860px){\n      #bhp-ui .card.wide{padding:18px 22px}\n      #bhp-ui .card.wide p.sub{margin-bottom:12px}\n      #bhp-ui .tgroup + .tgroup{margin-top:12px}\n      #bhp-ui .tier{padding:12px 10px 11px;gap:5px}\n      #bhp-ui .tier .scwrap{height:46px}\n      #bhp-ui .tier .sc{width:36px;height:36px;margin-left:-12px}\n      #bhp-ui .tier .emb{width:46px;height:46px}\n      #bhp-ui .tier .teff{min-height:0}\n      #bhp-ui .card.wide .close{margin-top:12px;padding:11px}\n    }\n    @media (max-height:660px){\n      #bhp-ui .card.wide{padding:14px 18px}\n      #bhp-ui .card.wide h2{font-size:20px}\n      #bhp-ui .card.wide p.sub{font-size:13px;margin-bottom:9px}\n      #bhp-ui .card.wide .thead{margin-bottom:6px}\n      #bhp-ui .tier{padding:9px 8px 8px;gap:4px}\n      #bhp-ui .tier .scwrap{height:36px}\n      #bhp-ui .tier .sc{width:30px;height:30px;margin-left:-10px}\n      #bhp-ui .tier .emb{width:36px;height:36px}\n      #bhp-ui .tier .tprice{font-size:14px;padding:4px 12px}\n      #bhp-ui .card.wide .close{margin-top:10px;padding:9px}\n    }\n    @media (max-height:560px){\n      #bhp-ui .pop{bottom:118px;gap:9px;padding:12px 12px 10px;max-height:calc(100dvh - 130px);overflow-y:auto}\n    }\n    @media (max-width:620px), (max-height:560px){\n      #bhp-ui .card{width:min(94vw,520px);padding:18px 16px;max-height:92vh;overflow-y:auto;border-radius:0}\n      #bhp-ui .card.wide{width:min(94vw,900px)}\n      #bhp-ui .card h2{font-size:20px}\n      #bhp-ui .card p.sub{font-size:13px;margin-bottom:12px}\n      #bhp-ui .tiers{gap:8px}\n      #bhp-ui .tier{padding:10px 8px 9px;gap:4px}\n      #bhp-ui .tier .tname{font-size:13px}\n      #bhp-ui .tier .teff{font-size:11px}\n      #bhp-ui .tier .tprice{font-size:14px;padding:4px 12px}\n      #bhp-ui .tier .scwrap{height:46px}\n      #bhp-ui .tier .sc{width:34px;height:34px;margin-left:-11px}\n      #bhp-ui .tier .emb{width:46px;height:46px}\n      #bhp-ui .tier .teff{min-height:0}\n      #bhp-ui .confirmcard h2{font-size:22px}\n      #bhp-ui .confirmtxt{font-size:15px;margin-bottom:16px}\n      #bhp-ui .info{max-height:68vh}\n      #bhp-ui .paytbl td.sym img{width:22px;height:22px}\n    }\n    /* very short screens (landscape phones): cards down to emblem, name and price -\n       the effect text moves to the confirmation dialog */\n    @media (max-height:480px){\n      #bhp-ui .card.wide{padding:10px 14px}\n      #bhp-ui .card.wide h2{font-size:17px;margin-bottom:6px}\n      #bhp-ui .card.wide p.sub, #bhp-ui .tier .teff{display:none}\n      #bhp-ui .card.wide .thead{margin-bottom:5px;font-size:10px}\n      #bhp-ui .tgroup + .tgroup{margin-top:7px}\n      #bhp-ui .tier{padding:6px 6px 6px;gap:3px;border-radius:0}\n      #bhp-ui .tier .scwrap{height:30px}\n      #bhp-ui .tier .sc{width:26px;height:26px;margin-left:-9px}\n      #bhp-ui .tier .emb{width:30px;height:30px}\n      #bhp-ui .tier .scount{font-size:8px;padding:2px 7px}\n      #bhp-ui .tier .tname{font-size:12px}\n      #bhp-ui .tier .tprice{font-size:13px;padding:3px 10px}\n      #bhp-ui .card.wide .close{margin-top:8px;padding:8px}\n    }\n    /* phones (portrait): a compact list - one row per option: emblem | tag + name | price\n       (the effect text is in the confirmation dialog; shown here only on very tall screens) */\n    @media (max-width:620px){\n      #bhp-ui .tiers{grid-template-columns:minmax(0,1fr);gap:6px}\n      #bhp-ui .tier{display:grid;grid-template-columns:72px minmax(0,1fr) auto;grid-template-areas:\"em tag price\" \"em name price\" \"em eff price\";\n        align-items:center;justify-items:start;column-gap:10px;row-gap:2px;padding:6px 12px 6px 8px;border-radius:0;\n        background:radial-gradient(90% 140% at 0% 50%,color-mix(in srgb,var(--glow) 24%,transparent),transparent 60%),rgba(215,245,240,.05)}\n      #bhp-ui .tier:hover{transform:none}\n      #bhp-ui .tier .scwrap{grid-area:em;height:36px;width:72px}\n      #bhp-ui .tier .sc{width:26px;height:26px;margin-left:-15px}\n      #bhp-ui .tier .emb{width:34px;height:34px}\n      #bhp-ui .tier .scount{grid-area:tag;font-size:8px;padding:1px 7px}\n      #bhp-ui .tier .tname{grid-area:name;text-align:left;font-size:13px}\n      #bhp-ui .tier .teff{grid-area:eff;text-align:left;display:none}\n      #bhp-ui .tier .tprice{grid-area:price;margin:0;font-size:14px;padding:4px 12px}\n      #bhp-ui .card.wide .close{margin-top:10px;padding:10px}\n      #bhp-ui .card.wide p.sub{margin-bottom:10px}\n    }\n    @media (max-width:620px) and (min-height:900px){\n      #bhp-ui .tier .teff{display:block}\n    }\n\n    /* ================= Norse UI frame (user 2026-10-01) =================================\n       The art's slate bars, gold trim and triquetra corner knots frame every control: a\n       9-slice border-image (slice 84 of 464x456) whose fill is baked in - dark slate for\n       surfaces, gold for primary actions. --fw = the rendered frame width per element.\n       Replaces the glass blur + drawn corner brackets; shadows follow the frame's outline. */\n    #bhp-ui{--fr-dark:url(assets/images/ui/uiframe_dark.png);--fr-gold:url(assets/images/ui/uiframe_gold.png);\n      --fr-shadow:drop-shadow(0 6px 12px rgba(0,0,0,.5))}\n    #bhp-ui .ic,#bhp-ui .readout,#bhp-ui .buybg,#bhp-ui .betctl,#bhp-ui .winmid,#bhp-ui .pop,#bhp-ui .card,#bhp-ui .tier,\n    #bhp-ui .chips button,#bhp-ui .close,#bhp-ui .cbtn,#bhp-ui .infobtn,#bhp-ui .toast,#bhp-ui .jurisbar,#bhp-ui .fatalcard,#bhp-ui .spin{\n      background:none;border-style:solid;border-color:transparent;border-width:var(--fw,12px);border-radius:0;\n      border-image:var(--fr-dark) 20 fill / var(--fw,12px) / 0 stretch;\n      -webkit-backdrop-filter:none;backdrop-filter:none;box-shadow:none;filter:var(--fr-shadow)}\n    #bhp-ui .ic:hover,#bhp-ui .chips button:hover,#bhp-ui .close:hover,#bhp-ui .cbtn.cancel:hover,#bhp-ui .infobtn:hover,\n    #bhp-ui .buybg:hover,#bhp-ui .tier:hover{background:none;box-shadow:none;filter:var(--fr-shadow)}\n    /* Hover WITHOUT re-rendering the frame (user 2026-10-01: \"laggy on hover\"): changing\n       the filter on hover re-rasterised the whole border-image + drop-shadow every time. Now\n       the shadow never changes; a light overlay inside the frame fades in by OPACITY only,\n       and lift / press moves run on their own GPU layers (will-change: transform). */\n    #bhp-ui .ic,#bhp-ui .buybg,#bhp-ui .tier,#bhp-ui .chips button,#bhp-ui .close,#bhp-ui .cbtn,#bhp-ui .infobtn,#bhp-ui .spin{\n      position:relative;will-change:transform;transition:transform .2s var(--spring)}\n    #bhp-ui .ic::before,#bhp-ui .buybg::before,#bhp-ui .tier::before,#bhp-ui .chips button::before,#bhp-ui .close::before,\n    #bhp-ui .cbtn::before,#bhp-ui .infobtn::before{content:'';position:absolute;inset:0;pointer-events:none;opacity:0;\n      background:radial-gradient(farthest-corner at 50% 35%,rgba(160,245,226,.24),rgba(160,245,226,.11));\n      transition:opacity .18s var(--ease);will-change:opacity}\n    #bhp-ui .ic:hover::before,#bhp-ui .buybg:hover::before,#bhp-ui .tier:hover::before,#bhp-ui .chips button:hover::before,\n    #bhp-ui .close:hover::before,#bhp-ui .cbtn:hover::before,#bhp-ui .infobtn:hover::before{opacity:1}\n    /* frame glows fill the WHOLE stone panel (user 2026-10-01): the art's interior starts at\n       ~55% of the frame width (the bars' inner edge), so the overlays reach 45% into the border\n       area, with the corners cut where the knots are */\n    #bhp-ui .ic::before,#bhp-ui .buybg::before,#bhp-ui .tier::before,#bhp-ui .tier::after,#bhp-ui .chips button::before,\n    #bhp-ui .close::before,#bhp-ui .cbtn::before,#bhp-ui .infobtn::before{\n      --gi:calc(var(--fw,12px) * -0.45);--gc:calc(var(--fw,12px) * 0.5);inset:var(--gi);\n      clip-path:polygon(var(--gc) 0,calc(100% - var(--gc)) 0,100% var(--gc),100% calc(100% - var(--gc)),calc(100% - var(--gc)) 100%,var(--gc) 100%,0 calc(100% - var(--gc)),0 var(--gc))}\n    #bhp-ui .cbtn.go::before{background:radial-gradient(farthest-corner at 50% 35%,rgba(255,255,255,.32),rgba(255,255,255,.12))}\n    /* primary actions + active toggles: the gold-filled frame */\n    #bhp-ui .spin,#bhp-ui .cbtn.go,#bhp-ui .ic.on{border-image-source:var(--fr-gold);color:#2a1706}\n    #bhp-ui .cbtn.go:hover{filter:var(--fr-shadow)}\n    /* sizes */\n    #bhp-ui .ic{--fw:10px;width:48px;height:48px}\n    #bhp-ui .ic.sm{--fw:10px;width:44px;height:44px}\n    #bhp-ui .readout{--fw:11px;padding:1px 8px 2px}\n    #bhp-ui .buybg{--fw:11px;padding:1px 8px 3px}\n    #bhp-ui .betctl{--fw:11px;padding:0 1px;gap:4px}\n    #bhp-ui .betctl .arw{width:30px;height:30px;background:rgba(200,250,236,.08)}\n    #bhp-ui .betctl .arw:hover{background:rgba(200,250,236,.16)}\n    #bhp-ui .winmid{--fw:13px;padding:0 16px 2px}\n    #bhp-ui .pop{--fw:22px;padding:2px 4px 0}\n    #bhp-ui .card{--fw:30px;padding:2px 6px}\n    #bhp-ui .card.wide{padding:0 4px}\n    #bhp-ui .chips button{--fw:10px;padding:7px 4px}\n    #bhp-ui .close{--fw:12px;padding:5px;margin-top:14px}\n    #bhp-ui .cbtn{--fw:12px;padding:6px}\n    #bhp-ui .infobtn{--fw:10px;padding:4px}\n    #bhp-ui .toast{--fw:12px;padding:3px 14px}\n    #bhp-ui .jurisbar{--fw:9px;padding:0 8px}\n    #bhp-ui .fatalcard{--fw:28px;padding:8px 10px}\n    /* spin: the gold-framed tile; the frame replaces the inset line */\n    #bhp-ui .spin{--fw:14px;width:84px;height:84px}\n    #bhp-ui .spin::before{display:none}\n    #bhp-ui .spin::after{inset:-6px;border-color:rgba(130,240,208,.5)}\n    #bhp-ui .spin .sv{inset:0}\n    #bhp-ui .spin .skl{display:none;position:absolute;inset:0;align-items:center;justify-content:center;\n      font-family:var(--display);font-size:17px;font-weight:900;letter-spacing:.12em;padding-left:.12em;color:#2a1706}\n    #bhp-ui .spin.skip .skl{display:flex}\n    #bhp-ui .spin.skip .sv,#bhp-ui .spin.skip .cnt{visibility:hidden}\n    #bhp-ui .spin.skip::after{animation:bhphalo 1.6s var(--ease) infinite;opacity:1}\n    #bhp-ui .spin.armed{filter:var(--fr-shadow) drop-shadow(0 0 12px var(--arm,#c2318a))}\n    #bhp-ui .spin:disabled{filter:var(--fr-shadow) saturate(.75) brightness(.92)}\n    #bhp-ui .spin.cantbet{filter:var(--fr-shadow) grayscale(.6) brightness(.85)}\n    /* armed logo tile: its knots glow in the mode colour */\n    #bhp-ui .buybg:has(.logo.armed){filter:var(--fr-shadow) drop-shadow(0 0 10px var(--arm,#c2318a))}\n    /* bonus-menu cards: the mode's colour as a glow INSIDE the frame (over the baked fill) */\n    #bhp-ui .tier{--fw:16px;padding:4px 4px 6px;overflow:visible}\n    #bhp-ui .tier::after{content:'';position:absolute;pointer-events:none;\n      background:radial-gradient(farthest-corner at 50% 0%,color-mix(in srgb,var(--glow) 32%,transparent),color-mix(in srgb,var(--glow) 9%,transparent))}\n    #bhp-ui .tier>*{position:relative;z-index:1}\n    #bhp-ui .tier:hover{filter:var(--fr-shadow)}\n    #bhp-ui .tier::before{z-index:1;background:radial-gradient(farthest-corner at 50% 25%,color-mix(in srgb,var(--glow) 34%,transparent),color-mix(in srgb,var(--glow) 14%,transparent))}\n    @media (max-width:720px){\n      #bhp-ui .ic{--fw:9px;width:42px;height:42px}#bhp-ui .ic.sm{--fw:9px;width:38px;height:38px}\n      #bhp-ui .spin{--fw:12px;width:70px;height:70px}\n      #bhp-ui .card{--fw:22px}\n      #bhp-ui .winmid{--fw:9px;padding:0 8px 1px}\n      #bhp-ui .winmid .k{font-size:9px}\n    }\n    @media (max-width:440px){ #bhp-ui .ic.sm{width:36px;height:36px} }\n    @media (max-width:620px) and (max-height:740px){ #bhp-ui .card.wide p.sub{display:none} }\n    @media (max-height:660px){\n      #bhp-ui .card{--fw:22px}#bhp-ui .card.wide{padding:0 2px}\n      #bhp-ui .tier{--fw:12px;padding:2px 2px 4px}\n      #bhp-ui .close{--fw:10px;padding:3px;margin-top:8px}\n    }\n    @media (max-height:480px){\n      #bhp-ui .card{--fw:12px}\n      #bhp-ui .tier{--fw:8px;padding:0 1px 2px}\n      #bhp-ui .close{--fw:8px;padding:1px;margin-top:5px}\n      #bhp-ui .tgroup + .tgroup{margin-top:4px}\n      #bhp-ui .card.wide h2{margin-bottom:2px}\n      #bhp-ui .card.wide .thead{margin-bottom:3px}\n    }\n    @media (max-width:620px){\n      #bhp-ui .card{--fw:18px}\n      #bhp-ui .tier{--fw:7px;padding:0 6px 0 2px}\n      #bhp-ui .tier .scwrap{height:32px}\n      #bhp-ui .tiers{gap:5px}\n      #bhp-ui .close{--fw:9px;padding:2px;margin-top:8px}\n      #bhp-ui .tier::after{background:radial-gradient(farthest-corner at 0% 50%,color-mix(in srgb,var(--glow) 28%,transparent),color-mix(in srgb,var(--glow) 8%,transparent))}\n    }\n    @media (prefers-reduced-motion:reduce){\n      #bhp-ui *,#bhp-ui *::after{animation:none!important;transition-duration:.01s!important}\n    }\n";

  var SVG = function (w, body, fill) {
    return '<svg viewBox="0 0 24 24" width="' + w + '" height="' + w + '" fill="' + (fill ? 'currentColor' : 'none') + '" stroke="' + (fill ? 'none' : 'currentColor') +
      '" stroke-width="2" stroke-linecap="butt" stroke-linejoin="miter">' + body + '</svg>';
  };
  var ICON = {
    bolt: SVG(22, '<path d="M14 2 4.5 13.5H11L10 22l9.5-11.5H13z"/>', true),
    menu: SVG(22, '<path d="M4 7h16M4 12h16M4 17h16"/>'),
    left: SVG(18, '<path d="M6 12h12"/>'),
    right: SVG(18, '<path d="M12 6v12M6 12h12"/>'),
    sfx: SVG(20, '<path d="M4 9.5v5h3.5L12 19V5L7.5 9.5z"/><path d="M15.5 9a4 4 0 0 1 0 6M18.3 6.5a7.5 7.5 0 0 1 0 11"/>'),
    music: SVG(20, '<path d="M9 18V6l10-2v12"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="16.5" cy="16" r="2.5"/>'),
    info: SVG(18, '<rect x="3.5" y="3.5" width="17" height="17"/><path d="M12 10.5v6.5M12 7v1.6"/>'),
    globe: SVG(18, '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c3 3 3 14 0 17M12 3.5c-3 3-3 14 0 17"/>')
  };
  var LANG_NAMES = { en: 'English', fr: 'Français', sp: 'Español', es: 'Español', zh: '中文', ja: '日本語', ko: '한국어', vi: 'Tiếng Việt', id: 'Bahasa', it: 'Italiano', pt: 'Português', tr: 'Türkçe', ar: 'العربية' };
  var FLIGHT = [31 / 76, 31 / 76];

  function el(html) { var d = document.createElement('div'); d.innerHTML = html.trim(); return d.firstElementChild; }
  function bc() { return (window.gameplayState && gameplayState._buttonClass) || null; }
  function g() { return window.game; }
  function money(v) { try { return GlobalClass.getFormatCurrency(v); } catch (e) { return String(v); } }
  function xml(key, fallback) {
    try { var t = GlobalClass.getXMLByKey(g(), key); return (t && t.indexOf('undefined') < 0) ? String(t).toUpperCase() : fallback; } catch (e) { return fallback; }
  }
  function press(key) { var b = bc(); if (b) b.btnClick({ btnKey: key }); }

  var UI = {
    root: null, built: false, lastWin: 0, winTimer: 0, spinning: false,

    build: function () {
      if (this.built) return;
      this.built = true;
      var font = document.createElement('style');
      font.textContent = "@font-face{font-family:'BHPGame';src:url('assets/fonts/ragui.otf') format('opentype');font-display:swap}";
      document.head.appendChild(font);
      var s = document.createElement('style'); s.textContent = CSS + this.extraCss(); document.head.appendChild(s);

      var root = this.root = document.createElement('div');
      root.id = 'bhp-ui'; root.classList.add('prestart');
      document.body.appendChild(root);
      // keep the overlay's pointer events away from the canvas: PIXI listens for pointer up/move on the
      // window and would hit-test the (hidden) canvas controls under the HTML ones
      ['pointerdown', 'pointerup', 'pointermove', 'pointercancel', 'mousedown', 'mouseup', 'mousemove', 'touchstart', 'touchend', 'touchmove'].forEach(function (t) {
        root.addEventListener(t, function (e) { if (e.target !== root) e.stopPropagation(); });
      });

      var left = el('<div class="cluster left" id="bhp-left">' +
        '<div class="ic sm" id="bhp-menu" title="Menu">' + ICON.menu + '</div>' +
        '<div class="lstack">' +
        '<div class="readout" id="bhp-balr"><span class="k balrk" id="bhp-balk">BALANCE</span><span class="v" id="bhp-bal">—</span>' +
        '<span class="k balrk fsr" id="bhp-fsr" style="display:none"><span id="bhp-fsl">FREE SPINS</span> <b id="bhp-fs" style="color:#ffd54a">0</b></span></div>' +
        '</div></div>');
      var right = el('<div class="cluster right" id="bhp-right"><div class="rcol"><div class="rtop">' +
        '<button class="spin" id="bhp-spin" title="Spin"><span class="sv"></span><span class="cnt" style="display:none"></span><span class="skl">SKIP</span></button>' +
        '<div class="rside"><div class="ic sm" id="bhp-speed" title="Turbo">' + ICON.bolt + '</div></div>' +
        '</div><div class="betctl" id="bhp-betctl">' +
        '<button class="arw" id="bhp-betdn" title="Lower bet">' + ICON.left + '</button>' +
        '<div class="bv" id="bhp-betnum" title="Change bet"><div class="k" id="bhp-betk">BET</div><div class="v" id="bhp-bet">—</div></div>' +
        '<button class="arw" id="bhp-betup" title="Raise bet">' + ICON.right + '</button>' +
        '</div></div></div>');
      var winmid = el('<div class="winmid" id="bhp-winmid"><div class="k" id="bhp-wink">WIN</div><div class="v" id="bhp-win">$0.00</div></div>');
      root.appendChild(left); root.appendChild(right); root.appendChild(winmid);

      this.menuBtn = left.querySelector('#bhp-menu');
      this.balEl = left.querySelector('#bhp-bal');
      this.fsReadout = left.querySelector('#bhp-fsr');
      this.fsEl = left.querySelector('#bhp-fs');
      this.betCtl = right.querySelector('#bhp-betctl');
      this.betEl = right.querySelector('#bhp-bet');
      this.spinBtn = right.querySelector('#bhp-spin');
      this.speedBtn = right.querySelector('#bhp-speed');
      this.winMid = winmid; this.winEl = winmid.querySelector('#bhp-win');
      this.betDn = right.querySelector('#bhp-betdn'); this.betUp = right.querySelector('#bhp-betup');

      if (window.SpinGlyph) {
        this.glyph = new SpinGlyph();
        this.spinBtn.querySelector('.sv').appendChild(this.glyph.el);
        var self0 = this;
        requestAnimationFrame(function () { self0.glyph.setFlight(FLIGHT[0], FLIGHT[1]); });
      }

      var self = this;
      this.menuBtn.addEventListener('click', function (e) { e.stopPropagation(); self.togglePop(self.menuPop); });
      this.speedBtn.addEventListener('click', function () {
        GlobalClass.CONFIG_QUICKSPIN = !GlobalClass.CONFIG_QUICKSPIN;
        GlobalClass.updateSettings('QuickSpin', GlobalClass.CONFIG_QUICKSPIN);
        self.speedBtn.classList.toggle('on', !!GlobalClass.CONFIG_QUICKSPIN);
      });
      this.spinBtn.addEventListener('click', function () { self.triggerSpin(); });
      this.betDn.addEventListener('click', function (e) { e.stopPropagation(); press('minusBet'); self.openPop(self.betPop); });
      this.betUp.addEventListener('click', function (e) { e.stopPropagation(); press('plusBet'); self.openPop(self.betPop); });
      right.querySelector('#bhp-betnum').addEventListener('click', function (e) { e.stopPropagation(); self.togglePop(self.betPop); });
      window.addEventListener('pointerdown', function (e) {
        var t = e.target;
        if (self.betPop.classList.contains('show') && !self.betPop.contains(t) && !self.betCtl.contains(t)) self.hidePop(self.betPop);
        if (self.menuPop.classList.contains('show') && !self.menuPop.contains(t) && !self.menuBtn.contains(t)) self.hidePop(self.menuPop);
      });
      this.buildPopovers();
      window.addEventListener('resize', function () { self.place(); });
    },

    extraCss: function () {
      return '\n#bhp-ui .langrow{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px}' +
        '\n#bhp-ui .langbtn{pointer-events:auto;cursor:pointer;color:var(--ink);font-weight:600;font-size:13px;padding:4px;' +
        'background:none;border-style:solid;border-color:transparent;border-width:9px;border-image:var(--fr-dark) 20 fill / 9px / 0 stretch;filter:var(--fr-shadow);' +
        'transition:transform .2s var(--spring)}' +
        '\n#bhp-ui .langbtn:active{transform:scale(.95)}' +
        '\n#bhp-ui .langbtn.on{border-image-source:var(--fr-gold);color:#2a1706}' +
        '\n#bhp-ui .poptitle .gi{display:inline-flex;vertical-align:-3px;margin-right:6px;opacity:.8}' +
        '\n#bhp-ui .betpop .row.k2{margin-top:-6px}' +
        '\n#bhp-ui .card.infocard{width:min(720px,94%);--fw:14px;max-height:92%;display:flex;flex-direction:column;padding:10px 18px 12px}' +
        '\n#bhp-ui .card.infocard .info{max-height:none;flex:1 1 auto;min-height:0}' +
        '\n#bhp-ui .card.infocard .close{flex:0 0 auto;align-self:center;width:220px;margin-top:10px;--fw:10px;min-height:42px;padding:2px;border-image-source:var(--fr-gold);color:#2a1706;font-weight:700;font-size:14px;letter-spacing:.14em;text-transform:uppercase}' +
        '\n#bhp-ui .card.infocard .close::before{display:none}' +
        '\n#bhp-ui .info{font-size:14px;color:rgba(247,239,224,.86)}' +
        '\n#bhp-ui .info .isym{width:22px;height:22px;object-fit:contain;vertical-align:-6px;margin:0 2px}' +
        '\n#bhp-ui .info ul{margin:6px 0 12px;padding-left:18px}' +
        '\n#bhp-ui .info li{margin:5px 0;line-height:1.55}' +
        '\n#bhp-ui .info li::marker{color:var(--gold)}' +
        '\n#bhp-ui .paytbl td.sym img{width:38px;height:38px;object-fit:contain;margin:0}' +
        '\n#bhp-ui .paytbl td{color:var(--goldhi)}' +
        '\n#bhp-ui .paytbl .nil{color:var(--faint)}' +
        '\n#bhp-ui .paytbl.mini{margin:6px 0 4px;max-width:360px}' +
        '\n#bhp-ui .info .feat{display:flex;gap:14px;align-items:flex-start;margin:14px 0;padding:10px 12px;background:rgba(255,240,215,.04);border:1px solid rgba(255,214,140,.14)}' +
        '\n#bhp-ui .info .feat>img{width:64px;height:64px;object-fit:contain;flex:0 0 64px}' +
        '\n#bhp-ui .info .feat b{color:var(--goldhi);letter-spacing:.04em}' +
        '\n#bhp-ui .info .feat ul{margin:4px 0 0}' +
        '\n#bhp-ui .info .jprow{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;margin:6px 0 4px}' +
        '\n#bhp-ui .info .jpimg{width:100%;height:auto}' +
        '\n#bhp-ui .info .plwrap{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:10px 12px;margin:8px 0 6px}' +
        '\n#bhp-ui .info .pl{display:flex;align-items:center;gap:6px}' +
        '\n#bhp-ui .info .pl span{width:18px;text-align:right;font-size:11px;color:var(--muted);font-variant-numeric:tabular-nums}' +
        '\n#bhp-ui .info .plg{display:grid;grid-template-columns:repeat(5,9px);grid-auto-rows:9px;gap:2px;padding:3px;background:rgba(0,0,0,.35);border:1px solid rgba(255,214,140,.18)}' +
        '\n#bhp-ui .info .plg i{background:rgba(255,240,215,.08)}' +
        '\n#bhp-ui .info .plg i.on{background:linear-gradient(180deg,#ffe9b4,#c9893a)}' +
        '\n#bhp-ui .close::after{display:none!important}' +
        '\n#bhp-ui .close::before{transform:none!important}' +
        // WIN capsule: smaller and under the game messages line (tom 2026-10-04)
        '\n#bhp-ui .winmid{--ws:.66;bottom:0;transform-origin:50% 100%}';
    },

    buildPopovers: function () {
      var self = this;
      var langs = (GlobalClass.GAME_LANGS || ['en']);
      var langHtml = langs.map(function (l) { return '<button class="langbtn" data-lang="' + l + '">' + (LANG_NAMES[l] || l.toUpperCase()) + '</button>'; }).join('');
      var menupop = el('<div class="pop menupop" id="bhp-menupop">' +
        '<div class="poptitle">AUDIO</div>' +
        '<div class="audiorow"><span class="ai" title="Sound effects">' + ICON.sfx + '</span><input type="range" min="0" max="100" value="100" id="bhp-sfxsl"></div>' +
        '<div class="audiorow"><span class="ai" title="Music">' + ICON.music + '</span><input type="range" min="0" max="100" value="100" id="bhp-musicsl"></div>' +
        '<div class="poptitle"><span class="gi">' + ICON.globe + '</span>LANGUAGE</div>' +
        '<div class="langrow">' + langHtml + '</div>' +
        '<button class="infobtn" id="bhp-infobtn">' + ICON.info + ' Game Info</button>' +
        '</div>');
      this.root.appendChild(menupop); this.menuPop = menupop;
      var sfx = menupop.querySelector('#bhp-sfxsl'), mus = menupop.querySelector('#bhp-musicsl');
      sfx.value = Math.round(100 * (GlobalClass.GAME_SOUND_BAR_X != null ? GlobalClass.GAME_SOUND_BAR_X : 1));
      sfx.addEventListener('input', function () { self.fill(sfx); self.setSound(Number(sfx.value) / 100); });
      mus.addEventListener('input', function () { self.fill(mus); self.setMusic(Number(mus.value) / 100); });
      this.fill(sfx); this.fill(mus);
      menupop.querySelector('#bhp-infobtn').addEventListener('click', function () { self.hidePop(menupop); self.showInfo(); });
      Array.prototype.forEach.call(menupop.querySelectorAll('.langbtn'), function (b) {
        b.addEventListener('click', function () { self.setLang(b.getAttribute('data-lang')); });
      });
      this.markLang();

      var betpop = el('<div class="pop betpop" id="bhp-betpop">' +
        '<div class="poptitle" id="bhp-betpt">BET AMOUNT</div>' +
        '<input type="range" id="bhp-betslider" min="0" max="1" step="1" value="0">' +
        '<div class="row"><span id="bhp-betmin"></span><span id="bhp-betpopval"></span><span id="bhp-betmax"></span></div>' +
        '<div class="poptitle" id="bhp-coinpt">BET MULTIPLIER</div>' +
        '<input type="range" id="bhp-coinslider" min="0" max="1" step="1" value="0">' +
        '<div class="row k2"><span id="bhp-coinmin"></span><span id="bhp-coinpopval"></span><span id="bhp-coinmax"></span></div>' +
        '</div>');
      this.root.appendChild(betpop); this.betPop = betpop;
      this.betSlider = betpop.querySelector('#bhp-betslider'); this.coinSlider = betpop.querySelector('#bhp-coinslider');
      this.betSlider.addEventListener('input', function () {
        var b = bc(); if (!b || self.betLocked()) return;
        GlobalClass.GAME_BET_POS = Number(self.betSlider.value); b.setBet(); self.fill(self.betSlider);
      });
      this.coinSlider.addEventListener('input', function () {
        var b = bc(); if (!b || self.betLocked()) return;
        GlobalClass.GAME_COIN_POS = Number(self.coinSlider.value); b.setCoin(); self.fill(self.coinSlider);
      });
    },

    // ---- Game Info (tom 2026-10-04: "fix the design of the info panel, clean and modern, especially the text").
    // RAGNAROK's Game Info card: one scrolling sheet with clear headings, a symbol pay table, the features,
    // jackpots and paylines - built from the game's own paytable, bet and language text.
    INFO_IMG: 'assets/images/info/',
    PAYLINES: [[1,1,1,1,1],[0,0,0,0,0],[2,2,2,2,2],[0,1,2,1,0],[2,1,0,1,2],[1,0,0,0,1],[1,2,2,2,1],[0,0,1,2,2],[2,2,1,0,0],[2,1,1,1,2],
               [0,1,1,1,0],[0,1,0,1,0],[2,1,2,1,2],[1,0,1,0,1],[1,2,1,2,1],[0,2,2,2,0],[2,0,0,0,2],[0,2,0,2,0],[2,2,2,1,0],[2,1,1,1,0]],
    TOKENS: { '#SCATTER': 'Scatter', '#WILD': 'Wild', '#GIRL': 'pic1', '#HORSE': 'Pic02', '#GUN': 'Pic3', '#HANDWATCH': 'Pic4', '#JEWEL': 'pic05',
              '#JAC': 'J', '#A': 'A', '#K': 'K', '#Q': 'Q', '#10': '10', '#9': '9', '#SPECIALFRAME': 'specialframe' },
    infoText: function (raw) {
      if (!raw || raw === 'null') return '';
      var t = String(raw).replace(/#LISTITEM/g, '').replace(/\s+,/g, ',').replace(/\s{2,}/g, ' ').trim();
      t = t.replace(/&/g, '&amp;').replace(/</g, '&lt;');
      t = t.replace(/#GRAND/g, '<b>GRAND</b>').replace(/#MAJOR/g, '<b>MAJOR</b>').replace(/#MINOR/g, '<b>MINOR</b>').replace(/#MINI\b/g, '<b>MINI</b>');
      var self = this;
      Object.keys(this.TOKENS).sort(function (a, b) { return b.length - a.length; }).forEach(function (k) {
        t = t.split(k).join('<img class="isym" src="' + self.INFO_IMG + self.TOKENS[k] + '.png" alt="">');
      });
      return t;
    },
    infoItems: function (page, from, to) {
      var out = [];
      for (var j = from; j <= to; j++) {
        var raw = ''; try { raw = GlobalClass.getXMLByKey(g(), '[id="' + page + '"] line' + j); } catch (e) {}
        var txt = this.infoText(raw);
        if (!txt) continue;
        // continuation lines (no list marker in the source) join the previous bullet
        if (out.length && String(raw).indexOf('#LISTITEM') < 0) out[out.length - 1] += ' ' + txt; else out.push(txt);
      }
      return out.map(function (l) { return '<li>' + l + '</li>'; }).join('');
    },
    infoLines: function (page, from, to) { return '<ul>' + this.infoItems(page, from, to) + '</ul>'; },
    payRows: function (names, scatter) {
      var pt = GlobalClass.GAME_PAYTABLE || {}, rows = [], self = this, cols = [5, 4, 3, 2];
      var unit = GlobalClass.getBetPerLine() * GlobalClass.getDenom() * GlobalClass.trueCoinValue() * (scatter ? GlobalClass.GAME_LINE : 1);
      names.forEach(function (n) {
        for (var id in pt) {
          var sym = GlobalClass.mathSymbol(id);
          if (sym.symbolPngName !== n + '_00.png') continue;
          var pays = pt[id];
          rows.push('<tr><td class="sym"><img src="' + self.INFO_IMG + n + '.png" alt=""></td>' + cols.map(function (k) {
            var v = (pays[k - 1] || 0) * unit;
            return '<td>' + (v ? money(v) : '<span class="nil">—</span>') + '</td>';
          }).join('') + '</tr>');
          break;
        }
      });
      return rows.join('');
    },
    showInfo: function () {
      var self = this;
      if (!this.infoPanel) {
        this.infoPanel = el('<div class="panel" id="bhp-infopanel"><div class="card infocard"><h2>Game Info</h2>' +
          '<p class="sub" id="bhp-infosub"></p><div class="info" id="bhp-info"></div><button class="close">Close</button></div></div>');
        this.root.appendChild(this.infoPanel);
        this.infoPanel.querySelector('.close').addEventListener('click', function () { self.infoPanel.classList.remove('show'); });
        this.infoPanel.addEventListener('click', function (e) { if (e.target === self.infoPanel) self.infoPanel.classList.remove('show'); });
      }
      var head = '<tr><th class="sym"></th><th>5×</th><th>4×</th><th>3×</th><th>2×</th></tr>';
      var I = this.INFO_IMG;
      var cap = function (t) { t = String(t || '').toLowerCase(); return t.charAt(0).toUpperCase() + t.slice(1); };
      var h3 = function (key, fb) { return '<h3>' + xml(key, fb) + '</h3>'; };
      var jp = ['grand', 'major', 'minor', 'mini'].map(function (t) { return '<img class="jpimg" src="' + I + 'jp_' + t + '.png" alt="' + t + '">'; }).join('');
      var lines = this.PAYLINES.map(function (p, i) {
        var cells = '';
        for (var r = 0; r < 3; r++) for (var c = 0; c < 5; c++) cells += '<i' + (p[c] === r ? ' class="on"' : '') + '></i>';
        return '<div class="pl"><span>' + (i + 1) + '</span><div class="plg">' + cells + '</div></div>';
      }).join('');
      var extra = '';
      try {
        extra += '<li>' + cap(GlobalClass.getXMLByKey(g(), 'minbet')) + ': <b>' + money(GlobalClass.minBet()) + '</b></li>';
        extra += '<li>' + cap(GlobalClass.getXMLByKey(g(), 'maxbet')) + ': <b>' + money(GlobalClass.maxBet()) + '</b></li>';
        if (AppConstants.showRtp) {
          extra += '<li>' + this.infoText(GlobalClass.getXMLByKey(g(), 'rtp').replace('{rtp}', Number(GlobalClass.getRTP()).toFixed(2))) + '</li>';
        }
      } catch (e) {}
      this.infoPanel.querySelector('#bhp-infosub').textContent = 'Symbol values, features and rules. Values are shown for your current bet.';
      this.infoPanel.querySelector('#bhp-info').innerHTML =
        '<h3>Symbol Values</h3>' +
        '<table class="paytbl">' + head + this.payRows(['pic1', 'Pic02', 'Pic3', 'Pic4', 'pic05', 'A', 'K', 'Q', 'J', '10', '9']) + '</table>' +
        '<div class="feat"><img src="' + I + 'Wild.png" alt=""><div><b>WILD</b>' + this.infoLines(1, 1, 2) + '</div></div>' +
        '<div class="feat"><img src="' + I + 'Scatter.png" alt=""><div><b>FREE SPIN</b>' +
          '<table class="paytbl mini">' + head + this.payRows(['Scatter'], true) + '</table>' + this.infoLines(1, 3, 4) + '</div></div>' +
        '<div class="feat"><img src="' + I + 'pic1.png" alt=""><div><b>PIGGY BANK</b>' + this.infoLines(2, 1, 3) + '</div></div>' +
        h3('freegamesfeature', 'FREE GAMES FEATURE') + this.infoLines(4, 1, 4) +
        h3('jackportfeatrue', 'JACKPOT FEATURE') + '<div class="jprow">' + jp + '</div>' + this.infoLines(3, 1, 5) +
        h3('winline', 'WIN LINES') + '<div class="plwrap">' + lines + '</div>' +
        h3('gamerule', 'GAME RULES') + '<ul>' + this.infoItems(1, 5, 5) + this.infoItems(5, 1, 7) + this.infoItems(6, 1, 6) + extra + '</ul>';
      this.infoPanel.classList.add('show');
      this.infoPanel.querySelector('#bhp-info').scrollTop = 0;
    },

    fill: function (r) {
      var min = Number(r.min || 0), max = Number(r.max || 100);
      r.style.setProperty('--p', (max > min ? ((Number(r.value) - min) / (max - min)) * 100 : 0) + '%');
    },
    openPop: function (p) { p.classList.add('show'); },
    hidePop: function (p) { p.classList.remove('show'); },
    togglePop: function (p) { var on = p.classList.contains('show'); this.hidePop(this.betPop); this.hidePop(this.menuPop); if (!on) this.openPop(p); },

    setSound: function (v) {
      PIXI.sound.volumeAll = v;
      GlobalClass.GAME_SOUND_BAR_X = v;
      GlobalClass.updateSettings('Sound', v);
      var muted = v === 0;
      if (this._muted !== muted && AppConstants.PDXM) { AppConstants.PDXM.toggleAction('mute', muted); this._muted = muted; }
    },
    setMusic: function (v) {
      ['WWW_BGM', 'WWW_FreeSpin_BGM'].forEach(function (n) { try { PIXI.sound.volume(n, 0.2 * v); } catch (e) {} });
      GlobalClass.GAME_SOUND_VOLUME = v;
    },
    setLang: function (l) {
      GlobalClass.GAME_LANG = l;
      try { var b = bc(); if (b && b.changeLanguage) b.changeLanguage(); } catch (e) {}
      try { if (gameplayState._informationClass && gameplayState._informationClass.changeLanguage) gameplayState._informationClass.changeLanguage(); } catch (e) {}
      this.markLang(); this.labels();
    },
    markLang: function () {
      Array.prototype.forEach.call(this.menuPop.querySelectorAll('.langbtn'), function (b) { b.classList.toggle('on', b.getAttribute('data-lang') === GlobalClass.GAME_LANG); });
    },
    labels: function () {
      this.root.querySelector('#bhp-balk').textContent = xml('balance', 'BALANCE');
      this.root.querySelector('#bhp-betk').textContent = xml('totalbet', 'BET');
      this.root.querySelector('#bhp-wink').textContent = xml('win', 'WIN');
      this.root.querySelector('#bhp-fsl').textContent = xml('bottomfreespins', 'FREE SPINS');
      this.root.querySelector('#bhp-betpt').textContent = xml('bottombet', 'BET AMOUNT');
      this.root.querySelector('#bhp-coinpt').textContent = xml('bottombetmultiplier', 'BET MULTIPLIER');
    },

    betLocked: function () { var b = bc(); return !b || (b.betPlusBtnDisable && b.betPlusBtnDisable.visible && b.betMinBtnDisable && b.betMinBtnDisable.visible); },

    triggerSpin: function () {
      var b = bc(); if (!b) return;
      if (b._skipBtn && b._skipBtn.visible) { press('skip'); return; }
      if (b._stopBtn && b._stopBtn.visible) { press('stopautospin'); return; }
      if (b._spinBtn && b._spinBtn.visible && !(b._spinBtnDisable && b._spinBtnDisable.visible)) press('spin');
    },

    /** keep the layer exactly over the game canvas (the canvas is letterboxed inside the window) */
    place: function () {
      var c = document.querySelector('canvas'); if (!c || !this.root) return;
      var r = c.getBoundingClientRect();
      var sw = (window.game && game.app && game.app.renderer && game.app.renderer.screen) ? game.app.renderer.screen.width : c.width;
      var k = r.width / sw;                                       // css px per stage-space px (the buffer may be hi-dpi)
      // the 1280x720 stage sits inside the canvas (the engine letterboxes it): use the stage group's transform
      var t = (window.gameplayState && gameplayState._panelGroup && gameplayState._panelGroup.worldTransform) || { a: 1, d: 1, tx: 0, ty: 0 };
      var x = r.left + t.tx * k, y = r.top + t.ty * k, w = 1280 * t.a * k, h = 720 * t.d * k;
      var key = [x, y, w, h].map(Math.round).join(',');
      if (key === this._placed) return;
      this._placed = key;
      var st = this.root.style;
      st.left = x + 'px'; st.top = y + 'px'; st.width = w + 'px'; st.height = h + 'px'; st.right = 'auto'; st.bottom = 'auto';
      this.root.style.setProperty('--uiscale', String(1.12 * Math.min(w / 1280, h / 720)));
    },

    /** hide the canvas controls this layer replaces (the lobby button stays on the canvas) */
    hideCanvasUi: function (b) {
      var groups = [b._groupButton, b._grpNormal, b._grpFeature];
      for (var i = 0; i < groups.length; i++) { var gr = groups[i]; if (gr) { gr.renderable = false; gr.interactiveChildren = false; } }
      if (!this.home && b._groupButton) {
        var kids = b._groupButton.children.slice();
        for (var j = 0; j < kids.length; j++) {
          var k = kids[j], f = (k.texture && k.texture.frame && k.texture.frame.name) || k.frame || '';
          if (String(f).indexOf('home-button') === 0 || k.key === 'responsible_gambling' || k.key === 'freespins') {
            gameplayState.topGroup.addChild(k);
            if (String(f).indexOf('home-button') === 0) this.home = k;
          }
        }
      }
    },
    showCanvasUi: function (b) {
      var groups = [b._groupButton, b._grpNormal, b._grpFeature];
      for (var i = 0; i < groups.length; i++) { var gr = groups[i]; if (gr) { gr.renderable = true; gr.interactiveChildren = true; } }
    },

    tick: function () {
      var b = bc();
      var inGame = !!(b && b._spinBtn && window.gameplayState && gameplayState._reelClass && game.state && /gameplay/i.test(String(game.state.current || 'gameplay')));
      var land = !!AppConstants.LANDSCAPE;
      if (!inGame || !land) {
        if (this.root) this.root.classList.add('prestart');
        if (b && !land) this.showCanvasUi(b);
        return;
      }
      if (!this.built) { this.build(); this.labels(); }
      if (this.root.classList.contains('prestart')) { this.root.classList.remove('prestart'); this.place(); }
      this.hideCanvasUi(b);
      this.place();

      this.balEl.textContent = money(b._balanceValue || GlobalClass.GAME_BALANCE || 0);
      this.betEl.textContent = money(b._totalBetValue || 0);
      var w = Number(b._winValue || 0);
      if (w !== this.lastWin) {
        this.lastWin = w;
        if (w > 0) {
          this.winEl.textContent = money(w); this.winMid.classList.add('show');
          this.winEl.classList.remove('bump'); void this.winEl.offsetWidth; this.winEl.classList.add('bump');
          clearTimeout(this.winTimer);
        }
      }
      var spinning = !!(b._skipBtn && b._skipBtn.visible) || !!(b._spinBtnDisable && b._spinBtnDisable.visible && !(b._spinBtn && b._spinBtn.visible));
      this.spinBtn.classList.toggle('skip', !!(b._skipBtn && b._skipBtn.visible));
      this.spinBtn.disabled = !!(b._spinBtnDisable && b._spinBtnDisable.visible) && !(b._skipBtn && b._skipBtn.visible);
      if (spinning !== this.spinning) {
        this.spinning = spinning;
        this.spinBtn.classList.toggle('spinning', spinning);
        // the spin arrow stays still (tom 2026-10-04: no running-arrow animation)
        if (spinning && w === 0) { var self = this; this.winTimer = setTimeout(function () { self.winMid.classList.remove('show'); }, 150); }
      }
      this.speedBtn.classList.toggle('on', !!GlobalClass.CONFIG_QUICKSPIN);
      var fs = GlobalClass.GAME_MODE == GlobalClass.GAME_MODE_FEATURE1;
      this.fsReadout.style.display = fs ? '' : 'none';
      if (fs && b._freeSpinValueTxt) this.fsEl.textContent = b._freeSpinValueTxt.text;
      var locked = this.betLocked();
      this.betCtl.classList.toggle('disabled', locked || fs);
      this.betDn.disabled = !!(b.betMinBtnDisable && b.betMinBtnDisable.visible);
      this.betUp.disabled = !!(b.betPlusBtnDisable && b.betPlusBtnDisable.visible);
      // bet popover ranges follow the game's bet / coin tables
      var bets = GlobalClass.GAME_BET || [], coins = GlobalClass.GAME_COIN_VALUE || [];
      this.syncRange(this.betSlider, bets.length - 1, GlobalClass.GAME_BET_POS);
      this.syncRange(this.coinSlider, coins.length - 1, GlobalClass.GAME_COIN_POS);
      this.setText('#bhp-betmin', bets[0]); this.setText('#bhp-betmax', bets[bets.length - 1]); this.setText('#bhp-betpopval', bets[GlobalClass.GAME_BET_POS]);
      this.setText('#bhp-coinmin', coins[0]); this.setText('#bhp-coinmax', coins[coins.length - 1]); this.setText('#bhp-coinpopval', coins[GlobalClass.GAME_COIN_POS]);
      this.betSlider.disabled = this.coinSlider.disabled = locked || fs;
    },
    syncRange: function (r, max, v) {
      if (String(r.max) !== String(Math.max(0, max))) r.max = Math.max(0, max);
      if (document.activeElement !== r && String(r.value) !== String(v)) { r.value = v; }
      this.fill(r);
    },
    setText: function (sel, v) { var e = this.root.querySelector(sel); var t = v == null ? '' : String(v); if (e.textContent !== t) e.textContent = t; }
  };

  function loop() { try { UI.tick(); } catch (e) { if (!loop.warned) { console.warn('[ragui]', e); loop.warned = true; } } requestAnimationFrame(loop); }
  requestAnimationFrame(loop);
  window.BoarRagUI = UI;
})();
