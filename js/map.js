'use strict';

var arrayOfAds = window.data.arrayOfAds;

// Генерирую и отрисовываю html-фрагмент на основе массива объявлений
window.pin.generateAndShowPinsOfAds(arrayOfAds);

// Отрисовываю конкретное объявление в детальном виде
window.card.showAdInDetailView(arrayOfAds, 0);

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

