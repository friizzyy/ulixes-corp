/*
 * Ulixes mockups, round 2: foundation.
 * Tokens, the three button systems, real site content, the live-site
 * sections kept as they are, and the page flows each area is previewed
 * inside. Every section renders in its own iframe, so one option's <style>
 * never leaks into its neighbours. The areas live in areas.js.
 */
window.BASE = `
:root{--mineral:#f3f1ec;--light:#faf9f6;--paper:#fffefb;--ink:#10212b;--ink2:#182c37;--graphite:#34434b;--steel:#5d6e75;--plat:#d7dcde;--rule:rgba(16,33,43,.12);--rule2:rgba(16,33,43,.2);--dark:#1a1b1d;--dark2:#222327;--drule:rgba(241,243,239,.14);--mist:#e9eff1;--line:#8ba0a9;--sage:#91a393;--clay:#ad9884;--ok:#4f8a5b;--ease:cubic-bezier(.16,1,.3,1)}
*{box-sizing:border-box;margin:0;padding:0}
html,body{background:var(--mineral)}
body{color:var(--ink);font:15px/1.6 Outfit,system-ui,sans-serif;-webkit-font-smoothing:antialiased;overflow-x:hidden}
img,video{display:block;max-width:100%}
a{color:inherit;text-decoration:none;cursor:pointer}
button{font:inherit;color:inherit;background:none;border:0;cursor:pointer}
.d{font-family:Archivo,sans-serif;font-weight:560;letter-spacing:-.045em;line-height:1.02}
/* The serif italic turn is gone: the second half of a headline now turns by tone, not by script. */
.s{font:inherit;letter-spacing:inherit;color:var(--steel)}
.m{font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:.02em}
.eb{display:flex;align-items:center;gap:12px;font-size:11px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:var(--steel)}
.eb:before{content:'';width:26px;height:1px;background:currentColor;opacity:.6}
.chip{display:inline-flex;align-items:center;gap:8px;padding:6px 12px;border-radius:999px;font-size:11px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;box-shadow:inset 0 0 0 1px var(--rule2);color:var(--graphite)}
.chip i{width:6px;height:6px;border-radius:50%;background:var(--ink)}
.tag{display:inline-flex;padding:5px 11px;border-radius:999px;font-size:12px;box-shadow:inset 0 0 0 1px var(--rule2);color:var(--graphite)}
.wrap{max-width:1312px;margin:0 auto;padding:0 64px}
.mute{color:var(--steel)}
.brand{display:flex;align-items:center;gap:10px}.brand svg{width:26px;height:26px}
.brand b{display:block;font-size:13px;letter-spacing:.2em;font-weight:700;line-height:1}.brand small{display:block;font-size:9px;letter-spacing:.24em;font-weight:600;color:var(--steel);margin-top:3px}
.tl{position:relative;display:inline-flex;gap:8px;align-items:center;font-weight:600;font-size:14px;padding-bottom:4px}
.tl:after{content:'';position:absolute;left:0;bottom:0;height:1px;width:34%;background:currentColor;transition:width .5s var(--ease)}
.tl:hover:after{width:100%}
`;

/*
 * Button systems. Markup everywhere is <a class="btn [lt|gh]"><span>Label</span><i>↗</i></a>,
 * so picking a system restyles every button in every flow.
 */
