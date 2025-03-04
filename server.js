// Importeer het npm package Express (uit de door npm aangemaakte node_modules map)
// Deze package is geïnstalleerd via `npm install`, en staat als 'dependency' in package.json
import express from 'express'

// Importeer de Liquid package (ook als dependency via npm geïnstalleerd)
import { Liquid } from 'liquidjs';


console.log('Hieronder moet je waarschijnlijk nog wat veranderen')
// Doe een fetch naar de data die je nodig hebt
// const apiResponse = await fetch('...')

// Lees van de response van die fetch het JSON object in, waar we iets mee kunnen doen
// const apiResponseJSON = await apiResponse.json()

// Controleer eventueel de data in je console
// (Let op: dit is _niet_ de console van je browser, maar van NodeJS, in je terminal)
// console.log(apiResponseJSON)


// Maak een nieuwe Express applicatie aan, waarin we de server configureren
const app = express()

// Gebruik de map 'public' voor statische bestanden (resources zoals CSS, JavaScript, afbeeldingen en fonts)
// Bestanden in deze map kunnen dus door de browser gebruikt worden
app.use(express.static('public'))

// Stel Liquid in als 'view engine'
const engine = new Liquid();
app.engine('liquid', engine.express());

// Stel de map met Liquid templates in
// Let op: de browser kan deze bestanden niet rechtstreeks laden (zoals voorheen met HTML bestanden)
app.set('views', './views');

// Maak een GET route voor de index (meestal doe je dit in de root, als /)
app.get('/', async function (request, response) {
  let stories = await fetch("https://fdnd-agency.directus.app/items/tm_story");
  let seasons = await fetch("https://fdnd-agency.directus.app/items/tm_season");
  let languages = await fetch("https://fdnd-agency.directus.app/items/tm_language");
  let animals = await fetch("https://fdnd-agency.directus.app/items/tm_animal");

  let storiesJSON = await stories.json();
  let seasonsJSON = await seasons.json();
  let languagesJSON = await languages.json();
  let animalsJSON = await animals.json();

  // Render index.liquid uit de Views map
  // Geef hier eventueel data aan mee
  response.render('index.liquid', {
    stories: storiesJSON.data,
    seasons: seasonsJSON.data,
    languages: languagesJSON.data,
    animas: animalsJSON.data
  })
})

app.get('/filter', async function (request, response) {
  let season = request.query.season;
  let language = request.query.language;
  let stories = "";

  if (season) {
    stories = await fetch("https://fdnd-agency.directus.app/items/tm_story/?filter[season][_eq]=" + season);
    console.log('season:');
    console.log(season);
  } else if (language) {
    stories = await fetch("https://fdnd-agency.directus.app/items/tm_story/?filter[language][_eq]=" + language);
    console.log('season:');
    console.log(season);
    console.log('language:');
    console.log(language);
  } else {
    console.log('neither were truthy');
    stories = await fetch("https://fdnd-agency.directus.app/items/tm_story");
  }

  // let stories = await fetch("https://fdnd-agency.directus.app/items/tm_story/?filter[season][_eq]=" + season + "&[language][_eq]=" + language);
  let seasons = await fetch("https://fdnd-agency.directus.app/items/tm_season");
  let languages = await fetch("https://fdnd-agency.directus.app/items/tm_language");
  let animals = await fetch("https://fdnd-agency.directus.app/items/tm_animal");

  let storiesJSON = await stories.json();
  let seasonsJSON = await seasons.json();
  let languagesJSON = await languages.json();
  let animalsJSON = await animals.json();

  console.log(storiesJSON);

  response.render('index.liquid', {
    stories: storiesJSON.data,
    seasons: seasonsJSON.data,
    languages: languagesJSON.data,
    animas: animalsJSON.data
  })
})

// Maak een POST route voor de index; hiermee kun je bijvoorbeeld formulieren afvangen
// Hier doen we nu nog niets mee, maar je kunt er mee spelen als je wilt
app.post('/', async function (request, response) {
  // Je zou hier data kunnen opslaan, of veranderen, of wat je maar wilt
  // Er is nog geen afhandeling van een POST, dus stuur de bezoeker terug naar /
  response.redirect(303, '/')
})

// Stel het poortnummer in waar Express op moet gaan luisteren
// Lokaal is dit poort 8000, als dit ergens gehost wordt, is het waarschijnlijk poort 80
app.set('port', process.env.PORT || 8000)

// Start Express op, haal daarbij het zojuist ingestelde poortnummer op
app.listen(app.get('port'), function () {
  // Toon een bericht in de console en geef het poortnummer door
  console.log(`Application started on http://localhost:${app.get('port')}`)
})
