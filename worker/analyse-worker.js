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
  } else {
    lines.push('CVR-opslag lykkedes ikke; byg paa resten.');
  }
  lines.push('Virksomhedens hjemmeside: ' + payload.website);
  lines.push('Laes hjemmesiden og skriv buddet' + (payload.lang === 'en' ? ' paa engelsk.' : ' paa dansk.'));
  return lines.join('\n');
}

const SYSTEM = `Du er analysemotoren bag 5:15's parathedstest (femfemten.com). Du faar en virksomheds testscorer, deres svageste svar, CVR-data og deres hjemmeside. Laes hjemmesiden med web_fetch (forsiden er nok, hent hoejst 3 sider), og skriv et kort, kvalificeret bud paa, hvor virksomheden staar med AI, og hvad de foerste skridt ville vaere.

Form: maks 170 ord. Tre afsnit adskilt af blank linje: (1) hvad du kan se om virksomheden, og hvordan det spiller sammen med testscorerne, (2) det vigtigste at tage fat i og hvorfor, (3) to konkrete foerste skridt som to linjer, der starter med "1." og "2.".

Tone: rolig, konkret, konstaterende. Brug ALDRIG tankestreger (hverken em dash eller en dash). Ingen AI-floskler, ingen ophobede forsikringer, intet salgssprog. Det er et bud paa afstand: skriv "herfra ligner det" eller "vores bud er". Lov aldrig resultater, naevn aldrig priser, anbefal aldrig konkrete leverandoerer eller produkter. Kan hjemmesiden ikke laeses, saa sig det i en enkelt saetning og byg buddet paa resten.`;

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
        koden: 'ok, den nyeste kode er sat ind',
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