window.BTNCSS = {
  A: `
.btn{display:inline-flex;align-items:center;gap:16px;padding:6px 6px 6px 24px;border-radius:999px;background:var(--ink);color:var(--light);font-weight:600;font-size:14px;white-space:nowrap;box-shadow:0 18px 30px -22px rgba(16,33,43,.9);transition:background .3s,transform .5s var(--ease)}
.btn:hover{background:var(--ink2);transform:translateY(-1px)}
.btn i{display:grid;place-items:center;width:40px;height:40px;border-radius:50%;background:var(--light);color:var(--ink);font-style:normal;font-size:15px;transition:transform .6s var(--ease)}
.btn:hover i{transform:rotate(45deg)}
.btn.lt{background:var(--light);color:var(--ink)}.btn.lt i{background:var(--ink);color:var(--light)}
.btn.gh{background:transparent;color:inherit;box-shadow:inset 0 0 0 1px currentColor}.btn.gh i{background:transparent;box-shadow:inset 0 0 0 1px currentColor;color:inherit}
`,
  B: `
.btn{position:relative;display:inline-flex;align-items:stretch;height:54px;border-radius:3px;background:var(--ink);color:var(--light);font-weight:600;font-size:12.5px;letter-spacing:.09em;text-transform:uppercase;white-space:nowrap;overflow:hidden;isolation:isolate;box-shadow:0 18px 30px -24px rgba(16,33,43,.9)}
.btn:before{content:'';position:absolute;inset:0;z-index:-1;background:#25404d;transform:scaleX(0);transform-origin:left;transition:transform .6s var(--ease)}
.btn:hover:before{transform:none}
.btn span{display:flex;align-items:center;padding:0 24px}
.btn i{display:grid;place-items:center;width:54px;border-left:1px solid rgba(255,255,255,.16);font-style:normal;font-size:15px;transition:transform .6s var(--ease)}
.btn:hover i{transform:translateX(3px)}
.btn.lt{background:var(--light);color:var(--ink)}.btn.lt:before{background:var(--mist)}.btn.lt i{border-color:var(--rule2)}
.btn.gh{background:transparent;color:inherit;box-shadow:inset 0 0 0 1px currentColor}.btn.gh:before{background:rgba(127,140,146,.14)}.btn.gh i{border-color:currentColor}
`,
  C: `
.btn{display:inline-flex;align-items:center;gap:18px;padding:6px 6px 6px 22px;border-radius:12px;background:var(--ink);color:var(--light);font-weight:600;font-size:14px;white-space:nowrap;box-shadow:inset 0 1px 0 rgba(255,255,255,.12),0 18px 30px -22px rgba(16,33,43,.9)}
.btn span{display:inline-grid;overflow:hidden;height:1.5em;line-height:1.5em}
.btn span:before,.btn span:after{content:attr(data-t);grid-area:1/1;transition:transform .55s var(--ease)}
.btn span:after{transform:translateY(105%)}
.btn:hover span:before{transform:translateY(-105%)}.btn:hover span:after{transform:none}
.btn i{display:grid;place-items:center;width:38px;height:38px;border-radius:8px;background:rgba(255,255,255,.1);box-shadow:inset 0 0 0 1px rgba(255,255,255,.16);font-style:normal;font-size:14px;transition:background .3s,color .3s}
.btn:hover i{background:var(--light);color:var(--ink)}
.btn.lt{background:var(--light);color:var(--ink);box-shadow:inset 0 0 0 1px var(--rule),0 18px 30px -24px rgba(16,33,43,.5)}.btn.lt i{background:var(--mist);box-shadow:none}.btn.lt:hover i{background:var(--ink);color:var(--light)}
.btn.gh{background:transparent;color:inherit;box-shadow:inset 0 0 0 1px currentColor}.btn.gh i{background:transparent;box-shadow:inset 0 0 0 1px currentColor}
`,
};
/* The rolling label (C) reads its text from data-t. */
window.BTNJS = `<script>window.BT=()=>document.querySelectorAll('.btn span:not([data-t])').forEach(s=>{s.dataset.t=s.textContent.trim();s.textContent='';s.setAttribute('aria-label',s.dataset.t)});BT()</` + `script>`;

