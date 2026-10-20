/*
 * Page upgrades: services. Owned by the services page session; loaded last by
 * index.html, after every round file. Override an area's option in place, e.g.
 *   get('approach').opts.A = [label, description, () => desktopHtml, () => phoneHtml];
 * so the approved pick (see PICKS in index.html) keeps pointing at it.
 */
(() => {
const A = window.AREAS;
const get = id => A.find(a => a.id === id);
const { PS } = window.R4X;
const S = '</' + 'script>';
/* Small changes ride on the approved markup: extra CSS goes in after its own. */
const add = (fn, css) => () => fn().replace('</style>', css + '</style>');
/* Keep "post-trade" whole when a title wraps. */
const nb = t => t.replace(/-/g, '‑');

/* ================================================================ hero: balanced lead, softened ticker edges */
{
  const sv = get('svhero'), [, , desk, phone] = sv.opts.A;
  sv.opts.A[2] = add(desk, '.tx p{text-wrap:balance}.lg b{text-wrap:balance}');
  sv.opts.A[3] = add(phone, '.h p.l{text-wrap:pretty}.tk{position:relative}.tk:before,.tk:after{content:"";position:absolute;top:0;bottom:0;width:64px;z-index:2;pointer-events:none}.tk:before{left:0;background:linear-gradient(90deg,var(--ink),rgba(16,33,43,0))}.tk:after{right:0;background:linear-gradient(270deg,var(--ink),rgba(16,33,43,0))}.tk span{font-size:13.5px;color:#b4c2c7}.tk b{font-size:15px;font-weight:450;color:#fff}');
}

/* ================================================================ capability cards */
/*
 * The cards are the detail of the four capabilities, so each now carries its
 * description and the whole list it covers. On desktop the cards share one
 * subgrid, so titles, descriptions, lists and lifecycle bars line up across
 * the row however each title wraps. "Explore" is gone: on Services it only
 * pointed back at this page.
 */
{
  const rows = get('rows');
  const CARD = (c, i) => `<article class="cd"><div class="tp">${GLYPH[i]}<span class="m">0${i + 1}</span></div><b>${nb(c.t)}</b><p class="ds">${nb(c.d)}</p><ul>${c.c.map(x => `<li>${IC.check}<span>${x}</span></li>`).join('')}</ul><div class="sl"><small>LIFECYCLE SPAN · ${c.span[1] - c.span[0] + 1} OF 7 STAGES</small>${SPAN(c.span[0], c.span[1])}</div></article>`;
  const CSS = `.cd{background:var(--paper);border-radius:14px;box-shadow:0 0 0 1px var(--rule),0 24px 40px -34px rgba(16,33,43,.5);transition:box-shadow .4s}.cd:hover{box-shadow:0 0 0 1px var(--rule2),0 40px 60px -40px rgba(16,33,43,.6)}.cd .tp{display:flex;justify-content:space-between;align-items:start}.cd .tp svg{width:56px;height:56px;color:var(--line);transition:color .4s}.cd:hover .tp svg{color:var(--ink)}.cd .m{color:var(--steel)}.cd b{display:block;font-family:Archivo;font-size:22px;letter-spacing:-.04em;line-height:1.1;font-weight:550;text-wrap:balance}.cd .ds{font-size:14px;line-height:1.55;color:var(--graphite);text-wrap:pretty}.cd ul{list-style:none;border-top:1px solid var(--rule)}.cd li{display:grid;grid-template-columns:14px 1fr;gap:10px;align-items:start;padding:9px 0;border-bottom:1px solid var(--rule);font-size:13.5px;line-height:1.45;color:var(--graphite)}.cd li svg{width:14px;height:14px;margin-top:2px;color:var(--ink)}.cd .sl small{display:block;font-size:10px;letter-spacing:.16em;font-weight:700;color:var(--steel);margin-bottom:9px}${SPANCSS()}.cd .spn em{font-size:0}`;
  const desk = () => `<style>.r{padding:44px 0 110px}.g{display:grid;grid-template-columns:repeat(4,1fr);grid-template-rows:repeat(5,auto);gap:0 16px}${CSS}.cd{display:grid;grid-row:span 5;grid-template-rows:subgrid;padding:28px 24px 26px}.cd b{align-self:end;margin-top:30px}.cd .ds{margin-top:12px}.cd ul{align-self:start;margin-top:22px}.cd .sl{margin-top:26px}</style><section class="r"><div class="wrap g">${CAPS.map(CARD).join('')}</div></section>`;
  const phone = () => `<style>.r{padding:20px 0 40px}.rl{display:flex;gap:12px;overflow-x:auto;scroll-snap-type:x mandatory;padding:6px 20px 14px;scrollbar-width:none}.rl::-webkit-scrollbar{display:none}${CSS}.cd{flex:0 0 300px;scroll-snap-align:center;display:flex;flex-direction:column;padding:24px 22px 22px}.cd .tp svg{width:50px;height:50px}.cd b{font-size:22px;margin-top:22px}.cd .ds{margin-top:10px}.cd ul{margin:18px 0 22px}.cd li{padding:8px 0}.cd .sl{margin-top:auto}.dt{display:flex;gap:5px;padding:4px 20px}.dt i{flex:1;height:2px;border-radius:2px;background:var(--plat);transition:background .3s}.dt i.on{background:var(--ink)}</style><section class="r"><div class="rl" id="rl">${CAPS.map(CARD).join('')}</div><div class="dt">${CAPS.map((_, i) => `<i${i ? '' : ' class="on"'}></i>`).join('')}</div></section><script>rl.addEventListener('scroll',()=>{const i=Math.round(rl.scrollLeft/312);document.querySelectorAll('.dt i').forEach((x,j)=>x.classList.toggle('on',j===i))},{passive:true})${S}`;
  rows.opts.A = [rows.opts.A[0], rows.opts.A[1], desk, phone];
}

/* ================================================================ engagement approach */
const PHASES = [['Architecture definition', 'Accounting treatment, capital impact, and regulatory requirements are defined before vendors or platforms enter the conversation.'], ['Lifecycle mapping', 'Every instrument type is mapped through its full lifecycle, identifying where accounting, risk, and capital intersect.'], ['Validation design', 'Validation is designed against edges and stress scenarios rather than happy-path processing.'], ['Control transfer', 'Documentation is written for successors rather than for project sign-off, building internal capability instead of dependency.']];
const APL = 'Success is the first close, the first regulatory submission, and the first exception handled by the people who now own the system.';

/* Desktop: the rail ends on plain "First close" text rather than a pill, and the statement sits in two even lines. */
{
  const ap = get('approach');
  ap.opts.A[2] = add(ap.opts.A[2], '.tp p{max-width:none;width:470px;text-wrap:balance;padding-bottom:8px}.rl .end{padding:0;border-radius:0;background:none;color:var(--ink);letter-spacing:.16em;margin-top:-7px}.rl .end b{width:9px;height:9px;background:none;box-shadow:inset 0 0 0 2px var(--ink)}.rl:before,.rl:after{right:150px}.ph b{text-wrap:balance}.ph p{text-wrap:pretty}');
}

/*
 * Phone: the four boxed tabs become the desktop's light numerals on a
 * hairline, the active one in ink with its rule drawn in. Every phase sits in
 * the panel at once, stacked, so the panel holds the height of the longest
 * and nothing below it jumps when the phase changes.
 */
{
  const ap = get('approach');
  ap.opts.B[3] = () => PS(`.p h2{font-size:31px}.p .l{text-wrap:pretty}.tb{display:grid;grid-template-columns:repeat(4,1fr);margin-top:26px}.tb button{position:relative;padding:14px 0 12px;text-align:left;font-family:Archivo;font-weight:250;font-size:34px;letter-spacing:-.06em;line-height:.9;color:var(--line);border-top:1px solid var(--rule2);transition:color .35s}.tb button:after{content:'';position:absolute;left:0;right:6px;top:-1px;height:2px;background:var(--ink);transform:scaleX(0);transform-origin:left;transition:transform .5s var(--ease)}.tb button.on{color:var(--ink)}.tb button.on:after{transform:none}.pn{display:grid;margin-top:8px;background:var(--paper);border-radius:16px;box-shadow:0 0 0 1px var(--rule),0 24px 40px -30px rgba(16,33,43,.5)}.pn article{grid-area:1/1;padding:22px 20px 24px;opacity:0;visibility:hidden;transition:opacity .3s,visibility 0s .3s}.pn article.on{opacity:1;visibility:visible;transition:opacity .35s .05s}.pn small{display:block;font-size:10px;letter-spacing:.16em;font-weight:700;color:var(--steel)}.pn b{display:block;font-family:Archivo;font-size:24px;letter-spacing:-.045em;line-height:1.1;font-weight:550;margin-top:12px}.pn p{font-size:14.5px;line-height:1.6;color:var(--graphite);margin-top:10px;text-wrap:pretty}`, `<p class="eb">Engagement approach</p><h2 class="d">Go-live is <span class="s">not success.</span></h2><p class="l">${APL}</p><div class="tb" role="group" aria-label="Phases">${PHASES.map((x, i) => `<button type="button" data-i="${i}" class="${i ? '' : 'on'}" aria-pressed="${!i}" aria-label="Phase ${i + 1}: ${x[0]}">0${i + 1}</button>`).join('')}</div><div class="pn">${PHASES.map((x, i) => `<article class="${i ? '' : 'on'}"><small>PHASE 0${i + 1} OF 04</small><b>${x[0]}</b><p>${x[1]}</p></article>`).join('')}</div><script>const T=[...document.querySelectorAll('.tb button')],P=[...document.querySelectorAll('.pn article')];T.forEach(x=>x.onclick=()=>{const i=+x.dataset.i;T.forEach((y,j)=>{y.classList.toggle('on',j===i);y.setAttribute('aria-pressed',j===i)});P.forEach((y,j)=>y.classList.toggle('on',j===i))})${S}`);
}
})();
