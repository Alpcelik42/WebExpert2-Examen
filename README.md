# KookKompas

KookKompas is een mobiele receptenapp gemaakt met React Native en Expo. Met de app kan een gebruiker recepten zoeken, receptdetails bekijken, favorieten bewaren, een willekeurig recept laten voorstellen en een eenvoudige weekplanning maken. De recepten, afbeeldingen, ingrediënten en bereidingswijze worden opgehaald via de publieke REST API van TheMealDB.

De app bevat authenticatie met registreren, inloggen en uitloggen. Favorieten, weekplanning, locatie en gecachte recepten worden lokaal opgeslagen. Daarnaast gebruikt de app native functies zoals locatie ophalen en recepten delen via het share-menu van het toestel.

## Installatie

Installeer eerst de dependencies:

```bash
npm install
```

Start de app:

```bash
npx expo start
```

Start op web:

```bash
npm run web
```

Start op Android:

```bash
npm run android
```

Voer de tests uit:

```bash
npm test
```

## Architectuur

De app gebruikt Expo Router, gebaseerd op React Navigation. Er is gebruikgemaakt van stack navigation voor de algemene structuur en receptdetailpagina, tab navigation voor Ontdekken, Zoeken en Inspiratie, en drawer navigation voor Favorieten, Weekplanning en Profiel.

De belangrijkste mappen zijn:

```txt
app/          schermen en routes
components/   herbruikbare componenten
context/      globale state zoals auth en favorieten
services/     API- en storage-logica
utils/        validatie en hulpfuncties
__tests__/    automatische tests
```

## API

De app gebruikt TheMealDB API.

Gebruikte endpoints:

```txt
/search.php?s=...
/lookup.php?i=...
/random.php
```

Deze endpoints worden gebruikt om recepten te zoeken, receptdetails op te halen en een willekeurig recept te tonen.

## Geïmplementeerde functies

* Registreren, inloggen en uitloggen
* Recepten zoeken
* Receptdetails tonen
* Favorieten bewaren
* Random recept ophalen
* Weekplanning maken
* Locatie ophalen
* Recept delen
* App icon en splash screen
* Formuliervalidatie
* Laadstatussen en foutmeldingen
* Caching en offline basiswerking

## Testing

De app bevat Jest-tests voor validatie, favorietenlogica, storage keys, API-calls, caching, offline fallback en UI-componenten.

Laatste resultaat:

```txt
Test Suites: 5 passed, 5 total
Tests: 35 passed, 35 total
Coverage: meer dan 70%
```

## Bekende beperkingen

De authenticatie is lokaal en gebruikt geen online backend. De recepten zijn afhankelijk van TheMealDB, waardoor sommige gegevens Engelstalig kunnen zijn. In Expo Go wordt het echte app-icoon niet altijd hetzelfde getoond als in een standalone build.

## Toekomstige verbeteringen

Mogelijke uitbreidingen zijn een echte backend, boodschappenlijst, dieetfilters, pushnotificaties voor de weekplanning en meer persoonlijke receptsuggesties.
