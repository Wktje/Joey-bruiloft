# Joel · bruiloftsfilm — volledig project

Overdracht van 26 september 2026. Pak de hele ZIP uit en open **START.html**.

## Meteen aan de slag

- **outputs/Joel-telefoonformat.html**: het actuele, bewerkbare format. Open dit in een browser; hiervoor is geen installatie nodig.
- **outputs/Joel-film-met-maaike-chat.mp4**: de nieuwste video, circa 1 minuut 36 seconden. Deze speelt automatisch af, inclusief geluid.
- **outputs/Joel-project-met-foto.json**: de actuele teksten, foto's en instellingen; te openen via **Laad project** in het format.
- **outputs/START-HIER.md**: uitgebreide uitleg over bediening, timing en aanpassingen.

De huidige scène bevat de documentaire-intro, wekker en snoozes, Geerts chat, Joels getypte antwoorden, de ziekenhuisfoto en de overgang naar ‘maaike mn liefste’. Haar eerdere bericht staat al in de chat. Daarna volgen haar bericht over herstellen voor de bruiloft en Joels antwoord over weer mogen drinken.

Er zijn vijf bewerkbare scènes. Alleen scène 1 is nu uitgewerkt; de andere scènes zijn invulbaar. De uiteindelijke anekdotes, voice-overs en slotmontage zijn nog niet samengevoegd tot een complete bruiloftsfilm.

## Zelf aanpassen en bewaren

Open het HTML-bestand, kies een scène en wijzig rechts teksten, foto's, achtergrond en tempo. Met **Speel vanaf begin** bekijk je het resultaat. De knoppen onder het voorbeeld springen naar specifieke fragmenten.

Klik vóór het sluiten op **Download mijn bewerkbare format**. Dat bewaart één zelfstandig HTML-bestand met je wijzigingen, foto's en geluid. **Bewaar project** bewaart dezelfde invulling als JSON. Er wordt niet automatisch opgeslagen. Een bestaande MP4 verandert niet mee: maak na wijzigingen een nieuwe export met onderstaande scripts.

## Zelf een nieuwe MP4 maken

Benodigd: **Node.js 20 of nieuwer**, **Python 3** en **FFmpeg**. Deze programma's moeten vanuit de terminal bereikbaar zijn als `node`, `python3` (Windows: `python`) en `ffmpeg`.

Open een terminal in deze projectmap. Eenmalige installatie:

```sh
npm install
npm run setup-browser
```

Controleer het format en maak vervolgens een video:

```sh
npm run check
npm run export
```

De export komt in **outputs/Joel-nieuwe-export.mp4**: 1920 × 1080, 25 beelden per seconde, H.264 met AAC-geluid. De telefoon staat met zwarte randen in het brede beeld. Renderen kan enkele minuten duren.

Gebruik je eigen bewaarde projectbestand:

```sh
npm run export -- --project "outputs/mijn-project.json" --scene 1 --output "outputs/mijn-film.mp4"
```

Of exporteer rechtstreeks uit een zelf bewaard HTML-bestand:

```sh
npm run export -- --html "outputs/mijn-bewerkbare-format.html" --scene 1 --output "outputs/mijn-film.mp4"
```

Kies met `--scene` een nummer van 1 t/m 5. Iedere export maakt één scène. Voeg de scènes en overige filmpjes daarna samen in je montageprogramma. Een bestaand bestand wordt alleen vervangen als je `--overwrite` toevoegt.

De scripts gebruiken geen vaste paden naar de computer van de maker. Eventueel kun je via omgevingsvariabelen `FFMPEG_PATH`, `PYTHON_PATH` en `CHROMIUM_PATH` een eigen programma aanwijzen. Tijdelijke beelden en geluid staan in **work-export/**; die map mag na de export weg.

Het format heeft zelf geen ingebouwde MP4-renderer. De downloadknop in het format verwijst naar de reeds gemaakte video die ernaast staat. Gebruik de nieuwe export uit bovenstaande opdracht wanneer je wijzigingen hebt gemaakt.

## Wat zit waar?

- **outputs/**: alle eerdere resultaten, voorbeeldbeelden, projectbestanden, foto's en geluid. De actuele bestanden staan bovenaan deze handleiding vermeld; andere MP4's zijn oudere versies.
- **scripts/export.cjs**: de overdraagbare videorenderer.
- **scripts/make_audio.py**: maakt bijpassend wekker-, meldings- en typegeluid.
- **archief/werkbestanden/**: de oorspronkelijke ontwikkelscripts, tussenbestanden en controles. Sommige oude scripts bevatten computergebonden paden en testbestanden bevatten proefteksten. Gebruik voor verder werken het actuele HTML-bestand en de scripts in **scripts/**.
- **SHA256SUMS.txt**: controlegetallen van alle bestanden in dit pakket.

De oorspronkelijke ZIP is weggelaten om dubbele pakketten te voorkomen. De bestanden die daarin zaten zijn afzonderlijk aanwezig.

## Samenwerken via GitHub

De privérepository staat op https://github.com/Wktje/Joey-bruiloft. Download de code als ZIP of clone de repository om verder te werken. De eigenaar kan anderen toegang geven via Settings → Collaborators. Foto’s en videobestanden zijn inbegrepen.

Na het clonen kun je direct START.html openen. Voor nieuwe MP4-exports volg je de installatie hierboven.

Bewaar wijzigingen aan de hoofdversie in **outputs/Joel-telefoonformat.html** en werk eventueel **outputs/Joel-project-met-foto.json** bij. Commit beide wanneer je de invulling wijzigt. De geïnstalleerde pakketten en tijdelijke exportbestanden worden door `.gitignore` uitgesloten.
