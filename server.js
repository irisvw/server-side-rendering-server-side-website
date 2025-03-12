import express from 'express'
import { Liquid } from 'liquidjs';

const app = express()
app.use(express.static('public'))

const engine = new Liquid();
app.engine('liquid', engine.express());
app.set('views', './views');

const apiEndpoint = "https://fdnd-agency.directus.app/items"

// Default route
app.get('/', async function (request, response) {
  let stories = await fetch(`${apiEndpoint}/tm_story`);
  let seasons = await fetch(`${apiEndpoint}/tm_season`);
  let languages = await fetch(`${apiEndpoint}/tm_language`);
  let animals = await fetch(`${apiEndpoint}/tm_animal`);

  let storiesJSON = await stories.json();
  let seasonsJSON = await seasons.json();
  let languagesJSON = await languages.json();
  let animalsJSON = await animals.json();
  
  response.render('index.liquid', {
    stories: storiesJSON.data,
    seasons: seasonsJSON.data,
    languages: languagesJSON.data,
    animals: animalsJSON.data
  })
})

app.get('/test', async function (request, response) {
  let personResponse = await fetch("https://fdnd.directus.app/items/person/");
  let personResponseJSON = await personResponse.json();

  let e1 = await fetch("https://fdnd.directus.app/items/person/?sort=name");
  let e2 = await fetch("https://fdnd.directus.app/items/person/?fields=name&filter[name][_istarts_with]=d");
  let e3 = await fetch("https://fdnd.directus.app/items/person/?fields=name&filter[_or][0][name][_istarts_with]=d&filter[_or][1][name][_istarts_with]=k");
  let e4 = await fetch("https://fdnd.directus.app/items/person/?fields=name,birthdate&filter[birthdate][_neq]=null");
  let e5 = await fetch("https://fdnd.directus.app/items/person/?fields=name,birthdate&filter[year(birthdate)][_eq]=2002");
  let e6 = await fetch("https://fdnd.directus.app/items/person/?fields=fav_tag&filter[fav_tag][_neq]=null&groupBy[]=fav_tag&aggregate[count]=*&sort=-count");

  response.render('data-filters.liquid', {
    persons: personResponseJSON.data
  })
})

// Filter route
app.get('/filter', async function (request, response) {
  let season = request.query.season;
  let language = request.query.language;
  let stories = "";

  if (season) {
    stories = await fetch(`${apiEndpoint}/tm_story/?filter[season][_eq]=` + season);
  } else if (language) {
    stories = await fetch(`${apiEndpoint}/tm_story/?filter[language][_eq]=` + language);
  } else {
    stories = await fetch(`${apiEndpoint}/tm_story`);
  }

  let seasons = await fetch(`${apiEndpoint}/tm_season`);
  let languages = await fetch(`${apiEndpoint}/tm_language`);
  let animals = await fetch(`${apiEndpoint}/tm_animal`);

  let storiesJSON = await stories.json();
  let seasonsJSON = await seasons.json();
  let languagesJSON = await languages.json();
  let animalsJSON = await animals.json();

  response.render('index.liquid', {
    stories: storiesJSON.data,
    seasons: seasonsJSON.data,
    languages: languagesJSON.data,
    animals: animalsJSON.data
  })
})

// Sort route
app.get('/sort=:order', async function (request, response) {
  let order = request.params.order;
  let stories;

  switch (order) {
    case "alphabetical":
      stories = await fetch(`${apiEndpoint}/tm_story/?sort=title`);
      break;
    case "playtime":
      stories = await fetch(`${apiEndpoint}/tm_story/?sort=playtime`);
      break;
  }
  
  let seasons = await fetch(`${apiEndpoint}/tm_season`);
  let languages = await fetch(`${apiEndpoint}/tm_language`);
  let animals = await fetch(`${apiEndpoint}/tm_animal`);

  let storiesJSON = await stories.json();
  let seasonsJSON = await seasons.json();
  let languagesJSON = await languages.json();
  let animalsJSON = await animals.json();

  response.render('index.liquid', {
    stories: storiesJSON.data,
    seasons: seasonsJSON.data,
    languages: languagesJSON.data,
    animals: animalsJSON.data
  })
})

app.get('/search', async function (request, response) {
  let query = request.query.query;
  let stories = await fetch(`${apiEndpoint}/tm_story/?filter[title][_icontains]=${query}`);
  
  let seasons = await fetch(`${apiEndpoint}/tm_season`);
  let languages = await fetch(`${apiEndpoint}/tm_language`);
  let animals = await fetch(`${apiEndpoint}/tm_animal`);

  let storiesJSON = await stories.json();
  let seasonsJSON = await seasons.json();
  let languagesJSON = await languages.json();
  let animalsJSON = await animals.json();

  response.render('index.liquid', {
    stories: storiesJSON.data,
    seasons: seasonsJSON.data,
    languages: languagesJSON.data,
    animals: animalsJSON.data
  })
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(404).send('<img src="https://httpcats.com/404.jpg" width=500>')
})

app.post('/', async function (request, response) {
  response.redirect(303, '/')
})

app.set('port', process.env.PORT || 8000)

app.listen(app.get('port'), function () {
  console.log(`Application started on http://localhost:${app.get('port')}`)
})
