# Udkast til gennemgang: SEO, logo og ydelsessider

Gren: `udkast/seo-og-logo`. Intet af dette er live. Når det er godkendt, merges grenen til `main`, og så udgiver GitHub Pages det.

## Det, der er ændret

### Forsiden (index.html)

- Headeren viser 5.15-logoet (ny lys udgave, `logo-hvid.png`) i stedet for teksten "5:15". "Consultancy" står stadig under.
- Titel: før `5:15 — Tempo til at tænke`, efter `5:15 Consultancy | Fem Femten: strategi, data og AI`. Både "5:15 Consultancy" og "Fem Femten" står nu i titlen, så brandsøgninger rammer.
- Struktureret data: Organization har fået alternative navne (5:15 Consultancy, 5:15, femfemten), områder og de fire ydelser inkl. workshoppen til 5.000 kr.
- Urets ydelsesvisning har fået et link "Læs mere om [område]", som skifter med det valgte område.
- Visningen uden JavaScript linker til de tre nye sider.

### Tre nye ydelsessider

`ai-implementering.html`, `operational-excellence.html`, `commercial-excellence.html`. Bygget i løbeturens panelstil (style.css og v2.css, samme udtryk som AI-radaren og "Find din rute"), med "Tilbage til turen" øverst og GoatCounter-måling. Første version var i workshopsidens gamle stil og er erstattet.

Teksten er jeres egen, flyttet fra uret uden ændringer: overskrift, manchet, leverancer, forløb og erfaringsteksten. Cases er de anonymiserede fra casearkivet, ordret med "Ruten" og "Ved målstregen". Afslutningen bruger jeres eksisterende tekst fra "Find din rute": "Et konkret sted at begynde. På første etape prioriterer vi udfordringen og aftaler, hvad I skal stå med bagefter." med knappen "Book første etape", som åbner panelet for første etape.

