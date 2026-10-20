/*
 * Page upgrades: contact. Owned by the contact page session; loaded last by
 * index.html, after every round file. Override an area's option in place, e.g.
 *   get('approach').opts.A = [label, description, () => desktopHtml, () => phoneHtml];
 * so the approved pick (see PICKS in index.html) keeps pointing at it.
 */
(() => {
const A = window.AREAS;
const get = id => A.find(a => a.id === id);

/*
 * Guided Steps, upgraded. One builder for both devices so the three steps,
 * the stage control and the sent state behave the same everywhere. Every step
 * sits in the same grid cell, so the card holds its height as you move
 * through it; only the sent state asks the parent to refit.
 */
const STAGES = ['Design', 'Build', 'Migration', 'Testing', 'Go-live', 'Post go-live'];
const LINES = [['Email', 'admin@ulixescorp.com', 'mailto:admin@ulixescorp.com'], ['Telephone', '+1 (415) 283-9983', 'tel:+14152839983'], ['Office', 'San Francisco, California']];

const field = (id, label, ph, o = {}) => `<div class="f${o.half ? ' hf' : ''}"><label for="${id}">${label}${o.opt ? '<em>Optional</em>' : ''}</label>${o.area ? `<textarea id="${id}" rows="${o.area}" placeholder="${ph}"></textarea>` : `<input id="${id}" type="${o.type || 'text'}" placeholder="${ph}"${o.ac ? ` autocomplete="${o.ac}"` : ''}>`}</div>`;

const lines = () => `<dl class="dl">${LINES.map(([k, v, h]) => `<div><dt>${k}</dt><dd>${h ? `<a href="${h}">${v}<i>${ARR}</i></a>` : v}</dd></div>`).join('')}</dl>`;

const build = ph => {
  const css = `
.c{padding:${ph ? '36px 20px 44px' : '56px 0 24px'}}
.g{display:grid;grid-template-columns:${ph ? '1fr' : '1fr 600px'};gap:${ph ? '28px' : '96px'};align-items:start}
h1{font-size:${ph ? '36px' : '60px'};margin-top:${ph ? '14px' : '22px'}}h1 span{display:block}
.l{color:var(--graphite);margin-top:${ph ? '14px' : '24px'};max-width:40ch;font-size:${ph ? '15px' : '16.5px'}}
.who{display:flex;align-items:center;gap:14px;margin-top:${ph ? '22px' : '40px'};padding-top:${ph ? '20px' : '28px'};border-top:1px solid var(--rule)}
.who img{width:${ph ? '48px' : '56px'};height:${ph ? '48px' : '56px'};border-radius:50%;object-fit:cover;object-position:50% 20%}
.who b{display:block;font-size:14.5px;font-weight:600}.who span{display:block;font-size:13px;color:var(--steel);line-height:1.45}
.dl{margin-top:${ph ? '0' : '28px'}}.dl div{display:grid;grid-template-columns:${ph ? '92px' : '110px'} 1fr;align-items:center;min-height:${ph ? '52px' : '50px'};border-bottom:1px solid var(--rule)}.dl div:first-child{border-top:1px solid var(--rule)}
.dl dt{font-family:'JetBrains Mono',monospace;font-size:10.5px;letter-spacing:.12em;text-transform:uppercase;color:var(--steel)}
.dl dd{font-size:15px;color:var(--ink)}.dl a{display:inline-flex;align-items:center;gap:8px;font-weight:500}.dl a i{font-style:normal;font-size:12px;color:var(--steel);transition:transform .5s var(--ease),color .3s}.dl a:hover i{transform:translate(2px,-2px);color:var(--ink)}
.alt{margin-top:${ph ? '30px' : '0'}}.alt .k{font-size:12.5px;color:var(--steel);margin-bottom:12px}
.cd{background:var(--paper);border-radius:14px;box-shadow:0 0 0 1px var(--rule),0 40px 70px -50px rgba(16,33,43,.55);padding:${ph ? '24px 20px 22px' : '40px 48px 38px'}}
.pr{display:grid;grid-template-columns:repeat(3,1fr);gap:${ph ? '6px' : '10px'};list-style:none}
.pr button{display:block;width:100%;text-align:left;font-size:${ph ? '11.5px' : '12.5px'};font-weight:600;color:var(--steel);padding:0 0 4px;cursor:default;white-space:nowrap}
.pr button:before{content:'';display:block;height:2px;background:var(--plat);margin-bottom:${ph ? '10px' : '12px'};transition:background .45s var(--ease)}
.pr button b{font-family:'JetBrains Mono',monospace;font-weight:400;font-size:10.5px;margin-right:${ph ? '5px' : '8px'};letter-spacing:.04em}
.pr button.on{color:var(--ink)}.pr button.on:before{background:var(--ink)}.pr button.dn{cursor:pointer}.pr button.dn:hover{color:var(--ink)}
.stk{display:grid;margin-top:${ph ? '26px' : '36px'}}
.st{grid-area:1/1;visibility:hidden;opacity:0;transform:translateY(6px);transition:opacity .4s var(--ease),transform .5s var(--ease),visibility 0s .4s}
.st.on{visibility:visible;opacity:1;transform:none;transition:opacity .45s var(--ease) .05s,transform .55s var(--ease) .05s}
.st h3{font-family:Archivo,sans-serif;font-size:${ph ? '24px' : '28px'};font-weight:560;letter-spacing:-.04em;line-height:1.1;outline:none}
.st p.h{color:var(--steel);margin-top:8px;font-size:${ph ? '14px' : '14.5px'};line-height:1.5}
.fs{display:flex;flex-wrap:wrap;gap:${ph ? '18px' : '20px 16px'};margin-top:${ph ? '22px' : '26px'}}.f{flex:1 1 100%;min-width:0}.f.hf{flex:1 1 ${ph ? '100%' : 'calc(50% - 8px)'}}
.f label,.gl{display:flex;justify-content:space-between;align-items:baseline;font-size:12.5px;font-weight:600;color:var(--ink);letter-spacing:.01em}
.f label em{font-style:normal;font-weight:400;font-size:12px;color:var(--steel)}
.f input,.f textarea{display:block;width:100%;margin-top:8px;padding:${ph ? '14px 14px' : '14px 16px'};border-radius:6px;border:0;background:#fff;box-shadow:inset 0 0 0 1px var(--rule2);font:inherit;font-size:${ph ? '16px' : '15px'};line-height:1.4;color:var(--ink);outline:none;resize:none;transition:box-shadow .25s}
.f input{height:${ph ? '52px' : '52px'}}
.f input::placeholder,.f textarea::placeholder{color:#93a1a7}
.f input:hover,.f textarea:hover{box-shadow:inset 0 0 0 1px rgba(16,33,43,.34)}
.f input:focus,.f textarea:focus{box-shadow:inset 0 0 0 1.5px var(--ink),0 0 0 4px rgba(16,33,43,.07)}
.seg{display:grid;grid-template-columns:repeat(${ph ? 2 : 3},1fr);gap:1px;margin-top:8px;background:var(--rule2);border-radius:6px;overflow:hidden;box-shadow:0 0 0 1px var(--rule2)}
.seg button{display:flex;align-items:center;gap:10px;height:${ph ? '50px' : '52px'};padding:0 ${ph ? '14px' : '16px'};background:#fff;font-size:${ph ? '14.5px' : '14.5px'};text-align:left;transition:background .3s,color .3s}
.seg button b{font-family:'JetBrains Mono',monospace;font-weight:400;font-size:10.5px;color:#93a1a7;transition:color .3s}
.seg button:hover{background:var(--light)}
.seg button[aria-checked=true]{background:var(--ink);color:var(--light)}.seg button[aria-checked=true] b{color:#8ba0a9}
.seg button:focus-visible{outline:2px solid var(--ink);outline-offset:-4px;border-radius:4px}
.seg button[aria-checked=true]:focus-visible{outline-color:var(--light)}
.ft{display:flex;${ph ? 'flex-direction:column;gap:6px' : 'justify-content:space-between;align-items:center'};margin-top:${ph ? '26px' : '34px'};padding-top:${ph ? '0' : '26px'};${ph ? '' : 'border-top:1px solid var(--rule);'}}
.ft .btn{${ph ? 'width:100%;justify-content:space-between' : ''}}
#bk{font-size:14px;font-weight:600;color:var(--steel);transition:color .3s;${ph ? 'align-self:center;padding:12px 16px' : 'order:-1;padding:8px 0'}}#bk:hover{color:var(--ink)}#bk[hidden]{display:${ph ? 'none' : 'block;visibility:hidden'}}
.ft .nt{font-size:12.5px;color:var(--steel)}
.dn-s .ok{display:flex;align-items:center;gap:10px;font-family:'JetBrains Mono',monospace;font-size:10.5px;letter-spacing:.12em;text-transform:uppercase;color:var(--ok)}
.dn-s .ok:before{content:'';width:7px;height:7px;border-radius:50%;background:var(--ok)}
.dn-s h3{margin-top:14px}
.nx{list-style:none;margin-top:${ph ? '20px' : '26px'};border-top:1px solid var(--rule)}
.nx li{display:grid;grid-template-columns:${ph ? '30px' : '38px'} 1fr;padding:${ph ? '13px 0' : '14px 0'};border-bottom:1px solid var(--rule);font-size:14.5px;color:var(--graphite);line-height:1.5}
.nx li b{font-family:'JetBrains Mono',monospace;font-weight:400;font-size:10.5px;color:var(--steel);padding-top:3px}
.again{display:inline-block;margin-top:${ph ? '18px' : '22px'};font-size:14px;font-weight:600;color:var(--steel)}.again:hover{color:var(--ink)}
.vh{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
`;
  const intro = `<p class="eb">Discuss a mandate</p><h1 class="d">Three questions. <span class="s">One conversation.</span></h1><p class="l">${ph ? 'For decisions where product, risk, operations and reporting meet.' : 'For decisions where product, risk, operations and reporting meet. Answer three short questions, or write directly. Either way, it reaches Ulysses.'}</p><div class="who"><img src="${I.uw}" alt="Ulysses Williams"><div><b>Ulysses Williams</b><span>President. Reads every inquiry and replies himself.</span></div></div>`;
  const steps = `
<div class="st on" data-i="0"><h3 tabindex="-1">Who is asking?</h3><p class="h">So Ulysses knows who he is replying to.</p><div class="fs">${field('n', 'Name', 'Full name', { half: 1, ac: 'name' })}${field('o', 'Institution', 'Bank, fund or firm', { half: 1, ac: 'organization' })}${field('e', 'Work email', 'you@institution.com', { type: 'email', ac: 'email' })}</div></div>
<div class="st" data-i="1"><h3 tabindex="-1">Where does it sit?</h3><p class="h">The delivery stage, and the platform as it stands today.</p><div class="fs"><div class="f"><p class="gl" id="sg">Delivery stage</p><div class="seg" role="radiogroup" aria-labelledby="sg">${STAGES.map((s, i) => `<button type="button" role="radio" aria-checked="${i ? 'false' : 'true'}" tabindex="${i ? -1 : 0}"><b>0${i + 1}</b>${s}</button>`).join('')}</div></div>${field('p', 'Platform today', 'For example, front to back')}</div></div>
<div class="st" data-i="2"><h3 tabindex="-1">What needs deciding?</h3><p class="h">One or two sentences is enough. Detail can wait for the call.</p><div class="fs">${field('d', 'The decision', 'The decision that needs senior attention.', { area: ph ? 4 : 3 })}${field('w', 'By when', 'A date, a release or a quarter', { opt: 1 })}</div></div>
<div class="st dn-s" data-i="3"><p class="ok">Inquiry sent</p><h3 tabindex="-1" id="ty">Thank you.</h3><p class="h">It has gone to Ulysses directly.</p><ol class="nx"><li><b>01</b>He reads it himself, usually within one business day.</li><li><b>02</b>He replies from admin@ulixescorp.com, with a time to talk.</li><li><b>03</b>A first conversation about the decision, not a pitch.</li></ol><a class="again" id="ag">Start a new inquiry</a></div>`;
  const card = `<div class="cd"><ol class="pr" aria-label="Inquiry steps">${(ph ? ['You', 'Platform', 'Decision'] : ['You', 'The platform', 'The decision']).map((t, i) => `<li><button type="button" class="${i ? '' : 'on'}" data-i="${i}" tabindex="-1"><b>0${i + 1}</b>${t}</button></li>`).join('')}</ol><p class="vh" aria-live="polite" id="lv">Step 1 of 3</p><div class="stk">${steps}</div><div class="ft"><a class="btn" id="go"><span>Continue</span><i>→</i></a><a id="bk" hidden>← Back</a></div></div>`;
  const alt = `<div class="alt"><p class="k">${ph ? 'Or reach Ulysses directly' : 'Or directly'}</p>${lines()}</div>`;
  const body = ph ? `<div class="g"><div>${intro}</div>${card}</div>${alt}` : `<div class="g"><div>${intro}${lines()}</div>${card}</div>`;
  return `<style>${css}</style><section class="c"><div class="${ph ? '' : 'wrap'}">${body}</div></section><script>
(()=>{const $=q=>document.querySelector(q),S=[...document.querySelectorAll('.st')],P=[...document.querySelectorAll('.pr button')],go=$('#go'),bk=$('#bk'),ft=$('.ft'),sp=go.querySelector('span');let s=0;
const fit=()=>parent.postMessage({fit:1},'*');
const set=(n,focus)=>{s=n;S.forEach((x,i)=>{x.classList.toggle('on',i===s);x.inert=i!==s});P.forEach((x,i)=>{x.classList.toggle('on',i<=s);x.classList.toggle('dn',i<s&&s<3);x.tabIndex=i<s&&s<3?0:-1});
bk.hidden=!s||s>2;ft.style.display=s>2?'none':'';const t=s===2?'Send inquiry':'Continue';sp.dataset.t?(sp.dataset.t=t):(sp.textContent=t);go.querySelector('i').textContent=s===2?'↗':'→';
$('#lv').textContent=s>2?'Inquiry sent':'Step '+(s+1)+' of 3';if(focus)S[s].querySelector('h3').focus({preventScroll:true});fit();};
go.onclick=e=>{e.preventDefault();if(s===2){const n=($('#n').value||'').trim().split(' ')[0];$('#ty').textContent=n?'Thank you, '+n+'.':'Thank you.';}if(s<3)set(s+1,1)};
bk.onclick=e=>{e.preventDefault();if(s>0)set(s-1,1)};
$('#ag').onclick=e=>{e.preventDefault();document.querySelectorAll('input,textarea').forEach(x=>x.value='');set(0,1)};
P.forEach(p=>p.onclick=()=>{const i=+p.dataset.i;if(i<s&&s<3)set(i,1)});
document.querySelectorAll('.st input').forEach(x=>x.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();go.click()}}));
const R=[...document.querySelectorAll('.seg button')];const pick=b=>{R.forEach(x=>{const on=x===b;x.setAttribute('aria-checked',on);x.tabIndex=on?0:-1})};
R.forEach((b,i)=>{b.onclick=()=>pick(b);b.onkeydown=e=>{const k={ArrowRight:1,ArrowDown:1,ArrowLeft:-1,ArrowUp:-1}[e.key];if(k){e.preventDefault();const n=R[(i+k+R.length)%R.length];pick(n);n.focus()}}});
set(0);})();
</script>`;
};

const c = get('contact');
c.opts.B = ['Guided Steps', 'Three short steps (You, The platform, The decision) with a progress rail, a calm sent state, and the email, telephone and office alongside for anyone who would rather write directly.', () => build(false), () => build(true)];
})();
