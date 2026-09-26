# Joel — zelf aanpassen, versie 13

**Joel-film-met-maaike-chat.mp4** is de nieuwste video: ongeveer **1:36**, met de documentaire-intro, drie wekkers, appjes, Joels getypte antwoorden en de ziekenhuisfoto. Oudere MP4’s zijn eerdere versies.

Na de ziekenhuisfoto schuift de chat soepel naar **maaike mn liefste**. Haar eerdere “Joel… ben je al wakker?” staat er al. Daarna stuurt ze “Hopelijk ben op tijd hersteld voor je bruiloft” en typt Joel “Ja, ik hoop dat ik dan weer mag drinken.”

Onder **Daarna naar een andere chat** kun je deze vervolgchat uitzetten of de naam en beide nieuwe berichten wijzigen. Het eerdere bericht komt uit het eerste ontvangen appje van de scène. **Vervolgchat** onder de afspeelbalk springt direct naar dit fragment. De bewaarde HTML en JSON nemen de vervolgchat mee.

## Zelf aanpassen

1. Open **Joel-telefoonformat.html** in je browser. Alles werkt lokaal, zonder installatie.
2. Kies rechts een **scène** en vul datum, tijd en plaats in. Die gegevens worden per scène bewaard.
3. Onder **Tempo van deze scène** kun je iedere pauze en fotoduur aanpassen. **Vlot** zet de snelle instellingen terug; **Meer acteertijd** geeft de acteur extra tijd. De wekker kun je per scène aan- of uitzetten; standaard staat die alleen bij scène 1 aan.
4. Onder **Joel typt terug** kun je zijn drie antwoorden wijzigen. Lege vakken worden overgeslagen. Via **Foto vervangen** verander je de foto na zijn berichten. Verder naar beneden staan de ontvangen appjes en hun foto’s, de achtergrond en losse scènefoto’s.
5. Klik **Speel vanaf begin**. Met **Pauzeren**, de afspeelbalk en de knoppen **Eerste foto**, **Joel typt** en **Laatste foto** kun je direct een onderdeel bekijken.
6. Klik **Download mijn bewerkbare format** om één HTML-bestand met alle wijzigingen, foto’s en instellingen te bewaren. Open dat bestand later om verder te werken. Bewaar vóór je sluit of ververst: er wordt niet automatisch opgeslagen.

**Bewaar project** maakt een JSON-bestand met dezelfde inhoud en instellingen. Met **Laad project** zet je dit terug. Oudere projectbestanden worden ook ondersteund. Het meegeleverde **Joel-project-met-foto.json** bevat de huidige basisinvulling.

## Video delen

De MP4 speelt volledig automatisch af en is los te delen. Aanpassingen in het formulier veranderen direct het voorbeeld, maar niet een eerder gedownloade MP4. Gebruik de exportscripts uit dit overdrachtspakket om van jouw wijzigingen een nieuwe MP4 te maken; zie ../README.md. Het HTML-bestand heeft geen ingebouwde MP4-export.

Een los bewaard HTML-bestand kan zelfstandig afspelen en worden aangepast. De link naar de bestaande MP4 werkt als die MP4 in dezelfde map staat; de video zelf is niet in het HTML-bestand opgenomen.

## Nieuw tempo

| Onderdeel | Instelling |
|---|---|
| Documentaire-intro | 8 seconden |
| Elke wekker | 8 seconden acteertijd |
| Na iedere snooze | 3 seconden |
| Tussen ontvangen appjes | 3 seconden |
| Wachten tot de eerste foto opent | 2 seconden |
| Eerste foto bekijken | 5 seconden |
| Typen | gemiddeld 9 letters per seconde, met kleine variaties |
| Tussen Joels antwoorden | 1,2 seconden |
| Na het laatste antwoord tot zijn foto | 1,5 seconden |
| Ziekenhuisfoto bekijken | 6 seconden |

In de huidige MP4 snoozet de acteur op ongeveer **0:16**, **0:27** en **0:38**. De eerste foto opent rond **0:50**, Joel begint te typen rond **0:55** en zijn foto verschijnt rond **1:15**. De definitieve timing hangt af van de tekstlengtes en instellingen.

## Live gebruiken

Met **Speel scène-intro** toon je alleen de opening; daarna wacht de telefoon op de bediener. **Volgend appje** of de spatiebalk laat vervolgens de ontvangen berichten verschijnen. **Projecteren** toont alleen het beeld. Tijdens automatisch afspelen kun je met **S** of een klik op Sluimer eerder snoozen. De knoppen 1–5 kiezen een scène; R maakt het scherm leeg en T keert terug naar de telefoon.

De vijf scènes zijn een bewerkbaar format. De volledige bruiloftsfilm met alle anekdotes, voice-overs en slotmontage is nog niet gemonteerd. Alleen scène 1 bevat nu de uitgewerkte voorbeeldchat. Foto’s en het Radar-geluid zijn ingebouwd; eigen flashbackfilmpjes voeg je later in de montage toe.
