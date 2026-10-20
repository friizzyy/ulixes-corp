/*
 * Ulixes mockups, round 1. Each area renders inside an iframe so a desktop
 * option can be drawn at 1440px and scaled, and a phone option at 393px.
 * BASE is the site's own token set (editorial.css), so every option starts
 * from the real palette, type and imagery rather than a stand-in.
 */
window.BASE = `
:root{--mineral:#f3f1ec;--light:#faf9f6;--ink:#10212b;--ink2:#182c37;--graphite:#34434b;--steel:#5d6e75;--plat:#d7dcde;--rule:rgba(16,33,43,.12);--rule2:rgba(16,33,43,.2);--dark:#1a1b1d;--dark2:#222327;--drule:rgba(241,243,239,.14);--mist:#e9eff1;--line:#8ba0a9;--sage:#91a393;--clay:#ad9884;--ease:cubic-bezier(.16,1,.3,1)}
*{box-sizing:border-box;margin:0;padding:0}
html,body{background:var(--mineral)}
body{color:var(--ink);font:15px/1.6 Outfit,system-ui,sans-serif;-webkit-font-smoothing:antialiased;overflow-x:hidden}
img{display:block;max-width:100%}
a{color:inherit;text-decoration:none}
button{font:inherit;color:inherit;background:none;border:0;cursor:pointer}
.d{font-family:Archivo,sans-serif;font-weight:560;letter-spacing:-.045em;line-height:1.02}
.s{font-family:'EB Garamond',serif;font-style:italic;font-weight:400;letter-spacing:-.015em}
.m{font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:.02em}
.eb{display:flex;align-items:center;gap:12px;font-size:11px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:var(--steel)}
.eb:before{content:'';width:26px;height:1px;background:currentColor;opacity:.6}
.btn{display:inline-flex;align-items:stretch;background:var(--ink);color:var(--light);border-radius:4px;font-weight:600;font-size:14px;box-shadow:0 16px 28px -23px rgba(16,33,43,.8);white-space:nowrap}
.btn span{padding:14px 20px}.btn i{display:grid;place-items:center;width:46px;border-left:1px solid rgba(255,255,255,.16);font-style:normal}
.btn.lt{background:var(--light);color:var(--ink)}.btn.lt i{border-color:var(--rule)}
.tl{font-weight:600;font-size:14px;border-bottom:1px solid currentColor;padding-bottom:3px}
.wrap{max-width:1312px;margin:0 auto;padding:0 64px}
.mute{color:var(--steel)}
.brand{display:flex;align-items:center;gap:10px}.brand svg{width:26px;height:26px}
.brand b{display:block;font-size:13px;letter-spacing:.2em;font-weight:700;line-height:1}.brand small{display:block;font-size:9px;letter-spacing:.24em;font-weight:600;color:var(--steel);margin-top:3px}
`;

const U = '<svg viewBox="0 0 30 30" fill="currentColor"><path d="M4 3h6v14c0 4.1 1.8 6.2 5 6.2s5-2.1 5-6.2V3h6v14c0 7.5-4.2 11-11 11S4 24.5 4 17V3Z"/></svg>';
const BRAND = `<span class="brand">${U}<span><b>ULIXES</b><small>CORPORATION</small></span></span>`;
const ARR = '↗';
const I = {
  sf: '../img/ulixes-san-francisco-blue-hour.webp', day: '../img/ulixes-financial-district-day.webp',
  uw: '../img/ulysses-williams.jpg', hall: '../img/ulixes-institutional-hall.jpg', chall: '../img/ulixes-calypso-hall.jpg',
  stair: '../img/ulixes-calypso-atrium-stair.jpg', atrium: '../img/ulixes-services-atrium.jpg', floor: '../img/ulixes-services-floor.jpg',
};
/* Simple line icons for the phone nav options. */
const IC = {
  home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 10.5 12 4l8 6.5V20h-5v-6h-6v6H4z"/></svg>',
  svc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/></svg>',
  exp: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="8" r="3.5"/><path d="M5 20c.8-3.6 3.6-5.5 7-5.5s6.2 1.9 7 5.5"/></svg>',
  cal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 17h4l3-9 4 12 3-7h4"/></svg>',
  more: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 7h16M4 12h16M4 17h10"/></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="5.5" width="18" height="13" rx="2.5"/><path d="M3.5 7l8.5 6 8.5-6"/></svg>',
};

/* A short phone home page that the nav options sit on top of. */
const mPage = (extra = '') => `
<style>
.mp{min-height:852px;padding-bottom:140px}
.mp .top{display:flex;justify-content:space-between;align-items:center;padding:14px 20px}
.mp .hero{margin:0 12px;border-radius:14px;overflow:hidden;position:relative;height:330px}
.mp .hero img{width:100%;height:100%;object-fit:cover}
.mp .hero:after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,transparent 40%,rgba(16,33,43,.65))}
.mp .hero p{position:absolute;left:18px;bottom:16px;z-index:1;color:#fff;font-size:10px;letter-spacing:.18em;font-weight:600}
.mp .tx{padding:24px 20px}
.mp h1{font-size:34px}
.mp .lede{margin-top:12px;color:var(--graphite);font-size:15px}
${extra}
</style>
<div class="mp"><div class="top">${BRAND}</div>
<div class="hero"><img src="${I.sf}" alt=""><p>● SAN FRANCISCO</p></div>
<div class="tx"><p class="eb">Senior-led advisory</p><h1 class="d" style="margin-top:14px">Capital markets transformation &amp; architecture.</h1><p class="lede">Deep expertise in Nasdaq Calypso and complex front-to-back transformation.</p></div></div>`;

/* Shared shells for the hero video area: a desktop page with the site header, and a phone page. */
const VD = {
  v: '<video autoplay muted loop playsinline preload="auto" poster="../img/ulixes-san-francisco-blue-hour.webp" src="../img/ulixes-san-francisco-loop.mp4"></video>',
  dock: '<div class="dock"><div><small>CONTINUITY</small><b>Since 2004</b><span>Calypso experience</span></div><div><small>LIFECYCLE</small><b>Front to back</b><span>Delivery perspective</span></div><div><small>REACH</small><b>4 regions</b><span>NA · EU · APAC · LatAm</span></div><div><small>ACCESS</small><b>Senior led</b><span>Direct practitioner access</span></div></div>',
  clock: `<script>const tk=()=>document.querySelectorAll('.clk').forEach(e=>e.textContent=new Date().toLocaleTimeString('en-US',{timeZone:'America/Los_Angeles',hour:'2-digit',minute:'2-digit',hour12:false}));tk();setInterval(tk,30000)</`+`script>`,
  head: dark => `<header style="display:flex;justify-content:space-between;align-items:center;padding:20px 32px;position:relative;z-index:5;${dark ? 'margin-bottom:-84px;color:#fff' : ''}">${BRAND.replace('<small>', dark ? '<small style="color:#d5dde0">' : '<small>')}<nav style="display:flex;gap:36px;font-size:13.5px;font-weight:500;${dark ? 'color:#e0e6e8' : 'color:var(--steel)'}"><a>Services</a><a>Experience</a><a>Nasdaq Calypso</a></nav><a class="btn${dark ? ' lt' : ''}" style="font-size:13px"><span style="padding:11px 16px">Discuss a mandate</span><i style="width:40px">${ARR}</i></a></header>`,
  desk: (css, html, dark) => `<style>${css}</style>${VD.head(dark)}<div style="padding:${dark ? '0' : '4px'} 32px 70px">${html}</div>`,
  phone: (css, html, bare) => `<style>${css}</style>${bare ? '' : `<div style="display:flex;justify-content:space-between;align-items:center;padding:6px 20px 12px">${BRAND}<span style="font-size:13px;font-weight:600">Menu</span></div>`}${html}`,
};

