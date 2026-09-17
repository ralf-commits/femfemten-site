// 5:15 parathedsanalyse - Cloudflare Worker
// Indsaettes i Cloudflare-dashboardet (Workers & Pages > Create Worker > Edit code).
// Kraever (Settings > Variables and Secrets):
//   ANTHROPIC_API_KEY  (secret)  - noegle fra console.anthropic.com
//   ADMIN_TOKEN        (secret)  - selvvalgt lang tilfaeldig streng, bruges af /leads
// Kraever (Settings > Bindings): KV namespace bundet som LEADS.
// Valgfrit (Variables): DAILY_IP_CAP (standard 5), MONTHLY_CAP (standard 300).

const ALLOWED_ORIGINS = ['https://femfemten.com', 'https://www.femfemten.com'];
const CVR_UA = '5:15 ApS parathedsanalyse - hello@femfemten.com';

function corsHeaders(origin) {
  const ok = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': ok,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

function json(body, status, origin) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
  });
}

async function cvrLookup(cvr) {
  try {
    const res = await fetch(
      'https://cvrapi.dk/api?search=' + encodeURIComponent(cvr) + '&country=dk',
      { headers: { 'User-Agent': CVR_UA } }
    );
    if (!res.ok) return null;
    const d = await res.json();
    if (!d || d.error) return null;
    return {
      name: d.name || null,
      industry: d.industrydesc || null,
      employees: d.employees || null,
      startdate: d.startdate || null,
      city: d.city || null,
    };
  } catch (e) {
    return null;
  }
}

function buildPrompt(payload, cvrData) {
  const s = payload.scores;
  const lines = [];
  lines.push('Testscorer (0-6 pr. dimension): Data ' + s.data + ', Arbejdsgange ' + s.flow +
    ', Mennesker og beslutninger ' + s.people + ', Regler og robusthed ' + s.rules + '.');
  if (payload.zeros && payload.zeros.length) {
    lines.push('Svar, der kostede point: ' + payload.zeros.join(' | '));
  }
  if (cvrData) {
    lines.push('CVR-data: ' + [
      cvrData.name, cvrData.industry,
      cvrData.employees ? cvrData.employees + ' ansatte' : null,
      cvrData.startdate ? 'startet ' + cvrData.startdate : null,
      cvrData.city,
    ].filter(Boolean).join(', ') + '.');
    // cvrapi kan angive ansatte som tal eller interval, fx "200-499"
    const emp = parseInt(String(cvrData.employees || '').replace(/\D+/g, ' ').trim().split(' ')[0], 10);
    if (emp >= 100) {
      lines.push('Bemaerk: virksomheden er stor. Testen er besvaret af en enkelt person og er et billede af svarpersonens omraade eller afdeling, ikke hele organisationen.');
    }
  } else {
    lines.push('CVR-opslag lykkedes ikke; byg paa resten.');
  }
  lines.push('Virksomhedens hjemmeside: ' + payload.website);
  lines.push('Laes hjemmesiden og skriv buddet' + (payload.lang === 'en' ? ' paa engelsk.' : ' paa dansk.'));
  return lines.join('\n');
}

const SYSTEM = `Du er analysemotoren bag 5:15's parathedstest (femfemten.com). Du faar en virksomheds testscorer, deres svageste svar, CVR-data og deres hjemmeside. Laes hjemmesiden med web_fetch (forsiden er nok, hent hoejst 3 sider), og skriv et kort, kvalificeret bud paa, hvor virksomheden staar med AI, og hvad de foerste skridt ville vaere.

Stoerrelse: skaler raadene til virksomhedens stoerrelse ud fra CVR-data. I smaa og mellemstore virksomheder taler du til ejeren eller ledelsen om hele forretningen. I store virksomheder (over ca. 100 ansatte) laeser du svarene som et billede af svarpersonens eget omraade, taler til en leder i det omraade, og peger paa skridt der passer der: en afgraenset pilot i eget omraade, forankring hos naermeste ledelse, og samspil med koncernens eksisterende rammer for data og AI. Giv aldrig raad, der kun giver mening i en lille virksomhed, til en stor.

Form: maks 170 ord. Tre afsnit adskilt af blank linje: (1) hvad du kan se om virksomheden, og hvordan det spiller sammen med testscorerne, (2) det vigtigste at tage fat i og hvorfor, (3) to konkrete foerste skridt som to linjer, der starter med "1." og "2.".

Tone: rolig, konkret, konstaterende. Brug ALDRIG tankestreger (hverken em dash eller en dash). Ingen AI-floskler, ingen ophobede forsikringer, intet salgssprog. Undgaa vendinger af typen "Ikke X, men Y" og "X. Ikke Y." som selvstaendige pointer; skriv i stedet direkte, hvad der gaelder, og hvorfor. Det er et bud paa afstand: skriv "herfra ligner det" eller "vores bud er". Lov aldrig resultater, naevn aldrig priser, anbefal aldrig konkrete leverandoerer eller produkter. Kan hjemmesiden ikke laeses, saa sig det i en enkelt saetning og byg buddet paa resten.`;

