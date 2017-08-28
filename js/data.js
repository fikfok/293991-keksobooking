'use strict';

// Модуль, который создает данные
window.data = (function () {
  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;
  var BUNGALO_MIN_PRICE_PRE_NIGHT = 0;
  var FLAT_MIN_PRICE_PRE_NIGHT = 1000;
  var HOUSE_MIN_PRICE_PRE_NIGHT = 5000;
  var PALACE_MIN_PRICE_PRE_NIGHT = 10000;
  var RED_COLOR = 'rgb(255, 0, 0)';

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
   * Возвращение случайного элемента из переданного массива. Применяется перестановка Фишера
   * @param {Object} arrayOfElements - массив, из которого будет возвращён случайный элемент
   * @param {boolean} isUnique - признак: использовать перестановку Фишера или нет
   * @param {integer} startIndex - стартовый элемент массива, с которого будет осуществляться случайный выбор. Используется дл перестановки Фишера
   * @return {*}
   */
  var getAnyElement = function (arrayOfElements, isUnique, startIndex) {
    var elementPosition = getRandomNumber(arrayOfElements.length - 1, startIndex);
    var element = arrayOfElements[elementPosition];
    if (isUnique) {
      var tmp = arrayOfElements[startIndex];
      arrayOfElements[startIndex] = element;
      arrayOfElements[elementPosition] = tmp;
    }
    return element;
  };

  /**
   * Возвращает случайное число из диапазона
   * @param {integer} max - максимальная граница
   * @param {integer} min - минимальная граница
   * @return {number} - случайное число
   */
  var getRandomNumber = function (max, min) {
    return Math.round(Math.random() * (max - min) + min);
  };

  /**
  * Возвращает массив случаной длины, содержащий доп. опции
  * @param {Object} arrayOfElements - полный массив доп. опций
  * @return {Array}
  */
  var getFeaturesArray = function (arrayOfElements) {
    var array = [];
    var maxNumber = getRandomNumber(arrayOfElements.length, 1);
    for (var i = 0; i < maxNumber; i++) {
      array.push(getAnyElement(arrayOfElements, true, i));
    }
    return array;
  };

  /**
   * Возвращает кириллическое название типа помещения
   * @param {string} offerTypeEn - англоязычное названия типа помещения
   * @return {*}
   */
  var getRusLodgeType = function (offerTypeEn) {
    return flatTypes.rus[flatTypes.en.indexOf(offerTypeEn)];
  };

  /**
   * Возвращает объект-объявление
   * @param {integer} adNumber - порядковый номер создаваемого объявления. Этот номер используется при выборке Фишера
   * @return {{author: {avatar: *}, offer: {title: *, address: string, price: number, type: *, rooms: number, guests: number, checkin: *, checkout: *, features: Array}, location: {x: number, y: number}, description: string, photos: Array}}
   */
  var createAd = function (adNumber) {
    var locationX = getRandomNumber(900, 300);
    var locationY = getRandomNumber(500, 100);
    var roomsNumber = getRandomNumber(5, 1);

    return {
      author: {avatar: getAnyElement(userAvatarPaths, true, adNumber)},
      offer: {
        title: getAnyElement(offerTitles, true, adNumber),
        address: locationX + ', ' + locationY,
        price: getRandomNumber(1000000, 1000),
        type: getAnyElement(flatTypes.en),
        rooms: roomsNumber,
        guests: roomsNumber * getRandomNumber(3, 1),
        checkin: getAnyElement(checkInOutTimes, false, 0),
        checkout: getAnyElement(checkInOutTimes, false, 0),
        features: getFeaturesArray(additionalFeatures)
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
  var pinSize = {
    width: 56,
    height: 75
  };
  var userAvatarPaths = generateAvatarImgPath(adsNumber);
  var offerTitles = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
  var flatTypes = {
    en: ['flat', 'house', 'bungalo'],
    rus: ['Квартира', 'Дом', 'Бунгало']
  };
  var checkInOutTimes = ['12:00', '13:00', '14:00'];
  var additionalFeatures = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];

  // Генерация массива объявляений
  var arrayOfAds = createArrayOfAds(adsNumber);

  return {
    ESC_KEYCODE: ESC_KEYCODE,
    ENTER_KEYCODE: ENTER_KEYCODE,
    BUNGALO_MIN_PRICE_PRE_NIGHT: BUNGALO_MIN_PRICE_PRE_NIGHT,
    FLAT_MIN_PRICE_PRE_NIGHT: FLAT_MIN_PRICE_PRE_NIGHT,
    HOUSE_MIN_PRICE_PRE_NIGHT: HOUSE_MIN_PRICE_PRE_NIGHT,
    PALACE_MIN_PRICE_PRE_NIGHT: PALACE_MIN_PRICE_PRE_NIGHT,
    RED_COLOR: RED_COLOR,

    pinSize: pinSize,
    adsNumber: adsNumber,
    userAvatarPaths: userAvatarPaths,
    offerTitles: offerTitles,
    flatTypes: flatTypes,
    checkInOutTimes: checkInOutTimes,
    additionalFeatures: additionalFeatures,
    arrayOfAds: arrayOfAds,
    pinMap: document.querySelector('.tokyo__pin-map'),

    createAd: createAd,
    getRusLodgeType: getRusLodgeType
  };
})();