const U = '<svg viewBox="0 0 30 30" fill="currentColor"><path d="M4 3h6v14c0 4.1 1.8 6.2 5 6.2s5-2.1 5-6.2V3h6v14c0 7.5-4.2 11-11 11S4 24.5 4 17V3Z"/></svg>';
const BRAND = `<span class="brand">${U}<span><b>ULIXES</b><small>CORPORATION</small></span></span>`;
const BRANDL = `<span class="brand" style="color:#fff">${U}<span><b>ULIXES</b><small style="color:#d5dde0">CORPORATION</small></span></span>`;
const ARR = '↗';
const I = {
  sf: 'img/ulixes-san-francisco-blue-hour.webp', day: 'img/ulixes-financial-district-day.webp',
  uw: 'img/ulysses-williams.jpg', hall: 'img/ulixes-institutional-hall.jpg', chall: 'img/ulixes-calypso-hall.jpg',
  stair: 'img/ulixes-calypso-atrium-stair.jpg', atrium: 'img/ulixes-services-atrium.jpg', floor: 'img/ulixes-services-floor.jpg',
  loop: 'img/ulixes-san-francisco-loop.mp4',
};
const VIDEO = (pos = 'center') => `<video autoplay muted loop playsinline preload="auto" poster="${I.sf}" src="${I.loop}" style="object-position:${pos}"></video>`;
const IC = {
  home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 10.5 12 4l8 6.5V20h-5v-6h-6v6H4z"/></svg>',
  svc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/></svg>',
  exp: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="8" r="3.5"/><path d="M5 20c.8-3.6 3.6-5.5 7-5.5s6.2 1.9 7 5.5"/></svg>',
  cal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 17h4l3-9 4 12 3-7h4"/></svg>',
  more: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 7h16M4 12h16M4 17h10"/></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5.5" width="18" height="13" rx="2.5"/><path d="M3.5 7l8.5 6 8.5-6"/></svg>',
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6.5 3.5h3l1.5 4-2 1.2a11 11 0 0 0 5.3 5.3l1.2-2 4 1.5v3a2 2 0 0 1-2 2A16.5 16.5 0 0 1 4.5 5.5a2 2 0 0 1 2-2z"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/></svg>',
  li: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="3.5" width="17" height="17" rx="3"/><path d="M8 10.5V16M8 8v.01M12 16v-3.2a2.3 2.3 0 0 1 4.6 0V16M12 10.5V16"/></svg>',
  check: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="m3.5 8.5 3 3 6-7"/></svg>',
};

