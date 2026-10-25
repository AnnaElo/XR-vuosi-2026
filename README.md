# 📢 XR-vuosi 2026

Tiivis, selainpohjainen katsaus vuoden 2026 XR-kehitykseen: laitteisiin, alustoihin, sisältöihin, sääntelyyn sekä terveydenhuollon, puolustuksen ja teollisuuden käyttöön. Poiminnoissa huomioidaan erityisesti Euroopan alue.

🔗Linkki: [XR-vuosi 2026](https://annaelo.github.io/XR-vuosi-2026/)


## 📚 Aineisto ja rajaukset
- Aineisto on koottu julkisista XR-uutiskirjeistä ja uutislähteistä, mm. Immersive Wire, Auganix, Road to VR, VR.org, UC Today ja TechSpot.
- Ajankohdat ovat julkaisuajankohtia, eivät välttämättä tapahtuman tarkkoja päiviä.
- Hinnat ovat suuntaa-antavia. Osa eurohinnoista on muunnettu muista valuutoista tai pyöristetty, ja ne muuttuvat kampanjoiden mukana.
- Sivu ei päivity itsestään. Aineisto on tallennettu suoraan tiedostoon.


## 🔧 Tekninen toteutus
- Rakennettu hyödyntäen tekoälytyökalua (Claude Sonnet 5.5) 
- Yksi itsenäinen index.html: tyylit, data, JavaScript ja kuva ovat samassa tiedostossa.
- Ei ulkoisia kirjastoja eikä evästeitä. Ainoa ulkoinen palvelu on Google Fonts, josta fontit ladataan.
- Toimii mobiilissa sekä vaalealla ja tummalla teemalla. Oletuksena on vaalea teema, ja tumman voi valita yläpalkin säätimestä. Valinta muistetaan selaimessa.
- Sivulla on kolme osiota, joihin yläpalkin linkit vievät: keskeiset tapahtumat, XR-kehitys lukuina sekä standardit ja sääntely.
- Aineisto on JSON-muodossa tiedoston lopussa (<script id="xr-data">). Rivin voi lisätä tai korjata suoraan siihen.


## 🎨 Visuaalinen ilme (Napapiiri)
Ilme valittiin kolmesta vaihtoehdosta (Napapiiri, Revontuli ja Polaarikartta). Teemoina olivat avoimuus, metaversumi, virtuaalimaailma ja Suomen arktisuus. Napapiiri on ilmava ja helppolukuinen, ja se sopii datavetoiselle sivulle.

- **Värit** on poimittu sivun hero-kuvasta. Vaalean teeman pohja on hangen sävy (`#f2f6fb`), teksti kaamoksen sininen (`#05103b`) ja korostus koboltti (`#103f96`). Tumma teema käyttää pohjana kaamoksen sinistä (`#06112d`) ja korostuksena vaaleaa kobolttia (`#8fb0f2`).
- **Aihevärit** ovat värisokeille sopivaa Okabe–Ito-palettia, ja ne ovat samat molemmissa teemoissa (tummassa hieman vaaleampina). Aiheen pallo on täytetty, kun aihe on valittuna, ja rengas, kun se on rajattu pois.
- **Fontit:** Schibsted Grotesk otsikoissa ja leipätekstissä, IBM Plex Mono päivämäärissä ja lähdetägeissä. Jos fontit eivät lataudu, sivu käyttää järjestelmäfontteja.
- **Hero-kuva** on jäänsinisen pyöreän "keskiyön auringon" sisällä.
- **Muodot:** 8 px pyöristys korteissa, pillerinmuotoiset painikkeet ja ohuet viivat, ei koristeellisia varjoja.
- **Saavutettavuus:** pienin fonttikoko on 12 px, myös kaavioissa. Tekstin ja taustan kontrasti täyttää WCAG AA -tason (vähintään 4,5:1) molemmissa teemoissa, ja näppäimistöfokus näkyy selvästi.
- Värit ja fontit on määritelty CSS-muuttujina index.html:n alussa (`:root` ja `[data-scheme="dark"]`), joten niitä voi muuttaa yhdestä kohdasta.

## ✏️ Aineiston päivittäminen
Jokainen tapahtuma on yksi rivi `events`-listassa:

```json
{"id": "e46", "date": "2026-10-14", "theme": "laitteet", "europe": false, "title": "Otsikko", "detail": "Lisätieto.", "src": "s33"}
```

| Kenttä | Selitys |
|---|---|
| `id` | Yksilöllinen tunniste, esim. `e46`. |
| `date` | `"2026-10-14"`, jos päivä on tiedossa, tai `"2026-10"`, jos vain kuukausi on tiedossa. |
| `end` | Valinnainen loppupäivä monipäiväiselle tapahtumalle, esim. `"2026-10-15"`. |
| `theme` | `laitteet`, `alustat`, `sisalto`, `saantely` tai `ala`. |
| `europe` | `true`, jos tapahtumalla on Eurooppa-yhteys. |
| `title`, `detail` | Otsikko ja lisätieto. |
| `src` | Lähteen tunniste `sources`-listasta (esim. `"s14"`) tai useampi listana (`["s35", "s36"]`). Lisää uusi lähde ensin sinne: `{"id": "s37", "name": "…", "url": "https://…"}`. Lähde näkyy Lisätieto-tekstin lopussa linkkinä ("Lähde", useammalla "Lähde 1", "Lähde 2"). |

Sivu laskee itse neljänneksen (Q1–Q4), aikajanan päivämäärän, aiheen nimen ja tapahtumien järjestyksen. Rivejä ei siis tarvitse pitää aikajärjestyksessä. Aikajana ja otsikko jatkuvat automaattisesti uusiin kuukausiin.

- `updated`: päivityspäivä (`"2026-10-16"`), näkyy sivun alalaidassa. Tätä ei tarvitse muuttaa käsin: GitHub Actions -työnkulku (`.github/workflows/paivitysaika.yml`) asettaa sen automaattisesti sen päivän mukaan, jolloin index.html:ää viimeksi muutettiin, ja tallentaa muutoksen omana committinaan.
- `prices`: hintalistan mallit (`group` `ar` tai `vr`, `eur`, valinnaiset `from` = "alk.", `approx` = "noin", `note` ja `eu: true` eurooppalaiselle valmistajalle, sekä `src`). Eurooppalaiset mallit näkyvät omana ryhmänään.
- `figures`: kaavioiden luvut.
- `standards` ja `eu`: Standardit ja sääntely -osion kortit (`id`, `name`, `org`, `status`, `detail`, `src`). Näiden lähteillä on tunnisteet `x01`, `x02` … samassa `sources`-listassa.
- `dates`: EU-säädösten määräpäivät (`date`, `title`, `src`). Sivu järjestää ne ja merkitsee ne avauspäivän mukaan joko "Voimassa" tai "Tulossa".
- `reading`: taustalukemisto (`name`, `url`).

Jos rivillä on virheellinen päivämäärä, aihe tai lähde, sivu jättää rivin pois ja kertoo siitä selaimen konsolissa.
