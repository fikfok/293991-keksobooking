'use strict';

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// Функции
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
 * @return {*}
 */
var getAnyElementFisher = function (arrayOfElements) {
  var elementPosition = Math.round(Math.random() * ((arrayOfElements.values.length - 1) - arrayOfElements.counter) + arrayOfElements.counter);
  var element = arrayOfElements.values[elementPosition];
  arrayOfElements.values[elementPosition] = arrayOfElements.values.splice(arrayOfElements.counter, 1, arrayOfElements.values[elementPosition])[0];
  arrayOfElements.counter++;
  return element;
};

/**
 * Возвращает случайный элемент из переданного массива
 * @param {Object} arrayOfElements - массив
 * @return {*}
 */
var getAnyElement = function (arrayOfElements) {
  return arrayOfElements[Math.round(Math.random() * (arrayOfElements.length - 1))];
};

/**
 * Возвращает случайное число из диапазона
 * @param {integer} max - максимальная граница
 * @param {integer} min - минимальная граница
 * @return {number}
 */
var getRandomNumber = function (max, min) {
  return Math.round(Math.random() * (max - min) + min);
};
// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// Переменные
var pinSize = {
  width: 40,
  height: 40
};

function Ads() {
  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  // Локальные переменные и методы экземпляра обявления
  var userAvatarPaths = {
    values: generateAvatarImgPath(8),
    counter: 0
  };

  var offerTitles = {
    values: ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'],
    counter: 0
  };

  var flatTypes = {
    en: ['flat', 'house', 'bungalo'],
    rus: ['Квартира', 'Дом', 'Бунгало']
  };

  var checkInOutTimes = ['12:00', '13:00', '14:00'];

  var additionalFeatures = {
    values: ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'],
    counter: 0
  };

    /**
   * Возвращает массив случаной длины, содержащий доп. опции
   * @param {Object} arrayOfElements - полный массив доп. опций
   * @return {Array}
   */
  function getFeaturesArray(arrayOfElements) {
    var array = [];
    var maxNumber = getRandomNumber(arrayOfElements.values.length, 1);
    for (var i = 0; i < maxNumber; i++) {
      array.push(getAnyElementFisher(arrayOfElements));
    }
    return array;
  };
  // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  // Интерфейс объекта. Свойства
  this.author = {avatar: getAnyElementFisher(userAvatarPaths)};
  this.location = {x: getRandomNumber(900, 300), y: getRandomNumber(100, 500)};
  this.offer = {
    title: getAnyElementFisher(offerTitles),
    address: this.location.x + ', ' + this.location.y,
    price: getRandomNumber(1000000, 1000),
    type: getAnyElement(flatTypes.en),
    rooms: getRandomNumber(5, 1),
    checkin: getAnyElement(checkInOutTimes),
    checkout: getAnyElement(checkInOutTimes),
    features: getFeaturesArray(additionalFeatures)
  };
  this.offer.guests = this.offer.rooms * getRandomNumber(3, 1);
  this.description = '';
  this.photos = [];

  // Интерфейс объекта. Методы
  /**
   * Возвращает кириллическое название типа помещения
   * @param {string} offerTypeEn - англоязычное названия типа помещения
   * @return {*}
   */
  this.getRusLodgeType = function (offerTypeEn) {
    return flatTypes.rus[flatTypes.en.indexOf(offerTypeEn)];
  };
}
// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

var i = 0;
var arrayOfAds = [];
var fragment = document.createDocumentFragment();
var templateOffer = document.getElementById('lodge-template').content;

for (i = 0; i < 8; i++) {
  // Генерация массива объявляений
  arrayOfAds.push(new Ads());

  // Создание div-блока для нового флажка
  var newDiv = document.createElement('div');
  newDiv.className = 'pin';
  newDiv.setAttribute('style', 'left: ' + (arrayOfAds[i].location.x + pinSize.width / 2) + 'px; top: ' + (arrayOfAds[i].location.y + pinSize.height) + 'px');

  // Создание флажка в div-блоке
  var newImg = document.createElement('img');
  newImg.className = 'rounded';
  newImg.setAttribute('src', arrayOfAds[i].author.avatar);
  newImg.setAttribute('width', pinSize.width);
  newImg.setAttribute('height', pinSize.height);
  newDiv.appendChild(newImg);

  // Добавляю новый узел во фрагмент
  fragment.appendChild(newDiv);

  // Если данная итерация цикла первая, тогда вставить первое сгенерированное объявление в блок с id="offer-dialog" - детальное описание объявления
  if (i === 0) {
    // На основе шаблона генерирую новый узел
    var newElement = templateOffer.cloneNode(true);

    // Заполняю его данными из первого объявления
    newElement.querySelector('.lodge__title').textContent = arrayOfAds[i].offer.title;
    newElement.querySelector('.lodge__address').textContent = arrayOfAds[i].offer.address;
    newElement.querySelector('.lodge__price').innerHTML = arrayOfAds[i].offer.price + '&#x20bd;/ночь';
    newElement.querySelector('.lodge__type').textContent = arrayOfAds[i].getRusLodgeType(arrayOfAds[i].offer.type);
    newElement.querySelector('.lodge__rooms-and-guests').textContent = 'Для ' + arrayOfAds[i].offer.guests + ' гостей в ' + arrayOfAds[i].offer.rooms + ' комнатах';
    newElement.querySelector('.lodge__checkin-time').textContent = 'Заезд после ' + arrayOfAds[i].offer.checkin + ', выезд до ' + arrayOfAds[i].offer.checkout;
    newElement.querySelector('.lodge__description').textContent = arrayOfAds[i].description;

    // В цикле генерирую span-элементы обозначающие доп. опции жилища
    var featuresNumber = arrayOfAds[i].offer.features.length;
    for (var j = 0; j < featuresNumber; j++) {
      var newSpan = document.createElement('span');
      newSpan.className = 'feature__image feature__image--' + arrayOfAds[i].offer.features[j];
      newElement.querySelector('.lodge__features').appendChild(newSpan);
    }
    var oldDialogPanel = document.querySelector('.dialog__panel');
    oldDialogPanel.parentNode.replaceChild(newElement, oldDialogPanel);

    // Меняю аватар в блоке с детальным описанием объявления
    document.getElementById('offer-dialog').querySelector('.dialog__title').querySelector('img').setAttribute('src', arrayOfAds[i].author.avatar);
  }
}

var pinMap = document.querySelector('.tokyo__pin-map');
pinMap.appendChild(fragment)