async function runAnalysis(env, payload, cvrData) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'anthropic-beta': 'server-side-fallback-2026-07-01',
    },
    body: JSON.stringify({
      model: 'claude-opus-5',
      max_tokens: 1500,
      fallbacks: 'default',
      system: SYSTEM,
      tools: [{
        type: 'web_fetch_20260209',
        name: 'web_fetch',
        max_uses: 3,
        max_content_tokens: 20000,
      }],
      messages: [{ role: 'user', content: buildPrompt(payload, cvrData) }],
    }),
  });
  if (!res.ok) {
    const detail = await res.text();
    throw new Error('api ' + res.status + ': ' + detail.slice(0, 300));
  }
  const msg = await res.json();
  if (msg.stop_reason === 'refusal') throw new Error('refusal');
  let text = '';
  for (const block of msg.content || []) {
    if (block.type === 'text') text += block.text;
  }
  text = text.trim();
  if (!text) throw new Error('tomt svar');
  return text;
}

const ADMIN_HTML = `<!doctype html>
<html lang="da">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>5:15 leads</title>
<style>
  body { font-family: "Helvetica Neue", Arial, sans-serif; background: #f4f7fc; color: #1b1a4a;
    margin: 0; padding: 2rem 1rem; line-height: 1.5; }
  .wrap { max-width: 46rem; margin: 0 auto; }
  h1 { font-size: 1.3rem; }
  .row { display: flex; gap: 0.6rem; flex-wrap: wrap; margin: 1rem 0 1.6rem; }
  input { flex: 1; min-width: 12rem; padding: 0.6rem 0.8rem; border: 1px solid #d7dfec; border-radius: 4px; font-size: 1rem; }
  button { background: #1b1a4a; color: #fff; border: 0; border-radius: 4px; padding: 0.6rem 1.1rem;
    font-size: 0.95rem; font-weight: 700; cursor: pointer; }
  button.alt { background: #4c5470; }
  .card { background: #fff; border: 1px solid #d7dfec; border-left: 3px solid #eb4634;
    border-radius: 0 6px 6px 0; padding: 1rem 1.2rem; margin-bottom: 1rem; }
  .card.stat { border-left-color: #b0cfc9; }
  .meta { font-size: 0.85rem; color: #4c5470; }
  .bud { white-space: pre-wrap; margin-top: 0.6rem; font-size: 0.95rem; }
  .fejl { color: #eb4634; font-weight: 700; }
  h2 { font-size: 1.05rem; margin: 0 0 0.2rem; }
</style>
</head>
<body>
<div class="wrap">
  <h1>5:15 · leads og testlog</h1>
  <div class="row">
    <input id="kode" type="password" placeholder="Admin-kode (fra dit papir)" autocomplete="off">
    <button id="hentLeads">Vis leads</button>
    <button id="hentStats" class="alt">Vis testlog</button>
  </div>
  <p id="besked"></p>
  <div id="liste"></div>
</div>
<script>
  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text) e.textContent = text;
    return e;
  }
  function hent(sti) {
    var kode = document.getElementById('kode').value.trim();
    var besked = document.getElementById('besked');
    var liste = document.getElementById('liste');
    liste.textContent = '';
    besked.textContent = '';
    if (!kode) { besked.textContent = 'Tast admin-koden foerst.'; return; }
    besked.textContent = 'Henter...';
    fetch(sti, { headers: { Authorization: 'Bearer ' + kode } })
      .then(function (r) {
        if (r.status === 401) throw new Error('Forkert kode.');
        if (!r.ok) throw new Error('Kunne ikke hente (' + r.status + ').');
        return r.json();
      })
      .then(function (data) {
        besked.textContent = data.length
          ? data.length + (sti === '/leads' ? ' leads, nyeste foerst:' : ' gennemfoerte tests, nyeste foerst:')
          : 'Ingen endnu.';
        for (var i = 0; i < data.length; i++) {
          var d = data[i];
          var kort = el('div', sti === '/leads' ? 'card' : 'card stat');
          var tid = (d.ts || '').replace('T', ' ').slice(0, 16);
          if (sti === '/leads') {
            kort.appendChild(el('h2', null, (d.firma || 'Ukendt firma') + ' (CVR ' + d.cvr + ')'));
            kort.appendChild(el('div', 'meta', tid + ' · ' + [d.branche, d.ansatte ? d.ansatte + ' ansatte' : null, d.website].filter(Boolean).join(' · ')));
            kort.appendChild(el('div', 'meta', d.email ? 'VIL KONTAKTES: ' + d.email : 'Ingen mail oplyst'));
            var s = d.scores || {};
            kort.appendChild(el('div', 'meta', 'Scorer: Data ' + s.data + ' · Arbejdsgange ' + s.flow + ' · Mennesker ' + s.people + ' · Regler ' + s.rules));
            if (d.zeros && d.zeros.length) kort.appendChild(el('div', 'meta', 'Trak ned: ' + d.zeros.join(' | ')));
            kort.appendChild(el('div', 'bud', d.bud || ''));
          } else {
            var s2 = d.scores || {};
            kort.appendChild(el('h2', null, tid + ' (' + (d.lang || 'da') + ')'));
            kort.appendChild(el('div', 'meta', 'Scorer: Data ' + s2.data + ' · Arbejdsgange ' + s2.flow + ' · Mennesker ' + s2.people + ' · Regler ' + s2.rules));
            if (d.zeros && d.zeros.length) kort.appendChild(el('div', 'meta', 'Trak ned: ' + d.zeros.join(' | ')));
          }
          liste.appendChild(kort);
        }
      })
      .catch(function (e) {
        besked.textContent = '';
        var f = el('p', 'fejl', e.message || 'Noget gik galt.');
        liste.appendChild(f);
      });
  }
  document.getElementById('hentLeads').addEventListener('click', function () { hent('/leads'); });
  document.getElementById('hentStats').addEventListener('click', function () { hent('/stats'); });
</script>
</body>
</html>`;

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    // Selvtjek: aaben /check i en browser, saa fortaeller den selv, hvad der mangler.
    // Viser aldrig noegler eller vaerdier, kun om de findes.
    if (url.pathname === '/check' && request.method === 'GET') {
      const status = {
        koden: 'ok, version 2, rullet ud automatisk fra GitHub',
        anthropic_noegle: env.ANTHROPIC_API_KEY
          ? 'ok'
          : 'MANGLER: Settings > Variables and Secrets > Add > navn ANTHROPIC_API_KEY, type Secret',
        admin_kode: env.ADMIN_TOKEN
          ? 'ok'
          : 'MANGLER: Settings > Variables and Secrets > Add > navn ADMIN_TOKEN, type Secret',
        lager: env.LEADS
          ? 'ok'
          : 'MANGLER: Bindings > Add > KV namespace > variabelnavn LEADS',
      };
      const klar = env.ANTHROPIC_API_KEY && env.ADMIN_TOKEN && env.LEADS;
      status.samlet = klar
        ? 'ALT KLAR. Sig til Claude/Saga, saa proevekoeres analysen.'
        : 'Ikke faerdig endnu. Ret det, der staar MANGLER ved, og genindlaes denne side.';
      return new Response(JSON.stringify(status, null, 2), {
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
      });
    }

    // Adminside: aaben /admin i en browser, tast admin-koden, og se leads og testlog.
    // Selve siden er tom uden koden; data hentes foerst, naar koden er tastet.
    if (url.pathname === '/admin' && request.method === 'GET') {
      return new Response(ADMIN_HTML, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    }

    // Admin: hent seneste leads eller testlogs som JSON. Authorization: Bearer <ADMIN_TOKEN>
    if ((url.pathname === '/leads' || url.pathname === '/stats') && request.method === 'GET') {
      const auth = request.headers.get('Authorization') || '';
      if (auth !== 'Bearer ' + env.ADMIN_TOKEN) return new Response('nej', { status: 401 });
      const prefix = url.pathname === '/leads' ? 'lead:' : 'stat:';
      const list = await env.LEADS.list({ prefix: prefix, limit: 200 });
      const out = [];
      for (const k of list.keys.reverse()) {
        const v = await env.LEADS.get(k.name);
        if (v) out.push(JSON.parse(v));
      }
      return new Response(JSON.stringify(out, null, 2), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Anonym testlog: gemmes uden IP, navn eller kontaktdata.
    if (url.pathname === '/log' && request.method === 'POST') {
      const logIp = request.headers.get('CF-Connecting-IP') || 'ukendt';
      const logDay = new Date().toISOString().slice(0, 10);
      const logKey = 'ratelog:' + logIp + ':' + logDay;
      const logCount = parseInt((await env.LEADS.get(logKey)) || '0', 10);
      if (logCount >= 30) return json({ ok: false }, 429, origin);
      let body;
      try {
        body = await request.json();
      } catch (e) {
        return json({ ok: false }, 400, origin);
      }
      const sc = body.scores || {};
      const okScores = ['data', 'flow', 'people', 'rules'].every(function (k) {
        return Number.isInteger(sc[k]) && sc[k] >= 0 && sc[k] <= 6;
      });
      if (!okScores) return json({ ok: false }, 400, origin);
      const stat = {
        ts: new Date().toISOString(),
        scores: { data: sc.data, flow: sc.flow, people: sc.people, rules: sc.rules },
        zeros: (body.zeros || []).slice(0, 6).map(function (z) { return String(z).slice(0, 200); }),
        lang: body.lang === 'en' ? 'en' : 'da',
      };
      await env.LEADS.put(logKey, String(logCount + 1), { expirationTtl: 90000 });
      await env.LEADS.put('stat:' + stat.ts + ':' + Math.random().toString(36).slice(2, 8),
        JSON.stringify(stat));
      return json({ ok: true }, 200, origin);
    }

    if (url.pathname !== '/analyse' || request.method !== 'POST') {
      return new Response('ikke fundet', { status: 404 });
    }

    // Forbrugslofter
    const ip = request.headers.get('CF-Connecting-IP') || 'ukendt';
    const day = new Date().toISOString().slice(0, 10);
    const month = day.slice(0, 7);
    const ipKey = 'rate:' + ip + ':' + day;
    const monthKey = 'rate:total:' + month;
    const ipCount = parseInt((await env.LEADS.get(ipKey)) || '0', 10);
    const monthCount = parseInt((await env.LEADS.get(monthKey)) || '0', 10);
    if (ipCount >= (parseInt(env.DAILY_IP_CAP || '5', 10))) {
      return json({ error: 'for mange i dag' }, 429, origin);
    }
    if (monthCount >= (parseInt(env.MONTHLY_CAP || '300', 10))) {
      return json({ error: 'maanedsloft naaet' }, 429, origin);
    }

    let payload;
    try {
      payload = await request.json();
    } catch (e) {
      return json({ error: 'ugyldig foresporgsel' }, 400, origin);
    }

    const cvr = String(payload.cvr || '').replace(/\D/g, '');
    let website = String(payload.website || '').trim();
    if (website && !/^https?:\/\//i.test(website)) website = 'https://' + website;
    const s = payload.scores || {};
    const dims = ['data', 'flow', 'people', 'rules'];
    const scoresOk = dims.every(function (k) {
      return Number.isInteger(s[k]) && s[k] >= 0 && s[k] <= 6;
    });
    if (cvr.length !== 8 || !website || !scoresOk) {
      return json({ error: 'udfyld CVR (8 cifre) og hjemmeside' }, 400, origin);
    }
    payload.cvr = cvr;
    payload.website = website;
    payload.zeros = (payload.zeros || []).slice(0, 6).map(function (z) {
      return String(z).slice(0, 200);
    });
    // Mail er frivillig; en ugyldig adresse smides bare vaek, den stopper ikke analysen.
    let email = String(payload.email || '').trim().slice(0, 120);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) email = null;

    await env.LEADS.put(ipKey, String(ipCount + 1), { expirationTtl: 90000 });
    await env.LEADS.put(monthKey, String(monthCount + 1), { expirationTtl: 3200000 });

    const cvrData = await cvrLookup(cvr);
    let bud;
    try {
      bud = await runAnalysis(env, payload, cvrData);
    } catch (e) {
      return json({ error: 'analysen kunne ikke gennemfoeres lige nu' }, 502, origin);
    }

    const lead = {
      ts: new Date().toISOString(),
      cvr: cvr,
      firma: cvrData ? cvrData.name : null,
      branche: cvrData ? cvrData.industry : null,
      ansatte: cvrData ? cvrData.employees : null,
      website: website,
      email: email,
      scores: s,
      zeros: payload.zeros,
      lang: payload.lang === 'en' ? 'en' : 'da',
      bud: bud,
    };
    await env.LEADS.put('lead:' + lead.ts + ':' + Math.random().toString(36).slice(2, 8),
      JSON.stringify(lead));

    return json({ bud: bud, firma: lead.firma }, 200, origin);
  },
};