Løbeturens ord bruges som afsnitsnavne: "Ruten", "Fra casearkivet", "Andre ruter". "Se cases" åbner casetelefonen på forsiden (ny adresse femfemten.com/#cases).

**Ny tekst, skrevet af Claude, som skal godkendes (STIL.md):**

Faktalinjen øverst: "Det kan vi levere", "Forløbet", "Vi følger op på" (AI-implementering: "Efter lancering: Klare aftaler om drift og løbende tilpasning.").

AI-implementering, ruten:
- Afklar opgaven: "Vi starter med opgaven: hvem bruger løsningen, hvad skal den gøre, og hvilke data findes der allerede."
- Byg: "Vi bygger trin for trin og får data, værktøjer og integrationer på plads undervejs."
- Test med brugerne: "Løsningen afprøves med dem, der skal bruge den, før den kommer i drift. Det er dér, de fleste justeringer opstår."
- Afsnit: "Automatisering uden en ansvarlig er der, hvor tingene sander til. Derfor får hver løsning en ejer hos jer, og mennesker godkender, hvor det betyder noget." (første sætning er kanon fra STIL.md)

Operational Excellence, ruten:
- Forstå arbejdet: "Vi kortlægger, hvordan opgaven løses i dag, sammen med dem, der løser den."
- Gentænk: "Arbejdsgange, der ikke virker, bliver tænkt forfra med AI fra begyndelsen. Roller og menneskelig kontrol bliver en del af designet."
- Implementér: "Den nye arbejdsgang sættes i drift med oplæring af dem, der skal bruge den."
- Afsnit: "Nogle arbejdsgange bliver bedre uden AI. Når det er tilfældet, siger vi det."

Commercial Excellence, ruten:
- Find potentialet: "Vi ser på marked, kunder, produkt og pris og finder, hvor der er mest at hente."
- Sæt ind: "Potentialet omsættes til en salgsindsats med prioriterede kunder og pris- og salgsinitiativer, som jeres folk kan arbejde med."
- Mål væksten: "Vi følger op på både omsætning og indtjening, så det er tydeligt, hvad indsatsen har flyttet."

OBS: "konkrete opgaver", "konkret salgsindsats" og "Et konkret sted at begynde" står i jeres eksisterende tekster. STIL.md nævner "konkret" som typisk pyntord, så overvej dem.

### Corporate-udgaven (ny, version 2)

`corporate.html` er corporate-udgaven i septemberstilen: lys baggrund, navy, orange og DM Sans. Den nås via "Show me corporate" i forsidens menu (på mobil står der "corporate"), i panelernes fod og på ydelsessiderne. Corporate har "Tilbage til løbeturen" øverst og i bunden. På mobil vises kun logo og "Tilbage til løbeturen" i menuen.

Version 1 havde løbeturens tekst med tre ord skiftet ud. Version 2 har sin egen stemme: beskrivende overskrifter i stedet for løbeturens slogans, og en opbygning, som en indkøber forventer.

Indhold i rækkefølge: Ydelser, Arbejdsform, Hvem vi er, Udvalgte opgaver (alle 7, som liste), Workshop og links til parathedstesten og AI-radaren.

**Før/efter (stemmebærende tekst, skal godkendes):**

| Sted | Før (løbeturens tekst) | Efter |
|---|---|---|
| Titel | 5:15 Consultancy \| Strategi, data og AI | 5:15 Consultancy \| Operational excellence, AI-implementering og commercial excellence |
| Overskrift | Fra ambition til drift. | Rådgivning i operational excellence, AI-implementering og commercial excellence |
| Manchet | Vi omsætter strategi, data og AI til noget, I kan bruge ... | Vi hjælper virksomheder med at forbedre arbejdsgange, bygge AI-løsninger til daglig drift og øge salg og indtjening. Samarbejdet begynder med en workshop på 2½ time. |
| Knap | Book en workshop | Om workshoppen |
| Ydelser, intro | Vi hjælper med at få processer, teknologi og kommercielle indsatser til at fungere i praksis ... | Tre områder, som ofte hænger sammen i praksis. Et forløb kan ligge inden for ét af dem eller gå på tværs. |
| OE, overskrift | Bedre workflows. AI fra start. | Operational Excellence. Arbejdsgange med AI som en del af designet. |
| OE, tekst | Vi analyserer status quo og gentænker opgaven ... | Vi kortlægger, hvordan opgaven løses i dag, sammen med dem, der løser den. Arbejdsgangen designes derefter om med AI fra begyndelsen, og roller og menneskelig kontrol indgår i designet. Vi står for oplæring og følger op, når den nye arbejdsgang er i drift. |
| AI, overskrift | Byg med AI. Få det til at virke. | AI-implementering. AI-løsninger til afgrænsede opgaver, bygget til daglig drift. |
| AI, tekst | AI skal blive til mere end pænere marketing, mere støj og endeløse PowerPoints ... | Vi bygger og implementerer løsningen sammen med jer. Det omfatter data, opsætning og integrationer til de systemer, I allerede bruger. Løsningen afprøves med brugerne, før den sættes i drift. |
| CE, overskrift | Mere salg. Bedre indtjening. | Commercial Excellence. Salg, kundeprioritering og pris. |
| CE, tekst | Vi hjælper jer med at vinde flere kunder ... | Vi finder, hvor der er mest at hente i marked, kunder, produkt og pris, og omsætter det til en salgsindsats. Erfaringen kommer fra vækst på både omsætning og indtjening i egne virksomheder og hos tidligere arbejdsgivere. |
| Forløb (de tre) | Forstå arbejdet → gentænk → ... | Kortlægning, nyt design, implementering og måling af gevinsten. / Afklaring af opgaven, udvikling, test med brugerne og overgang til drift. / Analyse af potentialet, prioriteret indsats og opfølgning på omsætning og indtjening. |
| Arbejdsform (ny) | | Afgrænset opgave: "Før vi går i gang, aftaler vi opgaven, leverancerne, ansvaret og opfølgningen. Vi følger opgaven fra første analyse til den er en del af hverdagen." En ansvarlig hos jer: kanon "Automatisering uden en ansvarlig ..." + "Hver løsning får en ejer i jeres organisation, og mennesker godkender, hvor det betyder noget." Data i Europa: radarens egen tekst. AI, hvor det giver mening: "Nogle arbejdsgange bliver bedre uden AI. Når det er tilfældet, siger vi det." |
| Om os | Vi kender planen. Og hverdagen. + erfaringsboks + to kort (samme erfaring to gange) | Hvem vi er: workshopsidens "Hvem er vi?" og erfaringsteksten samlet i to afsnit. "ikke demoer" er taget ud (inversion). |
| Cases, intro | Cases fra praksis. Et udvalg af opgaver ... | Udvalgte opgaver. Opgave 04 til 07 er anonymiserede kundeforløb. |
| Workshop | En klar retning. Et konkret første skridt. Tag jeres vigtigste udfordring med. ... | Workshop. Workshoppen er indgangen til et samarbejde. Vi gennemgår jeres vigtigste udfordring ... Bagefter ved I, hvor I begynder. |
| Første skridt | Send et par linjer om jeres situation. | Det begynder med en kort mail om jeres situation. (imperativ fjernet) |
| Værktøjer | Vil du orientere dig først? | Til forberedelse: Parathedstest, 5 min. · AI-radar |

Uændret: casenes tekst, leverancerne, workshopfakta og "Det får I med hjem".

Mangler: navne, roller og jakkesætsfotos under "Hvem vi er". Jeg har ikke opfundet nogen.

Google: corporate har `noindex` og står ikke i sitemappet, så Google viser løbeturen. Corporate er kun til dem, der trykker på knappen.

De gamle sider hører nu til corporate: workshop, cases, radar og test. Logoet fører til corporate.html, og der er et link "Tilbage til løbeturen". De vises altid lyst, ligesom corporate. Cases, radar og test har fået `noindex` og er taget ud af sitemappet sammen med workshop. Search Console siden maj: radar og test 0 visninger, cases 20 visninger og 1 klik.

OBS: radar.html, test.html og cases.html har indholdet fra september. Casene der er de fem gamle, ikke de syv nye. Corporate-siden selv har de syv nye. "Tilbage til løbeturen" bliver ikke oversat, når man trykker EN på de gamle sider.

**Ny tekst, skrevet af Claude, som skal godkendes (STIL.md):**
- Overlinje: "Strategi · Data · AI"
- Manchet: "Vi omsætter strategi, data og AI til noget, I kan bruge: bedre processer, AI i praksis og en stærkere kommerciel indsats." (sat sammen af to af jeres sætninger)
- "Book en workshop", "eller ring på +45 21 60 09 84"
- Under Cases: "Et udvalg af opgaver, vi har arbejdet med. Forløbene fra 04 til 07 er anonymiserede."
- Workshopfakta: "Skriftlig opsamling: sendes efter workshoppen"
- Knapper: "Show me corporate" og "Tilbage til løbeturen"

Fotos (løbetøj og briller på løbeturen, jakkesæt på corporate) mangler og sættes ind, når I har dem.

### Tankestreger (STIL.md forbyder dem)

19 fjernet i forsiden, app.js og v2.js. Eksempler: "kapacitet — med afsæt" blev "kapacitet, med afsæt", "modspil — og finder" blev "modspil og finder", "2–3 prioriterede" blev "2 til 3 prioriterede", "aftales sammen — ingen automatisk booking" blev "aftales sammen. Ingen automatisk booking". De fire meta-titler "5:15 Consultancy — Tempo til at tænke" blev "5:15 Consultancy: Tempo til at tænke".

### Workshopsiden

Har `noindex` og beholder det. Den er i den gamle stil, og i løbeturen er første etape et panel. Siden er ikke ændret.

### Sitemap

De tre ydelsessider er tilføjet. Test, radar, cases og workshop er taget ud. Tilbage står forsiden, privatliv og de tre ydelsessider.

## Ikke ændret

Løbeoplevelsen, cases.html, radar.html, test.html, workshop.html og privatliv.html. Indholdet på de gamle sider er ikke ændret, kun navigation, lys visning og noindex (se Corporate).
