# femfemten.com

Statisk site for Fem Femten (5:15 ApS). Ingen build, ingen dependencies. Ren HTML.

Disse filer er klar til at blive flyttet til deres eget offentlige repo `ralf-commits/femfemten-site`
og hostet med GitHub Pages. Indtil det repo findes, er dette den autoritative kopi.

## Filer

- `index.html`: forsiden (femfemten.com)
- `workshop.html`: salgsside for AI-workshoppen, bruges i outreach (femfemten.com/workshop)
- `CNAME`: fortæller GitHub Pages, at sitet skal svare på femfemten.com

## Personalisering af workshop-siden

Siden læser URL-parametre og tilpasser sig modtageren. Ingen server, alt sker i browseren:

- `workshop.html?til=Danske+Havne`: overskrift og badge bliver "Forberedt til Danske Havne"
- `&branche=havnedrift`: afsnittet "Eksemplerne og rådene er valgt til jer" bliver branchespecifikt

Hvert personaliseret link er samtidig tracking: nar analytics er sat pa, viser `til`-parameteren
praecis hvilken modtager der klikkede.

## Sadan opdateres sitet

1. Ret HTML-filen
2. Commit og push
3. GitHub Pages deployer automatisk inden for et minut

## Priser (holdes synkrone med al outreach)

- Workshop: 18.000 kr. ekskl. moms, fast pris, 2,5 time hos kunden
- Feedback-tilbud til de foerste kunder: 10.000 kr. mod en times aerlig feedback

## Udestaaende

- Analytics-script mangler (afventer valg af konto: Plausible eller Cloudflare Web Analytics)
- Bookinglink til Google Kalender mangler (afventer at Ralf opretter bookingside)
- Logo: brug `5-15-logo-blue.png` fra Drive i stedet for tekst-headeren, naar filen laegges ind
