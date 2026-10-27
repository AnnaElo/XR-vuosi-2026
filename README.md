# 📢 XR-vuosi 2026

**Suomeksi · [In English](README.en.md)**

<p align="center">
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="kuvat/finverse-logot-valkoinen.png">
  <img src="kuvat/finverse-logot.png" alt="Euroopan unionin osarahoittama. Hankkeen toteuttajat: Innokaupungit (Oulu ja Espoo), Oulun yliopisto, Oulun ammattikorkeakoulu ja Pirkanmaan liitto." width="480">
</picture>
</p>

Tämä projekti on toteutettu osana [FINverse-hanketta](https://www.businessoulu.com/tietoa-meista/ohjelmat-ja-hankkeet/kansallinen-metaversumi-verkosto-finverse/), joka on kansallinen metaversumi- ja virtuaaliympäristöjen kehittämishanke, jossa tutkitaan ja pilotoidaan uusia digitaalisia ratkaisuja kaupunkien tarpeisiin. Hanke on EU:n osarahoittama ja sitä rahoittaa Pirkanmaan liitto.

&nbsp;

Sivusto on tiivis sekä selainpohjainen katsaus vuoden 2026 XR-kehitykseen: laitteisiin, alustoihin, sisältöihin, sääntelyyn sekä eri sovellusalojen (terveydenhuollon, puolustuksen ja teollisuuden) käyttöön. Poiminnoissa huomioidaan erityisesti Euroopan alue, joiden vaikutus heijastuu Suomeen. 

🔗Linkki: [XR-vuosi 2026](https://annaelo.github.io/XR-vuosi-2026/)

[![Sisältö: CC BY 4.0](https://img.shields.io/badge/sis%C3%A4lt%C3%B6-CC%20BY%204.0-lightgrey.svg)](LICENSE-CONTENT) [![Koodi: MIT](https://img.shields.io/badge/koodi-MIT-blue.svg)](LICENSE)

&nbsp;

## 📚 Aineisto ja rajaukset

Aineisto on koottu julkisista lähteistä. Tarkat lähteet ovat sivulla jokaisen tiedon kohdalla. Aineisto päivitetään tällä hetkellä manuaalisesti, mutta lähitulevaisuudessa pyritään tarkastelemaan automatisaation mahdollisuuksia. 

| Osio | Aineisto ja lähteet |
|---|---|
| **XR-uutiset** | **XR-uutiskirjeet:** Immersive Wire, Auganix, VR.org, UC Today<br>**Muut lähteet:** Road to VR, TechSpot, heise online, Meta Connect 2026, ESA XR |
| **XR-kehitys lukuina** | **Meta Reality Labs:** Immersive Wire<br>**Laitetoimitukset:** VR.org (Counterpoint Research, Q2 2026)<br>**Lasien hinnat:** Road to VR, TechSpot, Netzwelt, Born City, Hifi.de, Instalki, IEEE Spectrum, Mixed |
| **Standardit ja sääntely** | **Kehittävät järjestöt:**<br>• Khronos Group (OpenXR, glTF 2.0)<br>• Alliance for OpenUSD, Linux Foundation (OpenUSD)<br>• W3C (WebXR Device API)<br>• Metaverse Standards Forum<br>• ISO/IEC JTC 1/SC 24<br>**EU:n linjaukset ja säädökset:**<br>• Web 4.0 ja virtuaalimaailmat -aloite, COM(2023) 442<br>• Euroopan parlamentin päätöslauselma virtuaalimaailmoista (2024)<br>• Tietosuoja-asetus (GDPR), asetus (EU) 2016/679<br>• Tekoälysäädös (AI Act), asetus (EU) 2024/1689<br>• Digipalvelusäädös (DSA), asetus (EU) 2022/2065<br>• Datasäädös (Data Act), asetus (EU) 2023/2854<br>• Kyberresilienssisäädös (CRA), asetus (EU) 2024/2847 |

**Rajaukset**

- Ajankohdat ovat julkaisuajankohtia, eivät välttämättä tapahtuman tarkkoja päiviä.
- Hinnat ovat suuntaa-antavia. Osa eurohinnoista on muunnettu muista valuutoista tai pyöristetty, ja ne muuttuvat kampanjoiden mukana.
- Sivu ei päivity itsestään. Aineisto on tallennettu suoraan tiedostoon.

&nbsp;

## 🔧 Tekninen toteutus

- Rakennettu hyödyntäen tekoälytyökalua (Claude Sonnet 5.5) 
- Yksi itsenäinen index.html: tyylit, data, JavaScript ja kuva ovat samassa tiedostossa.
- Ei ulkoisia kirjastoja eikä evästeitä. Ainoa ulkoinen palvelu on Google Fonts, josta fontit ladataan.
- Toimii mobiilissa sekä vaalealla ja tummalla teemalla. Oletuksena on vaalea teema, ja tumman voi valita yläpalkin säätimestä. Valinta muistetaan selaimessa.
- Sivu on suomeksi ja englanniksi. Kielen voi vaihtaa yläpalkin painikkeesta (In English / Suomeksi), ja valinta muistetaan selaimessa. Englanninkielisen version voi jakaa suoralla linkillä: `https://annaelo.github.io/XR-vuosi-2026/?lang=en`.
- Sivulla on kolme osiota, joihin yläpalkin linkit vievät: XR-uutiset, XR-kehitys lukuina sekä standardit ja sääntely.
- Aineisto on JSON-muodossa tiedoston lopussa (<script id="xr-data">). Rivin voi lisätä tai korjata suoraan siihen.

&nbsp;

## 🎨 Visuaalinen ilme

Sivun ilme rakennettiin Clauden avulla, jossa keskeisinä teemoina olivat avoimuus, metaversumi, virtuaalimaailma ja Suomen arktisuus. Teemaksi valikoitui "Napapiiri", joka on ilmava ja helppolukuinen, ja se sopii datavetoiselle sivulle.

- **Värit** on poimittu sivun XR-hahmokuvan väripaletista. Vaalean teeman pohja on hangen sävy (`#f2f6fb`), teksti kaamoksen sininen (`#05103b`) ja korostus koboltti (`#103f96`). Tumma teema käyttää pohjana kaamoksen sinistä (`#06112d`) ja korostuksena vaaleaa kobolttia (`#8fb0f2`).
- **Aihevärit** ovat värisokeille sopivaa Okabe–Ito-palettia, ja ne ovat samat molemmissa teemoissa (tummassa hieman vaaleampina). Aiheen pallo on täytetty, kun aihe on valittuna, ja rengas, kun se on rajattu pois.
- **Fontit:** Schibsted Grotesk otsikoissa ja leipätekstissä, IBM Plex Mono päivämäärissä ja lähdetägeissä. Jos fontit eivät lataudu, sivu käyttää järjestelmäfontteja.
- **XR-hahmokuva** on jäänsinisen pyöreän "keskiyön auringon" sisällä.
- **Muodot:** 8 px pyöristys korteissa, pillerinmuotoiset painikkeet ja ohuet viivat, ei koristeellisia varjoja.
- **Saavutettavuus:** pienin fonttikoko on 12 px, myös kaavioissa. Tekstin ja taustan kontrasti täyttää WCAG AA -tason (vähintään 4,5:1) molemmissa teemoissa, ja näppäimistöfokus näkyy selvästi.
- **Huomioitavaa:** Värit ja fontit on määritelty CSS-muuttujina index.html:n alussa (`:root` ja `[data-scheme="dark"]`), joten niitä voi muuttaa yhdestä kohdasta.

&nbsp;

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

Muut aineistolistat:

| Lista | Sisältö | Kentät ja huomiot |
|---|---|---|
| `updated` | Päivityspäivä (`"2026-10-16"`), näkyy sivun alalaidassa. | Ei tarvitse muuttaa käsin. GitHub Actions -työnkulku (`.github/workflows/paivitysaika.yml`) asettaa sen sen päivän mukaan, jolloin index.html:ää viimeksi muutettiin, ja tallentaa muutoksen omana committinaan. |
| `prices` | Hintalistan mallit. | `group` (`ar` tai `vr`), `eur`, `src` sekä valinnaiset `from` = "alk.", `approx` = "noin", `note` ja `eu: true` eurooppalaiselle valmistajalle. Eurooppalaiset mallit näkyvät omana ryhmänään. |
| `figures` | Kaavioiden luvut. | |
| `standards` | Standardikortit. | `id`, `org_key`, `cat`, `name`, `org`, `status`, `detail`, `src`.<br>`org_key` määrää kortin järjestövärin: `khronos`, `w3c`, `ogc`, `aousd`, `oidf`, `msf` tai `iso`. Värit ovat CSS-muuttujina (`--o-khronos` jne.).<br>`cat` on aihe: `xr` (XR-rajapinnat ja suunnittelu), `3d`, `geo` (paikkatieto), `id` (identiteetti) tai `org` (järjestöt). |
| `eu` | EU-linjaukset ja -säädökset. | `id`, `name`, `org`, `status`, `detail`, `src` sekä valinnaiset `applies` = "Koskee, kun" ja `fi` = "Suomessa". |
| `watch` | Kehitteillä-lista. | `name`, `status`, `src`. |
| `dates` | EU-säädösten määräpäivät. | `date`, `title`, `src`. Sivu järjestää ne ja merkitsee ne avauspäivän mukaan joko "Voimassa" tai "Tulossa". |
| `reading` | Taustalukemisto. | `name` ja valinnainen `url`. |
| `sources` | Kaikki lähteet. | `id`, `name` ja valinnainen `url` (ilman sitä lähde näkyy ilman linkkiä). XR-uutisten lähteillä on tunnisteet `s01`, `s02` … ja Standardit ja sääntely -osion lähteillä `x01`, `x02` …. Standardien ja sääntelyn lähteinä käytetään ensisijaisesti järjestöjen omia sivustoja (esim. Khronos, W3C, OGC, EUR-Lex, Euroopan komissio). |

**Englanninkieliset tekstit:** aineiston tekstikentälle voi lisätä englanninkielisen version samaan riviin lisäämällä kentän nimen perään `_en`, esim. `"title_en"`, `"detail_en"`, `"name_en"`, `"status_en"`, `"org_en"`, `"applies_en"`, `"fi_en"` tai hintojen `"note_en"`. Jos `_en`-kenttä puuttuu, englanninkielinen sivu näyttää suomenkielisen tekstin. Sivun kiinteät tekstit ovat index.html:ssä pareittain (`data-l="fi"` ja `data-l="en"`).

Jos rivillä on virheellinen päivämäärä, aihe tai lähde, sivu jättää rivin pois ja kertoo siitä selaimen konsolissa.

&nbsp;

## ⚖️ Lisenssi

- **Sisältö** (tekstit, kuvaajat ja koottu aineisto): [CC BY 4.0](LICENSE-CONTENT). Aineistoa saa käyttää ja muokata, kunhan tekijä (Anna Eloranta) mainitaan.
- **Koodi** (HTML-rakenne, tyylit, skriptit ja työnkulut): [MIT](LICENSE).

Lisenssit koskevat vain tekijän omaa työtä. Sivulla mainittujen ja linkitettyjen lähteiden aineistot ovat niiden omien tekijöiden ja lisenssien alaisia.
