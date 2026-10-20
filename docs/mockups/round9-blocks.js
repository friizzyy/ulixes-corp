/* Round 9: shared-section cleanup, loaded after the page files.
 * The closing card loses its pills and the reply promise (Contact keeps that),
 * its headline follows the page, and the footer drops the repeated labels and
 * shows the wordmark whole. */
(() => {
const A = window.AREAS;
const get = id => A.find(a => a.id === id);
const page = () => (window.CUR_FLOW && window.CUR_FLOW.name) || '';

const HEADS = {
  'Services': 'Start with <span class="s">the platform decision.</span>',
  'Nasdaq Calypso': 'Bring the <span class="s">Calypso question.</span>',
};
const card = html => html
  .replace(/<span class="chip"[^>]*><i><\/i>Start a conversation<\/span>/g, '<p class="eb">Start a conversation</p>')
  .replace('<span>Reads every inquiry and replies directly</span></div><span class="rt"><i></i>Usually within one business day</span>', '<span>President · Calypso subject-matter expert</span></div>')
  .replace('Put that experience <span class="s">against the decision.</span>', HEADS[page()] || '$&');
const cta = get('cta').opts.A, [cd, cp] = [cta[2], cta[3]];
cta[2] = () => card(cd());
cta[3] = () => card(cp());

const foot = html => html
  .replace(/<span class="lbl">LEGAL<\/span>/g, '')
  .replace('</style>', '.sg{gap:6px}.wm{height:auto!important;padding-bottom:6px}.wm span{line-height:.86!important;background:none!important;color:rgba(16,33,43,.07)!important}</style>');
for (const o of Object.values(get('close').opts)) { const [d, p] = [o[2], o[3]]; o[2] = () => foot(d()); o[3] = () => foot(p()); }

/* Phone engagement approach: the tabbed pager becomes the desktop's phase
 * line turned upright. All four phases sit in one paper card on a rail that
 * runs to "First close", so nothing is hidden behind a tap and the card has
 * no dead space under a short phase. */
const PHASES = [['Architecture definition', 'Accounting treatment, capital impact, and regulatory requirements are defined before vendors or platforms enter the conversation.'], ['Lifecycle mapping', 'Every instrument type is mapped through its full lifecycle, identifying where accounting, risk, and capital intersect.'], ['Validation design', 'Validation is designed against edges and stress scenarios rather than happy-path processing.'], ['Control transfer', 'Documentation is written for successors rather than for project sign-off, building internal capability instead of dependency.']];
const APL = 'Success is the first close, the first regulatory submission, and the first exception handled by the people who now own the system.';
get('approach').opts.B[3] = () => window.R4X.PS(`.p .l{text-wrap:pretty}
.pl{list-style:none;margin-top:30px;padding:6px 22px 24px 18px;background:var(--paper);border-radius:18px;box-shadow:0 0 0 1px var(--rule),0 30px 50px -36px rgba(16,33,43,.5)}
.pl li{position:relative;display:grid;grid-template-columns:34px 1fr}
.pl li:before{content:'';position:absolute;left:7px;top:31px;width:9px;height:9px;border-radius:50%;background:var(--ink);z-index:1;box-shadow:0 0 0 5px var(--paper)}
.pl li:not(.end):after{content:'';position:absolute;left:11px;top:36px;bottom:-34px;width:1px;background:var(--rule2)}
.pl li>div{grid-column:2;padding:20px 0 22px;border-bottom:1px solid var(--rule)}
.pl .n{display:block;font-family:Archivo;font-weight:250;font-size:30px;letter-spacing:-.06em;line-height:1;color:var(--line)}
.pl b{display:block;font-family:Archivo;font-size:20px;font-weight:550;letter-spacing:-.04em;line-height:1.15;margin-top:12px}
.pl p{font-size:14.5px;line-height:1.6;color:var(--graphite);margin-top:8px;text-wrap:pretty}
.pl .end:before{top:26px;background:var(--paper);box-shadow:inset 0 0 0 2px var(--ink),0 0 0 5px var(--paper)}
.pl .end>div{padding:21px 0 0;border:0;font-size:10.5px;font-weight:700;letter-spacing:.16em;color:var(--ink)}`,
`<p class="eb">Engagement approach</p><h2 class="d">Go-live is <span class="s">not success.</span></h2><p class="l">${APL}</p><ol class="pl">${PHASES.map((x, i) => `<li><div><span class="n">0${i + 1}</span><b>${x[0]}</b><p>${x[1]}</p></div></li>`).join('')}<li class="end"><div>FIRST CLOSE</div></li></ol>`);

/* Phone contact: the plain intro and the avatar line give way to an image
 * hero with the headline set in light, and the form card rises over its
 * bottom edge addressed to Ulysses, so the person is part of the form rather
 * than a separate line above it. */
{
  const ct = get('contact').opts.B, base = ct[3];
  const HERO = `<section class="hh"><img src="${I.sf}" alt=""><div class="top">${BRANDL}</div><div class="tx"><p class="eb">Discuss a mandate</p><h1 class="d">Three questions. <span class="s">One conversation.</span></h1><p class="l">For decisions where product, risk, operations and reporting meet.</p></div></section>`;
  const TO = `<div class="to"><span class="k">To</span><img src="${I.uw}" alt=""><div><b>Ulysses Williams</b><span>President · reads every inquiry himself</span></div></div>`;
  const CSS = `body{padding-top:0!important}
.hh{position:relative;height:500px;color:#fff;overflow:hidden}.hh>img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.hh:after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,rgba(16,33,43,.45),transparent 22%,rgba(16,33,43,.35) 45%,rgba(16,33,43,.95) 88%)}
.hh .top{position:relative;z-index:2;padding:58px 20px 0}.hh .tx{position:absolute;z-index:2;left:20px;right:20px;bottom:92px}
.hh .eb{color:#dfe6e8}.hh h1{font-size:40px;line-height:1.02;margin-top:14px;color:#fff}.hh h1 .s{display:block;color:#c9d6db}.hh .l{margin-top:14px;font-size:15px;line-height:1.5;color:#e6ecee;max-width:32ch}
.c{padding:0 14px 44px!important;position:relative;z-index:3}.g>div:first-child{display:none}.cd{margin-top:-64px;border-radius:18px!important;box-shadow:0 0 0 1px var(--rule),0 40px 70px -40px rgba(16,33,43,.6)!important}
.to{display:grid;grid-template-columns:auto 40px 1fr;align-items:center;gap:12px;padding-bottom:18px;margin-bottom:22px;border-bottom:1px solid var(--rule)}
.to .k{font-family:'JetBrains Mono',monospace;font-size:10.5px;letter-spacing:.12em;text-transform:uppercase;color:var(--steel);padding-right:2px}
.to img{width:40px;height:40px;border-radius:50%;object-fit:cover;object-position:50% 20%}.to b{display:block;font-size:14.5px;font-weight:600}.to span{display:block;font-size:12.5px;color:var(--steel);margin-top:1px}
.alt{padding:0 6px}`;
  ct[3] = () => base()
    .replace('</style>', CSS + '</style>')
    .replace('<section class="c">', HERO + '<section class="c">')
    .replace('<div class="cd">', '<div class="cd">' + TO)
    .replace(/<div class="alt">[\s\S]*?<\/dl><\/div>/, '');
  const F = window.FLOWS['contact-m']; F.slots = F.slots.filter(s => s !== '@mhead');
}

/* Centred headings: one per page, each over a full-width visual, so left and
 * centred alternate down the page instead of every title sitting flush left. */
const RULE = `{content:'';width:26px;height:1px;background:currentColor;opacity:.6}`;
const mid = (box, extra = '') => `${box}>.eb{justify-content:center}${box}>.eb:after${RULE}${box}>h2{text-align:center;margin-left:auto;margin-right:auto}${extra}`;
const CENTRE = {
  svteaser: [mid('.tp>div', '.tp>.r{display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;gap:16px;margin-top:20px}.tp>.r p{max-width:62ch;margin:0}'), mid('.s1')],
  approach: [mid('.tp>div', '.tp{flex-direction:column;align-items:center;text-align:center;gap:20px}.tp>p{max-width:60ch;margin:0}'), mid('.p', '.p>.l{text-align:center;margin-left:auto;margin-right:auto}')],
  inst: [mid('.s1>.wrap')],
  'inst-m': [, mid('.p')],
  blotter: [mid('.s1>.wrap', '.s1>.wrap>.l{text-align:center;margin-left:auto;margin-right:auto}')],
  'blotter-m': [, mid('.p')],
};
const inject = css => html => html.replace('</style>', css + '</style>');
for (const [id, [dc, pc]] of Object.entries(CENTRE)) for (const o of Object.values(get(id).opts)) {
  const [d, p] = [o[2], o[3]], phoneOnly = !dc;
  if (phoneOnly) { if (typeof d === 'function') o[2] = () => inject(pc)(d()); continue; }
  if (typeof d === 'function') o[2] = () => inject(dc)(d());
  if (pc && typeof p === 'function') o[3] = () => inject(pc)(p());
}
})();
