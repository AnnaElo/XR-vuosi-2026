# 📢 XR-vuosi 2026

Tiivis, selainpohjainen katsaus vuoden 2026 XR-kehitykseen: laitteisiin, alustoihin, sisältöihin, sääntelyyn sekä terveydenhuollon, puolustuksen ja teollisuuden käyttöön. Poiminnoissa huomioidaan erityisesti Euroopan alue.

🔗Linkki: [XR-vuosi 2026](https://annaelo.github.io/XR-vuosi-2026/)


## 📚 Aineisto ja rajaukset
- Aineisto on koottu julkisista XR-uutiskirjeistä ja uutislähteistä, mm. Immersive Wire, Auganix, Road to VR, VR.org, UC Today ja TechSpot.
- Ajankohdat ovat julkaisuajankohtia, eivät välttämättä tapahtuman tarkkoja päiviä.
- Hinnat ovat suuntaa-antavia. Osa eurohinnoista on muunnettu muista valuutoista tai pyöristetty, ja ne muuttuvat kampanjoiden mukana.
- Aineisto päivitetään käsin `data`-kansion JSON-tiedostoihin. Vain päivityspäivä asettuu automaattisesti.


## 🔧 Tekninen toteutus
- Rakennettu hyödyntäen tekoälytyökalua (Claude Sonnet 5.5) 
- Ei ulkoisia kirjastoja, palveluita eikä evästeitä.
- Toimii mobiilissa sekä vaalealla ja tummalla teemalla. Teema seuraa järjestelmän asetusta, ja sen voi vaihtaa yläpalkin säätimestä (valinta muistetaan selaimessa).
- Sivut lukevat aineistonsa JSON-tiedostoista, joten paikallisesti sivut avataan palvelimen kautta, esim. `python3 -m http.server` ja selaimella `http://localhost:8000`. Suoraan levyltä (file://) avattuna aineisto ei lataudu. GitHub Pagesissa tätä ei tarvita.

| Tiedosto | Sisältö |
|---|---|
| `index.html` | Etusivu: keskeiset tapahtumat aihekortteina, aikajanana ja taulukkona. Aiherajauksen voi antaa osoitteessa, esim. `index.html?aihe=saantely`. |
| `luvut.html` | XR-kehitys lukuina: Reality Labsin luvut, laitetoimitusten vuosimuutos ja lasien hinnat. |
| `standardit.html` | Standardit ja sääntely: avoimet standardit, EU:n linjaukset ja säädökset sekä määräpäivät. |
| `data/xr-data.json` | Tapahtumat, luvut, hinnat ja lähteet (etusivu ja luvut). |
| `data/standardit.json` | Standardit, EU-säädökset, määräpäivät ja niiden lähteet. |
| `assets/` | Yhteiset tyylit (`tyylit.css`), yhteinen koodi (`yhteinen.js`), kunkin sivun oma koodi ja kuva. |


## ✏️ Aineiston päivittäminen
Muutokset tehdään vain `data`-kansion JSON-tiedostoihin, HTML-tiedostoihin ei tarvitse koskea.

### Tapahtumat (`data/xr-data.json`)
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

- `updated`: päivityspäivä (`"2026-10-16"`), näkyy sivun alalaidassa. Tätä ei tarvitse muuttaa käsin: GitHub Actions -työnkulku (`.github/workflows/paivitysaika.yml`) asettaa sen automaattisesti sen päivän mukaan, jolloin kyseistä JSON-tiedostoa viimeksi muutettiin, ja tallentaa muutoksen omana committinaan.
- `prices`: hintalistan mallit (`group` `ar` tai `vr`, `eur`, valinnaiset `from` = "alk.", `approx` = "noin", `note` ja `eu: true` eurooppalaiselle valmistajalle, sekä `src`). Eurooppalaiset mallit näkyvät omana ryhmänään.
- `figures`: kaavioiden luvut.

Jos rivillä on virheellinen päivämäärä, aihe tai lähde, sivu jättää rivin pois ja kertoo siitä selaimen konsolissa.

### Standardit ja sääntely (`data/standardit.json`)
- `standards` ja `eu`: kortit (`id`, `name`, `org`, `status`, `detail`, `src`). `src` viittaa saman tiedoston `sources`-listaan (tunnisteet `x01`, `x02` …).
- `dates`: määräpäivät (`date`, `title`, `src`). Sivu järjestää ne ja merkitsee ne avauspäivän mukaan joko "Voimassa" tai "Tulossa".
- `reading`: taustalukemisto (`name`, `url`).
