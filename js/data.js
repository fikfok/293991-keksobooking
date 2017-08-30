'use strict';

// Модуль, который создает данные
window.data = (function () {
  /**
   * Генерация массива путей к аватарам
   * @param {integer} numberOfElements - количество элементов в массиве
   * @return {Array}
   */
  var generateAvatarImgPath = function (numberOfElements) {
    var array = [];
    for (var i = 1; i <= numberOfElements; i++) {
      array.push('img/avatars/user' + (i < 10 ? '0' : '') + i + '.png');
    }
    return array;
  };


  /**
   * Возвращает объект-объявление
   * @param {integer} adNumber - порядковый номер создаваемого объявления. Этот номер используется при выборке Фишера
   * @return {{author: {avatar: *}, offer: {title: *, address: string, price: number, type: *, rooms: number, guests: number, checkin: *, checkout: *, features: Array}, location: {x: number, y: number}, description: string, photos: Array}}
   */
  var createAd = function (adNumber) {
    var locationX = window.utils.getRandomNumber(900, 300);
    var locationY = window.utils.getRandomNumber(500, 100);
    var roomsNumber = window.utils.getRandomNumber(5, 1);

    return {
      author: {avatar: window.utils.getAnyElement(userAvatarPaths, true, adNumber)},
      offer: {
        title: window.utils.getAnyElement(offerTitles, true, adNumber),
        address: locationX + ', ' + locationY,
        price: window.utils.getRandomNumber(1000000, 1000),
        type: window.utils.getAnyElement(flatTypes.en),
        rooms: roomsNumber,
        guests: roomsNumber * window.utils.getRandomNumber(3, 1),
        checkin: window.utils.getAnyElement(checkInOutTimes, false, 0),
        checkout: window.utils.getAnyElement(checkInOutTimes, false, 0),
        features: window.utils.getSubArray(additionalFeatures)
      },
      location: {x: locationX, y: locationY},
      description: '',
      photos: []
    };
  };

  /**
   *
   * @param {integer} elementsNumberInArray - количество элементов в создаваемом массиве
   * @return {Array} - массив сгенерированных элементов
   */
  var createArrayOfAds = function (elementsNumberInArray) {
    var someArray = [];
    for (var i = 0; i < elementsNumberInArray; i++) {
      someArray.push(createAd(i));
    }
    return someArray;
  };

  var adsNumber = 8;
  var offerTitles = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
  var flatTypes = {
    en: ['flat', 'house', 'bungalo'],
    rus: ['Квартира', 'Дом', 'Бунгало']
  };
  var checkInOutTimes = ['12:00', '13:00', '14:00'];
  var additionalFeatures = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];

  var userAvatarPaths = generateAvatarImgPath(adsNumber);

  // Генерация массива объявляений
  var arrayOfAds = createArrayOfAds(adsNumber);

  return {
    arrayOfAds: arrayOfAds
  };
})();
