# femfemten.com — klargjort ny forside

Statisk hjemmeside til GitHub Pages. Filerne ligger i repository-roden; ingen installation eller build er nødvendig. CNAME skal fortsat indeholde femfemten.com. .nojekyll lader Pages udgive filerne direkte.

## Denne version

- Forsiden er den sorte/blå løbeoplevelse fra Sites version 7, kildecommit 9659dada8133ca4bb580ecf48da447daa5d1f9b3.
- Workshop: 5.000 kr. ekskl. moms, 2,5 timer hos kunden, inklusive forberedelse og skriftlig opsamling. Prisen er synkroniseret i forsidens panel, workshop.html på dansk/engelsk og workshop-onepager.pdf. Det tidligere feedbacktilbud er fjernet fra PDF'en.
- Eksisterende cases, radar, selvstændig test med virksomhedsanalyse, privatlivsside, eksempel-PDF, delingsbilleder og Google-verifikation er bevaret.
- index.html#workshop åbner workshoppen; #ydelser, #kontakt, #om, #radar og #test åbner de tilsvarende paneler.
- Domænehenvisning, metadata til deling, virksomhedsdata, privatlivslink og en enkel JavaScript-fri kontaktvisning er tilføjet.

Den nye forside er dansk. De eksisterende undersider bevarer deres sprogvalg. Den integrerede test behandler svar lokalt. Den selvstændige test.html bevarer sin eksisterende Cloudflare-analyse og logning. Uret viser Operational Excellence, AI-implementering og Commercial Excellence. Cases og erfaringsbeskrivelser på forsiden er anonymiserede.

## Udgivelse

GitHub Pages udgiver main. Publiceringsgrenen er prepare/five-fifteen-v7. Den oprindelige side er desuden gemt på backup/before-five-fifteen-2026-10-12 ved commit 76b89e266da38bb152bec8a18b1714c4cca3f298. Der er ikke ændret DNS, mail eller Cloudflare-konfiguration.

Den nye forside er gennemgået i browser på desktop og mobil (390 × 844), inklusive ur, de tre leveranceområder, cases, spørgeskemanavigation, radarfilter og workshopkontakt.

## Backup og tilbageførsel

Den eksisterende version er commit 76b89e266da38bb152bec8a18b1714c4cca3f298, tree b5b6c93ed392d690810d432a5a5c52efefc87eea. En separat ZIP og en komplet Git-bundle med 63 commits er gemt i leverancens backups-mappe. Backupen er kontrolleret med git fsck og git bundle verify.

Hvis en senere udgivelse skal tilbageføres, opret en ny gren fra den aktuelle main, gendan **hele træet** fra backup-committet, og lav en ny commit og pull request. Bevar historikken; undgå force-push. Det fjerner også de nye forsidefiler, som ikke fandtes i backupen. Kontroller altid senere ændringer fra andre før tilbageførsel.

Eksempel i en ren checkout efter hentning af seneste main:

```sh
git switch -c restore/previous-site origin/main
git restore --source=76b89e266da38bb152bec8a18b1714c4cca3f298 --staged --worktree -- .
git commit -m "Restore previous femfemten.com site"
```

Hvis GitHub-kopien går tabt, kan repository og historik genskabes fra den separate bundle:

```sh
git clone /absolute/path/femfemten-site-2026-10-07.bundle femfemten-restored
```

Backupen omfatter repository-filer og Git-historik. Cloudflare KV-data/leads, serverhemmeligheder, DNS og kontokonfiguration er ikke eksporteret. Denne klargøring ændrer ingen af disse, og worker-mappen er bevaret byte for byte.
