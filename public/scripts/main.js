playtimeSpans = document.querySelectorAll('.playtime p');

playtimeSpans.forEach(playtimeSpan => {
  let data = playtimeSpan.innerHTML;
  let minutes = data / 60;
  let seconds = data % 60;
  playtimeSpan.innerHTML = `${Math.floor(minutes)} min ${seconds} sec`;
});

languageSpans = document.querySelectorAll('.lang');

languageSpans.forEach(languageSpan => {

});