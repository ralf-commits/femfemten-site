# Parathedsanalysen: opsætning (klikguide til Ralf)

Analysen (CVR + hjemmeside oven på testen) kræver to konti. Alt foregår i browseren,
ingen kommandolinje. Regn med 15 minutter.

## 1. Anthropic API-nøgle (betaling pr. brug)

1. Gå til https://console.anthropic.com og opret/log ind
2. Tilføj betalingskort under Billing (sæt gerne en månedlig grænse, fx 20 USD)
3. API Keys > Create Key > kald den "femfemten-analyse" > kopiér nøglen (vises kun én gang)

## 2. Cloudflare Worker (gratis)

1. Opret gratis konto på https://dash.cloudflare.com
2. I menuen: **Storage & Databases > KV** > Create namespace > kald den `femfemten-leads`
3. I menuen: **Workers & Pages > Create > Create Worker** > kald den `femfemten-analyse` > Deploy
4. Klik **Edit code**, slet eksempelkoden, og indsæt hele indholdet af `analyse-worker.js`
   fra denne mappe > Deploy
5. Gå til workerens **Settings**:
   - **Variables and Secrets** > Add:
     - `ANTHROPIC_API_KEY` (type: Secret) = nøglen fra trin 1
     - `ADMIN_TOKEN` (type: Secret) = en lang selvvalgt kode (fx 30 tilfældige tegn,
       gem den i din kodeordsmanager; den bruges til at hente leads)
   - **Bindings** > Add > KV namespace: variabelnavn `LEADS`, namespace `femfemten-leads`
6. Notér workerens URL (står øverst, fx `https://femfemten-analyse.DIT-NAVN.workers.dev`)

## 3. Sig til Claude/Saga

Send worker-URL'en i chatten (IKKE nøglerne). Så aktiveres analysefeltet på test.html,
og vi tester sammen, før der linkes til noget.

## Drift

- **Leads**: hver gennemført analyse gemmes i KV (tidspunkt, CVR, firma, branche, ansatte,
  hjemmeside, mail hvis oplyst, scorer, svageste svar, buddet). Hentes med:
  `GET <worker-url>/leads` med headeren `Authorization: Bearer <ADMIN_TOKEN>`.
  Saga kan gøre det på heartbeat og lægge nye leads i lead-arket + give Telegram-besked.
  Leads med mail udfyldt er dem, der har sagt ja til en henvendelse.
- **Testlog**: hver gennemført test logges anonymt (tidspunkt, de fire scorer, de svar
  der trak ned, sprog). Ingen IP, navn eller kontaktdata. Hentes med:
  `GET <worker-url>/stats` med samme Authorization-header som `/leads`.
- **Forbrugslofter**: 5 analyser pr. IP pr. dag, 300 pr. måned i alt
  (kan ændres med variablerne `DAILY_IP_CAP` / `MONTHLY_CAP`). Testloggen er
  begrænset til 30 pr. IP pr. dag.
- **CVR-data** slås op via cvrapi.dk (gratis, med kildeangivelse i User-Agent).
- Teksten ved analysefeltet fortæller, hvad der logges: testsvar anonymt, og
  virksomhedsoplysninger + mail kun hvis man bruger analysen.