/* Real site content, from src/lib, so every option is built on what the site actually says. */
const CAPS = [
  { t: 'Transformation and solution architecture', s: 'Transformation & architecture', k: 'Modernization · Architecture · Operating model', d: 'Platform modernization, front-to-back architecture, and migration strategy decided before technology selection.', r: 'Architecture risk concentrates in the decision taken once and inherited everywhere. An operating model chosen for the front office is still the operating model at the close.', c: ['Platform modernization', 'Front-to-back architecture', 'Implementation and migration strategy', 'Integration', 'Operating-model design'], span: [0, 6], img: I.atrium },
  { t: 'Accounting and controls', s: 'Accounting & controls', k: 'Accounting · Reconciliation · Controls', d: 'Capital markets and hedge accounting, reconciliation, and the control architecture that holds at the close.', r: 'Control risk concentrates between the trade and its treatment. A system can be right about the position and wrong about the ledger, and the difference surfaces at the close.', c: ['Capital markets accounting', 'Hedge accounting', 'Reconciliation', 'Transaction and ledger integrity', 'Control architecture'], span: [4, 6], img: I.hall },
  { t: 'Trading, risk and post-trade', s: 'Trading, risk & post-trade', k: 'Pricing · Collateral · Lifecycle', d: 'Derivatives and securities through pricing, market data, collateral, settlement, and lifecycle processing.', r: 'Post-trade risk concentrates in the lifecycle event nobody planned for. A position that behaves at inception can still break at exercise.', c: ['Derivatives and securities', 'Pricing and P&L', 'Market data', 'Collateral', 'Settlements', 'Lifecycle processing'], span: [0, 4], img: I.day },
  { t: 'Automation and transformation assurance', s: 'Automation & assurance', k: 'Testing · Validation · Readiness', d: 'Automated testing, migration validation, SIT and UAT, and production readiness, with intelligent automation applied to each.', r: 'Assurance risk concentrates in the exception. Happy-path coverage passes, and the break that matters arrives at month end.', c: ['Automated testing', 'Exception and reconciliation workflows', 'Migration validation', 'SIT and UAT', 'Production readiness'], span: [2, 6], img: I.floor },
];
const STAGES = [
  { n: 'Capture', o: 'Front office', does: 'Trade booked against product, book, counterparty, and static data', breaks: 'A product modelled wrong here is inherited by every number downstream', dep: 'The product model, legal entity, and book hierarchy already being right', car: 'Every valuation, risk, and accounting number the trade goes on to produce' },
  { n: 'Valuation', o: 'Front office', does: 'Curves built, marks struck, independent price verification run', breaks: 'Curve configuration that prices correctly and books incorrectly', dep: 'Curve construction and the quotes feeding it', car: 'P&L, sensitivities, and the marks the ledger posts against' },
  { n: 'Risk', o: 'Middle office', does: 'Sensitivities, limits, and the market data the measures depend on', breaks: 'Risk numbers that do not tie back to what the front office holds', dep: 'Positions and marks tying back to what the desk actually holds', car: 'Limit monitoring, margin requirement, and capital measures' },
  { n: 'Collateral', o: 'Middle office', does: 'Margin called, exposure agreed, agreement terms applied', breaks: 'Terms that live in the signed document but not in the platform', dep: 'Agreement terms being represented in the platform, not only signed', car: 'Funding requirement, and the disputes that follow a call' },
  { n: 'Settlement', o: 'Back office', does: 'Cash and securities move, confirmations matched, breaks worked', breaks: 'Exception paths with no owner, no queue, and no resolution', dep: 'Counterparty static data and instruction routing', car: 'Cash and securities movement, and the breaks somebody has to own' },
  { n: 'Ledger', o: 'Back office', does: 'Sub-ledger posts, hedge designation and effectiveness carried through', breaks: 'Designation that moves earnings into the wrong period, quietly', dep: 'The booking model and designation decided back at capture', car: 'Which period earnings land in, and what an auditor is shown' },
  { n: 'Regulatory reporting', o: 'Back office', does: 'Regulatory submissions assembled and traced back to the transaction', breaks: 'A submission nobody can walk back to the trade that produced it', dep: 'Every upstream identifier surviving the journey intact', car: 'What the regulator receives, and what can be walked back to a trade' },
];
const INST = [
  { n: 'Global systemically important banks', d: 'Enterprise treasury and derivatives architecture supporting large-scale hedging programs, capital optimization, liquidity management, and regulatory scrutiny.', f: ['Treasury', 'Derivatives', 'Hedging programs', 'Capital', 'Liquidity', 'Regulatory scrutiny'], c: [0, 1, 2] },
  { n: 'U.S. super-regionals and large regionals', d: 'Interest rate risk, balance sheet management, and enterprise hedge accounting frameworks across volatile rate cycles.', f: ['Interest rate risk', 'Balance sheet', 'Hedge accounting', 'Rate cycles'], c: [1, 2] },
  { n: 'Farm credit and agricultural lending', d: 'Structured lending and derivatives infrastructure supporting complex funding and commodity exposure strategies.', f: ['Structured lending', 'Derivatives', 'Funding', 'Commodity exposure'], c: [0, 2] },
  { n: 'Multilateral and trade finance banks', d: 'Cross-border derivatives, structured flows, and risk management platforms operating across emerging and developed markets.', f: ['Cross-border derivatives', 'Structured flows', 'Risk platforms', 'Emerging markets'], c: [0, 2] },
  { n: 'Federal liquidity and housing finance', d: 'Member services infrastructure and balance sheet management systems within highly regulated liquidity frameworks.', f: ['Member services', 'Balance sheet', 'Regulated liquidity'], c: [0, 1] },
  { n: 'Global asset managers', d: 'Pre- and post-acquisition platform integration, portfolio operations infrastructure, and institutional risk architecture.', f: ['Platform integration', 'Acquisitions', 'Portfolio operations', 'Risk architecture'], c: [0, 3] },
  { n: 'Brokerage and clearing platforms', d: 'Retail and institutional trading infrastructure programs spanning front-to-back processing, capital markets controls, and operational risk governance.', f: ['Trading infrastructure', 'Front to back', 'Controls', 'Operational risk'], c: [0, 2, 3] },
];
const CAPN = ['Architecture', 'Accounting & controls', 'Trading & post-trade', 'Assurance'];
const POS = [
  ['Infrastructure is financial architecture', 'Booking models shape capital consumption, lifecycle configuration shapes P&L timing, and hedge designation shapes earnings volatility. Those are architectural choices with balance sheet consequences, not implementation details.'],
  ['Mastery is alignment', 'The hardest problems live between disciplines. Accounting assumes system behaviour, risk depends on data the system may not capture cleanly, and reporting needs lineage across organizational boundaries. Misalignment is where institutional risk hides.'],
  ['Lifecycle is the stress test', 'Point-in-time validation confirms that a system handles today\'s trades under today\'s conditions. It says nothing about maturity, hedge ineffectiveness, counterparty default, or market stress.'],
  ['Migration is a financial event', 'Every mapping decision carries accounting, capital, and regulatory implications. The technical migration is the easy part. Preserving financial control through the transition is the work.'],
  ['Capital awareness changes everything', 'The same economic trade can consume different capital depending on how it is booked, how it is netted, how collateral is reflected, and how the system classifies it. Capital belongs at design time, not downstream.'],
  ['Control is the outcome', 'An architecture the CFO can explain to analysts, the CAO can defend to auditors, the CRO can trust for risk decisions, and successors can maintain without a phone call.'],
];

