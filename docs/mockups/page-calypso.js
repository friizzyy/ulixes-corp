/*
 * Page upgrades: calypso. Owned by the calypso page session; loaded last by
 * index.html, after every round file. Override an area's option in place, e.g.
 *   get('approach').opts.A = [label, description, () => desktopHtml, () => phoneHtml];
 * so the approved pick (see PICKS in index.html) keeps pointing at it.
 *
 * Each approved section keeps its own markup and is refined on top: patch()
 * wraps the original renderer, swaps markup where the structure changes and
 * appends CSS to the section's first <style>, so later rules win.
 */
(() => {
const A = window.AREAS;
const get = id => A.find(a => a.id === id);
const S = '</' + 'script>';

/* Wrap opts[letter][slot] (2 desktop/phone-only, 3 phone of a pair). */
function patch(id, letter, slot, css, swaps = []) {
  const o = get(id).opts[letter], orig = o[slot];
  const next = [...o];
  next[slot] = () => {
    let h = orig();
    for (const [from, to] of swaps) h = typeof from === 'string' ? h.split(from).join(to) : h.replace(from, to);
    return h.replace('</style>', css + '</style>');
  };
  get(id).opts[letter] = next;
}

/* ================================================================ Hero (B, Monumental Hall) */
/*
 * Desktop: the four facts led by large light numerals with the unit beside
 * them, so the ledger reads as figures rather than four bold phrases.
 */
const FACTS = [['7', 'lifecycle stages', 'Capture to regulatory reporting'], ['8', 'programs', 'Earnings, delivery and capital'], ['6', 'instrument classes', 'Rates through equity derivatives'], ['3', 'offices', 'Front, middle and back']];
patch('calhero', 'B', 2,
  '.lg>div{padding:24px 28px 26px}.lg .f{padding:0;display:flex;align-items:baseline;gap:10px}.lg .f b{font-family:Archivo;font-weight:250;font-size:52px;letter-spacing:-.06em;line-height:.9;color:var(--ink)}.lg .f em{font-style:normal;font-size:15px;font-weight:600;color:var(--ink);letter-spacing:-.005em}.lg span.x{display:block;margin-top:12px;font-size:13px;color:var(--steel)}.tx p{text-wrap:balance}',
  [[/<div class="lg">[\s\S]*?<\/div><\/section>/, `<div class="lg">${FACTS.map(f => `<div><div class="f"><b>${f[0]}</b><em>${f[1]}</em></div><span class="x">${f[2]}</span></div>`).join('')}</div></section>`]]);
/* Phone: the steel half balances over two lines instead of leaving "touches." alone. */
patch('calhero', 'B', 3, '.h h1 .s{text-wrap:balance}.h p.l{text-wrap:pretty}');

/* ================================================================ Lifecycle (A, Ink) */
/*
 * Desktop: titles hold two lines so every description starts on the same
 * line, descriptions are a touch larger and darker, the lede breathes, and
 * the stages answer the keyboard as well as the mouse.
 */
patch('blotter', 'A', 2,
  '.s1 h2{margin-bottom:16px}.cd{min-height:236px}.cd b{display:block;min-height:2.2em}.cd .ih{padding-top:14px}.cd p{font-size:13px;line-height:1.5;color:var(--graphite);margin-top:6px}.cd.dn p{color:var(--graphite)}.cd:focus-visible{outline:2px solid var(--ink);outline-offset:3px}.rd p{text-wrap:pretty}',
  [[/<article class="cd"/g, '<article class="cd" tabindex="0" role="button"'],
   ['set(0);' + S, `set(0);document.querySelectorAll('.cd').forEach(c=>c.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();c.click()}});` + S]]);

/*
 * Phone: the state markers lose their pill. The broken stage turns ink like
 * the desktop pick and the stages that inherit it go mist with a steel ring;
 * the marker is a plain label with a small dot.
 */
patch('blotter-m', 'A', 2,
  '.cd{transition:box-shadow .3s,background .3s,color .3s}.cd .tg{display:inline-flex;align-items:center;gap:6px;padding:0;border-radius:0;background:none!important;font-size:10px;letter-spacing:.14em}.cd .tg:before{content:"";width:6px;height:6px;border-radius:50%;background:currentColor}.cd.br{background:var(--ink);color:var(--light);box-shadow:0 24px 40px -26px rgba(16,33,43,.6)}.cd.br .k,.cd.br p{color:#b9c6cb}.cd.br .tg{color:#fff!important}.cd.br .w{color:#fff;border-color:rgba(255,255,255,.14)}.cd.br .w small{color:#8ba0a9}.cd.dn{background:#e9eff1;box-shadow:inset 0 0 0 1.5px #8ba0a9}.cd.dn .tg{color:var(--ink)!important}.cd .w{text-wrap:pretty}',
  [["'BREAK'", "'Break'"], ["'INHERITS'", "'Inherits'"]]);

/* ================================================================ Programs (A, Paper Card) */
/*
 * Desktop: column headers hold two lines of description so the three
 * accordions start level, the descriptions wrap without orphans, and long
 * program names keep clear of the toggle.
 */
patch('programs', 'A', 2,
  '.col .hd span{min-height:3.25em;text-wrap:pretty}.it>button{grid-template-columns:30px 1fr 34px;align-items:start}.it>button .pl{justify-self:end}.it>button .m{padding-top:2px}.it>button .pl{margin-top:-2px}.it b{line-height:1.4;text-wrap:pretty}.bd .in{padding-left:30px;padding-right:34px}.bd p{text-wrap:pretty}');

/*
 * Phone: each program number sits beside its title instead of on a line of
 * its own, so the open family reads as a clean index.
 */
patch('programs-m', 'B', 2,
  '.pg{display:grid;grid-template-columns:30px 1fr;column-gap:4px}.pg .m{grid-row:1/4;padding-top:3px;color:var(--steel)}.pg b{margin-top:0;text-wrap:pretty}.pg p,.pg em{grid-column:2}.pg p{text-wrap:pretty}');

/* ================================================================ Mandates */
/*
 * Desktop (A, Four Cards): the tag line reserves two lines so the rule and
 * the paragraph sit level across all four cards.
 */
patch('mandates', 'A', 2, '.g article{display:flex;flex-direction:column}.g small{min-height:3em;line-height:1.5}.g p{text-wrap:pretty}.tp p{text-wrap:pretty}');

/*
 * Phone (B, Rows, One Open): the tags read in sentence case on one line,
 * and the number lines up with the title rather than the middle of the row.
 */
patch('mandates-m', 'B', 2, '.it>button{align-items:start}.it>button .m{padding-top:3px}.it>button .pl{align-self:center}.it b small{font-size:12.5px;letter-spacing:0;font-weight:500;text-transform:none;margin-top:4px}.bd p{text-wrap:pretty}');
})();
