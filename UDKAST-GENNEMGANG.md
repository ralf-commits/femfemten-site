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

### Tankestreger (STIL.md forbyder dem)

19 fjernet i forsiden, app.js og v2.js. Eksempler: "kapacitet — med afsæt" blev "kapacitet, med afsæt", "modspil — og finder" blev "modspil og finder", "2–3 prioriterede" blev "2 til 3 prioriterede", "aftales sammen — ingen automatisk booking" blev "aftales sammen. Ingen automatisk booking". De fire meta-titler "5:15 Consultancy — Tempo til at tænke" blev "5:15 Consultancy: Tempo til at tænke".

### Workshopsiden

Har `noindex` og beholder det. Den er i den gamle stil, og i løbeturen er første etape et panel. Siden er ikke ændret.

### Sitemap

De tre ydelsessider er tilføjet.

## Ikke ændret

Løbeoplevelsen, cases.html, radar.html, test.html, workshop.html og privatliv.html. De gamle sider i septemberstilen er urørte, fordi de kan blive udgangspunkt for en corporate-udgave.