/* Desktop site header, shared by every desktop flow that does not carry its own. */
const HEAD = (on, dark) => `<style>.hdr{display:flex;justify-content:space-between;align-items:center;padding:18px 32px;position:relative;z-index:5}.hdr nav{display:flex;gap:36px;font-size:13.5px;font-weight:500;color:var(--steel)}.hdr nav a{position:relative;padding:8px 0;outline:none;transition:color .3s}.hdr nav a:hover{color:var(--ink)}.hdr nav a:after{content:'';position:absolute;left:0;right:0;bottom:2px;height:1.5px;border-radius:2px;background:currentColor;transform:scaleX(0);transform-origin:left;transition:transform .45s var(--ease)}.hdr nav a:hover:after{transform:scaleX(.35)}.hdr nav a.on{color:var(--ink)}.hdr nav a.on:after{transform:none}.hdr.dk{color:#fff}.hdr.dk nav{color:#d7e0e3}.hdr.dk nav a:hover,.hdr.dk nav a.on{color:#fff}</style><header class="hdr${dark ? ' dk' : ''}">${dark ? BRANDL : BRAND}<nav>${['Services', 'Experience', 'Nasdaq Calypso'].map(n => `<a class="${n === on ? 'on' : ''}">${n}</a>`).join('')}</nav><a class="btn${dark ? ' lt' : ''}"><span>Discuss a mandate</span><i>${ARR}</i></a></header>`;

/* ------------------------------------------------------------------
 * Live-site sections kept as they are this round. Recreated compactly
 * so the flows read end to end; marked with a small "Kept" tag.
 * ---------------------------------------------------------------- */