window.AREAS = [
/* ------------------------------------------------------------ 1 */
{ id: 'nav', name: 'Mobile Navigation', score: 5.5, device: 'phone', where: 'Every page · phone',
  issue: 'The menu is a plain sheet with three links and a large empty void. No Home, no contact details, and the main action sits at the very bottom of the screen.',
  refs: [['Revolut Business', 'https://mobbin.com/screens/3eb573db-8408-41c0-9b39-f6c61c38b4f8'], ['Cash App', 'https://mobbin.com/screens/742da727-0bf2-4ae6-9722-1cf412aadfad'], ['CVS Health', 'https://mobbin.com/screens/966a6c3c-74a4-46ed-ae08-8ba990bf4ecf'], ['Satispay', 'https://mobbin.com/screens/503ddfad-11e1-4f1b-9c29-17ad88db90fc']],
  opts: {
    A: ['Floating Dock', 'A glass pill floats above the page with four destinations, and the mandate action sits beside it as its own ink button, always one thumb away.', () => mPage(`
.dock{position:fixed;left:12px;right:12px;bottom:22px;display:flex;gap:8px;align-items:center}
.pill{flex:1;display:flex;justify-content:space-between;padding:6px;border-radius:22px;background:rgba(250,249,246,.82);backdrop-filter:blur(18px) saturate(1.3);-webkit-backdrop-filter:blur(18px) saturate(1.3);box-shadow:0 0 0 1px rgba(16,33,43,.08),0 18px 40px -18px rgba(16,33,43,.45)}
.pill a{flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;padding:8px 0 7px;border-radius:16px;font-size:10.5px;font-weight:600;color:var(--steel)}
.pill a svg{width:20px;height:20px}
.pill a.on{background:var(--ink);color:var(--light)}
.go{width:62px;height:62px;border-radius:21px;background:var(--ink);color:var(--light);display:grid;place-items:center;font-size:20px;box-shadow:0 18px 36px -16px rgba(16,33,43,.7)}
`) + `<nav class="dock"><div class="pill"><a class="on">${IC.home}Home</a><a>${IC.svc}Services</a><a>${IC.exp}Experience</a><a>${IC.cal}Calypso</a></div><a class="go" aria-label="Discuss a mandate">${ARR}</a></nav>`],
    B: ['Tab Bar + Seal', 'A full-width tab bar in the iOS pattern, with the U monogram raised in the centre as the mandate action. More opens a sheet holding contact details and the legal pages.', () => mPage(`
.tb{position:fixed;left:0;right:0;bottom:0;padding:8px 10px 26px;background:rgba(250,249,246,.9);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);box-shadow:0 -1px 0 var(--rule);display:grid;grid-template-columns:repeat(5,1fr);align-items:end}
.tb a{display:flex;flex-direction:column;align-items:center;gap:4px;font-size:10.5px;font-weight:600;color:var(--steel);padding-top:6px}
.tb a svg{width:22px;height:22px}.tb a.on{color:var(--ink)}
.tb a.on:before{content:'';width:4px;height:4px;border-radius:50%;background:var(--ink);position:absolute;margin-top:-8px}
.seal{transform:translateY(-14px)}
.seal span{width:58px;height:58px;border-radius:50%;background:var(--ink);color:var(--light);display:grid;place-items:center;box-shadow:0 0 0 6px var(--mineral),0 16px 30px -14px rgba(16,33,43,.8)}
.seal span svg{width:24px;height:24px}
.seal em{font-style:normal;color:var(--ink)}
`) + `<nav class="tb"><a class="on">${IC.home}Home</a><a>${IC.svc}Services</a><a class="seal"><span>${U}</span><em>Mandate</em></a><a>${IC.exp}Experience</a><a>${IC.more}More</a></nav>`],
    C: ['Index Sheet', 'Custom. The menu opens as a full-height ink sheet: big numbered destinations with a serif line each, a card showing Ulysses with his direct email and phone, and the mandate action pinned at the bottom.', () => `
<style>
html,body{background:var(--ink)!important}.sh{min-height:798px;background:var(--ink);color:var(--light);display:flex;flex-direction:column}
.sh .top{display:flex;justify-content:space-between;align-items:center;padding:14px 20px}
.sh .brand small{color:#9fb0b7}
.x{width:40px;height:40px;border-radius:12px;display:grid;place-items:center;box-shadow:inset 0 0 0 1px var(--drule);font-size:18px}
.ix{padding:18px 20px 0;list-style:none}
.ix li{display:grid;grid-template-columns:34px 1fr auto;align-items:baseline;padding:16px 0;border-bottom:1px solid var(--drule)}
.ix .n{font-family:'JetBrains Mono';font-size:11px;color:#8ba0a9}
.ix b{font-family:Archivo;font-weight:540;font-size:30px;letter-spacing:-.045em;line-height:1}
.ix em{grid-column:2;font-family:'EB Garamond';font-size:17px;color:#b7c4c9;margin-top:4px}
.ix .on b:after{content:'';display:inline-block;width:7px;height:7px;border-radius:50%;background:#c9d6db;margin-left:10px;vertical-align:middle}
.who{margin:22px 20px 0;padding:14px;border-radius:12px;background:rgba(255,255,255,.05);box-shadow:inset 0 0 0 1px var(--drule);display:grid;grid-template-columns:52px 1fr;gap:12px;align-items:center}
.who img{width:52px;height:52px;border-radius:10px;object-fit:cover}
.who b{font-size:15px}.who p{font-size:12.5px;color:#a9b8be;line-height:1.4}
.ct{display:flex;gap:8px;margin:12px 20px 0}
.ct a{flex:1;padding:12px;border-radius:10px;box-shadow:inset 0 0 0 1px var(--drule);font-size:12.5px}
.ct a small{display:block;font-size:9.5px;letter-spacing:.16em;color:#8ba0a9;font-weight:600}
.cta{margin:auto 20px 30px}.cta .btn{width:100%;justify-content:space-between}
</style>
<div class="sh"><div class="top">${BRAND}<button class="x">✕</button></div>
<ol class="ix"><li class="on"><span class="n">00</span><b>Home</b><em>Capital markets architecture</em></li><li><span class="n">01</span><b>Services</b><em>Four capabilities</em></li><li><span class="n">02</span><b>Experience</b><em>Inside the institutions</em></li><li><span class="n">03</span><b>Nasdaq Calypso</b><em>Since 2004, every office</em></li></ol>
<div class="who"><img src="${I.uw}" alt=""><div><b>Ulysses Williams</b><p>Reads every inquiry and replies directly.</p></div></div>
<div class="ct"><a><small>EMAIL</small>admin@ulixescorp.com</a><a><small>PHONE</small>+1 (415) 283-9983</a></div>
<div class="cta"><a class="btn lt"><span>Discuss a mandate</span><i>${ARR}</i></a></div></div>`],
  } },
/* ------------------------------------------------------------ 2 */
{ id: 'mhero', name: 'Home Hero · Phone', score: 6, device: 'phone', where: 'Home · phone',
  issue: 'On a phone the skyline shrinks to a grey band holding only a play button and a location tag. The headline is small, and the eyebrow wraps so that "FUNDS" sits alone on its own line.',
  refs: [['Humble', 'https://mobbin.com/sites/sections/7c7c11a9-a1d7-4518-bad2-9df715dd0fb3'], ['Sana', 'https://mobbin.com/sites/sections/598dc09d-50c8-40e5-b159-a9a2e78963d3']],
  opts: {
    A: ['Full-Bleed Skyline', 'The skyline fills the top two-thirds of the screen and the headline sits over it in mineral white. The four proof points become a strip you can swipe.', () => `
<style>
body{padding-top:0!important}.h{position:relative;height:640px;color:#fff}
.h img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.h:after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,rgba(16,33,43,.35) 0,transparent 22%,transparent 40%,rgba(16,33,43,.88) 92%)}
.h .top{position:relative;z-index:2;display:flex;justify-content:space-between;padding:58px 20px 14px}.h .brand small{color:#d5dde0}
.h .tx{position:absolute;z-index:2;left:20px;right:20px;bottom:26px}
.h .eb{color:#d2dbde}
.h h1{font-size:40px;margin-top:14px}
.h p.l{margin-top:12px;font-size:15px;color:#e0e6e8}
.h .b{display:flex;gap:10px;margin-top:20px}.h .b .btn{flex:1;justify-content:space-between}
.strip{display:flex;gap:10px;overflow:auto;padding:18px 20px;scrollbar-width:none}
.strip div{flex:0 0 150px;padding:14px;border-radius:10px;background:var(--light);box-shadow:0 0 0 1px var(--rule)}
.strip small{font-size:9.5px;letter-spacing:.16em;font-weight:600;color:var(--steel)}
.strip b{display:block;font-family:Archivo;font-size:20px;letter-spacing:-.04em;margin-top:6px}
.strip span{font-size:12px;color:var(--steel)}
</style>
<section class="h"><img src="${I.sf}" alt=""><div class="top">${BRAND}<span style="font-size:13px;font-weight:600">Menu</span></div>
<div class="tx"><p class="eb">Senior-led · Banks &amp; hedge funds</p><h1 class="d">Capital markets transformation &amp; architecture.</h1><p class="l">Deep expertise in Nasdaq Calypso and front-to-back transformation.</p><div class="b"><a class="btn lt"><span>Discuss a mandate</span><i>${ARR}</i></a></div></div></section>
<div class="strip"><div><small>CONTINUITY</small><b>Since 2004</b><span>Calypso experience</span></div><div><small>LIFECYCLE</small><b>Front to back</b><span>Delivery perspective</span></div><div><small>REACH</small><b>4 regions</b><span>NA · EU · APAC · LatAm</span></div><div><small>ACCESS</small><b>Senior led</b><span>Direct practitioner</span></div></div>`],
    B: ['Framed Plate', 'The headline comes first, set large. The skyline follows as a rounded plate with a coordinate caption, and the proof points sit beneath it as a ledger card.', () => `
<style>
.top{display:flex;justify-content:space-between;padding:14px 20px}
.tx{padding:22px 20px 0}
.tx h1{font-size:44px;margin-top:16px}.tx h1 em{font-size:46px}
.plate{margin:22px 12px 0;position:relative;border-radius:16px;overflow:hidden;height:260px;box-shadow:0 30px 50px -36px rgba(16,33,43,.7)}
.plate img{width:100%;height:100%;object-fit:cover}
.cap{position:absolute;left:12px;right:12px;bottom:12px;display:flex;justify-content:space-between;align-items:center;padding:9px 12px;border-radius:10px;background:rgba(16,33,43,.55);backdrop-filter:blur(10px);color:#fff;font-size:11px}
.cap .m{color:#c5d1d5}
.led{margin:-26px 24px 0;position:relative;background:var(--light);border-radius:12px;box-shadow:0 0 0 1px var(--rule),0 24px 40px -30px rgba(16,33,43,.5);display:grid;grid-template-columns:1fr 1fr}
.led div{padding:14px 16px;border-top:1px solid var(--rule)}.led div:nth-child(-n+2){border-top:0}.led div:nth-child(odd){border-right:1px solid var(--rule)}
.led b{display:block;font-family:Archivo;font-size:19px;letter-spacing:-.04em}.led span{font-size:11.5px;color:var(--steel)}
.b{padding:22px 20px 30px;display:flex;gap:12px;align-items:center}
</style>
<div class="top">${BRAND}<span style="font-size:13px;font-weight:600">Menu</span></div>
<div class="tx"><p class="eb">Senior-led advisory</p><h1 class="d">Capital markets <em class="s">transformation</em> &amp; architecture.</h1></div>
<div class="plate"><img src="${I.sf}" alt=""><div class="cap"><span>● San Francisco</span><span class="m">37.79°N 122.40°W</span></div></div>
<div class="led"><div><b>Since 2004</b><span>Calypso experience</span></div><div><b>Front to back</b><span>Delivery perspective</span></div><div><b>4 regions</b><span>NA · EU · APAC · LatAm</span></div><div><b>Senior led</b><span>Direct access</span></div></div>
<div class="b"><a class="btn"><span>Discuss a mandate</span><i>${ARR}</i></a><a class="tl">Capabilities</a></div>`],
    C: ['Type & Filmstrip', 'Type leads the screen, with a serif turn on the second line. Underneath, a swipeable filmstrip shows the three city and hall photographs with captions, so the imagery works on a phone.', () => `
<style>
.top{display:flex;justify-content:space-between;padding:14px 20px}
.tx{padding:30px 20px 0}
.tx h1{font-size:46px}.tx h1 span{display:block;font-size:44px;margin-top:4px}
.tx p{margin-top:16px;color:var(--graphite)}
.fs{display:flex;gap:10px;overflow:auto;padding:24px 20px 6px;scroll-snap-type:x mandatory;scrollbar-width:none}
.fs figure{flex:0 0 250px;scroll-snap-align:start}
.fs img{height:300px;width:100%;object-fit:cover;border-radius:12px}
.fs figcaption{display:flex;justify-content:space-between;margin-top:8px;font-size:11.5px;color:var(--steel)}
.dots{display:flex;gap:5px;padding:8px 20px}.dots i{width:18px;height:3px;border-radius:2px;background:var(--plat)}.dots i:first-child{background:var(--ink)}
.b{padding:16px 20px 30px}.b .btn{width:100%;justify-content:space-between}
</style>
<div class="top">${BRAND}<span style="font-size:13px;font-weight:600">Menu</span></div>
<div class="tx"><p class="eb">Since 2004 · Calypso</p><h1 class="d" style="margin-top:16px">Capital markets <span class="s">transformation &amp; architecture.</span></h1><p>Senior-led advisory for banks and hedge funds, from first booking decision to the close.</p></div>
<div class="fs"><figure><img src="${I.sf}" alt=""><figcaption><span>San Francisco</span><span class="m">01 / 03</span></figcaption></figure><figure><img src="${I.day}" alt=""><figcaption><span>Financial District</span><span class="m">02 / 03</span></figcaption></figure><figure><img src="${I.hall}" alt=""><figcaption><span>Institutional work</span><span class="m">03 / 03</span></figcaption></figure></div>
<div class="dots"><i></i><i></i><i></i></div>
<div class="b"><a class="btn"><span>Discuss a mandate</span><i>${ARR}</i></a></div>`],
  } },
/* ------------------------------------------------------------ hero video */
{ id: 'video', name: 'Hero Video', score: 8, device: 'pair', where: 'Home · desktop and phone',
  issue: 'The San Francisco loop is the only hero video on the site, and it works on desktop. On phones it never plays: the code only autoplays it at 768px and up, so a phone gets the still poster masked into a grey band with a play button. Desktop rates an 8, phone a 6. Each option below runs the real loop, muted, on both screens. Whatever phone layout you pick in Area 2 inherits this treatment.',
  refs: [['Humble', 'https://mobbin.com/sites/sections/7c7c11a9-a1d7-4518-bad2-9df715dd0fb3'], ['Sana', 'https://mobbin.com/sites/sections/598dc09d-50c8-40e5-b159-a9a2e78963d3']],
  opts: {
    A: ['Keep It, Fix the Phone', 'Desktop stays as it is today: the loop on the right feathering into mineral, with the proof dock overlapping the bottom edge. On the phone the loop finally plays, as a full-width 4:5 plate under the header with a small pause chip, and the headline sits below it.', () => VD.desk(`
.card{position:relative;height:640px;border-radius:12px;overflow:hidden;background:var(--light);box-shadow:0 0 0 1px var(--rule)}
.card video{position:absolute;right:0;top:0;width:66%;height:100%;object-fit:cover;-webkit-mask-image:linear-gradient(90deg,transparent,#000 34%);mask-image:linear-gradient(90deg,transparent,#000 34%)}
.tx{position:relative;z-index:1;padding:110px 0 0 64px;max-width:640px}
.tx h1{font-size:68px;margin-top:20px}.tx p{margin-top:20px;color:var(--graphite);max-width:46ch}
.acts{display:flex;gap:18px;align-items:center;margin-top:30px}
.pz{position:absolute;right:24px;bottom:92px;width:40px;height:40px;border-radius:50%;background:rgba(250,249,246,.85);display:grid;place-items:center;font-size:11px}
.dock{position:relative;z-index:2;margin:-70px 56px 0;display:grid;grid-template-columns:repeat(4,1fr);background:rgba(250,249,246,.94);border-radius:10px;box-shadow:0 0 0 1px var(--rule),0 30px 50px -36px rgba(16,33,43,.6)}
.dock div{padding:22px 24px}.dock div+div{border-left:1px solid var(--rule)}
.dock small{font-size:10px;letter-spacing:.16em;font-weight:700;color:var(--steel)}.dock b{display:block;font-family:Archivo;font-size:24px;letter-spacing:-.045em;margin-top:6px}.dock span{font-size:12px;color:var(--steel)}
`, `<div class="card">${VD.v}<div class="tx"><p class="eb">Senior-led advisory for banks and hedge funds</p><h1 class="d">Capital markets transformation &amp; architecture.</h1><p>Deep expertise in Nasdaq Calypso and complex front-to-back transformation.</p><div class="acts"><a class="btn"><span>Discuss a mandate</span><i>${ARR}</i></a><a class="tl">Review the capabilities →</a></div></div><span class="pz">❚❚</span></div>${VD.dock}`), () => VD.phone(`
.pl{position:relative;margin:4px 12px 0;border-radius:14px;overflow:hidden;aspect-ratio:4/5}
.pl video{width:100%;height:100%;object-fit:cover;object-position:62% center}
.pl:after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,transparent 60%,rgba(16,33,43,.45))}
.pl .cap{position:absolute;z-index:1;left:14px;right:14px;bottom:12px;display:flex;justify-content:space-between;align-items:center;color:#fff;font-size:10px;letter-spacing:.16em;font-weight:600}
.pl .cap i{width:32px;height:32px;border-radius:50%;background:rgba(250,249,246,.85);color:var(--ink);display:grid;place-items:center;font-style:normal;font-size:9px;letter-spacing:0}
.tx{padding:22px 20px}.tx h1{font-size:34px;margin-top:12px}.tx p{margin-top:10px;color:var(--graphite)}
`, `<div class="pl">${VD.v}<div class="cap"><span>● SAN FRANCISCO</span><i>❚❚</i></div></div><div class="tx"><p class="eb">Senior-led advisory</p><h1 class="d">Capital markets transformation &amp; architecture.</h1><p>Deep expertise in Nasdaq Calypso and front-to-back transformation.</p><a class="btn" style="margin-top:18px;width:100%;justify-content:space-between"><span>Discuss a mandate</span><i>${ARR}</i></a></div>`)],
    B: ['Cinematic Plate', 'The loop fills the whole hero edge to edge, like a film still, and the headline sits on top of it in mineral white. On desktop the proof points become a glass strip across the bottom; on the phone the loop runs full-screen, behind the status bar.', () => VD.desk(`
.cn{position:relative;height:820px;border-radius:14px;overflow:hidden;color:#fff}
.cn video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.cn:after{content:'';position:absolute;inset:0;background:linear-gradient(90deg,rgba(16,33,43,.78),rgba(16,33,43,.2) 62%),linear-gradient(0deg,rgba(16,33,43,.6),transparent 45%)}
.tx{position:absolute;z-index:1;left:64px;top:128px;max-width:720px}.tx .eb{color:#d2dbde}
.tx h1{font-size:86px;margin-top:22px}.tx p{margin-top:22px;color:#e0e6e8;max-width:46ch;font-size:17px}
.acts{display:flex;gap:18px;align-items:center;margin-top:32px}
.gl{position:absolute;z-index:2;left:24px;right:24px;bottom:24px;display:grid;grid-template-columns:repeat(4,1fr) 64px;border-radius:12px;background:rgba(250,249,246,.12);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);box-shadow:inset 0 0 0 1px rgba(255,255,255,.2)}
.gl div{padding:18px 22px}.gl div+div{border-left:1px solid rgba(255,255,255,.14)}
.gl small{font-size:10px;letter-spacing:.16em;font-weight:700;color:#c9d6db}.gl b{display:block;font-family:Archivo;font-size:22px;letter-spacing:-.045em;margin-top:4px}
.gl .pz{display:grid;place-items:center;font-size:11px}
`, `<div class="cn">${VD.v}<div class="tx"><p class="eb">Senior-led advisory for banks and hedge funds</p><h1 class="d">Capital markets transformation &amp; architecture.</h1><p>Deep expertise in Nasdaq Calypso and complex front-to-back transformation.</p><div class="acts"><a class="btn lt"><span>Discuss a mandate</span><i>${ARR}</i></a><a class="tl">Review the capabilities →</a></div></div><div class="gl"><div><small>CONTINUITY</small><b>Since 2004</b></div><div><small>LIFECYCLE</small><b>Front to back</b></div><div><small>REACH</small><b>4 regions</b></div><div><small>ACCESS</small><b>Senior led</b></div><div class="pz">❚❚</div></div></div>`, true), () => VD.phone(`
body{padding-top:0!important}
.fb{position:relative;height:852px;color:#fff}
.fb video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:60% center}
.fb:after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,rgba(16,33,43,.45),transparent 20%,transparent 42%,rgba(16,33,43,.9) 88%)}
.fb .top{position:relative;z-index:2;display:flex;justify-content:space-between;padding:58px 20px 0}.fb .brand small{color:#d5dde0}
.fb .tx{position:absolute;z-index:2;left:20px;right:20px;bottom:40px}.fb .eb{color:#d2dbde}
.fb h1{font-size:40px;margin-top:14px}.fb p{margin-top:12px;color:#e0e6e8}
.fb .pz{position:absolute;z-index:2;right:20px;top:110px;width:34px;height:34px;border-radius:50%;background:rgba(250,249,246,.2);backdrop-filter:blur(8px);display:grid;place-items:center;font-size:9px}
`, `<div class="fb">${VD.v}<div class="top">${BRAND}<span style="font-size:13px;font-weight:600">Menu</span></div><span class="pz">❚❚</span><div class="tx"><p class="eb">Senior-led · Banks &amp; hedge funds</p><h1 class="d">Capital markets transformation &amp; architecture.</h1><p>Deep expertise in Nasdaq Calypso and front-to-back transformation.</p><a class="btn lt" style="margin-top:20px;width:100%;justify-content:space-between"><span>Discuss a mandate</span><i>${ARR}</i></a></div></div>`, true)],
    C: ['Arched Window', 'Custom. The loop plays inside a tall arched window, borrowing the institutional architecture of the halls in the other photographs, with a caption reading "San Francisco" and the live local time. It gives the site its own shape instead of a rectangle, and the same arch sits centred on the phone.', () => VD.desk(`
.g{display:grid;grid-template-columns:1fr 460px;gap:96px;align-items:center;padding:60px 0 20px}
.g h1{font-size:76px;margin-top:22px}.g p{margin-top:22px;color:var(--graphite);max-width:44ch;font-size:16px}
.acts{display:flex;gap:18px;align-items:center;margin-top:32px}
.ar{position:relative}
.ar .w{height:600px;border-radius:230px 230px 10px 10px;overflow:hidden;box-shadow:0 0 0 1px var(--rule),0 60px 90px -60px rgba(16,33,43,.8)}
.ar video{width:100%;height:100%;object-fit:cover;object-position:62% center}
.ar .cp{display:flex;justify-content:space-between;align-items:center;margin-top:14px;font-size:12.5px;color:var(--steel)}
.ar .cp b{font-family:'JetBrains Mono';font-weight:500;color:var(--ink)}
.ar .cp i{display:inline-block;width:7px;height:7px;border-radius:50%;background:#4f8a5b;margin-right:8px;box-shadow:0 0 0 3px rgba(79,138,91,.15)}
.st{display:grid;grid-template-columns:repeat(4,1fr);margin-top:56px;border-top:1px solid var(--rule2)}
.st div{padding:18px 0 0}.st div+div{padding-left:22px;border-left:1px solid var(--rule)}
.st small{font-size:10px;letter-spacing:.16em;font-weight:700;color:var(--steel)}.st b{display:block;font-family:Archivo;font-size:24px;letter-spacing:-.045em;margin-top:4px}
`, `<div class="g"><div><p class="eb">Senior-led advisory for banks and hedge funds</p><h1 class="d">Capital markets <span class="s">transformation</span> &amp; architecture.</h1><p>Deep expertise in Nasdaq Calypso and complex front-to-back transformation.</p><div class="acts"><a class="btn"><span>Discuss a mandate</span><i>${ARR}</i></a><a class="tl">Review the capabilities →</a></div></div><div class="ar"><div class="w">${VD.v}</div><div class="cp"><span><i></i>San Francisco · live</span><b class="clk">--:--</b></div></div></div><div class="st"><div><small>CONTINUITY</small><b>Since 2004</b></div><div><small>LIFECYCLE</small><b>Front to back</b></div><div><small>REACH</small><b>4 regions</b></div><div><small>ACCESS</small><b>Senior led</b></div></div>${VD.clock}`), () => VD.phone(`
.tx{padding:26px 20px 0;text-align:center}.tx .eb{justify-content:center}
.tx h1{font-size:36px;margin-top:14px}
.ar{width:250px;margin:26px auto 0}
.ar .w{height:320px;border-radius:125px 125px 10px 10px;overflow:hidden;box-shadow:0 40px 60px -40px rgba(16,33,43,.8)}
.ar video{width:100%;height:100%;object-fit:cover;object-position:62% center}
.ar .cp{display:flex;justify-content:space-between;margin-top:10px;font-size:11.5px;color:var(--steel)}.ar .cp b{font-family:'JetBrains Mono';font-weight:500;color:var(--ink)}
.b{padding:22px 20px}.b .btn{width:100%;justify-content:space-between}
`, `<div class="tx"><p class="eb">Senior-led advisory</p><h1 class="d">Capital markets <span class="s">transformation</span> &amp; architecture.</h1></div><div class="ar"><div class="w">${VD.v}</div><div class="cp"><span>● San Francisco · live</span><b class="clk">--:--</b></div></div><div class="b"><a class="btn"><span>Discuss a mandate</span><i>${ARR}</i></a></div>${VD.clock}`)],
  } },
/* ------------------------------------------------------------ 3 */
{ id: 'rows', name: 'Capability Lists', score: 6.5, device: 'desktop', where: 'Home, Services, Calypso, Privacy, Terms',
  issue: 'The same numbered row table appears on five pages: a tiny mono number, an empty gutter, a title, a paragraph and a boxed arrow. It reads like a spreadsheet, and the repetition is a big part of why the site feels basic.',
  refs: [['Vucko', 'https://mobbin.com/sites/sections/72f31890-b4dd-46f4-b6f6-11ce33361d24'], ['Büro', 'https://mobbin.com/sites/sections/76e383bf-2bdf-422d-992b-14495ff32fe5'], ['OFF+BRAND', 'https://mobbin.com/sites/sections/dd3b3bfe-d63e-47e7-b692-64cde2a3f494']],
  opts: {
    A: ['Oversized Index', 'Each capability gets a monumental numeral, a serif kicker and a thumbnail plate, so the list scrolls like an editorial index instead of a table.', () => {
      const R = [['01', 'Transformation and solution architecture', 'Modernization · Architecture · Operating model', 'Platform modernization, front-to-back architecture, and migration strategy decided before technology selection.', I.atrium], ['02', 'Accounting and controls', 'Accounting · Reconciliation · Controls', 'Capital markets and hedge accounting, reconciliation, and the control architecture that holds at the close.', I.hall], ['03', 'Trading, risk and post-trade', 'Pricing · Collateral · Lifecycle', 'Derivatives and securities through pricing, market data, collateral, settlement, and lifecycle processing.', I.day]];
      return `<style>
.sec{padding:96px 0}
.hd{display:grid;grid-template-columns:1fr 1fr;align-items:end;gap:60px;margin-bottom:56px}
.hd h2{font-size:58px;margin-top:18px}.hd p{color:var(--graphite);max-width:44ch}
.row{display:grid;grid-template-columns:220px 1fr 260px;gap:48px;padding:40px 0;border-top:1px solid var(--rule2);align-items:center}
.row:last-child{border-bottom:1px solid var(--rule2)}
.num{font-family:Archivo;font-weight:300;font-size:150px;letter-spacing:-.07em;line-height:.8;color:var(--ink)}
.row h3{font-family:Archivo;font-weight:560;font-size:34px;letter-spacing:-.04em;line-height:1.05;max-width:16ch}
.row .k{font-family:'EB Garamond';font-style:italic;font-size:19px;color:var(--steel);margin-top:10px}
.row p{margin-top:14px;color:var(--graphite);max-width:52ch}
.row img{height:170px;width:100%;object-fit:cover;border-radius:6px;filter:saturate(.8)}
.row:hover .num{color:var(--line)}
</style><section class="sec"><div class="wrap"><div class="hd"><div><p class="eb">Capabilities</p><h2 class="d">Four points where <span class="s">delivery risk</span> concentrates.</h2></div><p>Transformation and architecture lead. Accounting, risk, post-trade, and assurance follow the same decision through the system.</p></div>
${R.map(r => `<article class="row"><span class="num">${r[0]}</span><div><h3>${r[1]}</h3><p class="k">${r[2]}</p><p>${r[3]}</p></div><img src="${r[4]}" alt=""></article>`).join('')}</div></section>`; }],
    B: ['Stacked Plates', 'The four capabilities sit as cards stacked like index tabs. The open one is a full plate with image, scope and action; the rest peek out beneath as labelled tabs you click to bring forward.', () => `
<style>
.sec{padding:96px 0}
.hd{display:flex;justify-content:space-between;align-items:end;margin-bottom:44px}.hd h2{font-size:56px;margin-top:18px;max-width:14ch}
.stack{position:relative}
.tab{display:grid;grid-template-columns:80px 1fr auto;align-items:center;padding:22px 32px;background:var(--light);border-radius:10px;box-shadow:0 0 0 1px var(--rule),0 18px 30px -28px rgba(16,33,43,.5);margin-top:-10px;position:relative;cursor:pointer;transition:transform .5s var(--ease)}
.tab:hover{transform:translateY(-4px)}
.tab .m{color:var(--steel)}.tab b{font-family:Archivo;font-size:24px;letter-spacing:-.04em;font-weight:540}.tab span.t{font-size:12px;color:var(--steel);letter-spacing:.06em}
.open{display:grid;grid-template-columns:1.1fr 1fr;background:var(--ink);color:var(--light);border-radius:12px;overflow:hidden;position:relative;z-index:5;box-shadow:0 40px 60px -40px rgba(16,33,43,.8)}
.open .tx{padding:44px 48px;display:flex;flex-direction:column}
.open .m{color:#8ba0a9}.open h3{font-family:Archivo;font-size:40px;letter-spacing:-.045em;line-height:1.02;font-weight:550;margin-top:18px}
.open p{color:#c3cfd3;margin-top:16px;max-width:44ch}
.chips{display:flex;gap:8px;margin-top:22px}.chips span{padding:6px 12px;border-radius:999px;box-shadow:inset 0 0 0 1px var(--drule);font-size:12px;color:#d6dfe2}
.open .btn{margin-top:auto;align-self:flex-start}
.open img{width:100%;height:100%;object-fit:cover;min-height:380px}
</style>
<section class="sec"><div class="wrap"><div class="hd"><div><p class="eb">Capabilities</p><h2 class="d">One decision, <span class="s">followed through.</span></h2></div><a class="tl">All capabilities →</a></div>
<div class="stack"><div class="open"><div class="tx"><span class="m">01 / 04</span><h3>Transformation and solution architecture</h3><p>Platform modernization, front-to-back architecture, and migration strategy decided before technology selection.</p><div class="chips"><span>Modernization</span><span>Architecture</span><span>Operating model</span></div><a class="btn lt" style="margin-top:34px"><span>Discuss this capability</span><i>${ARR}</i></a></div><img src="${I.atrium}" alt=""></div>
<div class="tab" style="z-index:4"><span class="m">02</span><b>Accounting and controls</b><span class="t">ACCOUNTING · RECONCILIATION · CONTROLS</span></div>
<div class="tab" style="z-index:3"><span class="m">03</span><b>Trading, risk and post-trade</b><span class="t">PRICING · COLLATERAL · LIFECYCLE</span></div>
<div class="tab" style="z-index:2"><span class="m">04</span><b>Automation and transformation assurance</b><span class="t">TESTING · VALIDATION · READINESS</span></div></div></div></section>`],
    C: ['Ledger & Preview', 'Custom. On the left, a column of large titles; hovering one slides a dot alongside it. On the right, a sticky preview panel crossfades to that capability\'s photograph, scope and copy. Hover the titles to try it.', () => {
      const R = [['Transformation and solution architecture', 'Modernization · Architecture · Operating model', 'Platform modernization, front-to-back architecture, and migration strategy decided before technology selection.', I.atrium], ['Accounting and controls', 'Accounting · Reconciliation · Controls', 'Capital markets and hedge accounting, reconciliation, and the control architecture that holds at the close.', I.hall], ['Trading, risk and post-trade', 'Pricing · Collateral · Lifecycle', 'Derivatives and securities through pricing, market data, collateral, settlement, and lifecycle processing.', I.day], ['Automation and transformation assurance', 'Testing · Validation · Readiness', 'Automated testing, migration validation, SIT and UAT, and production readiness, with intelligent automation applied to each.', I.floor]];
      return `<style>
.sec{padding:96px 0}
.g{display:grid;grid-template-columns:1.15fr 1fr;gap:72px;align-items:start}
.g h2{font-size:52px;margin:18px 0 40px}
.li{list-style:none;border-top:1px solid var(--rule2)}
.li li{display:grid;grid-template-columns:44px 1fr 20px;align-items:center;padding:24px 0;border-bottom:1px solid var(--rule2);cursor:pointer}
.li .m{color:var(--steel)}
.li b{font-family:Archivo;font-weight:520;font-size:30px;letter-spacing:-.045em;line-height:1.05;color:var(--steel);transition:color .3s,transform .5s var(--ease)}
.li i{width:9px;height:9px;border-radius:50%;background:var(--ink);opacity:0;transform:scale(.4);transition:.4s var(--ease)}
.li li.on b{color:var(--ink);transform:translateX(6px)}.li li.on i{opacity:1;transform:none}
.pv{position:sticky;top:30px;background:var(--light);border-radius:12px;overflow:hidden;box-shadow:0 0 0 1px var(--rule),0 40px 70px -50px rgba(16,33,43,.6)}
.pv .im{position:relative;height:300px}.pv .im img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0;transition:opacity .6s}.pv .im img.on{opacity:1}
.pv .tx{padding:28px 30px 32px}.pv .k{font-family:'EB Garamond';font-style:italic;font-size:19px;color:var(--steel)}
.pv p{margin-top:12px;color:var(--graphite);min-height:78px}
.pv .ft{display:flex;justify-content:space-between;align-items:center;margin-top:20px;padding-top:18px;border-top:1px solid var(--rule)}
</style><section class="sec"><div class="wrap g"><div><p class="eb">Capabilities</p><h2 class="d">Four points where <span class="s">risk concentrates.</span></h2>
<ol class="li">${R.map((r, i) => `<li data-i="${i}" class="${i ? '' : 'on'}"><span class="m">0${i + 1}</span><b>${r[0]}</b><i></i></li>`).join('')}</ol></div>
<aside class="pv"><div class="im">${R.map((r, i) => `<img src="${r[3]}" class="${i ? '' : 'on'}" alt="">`).join('')}</div><div class="tx"><p class="k" id="k">${R[0][1]}</p><p id="p">${R[0][2]}</p><div class="ft"><span class="m" id="n">01 / 04</span><a class="tl">Discuss this capability ↗</a></div></div></aside></div></section>
<script>const R=${JSON.stringify(R)};document.querySelectorAll('.li li').forEach(li=>li.addEventListener('mouseenter',()=>{const i=+li.dataset.i;document.querySelectorAll('.li li').forEach(x=>x.classList.toggle('on',x===li));document.querySelectorAll('.im img').forEach((m,j)=>m.classList.toggle('on',j===i));k.textContent=R[i][1];p.textContent=R[i][2];n.textContent='0'+(i+1)+' / 04';}));</script>`; }],
  } },
/* ------------------------------------------------------------ 4 */
{ id: 'prac', name: 'The Practitioner', score: 6, device: 'desktop', where: 'Home',
  issue: 'This section introduces Ulysses but shows the same skyline as the hero, plus a "San Francisco base" tag. His portrait, the strongest trust signal on the site, never appears on the homepage.',
  refs: [['Humble', 'https://mobbin.com/sites/sections/7c7c11a9-a1d7-4518-bad2-9df715dd0fb3'], ['Analogue Agency', 'https://mobbin.com/sites/sections/ec7c6b3a-accc-48a3-b3b9-c5a87f7d63bf']],
  opts: {
    A: ['Portrait & Statement', 'A tall portrait sits beside a large serif statement, with his name and title set as a signature line. Three credentials sit in a ruled row underneath.', () => `
<style>
.sec{padding:110px 0}
.g{display:grid;grid-template-columns:440px 1fr;gap:88px;align-items:center}
.pt{position:relative}.pt img{width:100%;height:560px;object-fit:cover;object-position:center 20%;border-radius:8px;box-shadow:0 50px 80px -60px rgba(16,33,43,.8)}
.pt span{position:absolute;left:16px;bottom:16px;padding:7px 12px;border-radius:8px;background:rgba(250,249,246,.9);font-size:11px;font-weight:600;letter-spacing:.14em}
.q{font-family:'EB Garamond';font-style:italic;font-size:46px;line-height:1.12;letter-spacing:-.02em;margin-top:26px;max-width:20ch}
.sig{display:flex;align-items:center;gap:14px;margin-top:30px}.sig:before{content:'';width:40px;height:1px;background:var(--ink)}
.sig b{font-size:16px}.sig span{color:var(--steel);font-size:14px}
.cr{display:grid;grid-template-columns:repeat(3,1fr);margin-top:48px;border-top:1px solid var(--rule2)}
.cr div{padding:20px 20px 0 0}.cr div+div{padding-left:20px;border-left:1px solid var(--rule)}
.cr b{display:block;font-family:Archivo;font-size:28px;letter-spacing:-.045em}.cr span{font-size:13px;color:var(--steel)}
.acts{display:flex;gap:16px;align-items:center;margin-top:40px}
</style>
<section class="sec"><div class="wrap g"><div class="pt"><img src="${I.uw}" alt=""><span>PRESIDENT</span></div>
<div><p class="eb">The practitioner</p><p class="q">“Every mandate is led by the person who has sat inside the institution.”</p><p class="sig"><b>Ulysses Williams</b><span>President · Calypso subject-matter expert</span></p>
<div class="cr"><div><b>2004</b><span>Calypso work since</span></div><div><b>3 offices</b><span>Front, middle and back</span></div><div><b>4 regions</b><span>NA · EU · APAC · LatAm</span></div></div>
<div class="acts"><a class="btn"><span>View Ulysses on LinkedIn</span><i>${ARR}</i></a><a class="tl">Institutional experience →</a></div></div></div></section>`],
    B: ['Dossier Card', 'Custom. Ulysses is presented as a practitioner dossier: a file tab, a portrait, and a ledger of mono labels with values (role, platform, offices, regions, access). The shape echoes the institutional subject matter.', () => `
<style>
.sec{padding:110px 0}
.g{display:grid;grid-template-columns:1fr 1.2fr;gap:80px;align-items:center}
.g h2{font-size:56px;margin-top:18px}.g h2 em{display:block}
.g p.l{color:var(--graphite);margin-top:20px;max-width:42ch}
.dz{position:relative;background:var(--light);border-radius:4px 12px 12px 12px;box-shadow:0 0 0 1px var(--rule),0 50px 80px -60px rgba(16,33,43,.7)}
.dz:before{content:'PRACTITIONER FILE';position:absolute;top:-30px;left:0;padding:8px 16px;background:var(--light);border-radius:8px 8px 0 0;font-size:10px;letter-spacing:.2em;font-weight:700;box-shadow:0 -1px 0 var(--rule),-1px 0 0 var(--rule),1px 0 0 var(--rule)}
.dh{display:grid;grid-template-columns:140px 1fr;gap:24px;padding:28px;border-bottom:1px solid var(--rule)}
.dh img{width:140px;height:170px;object-fit:cover;border-radius:6px}
.dh b{font-family:Archivo;font-size:30px;letter-spacing:-.045em;display:block;margin-top:6px}.dh .m{color:var(--steel)}
.dh .stamp{display:inline-block;margin-top:18px;padding:5px 10px;border:1px solid var(--ink);border-radius:4px;font-size:10px;letter-spacing:.18em;font-weight:700;transform:rotate(-2deg)}
.fl{display:grid;grid-template-columns:150px 1fr;padding:15px 28px;border-bottom:1px solid var(--rule)}.fl:last-child{border:0}
.fl .m{color:var(--steel);text-transform:uppercase}.fl span{font-size:14.5px}
</style>
<section class="sec"><div class="wrap g"><div><p class="eb">The practitioner</p><h2 class="d">Ulysses Williams <em class="s">leads the work.</em></h2><p class="l">Every mandate is led personally, bringing a front-, middle-, and back-office view of Calypso delivery to the decisions that shape it.</p><div style="display:flex;gap:16px;align-items:center;margin-top:30px"><a class="btn"><span>View on LinkedIn</span><i>${ARR}</i></a><a class="tl">Full experience →</a></div></div>
<div class="dz"><div class="dh"><img src="${I.uw}" alt=""><div><span class="m">UW · 2004</span><b>Ulysses Williams</b><span class="mute">President, Ulixes Corporation</span><br><span class="stamp">SENIOR LED</span></div></div>
<div class="fl"><span class="m">Platform</span><span>Nasdaq Calypso, since 2004</span></div><div class="fl"><span class="m">Offices</span><span>Front, middle and back office</span></div><div class="fl"><span class="m">Institutions</span><span>Treasury, derivatives operations, core infrastructure</span></div><div class="fl"><span class="m">Regions</span><span>North America · Europe · APAC · Latin America</span></div><div class="fl"><span class="m">Access</span><span>Direct. Ulysses reads and answers every inquiry.</span></div></div></div></section>`],
    C: ['Portrait on Ink', 'The section turns dark, with the portrait cut into a deep ink panel and lit from the side, a serif headline, and a two-decade timeline rule running beneath. It gives the homepage a confident middle beat.', () => `
<style>
.sec{background:var(--ink);color:var(--light);padding:100px 0 90px;overflow:hidden}
.g{display:grid;grid-template-columns:1fr 420px;gap:80px;align-items:end}
.sec .eb{color:#9fb0b7}
.g h2{font-size:64px;margin-top:20px}.g h2 em{display:block;color:#c9d6db}
.g p{color:#b9c6cb;margin-top:22px;max-width:46ch}
.pt{position:relative}.pt img{width:100%;height:500px;object-fit:cover;border-radius:6px;filter:contrast(1.05)}
.pt:after{content:'';position:absolute;inset:0;border-radius:6px;background:linear-gradient(90deg,rgba(16,33,43,.55),transparent 45%)}
.tlr{margin-top:72px;position:relative;display:grid;grid-template-columns:repeat(4,1fr)}
.tlr:before{content:'';position:absolute;left:0;right:0;top:5px;height:1px;background:var(--drule)}
.tlr div{position:relative;padding-top:26px}.tlr div:before{content:'';position:absolute;top:0;left:0;width:11px;height:11px;border-radius:50%;background:var(--ink);box-shadow:inset 0 0 0 1.5px #c9d6db}
.tlr div:last-child:before{background:#c9d6db}
.tlr b{font-family:Archivo;font-size:22px;letter-spacing:-.04em}.tlr span{display:block;font-size:13px;color:#9fb0b7;margin-top:4px}
</style>
<section class="sec"><div class="wrap"><div class="g"><div><p class="eb">The practitioner</p><h2 class="d">Ulysses Williams <em class="s">leads the work.</em></h2><p>He leads every mandate personally, bringing the view from inside treasury, derivatives operations and core infrastructure to the decisions that shape delivery.</p><div style="display:flex;gap:18px;align-items:center;margin-top:30px"><a class="btn lt"><span>View on LinkedIn</span><i>${ARR}</i></a><a class="tl" style="color:#dfe7ea">Experience →</a></div></div><div class="pt"><img src="${I.uw}" alt=""></div></div>
<div class="tlr"><div><b>2004</b><span>Calypso work begins</span></div><div><b>Front to back</b><span>Every office the trade touches</span></div><div><b>Four regions</b><span>NA · Europe · APAC · LatAm</span></div><div><b>Today</b><span>Senior-led advisory, direct access</span></div></div></div></section>`],
  } },
/* ------------------------------------------------------------ 5 */
{ id: 'cta', name: 'Closing Call to Action', score: 6.5, device: 'desktop', where: 'Every page',
  issue: 'Every page ends on the same pale card. The headline sits on the left, a button floats in empty space on the right, and nothing tells the reader who will answer or what to send.',
  refs: [['Ada', 'https://mobbin.com/sites/sections/719dadf3-2b7e-44b1-81f2-1492ae96ca6b'], ['Analogue Agency', 'https://mobbin.com/sites/sections/ec7c6b3a-accc-48a3-b3b9-c5a87f7d63bf'], ['Melius', 'https://mobbin.com/sites/sections/d1ac4e79-634f-4d1a-a49c-3c91612641b6']],
  opts: {
    A: ['Ink Band, Real Person', 'A full-bleed ink band carries a large headline. Ulysses appears as a portrait chip that says he replies directly, next to a light primary button and his email.', () => `
<style>
.sec{padding:40px 0 100px}
.band{background:var(--ink);color:var(--light);border-radius:14px;padding:76px 72px;display:grid;grid-template-columns:1.3fr 1fr;gap:60px;align-items:end;position:relative;overflow:hidden}
.band:after{content:'';position:absolute;right:-120px;top:-160px;width:520px;height:520px;border-radius:50%;background:radial-gradient(circle,rgba(139,160,169,.22),transparent 65%)}
.band .eb{color:#9fb0b7}
.band h2{font-size:68px;margin-top:20px}.band h2 em{display:block;color:#c9d6db}
.chip{display:inline-flex;align-items:center;gap:12px;padding:8px 16px 8px 8px;border-radius:999px;background:rgba(255,255,255,.07);box-shadow:inset 0 0 0 1px var(--drule)}
.chip img{width:40px;height:40px;border-radius:50%;object-fit:cover}.chip b{display:block;font-size:14px}.chip span{font-size:12px;color:#a9b8be}
.r{position:relative;z-index:1;display:grid;gap:22px;justify-items:start}
.r .mail{font-size:15px;color:#dfe7ea;border-bottom:1px solid var(--drule);padding-bottom:4px}
</style>
<section class="sec"><div class="wrap"><div class="band"><div><p class="eb">Start a conversation</p><h2 class="d">Start with <em class="s">the mandate.</em></h2></div>
<div class="r"><span class="chip"><img src="${I.uw}" alt=""><span><b>Ulysses Williams</b><span>Reads every inquiry and replies directly</span></span></span><a class="btn lt"><span>Discuss a mandate</span><i>${ARR}</i></a><a class="mail">admin@ulixescorp.com</a></div></div></div></section>`],
    B: ['Inline Sentence', 'The button sits inside the headline. One large centred sentence ("Start with the [Discuss a mandate ↗] mandate."), with the email and the response promise set small beneath it. Confident and spare.', () => `
<style>
.sec{padding:130px 0;text-align:center;border-top:1px solid var(--rule)}
.sec .eb{justify-content:center}
.sec h2{font-size:84px;margin:26px auto 0;max-width:15ch;line-height:1.08}
.sec h2 .s{font-size:88px}
.ib{display:inline-flex;vertical-align:middle;align-items:center;gap:12px;height:72px;padding:0 12px 0 30px;margin:0 6px;border-radius:999px;background:var(--ink);color:var(--light);font-family:Outfit;font-size:22px;letter-spacing:0;font-weight:600;transform:translateY(-6px);box-shadow:0 24px 40px -24px rgba(16,33,43,.9)}
.ib i{width:50px;height:50px;border-radius:50%;background:var(--light);color:var(--ink);display:grid;place-items:center;font-style:normal}
.ft{display:flex;justify-content:center;gap:28px;margin-top:40px;font-size:14px;color:var(--steel)}
.ft a{color:var(--ink);font-weight:600;border-bottom:1px solid currentColor}
</style>
<section class="sec"><div class="wrap"><p class="eb">Start a conversation</p><h2 class="d">Start with the <a class="ib">Discuss a mandate <i>${ARR}</i></a> <span class="s">mandate.</span></h2><p class="ft"><a>admin@ulixescorp.com</a><span>Ulysses reads every inquiry and replies directly.</span></p></div></section>`],
    C: ['Brief Card', 'Custom. The CTA does real work. On the left, the headline and the promise. On the right, a "What to include" checklist (platform state, delivery stage, the decision) above the button, so the first email arrives already useful.', () => `
<style>
.sec{padding:100px 0}
.card{display:grid;grid-template-columns:1fr 480px;background:var(--light);border-radius:12px;overflow:hidden;box-shadow:0 0 0 1px var(--rule),0 50px 90px -60px rgba(16,33,43,.55)}
.l{padding:64px}.l h2{font-size:60px;margin-top:20px}.l h2 em{display:block}
.l p{color:var(--graphite);margin-top:20px;max-width:40ch}
.who{display:flex;align-items:center;gap:12px;margin-top:40px;padding-top:24px;border-top:1px solid var(--rule)}.who img{width:44px;height:44px;border-radius:50%;object-fit:cover}.who b{display:block;font-size:14px}.who span{font-size:13px;color:var(--steel)}
.r{background:var(--mist);padding:52px 48px;display:flex;flex-direction:column}
.r h3{font-size:11px;letter-spacing:.18em;font-weight:700;color:var(--steel)}
.r ol{list-style:none;margin-top:18px;counter-reset:c}
.r li{display:grid;grid-template-columns:34px 1fr;padding:16px 0;border-bottom:1px solid rgba(16,33,43,.1);counter-increment:c}
.r li:before{content:counter(c,decimal-leading-zero);font-family:'JetBrains Mono';font-size:11px;color:var(--line);padding-top:3px}
.r li b{display:block;font-size:15.5px}.r li span{font-size:13px;color:var(--steel)}
.r .btn{margin-top:30px;justify-content:space-between}
.r .em{margin-top:16px;font-size:13px;color:var(--steel)}
</style>
<section class="sec"><div class="wrap"><div class="card"><div class="l"><p class="eb">Start a conversation</p><h2 class="d">Put that experience <em class="s">against the decision.</em></h2><p>Describe the platform change, where it sits, and what it depends on.</p><div class="who"><img src="${I.uw}" alt=""><div><b>Ulysses Williams</b><span>Reads every inquiry and replies directly.</span></div></div></div>
<div class="r"><h3>A USEFUL FIRST NOTE INCLUDES</h3><ol><li><div><b>The platform state</b><span>What runs today and what is changing</span></div></li><li><div><b>The delivery stage</b><span>Design, build, migration, testing or go-live</span></div></li><li><div><b>The decision</b><span>What needs senior attention, and by when</span></div></li></ol><a class="btn"><span>Discuss a mandate</span><i>${ARR}</i></a><p class="em">or write to admin@ulixescorp.com</p></div></div></div></section>`],
  } },
/* ------------------------------------------------------------ 6 */
{ id: 'foot', name: 'Footer', score: 6, device: 'desktop', where: 'Every page',
  issue: 'The footer is one line of grey links under a small logo. On mobile it becomes a boxy 2×2 grid with mono numbers. It closes the site on a whisper instead of a signature.',
  refs: [['Zellerfeld', 'https://mobbin.com/sites/sections/18df6730-6569-49da-9c23-3bee32fbe638'], ['Mammoth Brands', 'https://mobbin.com/sites/sections/526eb747-eba7-47e6-851e-903150f3861f'], ['Resend', 'https://mobbin.com/sites/sections/9301c687-40d0-4d8d-bbb8-b1325bac2679']],
  opts: {
    A: ['Monumental Wordmark', 'An ink footer with grouped columns along the top and ULIXES set across the full width at the bottom, cropped by the edge of the page.', () => `
<style>
.f{background:var(--ink);color:var(--light);padding:72px 0 0;overflow:hidden}
.top{display:grid;grid-template-columns:1.4fr 1fr 1fr 1fr;gap:40px;padding-bottom:56px;border-bottom:1px solid var(--drule)}
.top p.q{font-family:'EB Garamond';font-style:italic;font-size:30px;line-height:1.15;max-width:16ch}
.top h4{font-size:10.5px;letter-spacing:.2em;color:#8ba0a9;font-weight:700;margin-bottom:16px}
.top a{display:block;font-size:15px;color:#dfe7ea;padding:5px 0}
.bt{display:flex;justify-content:space-between;padding:20px 0;font-size:13px;color:#8ba0a9}
.wm{font-family:Archivo;font-weight:640;font-size:31.5vw;letter-spacing:-.075em;line-height:.74;margin:18px 0 -3.2vw -1.4vw;color:#e8eef0;white-space:nowrap}
</style>
<footer class="f"><div class="wrap"><div class="top"><p class="q">Senior-led capital markets architecture, since 2004.</p><div><h4>PAGES</h4><a>Services</a><a>Experience</a><a>Nasdaq Calypso</a></div><div><h4>CONTACT</h4><a>admin@ulixescorp.com</a><a>+1 (415) 283-9983</a><a>Discuss a mandate ↗</a></div><div><h4>BASED IN</h4><a>San Francisco</a><a>Working across 4 regions</a></div></div>
<div class="bt"><span>© 2026 Ulixes Corporation</span><span>Privacy · Terms</span></div></div><div class="wm">ULIXES</div></footer>`],
    B: ['Inset Contact Panel', 'The footer is an inset ink panel with rounded corners that opens on the contact block. Email and phone are set large as the main content, with pages and legal kept quiet underneath.', () => `
<style>
.f{padding:72px 0 40px}
.p{background:var(--ink);color:var(--light);border-radius:16px;padding:56px 60px 30px}
.g{display:grid;grid-template-columns:auto 1fr 1fr;gap:64px;align-items:start}
.p .brand{color:var(--light)}.p .brand small{color:#9fb0b7}.p .brand svg{width:44px;height:44px}
.big a{display:block;font-family:Archivo;font-size:34px;letter-spacing:-.045em;font-weight:520;line-height:1.25;color:#eef3f4}
.big small{display:block;font-size:10.5px;letter-spacing:.2em;color:#8ba0a9;font-weight:700;margin-bottom:12px}
.nav{display:flex;justify-content:space-between;align-items:center;margin-top:56px;padding-top:22px;border-top:1px solid var(--drule);font-size:14px;color:#b9c6cb}
.nav div{display:flex;gap:28px}
</style>
<footer class="f"><div class="wrap"><div class="p"><div class="g"><span class="brand">${U}<span><b>ULIXES</b><small>CORPORATION</small></span></span><div class="big"><small>WRITE</small><a>admin@ulixescorp.com</a></div><div class="big"><small>CALL</small><a>+1 (415) 283-9983</a></div></div>
<div class="nav"><div><a>Services</a><a>Experience</a><a>Nasdaq Calypso</a><a>Discuss a mandate ↗</a></div><div><span>© 2026</span><a>Privacy</a><a>Terms</a></div></div></div></div></footer>`],
    C: ['Signature & Clock', 'Custom. A mineral footer that opens on a serif sign-off and the mandate button. A live San Francisco clock reads "Ulysses is in the office" during business hours, a quiet human touch. Links and legal sit on fine rules.', () => `
<style>
.f{padding:90px 0 36px;border-top:1px solid var(--rule)}
.hd{display:flex;justify-content:space-between;align-items:end;gap:40px}
.hd h3{font-family:'EB Garamond';font-style:italic;font-weight:400;font-size:64px;line-height:1.02;letter-spacing:-.02em;max-width:14ch}
.clk{display:flex;align-items:center;gap:12px;margin-top:22px;font-size:14px;color:var(--steel)}
.clk i{width:8px;height:8px;border-radius:50%;background:#4f8a5b;box-shadow:0 0 0 4px rgba(79,138,91,.15)}
.clk b{font-family:'JetBrains Mono';font-weight:500;color:var(--ink)}
.cols{display:grid;grid-template-columns:repeat(4,1fr);margin-top:64px;border-top:1px solid var(--rule2)}
.cols div{padding:22px 24px 0 0}.cols div+div{padding-left:24px;border-left:1px solid var(--rule)}
.cols h4{font-size:10.5px;letter-spacing:.2em;color:var(--steel);font-weight:700;margin-bottom:12px}
.cols a{display:block;padding:4px 0;font-size:14.5px}
.bt{display:flex;justify-content:space-between;align-items:center;margin-top:60px;font-size:13px;color:var(--steel)}
</style>
<footer class="f"><div class="wrap"><div class="hd"><div><h3>Senior-led. Since 2004. Directly.</h3><p class="clk"><i></i>San Francisco <b id="t">--:--</b> · <span id="st">Ulysses is in the office</span></p></div><a class="btn"><span>Discuss a mandate</span><i>${ARR}</i></a></div>
<div class="cols"><div><h4>SERVICES</h4><a>Transformation</a><a>Accounting &amp; controls</a><a>Trading &amp; risk</a></div><div><h4>EXPERIENCE</h4><a>Institutions</a><a>Positions</a></div><div><h4>CALYPSO</h4><a>Lifecycle</a><a>Programs</a><a>Mandates</a></div><div><h4>CONTACT</h4><a>admin@ulixescorp.com</a><a>+1 (415) 283-9983</a></div></div>
<div class="bt">${BRAND}<span>© 2026 Ulixes Corporation · Privacy · Terms</span></div></div></footer>
<script>function u(){const d=new Date(new Date().toLocaleString('en-US',{timeZone:'America/Los_Angeles'}));t.textContent=d.toTimeString().slice(0,5);const h=d.getHours(),w=d.getDay();st.textContent=(w>0&&w<6&&h>=8&&h<18)?'Ulysses is in the office':'Replies next business morning';}u();setInterval(u,30000)</script>`],
  } },
/* ------------------------------------------------------------ 7 */
{ id: 'inst', name: 'Institution Carousel', score: 6.5, device: 'desktop', where: 'Experience',
  issue: 'The cards are cut off at both edges, and the round arrow buttons sit on top of the first and last card\'s text. Nothing shows how far along the seven you are.',
  refs: [['Metalab', 'https://mobbin.com/sites/sections/26e93485-a46d-464b-b795-f4eb9101403c'], ['Koto', 'https://mobbin.com/sites/sections/968754c4-c525-4315-a823-07721be58b1b']],
  opts: {
    A: ['Snap Rail + Progress', 'The arrows move up into the header beside a 01/07 counter. Cards snap cleanly inside the grid, and a progress rail underneath fills as you move. Use the arrows to try it.', () => {
      const C = [['Global systemically important banks', 'Enterprise treasury and derivatives architecture supporting large-scale hedging programs, capital optimization, liquidity management, and regulatory scrutiny.'], ['U.S. super-regionals and large regionals', 'Interest rate risk, balance sheet management, and enterprise hedge accounting frameworks across volatile rate cycles.'], ['Farm credit and agricultural lending', 'Structured lending and derivatives infrastructure supporting complex funding and commodity exposure strategies.'], ['Multilateral and development banks', 'Cross-border derivatives, liquidity and risk management programs for emerging and developed markets.'], ['Hedge funds', 'Front-to-back trade capture, valuation and collateral for multi-strategy portfolios.'], ['Asset managers', 'Investment operations, data lineage and reporting across mandates.'], ['Treasury functions', 'Corporate treasury, funding and hedge programs tied directly to the ledger.']];
      return `<style>
.sec{padding:90px 0}
.hd{display:flex;justify-content:space-between;align-items:end}
.hd h2{font-size:52px;margin-top:18px}.hd h2 em{display:block}
.ctl{display:flex;align-items:center;gap:16px}.ctl .m{color:var(--steel);font-size:13px}
.ctl button{width:48px;height:48px;border-radius:50%;box-shadow:inset 0 0 0 1px var(--rule2);font-size:18px;background:var(--light)}
.ctl button:hover{background:var(--ink);color:var(--light)}
.rail{display:grid;grid-auto-flow:column;grid-auto-columns:calc((100% - 48px)/3);gap:24px;overflow:hidden;margin-top:44px;scroll-behavior:smooth}
.card{background:var(--light);border-radius:10px;padding:30px;box-shadow:0 0 0 1px var(--rule),0 24px 40px -36px rgba(16,33,43,.5);min-height:280px;display:flex;flex-direction:column}
.card .m{color:var(--line)}.card b{font-family:Archivo;font-weight:540;font-size:25px;letter-spacing:-.04em;line-height:1.1;margin:22px 0 14px}.card p{color:var(--graphite);font-size:14.5px}
.pg{margin-top:32px;height:2px;background:var(--plat);border-radius:2px;overflow:hidden}.pg i{display:block;height:100%;width:42.8%;background:var(--ink);transition:width .6s var(--ease)}
</style><section class="sec"><div class="wrap"><div class="hd"><div><p class="eb">Where the work has happened</p><h2 class="d">Seven kinds of institution, <em class="s">one set of dependencies.</em></h2></div><div class="ctl"><span class="m" id="c">01–03 / 07</span><button id="pv">←</button><button id="nx">→</button></div></div>
<div class="rail" id="r">${C.map((c, i) => `<article class="card"><span class="m">0${i + 1}</span><b>${c[0]}</b><p>${c[1]}</p></article>`).join('')}</div><div class="pg"><i id="pi"></i></div></div></section>
<script>let k=0;const go=d=>{k=Math.max(0,Math.min(4,k+d));const w=r.children[0].offsetWidth+24;r.scrollLeft=k*w;c.textContent='0'+(k+1)+'–0'+(k+3)+' / 07';pi.style.width=((k+3)/7*100)+'%';};nx.onclick=()=>go(1);pv.onclick=()=>go(-1);</script>`; }],
    B: ['Mosaic Grid', 'All seven institutions shown at once in an editorial grid. The first is a large feature tile on a hall photograph, the rest are tiles that lift on hover. Nothing is hidden behind arrows.', () => {
      const C = ['Global systemically important banks', 'U.S. super-regionals and large regionals', 'Farm credit and agricultural lending', 'Multilateral and development banks', 'Hedge funds', 'Asset managers', 'Treasury functions'];
      return `<style>
.sec{padding:90px 0}
.sec h2{font-size:52px;margin:18px 0 44px}
.mg{display:grid;grid-template-columns:repeat(4,1fr);grid-auto-rows:190px;gap:16px}
.t{background:var(--light);border-radius:10px;padding:24px;display:flex;flex-direction:column;justify-content:space-between;box-shadow:0 0 0 1px var(--rule);transition:transform .5s var(--ease),box-shadow .3s}
.t:hover{transform:translateY(-4px);box-shadow:0 0 0 1px var(--rule2),0 30px 40px -30px rgba(16,33,43,.5)}
.t .m{color:var(--line)}.t b{font-family:Archivo;font-weight:540;font-size:21px;letter-spacing:-.04em;line-height:1.12}
.t:nth-last-child(-n+2){grid-column:span 2}
.f{grid-column:span 2;grid-row:span 2;position:relative;overflow:hidden;color:#fff;padding:32px}
.f img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}.f:after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,rgba(16,33,43,.1),rgba(16,33,43,.85))}
.f>*{position:relative;z-index:1}.f .m{color:#c9d6db}.f b{font-size:38px}.f p{margin-top:12px;color:#dfe7ea;max-width:40ch;font-size:14.5px}
</style><section class="sec"><div class="wrap"><p class="eb">Where the work has happened</p><h2 class="d">Seven kinds of institution, <span class="s">one set of dependencies.</span></h2>
<div class="mg"><article class="t f"><img src="${I.hall}" alt=""><span class="m">01</span><div><b>${C[0]}</b><p>Enterprise treasury and derivatives architecture supporting large-scale hedging, capital optimization and regulatory scrutiny.</p></div></article>${C.slice(1).map((c, i) => `<article class="t"><span class="m">0${i + 2}</span><b>${c}</b></article>`).join('')}</div></div></section>`; }],
    C: ['Index & Detail', 'Custom. A numbered index of the seven on the left; clicking one swaps a large detail panel on the right, with its description and the dependencies it shares. Works like a reference desk.', () => {
      const C = [['Global systemically important banks', 'Enterprise treasury and derivatives architecture supporting large-scale hedging programs, capital optimization, liquidity management, and regulatory scrutiny.', 'Hedge accounting · Capital · Liquidity'], ['U.S. super-regionals and large regionals', 'Interest rate risk, balance sheet management, and enterprise hedge accounting frameworks across volatile rate cycles.', 'IRR · Balance sheet · Hedge accounting'], ['Farm credit and agricultural lending', 'Structured lending and derivatives infrastructure supporting complex funding and commodity exposure strategies.', 'Funding · Commodities · Lending'], ['Multilateral and development banks', 'Cross-border derivatives, liquidity and risk programs.', 'FX · Liquidity · Risk'], ['Hedge funds', 'Front-to-back trade capture, valuation and collateral.', 'Capture · Valuation · Collateral'], ['Asset managers', 'Investment operations, data lineage and reporting.', 'Data · Reporting · Operations'], ['Treasury functions', 'Funding and hedge programs tied to the ledger.', 'Funding · Hedging · Ledger']];
      return `<style>
.sec{padding:90px 0}
.sec h2{font-size:50px;margin:18px 0 44px}
.g{display:grid;grid-template-columns:420px 1fr;gap:56px}
.ix{list-style:none;border-top:1px solid var(--rule2)}
.ix li{display:grid;grid-template-columns:40px 1fr;padding:15px 0;border-bottom:1px solid var(--rule);cursor:pointer;font-size:16px;color:var(--steel);transition:color .3s,padding .4s var(--ease)}
.ix li .m{padding-top:3px}.ix li.on{color:var(--ink);font-weight:600;padding-left:10px;box-shadow:inset 2px 0 0 var(--ink)}
.dt{background:var(--ink);color:var(--light);border-radius:12px;padding:52px;display:flex;flex-direction:column;min-height:440px;position:relative;overflow:hidden}
.dt .m{color:#8ba0a9}.dt b{font-family:Archivo;font-weight:540;font-size:46px;letter-spacing:-.045em;line-height:1.02;margin-top:20px;max-width:16ch}
.dt p{color:#c3cfd3;margin-top:20px;max-width:50ch;font-size:16px}
.dep{margin-top:auto;padding-top:24px;border-top:1px solid var(--drule);display:flex;justify-content:space-between;font-size:13px;color:#b9c6cb}
.dep span:first-child{letter-spacing:.16em;font-size:10.5px;font-weight:700;color:#8ba0a9}
</style><section class="sec"><div class="wrap"><p class="eb">Where the work has happened</p><h2 class="d">Seven kinds of institution, <span class="s">one set of dependencies.</span></h2>
<div class="g"><ol class="ix">${C.map((c, i) => `<li data-i="${i}" class="${i ? '' : 'on'}"><span class="m">0${i + 1}</span>${c[0]}</li>`).join('')}</ol>
<div class="dt"><span class="m" id="n">01 / 07</span><b id="b">${C[0][0]}</b><p id="p">${C[0][1]}</p><div class="dep"><span>SHARED DEPENDENCIES</span><span id="d">${C[0][2]}</span></div></div></div></div></section>
<script>const C=${JSON.stringify(C)};document.querySelectorAll('.ix li').forEach(li=>li.onclick=()=>{const i=+li.dataset.i;document.querySelectorAll('.ix li').forEach(x=>x.classList.toggle('on',x===li));n.textContent='0'+(i+1)+' / 07';b.textContent=C[i][0];p.textContent=C[i][1];d.textContent=C[i][2];});</script>`; }],
  } },
/* ------------------------------------------------------------ 8 */
{ id: 'heads', name: 'Section Header System', score: 6.5, device: 'desktop', where: 'Every page',
  issue: 'Section headers change alignment from page to page: titles centred in the left column (Home, Services), right-aligned (Calypso "Four shapes"), and an eyebrow floating mid-row (Experience "Six positions"). One rule should cover them all.',
  refs: [['Büro', 'https://mobbin.com/sites/sections/bc636344-6e5b-4b98-9baa-809b622456fb'], ['Koto', 'https://mobbin.com/sites/sections/968754c4-c525-4315-a823-07721be58b1b']],
  opts: {
    A: ['Margin Rail', 'Every header uses the same grid. The section number and eyebrow sit in a fixed left rail, the headline starts at a consistent column, and the lede aligns to the headline\'s last line on the right. Shown on two sections.', () => {
      const H = (n, eb, a, b, p) => `<header class="h"><div class="rl"><span class="m">${n}</span><span class="e">${eb}</span></div><h2 class="d">${a} <span class="s">${b}</span></h2><p>${p}</p></header>`;
      return `<style>
.sec{padding:80px 0;border-top:1px solid var(--rule)}
.h{display:grid;grid-template-columns:200px 1fr 340px;gap:48px;align-items:end}
.rl{align-self:start;padding-top:12px;border-top:1px solid var(--ink)}.rl .m{display:block;color:var(--steel)}.rl .e{display:block;margin-top:8px;font-size:11px;letter-spacing:.16em;font-weight:700;text-transform:uppercase}
.h h2{font-size:58px;max-width:13ch}.h h2 .s{display:block}
.h p{color:var(--graphite);font-size:15px}
.dk{background:var(--dark);color:var(--light)}.dk .rl{border-color:var(--light)}.dk .rl .m,.dk p{color:#a9b8be}
</style><section class="sec"><div class="wrap">${H('02 / 06', 'Capabilities', 'Four points where', 'delivery risk concentrates.', 'Transformation and architecture lead. Accounting, risk, post-trade, and assurance follow the same decision through the system.')}</div></section>
<section class="sec dk"><div class="wrap">${H('03 / 06', 'Working perspective', 'Six positions', 'the work is built on.', 'The views that shape every engagement, from booking models to the control the CFO can explain.')}</div></section>`; }],
    B: ['Centred Stack', 'Every header is centred: eyebrow, then headline with a serif turn, then a short lede at 44ch. Symmetrical and ceremonial, which suits the institutional tone. Shown on two sections.', () => {
      const H = (eb, a, b, p) => `<header class="h"><p class="eb">${eb}</p><h2 class="d">${a} <span class="s">${b}</span></h2><p class="l">${p}</p></header>`;
      return `<style>
.sec{padding:90px 0;border-top:1px solid var(--rule)}
.h{text-align:center;display:flex;flex-direction:column;align-items:center}
.h .eb{justify-content:center}.h .eb:after{content:'';width:26px;height:1px;background:currentColor;opacity:.6}
.h h2{font-size:62px;margin-top:22px;max-width:15ch}.h h2 .s{display:block}
.h .l{margin-top:22px;color:var(--graphite);max-width:44ch}
.dk{background:var(--dark);color:var(--light)}.dk .eb,.dk .l{color:#a9b8be}
</style><section class="sec"><div class="wrap">${H('Capabilities', 'Four points where', 'delivery risk concentrates.', 'Transformation and architecture lead. Accounting, risk, post-trade, and assurance follow the same decision through the system.')}</div></section>
<section class="sec dk"><div class="wrap">${H('Working perspective', 'Six positions', 'the work is built on.', 'The views that shape every engagement, from booking models to the control the CFO can explain.')}</div></section>`; }],
    C: ['Split Baseline', 'The headline is left, the lede is right, and both sit on the same baseline under a full-width hairline that carries the eyebrow and a mono counter. Calm and architectural. Shown on two sections.', () => {
      const H = (n, eb, a, b, p) => `<header class="h"><div class="tp"><span>${eb}</span><span class="m">${n}</span></div><div class="bd"><h2 class="d">${a} <span class="s">${b}</span></h2><p>${p}</p></div></header>`;
      return `<style>
.sec{padding:80px 0}
.tp{display:flex;justify-content:space-between;padding:14px 0;border-top:1px solid var(--ink);font-size:11px;letter-spacing:.16em;font-weight:700;text-transform:uppercase}
.tp .m{letter-spacing:.02em;font-weight:400;color:var(--steel)}
.bd{display:grid;grid-template-columns:1.3fr 1fr;gap:80px;align-items:end;margin-top:28px}
.bd h2{font-size:64px}.bd h2 .s{display:block}
.bd p{color:var(--graphite);max-width:42ch;padding-bottom:10px}
.dk{background:var(--dark);color:var(--light)}.dk .tp{border-color:var(--light)}.dk .tp .m,.dk p{color:#a9b8be}
</style><section class="sec"><div class="wrap">${H('02 / 06', 'Capabilities', 'Four points where', 'delivery risk concentrates.', 'Transformation and architecture lead. Accounting, risk, post-trade, and assurance follow the same decision through the system.')}</div></section>
<section class="sec dk"><div class="wrap">${H('03 / 06', 'Working perspective', 'Six positions', 'the work is built on.', 'The views that shape every engagement, from booking models to the control the CFO can explain.')}</div></section>`; }],
  } },
/* ------------------------------------------------------------ 9 */
{ id: 'acc', name: 'Accordions · Phone', score: 6.5, device: 'phone', where: 'Services, Experience, Calypso · phone',
  issue: 'On phones, long content collapses into stacks of rows with boxed chevron buttons. The same chevron box appears on three pages and makes them look like form settings.',
  refs: [['Monzo', 'https://mobbin.com/screens/b133d628-fd50-4d2f-8f6c-75739d474379'], ['Origin', 'https://mobbin.com/screens/71ecfeb2-d2aa-4f6d-987f-507bc88fff51']],
  opts: {
    A: ['Swipe Cards', 'Each position becomes a full card in a horizontal snap rail, with a progress line and a big numeral, so you swipe through the six instead of opening each one. Swipe to try it.', () => {
      const P = [['Infrastructure is financial architecture', 'Booking models shape capital consumption, lifecycle configuration shapes P&L timing, and hedge designation shapes earnings volatility.'], ['Mastery is alignment', 'The hardest problems live between disciplines. Misalignment is where institutional risk hides.'], ['Lifecycle is the stress test', 'Point-in-time validation says nothing about maturity, hedge ineffectiveness, or market stress.'], ['Migration is a financial event', 'Every mapping decision carries accounting, capital, and regulatory implications.'], ['Capital awareness changes everything', 'Capital belongs at design time, not downstream.'], ['Control is the outcome', 'An architecture the CFO can explain, the CAO can defend, and the CRO can trust.']];
      return `<style>
html,body{background:var(--dark)!important;color:var(--light)}
.hd{padding:40px 20px 0}.hd .eb{color:#9fb0b7}.hd h2{font-size:36px;margin-top:14px}.hd h2 .s{display:block;color:#c9d6db}
.r{display:flex;gap:12px;overflow-x:auto;scroll-snap-type:x mandatory;padding:28px 20px 10px;scrollbar-width:none}
.c{flex:0 0 300px;scroll-snap-align:center;min-height:380px;border-radius:14px;padding:26px;background:var(--dark2);box-shadow:inset 0 0 0 1px var(--drule);display:flex;flex-direction:column}
.c .n{font-family:Archivo;font-weight:300;font-size:84px;letter-spacing:-.06em;line-height:.8;color:#4a5960}
.c b{font-family:Archivo;font-size:25px;letter-spacing:-.04em;line-height:1.1;margin-top:auto}
.c p{color:#b9c6cb;margin-top:12px;font-size:14.5px}
.pr{display:flex;gap:5px;padding:12px 20px 40px}.pr i{flex:1;height:2px;background:#3a3d42;border-radius:2px}.pr i.on{background:#e3eaec}
</style><div class="hd"><p class="eb">Working perspective</p><h2 class="d">Six positions <span class="s">the work is built on.</span></h2></div>
<div class="r" id="r">${P.map((p, i) => `<article class="c"><span class="n">0${i + 1}</span><b>${p[0]}</b><p>${p[1]}</p></article>`).join('')}</div><div class="pr">${P.map((_, i) => `<i class="${i ? '' : 'on'}"></i>`).join('')}</div>
<script>r.addEventListener('scroll',()=>{const i=Math.round(r.scrollLeft/312);document.querySelectorAll('.pr i').forEach((x,j)=>x.classList.toggle('on',j===i));});</script>`; }],
    B: ['Numbered Stack', 'The rows stay, but chevron boxes become fine round plus marks that rotate to a cross. The open row grows a large numeral and a left rule. Lighter and more editorial. Tap a row to try it.', () => {
      const P = ['Infrastructure is financial architecture', 'Mastery is alignment', 'Lifecycle is the stress test', 'Migration is a financial event', 'Capital awareness changes everything', 'Control is the outcome'];
      return `<style>
html,body{background:var(--dark)!important;color:var(--light)}
.hd{padding:40px 20px 24px}.hd .eb{color:#9fb0b7}.hd h2{font-size:36px;margin-top:14px}.hd h2 .s{display:block;color:#c9d6db}
.it{margin:0 20px;border-top:1px solid var(--drule)}.it:last-child{border-bottom:1px solid var(--drule)}
.it button{width:100%;display:grid;grid-template-columns:30px 1fr 26px;align-items:center;padding:18px 0;text-align:left}
.it .m{color:#8ba0a9}.it b{font-size:17px;font-weight:600;letter-spacing:-.01em}
.pl{width:26px;height:26px;border-radius:50%;box-shadow:inset 0 0 0 1px #4a5960;display:grid;place-items:center;font-size:16px;transition:transform .4s var(--ease)}
.bd{display:none;padding:0 0 22px 30px;border-left:2px solid #c9d6db;margin-left:2px}
.bd .n{font-family:Archivo;font-weight:300;font-size:64px;letter-spacing:-.06em;line-height:.9;color:#4a5960}
.bd p{color:#b9c6cb;font-size:14.5px;margin-top:8px}
.it.on .bd{display:block}.it.on .pl{transform:rotate(45deg);background:#e3eaec;color:var(--ink)}
</style><div class="hd"><p class="eb">Working perspective</p><h2 class="d">Six positions <span class="s">the work is built on.</span></h2></div>
${P.map((p, i) => `<div class="it${i ? '' : ' on'}"><button><span class="m">0${i + 1}</span><b>${p}</b><span class="pl">+</span></button><div class="bd"><span class="n">0${i + 1}</span><p>Booking models shape capital consumption, lifecycle configuration shapes P&amp;L timing, and hedge designation shapes earnings volatility.</p></div></div>`).join('')}
<div style="height:40px"></div><script>document.querySelectorAll('.it button').forEach(b=>b.onclick=()=>b.parentNode.classList.toggle('on'));</script>`; }],
    C: ['Chip Rail + Panel', 'Custom. A sticky rail of six numbered chips under the header controls one panel below. Tap a chip and the panel crossfades. There is only ever one block of text on screen and no accordion mechanics at all.', () => {
      const P = [['Infrastructure is financial architecture', 'Booking models shape capital consumption, lifecycle configuration shapes P&L timing, and hedge designation shapes earnings volatility. Those are architectural choices with balance sheet consequences.'], ['Mastery is alignment', 'The hardest problems live between disciplines. Accounting assumes system behaviour, risk depends on data the system may not capture cleanly. Misalignment is where institutional risk hides.'], ['Lifecycle is the stress test', 'Point-in-time validation confirms today. It says nothing about maturity, hedge ineffectiveness, counterparty default, or market stress.'], ['Migration is a financial event', 'Every mapping decision carries accounting, capital, and regulatory implications. Preserving financial control is the work.'], ['Capital awareness changes everything', 'The same trade can consume different capital depending on how it is booked and netted. Capital belongs at design time.'], ['Control is the outcome', 'An architecture the CFO can explain, the CAO can defend, the CRO can trust, and successors can maintain without a phone call.']];
      return `<style>
html,body{background:var(--dark)!important;color:var(--light)}
.hd{padding:40px 20px 20px}.hd .eb{color:#9fb0b7}.hd h2{font-size:36px;margin-top:14px}.hd h2 .s{display:block;color:#c9d6db}
.ch{position:sticky;top:0;display:flex;gap:6px;padding:12px 20px;background:rgba(26,27,29,.9);backdrop-filter:blur(12px)}
.ch button{flex:1;height:42px;border-radius:10px;font-family:'JetBrains Mono';font-size:12px;color:#9fb0b7;box-shadow:inset 0 0 0 1px var(--drule)}
.ch button.on{background:var(--light);color:var(--ink);box-shadow:none}
.pn{margin:14px 20px 40px;padding:26px;border-radius:14px;background:var(--dark2);box-shadow:inset 0 0 0 1px var(--drule);min-height:340px;transition:opacity .3s}
.pn .m{color:#8ba0a9}.pn b{display:block;font-family:Archivo;font-size:28px;letter-spacing:-.04em;line-height:1.08;margin-top:16px}
.pn p{color:#b9c6cb;margin-top:14px;font-size:15px}
.pn .nx{display:flex;justify-content:space-between;margin-top:26px;padding-top:16px;border-top:1px solid var(--drule);font-size:13px;color:#c9d6db}
</style><div class="hd"><p class="eb">Working perspective</p><h2 class="d">Six positions <span class="s">the work is built on.</span></h2></div>
<div class="ch">${P.map((_, i) => `<button data-i="${i}" class="${i ? '' : 'on'}">0${i + 1}</button>`).join('')}</div>
<article class="pn" id="pn"><span class="m" id="n">01 / 06</span><b id="b">${P[0][0]}</b><p id="p">${P[0][1]}</p><div class="nx"><span>Swipe or tap</span><span id="nn">Next: ${P[1][0]} →</span></div></article>
<script>const P=${JSON.stringify(P)};const set=i=>{document.querySelectorAll('.ch button').forEach((x,j)=>x.classList.toggle('on',j===i));pn.style.opacity=0;setTimeout(()=>{n.textContent='0'+(i+1)+' / 06';b.textContent=P[i][0];p.textContent=P[i][1];nn.textContent=P[i+1]?'Next: '+P[i+1][0]+' →':'Back to 01 →';pn.style.opacity=1;},160)};document.querySelectorAll('.ch button').forEach(x=>x.onclick=()=>set(+x.dataset.i));</script>`; }],
  } },
/* ------------------------------------------------------------ 10 */
{ id: 'svhero', name: 'Services Hero', score: 7, device: 'desktop', where: 'Services',
  issue: 'A wide photo band sits above the headline with nothing on it. The headline then sits alone on the left with the right half of the screen empty.',
  refs: [['Sana', 'https://mobbin.com/sites/sections/598dc09d-50c8-40e5-b159-a9a2e78963d3'], ['Vucko', 'https://mobbin.com/sites/sections/72f31890-b4dd-46f4-b6f6-11ce33361d24']],
  opts: {
    A: ['Split with Tall Plate', 'Headline on the left; on the right, a tall atrium photograph with a floating index card listing the four capabilities as jump links.', () => `
<style>
.h{padding:70px 0 90px}
.g{display:grid;grid-template-columns:1fr 560px;gap:72px;align-items:center}
.g h1{font-size:76px;margin-top:22px}.g h1 .s{display:block;font-size:80px;white-space:nowrap}
.g p.l{margin-top:24px;color:var(--graphite);max-width:44ch;font-size:16px}
.acts{display:flex;gap:18px;align-items:center;margin-top:34px}
.pl{position:relative}.pl img{width:100%;height:620px;object-fit:cover;border-radius:10px}
.ix{position:absolute;left:-60px;bottom:40px;width:300px;background:var(--light);border-radius:10px;padding:8px 20px;box-shadow:0 0 0 1px var(--rule),0 40px 60px -40px rgba(16,33,43,.7)}
.ix a{display:grid;grid-template-columns:30px 1fr auto;padding:12px 0;border-bottom:1px solid var(--rule);font-size:14px;font-weight:500}.ix a:last-child{border:0}
.ix .m{color:var(--steel);padding-top:2px}
</style>
<section class="h"><div class="wrap g"><div><p class="eb">Capital markets transformation</p><h1 class="d">Architecture. <span class="s">Not configuration.</span></h1><p class="l">Four capabilities, applied to front-to-back platform change for banks and hedge funds. Each one concentrates where delivery risk does.</p><div class="acts"><a class="btn"><span>Discuss a mandate</span><i>${ARR}</i></a><a class="tl">View capabilities →</a></div></div>
<div class="pl"><img src="${I.atrium}" alt=""><nav class="ix"><a><span class="m">01</span>Transformation &amp; architecture<span>→</span></a><a><span class="m">02</span>Accounting &amp; controls<span>→</span></a><a><span class="m">03</span>Trading, risk &amp; post-trade<span>→</span></a><a><span class="m">04</span>Automation &amp; assurance<span>→</span></a></nav></div></div></section>`],
    B: ['Full-Bleed Statement', 'The atrium fills the hero at full width and the headline sits over it in mineral white, held by a deep gradient. A thin glass strip at the bottom carries the four capabilities.', () => `
<style>
.h{position:relative;height:760px;color:#fff;overflow:hidden}
.h img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.h:after{content:'';position:absolute;inset:0;background:linear-gradient(90deg,rgba(16,33,43,.86),rgba(16,33,43,.35) 60%,rgba(16,33,43,.15)),linear-gradient(0deg,rgba(16,33,43,.5),transparent 40%)}
.in{position:relative;z-index:1;height:100%;display:flex;flex-direction:column;justify-content:center}
.h .eb{color:#d2dbde}.h h1{font-size:104px;margin-top:24px}.h h1 .s{display:block;font-size:108px;color:#dfe7ea}
.h p{margin-top:26px;max-width:46ch;color:#e0e6e8;font-size:17px}
.acts{display:flex;gap:18px;align-items:center;margin-top:34px}
.st{position:absolute;z-index:2;left:64px;right:64px;bottom:28px;display:grid;grid-template-columns:repeat(4,1fr);border-radius:12px;background:rgba(250,249,246,.12);backdrop-filter:blur(14px);box-shadow:inset 0 0 0 1px rgba(255,255,255,.18)}
.st a{padding:18px 22px;font-size:14px;font-weight:500}.st a+a{border-left:1px solid rgba(255,255,255,.16)}.st .m{display:block;color:#c9d6db;margin-bottom:4px}
</style>
<section class="h"><img src="${I.atrium}" alt=""><div class="wrap in"><p class="eb">Capital markets transformation</p><h1 class="d">Architecture. <span class="s">Not configuration.</span></h1><p>Four capabilities, applied to front-to-back platform change for banks and hedge funds.</p><div class="acts"><a class="btn lt"><span>Discuss a mandate</span><i>${ARR}</i></a><a class="tl">View capabilities →</a></div></div>
<nav class="st"><a><span class="m">01</span>Transformation &amp; architecture</a><a><span class="m">02</span>Accounting &amp; controls</a><a><span class="m">03</span>Trading, risk &amp; post-trade</a><a><span class="m">04</span>Automation &amp; assurance</a></nav></section>`],
    C: ['Type over Triptych', 'Custom. Huge type spans the page. Beneath it, three photographs (atrium, floor, hall) sit as a triptych with captions, reading like an architecture monograph cover.', () => `
<style>
.h{padding:80px 0 90px}
.h h1{font-size:150px;letter-spacing:-.065em;line-height:.88;margin-top:26px}.h h1 .s{font-size:150px;letter-spacing:-.03em;color:var(--steel)}
.row{display:flex;justify-content:space-between;align-items:end;margin-top:34px}
.row p{max-width:44ch;color:var(--graphite);font-size:16px}
.tri{display:grid;grid-template-columns:1.3fr 1fr 1fr;gap:16px;margin-top:56px}
.tri figure img{width:100%;height:340px;object-fit:cover;border-radius:6px}
.tri figcaption{display:flex;justify-content:space-between;margin-top:10px;font-size:12.5px;color:var(--steel)}
</style>
<section class="h"><div class="wrap"><p class="eb">Capital markets transformation</p><h1 class="d">Architecture. <span class="s">Not configuration.</span></h1>
<div class="row"><p>Four capabilities, applied to front-to-back platform change for banks and hedge funds. Each one concentrates where delivery risk does.</p><a class="btn"><span>Discuss a mandate</span><i>${ARR}</i></a></div>
<div class="tri"><figure><img src="${I.atrium}" alt=""><figcaption><span>The decision</span><span class="m">I</span></figcaption></figure><figure><img src="${I.floor}" alt=""><figcaption><span>The build</span><span class="m">II</span></figcaption></figure><figure><img src="${I.hall}" alt=""><figcaption><span>The close</span><span class="m">III</span></figcaption></figure></div></div></section>`],
  } },
/* ------------------------------------------------------------ 11 */
{ id: 'contact', name: 'Contact Page', score: 7, device: 'desktop', where: 'Contact',
  issue: 'It is a card inside a card with standard grey input boxes. It works but feels like a template. Ulysses\'s photo only appears on mobile, and nothing guides what to write.',
  refs: [['Shader', 'https://mobbin.com/sites/sections/4d6c6c50-ebc6-4765-8847-faf418e7690c'], ['Analogue Agency', 'https://mobbin.com/sites/sections/ec7c6b3a-accc-48a3-b3b9-c5a87f7d63bf']],
  opts: {
    A: ['Portrait & Ruled Form', 'On the left, a portrait column with name, email and phone. On the right, the form with underline fields (no boxes), large labels, and a primary button with an explicit response promise.', () => `
<style>
.c{padding:60px 0 100px}
.g{display:grid;grid-template-columns:420px 1fr;gap:96px}
.pt img{width:100%;height:420px;object-fit:cover;border-radius:8px}
.pt b{display:block;font-family:Archivo;font-size:26px;letter-spacing:-.04em;margin-top:22px}.pt span.r{color:var(--steel)}
.kv{margin-top:24px;border-top:1px solid var(--rule2)}.kv div{display:flex;justify-content:space-between;padding:14px 0;border-bottom:1px solid var(--rule);font-size:14.5px}.kv small{font-size:10.5px;letter-spacing:.18em;font-weight:700;color:var(--steel)}
h1{font-size:76px;margin-top:20px}h1 .s{display:block}
.f{margin-top:44px;display:grid;grid-template-columns:1fr 1fr;gap:34px 40px}
.fd{display:flex;flex-direction:column;gap:8px}.fd.w{grid-column:span 2}
.fd label{font-size:12px;font-weight:600;letter-spacing:.04em}.fd label em{font-style:normal;color:var(--steel);font-weight:400}
.fd input,.fd textarea{border:0;border-bottom:1.5px solid var(--rule2);background:none;padding:10px 0;font:inherit;font-size:19px;outline:none}
.fd input:focus,.fd textarea:focus{border-color:var(--ink)}
.fd textarea{height:100px;resize:none}
.sb{grid-column:span 2;display:flex;align-items:center;gap:22px}.sb p{font-size:13.5px;color:var(--steel)}
</style>
<section class="c"><div class="wrap g"><aside class="pt"><img src="${I.uw}" alt=""><b>Ulysses Williams</b><span class="r">Reads every inquiry personally</span><div class="kv"><div><small>EMAIL</small><span>admin@ulixescorp.com</span></div><div><small>PHONE</small><span>+1 (415) 283-9983</span></div><div><small>BASED</small><span>San Francisco</span></div></div></aside>
<div><p class="eb">Discuss the mandate</p><h1 class="d">Bring the decision <span class="s">that needs attention.</span></h1>
<form class="f"><div class="fd"><label>Name</label><input placeholder="Your name"></div><div class="fd"><label>Work email</label><input placeholder="you@institution.com"></div><div class="fd w"><label>Institution <em>optional</em></label><input placeholder="Your institution"></div><div class="fd w"><label>Message</label><textarea placeholder="Platform change, delivery stage, and the decision that needs attention."></textarea></div><div class="sb"><a class="btn"><span>Send inquiry</span><i>${ARR}</i></a><p>Ulysses replies directly, usually within one business day.</p></div></form></div></div></section>`],
    B: ['Guided Steps', 'The form walks through three short steps (You, The platform, The decision) with a progress rail and helpful prompts, so the inquiry arrives complete. Use Continue to step through.', () => `
<style>
.c{padding:60px 0 100px}
.g{display:grid;grid-template-columns:1fr 620px;gap:80px;align-items:start}
h1{font-size:72px;margin-top:20px}h1 .s{display:block}
.g>div>p.l{color:var(--graphite);margin-top:20px;max-width:40ch}
.who{display:flex;align-items:center;gap:12px;margin-top:40px}.who img{width:48px;height:48px;border-radius:50%;object-fit:cover}.who b{display:block;font-size:14px}.who span{font-size:13px;color:var(--steel)}
.cd{background:var(--light);border-radius:12px;box-shadow:0 0 0 1px var(--rule),0 40px 70px -50px rgba(16,33,43,.6);padding:36px 40px 40px}
.pr{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.pr div{font-size:12px;color:var(--steel);font-weight:600}.pr div:before{content:'';display:block;height:3px;border-radius:3px;background:var(--plat);margin-bottom:10px}.pr div.on{color:var(--ink)}.pr div.on:before{background:var(--ink)}
.st{display:none;margin-top:32px}.st.on{display:block}
.st h3{font-family:Archivo;font-size:30px;letter-spacing:-.04em;font-weight:540}.st p.h{color:var(--steel);margin-top:6px;font-size:14px}
.st label{display:block;font-size:12px;font-weight:600;margin-top:22px}.st input,.st textarea{width:100%;margin-top:8px;padding:14px 16px;border-radius:8px;border:0;box-shadow:inset 0 0 0 1px var(--rule2);background:#fff;font:inherit;outline:none}
.st input:focus,.st textarea:focus{box-shadow:inset 0 0 0 1.5px var(--ink)}
.opts{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}.opts span{padding:9px 14px;border-radius:999px;box-shadow:inset 0 0 0 1px var(--rule2);font-size:13.5px;cursor:pointer}.opts span.on{background:var(--ink);color:var(--light)}
.ft{display:flex;justify-content:space-between;align-items:center;margin-top:30px}
</style>
<section class="c"><div class="wrap g"><div><p class="eb">Discuss the mandate</p><h1 class="d">Three questions, <span class="s">one conversation.</span></h1><p class="l">If a decision sits where product, risk, operations and reporting meet, it is worth a conversation.</p><div class="who"><img src="${I.uw}" alt=""><div><b>Ulysses Williams</b><span>Reads every inquiry and replies directly</span></div></div></div>
<div class="cd"><div class="pr"><div class="on">01 · You</div><div>02 · The platform</div><div>03 · The decision</div></div>
<div class="st on"><h3>Who's asking?</h3><p class="h">So Ulysses knows who he's replying to.</p><label>Name</label><input placeholder="Your name"><label>Work email</label><input placeholder="you@institution.com"></div>
<div class="st"><h3>Where does it sit?</h3><p class="h">Pick the delivery stage that fits best.</p><label>Delivery stage</label><div class="opts"><span class="on">Design</span><span>Build</span><span>Migration</span><span>Testing</span><span>Go-live</span><span>Post go-live</span></div><label>Platform today</label><input placeholder="e.g. Calypso 17, front to back"></div>
<div class="st"><h3>What needs deciding?</h3><p class="h">One or two sentences is enough.</p><label>The decision</label><textarea rows="4" placeholder="The decision that needs senior attention, and by when."></textarea></div>
<div class="ft"><a class="tl" id="bk" style="visibility:hidden">← Back</a><a class="btn" id="go"><span>Continue</span><i>→</i></a></div></div></div></section>
<script>let s=0;const S=document.querySelectorAll('.st'),P=document.querySelectorAll('.pr div');const set=()=>{S.forEach((x,i)=>x.classList.toggle('on',i===s));P.forEach((x,i)=>x.classList.toggle('on',i<=s));bk.style.visibility=s?'visible':'hidden';go.querySelector('span').textContent=s===2?'Send inquiry':'Continue';};go.onclick=()=>{if(s<2){s++;set();}};bk.onclick=()=>{s--;set();};document.querySelectorAll('.opts span').forEach(o=>o.onclick=()=>{o.parentNode.querySelectorAll('span').forEach(x=>x.classList.remove('on'));o.classList.add('on');});</script>`],
    C: ['The Letter', 'Custom. The form is written as a letter: "Dear Ulysses, I\'m [name] at [institution]. We\'re at the [stage] stage…", with the fields inline in the sentence on a paper card. Memorable and personal, and it still collects the same fields.', () => `
<style>
.c{padding:60px 0 110px}
.hd{text-align:center}.hd .eb{justify-content:center}.hd h1{font-size:64px;margin-top:20px}
.lt{max-width:880px;margin:48px auto 0;background:#fffefb;border-radius:4px;padding:64px 72px 56px;box-shadow:0 0 0 1px var(--rule),0 2px 0 #f0ede6,0 4px 0 -1px var(--rule),0 60px 90px -60px rgba(16,33,43,.55);position:relative}
.lt:before{content:'';position:absolute;left:72px;right:72px;top:40px;border-top:1px solid var(--rule)}
.lt .m{position:absolute;top:18px;right:72px;color:var(--steel)}
.lt p{font-family:'EB Garamond';font-size:31px;line-height:1.75;letter-spacing:-.005em;color:var(--ink)}
.lt input{font:inherit;font-style:italic;border:0;border-bottom:1.5px solid var(--line);background:none;outline:none;color:var(--ink);padding:0 4px;text-align:center}
.lt input:focus{border-color:var(--ink);background:var(--mist)}
.lt input::placeholder{color:#a3b0b5}
.lt select{font:inherit;font-style:italic;border:0;border-bottom:1.5px solid var(--line);background:none;color:var(--ink);padding:0 4px}
.sg{display:flex;justify-content:space-between;align-items:end;margin-top:36px;padding-top:26px;border-top:1px solid var(--rule)}
.sg span{font-size:13.5px;color:var(--steel)}
</style>
<section class="c"><div class="wrap"><div class="hd"><p class="eb">Discuss the mandate</p><h1 class="d">Write to <span class="s">Ulysses.</span></h1></div>
<div class="lt"><span class="m">admin@ulixescorp.com</span><p>Dear Ulysses,<br>I'm <input size="12" placeholder="your name"> at <input size="16" placeholder="your institution">. We're at the <select><option>design</option><option>build</option><option>migration</option><option>testing</option><option>go-live</option></select> stage of a change to <input size="18" placeholder="the platform">, and the decision that needs senior attention is <input size="30" placeholder="what needs deciding">.<br>You can reach me at <input size="22" placeholder="you@institution.com">.</p>
<div class="sg"><span>Ulysses reads every letter and replies directly.</span><a class="btn"><span>Send the letter</span><i>${ARR}</i></a></div></div></div></section>`],
  } },
/* ------------------------------------------------------------ 12 */
{ id: 'blotter', name: 'Calypso Lifecycle', score: 7, device: 'desktop', where: 'Nasdaq Calypso',
  issue: 'The stage list and detail panel is a good idea, but it reads as a settings screen: grey on grey, low-contrast text, and nothing that shows the trade actually moving through the seven stages.',
  refs: [['Monzo', 'https://mobbin.com/screens/b133d628-fd50-4d2f-8f6c-75739d474379'], ['Metalab', 'https://mobbin.com/sites/sections/26e93485-a46d-464b-b795-f4eb9101403c']],
  opts: {
    A: ['Lifecycle Track', 'A horizontal track draws the trade\'s path through seven nodes, grouped into front, middle and back office bands. Click a node and the detail card below updates; the track fills up to the current stage. Click the stages to try it.', () => {
      const S = [['Capture', 'Front office', 'Trade booked against product, book, counterparty, and static data.', 'A product modelled wrong here is inherited by every number downstream.'], ['Valuation', 'Front office', 'Pricing and market data turn the trade into a number.', 'Curves and models chosen here decide every P&L that follows.'], ['Risk', 'Middle office', 'Sensitivities and limits are measured against the position.', 'Risk depends on data the system may not capture cleanly.'], ['Collateral', 'Middle office', 'Margin and collateral are called and reflected.', 'Collateral treatment changes capital and liquidity at once.'], ['Settlement', 'Back office', 'Cash and securities move between parties.', 'A break here surfaces as an operational loss.'], ['Ledger', 'Back office', 'Accounting events post to the general ledger.', 'A system can be right about the position and wrong about the ledger.'], ['Regulatory reporting', 'Back office', 'The trade becomes a reported figure.', 'Every upstream decision arrives here, reported.']];
      return `<style>
.sec{padding:90px 0}
.sec h2{font-size:54px;margin:18px 0 0}.sec h2 .s{display:block}
.trk{margin-top:56px;position:relative}
.bands{display:grid;grid-template-columns:2fr 2fr 3fr;gap:12px;margin-bottom:22px}
.bands div{font-size:10.5px;letter-spacing:.18em;font-weight:700;color:var(--steel);padding-bottom:10px;border-bottom:2px solid var(--line)}.bands div:nth-child(2){border-color:var(--sage)}.bands div:nth-child(3){border-color:var(--clay)}
.nodes{display:grid;grid-template-columns:repeat(7,1fr);position:relative}
.nodes:before,.nodes:after{content:'';position:absolute;left:7%;right:7%;top:15px;height:2px;background:var(--plat)}
.nodes:after{right:auto;width:var(--w,0%);background:var(--ink);transition:width .6s var(--ease)}
.nd{display:flex;flex-direction:column;align-items:center;gap:12px;position:relative;z-index:1;cursor:pointer}
.nd i{width:32px;height:32px;border-radius:50%;background:var(--mineral);box-shadow:inset 0 0 0 2px var(--plat);display:grid;place-items:center;font-style:normal;font-family:'JetBrains Mono';font-size:11px;color:var(--steel);transition:.3s}
.nd.done i{box-shadow:inset 0 0 0 2px var(--ink);color:var(--ink)}.nd.on i{background:var(--ink);color:var(--light);box-shadow:0 0 0 6px rgba(16,33,43,.1)}
.nd b{font-size:14px;font-weight:600;text-align:center}
.dt{display:grid;grid-template-columns:1fr 1fr 1fr;margin-top:44px;background:var(--light);border-radius:12px;box-shadow:0 0 0 1px var(--rule),0 40px 60px -50px rgba(16,33,43,.6)}
.dt div{padding:32px}.dt div+div{border-left:1px solid var(--rule)}
.dt small{display:block;font-size:10.5px;letter-spacing:.18em;font-weight:700;color:var(--steel);margin-bottom:12px}
.dt b.t{font-family:Archivo;font-size:34px;letter-spacing:-.045em;font-weight:550}.dt .o{color:var(--steel);margin-top:4px}
.dt p{font-size:15px;color:var(--graphite)}.dt .w{font-family:'EB Garamond';font-style:italic;font-size:22px;line-height:1.3;color:var(--ink)}
</style><section class="sec"><div class="wrap"><p class="eb">The platform, stage by stage</p><h2 class="d">One trade, <span class="s">seven places it goes wrong.</span></h2>
<div class="trk"><div class="bands"><div>FRONT OFFICE</div><div>MIDDLE OFFICE</div><div>BACK OFFICE</div></div><div class="nodes" id="ns" style="--w:0%">${S.map((s, i) => `<div class="nd${i ? '' : ' on'}" data-i="${i}"><i>0${i + 1}</i><b>${s[0]}</b></div>`).join('')}</div></div>
<div class="dt"><div><small>STAGE</small><b class="t" id="t">${S[0][0]}</b><p class="o" id="o">${S[0][1]}</p></div><div><small>WHAT HAPPENS HERE</small><p id="h">${S[0][2]}</p></div><div><small>WHERE IT BREAKS</small><p class="w" id="w">${S[0][3]}</p></div></div></div></section>
<script>const S=${JSON.stringify(S)};document.querySelectorAll('.nd').forEach(n=>n.onclick=()=>{const i=+n.dataset.i;document.querySelectorAll('.nd').forEach((x,j)=>{x.classList.toggle('on',j===i);x.classList.toggle('done',j<i)});ns.style.setProperty('--w',(i/6*86)+'%');t.textContent=S[i][0];o.textContent=S[i][1];h.textContent=S[i][2];w.textContent=S[i][3];});</script>`; }],
    B: ['Office Columns', 'The seven stages are laid out as three office columns (front, middle and back) on a dark ground, each stage a compact card. The "where it breaks" line is the hero of each card. Everything is visible at once, with no clicking.', () => {
      const O = [['Front office', [['Capture', 'A product modelled wrong here is inherited by every number downstream.'], ['Valuation', 'Curves and models chosen here decide every P&L that follows.']]], ['Middle office', [['Risk', 'Risk depends on data the system may not capture cleanly.'], ['Collateral', 'Collateral treatment changes capital and liquidity at once.']]], ['Back office', [['Settlement', 'A break here surfaces as an operational loss.'], ['Ledger', 'Right about the position, wrong about the ledger.'], ['Regulatory reporting', 'Every upstream decision arrives here, reported.']]]];
      let n = 0;
      return `<style>
.sec{background:var(--dark);color:var(--light);padding:90px 0}
.sec .eb{color:#9fb0b7}.sec h2{font-size:54px;margin-top:18px}.sec h2 .s{color:#c9d6db}
.cols{display:grid;grid-template-columns:1fr 1fr 1fr;gap:20px;margin-top:52px;align-items:start}
.col h3{display:flex;justify-content:space-between;font-size:11px;letter-spacing:.18em;font-weight:700;color:#9fb0b7;padding-bottom:12px;border-bottom:2px solid var(--line);margin-bottom:12px}
.col:nth-child(2) h3{border-color:var(--sage)}.col:nth-child(3) h3{border-color:var(--clay)}
.cd{background:var(--dark2);border-radius:10px;padding:22px 22px 24px;box-shadow:inset 0 0 0 1px var(--drule);margin-top:10px;position:relative}
.cd:not(:last-child):after{content:'↓';position:absolute;left:50%;bottom:-17px;transform:translateX(-50%);font-size:12px;color:#5d6e75}
.cd .m{color:#8ba0a9}.cd b{display:block;font-family:Archivo;font-size:22px;letter-spacing:-.04em;margin-top:8px}
.cd p{font-family:'EB Garamond';font-style:italic;font-size:19px;line-height:1.3;color:#d6dfe2;margin-top:10px}
</style><section class="sec"><div class="wrap"><p class="eb">The platform, stage by stage</p><h2 class="d">One trade, <span class="s">seven places it goes wrong.</span></h2>
<div class="cols">${O.map(o => `<div class="col"><h3><span>${o[0].toUpperCase()}</span><span>${o[1].length} STAGES</span></h3>${o[1].map(s => `<article class="cd"><span class="m">0${++n} / 07</span><b>${s[0]}</b><p>${s[1]}</p></article>`).join('')}</div>`).join('')}</div></div></section>`; }],
    C: ['Trade Ticket', 'Custom. The detail panel becomes a trade ticket: a mono header with ticket number and stage stamp, ledger-style fields, and a perforated edge, with the stage list as tabs along the top. It speaks the client\'s own language. Click the tabs to try it.', () => {
      const S = [['Capture', 'FRONT', 'Product definition · Book · Counterparty · Static data', 'The product model, legal entity, and book hierarchy already being right', 'Every valuation, risk, and accounting number the trade goes on to produce', 'A product modelled wrong here is inherited by every number downstream.'], ['Valuation', 'FRONT', 'Curves · Models · Market data', 'Market data feeds and curve construction', 'P&L, risk sensitivities, collateral', 'Curves and models chosen here decide every P&L that follows.'], ['Risk', 'MIDDLE', 'Sensitivities · Limits · Scenarios', 'Valuation and clean position data', 'Limits, capital and reporting', 'Risk depends on data the system may not capture cleanly.'], ['Collateral', 'MIDDLE', 'Margin · Eligibility · Agreements', 'CSA terms and valuations', 'Liquidity and capital', 'Collateral treatment changes capital and liquidity at once.'], ['Settlement', 'BACK', 'SSIs · Cash · Securities', 'Static and confirmation data', 'Nostro and the ledger', 'A break here surfaces as an operational loss.'], ['Ledger', 'BACK', 'Accounting events · Rules · GL', 'Accounting treatment and designation', 'Financial statements', 'Right about the position, wrong about the ledger.'], ['Reporting', 'BACK', 'Regulatory · Trade · Capital', 'Every upstream stage', 'Regulators and auditors', 'Every upstream decision arrives here, reported.']];
      return `<style>
.sec{padding:90px 0}
.sec h2{font-size:54px;margin:18px 0 0}.sec h2 .s{display:block}
.tabs{display:flex;gap:4px;margin-top:44px}
.tabs button{flex:1;padding:12px 10px;border-radius:8px 8px 0 0;font-size:13px;font-weight:600;color:var(--steel);background:rgba(16,33,43,.04);text-align:left}
.tabs button .m{display:block;color:var(--line);font-weight:400}
.tabs button.on{background:#fffefb;color:var(--ink);box-shadow:0 -1px 0 var(--rule),-1px 0 0 var(--rule),1px 0 0 var(--rule)}
.tk{background:#fffefb;border-radius:0 0 12px 12px;box-shadow:0 0 0 1px var(--rule),0 50px 80px -60px rgba(16,33,43,.6);display:grid;grid-template-columns:1fr 330px;position:relative}
.tk .l{padding:34px 40px}
.tk .hd{display:flex;justify-content:space-between;align-items:center;padding-bottom:18px;border-bottom:1px dashed var(--rule2)}
.tk .hd .m{font-size:12px;color:var(--steel)}
.stp{padding:5px 12px;border:1.5px solid var(--ink);border-radius:4px;font-size:11px;letter-spacing:.18em;font-weight:700;transform:rotate(-3deg)}
.tk h3{font-family:Archivo;font-size:44px;letter-spacing:-.045em;font-weight:550;margin-top:22px}
.fl{display:grid;grid-template-columns:170px 1fr;padding:13px 0;border-bottom:1px solid var(--rule);font-size:14.5px}
.fl .m{text-transform:uppercase;color:var(--steel);padding-top:2px}
.tk .r{background:var(--ink);color:var(--light);padding:34px 32px;border-radius:0 0 12px 0;position:relative;display:flex;flex-direction:column}
.tk .r:before{content:'';position:absolute;left:-9px;top:0;bottom:0;width:18px;background:radial-gradient(circle at 9px 12px,#fffefb 6px,transparent 6.5px) 0 0/18px 24px repeat-y}
.tk .r small{font-size:10.5px;letter-spacing:.18em;font-weight:700;color:#8ba0a9}
.tk .r p{font-family:'EB Garamond';font-style:italic;font-size:28px;line-height:1.25;margin-top:16px}
.tk .r a{margin-top:auto;font-size:14px;font-weight:600;border-bottom:1px solid currentColor;align-self:flex-start;padding-bottom:3px}
</style><section class="sec"><div class="wrap"><p class="eb">The platform, stage by stage</p><h2 class="d">One trade, <span class="s">seven places it goes wrong.</span></h2>
<div class="tabs">${S.map((s, i) => `<button data-i="${i}" class="${i ? '' : 'on'}"><span class="m">0${i + 1}</span>${s[0]}</button>`).join('')}</div>
<div class="tk"><div class="l"><div class="hd"><span class="m" id="no">TICKET UX-2004-01 · STAGE 01 / 07</span><span class="stp" id="of">FRONT OFFICE</span></div><h3 id="t">${S[0][0]}</h3><div class="fl"><span class="m">Built from</span><span id="a">${S[0][2]}</span></div><div class="fl"><span class="m">Depends on</span><span id="b">${S[0][3]}</span></div><div class="fl"><span class="m">Hands on to</span><span id="c">${S[0][4]}</span></div></div>
<div class="r"><small>WHERE IT BREAKS</small><p id="w">${S[0][5]}</p><a>View control detail →</a></div></div></div></section>
<script>const S=${JSON.stringify(S)};document.querySelectorAll('.tabs button').forEach(x=>x.onclick=()=>{const i=+x.dataset.i;document.querySelectorAll('.tabs button').forEach(y=>y.classList.toggle('on',y===x));no.textContent='TICKET UX-2004-0'+(i+1)+' · STAGE 0'+(i+1)+' / 07';of.textContent=S[i][1]+' OFFICE';t.textContent=S[i][0];a.textContent=S[i][2];b.textContent=S[i][3];c.textContent=S[i][4];w.textContent=S[i][5];});</script>`; }],
  } },
];