const KEPT = '<span style="position:absolute;z-index:9;top:12px;right:12px;padding:4px 10px;border-radius:8px;background:rgba(250,249,246,.85);box-shadow:0 0 0 1px rgba(16,33,43,.1);font:600 10.5px Outfit;letter-spacing:.06em;color:#5d6e75">KEPT FROM LIVE SITE</span>';
window.STATIC = {
  head: { name: 'Header', html: p => HEAD(p) },
  depth: { name: 'Platform depth', html: () => `<style>.dp{padding:20px 0 90px;position:relative}.dp .in{display:grid;grid-template-columns:240px 1fr auto;gap:56px;align-items:center;padding:44px 0;border-top:1px solid var(--rule2);border-bottom:1px solid var(--rule2)}.dp b.y{font-family:Archivo;font-size:64px;letter-spacing:-.06em;line-height:.9;display:block;margin-top:10px}.dp h3{font-family:Archivo;font-size:30px;letter-spacing:-.04em;font-weight:540}.dp p{color:var(--graphite);margin-top:10px;max-width:56ch}</style><section class="dp">${KEPT}<div class="wrap"><div class="in"><div><p class="eb">Platform depth</p><b class="y">2004</b><span class="m mute">CALYPSO WORK SINCE</span></div><div><h3>Deep expertise in Nasdaq Calypso.</h3><p>Front office, risk, accounting, collateral, operations, testing, migration, and implementation, on one platform since 2004.</p></div><a class="tl">Review Calypso expertise →</a></div></div></section>` },
  approach: { name: 'Engagement approach', html: () => `<style>.ap{background:var(--dark);color:var(--light);padding:96px 0;position:relative}.ap .g{display:grid;grid-template-columns:1fr 1.1fr;gap:80px}.ap h2{font-size:58px}.ap h2 .s{color:#8ba0a9;display:block}.ap p.l{color:#b9c6cb;margin-top:20px;max-width:40ch}.ap ol{list-style:none;border-left:1px solid var(--drule);padding-left:30px}.ap li{position:relative;padding:18px 0;border-bottom:1px solid var(--drule)}.ap li:before{content:'';position:absolute;left:-35px;top:26px;width:9px;height:9px;border-radius:50%;background:#e3eaec}.ap li .m{color:#8ba0a9}.ap li b{display:block;font-family:Archivo;font-size:22px;letter-spacing:-.04em;margin-top:4px}.ap li span{display:block;color:#a9b8be;font-size:14px;margin-top:6px}</style><section class="ap">${KEPT}<div class="wrap g"><div><p class="eb" style="color:#9fb0b7">Engagement approach</p><h2 class="d" style="margin-top:18px">Go-live is <span class="s">not success.</span></h2><p class="l">Success is the first close, the first regulatory submission, and the first exception handled by the people who now own the system.</p></div><ol>${[['Architecture definition', 'Accounting treatment, capital impact, and regulatory requirements are defined before vendors or platforms enter the conversation.'], ['Lifecycle mapping', 'Every instrument type is mapped through its full lifecycle, identifying where accounting, risk, and capital intersect.'], ['Validation design', 'Validation is designed against edges and stress scenarios rather than happy-path processing.'], ['Control transfer', 'Documentation is written for successors rather than for project sign-off, building internal capability instead of dependency.']].map((x, i) => `<li><span class="m">0${i + 1}</span><b>${x[0]}</b><span>${x[1]}</span></li>`).join('')}</ol></div></section>` },
  exphero: { name: 'Experience hero', html: () => `${HEAD('Experience')}<style>.eh{padding:50px 0 90px;position:relative}.eh .g{display:grid;grid-template-columns:1fr 420px;gap:80px;align-items:center}.eh h1{font-size:80px;margin-top:22px}.eh h1 .s{display:block}.eh p.l{color:var(--graphite);margin-top:22px;max-width:48ch}.eh .by{margin-top:18px;font-size:13px;font-weight:600;color:var(--steel)}.eh .a{display:flex;gap:14px;margin-top:30px}.eh img{width:100%;height:500px;object-fit:cover;border-radius:8px;box-shadow:0 50px 80px -60px rgba(16,33,43,.8)}</style><section class="eh">${KEPT}<div class="wrap g"><div><p class="eb">Institutional experience</p><h1 class="d">Inside the institutions. <span class="s">Not alongside them.</span></h1><p class="l">Ulysses Williams has worked with Calypso since 2004, within treasury teams, derivatives operations, and core infrastructure programs where the decisions tied directly to balance sheets, controls, and regulatory outcomes.</p><p class="by">Ulysses Williams · President · Calypso subject-matter expert</p><div class="a"><a class="btn"><span>Discuss a mandate</span><i>${ARR}</i></a><a class="btn gh"><span>View on LinkedIn</span><i>${ARR}</i></a></div></div><img src="${I.uw}" alt=""></div></section>` },
  positions: { name: 'Six positions', html: () => `<style>.ps{background:var(--dark);color:var(--light);padding:90px 0;position:relative}.ps h2{font-size:52px}.ps h2 .s{color:#8ba0a9}.ps .g{display:grid;grid-template-columns:1fr 1fr;column-gap:64px;margin-top:44px;border-top:1px solid var(--drule)}.ps article{display:grid;grid-template-columns:52px 1fr;padding:26px 0;border-bottom:1px solid var(--drule)}.ps .n{font-family:Archivo;font-size:24px;color:#5d6e75}.ps b{font-family:Archivo;font-size:21px;letter-spacing:-.035em;font-weight:540}.ps p{color:#a9b8be;font-size:14px;margin-top:8px}</style><section class="ps">${KEPT}<div class="wrap"><p class="eb" style="color:#9fb0b7">Working perspective</p><h2 class="d" style="margin-top:16px">Six positions <span class="s">the work is built on.</span></h2><div class="g">${POS.map((p, i) => `<article><span class="n">0${i + 1}</span><div><b>${p[0]}</b><p>${p[1]}</p></div></article>`).join('')}</div></div></section>` },
  calhero: { name: 'Calypso hero', html: () => `${HEAD('Nasdaq Calypso')}<style>.ch{position:relative;padding:40px 0 70px;overflow:hidden}.ch>img{position:absolute;right:0;top:0;width:55%;height:100%;object-fit:cover;-webkit-mask-image:linear-gradient(90deg,transparent,#000 40%);mask-image:linear-gradient(90deg,transparent,#000 40%)}.ch .in{position:relative;max-width:640px}.ch h1{font-size:62px;margin-top:22px}.ch h1 .s{display:block}.ch p{color:var(--graphite);margin-top:20px;max-width:46ch}.ch .a{display:flex;gap:16px;align-items:center;margin-top:30px}.ch .st{position:relative;display:grid;grid-template-columns:repeat(4,1fr);margin-top:64px;border-top:1px solid var(--rule2)}.ch .st div{padding-top:16px}.ch .st b{display:block;font-family:Archivo;font-size:20px;letter-spacing:-.04em}.ch .st span{font-size:12.5px;color:var(--steel)}</style><section class="ch">${KEPT}<img src="${I.chall}" alt=""><div class="wrap"><div class="in"><p class="eb">Nasdaq Calypso expertise</p><h1 class="d">Calypso since 2004. <span class="s">Every office it touches.</span></h1><p>Senior-led advisory across the full trade lifecycle, from the first booking decision to the close it eventually reaches.</p><div class="a"><a class="btn"><span>Discuss a mandate</span><i>${ARR}</i></a><a class="tl">Explore the platform →</a></div></div><div class="st"><div><b>Since 2004</b><span>Working in Calypso</span></div><div><b>Front to back</b><span>One connected delivery context</span></div><div><b>Banks and hedge funds</b><span>Institutional scope</span></div><div><b>Senior-led</b><span>Judgment at the point of decision</span></div></div></div></section>` },
  programs: { name: 'Calypso programs', html: () => `<style>.pg{padding:20px 0 90px;position:relative}.pg .cd{background:var(--dark);color:var(--light);border-radius:12px;overflow:hidden}.pg .cd>img{width:100%;height:220px;object-fit:cover}.pg .in{padding:56px}.pg h2{font-size:50px}.pg h2 .s{color:#8ba0a9}.pg .g{display:grid;grid-template-columns:1fr 1fr;gap:48px;margin-top:40px}.pg .grp{font-size:11px;letter-spacing:.16em;font-weight:700;color:#e3eaec;padding:14px 0 6px}.pg .it{display:grid;grid-template-columns:36px 1fr;padding:11px 0;border-bottom:1px solid var(--drule);font-size:15px;color:#d6dfe2}.pg .it .m{color:#8ba0a9;padding-top:3px}.pg .det{background:var(--dark2);border-radius:10px;padding:32px;box-shadow:inset 0 0 0 1px var(--drule)}.pg .det b{display:block;font-family:Archivo;font-size:30px;letter-spacing:-.04em;margin-top:10px}.pg .det p{color:#b9c6cb;margin-top:14px}</style><section class="pg">${KEPT}<div class="wrap"><div class="cd"><img src="${I.stair}" alt=""><div class="in"><p class="eb" style="color:#9fb0b7">What the work produces</p><h2 class="d" style="margin-top:16px">Eight programs, <span class="s">six instrument classes.</span></h2><div class="g"><div>${[['Earnings and audit', ['Hedge accounting framework design', 'Earnings volatility remediation', 'Audit defense and documentation']], ['Delivery and migration', ['Calypso front-to-back implementation', 'Platform migration and data integrity', 'Derivatives lifecycle validation']], ['Capital and regulatory', ['Capital ratio optimization', 'Regulatory reporting architecture']]].map((g, gi) => `<p class="grp">${g[0].toUpperCase()}</p>${g[1].map((x, i) => `<div class="it"><span class="m">0${[1, 4, 7][gi] + i}</span>${x}</div>`).join('')}`).join('')}</div><div class="det"><span class="m" style="color:#8ba0a9">EARNINGS AND AUDIT · 01 / 08</span><b>Hedge accounting framework design</b><p>Designation, effectiveness testing, and the documentation that has to hold when a reviewer pulls the file. The framework decides which period a gain lands in.</p></div></div></div></div></div></section>` },
  mandates: { name: 'Four mandate shapes', html: () => `<style>.mn{padding:90px 0;position:relative}.mn h2{font-size:50px;margin-top:16px}.mn h2 .s{display:block}.mn .g{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-top:40px}.mn article{background:var(--light);border-radius:10px;padding:26px;box-shadow:0 0 0 1px var(--rule)}.mn .m{color:var(--line)}.mn b{display:block;font-family:Archivo;font-size:21px;letter-spacing:-.035em;margin-top:14px}.mn small{display:block;font-size:10.5px;letter-spacing:.12em;font-weight:700;color:var(--steel);margin-top:6px}.mn p{font-size:14px;color:var(--graphite);margin-top:14px}</style><section class="mn">${KEPT}<div class="wrap"><p class="eb">How the work is scoped</p><h2 class="d">Four shapes <span class="s">a Calypso mandate takes.</span></h2><div class="g">${[['Calypso implementation', 'ARCHITECTURE · CONFIGURATION · DELIVERY', 'Implementation risk concentrates where a decision taken for the front office quietly changes the ledger.'], ['Platform migration', 'MAPPING · VALIDATION · CUTOVER', 'Migration risk concentrates at the first close after cutover.'], ['Lifecycle-led testing', 'SIT · UAT · REGRESSION', 'Testing risk concentrates in the events nobody scripted.'], ['Operational readiness', 'CONTROLS · OWNERSHIP · SUPPORT', 'Readiness risk concentrates in the handover.']].map((x, i) => `<article><span class="m">0${i + 1}</span><b>${x[0]}</b><small>${x[1]}</small><p>${x[2]}</p></article>`).join('')}</div></div></section>` },
  /* phone */
  'caps-m': { name: 'Capabilities', html: () => `<style>.cm{padding:44px 20px 30px;position:relative}.cm h2{font-size:32px;margin-top:14px}.cm h2 .s{display:block}.cm .it{display:grid;grid-template-columns:30px 1fr 18px;padding:18px 0;border-bottom:1px solid var(--rule);align-items:start}.cm .it:first-of-type{border-top:1px solid var(--rule2);margin-top:22px}.cm .m{color:var(--steel);padding-top:4px}.cm b{font-family:Archivo;font-size:19px;letter-spacing:-.035em;font-weight:540;line-height:1.15}.cm small{display:block;font-size:12px;color:var(--steel);margin-top:4px}</style><section class="cm">${KEPT}<p class="eb">Capabilities</p><h2 class="d">Four points where <span class="s">delivery risk concentrates.</span></h2>${CAPS.map((c, i) => `<div class="it"><span class="m">0${i + 1}</span><div><b>${c.t}</b><small>${c.k}</small></div><span>→</span></div>`).join('')}</section>` },
  'exphero-m': { name: 'Experience hero', html: () => `<style>.em{padding:14px 20px 34px;position:relative}.em .top{display:flex;justify-content:space-between;margin-bottom:26px}.em .g{display:grid;grid-template-columns:1fr 104px;gap:16px;align-items:start}.em h1{font-size:30px;margin-top:12px}.em h1 .s{display:block}.em img{width:104px;height:128px;object-fit:cover;border-radius:10px}.em p{color:var(--graphite);margin-top:16px;font-size:15px}.em .a{display:flex;flex-direction:column;gap:10px;margin-top:22px}.em .a .btn{justify-content:space-between}</style><section class="em">${KEPT}<div class="top">${BRAND}</div><div class="g"><div><p class="eb">Institutional experience</p><h1 class="d">Inside institutions. <span class="s">Not alongside them.</span></h1></div><img src="${I.uw}" alt=""></div><p>Calypso experience since 2004, inside the teams and systems where critical decisions are made.</p><div class="a"><a class="btn"><span>Discuss a mandate</span><i>${ARR}</i></a><a class="btn gh"><span>View Ulysses on LinkedIn</span><i>${ARR}</i></a></div></section>` },
};

/*
 * Page flows. A slot is an area id (rendered with its pick, or the option
 * being previewed) or '@key[:arg]' for a kept live-site section. Phone flows
 * carry the nav as an overlay drawn over the scrolling page.
 */
window.FLOWS = {
  home: { name: 'Home', device: 'desktop', slots: ['video', 'heads', 'rows', '@depth', 'prac', 'cta', 'foot'] },
  services: { name: 'Services', device: 'desktop', slots: ['@head:Services', 'svhero', 'rows', '@approach', 'cta', 'foot'] },
  experience: { name: 'Experience', device: 'desktop', slots: ['@exphero', 'inst', '@positions', 'cta', 'foot'] },
  calypso: { name: 'Nasdaq Calypso', device: 'desktop', slots: ['@calhero', 'blotter', '@programs', '@mandates', 'cta', 'foot'] },
  contact: { name: 'Contact', device: 'desktop', slots: ['@head', 'contact', 'foot'] },
  'home-m': { name: 'Home · Phone', device: 'phone', overlay: 'nav', slots: ['mhero', '@caps-m', 'cta', 'foot'] },
  'experience-m': { name: 'Experience · Phone', device: 'phone', overlay: 'nav', slots: ['@exphero-m', 'acc', 'cta', 'foot'] },
};
